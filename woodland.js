
/* A layered, seeded woodland illustration. All scenery is painted once per session. */
(function () {
  "use strict";
  let landscape;
  const tau = Math.PI * 2;
  function brush(c) {
    function path(d, color, stroke, width=1) {
      const p = new Path2D(d);
      if (color) { c.fillStyle=color; c.fill(p); }
      if (stroke) { c.strokeStyle=stroke; c.lineWidth=width; c.stroke(p); }
    }
    function oval(x,y,rx,ry,color,angle=0) {
      c.beginPath(); c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),angle,0,tau); c.fillStyle=color; c.fill();
    }
    function line(x,y,u,v,color,width=1) {
      c.beginPath(); c.moveTo(x,y); c.lineTo(u,v); c.strokeStyle=color; c.lineWidth=width; c.stroke();
    }
    return {path,oval,line};
  }
  function compose() {
    const canvas = document.createElement('canvas');
    canvas.width=1500; canvas.height=900;
    const c=canvas.getContext('2d'); c.scale(1.5,1.5); c.lineCap='round'; c.lineJoin='round';
    const {path,oval,line}=brush(c);
    let seed=1583309;
    const rand=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
    const range=(a,b)=>a+(b-a)*rand();
    const pick=a=>a[Math.floor(rand()*a.length)];
    const gradient=(x,y,u,v,stops)=>{const g=c.createLinearGradient(x,y,u,v); stops.forEach(([p,s])=>g.addColorStop(p,s));return g;};
    const sky=gradient(0,0,0,430,[[0,'#49797c'],[.37,'#a6bb9d'],[.76,'#ffe2a0'],[1,'#d1a46e']]);
    c.fillStyle=sky; c.fillRect(0,0,1000,600);
    const glow=c.createRadialGradient(715,165,1,715,165,276);
    glow.addColorStop(0,'#fff3be');glow.addColorStop(.25,'#ffe8a3be');glow.addColorStop(1,'#ffd09100');
    c.fillStyle=glow;c.fillRect(390,0,610,485);
    for (let layer=0;layer<3;layer++) {
      const base=220+layer*43;
      const hill=new Path2D(); hill.moveTo(-20,450);
      for(let x=-20;x<1030;x+=3) {const y=base+25*Math.sin(x*.007+layer*.8)+12*Math.cos(x*.014-layer)+5*Math.sin(x*.05);hill.lineTo(x,y);}
      hill.lineTo(1030,470);hill.closePath(); c.fillStyle=['#93a892','#829981','#668978'][layer]; c.fill(hill);
    }
    for(let i=0;i<132;i++){
      const x=range(-20,1020),base=range(259,374),h=range(16,76),w=h*range(.14,.27);
      const d=new Path2D(); d.moveTo(x,base-h);
      for(let j=1;j<=7;j++){const y=base-h+h*j/7,ww=w*j/7;d.lineTo(x+ww,y);d.lineTo(x+ww*.57,y-h*.047);}
      d.lineTo(x,base+1);
      for(let j=7;j>=1;j--){const y=base-h+h*j/7,ww=w*j/7;d.lineTo(x-ww*.58,y-h*.046);d.lineTo(x-ww,y);}
      d.closePath();c.fillStyle=pick(['#56796c','#5e8271','#799278','#879779','#668675']);c.fill(d);
    }
    // Middle-distance maple crowns have broad shadow masses and a sun-facing rim.
    function crown(x,y,rx,ry,colors) {
      for(let i=0;i<45;i++){
        const a=rand()*tau,r=Math.sqrt(rand()),px=x+Math.cos(a)*rx*r,py=y+Math.sin(a)*ry*r;
        const size=range(.09,.27)*rx; oval(px,py,size,size*range(.63,1.2),pick(colors.slice(0,3)),rand()*.5);
      }
      for(let i=0;i<65;i++){
        const a=rand()*tau,r=Math.sqrt(rand()),px=x+Math.cos(a)*rx*r,py=y+Math.sin(a)*ry*r;
        if((px-x)/rx-(py-y)/ry<-.25 && rand()<.77)continue;
        const size=range(.035,.14)*rx; oval(px,py,size,size*.58,pick(colors.slice(2)),range(-.8,.8));
      }
    }
    const amb=['#92583d','#b76e38','#cc853c','#eaa449','#f3c160'];
    const red=['#873f39','#a34d35','#bc5a33','#d7773c','#df914d'];
    const green=['#375c51','#4d6b4a','#6b794b','#92934e','#adb264'];
    for(let i=0;i<47;i++){
      const x=range(-30,1030),base=range(309,392),h=range(53,150);
      const px=x+range(-10,10),py=base-h;
      line(x,base,px,py,'#736b50',range(1.6,4.5));
      for(let j=0;j<4;j++){
        const dir=j%2===0?-1:1;const ex=px+dir*range(9,28),ey=py+range(-3,29);
        line(x,py+range(30,70),ex,ey,'#6c6550',1.3);
        crown(ex,ey,range(13,26),range(12,23),pick([amb,red,green]));
      }
    }
    // An open central glade catches the last light.
    path('M0 388 Q155 336 321 369 Q476 396 621 357 Q792 322 1000 355 L1000 600 H0Z',gradient(0,350,0,590,[[0,'#878546'],[.31,'#81703c'],[.63,'#715237'],[1,'#3a4637']]));
    for(let i=0;i<2600;i++){
      const x=range(0,1000),y=range(360,545),r=range(.5,2.9)*(y/440);
      oval(x,y,r*range(1.2,2.8),r*.45,pick(['#72743f','#897c41','#a48a47','#ba914b','#6a653d','#c39a554d']),range(-.2,.2));
    }
    path('M-52 451 Q110 403 245 420 T493 422 Q679 401 860 401 Q935 404 1015 390 L1010 498 Q822 497 712 493 T458 508 Q243 498 96 521 L-50 540Z',gradient(0,401,0,520,[[0,'#a38152'],[.5,'#99774d'],[1,'#735a3c']]));
    for(let i=0;i<900;i++){
      const x=range(0,1000),y=range(425,501),w=range(.5,4);
      oval(x,y,w,.5,pick(['#745b3b55','#bba16c77','#654a3555','#e3ba7955']));
    }
    // Long shafts of sunshine filter across the distant floor.
    c.save(); c.globalAlpha=.13;
    for(let i=0;i<7;i++){const x=range(465,932);path('M'+x+' 48 l19 0 -155 341 -49 0Z',gradient(0,64,0,395,[[0,'#fff7c400'],[.5,'#fff7c4'],[1,'#fff7c4aa']]));}c.restore();
    function birch(x,base,h,w){
      const lean=range(-16,17);
      c.save();c.translate(x,base);c.rotate(lean*.005);
      path('M'+(-w*.75)+' 0 Q'+(-w*.5)+' '+(-h*.52)+' '+(-w*.31)+' '+(-h)+' L'+(w*.32)+' '+(-h)+' Q'+(w*.25)+' '+(-h*.45)+' '+(w*.77)+' 0Z',gradient(-w,0,w,0,[[0,'#667268'],[.44,'#b2b4a0'],[.78,'#ece1ba'],[1,'#cdbf9d']]));
      for(let j=0;j<24;j++){const y=range(-h+3,-1),a=range(-w*.37,w*.26);line(a,y,a+range(.5,w*.29),y+range(-.8,.8),'#5a6256',range(.55,1.8));}
      for(let j=0;j<4;j++){const y=range(-h*.9,-h*.48),dir=j%2===0?-1:1;path('M0 '+y+' q'+(dir*11)+' -4 '+(dir*28)+' -30',null,'#63675a',1.6);}
      c.restore();
    }
    for(const x of [9,56,314,357,675,697,920,962,980])birch(x,range(355,395),range(185,355),range(4,8));
    for(const x of [1,54,286,346,673,930,987]){
      crown(x,range(36,100),range(38,80),range(32,65),pick([amb,red,green]));
    }
    // The old oak anchors the composition and supplies an unobscured squirrel perch.
    const bark=gradient(43,0,177,0,[[0,'#3b3c32'],[.33,'#4c4435'],[.65,'#67513a'],[.84,'#785a3f'],[1,'#8e704c']]);
    path('M28 -15 C53 63 74 128 77 195 C82 249 79 311 66 359 C55 402 45 425 5 448 Q63 440 99 420 Q86 439 69 451 Q114 440 140 420 Q167 430 210 433 Q171 416 152 392 C128 353 130 288 142 223 C155 180 158 120 149 70 Q142 20 148 -14Z',bark);
    path('M115 332 Q140 294 171 280 Q207 266 243 269 Q279 268 312 245 Q284 257 256 259 Q217 259 191 266 Q151 275 135 292Z',bark);
    path('M99 185 Q63 119 13 83 L-10 61 L-10 37 Q30 72 52 87 Q78 102 100 110Z','#514937');
    path('M113 186 Q144 124 201 96 Q250 67 298 7 L304 -10 L283 -10 Q236 51 188 78 Q144 99 121 102Z','#61503b');
    for(let i=0;i<35;i++){
      const x=range(77,129),y=range(-8,340),h=range(12,63),bend=range(-6,6);
      path('M'+x+' '+y+' q'+bend+' '+h*.5+' '+range(-4,4)+' '+h,null,pick(['#3f4034','#564734','#9c795143','#796448']),range(.7,2.3));
    }
    for(let i=0;i<29;i++){const x=range(67,154),y=range(380,415);oval(x,y,range(2,7),range(1,3),pick(['#78814c','#566745','#586840','#899358']));}
    // Large overhead leaf clusters frame the opening without swallowing the sky.
    for(const [x,y,rx,ry,col] of [[8,9,130,89,green],[87,5,85,59,red],[174,-8,74,57,amb],[231,-7,83,41,red],[309,-26,85,48,amb],[448,-26,76,42,green],[881,-17,97,54,amb],[969,16,92,58,red],[1030,87,77,73,green]]){
      crown(x,y,rx,ry,col);
    }
    function leaf(x,y,s,col,rot) {
      c.save();c.translate(x,y);c.rotate(rot);c.scale(s,s);
      path('M-1 0 Q-6 -2 -8 -5 L-4 -4 -5 -8 -1 -5 1 -10 3 -5 7 -7 5 -2 8 -2 Q6 2 0 3Z',col);
      if(s>.58)line(0,4,1,-5,'#6b502a7d',.7);
      c.restore();
    }
    for(let i=0;i<730;i++){
      let x=range(-8,1008),y=range(372,600);
      if(y>421&&y<496&&x>130&&x<890&&rand()>.085)continue;
      let s=(.14+(y-360)*.0026)*range(.55,1.35);
      leaf(x,y,s,pick(['#ad5637','#c97c40','#bb8b42','#b5a15c','#a24434','#745f39','#d79a4c','#6d643b']),range(-2,2));
    }
    function fern(x,y,size,color,tilt){
      c.save();c.translate(x,y);c.rotate(tilt);c.scale(size,size);
      for(let j=-2;j<=2;j++){
        const endX=j*10,endY=-49+Math.abs(j)*7;
        const p=(t)=>[endX*t*1.15,endY*t+9*t*t];
        const end=p(1);path('M0 0 Q'+endX*.45+' '+(endY*.6)+' '+end[0]+' '+end[1],null,color,1);
        for(let k=1;k<10;k++){
          const t=k/10,[bx,by]=p(t),l=Math.sin(t*Math.PI)*8+1;
          for(const d of [-1,1]){
            const dx=d*l+j*1.6;path('M'+bx+' '+by+' q'+(dx*.62)+' -1 '+dx+' '+(-l*.65)+' q'+(-dx*.35)+' '+l*.66+' '+(-dx)+' '+l*.65+'Z',color);
          }
        }
      }c.restore();
    }
    path('M-11 509 Q55 477 140 481 Q182 477 202 484 L192 495 Q100 491 5 521Z','#514834');
    path('M-4 504 Q79 477 166 483',null,'#81915c',3);
    for(let i=0;i<47;i++){
      const x=range(-5,1006),y=range(381,575);
      if(y>410&&y<510&&x>150&&x<902)continue;
      if(x>200&&x<808&&y<535)continue;
      fern(x,y,range(.34,1.22),pick(['#456447','#455840','#696f40','#868345','#62744a']),range(-.57,.57));
    }
    // Paint the woven harvest horn on a low stump, with red corn, squash and grapes.
    c.save();c.translate(773,343);c.scale(1.18,1.18);
    path('M-26 -10 Q-12 -16 10 -11 L12 7 18 12 Q8 16 -2 11 Q-15 16 -30 12 L-23 6Z','#6a5137');
    oval(-6,-10,20,4,'#a08454');oval(-6,-11,14,2,'#c4a36b');
    path('M-15 -13 Q3 -21 11 -30 Q19 -40 12 -43 Q24 -46 22 -32 Q20 -16 -1 -9Z','#a36832','#684c32',1.2);
    path('M-14 -13 Q1 -18 10 -24 Q18 -31 19 -40',null,'#e2ac58',1.4);
    for(let j=0;j<7;j++){
      const x=1+j*2.6,y=-14-j*2.5;
      path('M'+x+' '+(y-5)+' q5 0 7 3',null,'#61472e',.9);
    }
    oval(-10,-16,10,7,'#b98445',-.32);oval(-10,-16,8,5.5,'#64472d',-.32);
    oval(-21,-13,6.5,4.5,'#e1ce85');oval(-25,-13,5,5.8,'#e9dba2',-.3);line(-26,-18,-26,-21,'#687347',1.8);
    oval(-13,-12,5,4,'#d78238');line(-13,-16,-12,-19,'#516740',1);
    for(let j=0;j<8;j++)oval(-7+(j%3)*2.5+Math.floor(j/3)*.3,-10+Math.floor(j/3)*2.1,1.7,1.6,j%3?'#725067':'#593f57');
    oval(-18,-9,5.5,1.9,'#cb943e',-.16);
    for(let j=0;j<6;j++)oval(-22+j*1.5,-9-j*.13,.65,1,'#9a4435'); c.restore();
    // Fine paper grain. Composited once rather than generated during playback.
    const paper=document.createElement('canvas');paper.width=paper.height=100;
    const pc=paper.getContext('2d'),pix=pc.createImageData(100,100);
    for(let i=0;i<pix.data.length;i+=4){const n=rand()>.5?255:12;pix.data[i]=n;pix.data[i+1]=n;pix.data[i+2]=n;pix.data[i+3]=Math.floor(rand()*12);}
    pc.putImageData(pix,0,0);c.fillStyle=c.createPattern(paper,'repeat');c.fillRect(0,0,1000,600);
    return canvas;
  }
  function settlers(c,t,phase){
    const {path,oval,line}=brush(c);const turn=Math.sin(t*.58)*.7;
    const elapsed=typeof phase==='number'?phase:0;
    const reach=Math.max(0,Math.min(1,(elapsed-8)*2,(12-elapsed)*2));
    const easeIn=u=>{u=Math.min(1,Math.max(0,u));return u*u*(3-2*u);};
    // They come separately through the shaded opening and stay in the clearing.
    const walk=easeIn((t-.1)/3.4),follow=easeIn((t-.8)/3.8);
    const step=Math.sin(t*5.3)*(1-walk),step2=Math.sin(t*5.9)*(1-follow);
    const glance=(1+Math.sin(t*.85))/2;
    const arranging=(Math.sin(t*1.35)*3.5-1)*(1-reach);
    c.save();
    const light=c.createRadialGradient(723,290,4,723,300,90);
    light.addColorStop(0,'rgba(255,215,146,.23)');light.addColorStop(1,'rgba(255,220,170,0)');
    c.fillStyle=light;c.fillRect(625,205,200,180);c.restore();
    c.save();c.translate(686+28*walk,345-1.6*Math.abs(step));c.scale(1.6,1.6);c.globalAlpha=.28+.72*walk;
    oval(-1,1,11,1.8,'#3d40333f');
    line(-3,-17,-5+4*step,-1,'#625d4c',3.5);line(3,-17,4-4*step,-1,'#565c50',3.5);
    line(-6+4*step,0,-3+4*step,0,'#3d4037',2.2);line(3-4*step,0,7-4*step,0,'#3d4037',2.2);
    path('M-4 -36 Q0 -37 4 -34 L7 -21 5 -16 -6 -16 -7 -22Z','#314958');
    path('M-5 -19 L5 -19 5 -13 1 -12 -1 -15 -3 -12 -7 -14Z','#4a4e49');
    c.save();c.translate(-glance,-35);c.rotate(-.09*glance-.11*reach);c.translate(0,35);oval(turn,-40,3.4,4.5,'#bf8f69');path('M-7 -43 L7 -43 6 -41 -7 -41Z','#393e39');path('M-4 -43 L-3 -49 2 -49 4 -43Z','#4c4841');c.restore();
    path('M-3 -35 L1 -33 4 -35 3 -31 -2 -32Z','#c9c3a7');
    // Musket held vertically while watching the woodland.
    line(-10,-50,-9,-21,'#575a51',1.15);line(-9,-25,-10,-8,'#6e5037',2.2);
    path('M-4 -32 Q-5 -27 -9 -27',null,'#4b5b5b',3);oval(-9,-27,1.6,1.5,'#c49c76');
    c.restore();c.save();c.translate(708+33*follow,342-1.4*Math.abs(step2));c.scale(1.6,1.6);c.globalAlpha=.22+.78*follow;c.rotate(.024*step2+.022*Math.sin(t*1.35));
    oval(0,2,12,1.9,'#3d40333f');
    path('M-4 -35 Q0 -37 4 -33 L5 -23 Q8 -14 11 0 Q1 2 -10 -1 Q-7 -14 -5 -23Z','#974d38');
    path('M-3 -26 L4 -26 8 -2 Q2 0 -4 -2Z','#dfc69a');oval(0,-38,3.4,4.1,'#cda17b');
    path('M-5 -37 Q-6 -44 0 -44 Q5 -44 5 -39 L2 -40 -1 -42 -2 -35Z','#fff0d0');
    path('M3 -32 Q8 -28 12 '+(-27+arranging),null,'#89604c',2.8);oval(12,-27+arranging,1.6,1.4,'#cc9c74');
    oval(15,-26+arranging,4.3,1.4,'#d4a453',.26);
    path('M-3 -32 Q-6 -24 '+(-6-5*reach)+' '+(-23-7*reach),null,'#8d604d',2.7);
    oval(-6-5*reach,-23-7*reach,1.5,1.4,'#caa080');
    c.restore();
  }
  window.drawForest=function(c,w,h,t,phase){
    if(!landscape)landscape=compose();c.save();c.scale(w/1000,h/600);c.drawImage(landscape,0,0,1000,600);
    const time=Number.isFinite(t)?t:0;settlers(c,time,phase);
    const {oval}=brush(c);
    // Sparse drifting leaves; the foreground remains visually quiet around the bird.
    for(let i=0;i<9;i++){
      const duration=12+i*.83,p=(time/duration+i*.157)%1;
      const x=(i*131+70+p*78+Math.sin(p*11+i)*17)%1000,y=-12+p*410;
      oval(x,y,2.6+Math.sin(p*12+i),1.3,['#c96d36','#dc9d47','#ac5940'][i%3],p*8+i);
    }c.restore();
  };
})();



