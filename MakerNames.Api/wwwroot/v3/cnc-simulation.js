/* Reads the linear, absolute millimetre dialect emitted by MakerNames. */
(function(root) {
  function parse(gcode, rapidFeed = 3000) {
    const moves = []; let position = {x:null,y:null,z:null}, feed = 0, elapsed = 0;
    for (const raw of gcode.split(/\r?\n/)) {
      const line = raw.replace(/\([^)]*\)/g,'').trim();
      const words = Object.fromEntries([...line.matchAll(/([A-Z])\s*(-?\d+(?:\.\d+)?)/g)].map(m=>[m[1],Number(m[2])]));
      if (words.F !== undefined) feed=words.F;
      if (words.G !== 0 && words.G !== 1) continue;
      const next = {...position}; for (const axis of ['x','y','z']) if(words[axis.toUpperCase()]!==undefined)next[axis]=words[axis.toUpperCase()];
      if(Object.values(position).every(Number.isFinite) && Object.values(next).every(Number.isFinite)) {
        const distance=Math.hypot(next.x-position.x,next.y-position.y,next.z-position.z);
        if(distance>0) {
          const duration=distance/(words.G===0?rapidFeed:feed)*60;
          if(!Number.isFinite(duration)||duration<=0)throw new Error('Avanço inválido no ficheiro.');
          const type=words.G===0?'rapid':next.z!==position.z?'plunge':'cut';
          moves.push({from:position,to:next,type,start:elapsed,duration}); elapsed+=duration;
        }
      }
      position=next;
    }
    if(!moves.length)throw new Error('Ficheiro sem movimentos simuláveis.');
    return {moves,duration:elapsed};
  }
  function sample(plan,time) {
    time=Math.max(0,Math.min(time,plan.duration));
    let low=0,high=plan.moves.length-1;
    while(low<high){const mid=(low+high)>>1;const m=plan.moves[mid];if(m.start+m.duration<time)low=mid+1;else high=mid;}
    const move=plan.moves[low],fraction=time>=plan.duration?1:Math.max(0,Math.min(1,(time-move.start)/move.duration));
    const position={};for(const a of ['x','y','z'])position[a]=move.from[a]+(move.to[a]-move.from[a])*fraction;
    return {index:low,move,fraction,position};
  }
  const api={parse,sample}; if(typeof module!=='undefined')module.exports=api;else root.CncSimulation=api;
})(typeof window!=='undefined'?window:globalThis);

