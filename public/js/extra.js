/* Közös kiegészítések: kapcsolati felugró, chatbot, vélemény-háttér, AI-címke a hover-képen */
(function(){
"use strict";
const $=(s,r)=>(r||document).querySelector(s),$$=(s,r)=>[...(r||document).querySelectorAll(s)];
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
const nf=new Intl.NumberFormat("hu-HU");
const PHONE="+36 30 123 4567",TEL="tel:+36301234567";
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ================= Kapcsolati felugró ================= */
let cm=null,lastFocus=null;
const SERV=["Tetőfedés, tetőcsere","Napelem","Napelemes tetőcserép","Tetőszerkezet, bádogozás","Egyéb / nem tudom még"];
function buildModal(){
  cm=document.createElement("div");cm.className="cm";cm.id="cm";cm.setAttribute("role","dialog");cm.setAttribute("aria-modal","true");cm.setAttribute("aria-labelledby","cm-t");cm.setAttribute("aria-hidden","true");
  cm.innerHTML=`<div class="cm-box">
  <aside class="cm-side"><p class="tag">Ajánlatkérés</p><h2 id="cm-t">Mondd el, mi kell a tetőre</h2>
    <ul class="cm-pts"><li><b>24 óra</b>a válaszra</li><li><b>0 Ft</b>helyszíni felmérés</li><li><b>Írásos</b>garancia</li></ul>
    <a class="cm-tel" href="${TEL}">${PHONE}</a>
    <p class="cm-adr">7632 Pécs, Tetőfedő utca 4.<br>H–P 7:00–16:00</p></aside>
  <div class="cm-main"><button class="cm-x" type="button" aria-label="Bezárás">✕</button>
    <form class="cm-form" novalidate>
      <h3>Visszahívunk, és megbeszéljük</h3>
      <div class="grid2"><label>Neved<input name="n" autocomplete="name" placeholder="Kovács Anna"></label><label>Telefonszámod<input name="t" type="tel" autocomplete="tel" placeholder="${PHONE}"></label></div>
      <div class="grid2"><label>Település<input name="c" autocomplete="address-level2" placeholder="Pécs"></label><label>Miről van szó?<select name="s">${SERV.map(x=>`<option>${x}</option>`).join("")}</select></label></div>
      <label>Röviden a feladatról<textarea name="m" placeholder="Pl. 120 m²-es családi ház, cserép, régi fedés bontással"></textarea></label>
      <label class="cm-ck"><input type="checkbox" name="g"><span>Hozzájárulok, hogy a megadott adataimmal felvegyék velem a kapcsolatot.</span></label>
      <p class="cm-err" role="alert" hidden></p>
      <button class="btn" type="submit">Ajánlatot kérek</button>
      <p class="cm-demo">Bemutató oldal: az űrlap itt nem küld üzenetet. Az éles oldalon az ajánlatkérés e-mailben és értesítésként is megérkezik a cégnek.</p>
    </form>
    <div class="cm-ok" hidden><div class="mk">✓</div><h3>Köszönjük!</h3><p class="okp"></p><button class="btn" type="button" data-close>Bezárás</button></div>
  </div></div>`;
  document.body.appendChild(cm);
  cm.addEventListener("click",e=>{if(e.target===cm||e.target.closest(".cm-x,[data-close]"))closeContact()});
  $("form",cm).addEventListener("submit",e=>{
    e.preventDefault();const f=e.target,v=n=>f.elements[n].value.trim(),err=$(".cm-err",cm);
    [...f.elements].forEach(x=>x.classList&&x.classList.remove("bad"));
    const digits=v("t").replace(/\D/g,"");let msg="";
    if(!v("n")){msg="Add meg a neved.";f.elements.n.classList.add("bad")}
    else if(digits.length<8){msg="Adj meg egy telefonszámot, amin vissza tudunk hívni.";f.elements.t.classList.add("bad")}
    else if(!f.elements.g.checked){msg="Az elküldéshez jelöld be a hozzájárulást."}
    if(msg){err.textContent=msg;err.hidden=false;return}
    err.hidden=true;$(".okp",cm).textContent=`${v("n")}, a bemutató oldalon az űrlap nem küld valódi üzenetet. Az éles oldalon itt jelezzük, hogy 24 órán belül jelentkezünk a ${v("t")} számon.`;
    f.hidden=true;$(".cm-ok",cm).hidden=false;$(".cm-ok button",cm).focus({preventScroll:true});
  });
  document.addEventListener("keydown",e=>{
    if(!cm.classList.contains("open"))return;
    if(e.key==="Escape"){e.stopImmediatePropagation();closeContact();return}
    if(e.key!=="Tab")return;
    const fs=$$("button,a[href],input,select,textarea",cm).filter(x=>!x.closest("[hidden]")&&!x.disabled);if(!fs.length)return;
    const a=fs[0],z=fs[fs.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
  });
}
function openContact(o){
  o=o||{};if(!cm)buildModal();
  const f=$("form",cm);f.hidden=false;$(".cm-ok",cm).hidden=true;$(".cm-err",cm).hidden=true;
  [...f.elements].forEach(x=>x.classList&&x.classList.remove("bad"));
  if(o.msg!=null)f.elements.m.value=o.msg;
  if(o.service){const i=SERV.indexOf(o.service);if(i>=0)f.elements.s.selectedIndex=i}
  lastFocus=document.activeElement;
  cm.classList.add("open");cm.setAttribute("aria-hidden","false");document.documentElement.style.overflow="hidden";
  setTimeout(()=>f.elements.n.focus({preventScroll:true}),60);
}
function closeContact(){
  if(!cm)return;cm.classList.remove("open");cm.setAttribute("aria-hidden","true");document.documentElement.style.overflow="";
  if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});
}
window.openContact=openContact;
const KIND2SERV={cserep:SERV[0],lemez:SERV[0],bador:SERV[3],napelem:SERV[1],pv:SERV[2]};
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-contact]");if(!a)return;
  e.preventDefault();
  const o={};
  if(a.closest("form.est")&&$("#kind")){
    const k=$("#kind");o.msg=`${k.selectedOptions[0].textContent}, ${$("#sizeOut").textContent}. Becslés: ${$("#price").textContent}`;o.service=KIND2SERV[k.value];
  }
  openContact(o);
});