/* Coordinates are relative to the patch of ground beneath the hips.
   Each anatomical landmark follows the same transforms as its visible part. */
function drawTurkey(ctx, x, y, scale, pose, cycle) {
  const c = ctx;
  const tau = Math.PI * 2;
  const wave = Math.sin(cycle), double = Math.cos(2 * cycle);
  const running = pose === 'run', walking = pose === 'walk';
  const peck = pose === 'peck', scratching = pose === 'scratch';
  const strut=pose==='strut', flying=pose==='flight';
  const fanOpen=strut ? Math.sin(Math.PI/2*Math.min(1,Math.max(0,cycle/2))) : 0;
  const brake = pose === 'brake', alert = pose === 'alert', look = pose === 'look';
  const dip = peck ? 0.83 + 0.17 * Math.cos(cycle) : 0;
  const bob = running ? 2.5 * double : walking ? 1.3 * double : 0.6 * wave;
  const lift = bob + (brake ? 6 : 0) + dip * 5;
  const pitch = flying ? -0.13 : strut ? -0.08 : running ? 0.09 : brake ? -0.045 : dip * 0.14;
  const ellipse = (cx, cy, rx, ry, rot, tint) => {
    c.beginPath(); c.ellipse(cx, cy, rx, ry, rot, 0, tau); c.fillStyle = tint; c.fill();
  };
  const line = (points, tint, width) => {
    c.beginPath(); c.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) c.lineTo(...points[i]);
    c.strokeStyle = tint; c.lineWidth = width; c.stroke();
  };
  const path = (d, tint, stroke, width = 1) => {
    const p = new Path2D(d);
    if (tint) { c.fillStyle = tint; c.fill(p); }
    if (stroke) { c.lineWidth = width; c.strokeStyle = stroke; c.stroke(p); }
  };
  const grad = (x1,y1,x2,y2,stops) => {
    const g = c.createLinearGradient(x1,y1,x2,y2);
    for (let i=0; i<stops.length; i++) g.addColorStop(i/(stops.length-1),stops[i]);
    return g;
  };
  c.save(); c.translate(x,y); c.scale(scale,scale);
  c.lineCap = 'round'; c.lineJoin = 'round';

  function leg(side) {
    const phase = cycle + (side ? 0 : Math.PI);
    const stride = running ? 27 : walking ? 14 : strut ? 5 : 0;
    const kneeX = (side ? 2 : -5) + 9;
    const kneeY = -48 + lift;
    const swing = Math.max(0, Math.sin(phase));
    let fx = (side ? 5 : -8) - stride * Math.cos(phase);
    let fy = -3 - swing * (running ? 21 : walking ? 12 : 0);
    if (brake) fx += side ? 17 : -10;
    if(flying){fx-=side?24:29;fy-=side?29:34;}
    if (scratching && side === (Math.floor(cycle/tau)%2+2)%2) {
      fx += 12 + 19 * Math.cos(phase);
      fy -= 12 * swing;
    }
    // Fold the intertarsal joint behind the line joining knee and toe.
    const dx=fx-kneeX, dy=fy-kneeY, dist=Math.max(1,Math.hypot(dx,dy));
    const shin=33, shank=29;
    const along=Math.min(shin,(shin*shin-shank*shank+dist*dist)/(2*dist));
    const offset=Math.sqrt(Math.max(0,shin*shin-along*along));
    const hx=kneeX+(along*dx-offset*dy)/dist, hy=kneeY+(along*dy+offset*dx)/dist;
    const dark=side?'#704a41':'#51413b', pink=side?'#bb8a72':'#896858';
    line([[kneeX,kneeY],[hx,hy],[fx,fy]],dark,4.4);
    line([[hx,hy],[fx,fy]],pink,2.8);
    for(let r=0.14; r<0.95; r+=0.16) {
      const a=hx+r*(fx-hx), b=hy+r*(fy-hy);
      line([[a-0.85,b],[a+0.85,b-0.35]],dark,0.7);
    }
    line([[hx*0.45+fx*0.55,hy*0.45+fy*0.55],[hx*0.45+fx*0.55-3,hy*0.45+fy*0.55-2]],dark,1.3);
    for(const [tx,ty] of [[-5,-0.3],[8,-0.3],[12,1],[7,2.3]]) {
      line([[fx,fy],[fx+tx*0.52,fy+ty*0.5],[fx+tx,fy+ty]],pink,1.8);
      line([[fx+tx,fy+ty],[fx+tx+Math.sign(tx)*1.4,fy+ty+0.1]],'#564438',0.8);
    }
    return [[fx+8,fy],[hx,hy]];
  }
  leg(0); const anchors=leg(1);
  c.translate(0, -73+lift); c.rotate(pitch);
  let fanPoint=[-97,-13], wingPoint=[-23,1];
  if(strut){
    c.save();c.translate(-38,-5);
    const feathers=19;
    // An oblique view of a full wheel gives the fan a curved, asymmetric profile.
    for(let i=0;i<feathers;i++){
      const n=i/(feathers-1);
      const angle=-1.28+fanOpen*(-0.52+2.67*n)+0.013*Math.sin(2*cycle+n*8);
      const len=64+fanOpen*(17+8*Math.sin(Math.PI*n));
      const breadth=2.4+4.6*fanOpen;
      c.save();c.rotate(angle);c.scale(breadth/7,len/88);
      const blade='M0 0 C-3 -23 -8 -58 -7 -80 Q-6 -87 -1 -88 Q4 -90 7 -84 C10 -64 5 -24 0 0 Z';
      path(blade,grad(0,-88,0,-4,['#d3ac76','#af703a','#825331','#60452e']),'#59432f',0.8);
      c.save();c.clip(new Path2D(blade));
      for(let b=13;b<84;b+=7) path('M-10 '+(-b)+' q9 4 20 -1',null,b>71?'#3b342c':'#6a4633',b>71?5.5:1.6);
      path('M-9 -85 Q0 -81 9 -86',null,'#e9bd85',3.3);
      path('M0 -1 Q-0.5 -45 0 -85',null,'#e4b781',0.8);
      c.restore();c.restore();
    }
    const centerAngle=-1.28+fanOpen*(-0.52+2.67*0.50);
    fanPoint=[-38+Math.sin(centerAngle)*78,-5-Math.cos(centerAngle)*78];
    c.restore();
  }
  // Narrow overlapping cinnamon-barred rectrices stay furled while travelling.
  for(let j=0; j<(strut?0:5); j++) {
    c.save(); c.translate(-37,2-j*1.2); c.rotate(0.13+j*0.06+(running?0.018*wave:0));
    const length=59+j*1.5;
    c.scale(length/62,1);
    const tailShape='M2 -5 Q-24 -12 -61 -6 Q-66 -4 -61 0 Q-33 8 2 4 Z';
    path(tailShape,['#5a3829','#774b2c','#84512d','#926038','#a06c44'][j],'#493627',0.8);
    c.save(); c.clip(new Path2D(tailShape));
    for(let k=8;k<60;k+=6) line([[-k-3,-10],[-k+2,8]],k>48?'#322c26':'#583c2c',k>48?4:1.8);
    line([[-61,-10],[-57,5]],'#d2a26b',3); c.restore(); c.restore();
  }
  if(strut){c.save();c.scale(1.045,1.17);}
  const outline='M-62 -6 Q-49 -28 -24 -35 Q5 -42 27 -33 Q44 -28 49 -13 Q57 4 45 18 Q33 33 7 36 Q-20 38 -35 20 Q-45 10 -62 4 Z';
  path(outline,grad(-15,-34,12,35,['#8f6837','#534e37','#565143','#332e2a','#221f21']),'#362d28',1.1);
  c.save(); c.clip(new Path2D(outline));
  // Scalloped body contour feathers, alternating copper and iridescent teal.
  const tones=['#8f633e','#a37847','#526b55','#766646','#7c6244','#727957'];
  for(let row=0; row<8; row++) {
    for(let col=0; col<15; col++) {
      const grain=Math.sin(col*42.37+row*11.09);
      const a=-56+col*8+(row%2)*4+grain*1.5, b=-31+row*8+2*Math.sin(col*0.5)+grain;
      c.save(); c.translate(a,b); c.rotate(-0.38+0.11*grain);c.scale(1+grain*0.08,1+grain*0.12);
      path('M-4 -3 Q0 -6 4 -3 L4 0 Q2 5 -1 6 Q-4 5 -5 1 Z',
        tones[(col*17+row*7)%tones.length]);
      path('M-5 0 Q-4 6 -1 6 Q3 5 4 1',null,'#39372c',1.1);
      path('M0 -3 L-1 3 M-1 1 l-2 -2',null,'#ab9266',0.48);
      path('M-4 0 Q-3 4 -1 4 Q2 3 3 1',null,row<4?'#c0975b':'#96825a',0.8);
      c.restore();
    }
  }
  c.restore();
  if(strut)c.restore();
  // Folded barred flight feathers sit below a shield of shoulder coverts.
  c.save(); c.translate(-4,-12);
  for(let j=0;j<7;j++) {
    c.save(); c.translate(3-j*1.2,j*1.4); c.rotate(-0.23-j*0.044);
    const shape='M7 -4 Q-17 -10 -50 -4 Q-59 -1 -60 3 Q-44 9 -10 6 Q2 5 7 1 Z';
    path(shape,'#4d4136','#403730',0.7);
    c.save(); c.clip(new Path2D(shape));
    for(let k=11;k<65;k+=6.7) line([[-k-4,-9],[-k+2,9]],'#c9af89',2.8);
    line([[3,1],[-58,2]],'#8b765e',0.8); c.restore(); c.restore();
  }
  const wing='M15 -8 Q24 3 10 14 Q-10 27 -38 20 Q-48 17 -47 11 Q-37 3 -24 -4 Q-2 -16 15 -8 Z';
  path(wing,grad(-20,-12,0,23,['#96713f','#886443','#5d4936']),'#4e4131',0.8);
  c.save(); c.clip(new Path2D(wing));
  for(let r=0;r<4;r++) for(let i=0;i<8;i++){
    const a=-38+i*8+(r%2)*4,b=-6+r*7;
    path('M'+(a-3)+' '+b+' q-4 5 -3 7 q4 2 8 -3',null,'#b18c5b',1.3);
  } c.restore(); c.restore();

  if(flying){
    const stroke=Math.sin(cycle);
    // Two articulated vanes: the elbow unfolds first and the long wrist feathers follow.
    c.save();c.translate(9,-13);
    const ex=-10-15*Math.cos(cycle),ey=-12+34*stroke;
    const wx=ex-16-10*Math.cos(cycle-0.38),wy=ey+25*Math.sin(cycle-0.38);
    path('M0 -3 Q'+ex+' '+(ey-9)+' '+wx+' '+wy+' L'+(wx-6)+' '+(wy+9)+' Q'+(ex-5)+' '+(ey+11)+' -12 7 Z',
      grad(0,-35,0,40,['#876641','#9e784c','#5a4736']),'#5d4936',1.2);
    for(let i=0;i<10;i++){
      const ratio=i/9, tx=wx-15-19*ratio,ty=wy+(8+34*ratio)*Math.sin(cycle-0.48)+i*0.95;
      c.save();c.translate(wx+(1-ratio)*12,wy+(1-ratio)*4);
      const dx=tx-(wx+(1-ratio)*12),dy=ty-(wy+(1-ratio)*4);
      c.rotate(Math.atan2(dy,dx));c.scale(Math.max(10,Math.hypot(dx,dy))/42,1);
      const primary='M0 -3 Q19 -5 39 -2 Q44 -1 43 1 Q25 5 0 3 Z';
      path(primary,['#6d5742','#867057','#7a6046'][i%3],'#41392e',0.7);
      c.save();c.clip(new Path2D(primary));
      for(let j=6;j<39;j+=7)line([[j,-6],[j+3,6]],'#ceb893',2.5);
      c.restore();c.restore();
    }
    c.restore();wingPoint=[9+wx,-13+wy];
  }

  const neckX=running?8:0;
  let headX=44+neckX+(alert?4:0)+(look?-10:0)+(walking?3*wave:0);
  let headY=-58+(alert?-7:0)+(look?-9:0)+(running?12:0)+wave*0.7;
  if(strut){headX=44+wave*1.2;headY=-45+2*wave;}
  if(flying){headX=59;headY=-36+2*wave;}
  if(brake){headX+=4*Math.cos(cycle);headY-=2*Math.sin(cycle);}
  if(peck){headX=47+30*dip;headY=-48+103*dip;}
  if(scratching){headX+=10;headY+=14;}
  const elbowX=headX-(peck?11:3), elbowY=headY+13;
  const neck='M25 -23 Q37 -36 '+(elbowX-7)+' '+elbowY+' Q'+(headX-8)+' '+(headY-4)+' '+headX+' '+(headY-4)+' Q'+(headX+6)+' '+headY+' '+(elbowX+4)+' '+(elbowY+3)+' Q'+(peck?55:39)+' -13 44 -7 Q38 -4 31 -12 Z';
  path(neck,grad(headX,headY,34,-11,['#7babb1','#798f96','#af635d','#973f37']),'#674842',0.9);
  // Caruncled throat and the long, fine chest beard.
  ellipse(40,-16,5,8,-0.1,'#a65040'); ellipse(42,-16,2,5,-0.1,'#cc7961');
  const beardX=47+(brake?7:running?-6:0)+wave*1.0;
  const beardY=30+(running?-2:0);
  for(let k=0;k<7;k++) path('M'+(43+k*0.5)+' -1 Q49 13 '+(beardX+k*0.44)+' '+(beardY-((k*3)%4)),null,k%2?'#322f29':'#211f20',1.05);
  c.save(); c.translate(headX,headY); c.rotate(peck?0.53:look?-0.30:0);
  ellipse(0,0,9.6,8.2,-0.12,grad(-3,-8,2,8,['#b7d0c5','#82a9aa','#81959b']));
  path('M5 -2 Q13 -3 20 2 Q15 4 7 4 Z','#c4a67c','#695444',0.7);
  path('M5 -4 Q10 -5 12 -1 Q12 5 15 7 Q11 9 9 4 Z','#bc5b51');
  ellipse(3,-2,2.7,2.2,0,'#65483b'); ellipse(3.4,-2.1,1.8,1.8,0,'#1e2020'); ellipse(3.9,-2.7,0.55,0.55,0,'#fff3d1');
  for(let k=0;k<7;k++) ellipse(-6+(k%3)*2.7,2+Math.floor(k/3)*1.8,0.8,0.6,0,k%2?'#c78f82':'#ad7570');
  c.restore(); c.restore();
  anchors.push([beardX*Math.cos(pitch)-beardY*Math.sin(pitch),-73+lift+beardX*Math.sin(pitch)+beardY*Math.cos(pitch)]);
  for(const [a,b] of [fanPoint,wingPoint,[headX+10,headY+2]]){
    anchors.push([a*Math.cos(pitch)-b*Math.sin(pitch),-73+lift+a*Math.sin(pitch)+b*Math.cos(pitch)]);
  }
  return anchors.map(([a,b])=>[x+scale*a,y+scale*b]);
}



