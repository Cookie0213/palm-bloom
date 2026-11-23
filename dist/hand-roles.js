// Track physical hands across frames. A transient classifier flip must not swap roles.
const center = h => ({x:(h.landmarks[0].x+h.landmarks[9].x)/2,y:(h.landmarks[0].y+h.landmarks[9].y)/2});
export class HandRoles {
  constructor(){this.reset();}
  reset(){this.tracks=[];this.nextId=1;}
  update(hands,time){
    this.tracks=this.tracks.filter(t=>time-t.seen<450);
    const available=new Set(this.tracks), output=[];
    for(const hand of hands){
      const c=center(hand);
      let track=[...available].map(t=>({t,d:Math.hypot(c.x-t.x,c.y-t.y)})).filter(v=>v.d<.23).sort((a,b)=>a.d-b.d)[0]?.t;
      if(!track){track={id:this.nextId++,side:null,candidate:null,votes:0,seen:time,...c};this.tracks.push(track);}
      available.delete(track);
      // Lock only after three confident observations. Maintain identity until it leaves.
      if(!track.side && (hand.score??0)>=.75){
        track.votes=track.candidate===hand.side?track.votes+1:1;
        track.candidate=hand.side;
        if(track.votes>=3)track.side=hand.side;
      }
      Object.assign(track,c,{seen:time});
      if(track.side)output.push({...hand,side:track.side,id:track.id});
    }
    // Never assign two simultaneously observed hands to the same role.
    return output.filter(h=>output.filter(o=>o.side===h.side).length===1);
  }
}
