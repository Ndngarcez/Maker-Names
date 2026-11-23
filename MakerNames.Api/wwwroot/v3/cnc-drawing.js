(() => {
  const $=id=>document.getElementById(id), form=$('cncForm');
  const host=document.createElement('section'); host.id='cncDrawing';
  host.innerHTML=`<h3>Área de trabalho e figuras</h3>
    <label><input id="drawIncludeName" type="checkbox" checked> Incluir o nome do editor 3D</label>
    <p>Escolhe uma figura e arrasta na área para desenhar, ou introduz medidas e clica em Adicionar. X/Y indicam o canto inferior esquerdo da caixa da figura, medidos desde o canto da área, mesmo com origem CNC ao centro. Figuras sobrepostas são unidas no corte.</p>
    <form id="drawForm"><div class="cnc-fields">
    <label>Figura<select id="drawType"><option value="rectangle">Retângulo</option><option value="square">Quadrado</option><option value="circle">Círculo</option><option value="ellipse">Elipse</option><option value="triangle">Triângulo</option><option value="hexagon">Hexágono</option></select></label>
    <label>X (mm)<input id="drawX" type="number" min="0" max="3000" step="0.1" value="20" required></label>
    <label>Y (mm)<input id="drawY" type="number" min="0" max="3000" step="0.1" value="100" required></label>
    <label>Largura / lado / diâmetro (mm)<input id="drawW" type="number" min="0.1" max="3000" step="0.1" value="50" required></label>
    <label>Altura (mm)<input id="drawH" type="number" min="0.1" max="3000" step="0.1" value="30" required></label>
    </div><div class="sim-actions"><button type="submit">Adicionar figura</button><button type="button" id="drawUpdate" disabled>Aplicar à selecionada</button><button type="button" id="drawDelete" disabled>Eliminar selecionada</button></div></form>
    <p id="drawStatus" role="status"></p><svg id="drawBoard" role="img" aria-label="Área de trabalho: arrasta para desenhar figuras"></svg>
    <label>Selecionar figura<select id="drawSelection"><option value="">Nenhuma</option></select></label>`;
  form.before(host);
  const areaFields=document.createElement('div');areaFields.className='cnc-fields';host.querySelector('h3').after(areaFields);
  for(const name of ['workWidth','workHeight']){
    const input=form.elements.namedItem(name);input.setAttribute('form','cncForm');areaFields.append(input.closest('label'));
    input.addEventListener('input',()=>emit());
  }
  const board=$('drawBoard'), shapes=[]; let selected=-1, start=null, draft=null;
  const field=name=>form.elements.namedItem(name);
  const area=()=>({w:Number(field('workWidth').value),h:Number(field('workHeight').value)});
  const equal=t=>['square','circle'].includes(t);
  const points=s=>{
    const {x,y,w,h,type}=s;
    if(type==='triangle')return [{x,y},{x:x+w,y},{x:x+w/2,y:y+h}];
    if(['circle','ellipse','hexagon'].includes(type)){
      const n=type==='hexagon'?6:180;
      return Array.from({length:n},(_,i)=>({x:x+w/2+w/2*Math.cos(i*2*Math.PI/n),y:y+h/2+h/2*Math.sin(i*2*Math.PI/n)}));
    }
    return [{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}];
  };
  function emit(){host.dispatchEvent(new Event('cnc-drawing-change',{bubbles:true}));render();}
  function svg(tag,attrs){const e=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);board.append(e);return e;}
  function render(){
    const {w,h}=area();board.replaceChildren();if(!(w>0&&h>0))return;
    board.setAttribute('viewBox',`-5 -5 ${w+10} ${h+10}`);
    svg('rect',{x:0,y:0,width:w,height:h,fill:'#fff',stroke:'#64748b','stroke-width':1});
    const step=Math.max(10,Math.ceil(Math.max(w,h)/30/10)*10);
    for(let x=step;x<w;x+=step)svg('path',{d:`M${x} 0V${h}`,stroke:'#e2e8f0','stroke-width':.5});
    for(let y=step;y<h;y+=step)svg('path',{d:`M0 ${y}H${w}`,stroke:'#e2e8f0','stroke-width':.5});
    [...shapes,...(draft?[draft]:[])].forEach((s,i)=>{
      const el=svg('polygon',{points:points(s).map(p=>`${p.x},${h-p.y}`).join(' '),fill:i===selected?'#93c5fd':'#dbeafe',stroke:'#2563eb','stroke-width':1,'vector-effect':'non-scaling-stroke'});
      el.dataset.index=i;
    });
    $('drawStatus').textContent=`${w} × ${h} mm · grelha ${step} mm · ${shapes.length} figuras. O nome é mostrado na pré-visualização após calcular o percurso.`;
    const list=$('drawSelection');list.replaceChildren(new Option('Nenhuma',''));
    const names={rectangle:'Retângulo',square:'Quadrado',circle:'Círculo',ellipse:'Elipse',triangle:'Triângulo',hexagon:'Hexágono'};
    shapes.forEach((s,i)=>list.add(new Option(`${i+1} · ${names[s.type]} · ${s.w} × ${s.h} mm`,String(i))));list.value=selected<0?'':String(selected);
    $('drawUpdate').disabled=$('drawDelete').disabled=selected<0;
  }
  function read(){const type=$('drawType').value;return {type,x:Number($('drawX').value),y:Number($('drawY').value),w:Number($('drawW').value),h:Number(equal(type)?$('drawW').value:$('drawH').value)};}
  function valid(s){const {w,h}=area();if(shapes.length>=100&&selected<0){$('drawStatus').textContent='Máximo de 100 figuras.';return false;}if(s.x<0||s.y<0||s.w<=0||s.h<=0||s.x+s.w>w||s.y+s.h>h){$('drawStatus').textContent='A figura deve caber na área de trabalho.';return false;}return true;}
  function select(i){selected=i;const s=shapes[i];if(s){for(const [key,id] of Object.entries({type:'Type',x:'X',y:'Y',w:'W',h:'H'}))$('draw'+id).value=s[key];}$('drawH').disabled=equal($('drawType').value);render();}
  function dimensions(){$('drawH').disabled=equal($('drawType').value);if($('drawH').disabled)$('drawH').value=$('drawW').value;}
  $('drawType').onchange=dimensions;$('drawW').oninput=dimensions;
  $('drawSelection').onchange=e=>select(e.target.value===''?-1:Number(e.target.value));
  $('drawForm').onsubmit=e=>{e.preventDefault();const s=read();if(!valid(s))return;shapes.push(s);selected=shapes.length-1;emit();};
  $('drawUpdate').onclick=()=>{if(!$('drawForm').reportValidity())return;const s=read();if(selected>=0&&valid(s)){shapes[selected]=s;emit();}};
  $('drawDelete').onclick=()=>{if(selected>=0){shapes.splice(selected,1);selected=-1;emit();}};
  function pos(e){const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(board.getScreenCTM().inverse()),{w,h}=area();return {x:Math.max(0,Math.min(w,p.x)),y:Math.max(0,Math.min(h,h-p.y))};}
  board.onpointerdown=e=>{if(e.button!==0)return;if(e.target.dataset.index!==undefined){select(Number(e.target.dataset.index));return;}start=pos(e);board.setPointerCapture(e.pointerId);};
  board.onpointermove=e=>{if(!start)return;const p=pos(e),type=$('drawType').value;let w=Math.abs(p.x-start.x),h=Math.abs(p.y-start.y);if(equal(type))w=h=Math.min(w,h);draft={type,x:p.x<start.x?start.x-w:start.x,y:p.y<start.y?start.y-h:start.y,w,h};render();};
  board.onpointerup=()=>{if(!start)return;if(draft&&draft.w>=.1&&draft.h>=.1&&shapes.length<100){for(const key of ['x','y','w','h'])draft[key]=Math.round(draft[key]*10)/10;shapes.push(draft);selected=shapes.length-1;}start=null;draft=null;select(selected);emit();};
  board.onpointercancel=()=>{start=null;draft=null;render();};
  $('drawIncludeName').onchange=emit;
  form.addEventListener('input',render);
  window.CncDrawing={polygons:()=>shapes.map(points),includeName:()=>$('drawIncludeName').checked};
  render();
})();