// phase is a running cycle in radians. The feeding pose keeps the nut in both paws.
function drawSquirrel(ctx, x, y, scale, phase, hasNut, facing = 1) {
  const c = ctx, wave = Math.sin(phase), beat = Math.cos(phase);
  c.save(); c.translate(x,y); c.scale(scale*facing,scale);
  c.lineCap = 'round'; c.lineJoin = 'round';
  function path(d, fill, stroke, width=1) {
    const p=new Path2D(d);
    if(fill){c.fillStyle=fill;c.fill(p);}
    if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke(p);}
  }
  function oval(x,y,w,h,angle,color){
    c.beginPath(); c.ellipse(x,y,w,h,angle,0,Math.PI*2);c.fillStyle=color;c.fill();
  }
  function wash(a,b,top,bottom){
    const g=c.createLinearGradient(0,a,0,b);g.addColorStop(0,top);g.addColorStop(1,bottom);return g;
  }
  const seated=hasNut, lift=seated?0:Math.max(0, wave)*3;
  c.translate(0,-lift);
  // Plume rolls out from the rump and returns over the back.
  c.save(); c.translate(-11,-12); c.rotate(seated?wave*0.025:wave*0.12-0.18);
  path('M3 3 C-10 10 -23 5 -28 -7 C-36 -23 -33 -43 -23 -49 Q-15 -54 -9 -46 Q-4 -38 -9 -30 Q-9 -40 -16 -35 C-20 -28 -14 -25 -12 -16 Q-6 -3 3 -3 Z',
    wash(-49,9,'#cf7740','#8c402b'),'#713926',1.15);
  for(let i=0;i<13;i++) {
    const yy=-42+i*3.4, xx=-25+Math.sin(i*0.35)*-3;
    path('M'+xx+' '+yy+' q-4 -6 -2 -10',null,i%2?'#eba46b':'#b45c36',0.9);
    if(i<10) path('M'+(xx+4)+' '+(yy+1)+' q-3 -7 0 -11',null,'#dc8850',0.9);
  } c.restore();
  if(!seated){
    c.save();c.translate(-5,-9);c.rotate(0.38*wave);
    path('M-3 -2 Q-9 1 -13 5 L-20 7 Q-21 9 -17 9 L-8 8 Q-4 5 3 2 Z','#924a32','#78422e',0.9);c.restore();
    c.save();c.translate(11,-12);c.rotate(-0.48*wave);
    path('M-2 -2 Q-1 4 3 9 L11 10 Q13 9 10 8 L6 6 L4 -2 Z','#a95433','#78422e',0.9);c.restore();
  }
  c.save();
  if(seated){c.translate(-1,0);c.rotate(-0.24);}
  path('M-18 -11 C-20 -20 -15 -27 -8 -28 Q3 -31 10 -23 Q17 -19 19 -12 Q19 -4 9 -3 Q3 -3 -2 -5 Q-15 1 -18 -11 Z',
    wash(-31,-2,'#c46c3d','#914328'),'#713f2e',1);
  path('M2 -7 Q11 -11 10 -22 Q17 -23 19 -17 Q23 -8 13 -4 Q7 -3 2 -7 Z',
    wash(-23,-4,'#e3b88f','#cf996d'));
  oval(-9,-12,9.3,9,-0.35,'#aa5533');
  path('M-14 -12 Q-11 -18 -6 -17',null,'#cb7950',1.1);
  const step=seated?0:beat*4.5;
  path('M-11 -7 Q-9 -4 -13 -2 Q-13 0 -8 0 L'+(1+step)+' 0 Q'+(4+step)+' -1 '+(1+step)+' -2 L-5 -4 Q-1 -10 -6 -13 Z','#ac5938','#81432f',0.8);
  c.save(); c.translate(15,-23);c.rotate(seated?0.18+0.04*beat:0.07*wave);
  path('M-5 -3 Q-9 -11 -7 -17 Q-3 -15 0 -6 Z','#8d472f','#753c2b',0.8);
  path('M-2 -5 Q-4 -13 -1 -18 Q4 -12 3 -4 Z','#ba633a','#713c2b',0.9);
  path('M0 -7 Q-1 -12 0 -14 Q2 -11 2 -7 Z','#da9876');
  path('M-7 -2 Q-4 -9 3 -7 Q7 -6 10 -3 L15 0 Q16 2 11 4 Q3 8 -3 5 Q-7 4 -7 -2 Z',
    wash(-8,6,'#c7784b','#ae5a38'),'#78452f',0.9);
  path('M4 3 Q10 3 13 1 Q16 2 12 4 Q8 7 3 6 Z','#ddb189');
  oval(13.6,0.5,1.7,1.15,0,'#49332e');oval(4.4,-3.2,2.25,2.2,0,'#e9be88');oval(4.6,-3.3,1.6,1.7,0,'#252322');oval(5,-3.9,0.48,0.46,0,'#ffeed5');
  path('M10 2.2 l9 -1 M10 2.9 l8 1.8',null,'#775644',0.45);
  c.restore();
  if(seated) {
    c.save();c.translate(22+0.2*wave,-17+0.8*beat);c.rotate(-0.27);
    path('M-3.2 -2 Q-4 2 0 5 Q3.7 3 3.6 -2 Z',wash(-2,5,'#cf8c46','#9b572a'),'#6b3f23',0.65);
    path('M-4 -1.5 Q-4 -5 0 -5 Q4 -5 4.1 -1.5 Q1 0 -4 -1.5 Z','#745036','#603d28',0.7);
    path('M0 -4.8 l1 -2',null,'#63452d',0.9);
    c.restore();
    path('M12 -16 Q15 -13 19 -16 L21 -17 Q23 -16 21 -15 Q19 -12 15 -11 Q10 -11 9 -15 Z','#b76442','#874932',0.65);
  }
  c.restore(); c.restore();
}


