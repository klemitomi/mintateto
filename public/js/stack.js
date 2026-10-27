/* Szétnyíló tetőrétegek (canvas). Használat: initStack({wrap,canvas,leg,variant}) */
(function(){
const TW=640,TH=300,LW=980,LH=850,GAP=54,NX=.38;
const U=[.98,-.26],V=[.42,-.46],OR=[190,790];
const P=(u,v,d=0)=>[OR[0]+u*U[0]+v*V[0]+d*NX,OR[1]+u*U[1]+v*V[1]+d];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sm=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const rng=s=>()=>((s=(s*1664525+1013904223)>>>0)/4294967296);
function T(seed,fn){const S=2,c=document.createElement("canvas");c.width=TW*S;c.height=TH*S;const x=c.getContext("2d");x.scale(S,S);fn(x,rng(seed));return c}
function wood(x,X,Y,W,H,r,vert){
  x.save();x.beginPath();x.rect(X,Y,W,H);x.clip();
  const g=vert?x.createLinearGradient(X,0,X+W,0):x.createLinearGradient(0,Y,0,Y+H);
  g.addColorStop(0,"#caa062");g.addColorStop(.5,"#b98b50");g.addColorStop(1,"#a37640");x.fillStyle=g;x.fillRect(X,Y,W,H);
  const len=vert?H:W,n=Math.max(8,(vert?W:H)*1.1|0);
  for(let i=0;i<n;i++){const off=r()*(vert?W:H),ph=r()*6,am=.6+r()*1.8;
    x.strokeStyle=r()<.55?"rgba(70,40,15,"+(.08+r()*.2)+")":"rgba(255,228,175,"+(.06+r()*.12)+")";x.lineWidth=.5+r()*.9;x.beginPath();
    for(let s=0;s<=len;s+=5){const w=Math.sin(s*.03+ph)*am;const px=vert?X+off+w:X+s,py=vert?Y+s:Y+off+w;s?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}
  if(r()<.8){const kx=X+W*(.25+r()*.5),ky=Y+H*(.15+r()*.7);for(let k=4;k>0;k--){x.strokeStyle="rgba(60,32,10,"+(.1+k*.05)+")";x.lineWidth=1;x.beginPath();x.ellipse(kx,ky,k*(vert?1.5:3.4),k*(vert?3.4:1.5),0,0,7);x.stroke()}}
  x.restore()}
function strip(x,X,Y,W,H,r,vert){x.save();x.shadowColor="rgba(0,0,0,.55)";x.shadowBlur=5;x.shadowOffsetX=2;x.shadowOffsetY=3;x.fillStyle="#b98b50";x.fillRect(X,Y,W,H);x.restore();wood(x,X,Y,W,H,r,vert)}
const RAF=[...Array(6)].map((_,i)=>24+i*118);
const BATT=[...Array(5)].map((_,i)=>[RAF[i]+27,RAF[i+1]-1]);
const PVM=[];for(let j=0;j<2;j++)for(let i=0;i<3;i++)PVM.push([27+i*198,28+j*120,190,112]);
const TEX={
 raf:T(1,(x,r)=>{RAF.forEach(u=>wood(x,u,0,26,TH,r,true))}),
 vapor:T(2,(x,r)=>{const g=x.createLinearGradient(0,0,TW,TH);g.addColorStop(0,"#bdd0dc");g.addColorStop(.5,"#9fb8c9");g.addColorStop(1,"#c6d6e0");x.fillStyle=g;x.fillRect(0,0,TW,TH);
  x.fillStyle="rgba(255,255,255,.2)";x.fillRect(0,TH*.55,TW,3);x.fillStyle="rgba(20,45,70,.28)";x.fillRect(0,TH*.55+3,TW,2);
  for(let i=0;i<110;i++){const x0=r()*TW,y0=r()*TH,len=30+r()*80,a=r()*Math.PI;x.strokeStyle=r()<.5?"rgba(255,255,255,.38)":"rgba(25,55,85,.2)";x.lineWidth=.8;x.beginPath();x.moveTo(x0,y0);x.quadraticCurveTo(x0+Math.cos(a)*len*.5+r()*9,y0+Math.sin(a)*len*.5+r()*9,x0+Math.cos(a)*len,y0+Math.sin(a)*len);x.stroke()}
  [TW*.33,TW*.7].forEach(tx=>{x.fillStyle="#d7dfe4";x.fillRect(tx,0,11,TH);x.fillStyle="rgba(0,0,0,.14)";x.fillRect(tx,0,1.5,TH);x.fillRect(tx+9.5,0,1.5,TH)});
  x.strokeStyle="rgba(255,255,255,.5)";x.lineWidth=2;x.strokeRect(1,1,TW-2,TH-2)}),
 ins:T(3,(x,r)=>{x.fillStyle="#e4d27c";x.fillRect(0,0,TW,TH);
  for(let i=0;i<3600;i++){const px=r()*TW,py=r()*TH,l=3+r()*8,a=r()*Math.PI;x.strokeStyle=r()<.5?"rgba(255,246,190,"+(.25+r()*.3)+")":"rgba(150,125,40,"+(.18+r()*.25)+")";x.lineWidth=.6;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke()}
  const g=x.createLinearGradient(0,0,TW,TH);g.addColorStop(0,"rgba(255,255,255,.2)");g.addColorStop(.5,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(0,0,0,.12)");x.fillStyle=g;x.fillRect(0,0,TW,TH);
  x.globalCompositeOperation="destination-in";x.fillStyle="#000";BATT.forEach(b=>x.fillRect(b[0],0,b[1]-b[0],TH));x.globalCompositeOperation="source-over";
  BATT.forEach(b=>{x.strokeStyle="rgba(95,78,20,.8)";x.lineWidth=1.6;x.strokeRect(b[0]+.8,.8,b[1]-b[0]-1.6,TH-1.6)})}),
 osb:T(4,(x,r)=>{x.fillStyle="#c79a5b";x.fillRect(0,0,TW,TH);const pal=["#b98648","#d6aa6e","#c19153","#a97a40","#dcb77f"];
  for(let i=0;i<1100;i++){x.save();x.translate(r()*TW,r()*TH);x.rotate((r()-.5)*1.2);x.fillStyle=pal[(r()*5)|0];x.globalAlpha=.5+r()*.4;const w=12+r()*28,h=4+r()*6;x.fillRect(-w/2,-h/2,w,h);x.restore()}
  x.globalAlpha=1;const sw=320,sh=150;x.strokeStyle="rgba(50,30,10,.7)";x.lineWidth=2;
  for(let j=0;j<=2;j++){const y=j*sh;x.beginPath();x.moveTo(0,y);x.lineTo(TW,y);x.stroke();const off=(j%2)*sw/2;for(let k=-1;k<3;k++){const px=off+k*sw;x.beginPath();x.moveTo(px,y);x.lineTo(px,y+sh);x.stroke()}}
  x.fillStyle="#6a6f75";for(let j=0;j<=2;j++)for(let k=0;k<17;k++){x.beginPath();x.arc(k*40+8,j*sh+5,1.5,0,7);x.fill()}
  x.strokeStyle="rgba(50,30,10,.6)";x.lineWidth=1.6;x.strokeRect(1,1,TW-2,TH-2)}),
 under:T(5,(x,r)=>{const g=x.createLinearGradient(0,0,0,TH);g.addColorStop(0,"#4c545d");g.addColorStop(1,"#353b43");x.fillStyle=g;x.fillRect(0,0,TW,TH);
  for(let y=0;y<TH;y+=100){x.fillStyle="rgba(255,255,255,.14)";x.fillRect(0,y,TW,2);x.fillStyle="rgba(0,0,0,.35)";x.fillRect(0,y+2,TW,3);x.fillStyle="rgba(255,255,255,.35)";for(let k=0;k<30;k++)x.fillRect(10+k*21,y+20,9,2)}
  for(let i=0;i<60;i++){const x0=r()*TW,y0=r()*TH;x.strokeStyle="rgba(255,255,255,"+(.04+r()*.07)+")";x.lineWidth=1;x.beginPath();x.moveTo(x0,y0);x.lineTo(x0+30+r()*60,y0+(r()-.5)*8);x.stroke()}
  x.strokeStyle="rgba(0,0,0,.45)";x.lineWidth=2;x.strokeRect(1,1,TW-2,TH-2)}),
 cnt:T(6,(x,r)=>{[40,190,340,490].forEach(u=>strip(x,u,0,14,TH,r,true))}),
 bat:T(7,(x,r)=>{for(let k=0;k<7;k++)strip(x,0,14+k*42,TW,12,r,false)}),
 tile:T(8,(x,r)=>{x.fillStyle="#1f2429";x.fillRect(0,0,TW,TH);const rh=25,tw=46,rows=Math.ceil(TH/rh)+1;
  for(let j=0;j<rows;j++){const y0=j*rh-10,off=(j%2)*tw/2;for(let k=-1;k<Math.ceil(TW/tw)+1;k++){const X=off+k*tw,v=(r()-.5)*14;x.save();x.shadowColor="rgba(0,0,0,.6)";x.shadowBlur=5;x.shadowOffsetY=3;
    const g=x.createLinearGradient(0,y0,0,y0+rh+10);g.addColorStop(0,`rgb(${62+v},${70+v},${79+v})`);g.addColorStop(.72,`rgb(${78+v},${88+v},${98+v})`);g.addColorStop(1,`rgb(${44+v},${51+v},${58+v})`);x.fillStyle=g;
    x.beginPath();x.moveTo(X+1,y0);x.lineTo(X+tw-1,y0);x.lineTo(X+tw-1,y0+rh+4);x.quadraticCurveTo(X+tw-1,y0+rh+10,X+tw-6,y0+rh+10);x.lineTo(X+6,y0+rh+10);x.quadraticCurveTo(X+1,y0+rh+10,X+1,y0+rh+4);x.closePath();x.fill();x.restore();
    x.strokeStyle="rgba(255,255,255,.2)";x.lineWidth=1;x.beginPath();x.moveTo(X+6,y0+rh+9.5);x.lineTo(X+tw-6,y0+rh+9.5);x.stroke();
    x.strokeStyle="rgba(0,0,0,.28)";x.beginPath();x.moveTo(X+tw*.36,y0+2);x.lineTo(X+tw*.36,y0+rh+6);x.moveTo(X+tw*.68,y0+2);x.lineTo(X+tw*.68,y0+rh+6);x.stroke()}}}),
 rail:T(9,(x,r)=>{[58,236].forEach(y=>{x.save();x.shadowColor="rgba(0,0,0,.5)";x.shadowBlur=5;x.shadowOffsetY=3;const g=x.createLinearGradient(0,y,0,y+9);g.addColorStop(0,"#e3e8ec");g.addColorStop(1,"#8d98a1");x.fillStyle=g;x.fillRect(8,y,TW-16,9);x.restore()})}),
 pv:T(10,(x,r)=>{PVM.forEach(([X,Y,W,H])=>{x.save();x.shadowColor="rgba(0,0,0,.5)";x.shadowBlur=6;x.shadowOffsetY=3;const f=x.createLinearGradient(X,Y,X+W,Y+H);f.addColorStop(0,"#e1e7eb");f.addColorStop(1,"#8a959e");x.fillStyle=f;x.fillRect(X,Y,W,H);x.restore();
   const m=5,gl=x.createLinearGradient(X,Y,X+W,Y+H);gl.addColorStop(0,"#13294a");gl.addColorStop(.55,"#0c1d36");gl.addColorStop(1,"#18385f");x.fillStyle=gl;x.fillRect(X+m,Y+m,W-2*m,H-2*m);
   const cw=(W-2*m)/12,ch=(H-2*m)/6;for(let i=0;i<12;i++)for(let j=0;j<6;j++){const cx0=X+m+i*cw,cy0=Y+m+j*ch;x.fillStyle="rgba(70,120,190,"+(.1+r()*.12)+")";x.fillRect(cx0+.8,cy0+.8,cw-1.6,ch-1.6);x.strokeStyle="rgba(190,210,235,.22)";x.lineWidth=.5;x.beginPath();x.moveTo(cx0+cw*.33,cy0);x.lineTo(cx0+cw*.33,cy0+ch);x.moveTo(cx0+cw*.66,cy0);x.lineTo(cx0+cw*.66,cy0+ch);x.stroke()}
   x.strokeStyle="rgba(190,210,235,.45)";x.lineWidth=.8;x.strokeRect(X+m,Y+m,W-2*m,H-2*m);
   const rf=x.createLinearGradient(X,Y,X+W*.8,Y+H);rf.addColorStop(0,"rgba(255,255,255,.2)");rf.addColorStop(.35,"rgba(255,255,255,.03)");rf.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=rf;x.fillRect(X+m,Y+m,W-2*m,H-2*m)})})
};

/* napelemes tetőcserép textúra: cserépsorok, köztük áramtermelő elemek */
TEX.pvtile=T(11,(x,r)=>{x.fillStyle="#1f2429";x.fillRect(0,0,TW,TH);const rh=25,tw=46,rows=Math.ceil(TH/rh)+1;
  for(let j=0;j<rows;j++){const y0=j*rh-10,off=(j%2)*tw/2;for(let k=-1;k<Math.ceil(TW/tw)+1;k++){const X=off+k*tw,v=(r()-.5)*14,pv=(j>=3&&j<=8&&k>=3&&k<=12);x.save();x.shadowColor="rgba(0,0,0,.6)";x.shadowBlur=5;x.shadowOffsetY=3;
    const g=x.createLinearGradient(0,y0,0,y0+rh+10);
    if(pv){g.addColorStop(0,"#1b3658");g.addColorStop(.7,"#112848");g.addColorStop(1,"#0a1a33")}
    else{g.addColorStop(0,`rgb(${62+v},${70+v},${79+v})`);g.addColorStop(.72,`rgb(${78+v},${88+v},${98+v})`);g.addColorStop(1,`rgb(${44+v},${51+v},${58+v})`)}
    x.fillStyle=g;x.beginPath();x.moveTo(X+1,y0);x.lineTo(X+tw-1,y0);x.lineTo(X+tw-1,y0+rh+4);x.quadraticCurveTo(X+tw-1,y0+rh+10,X+tw-6,y0+rh+10);x.lineTo(X+6,y0+rh+10);x.quadraticCurveTo(X+1,y0+rh+10,X+1,y0+rh+4);x.closePath();x.fill();x.restore();
    if(pv){x.strokeStyle="rgba(190,210,235,.28)";x.lineWidth=.6;x.beginPath();for(let c=1;c<4;c++){x.moveTo(X+c*tw/4,y0+2);x.lineTo(X+c*tw/4,y0+rh+7)}x.moveTo(X+3,y0+rh*.5);x.lineTo(X+tw-3,y0+rh*.5);x.stroke();
      const rf=x.createLinearGradient(X,y0,X+tw,y0+rh);rf.addColorStop(0,"rgba(255,255,255,.16)");rf.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=rf;x.fillRect(X+2,y0+1,tw-4,rh+6);x.strokeStyle="rgba(170,185,200,.5)";x.lineWidth=1;x.strokeRect(X+1.5,y0+.5,tw-3,rh+9)}
    else{x.strokeStyle="rgba(255,255,255,.2)";x.lineWidth=1;x.beginPath();x.moveTo(X+6,y0+rh+9.5);x.lineTo(X+tw-6,y0+rh+9.5);x.stroke();
      x.strokeStyle="rgba(0,0,0,.28)";x.beginPath();x.moveTo(X+tw*.36,y0+2);x.lineTo(X+tw*.36,y0+rh+6);x.moveTo(X+tw*.68,y0+2);x.lineTo(X+tw*.68,y0+rh+6);x.stroke()}}}});
const PVT=[[3*46+23-46,2*25-10,10*46,6*25+12]];

const KIND={
 raf:{t:22,h:22,n:"Szarufák",d:"A tető váza. Itt dől el, hogy elbírja-e a fedést, a havat és szükség esetén a napelemet."},
 vapor:{t:2,h:2,n:"Párazáró fólia",d:"Alulra, a lakótér felőli oldalra kerül. Megállítja a felfelé áramló párát, hogy ne csapódjon le a szerkezetben."},
 ins:{t:0,h:20,n:"Hőszigetelés a szarufák között",d:"A szarufák közé illesztett szigetelés, a szarufákkal azonos magasságban. Ettől lesz télen meleg, nyáron hűvös a padlástér, ezért nem maradhat rés."},
 osb:{t:9,n:"Deszkázat, OSB-lemez",d:"Merev, sík alap a fedésnek. A lemezeket eltolt illesztéssel rakjuk, hogy a tető ne vetemedjen."},
 under:{t:1.5,n:"Alátétfólia",d:"A második védelmi vonal: ami a fedés alá jut (szélhajtotta eső, hó), azt levezeti, a páránál kilép."},
 bat:{t:16,n:"Ellenléc és léc",d:"Az ellenléc szellőzteti a fedés alját, a léc tartja a cserepet. Pontos osztás nélkül nem fekszik fel szépen a fedés."},
 tile:{t:10,n:"Tetőcserép",d:"Ez védi a házat az esőtől és a széltől. Az anyagot a tető formájához és a költségkerethez választjuk."},
 pv:{t:14,n:"Napelem",d:"A kész, stabil szerkezeten termel a nap energiájából. A rögzítési pontokat tömítjük, hogy a tető ne sérüljön."},
 pvtile:{t:10,n:"Napelemes tetőcserép",d:"A fedés része: a cserépsorok között áramtermelő elemek ülnek, a vezetékek a cserép alatt futnak. Egybefüggő, szép felület."}
};
const BASE=["vapor","raf","ins","osb","under","bat"];
const VARS={full:[...BASE,"tile","pv"],pvtile:[...BASE,"pvtile"],structure:[...BASE,"tile"]};

window.initStack=function(o){
  const cv=document.querySelector(o.canvas),cx=cv.getContext("2d"),wrap=document.querySelector(o.wrap),legEl=document.querySelector(o.leg);
  const KS=VARS[o.variant||"full"],LAY=KS.map(k=>KIND[k]);
  legEl.innerHTML=LAY.map((l,i)=>`<li data-i="${i}"><b>0${i+1}</b><div><strong>${l.n}</strong><span>${l.d}</span></div></li>`).join("");
  cv.style.aspectRatio=LW+"/"+LH;
  let K=1,lastAct=-2;
  function fit(){const w=cv.clientWidth||600,d=Math.min(devicePixelRatio||1,1.5);cv.width=Math.round(w*d);cv.height=Math.round(w*d*LH/LW);K=cv.width/LW}
  function poly(pts,fill){cx.beginPath();pts.forEach((q,i)=>i?cx.lineTo(q[0],q[1]):cx.moveTo(q[0],q[1]));cx.closePath();cx.fillStyle=fill;cx.fill()}
  function edges(u0,v0,u1,v1,t,dy,cf,cr){poly([P(u0,v0,dy),P(u1,v0,dy),P(u1,v0,dy+t),P(u0,v0,dy+t)],cf);poly([P(u1,v0,dy),P(u1,v1,dy),P(u1,v1,dy+t),P(u1,v0,dy+t)],cr)}
  function edgesL(X,Y,W,H,t,dy,cf,cr){edges(X,TH-Y-H,X+W,TH-Y,t,dy,cf,cr)}
  function lm(dy){const f=P(0,TH,dy);cx.setTransform(K*U[0],K*U[1],-K*V[0],-K*V[1],K*f[0],K*f[1])}
  function drawTop(tex,dy){lm(dy);cx.drawImage(tex,0,0,tex.width,tex.height,0,0,TW,TH);cx.setTransform(K,0,0,K,0,0)}
  function sweep(dy,p,clipRects){lm(dy);cx.save();if(clipRects){cx.beginPath();clipRects.forEach(q=>cx.rect(q[0],q[1],q[2],q[3]));cx.clip()}
    const sx=((p*4)%1)*(TW+300)-150,g=cx.createLinearGradient(sx-90,0,sx+90,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(.5,"rgba(255,255,255,.13)");g.addColorStop(1,"rgba(255,255,255,0)");
    cx.globalCompositeOperation="lighter";cx.fillStyle=g;cx.fillRect(0,0,TW,TH);cx.restore();cx.setTransform(K,0,0,K,0,0)}
  function shadowOn(e){cx.shadowColor="rgba(0,0,0,"+(.42*e)+")";cx.shadowBlur=14*e*K;cx.shadowOffsetY=GAP*.7*e*K;cx.shadowOffsetX=NX*GAP*.7*e*K}
  function shadowOff(){cx.shadowColor="transparent";cx.shadowBlur=0;cx.shadowOffsetY=0;cx.shadowOffsetX=0}
  function drawKind(k,dy,e,p){
    shadowOn(e);
    if(k==="raf"){RAF.forEach(u=>edges(u,0,u+26,TH,22,dy,"#8a5c2c","#6e4822"));drawTop(TEX.raf,dy)}
    else if(k==="vapor"){edges(0,0,TW,TH,2,dy,"#7e97a8","#6a8294");drawTop(TEX.vapor,dy)}
    else if(k==="ins"){BATT.forEach(b=>{if(e>.15)poly([P(b[1],0,dy),P(b[1],TH,dy),P(b[1],TH,dy+20),P(b[1],0,dy+20)],"#a89a3e");poly([P(b[0],0,dy),P(b[1],0,dy),P(b[1],0,dy+20),P(b[0],0,dy+20)],"#c5b350")});drawTop(TEX.ins,dy)}
    else if(k==="osb"){edges(0,0,TW,TH,9,dy,"#a67a42","#8d6535");drawTop(TEX.osb,dy)}
    else if(k==="under"){edges(0,0,TW,TH,1.5,dy,"#2a2f35","#22262b");drawTop(TEX.under,dy)}
    else if(k==="bat"){[40,190,340,490].forEach(u=>edges(u,0,u+14,TH,8,dy+8,"#8a5c2c","#6e4822"));drawTop(TEX.cnt,dy+8);shadowOff();for(let j=0;j<7;j++)edges(0,14+j*42,TW,26+j*42,8,dy,"#8a5c2c","#6e4822");shadowOn(e);drawTop(TEX.bat,dy)}
    else if(k==="tile"){edges(0,0,TW,TH,10,dy,"#262c32","#1c2126");drawTop(TEX.tile,dy);shadowOff();sweep(dy,p)}
    else if(k==="pvtile"){edges(0,0,TW,TH,10,dy,"#262c32","#1c2126");drawTop(TEX.pvtile,dy);shadowOff();sweep(dy,p)}
    else{edges(8,0,TW-8,TH,4,dy+8,"#6f7a83","#5a646c");drawTop(TEX.rail,dy+8);shadowOff();shadowOn(e*.6);PVM.forEach(m=>edgesL(m[0],m[1],m[2],m[3],8,dy,"#b9c3ca","#7f8a93"));drawTop(TEX.pv,dy);shadowOff();sweep(dy,p,PVM)}
    shadowOff()}
  function render(p){
    const e=sm(p/.3),f=(p-.3)/.7*LAY.length,act=p<.3?-1:Math.min(LAY.length-1,Math.floor(f));
    const wt=i=>p<.3?0:clamp(1.15-Math.abs(f-(i+.5))*1.7,0,1);
    cx.setTransform(1,0,0,1,0,0);cx.clearRect(0,0,cv.width,cv.height);cx.setTransform(K,0,0,K,0,0);
    const gp=P(TW*.5,TH*.4,40),gr=cx.createRadialGradient(gp[0],gp[1],10,gp[0],gp[1],430);gr.addColorStop(0,"rgba(0,0,0,.5)");gr.addColorStop(1,"rgba(0,0,0,0)");
    cx.save();cx.translate(gp[0],gp[1]);cx.scale(1,.3);cx.translate(-gp[0],-gp[1]);cx.fillStyle=gr;cx.beginPath();cx.arc(gp[0],gp[1],430,0,7);cx.fill();cx.restore();
    let tp=0;const dys=[];
    LAY.forEach((L,i)=>{if(i)tp-=L.t;const dy=tp-e*i*GAP;dys.push(dy);
      cx.globalAlpha=1-.28*(1-wt(i))*(p<.3?0:1);drawKind(KS[i],dy,e,p);cx.globalAlpha=1});
    LAY.forEach((L,i)=>{const dy=dys[i],on=i===act;
      const w=wt(i);if(w>.01){cx.globalAlpha=w;cx.strokeStyle="#ffb020";cx.lineWidth=3;cx.beginPath();[[0,0],[TW,0],[TW,TH],[0,TH]].forEach((q,j)=>{const a=P(q[0],q[1],dy);j?cx.lineTo(a[0],a[1]):cx.moveTo(a[0],a[1])});cx.closePath();cx.stroke();cx.globalAlpha=1}
      if(e>.3){const a=P(TW,TH*.5,dy+(L.h||L.t)/2),al=clamp((e-.3)/.4,0,1);cx.globalAlpha=al*(act>=0&&!on?.6:1);
        cx.strokeStyle=on?"#ffb020":"#8896a1";cx.lineWidth=1.5;cx.setLineDash([3,3]);cx.beginPath();cx.moveTo(a[0],a[1]);cx.lineTo(a[0]+34,a[1]);cx.stroke();cx.setLineDash([]);
        cx.fillStyle=on?"#ffb020":"#26323c";cx.beginPath();cx.arc(a[0]+48,a[1],14,0,7);cx.fill();cx.fillStyle=on?"#111a22":"#e9eef1";cx.font="500 13px 'JetBrains Mono',monospace";cx.textAlign="center";cx.textBaseline="middle";cx.fillText(i+1,a[0]+48,a[1]+1);cx.globalAlpha=1}});
    if(act!==lastAct){lastAct=act;[...legEl.children].forEach(li=>li.setAttribute("aria-current",+li.dataset.i===act?"true":"false"))}
  }
  function stackP(){const r=wrap.getBoundingClientRect(),tot=r.height-innerHeight;return clamp(-r.top/tot,0,1)}
  let raf=0;
  function lockLeg(){legEl.style.minHeight="";const keep=[...legEl.children].findIndex(li=>li.getAttribute("aria-current")==="true");let m=0;
    [...legEl.children].forEach((li,i)=>{[...legEl.children].forEach((x,j)=>x.setAttribute("aria-current",i===j?"true":"false"));m=Math.max(m,legEl.getBoundingClientRect().height)});
    [...legEl.children].forEach((x,j)=>x.setAttribute("aria-current",j===keep?"true":"false"));legEl.style.minHeight=Math.ceil(m)+"px"}
  let cur=stackP();
  function loop(){raf=0;const t=stackP(),d=t-cur;cur=Math.abs(d)<.0008?t:cur+d*.22;render(cur);if(cur!==t)raf=requestAnimationFrame(loop)}
  function tick(){if(raf)return;raf=requestAnimationFrame(loop)}
  addEventListener("scroll",tick,{passive:true});
  addEventListener("resize",()=>{fit();lockLeg();cur=stackP();render(cur)});
  fit();lockLeg();render(stackP());
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{lockLeg();render(stackP())});
};
})();
