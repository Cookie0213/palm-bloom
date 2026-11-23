// Coordinates are mirrored into the visitor's view, so left means their left.
export function openPalm(p, aspect = 4 / 3) {
  const d = (a,b) => Math.hypot((p[a].x-p[b].x)*aspect,p[a].y-p[b].y);
  return [8,12,16,20].every(t => d(t,0) > d(t-2,0)*1.2)
    && d(4,5) > d(5,17)*.4 && d(5,17) > .045;
}
export class PalmSwipe {
  constructor() { this.reset(); this.cooldown = 0; }
  reset() { this.points=[]; }
  update(p,time,aspect=4/3) {
    if (!p || !openPalm(p,aspect) || time < this.cooldown) { this.reset(); return 0; }
    const x=1-(p[0].x+p[5].x+p[9].x+p[17].x)/4;
    const y=(p[0].y+p[5].y+p[9].y+p[17].y)/4;
    const last=this.points.at(-1);
    if (last && (time-last.time>220 || Math.abs(x-last.x)>.25)) this.reset();
    this.points.push({x,y,time});
    this.points=this.points.filter(v=>time-v.time<=650);
    const first=this.points[0], dx=x-first.x, dy=y-first.y;
    if (this.points.length>=3 && time-first.time>=90 && Math.abs(dx)>=.12 && Math.abs(dy)<.13 && Math.abs(dx)>Math.abs(dy)*1.8) {
      this.cooldown=time+1100; this.reset(); return dx<0 ? 1 : -1;
    }
    return 0;
  }
}
