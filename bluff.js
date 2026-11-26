'use strict';
const $=s=>document.querySelector(s),canvas=$('canvas'),c=canvas.getContext('2d'),dlg=$('dialog');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const key='bogan-bluff-v1',side=['left','right'],names=['The first acorn','The squirrel’s bluff','The last acorn'];
let audio=null,noise=null,clock=0,previous=0,start=0,action=null,transform=null,fromButton=null,hop=false;
const fresh=()=>({seed:Math.floor(Math.random()*1048576),round:0,score:0,miss:false,stage:'choose',end:'',muted:false});
let state=fresh(),restored=false;
try{const s=JSON.parse(localStorage.getItem(key));if(s&&Number.isInteger(s.seed)&&[0,1,2].includes(s.round)&&['choose','found','ending','done'].includes(s.stage)&&Number.isInteger(s.score)){state=s;restored=s.stage!=='done'}}catch{}
function save(){try{localStorage.setItem(key,JSON.stringify(state))}catch{}}
function truePile(){return state.round===0?0:(state.seed>>(state.round*3))&1}
function spots(){const offset=state.round===0?0:((state.seed>>5)%29)-14;return [405+offset,680-offset]}
function enableAudio(){if(!state.muted)sound()}
function call(){if(!state.muted){sound();callTurkey()}}
function button(label,fn,primary=false){const b=document.createElement('button');b.textContent=label;if(primary)b.className='primary';b.onclick=fn;$('#choices').append(b);return b}
function modal(title,msg,close='Back to game'){if(dlg.open)return;fromButton=document.activeElement;gobble.pause();$('#dialogTitle').textContent=title;$('#dialogText').textContent=msg;$('#close').textContent=close;dlg.showModal();$('#close').focus()}
function anatomy(){const wing=state.round===2&&hop;const tail=state.stage==='done';modal(tail?'Tail fan':wing?'Wing':'Toes',tail?'A tom spreads his long tail feathers into a fan when he struts.':wing?'Tom pushes off with his legs, then beats his wings to reach the log.':'Tom balances on one foot and rakes leaves backward with the toes of the other.','Hide anatomy')}
function render(focus=false){
 const {round,stage,miss,score}=state;
 const found=round+(stage==='choose'?0:1);
 $('#tally').textContent=found+' of 3 acorns · '+score+' leaves';
 $('#sound').textContent=state.muted?'Sound off':'Sound on';$('#sound').setAttribute('aria-pressed',String(!state.muted));
 $('#greeting').hidden=stage!=='done';$('#choices').replaceChildren();
 let title=names[round],msg='';
 if(stage==='choose'){
 msg=miss?'Only a tail! Watch for two bumps, then try again.':round===0?'Help Tom find three acorns. One rolled into the left pile.':round===1?'One pile flutters. One rolls twice. Where did the acorn go?':'The squirrel points across the log. Do you believe him?';
 const options=round===0?[0]:[0,1];
 for(const i of options)button(round===0?'Scratch the left pile':(i?'Right pile':'Left pile'),()=>scratch(i),true);
 if(round>0){
 button('Look again',()=>{start=clock;enableAudio();$('#message').textContent='Watch both piles again.'});
 button('Describe clue',()=>modal('Under the leaves','The '+side[1-truePile()]+' leaves flutter straight up. Two low bumps travel across the '+side[truePile()]+' pile.'));
 if(round===2&&!hop)button('Hop onto the log',()=>animate('hop',truePile()));
 if(hop)button('Discover the wing',anatomy);
 }
 }else if(stage==='found'){
 title='Tom found it!';msg=miss?'One leaf earned. Tom knows that trick now.':'Two leaves for finding it on the first try.';
 button(round===2?'Bring the acorns home':'Follow the squirrel',()=>{if(round===2)state.stage='ending';else{state.round++;state.stage='choose';state.miss=false}hop=false;start=clock;save();render(true)},true);
 button('How did Tom do that?',anatomy);
 }else if(stage==='ending'){
 title='One acorn left to give';msg='Two are in the cornucopia. The squirrel looks at the last one.';
 for(const [label,id] of [['Share with Squirrel','share'],['Carry it to dinner','dinner']])button(label,()=>{state.end=id;state.stage='done';start=clock;save();call();render(true)},true);
 }else{
 title='Golden Acorn earned';msg=(state.end==='share'?'The squirrel offers half back.':'Your dinner guest wears an acorn cap.')+' Three acorns found. '+score+' of 6 leaves. Gobble, gobble!';
 button('Play a new trail',()=>restart(false),true);button('Pass this trail',()=>restart(true));button('Gobble!',call);button('Discover the tail fan',anatomy);button('Save badge',badge);
 }
 $('#headline').textContent=title;$('#message').textContent=msg;if(focus)$('#choices button')?.focus({preventScroll:true});
}
function restart(same){let seed=state.seed,muted=state.muted;state=fresh();if(same)state.seed=seed;else if((seed&408)===(state.seed&408))state.seed^=8;state.muted=muted;start=clock;hop=false;save();render(true)}
function animate(kind,i){if(action||dlg.open)return;enableAudio();action={kind,i,at:clock};for(const b of $('#choices').children)b.disabled=true;if(kind==='scratch'){crunch(.55);if(state.round===0)call()}}
function scratch(i){if(state.stage!=='choose'||(state.round===0&&i!==0))return;animate('scratch',i)}
function settle(){const {kind,i}=action;action=null;if(kind==='hop'){hop=true;start=clock}else if(i===truePile()){state.score+=state.miss?1:2;state.stage='found';crunch(1)}else{state.miss=true;start=clock;crunch(.6)}save();render(true)}
$('#close').onclick=()=>dlg.close();dlg.onclose=()=>{previous=0;if(fromButton?.isConnected)fromButton.focus({preventScroll:true})};
$('#pause').onclick=()=>modal('Paused','Tom will wait right here.','Resume');$('#help').onclick=()=>modal('How to play','Find three acorns. Choose a pile where you see two traveling bumps. Look again or Describe clue whenever you like. A wrong guess lets you retry. Anatomy closes with Hide anatomy.');
$('#sound').onclick=()=>{state.muted=!state.muted;if(state.muted)gobble.pause();else call();save();$('#sound').textContent=state.muted?'Sound off':'Sound on';$('#sound').setAttribute('aria-pressed',String(!state.muted))};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!dlg.open)modal('Paused','Your trail is saved.','Resume')});
canvas.onclick=e=>{if(!transform||action||dlg.open)return;const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left-transform.x)/transform.s,y=(e.clientY-r.top-transform.y)/transform.s;if(y<432||y>518)return;spots().forEach((p,i)=>{if(Math.abs(x-p)<57)scratch(i)})};
function badge(){const b=document.createElement('canvas');b.width=680;b.height=380;const g=b.getContext('2d');g.fillStyle='#203e32';g.fillRect(0,0,680,380);g.strokeStyle='#efc579';g.strokeRect(14,14,652,352);g.fillStyle='#ffe2a7';g.textAlign='center';g.font='bold 46px Georgia';g.fillText('Golden Acorn',340,110);g.font='26px Georgia';g.fillText('3 acorns recovered · '+state.score+' of 6 leaves',340,175);g.fillText('Thanksgiving 2026 · Bogans & Family',340,251);g.font='20px Georgia';g.fillText('Love, Uncle/Brother Bob in Las Vegas',340,302);const a=document.createElement('a');a.download='Golden-Acorn-2026.png';a.href=b.toDataURL();a.click()}
function label(x,y,text){c.font='bold 18px system-ui';c.textAlign='center';let w=c.measureText(text).width+22;c.fillStyle='#18382f';c.beginPath();c.roundRect(x-w/2,y-18,w,27,10);c.fill();c.fillStyle='#fff4ce';c.fillText(text,x,y+2)}
function paint(now){
 const dt=previous?Math.min(.12,(now-previous)/1000):0;previous=now;if(!dlg.open&&!document.hidden)clock+=dt;
 if(action&&clock-action.at>(reduced.matches?.35:1.35))settle();
 const W=canvas.clientWidth,H=canvas.clientHeight,d=Math.min(devicePixelRatio||1,1.7);
 if(canvas.width!==Math.round(W*d)||canvas.height!==Math.round(H*d)){canvas.width=Math.round(W*d);canvas.height=Math.round(H*d)}
 const s=Math.max(W/1000,H/600),ox=(W-1000*s)/2,oy=Math.min(0,H-600*s+Math.min(65*s,(600*s-H)*.32));
 transform={s,x:ox,y:oy};c.setTransform(d*s,0,0,d*s,d*ox,d*oy);
 const elapsed=clock-start,phase=reduced.matches?1.1:elapsed%4.2,t=reduced.matches?3.6:clock;
 drawForest(c,1000,600,state.stage==='choose'&&state.round?5:t,state.round?10:0);
 const p=spots(),good=truePile(),bad=1-good,active=state.stage==='choose',end=state.stage==='done',age=action?clock-action.at:0;
 if(state.round===2){c.fillStyle='#68503b';c.beginPath();c.roundRect(465,434,113,27,12);c.fill();c.strokeStyle='#bb8b56';c.beginPath();c.moveTo(470,443);c.lineTo(565,439);c.stroke()}
 for(let i=0;i<2;i++){
 const u=Math.min(1,Math.max(0,(phase-.5)/1.7)),arc=Math.abs(Math.sin(u*2*Math.PI));
 const flutter=active&&i===bad&&state.round&&phase<1?Math.sin(phase*Math.PI):0;
 const b=active&&good===i?arc:0;
 for(let k=0;k<4;k++){const travel=(u*3);const mound=Math.max(0,1-Math.abs(k-travel))*b;
 leaves(p[i]-28+k*17,478-Math.sin(k*Math.PI/3)*9-15*mound-14*flutter,action?.i===i?Math.min(1,Math.max(0,age-.5)):0)}
 if(active&&i===good&&(state.round===0||hop)&&phase<2.2)nut(p[i]-46+u*60,455-12*arc,u*5,1);
 label(p[i],508,i?'Right':'Left');
 }
 if(reduced.matches&&active&&state.round)label(p[good],422,'Two rolling bumps');
 let x=hop?520:335,y=hop?434:468,pose=hop?'look':'alert',cycle=t*3;
 if(action){const target=action.kind==='hop'?520:p[action.i]-19,u=Math.min(1,age/.62);x+=(target-x)*u;
 if(action.kind==='hop'){y=468-34*u-76*Math.sin(Math.PI*u);pose='flight';cycle=age*15}
 else{y+=(468-y)*u;pose=u<1?'run':age<.76?'brake':'scratch';cycle=age*10;if(age>.85&&action.i===good)nut(p[good],460-70*Math.sin(Math.min(1,(age-.85)*2)*Math.PI),age*6,1.35)}}
 if(state.stage==='found'){x=p[good]-20;y=468;pose='peck';nut(x+48,465,0,1.25)}
 if(end){x=467;y=468;pose='strut';cycle=Math.min(3,elapsed*4)+.15*Math.sin(t)}
 let sx=end?586:p[bad]+40,sy=end?468:450;
 if(active&&state.round&&phase<1)sy-=Math.sin(Math.PI*phase)*9;
 drawSquirrel(c,sx,sy,.87,t*3,end&&state.end==='share',-1);
 if(end){if(state.end==='share')nut(sx-24,449,.6,.68);else{c.fillStyle='#83552e';c.beginPath();c.ellipse(sx-15,427,10,5,-.18,0,7);c.fill()}}
 drawTurkey(c,x,y,1.27,pose,cycle);
 if(end&&elapsed<3)label(x,318,'Gobble, gobble!');
 requestAnimationFrame(paint);
}
render();if(restored)modal('Welcome back','Your acorns and trail are saved.','Resume');requestAnimationFrame(paint);
