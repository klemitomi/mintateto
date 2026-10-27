/* Aloldalak közös JS-e: felúszás, parallax, hotspotok, csúszka, hover-képes lista, árbecslő */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
const nf=new Intl.NumberFormat("hu-HU");
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/* felúszó elemek */
if("IntersectionObserver" in window&&!RM){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12,rootMargin:"0px 0px -6% 0px"});
  $$(".rv").forEach((el,i)=>{el.style.setProperty("--d",(i%3)*.08+"s");io.observe(el)});
}else $$(".rv").forEach(el=>el.classList.add("in"));
/* parallax */
let raf=0;
function onScroll(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(RM)return;const sy=scrollY;
  const hb=$("#heroBg");if(hb)hb.style.transform=`translate3d(0,${sy*.18}px,0)`;
  const pl=$(".plan");if(pl)pl.style.transform=`translate3d(0,${-sy*.06}px,0)`;
  $$("[data-par]").forEach(el=>{const r=el.parentElement.getBoundingClientRect(),c=r.top+r.height/2-innerHeight/2;el.style.transform=`translate3d(0,${c*(+el.dataset.par)}px,0)`});
  const b=$("#bandBg");if(b){const br=b.parentElement.getBoundingClientRect();b.style.transform=`translate3d(0,${(br.top+br.height/2-innerHeight/2)*-.12}px,0)`}})}
addEventListener("scroll",onScroll,{passive:true});onScroll();
if(!RM&&$("#hero"))$("#hero").addEventListener("pointermove",e=>{const r=e.currentTarget.getBoundingClientRect(),h=$("#hero");h.style.setProperty("--mx",((e.clientX-r.left)/r.width*100)+"%");h.style.setProperty("--my",((e.clientY-r.top)/r.height*100)+"%")});
/* hotspotos diagram */
const hs=$$(".hs"),dl=$$(".dl li");
function setHs(i){hs.forEach((h,j)=>h.classList.toggle("on",j===i));dl.forEach((l,j)=>l.classList.toggle("on",j===i))}
hs.forEach((h,i)=>{["pointerenter","focus","click"].forEach(ev=>h.addEventListener(ev,()=>setHs(i)))});
dl.forEach((l,i)=>{["pointerenter","click"].forEach(ev=>l.addEventListener(ev,()=>setHs(i)))});
if(hs.length)setHs(0);
/* összehasonlító csúszka */
const ci=$("#cmpIn");if(ci)ci.addEventListener("input",e=>$("#cmp").style.setProperty("--x",e.target.value+"%"));
/* hover-képes lista */
(function(){const pk=$("#peek");if(!pk)return;const im=[...pk.querySelectorAll("img")];let tx=0,ty=0,px=0,py=0,run=false;
  function loop(){px+=(tx-px)*.15;py+=(ty-py)*.15;pk.style.transform=`translate3d(${px+30}px,${py-110}px,0) rotate(${clamp((tx-px)*.05,-6,6)}deg)`;if(run)requestAnimationFrame(loop)}
  $$("#offers li").forEach((li,i)=>{li.addEventListener("pointerenter",e=>{if(e.pointerType==="touch")return;tx=px=e.clientX;ty=py=e.clientY;pk.classList.add("on");im.forEach((m,j)=>m.classList.toggle("on",j===i));if(!run){run=true;loop()}});
    li.addEventListener("pointerleave",()=>{pk.classList.remove("on");run=false})});
  $("#offers").addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY})})();
/* árbecslő */
if($("#kind")){
const PR={cserep:{u:"m²",min:30,max:300,step:5,def:120,lo:21000,hi:29000,d:v=>Math.ceil(v/40)+2},
lemez:{u:"m²",min:30,max:400,step:5,def:140,lo:12000,hi:18000,d:v=>Math.ceil(v/60)+1},
bador:{u:"fm",min:10,max:120,step:2,def:40,lo:6500,hi:10500,d:v=>Math.ceil(v/40)+1},
napelem:{u:"kW",min:3,max:15,step:1,def:6,lo:420000,hi:520000,d:v=>Math.ceil(v/3)+1},
pv:{u:"m²",min:20,max:120,step:2,def:50,lo:70000,hi:110000,d:v=>Math.ceil(v/12)+3}};
const LB={cserep:"Tetőfelület",lemez:"Tetőfelület",bador:"Csatorna, szegély hossza",napelem:"Rendszerméret",pv:"Napelemes felület"};
function setKind(k){const p=PR[k],s=$("#size");s.min=p.min;s.max=p.max;s.step=p.step;s.value=p.def;upd()}
function upd(){const k=$("#kind").value,p=PR[k],v=+$("#size").value,r=n=>Math.round(n/10000)*10000;
 $("#sizeLabel").textContent=LB[k];$("#sizeOut").textContent=v+" "+p.u;
 $("#price").textContent=nf.format(r(v*p.lo))+" – "+nf.format(r(v*p.hi))+" Ft";
 $("#days").textContent="Várható kivitelezési idő: kb. "+p.d(v)+" munkanap"}
$("#kind").addEventListener("change",()=>setKind($("#kind").value));
$("#size").addEventListener("input",upd);
const dk=$("#kind").dataset.def;if(dk){$("#kind").value=dk}setKind($("#kind").value);
}
})();