/* ================= Telefonos hivatkozás: beágyazott (iframe) nézetben is működjön ================= */
document.addEventListener("click",e=>{
  const a=e.target.closest('a[href^="tel:"]');if(!a)return;
  e.preventDefault();
  let w=null;try{w=window.open(a.href,"_blank","noopener")}catch(_){}
  if(!w){
    try{navigator.clipboard&&navigator.clipboard.writeText(PHONE)}catch(_){}
    let t=$("#telToast");if(!t){t=document.createElement("div");t.id="telToast";t.className="toast";t.setAttribute("role","status");document.body.appendChild(t)}
    t.innerHTML=`Hívd a <b>${PHONE}</b> számot (a szám a vágólapra került, ha a böngésző engedte)`;t.classList.add("on");clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("on"),6000);
  }
});

/* ================= Vélemények: háttér-parallax, tetővonal ================= */
(function(){
  const t=$(".tst");if(!t)return;
  if("IntersectionObserver" in window&&!RM){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){t.classList.add("seen");io.disconnect()}}),{threshold:.15});io.observe(t)}else t.classList.add("seen");
  const bg=$(".tbg",t);
  if(bg&&!RM){let r=0;const f=()=>{r=0;const b=t.getBoundingClientRect();bg.style.transform=`translate3d(0,${(b.top+b.height/2-innerHeight/2)*-.1}px,0)`};
    addEventListener("scroll",()=>{if(!r)r=requestAnimationFrame(f)},{passive:true});f()}
})();

/* ================= Hover-kép: AI-címke ================= */
(function(){
  const pk=$("#peek");if(!pk)return;
  const upd=()=>{const on=$("img.on",pk);pk.dataset.ai=on&&on.hasAttribute("data-ai")?"1":"0"};
  new MutationObserver(upd).observe(pk,{subtree:true,attributes:true,attributeFilter:["class"]});upd();
})();