function nut(x,y,a=0,size=1){
 c.save();c.translate(x,y);c.rotate(a);c.scale(size,size);
 c.fillStyle='#e9a64e';c.strokeStyle='#4a251b';c.lineWidth=1.5;
 c.beginPath();c.moveTo(-6,-3);c.quadraticCurveTo(-7,5,0,9);c.quadraticCurveTo(7,6,7,-3);c.closePath();c.fill();c.stroke();
 c.fillStyle='#714529';c.beginPath();c.ellipse(0,-3,8,4.4,0,0,7);c.fill();c.stroke();
 c.beginPath();c.moveTo(0,-6);c.quadraticCurveTo(1,-11,5,-11);c.stroke();c.restore();
}
function leaves(x,y,p){
 for(let i=0;i<12;i++){
  const side=i%2?1:-1, v=(i*31)%17;
  c.save();c.translate(x+side*(5+v+p*(16+v)),y-2-Math.sin(p*Math.PI)*(14+v)+i%3);
  c.rotate(i+p*side*3);c.fillStyle=['#dd833e','#b3482e','#e6b151'][i%3];
  c.beginPath();c.moveTo(-6,0);c.quadraticCurveTo(-1,-5,7,0);c.quadraticCurveTo(-1,4,-6,0);c.fill();c.restore();
 }
}
const gobble=new Audio('data:audio/mpeg;base64,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aLfooo6SSTUkv/rRR0Uekl3/1PRMS660UUf6knWYl10TVGpL60WUZF5kknv/+3jE8QAuBh0gGd4AAqTE3UOfAAAoyLzKSSS///1t0knWXSdcxLqLaKNFFqVaP6knqS9JJvqMi8ySST0UUetFqkuiiiomiLGpkXjZ1UxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3jEMgPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3jEMgPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3jEMgPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3jEMgPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3jEMgPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3jEMgPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+3jEMgPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=');
function callTurkey(){gobble.currentTime=0;gobble.volume=1;gobble.play().catch(()=>{});}
function sound(){
 const A=window.AudioContext||window.webkitAudioContext;
 if(!A)return;
 if(!audio){audio=new A();noise=audio.createBuffer(1,audio.sampleRate*.18,audio.sampleRate);
 let data=noise.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(1-i/data.length)**2;}
 if(audio.state==='suspended')audio.resume().catch(()=>{});
}
function crunch(amount=1){
 if(!audio||$('#sound').getAttribute('aria-pressed')!=='true')return;
 const src=audio.createBufferSource(),filter=audio.createBiquadFilter(),vol=audio.createGain();
 src.buffer=noise;filter.type='bandpass';filter.frequency.value=1700+Math.random()*500;vol.gain.value=.55*amount;
 src.connect(filter).connect(vol).connect(audio.destination);src.start();src.onended=()=>{src.disconnect();filter.disconnect();vol.disconnect();};
}
