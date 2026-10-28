(() => {
  const host = document.createElement('section');
  host.className = 'cnc-workspace';
  host.innerHTML = `<div class="cnc-modes" role="group" aria-label="Modo de fabrico"><button type="button" id="mode3d" aria-pressed="true">Impressão 3D</button><button type="button" id="modeCnc" aria-pressed="false">CNC</button></div>
  <div id="cncPanel" hidden><h2>Preparação CNC · corte de contornos</h2><p>Define as dimensões finais em mm. Z zero na superfície do material; origem XY no canto inferior esquerdo da área de trabalho ou no centro da área. A fresa passa pelo exterior da peça e pelo interior dos furos.</p>
  <form id="cncForm"><div class="cnc-fields"></div><button type="submit" class="btn primary">Calcular percurso</button> <button type="button" id="cncDownload" class="btn" disabled>Descarregar G-code</button></form>
  <label id="cncExportWarning" hidden><input id="cncAcceptChanges" type="checkbox"> Aceito exportar o percurso simulado, mesmo que a fresa elimine detalhes ou una contornos. Vou verificar o ficheiro no controlador antes de cortar.</label><p id="cncStatus" role="status">Configura a ferramenta e calcula a pré-visualização.</p>
  <div class="cnc-preview"><svg id="cncSvg" role="img" aria-label="Percurso CNC em milímetros"></svg></div>
  <label>Passagem <input id="cncPass" type="range" min="1" max="1" value="1"><output id="cncDepth"></output></label>
  <p>Azul: centro da ferramenta · cinzento: largura de corte · laranja tracejado: deslocação com Z seguro · ponto verde: início. A vista é superior; a passagem selecionada indica a profundidade.</p>
  <p>Confirma a fixação, a origem G54 e a altura livre acima dos grampos. Esta versão usa entrada vertical e não inclui pontes de fixação, rampas nem deteção de colisões. Faz uma simulação no controlador e um ensaio acima do material antes de cortar.</p></div>`;
  document.querySelector('.editor-card').prepend(host);
  const $ = id => document.getElementById(id);
  const fields = host.querySelector('.cnc-fields');
  const numbers = [ ['workWidth','Área de trabalho: largura (mm)',600,1,3000,.1],['workHeight','Área de trabalho: altura (mm)',400,1,3000,.1],['designX','Nome: posição X (mm)',10,0,3000,.1],['designY','Nome: posição Y (mm)',10,0,3000,.1], ['width','Largura do nome (mm)',200,1,3000,.1],['depth','Profundidade total (mm)',3,.01,100,.01],['passes','Número de passagens',3,1,100,1],['tool','Número da ferramenta',1,1,255,1],['diameter','Diâmetro da fresa (mm)',3,.1,100,.1],['feed','Avanço de corte (mm/min)',600,1,30000,1],['plunge','Avanço de descida (mm/min)',150,1,10000,1],['rpm','Rotação (RPM)',12000,1,60000,1],['safeZ','Altura segura Z (mm)',5,.1,100,.1] ];
  for (const [id,label,value,min,max,step] of numbers) fields.insertAdjacentHTML('beforeend',`<label>${label}<input name="${id}" type="number" value="${value}" min="${min}" max="${max}" step="${step}" required></label>`);
  const selects = [['controller','Controlador',[['grbl','GRBL · ferramenta manual'],['mach3','Mach3 · T / M6']]],['clockwise','Sentido do percurso',[['true','Horário'],['false','Anti-horário']]],['start','Começar pelo lado',[['left','Esquerdo'],['right','Direito'],['top','Superior'],['bottom','Inferior']]],['origin','Origem XY',[['corner','Canto inferior esquerdo'],['center','Centro']]]];
  for (const [id,label,options] of selects) fields.insertAdjacentHTML('beforeend',`<label>${label}<select name="${id}">${options.map(([v,t])=>`<option value="${v}">${t}</option>`).join('')}</select></label>`);
  let result = null, snapshot = '', revision = 0;
  const project = () => buildProject({showBaseLine:false});
  const fingerprint = () => JSON.stringify({project:project(), settings:settings(), shapes:window.CncDrawing?.polygons() || [], includeName:window.CncDrawing?.includeName() ?? true});
  function settings() { const data = Object.fromEntries(new FormData($('cncForm'))); for (const [id] of numbers) data[id] = Number(data[id]); data.clockwise = data.clockwise === 'true'; return data; }
  function invalidate() { window.MakerCncSimulator?.clear(); revision++; result=null; $('cncAcceptChanges').checked=false; $('cncExportWarning').hidden=true; $('cncDownload').disabled=true; $('cncSvg').replaceChildren(); $('cncDepth').textContent=''; $('cncStatus').textContent='Parâmetros ou desenho alterados. Calcula novamente o percurso.'; }
  $('cncForm').addEventListener('input',invalidate);
  host.addEventListener('cnc-drawing-change',invalidate);
  const observer = new MutationObserver(() => { if(result && fingerprint() !== snapshot) invalidate(); });
  const design = document.getElementById('designObject');
  if(design) observer.observe(design,{childList:true,subtree:true});
  for(const cnc of [false,true]) $(cnc?'modeCnc':'mode3d').onclick=()=>{ window.MakerCncSimulator?.pause(); document.querySelector('.editor-card').classList.toggle('cnc-active',cnc); $('cncPanel').hidden=!cnc; $('modeCnc').setAttribute('aria-pressed',String(cnc)); $('mode3d').setAttribute('aria-pressed',String(!cnc)); };
  const ns='http://www.w3.org/2000/svg';
  function element(tag,attrs) { const e=document.createElementNS(ns,tag); for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v); return e; }
  function draw() {
    const svg=$('cncSvg'); svg.replaceChildren();
    const all=result.paths.flat(), pad=result.diameter+3; if(result.workWidth>0)all.push({x:result.workX,y:result.workY},{x:result.workX+result.workWidth,y:result.workY+result.workHeight});
    const x=Math.min(...all.map(p=>p.x))-pad, y=Math.min(...all.map(p=>p.y))-pad;
    const w=Math.max(...all.map(p=>p.x))-x+pad, h=Math.max(...all.map(p=>p.y))-y+pad;
    svg.setAttribute('viewBox',`${x} ${-y-h} ${w} ${h}`);
    if(result.workWidth>0)svg.append(element('rect',{x:result.workX,y:-result.workY-result.workHeight,width:result.workWidth,height:result.workHeight,fill:'#f8fafc',stroke:'#64748b','stroke-width':.5}));
    const points=p=>p.map(v=>`${v.x},${-v.y}`).join(' ');
    for(const p of result.outline)svg.append(element('polygon',{points:points(p),fill:'none',stroke:'#64748b','stroke-width':.25}));
    let previous=null;
    for(const p of result.paths){
      if(previous)svg.append(element('polyline',{points:points([previous,p[0]]),fill:'none',stroke:'#ea580c','stroke-width':.4,'stroke-dasharray':'2 1'}));
      svg.append(element('polyline',{points:points(p),fill:'none',stroke:'#94a3b8','stroke-opacity':.3,'stroke-width':result.diameter,'stroke-linejoin':'round'}));
      svg.append(element('polyline',{points:points(p),fill:'none',stroke:'#2563eb','stroke-width':.35}));
      svg.append(element('circle',{cx:p[0].x,cy:-p[0].y,r:.9,fill:'#16a34a'})); previous=p.at(-1);
    }
    $('cncDepth').textContent=` ${$('cncPass').value}/${result.depths.length} · Z = ${result.depths[Number($('cncPass').value)-1].toFixed(3)} mm`;
  }
  $('cncPass').oninput=()=>{if(result)draw();};
  $('cncForm').onsubmit=async event=>{
    event.preventDefault(); if(!$('cncForm').reportValidity())return;
    invalidate(); const token=revision, input=fingerprint(); $('cncStatus').textContent='A calcular…';
    try { const response=await fetch('/api/cnc/plan',{method:'POST',headers:{'Content-Type':'application/json'},body:input});
      const data=await response.json(); if(token!==revision || input!==fingerprint())return;
      if(!response.ok)throw new Error(data.message || 'Não foi possível calcular o percurso.');
      result=data; snapshot=input; $('cncPass').max=data.depths.length; $('cncPass').value=1;
      $('cncExportWarning').hidden=data.canExport; $('cncDownload').disabled=!data.canExport; $('cncStatus').textContent=`${data.width.toFixed(1)} × ${data.height.toFixed(1)} mm · ${data.paths.length} contornos · ${data.depths.length} passagens · ${(Math.abs(data.depths[0])).toFixed(3)} mm por passagem. Interiores antes dos exteriores.`;draw(); window.MakerCncSimulator?.load(data);
    }catch(error){if(token===revision){$('cncStatus').textContent=error.message; window.MakerCncSimulator?.clear('Simulação indisponível: '+error.message);}}
  };
  $('cncAcceptChanges').onchange=()=>{ $('cncDownload').disabled=!result || !(result.canExport || $('cncAcceptChanges').checked); };
  $('cncDownload').onclick=()=>{
    if(!result || (!result.canExport && !$('cncAcceptChanges').checked) || snapshot!==fingerprint()){invalidate();return;}
    const url=URL.createObjectURL(new Blob([result.gcode || result.simulationGcode],{type:'text/plain'})); const a=document.createElement('a'); a.href=url;a.download='makernames-cnc.nc';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
})();
