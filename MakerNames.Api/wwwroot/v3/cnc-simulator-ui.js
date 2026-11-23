(() => {
  const host=document.createElement('section');host.id='cncSimulator';host.hidden=false;
  host.innerHTML=`<h3>Simulador de percurso</h3><p id="simMessage" role="status"></p><div class="sim-actions"><button type="button" id="simPlay">Reproduzir</button><button type="button" id="simReset">Reiniciar</button><button type="button" id="simDownload" disabled>Descarregar G-code (.nc)</button><label>Velocidade <select id="simSpeed"><option value="1">1×</option><option value="5">5×</option><option value="20" selected>20×</option><option value="100">100×</option></select></label></div><div class="sim-stage"><canvas id="simMaterial" width="1000" height="420"></canvas><canvas id="simTool" width="1000" height="420" aria-label="Simulação da fresa e do material removido, vista superior"></canvas></div><label>Progresso <input id="simSeek" type="range" min="0" max="1000" value="0"></label><output id="simReadout"></output><p>Vista superior: sulcos azuis representam a largura removida; tons mais escuros indicam maior profundidade. Laranja: movimento rápido. A remoção é uma aproximação 2D para fresa cilíndrica, sem colisões ou deformação. Tempos excluem aceleração, arranque do spindle e troca de ferramenta; rápidos estimados a 3000 mm/min. A posição inicial da máquina é desconhecida: a animação começa após o primeiro posicionamento XY.</p>`;
  document.getElementById('cncStatus').after(host);
  const $=id=>document.getElementById(id), base=$('simMaterial').getContext('2d'), tool=$('simTool').getContext('2d');
  const downloadSource=$('cncDownload');
  $('simMessage').after($('cncExportWarning'));
  $('simDownload').onclick=()=>downloadSource.click();
  new MutationObserver(()=>{ $('simDownload').disabled=downloadSource.disabled; }).observe(downloadSource,{attributes:true,attributeFilter:['disabled']});
  let result,plan,time=0,frame=0,last=0,painted=-1,scale=1,minX=0,maxY=0;
  const px=p=>({x:30+(p.x-minX)*scale,y:30+(maxY-p.y)*scale});
  function pause(){cancelAnimationFrame(frame);frame=0;$('simPlay').textContent='Reproduzir';}
  function ready(enabled,message='') {
    for(const id of ['simPlay','simReset','simSeek','simSpeed']) $(id).disabled=!enabled;
    host.querySelector('.sim-stage').hidden=!enabled;
    $('simMessage').textContent=message;
  }
  function clear(message='Calcula um percurso válido para ativar a simulação.') {
    pause();result=null;plan=null;time=0;painted=-1;
    base.clearRect(0,0,1000,420);tool.clearRect(0,0,1000,420);
    $('simSeek').value='0';$('simReadout').textContent='';ready(false,message);
  }
  function background(){
    base.clearRect(0,0,1000,420);base.fillStyle='#f1e1c3';base.fillRect(0,0,1000,420);
    if(result.workWidth>0){const corner=px({x:result.workX,y:result.workY+result.workHeight});base.strokeStyle='#475569';base.lineWidth=2;base.strokeRect(corner.x,corner.y,result.workWidth*scale,result.workHeight*scale);}
    base.strokeStyle='#806747';base.lineWidth=1;
    for(const path of result.outline){base.beginPath();path.forEach((p,i)=>{const q=px(p);if(i)base.lineTo(q.x,q.y);else base.moveTo(q.x,q.y);});base.closePath();base.stroke();}painted=-1;
  }
  function groove(move,end){
    if(move.type==='rapid' || Math.min(move.from.z,end.z)>=0)return;
    const a=px(move.from),b=px(end),depth=Math.abs(Math.min(move.from.z,end.z));
    base.strokeStyle=`hsl(210 65% ${78-40*Math.min(1,depth/Math.abs(result.depths.at(-1)))}%)`;
    base.lineWidth=Math.max(.7,result.diameter*scale);base.lineCap='round';base.beginPath();base.moveTo(a.x,a.y);base.lineTo(b.x,b.y);base.stroke();
  }
  function render(rebuild=false){
    const state=CncSimulation.sample(plan,time);
    if(rebuild||state.index<painted)background();
    for(let i=painted+1;i<state.index;i++)groove(plan.moves[i],plan.moves[i].to);
    painted=state.index-1;
    // A separate overlay avoids permanently painting a partially completed move.
    tool.clearRect(0,0,1000,420);const a=px(state.move.from),p=px(state.position);
    tool.strokeStyle=state.move.type==='rapid'?'#ea580c':'#2563eb';tool.lineWidth=Math.max(1,result.diameter*scale);tool.lineCap='round';tool.beginPath();tool.moveTo(a.x,a.y);tool.lineTo(p.x,p.y);tool.stroke();
    tool.fillStyle='rgba(16,185,129,.35)';tool.strokeStyle='#047857';tool.lineWidth=2;tool.beginPath();tool.arc(p.x,p.y,Math.max(3,result.diameter*scale/2),0,Math.PI*2);tool.fill();tool.stroke();
    const z=state.position.z, pass=z<0?Math.min(result.depths.length,Math.max(1,Math.ceil((-z-1e-6)/Math.abs(result.depths[0])))):0;
    $('simReadout').textContent=`X ${state.position.x.toFixed(2)} · Y ${state.position.y.toFixed(2)} · Z ${z.toFixed(3)} mm | ${pass?'Passagem '+pass+'/'+result.depths.length:'Acima do material'} | ${{rapid:'Deslocação rápida',plunge:'Descida',cut:'Corte'}[state.move.type]} | ${time.toFixed(1)} / ${plan.duration.toFixed(1)} s (estimativa)${time>=plan.duration?' · Concluído':''}`;
    $('simSeek').value=String(Math.round(time/plan.duration*1000));
  }
  function tick(now){const delta=last?Math.min((now-last)/1000,.1):0;last=now;time=Math.min(plan.duration,time+delta*Number($('simSpeed').value));render();if(time<plan.duration)frame=requestAnimationFrame(tick);else pause();}
  $('simPlay').onclick=()=>{if(frame){pause();return;}if(time>=plan.duration){time=0;background();}last=0;$('simPlay').textContent='Pausar';frame=requestAnimationFrame(tick);};
  $('simReset').onclick=()=>{pause();time=0;render(true);};
  $('simSeek').oninput=()=>{pause();time=Number($('simSeek').value)/1000*plan.duration;render(true);};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  window.MakerCncSimulator={
    clear,
    load(data){pause();result=data;plan=CncSimulation.parse(data.simulationGcode || data.gcode);time=0;const points=data.paths.flat();if(data.workWidth>0)points.push({x:data.workX,y:data.workY},{x:data.workX+data.workWidth,y:data.workY+data.workHeight});minX=Infinity;maxY=-Infinity;let maxX=-Infinity,minY=Infinity;for(const p of points){minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);}const pad=data.diameter/2+2;minX-=pad;maxX+=pad;minY-=pad;maxY+=pad;scale=Math.min(940/(maxX-minX),360/(maxY-minY));ready(true,data.warning || "");render(true);host.scrollIntoView({block:"start",behavior:"smooth"});},
    pause
  };
  clear();
})();