/* ================= Chatbot ================= */
const IC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12Z"/><path d="M9 11h6M9 14h4"/></svg>';
const here=location.pathname.split("/").pop()||"index.html";
const L=(h,t)=>`<a href="${h}">${t}</a>`;
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const PR={cserep:{n:"tetőcsere cseréppel",u:"m²",lo:21000,hi:29000,d:v=>Math.ceil(v/40)+2},
lemez:{n:"tetőcsere trapézlemezzel",u:"m²",lo:12000,hi:18000,d:v=>Math.ceil(v/60)+1},
bador:{n:"bádogos munka, ereszcsatorna",u:"fm",lo:6500,hi:10500,d:v=>Math.ceil(v/40)+1},
napelem:{n:"napelemes rendszer (ráépített panel)",u:"kW",lo:420000,hi:520000,d:v=>Math.ceil(v/3)+1},
pv:{n:"napelemes tetőcserép",u:"m²",lo:70000,hi:110000,d:v=>Math.ceil(v/12)+3}};
const QR0=["Mennyibe kerül a tetőcsere?","Cserép vagy lemez?","Napelemes tetőcserép","Kell engedély a napelemhez?","Ajánlatot kérek"];
const FALLBACK={t:`Erre nem tudok biztosat mondani, ezt inkább egy kolléga válaszolja meg. Hagyd meg a telefonszámod, és visszahívunk, vagy hívj minket: <a href="${TEL}">${PHONE}</a>.`,cb:1,qr:["Mennyibe kerül a tetőcsere?","Ajánlatot kérek"]};
function priceAns(txt){
  const m=txt.match(/(\d+(?:[.,]\d+)?)\s*(m2|m²|nm|negyzet|kw|fm|folyometer)/);
  let k="cserep";
  if(/napelemes (teto)?cserep|pv ?tile/.test(txt))k="pv";else if(/napelem|panel|\bkw\b/.test(txt)||(m&&m[2]==="kw"))k="napelem";
  else if(/lemez|trapez/.test(txt))k="lemez";else if(/badog|csatorna|szegely|\bfm\b/.test(txt)||(m&&/fm|folyo/.test(m[2])))k="bador";
  if(!m)return{t:"Tájékoztató sávok, ÁFA nélkül: tetőcsere cseréppel kb. 21–29 ezer Ft/m², trapézlemezzel 12–18 ezer Ft/m², bádogos munka 6,5–10,5 ezer Ft/fm, napelemes rendszer 420–520 ezer Ft/kW, napelemes tetőcserép 70–110 ezer Ft/m². Írd meg a méretet (pl. „120 m² cserép”), és kiszámolom a nagyságrendet. A pontos árat a felmérés után adjuk. Bemutató értékek.",qr:["120 m² cserép","140 m² lemez","6 kW napelem","Ajánlatot kérek"]};
  const v=parseFloat(m[1].replace(",",".")),p=PR[k],r=n=>Math.round(n/10000)*10000;
  if(!(v>0&&v<5000))return FALLBACK;
  return{t:`${nf.format(v)} ${p.u} ${p.n}: kb. <b>${nf.format(r(v*p.lo))} – ${nf.format(r(v*p.hi))} Ft</b> + ÁFA, a kivitelezés kb. ${p.d(v)} munkanap. Ez tájékoztató sáv bemutató értékekkel. A pontos ajánlat a helyszíni felmérés után készül, ami ingyenes.`,qr:["Ajánlatot kérek","Cserép vagy lemez?","Kell engedély a napelemhez?"],ctx:`${p.n}, ${nf.format(v)} ${p.u}`};
}
const RULES=[
 [/beaz|szivarg|csepeg|surgos|vihar|lecsap/,()=>({t:`Sürgős beázásnál hívj telefonon: <a href="${TEL}">${PHONE}</a>. Ilyenkor a legközelebbi szabad időpontra jövünk ki.`,qr:["Ajánlatot kérek","Hol vagytok?"]})],
 [/visszahiv|kollega|emberrel|valakivel|beszelni|szemelyesen|callback/,()=>({t:`Szívesen. Hagyd meg a telefonszámod, és hétköznap 7 és 16 óra között visszahívunk. Hívni is tudsz: <a href="${TEL}">${PHONE}</a>.`,cb:1})],
 [/ajanlatot? (kerek|szeretn|kernek|kellene)|megrendel|idopontot? (kerek|foglal)|ajanlatkeres/,()=>({t:"Rendben, nyitom az ajánlatkérő űrlapot.",open:1})],
 [/napelemes (teto)?cserep|pv ?tile|integralt|beepitett/,()=>({t:`A napelemes tetőcserép a fedés része, nincs ráépített panel, a tető egybefüggő felületként néz ki. Cserébe magasabb a beruházás és hosszabb a megtérülés, ezért a felmérésen számokkal megmutatjuk, nálad megéri-e. Részletek: ${L("napelemes-tetocserep.html","napelemes tetőcserép oldal")}.`,qr:["Mennyibe kerül a tetőcsere?","Ajánlatot kérek"]})],
 [null,"price"],
 [/engedely|ugyintez|szolgaltato|mvm|hatosag|bejelent|papir/,()=>({t:"Az áramszolgáltatóval való egyeztetést és a szükséges ügyintézést átvállaljuk, neked csak aláírni kell. A mérettől függően hatósági lépések is jöhetnek, ezeket a tervezésnél tisztázzuk.",qr:["Mennyi idő a kivitelezés?","Ajánlatot kérek"]})],
 [/garancia|szavatossag|jotallas/,()=>({t:"A kivitelezésre és az anyagokra írásos garanciát adunk átadáskor. A panelekre és az inverterre a gyártó garanciája érvényes, ezt az ajánlatban külön feltüntetjük.",qr:["Kell engedély a napelemhez?","Ajánlatot kérek"]})],
 [/mennyi ido|hatarido|meddig|hany nap|kivitelezesi ido|gyors|mikor (keszul|kezd)/,()=>({t:"A kivitelezési idő a mérettől függ: egy átlagos családi ház tetőcseréje jellemzően néhány munkanap és egy hét között van, a napelem telepítése 2–4 nap. Pontos határidőt a felmérés után írunk az ajánlatba.",qr:["Mennyibe kerül a tetőcsere?","Ajánlatot kérek"]})],
 [/felmeres|helyszin|kijon|megnez|ellenorz/,()=>({t:"A helyszíni felmérés ingyenes. Megnézzük a tető és a szarufák állapotát, az árnyékolást, a számláidból pedig az éves fogyasztást, és ezek alapján számokkal adunk ajánlatot.",qr:["Ajánlatot kérek","Mennyibe kerül a tetőcsere?"]})],
 [/telefon|hivj|hivni|elerhetoseg|cim\b|hol vagytok|hol talal|nyitva|nyitvatartas|email|e-mail|iroda|telephely/,()=>({t:`Telefon: <a href="${TEL}">${PHONE}</a> (H–P 7:00–16:00). Cím: 7632 Pécs, Tetőfedő utca 4. E-mail: info@minta-teto.example. A térképet a ${L(here==="index.html"||here===""?"#kapcsolat":"index.html#kapcsolat","kapcsolat szekcióban")} találod.`,qr:["Ajánlatot kérek","Hol dolgoztok?"]})],
 [/terulet|hol dolgoztok|baranya|pecs|komlo|szigetvar|mohacs|megye|kiszall/,()=>({t:"Baranya megyében és a környező megyékben dolgozunk: Pécs, Komló, Szigetvár, Mohács és környéke. Ha távolabbról írsz, kérdezd meg, ki tudunk-e menni.",qr:["Ajánlatot kérek","Hol vagytok?"]})],
 [/napelem|panel|inverter|megterul|aramterm|aram\b|rendszer|hazi eromu/,()=>({t:`A napelemes rendszert a tervezéstől az átadásig mi csináljuk: felmérés, rendszerméret, ügyintézés, rögzítés, bekötés, beüzemelés. A megtérülés az éves fogyasztástól függ, ezt a számláid alapján számoljuk ki a felmérésen. A lépések: ${L("napelem-szereles.html","napelem szerelés oldal")}.`,qr:["Kell engedély a napelemhez?","Napelemes tetőcserép","Ajánlatot kérek"]})],
 [/cserep|lemez|zsindely|trapez|tetofedes|tetocsere|fedes|szarufa|szigetel|badog|csatorna|tetoszerkezet/,()=>({t:`Cserép: hosszú élettartam, hagyományos megjelenés, de nehezebb. Lemez: könnyebb, gyorsabban lerakható és általában kedvezőbb árú, esőben viszont hangosabb, ezért a szigetelésre külön figyelünk. A felmérésen megnézzük, mit bír a tetőszerkezeted. A rétegeket itt láthatod: ${L("tetoszerkezet.html","tetőszerkezet oldal")}.`,qr:["Mennyibe kerül a tetőcsere?","Ajánlatot kérek"]})],
 [/^(szia|szervusz|jo napot|jo estet|jo reggelt|hello|hali|udv|helo)/,()=>({t:"Szia! Tetőről, napelemről, árakról és az ügyintézésről kérdezhetsz, vagy kérhetsz ajánlatot.",qr:QR0})],
 [/koszon|koszi|rendben|oke|ok\b|szuper|remek/,()=>({t:"Szívesen! Ha van más kérdésed, itt vagyok.",qr:QR0.slice(0,3)})]
];
function answer(raw){
  const t=norm(raw);
  for(const r of RULES){
    if(r[1]==="price"){if(/\b(ar|arak|aru|ara|arat)\b|arajanlat|koltseg|mennyibe|mennyi(?! ido)|kerul|draga|olcso|becsles|forint|\bft\b/.test(t)||/(\d+(?:[.,]\d+)?)\s*(m2|m²|nm|negyzet|kw|fm)/.test(t))return priceAns(t);continue}
    if(r[0].test(t))return r[1]();
  }
  return FALLBACK;
}
function buildChat(){
  const cb=document.createElement("div");cb.className="cb";cb.id="cb";
  cb.innerHTML=`<button class="cb-fab" type="button" aria-expanded="false" aria-controls="cbp">${IC}</button><div class="cb-tip" hidden>Segíthetek? Kérdezz tőlünk!<button type="button" aria-label="Bezárás">✕</button></div>
  <section class="cb-panel" id="cbp" role="dialog" aria-label="Chat az asszisztenssel">
    <div class="cb-h"><div class="cb-av">${IC}</div><div><b>Tető-asszisztens</b><small>Bemutató chatbot · azonnal válaszol</small></div><button class="cb-x" type="button" aria-label="Chat bezárása">✕</button></div>
    <div class="cb-log" aria-live="polite"></div><div class="cb-qr"></div>
    <form class="cb-in" autocomplete="off"><input type="text" aria-label="Írd be a kérdésed" placeholder="Írd be a kérdésed…" maxlength="200"><button type="submit" aria-label="Küldés">→</button></form>
    <p class="cb-note">Bemutató: előre megírt válaszokkal működik, a cég saját adataival. Az éles oldalon a cég tudásbázisából válaszol, és az ajánlatkéréseket e-mailben is továbbítja.</p>
  </section>`;
  document.body.appendChild(cb);
  const log=$(".cb-log",cb),qr=$(".cb-qr",cb),inp=$(".cb-in input",cb),fab=$(".cb-fab",cb),tip=$(".cb-tip",cb);
  let started=false,last="",busy=false;
  const scroll=()=>{log.scrollTop=log.scrollHeight};
  function add(cls,html){const d=document.createElement("div");d.className="cb-m "+cls;d.innerHTML=html;log.appendChild(d);scroll();return d}
  function setQR(a){qr.innerHTML="";(a||[]).forEach(x=>{const b=document.createElement("button");b.type="button";b.textContent=x;b.onclick=()=>send(x);qr.appendChild(b)})}
  function bot(a){
    busy=true;setQR([]);const t=add("b t","<i></i><i></i><i></i>");
    setTimeout(()=>{
      t.classList.remove("t");t.innerHTML=a.t;
      if(a.cb){const f=document.createElement("form");f.className="cb-cb";f.innerHTML=`<input type="tel" name="t" placeholder="${PHONE}" aria-label="Telefonszám"><button type="submit">Visszahívást kérek</button>`;
        f.onsubmit=e=>{e.preventDefault();const v=f.t.value.trim();if(v.replace(/\D/g,"").length<8){f.t.focus();return}
          f.remove();add("u",esc(v));bot({t:"Köszönöm! Hétköznap 7 és 16 óra között visszahívunk. Bemutató oldal, ezért ez most nem küld valódi üzenetet.",qr:QR0.slice(0,3)})};
        t.appendChild(f)}
      if(a.open){const b=document.createElement("button");b.type="button";b.className="cb-act";b.textContent="Ajánlatkérő megnyitása";b.onclick=()=>openContact({msg:last||""});t.appendChild(b);setTimeout(()=>openContact({msg:a.ctx||last}),500)}
      setQR(a.qr);busy=false;scroll();
    },RM?0:550+Math.min(700,(a.t||"").length*3));
  }
  function send(x){x=x.trim();if(!x||busy)return;add("u",esc(x));const a=answer(x);if(a.ctx)last=a.ctx;bot(a)}
  function open(){cb.classList.add("open");fab.setAttribute("aria-expanded","true");tip.hidden=true;
    if(!started){started=true;bot({t:"Szia! A Mintatető asszisztense vagyok. Kérdezhetsz tetőről, napelemről, árakról és ügyintézésről, vagy kérhetsz ajánlatot.",qr:QR0})}
    setTimeout(()=>inp.focus({preventScroll:true}),80)}
  function close(){cb.classList.remove("open");fab.setAttribute("aria-expanded","false");fab.focus({preventScroll:true})}
  fab.onclick=open;$(".cb-x",cb).onclick=close;
  $(".cb-in",cb).onsubmit=e=>{e.preventDefault();const v=inp.value;inp.value="";send(v)};
  cb.addEventListener("keydown",e=>{if(e.key==="Escape"&&cb.classList.contains("open")){e.stopPropagation();close()}});
  window.openChat=open;
  fab.setAttribute("aria-label","Chat megnyitása");$("button",tip).onclick=()=>{tip.hidden=true};tip.onclick=e=>{if(!e.target.closest("button"))open()};
  if(!RM)setTimeout(()=>{if(!cb.classList.contains("open")&&!started){tip.hidden=false;setTimeout(()=>{tip.hidden=true},9000)}},4500);
}
buildChat();
})();
