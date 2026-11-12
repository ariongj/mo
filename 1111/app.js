'use strict';
const sq=document.documentElement.lang==='sq';
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const motion=()=>motionPreference.matches?'instant':'smooth';
const menu=document.querySelector('#mobile-menu'),toggle=document.querySelector('.menu-toggle');
function closeMenu(){menu.close();toggle.setAttribute('aria-expanded','false');toggle.focus()}
toggle.addEventListener('click',()=>{menu.showModal();toggle.setAttribute('aria-expanded','true')});
menu.querySelector('.close-menu').addEventListener('click',closeMenu);
menu.addEventListener('close',()=>toggle.setAttribute('aria-expanded','false'));
menu.addEventListener('click',e=>{if(e.target===menu){const r=menu.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeMenu()}});
const params=new URLSearchParams(location.search);
function syncLanguages(){for(const a of document.querySelectorAll('a[hreflang]')){const u=new URL(a.href);u.search=new URL(location.href).search;a.href=u.href}}
syncLanguages();

// Catalogue filters retain their state when a visitor opens a product and comes back.
const filters=[...document.querySelectorAll('[data-filter]')],examples=[...document.querySelectorAll('[data-family]')];
function filterBags(key,updateURL=false){
 if(!filters.some(b=>b.dataset.filter===key))key='all';
 for(const b of filters)b.setAttribute('aria-pressed',String(b.dataset.filter===key));
 let count=0;
 for(const c of examples){c.hidden=key!=='all'&&c.dataset.family!==key;if(!c.hidden){count++;if(!motionPreference.matches)c.animate([{opacity:.45,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:240})}}
 const label=document.querySelector('.catalogue-count');if(label)label.textContent=sq?`${count} shembuj nga prodhimi ynë`:`${count} production examples`;
 if(updateURL){const u=new URL(location.href);if(key==='all')u.searchParams.delete('filter');else u.searchParams.set('filter',key);history.pushState(null,'',u);syncLanguages()}
}
if(filters.length){filterBags(params.get('filter'));for(const b of filters)b.addEventListener('click',()=>filterBags(b.dataset.filter,true));window.addEventListener('popstate',()=>{filterBags(new URLSearchParams(location.search).get('filter'));syncLanguages()})}

// Native scrolling keeps the product rail fast on touchscreens and trackpads.
const rail=document.querySelector('#bag-range');
if(rail){
 const cards=[...rail.children],prev=document.querySelector('.range-prev'),next=document.querySelector('.range-next'),position=document.querySelector('.range-position');
 const step=()=>cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(rail).columnGap);
 function updateRail(){const max=rail.scrollWidth-rail.clientWidth;prev.disabled=rail.scrollLeft<4;next.disabled=rail.scrollLeft>=max-4;position.textContent=`${Math.min(cards.length,Math.round(rail.scrollLeft/step())+1)} / ${cards.length}`}
 function moveRail(direction){rail.scrollBy({left:direction*step(),behavior:motion()})}
 prev.addEventListener('click',()=>moveRail(-1));next.addEventListener('click',()=>moveRail(1));
 rail.addEventListener('keydown',e=>{if(e.target!==rail)return;if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();if(e.key==='Home'||e.key==='End')rail.scrollTo({left:e.key==='Home'?0:rail.scrollWidth,behavior:motion()});else moveRail(e.key==='ArrowRight'?1:-1)}});
 let queued=false;rail.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(()=>{updateRail();queued=false})}},{passive:true});
 new ResizeObserver(updateRail).observe(rail);updateRail();
}

// One gallery selection drives thumbnails, full-size viewing, URLs and language links.
const mainPhoto=document.querySelector('.main-product'),photoButtons=[...document.querySelectorAll('[data-photo]')],modal=document.querySelector('.photo-dialog'),zoom=document.querySelector('.zoom-photo');
let photoIndex=0,ignoreZoomUntil=0;
function setPhoto(button,updateURL=false){
 if(!button||!mainPhoto)return;
 photoIndex=photoButtons.indexOf(button);
 const photoBase='/mo/1111/assets/'+button.dataset.photo;
 mainPhoto.srcset=photoBase+'-600.webp 600w, '+photoBase+'.webp 1280w';mainPhoto.src=photoBase+'.webp';mainPhoto.alt=button.querySelector('img').alt;
 for(const b of photoButtons)b.setAttribute('aria-pressed',String(b===button));
 for(const c of document.querySelectorAll('.gallery-counter,.lightbox-counter'))c.textContent=(sq?'Foto ':'Photo ')+(photoIndex+1)+' / '+photoButtons.length;
 if(modal.open){const img=modal.querySelector('img');img.src=mainPhoto.src;img.alt=mainPhoto.alt}
 if(updateURL){const u=new URL(location.href);u.searchParams.set('photo',button.dataset.photo);history.replaceState(null,'',u);syncLanguages()}
}
function movePhoto(direction){setPhoto(photoButtons[(photoIndex+direction+photoButtons.length)%photoButtons.length],true)}
if(mainPhoto){
 for(const b of photoButtons)b.addEventListener('click',()=>setPhoto(b,true));
 for(const b of document.querySelectorAll('.gallery-prev'))b.addEventListener('click',()=>movePhoto(-1));
 for(const b of document.querySelectorAll('.gallery-next'))b.addEventListener('click',()=>movePhoto(1));
 mainPhoto.addEventListener('load',()=>{if(!motionPreference.matches)mainPhoto.animate([{opacity:.5,transform:'scale(.985)'},{opacity:1,transform:'scale(1)'}],{duration:220})});
 setPhoto(photoButtons.find(b=>b.dataset.photo===params.get('photo'))||photoButtons[0]);
 zoom.addEventListener('click',()=>{if(performance.now()<ignoreZoomUntil)return;const img=modal.querySelector('img');img.src=mainPhoto.src;img.alt=mainPhoto.alt;modal.showModal()});
 for(const surface of [zoom,modal])surface.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();movePhoto(e.key==='ArrowRight'?1:-1)}});
 for(const surface of [zoom,modal.querySelector('img')]){
  let start=null;
  surface.addEventListener('pointerdown',e=>{if(e.isPrimary)start={x:e.clientX,y:e.clientY}},{passive:true});
  surface.addEventListener('pointercancel',()=>{start=null},{passive:true});
  surface.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5){ignoreZoomUntil=performance.now()+450;movePhoto(dx<0?1:-1)}},{passive:true});
 }
}
modal.querySelector('.close-photo').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});

// A single, pre-edited film provides real cuts without multiple video decoders.
const film=document.querySelector('.hero-film'),motionButton=document.querySelector('.motion-toggle');
if(film&&motionButton){
 const scenes=[...document.querySelectorAll('[data-scene]')];
 let userPaused=false,userStarted=false,inView=true,playPending=false;
 if(matchMedia('(max-width:700px)').matches){film.dataset.src=film.dataset.mobileSrc;film.poster=film.dataset.mobilePoster}
 function label(){const playing=!film.paused;motionButton.setAttribute('aria-pressed',String(playing));motionButton.querySelector('span').textContent=playing?'Ⅱ':'▶';motionButton.querySelector('.motion-label').textContent=playing?(sq?'Ndalo':'Pause film'):(sq?'Luaj':'Play film')}
 function mayPlay(){return inView&&!document.hidden&&!userPaused&&(userStarted||(!motionPreference.matches&&!navigator.connection?.saveData))}
 function load(){if(!film.getAttribute('src')||film.error){film.src=film.dataset.src;film.load()}}
 async function play(){if(playPending||!film.paused)return;load();film.muted=true;playPending=true;try{await film.play();if(!mayPlay())film.pause()}catch{}finally{playPending=false;label()}}
 function sync(){if(mayPlay())play();else film.pause()}
 motionButton.addEventListener('click',()=>{if(film.paused){userPaused=false;userStarted=true;sync()}else{userPaused=true;film.pause()}});
 film.addEventListener('playing',()=>{film.classList.add('is-playing');label()});film.addEventListener('pause',label);
 film.addEventListener('error',()=>{film.classList.remove('is-playing');userPaused=true;label();motionButton.querySelector('.motion-label').textContent=sq?'Provo sërish':'Retry film'});
 for(const [i,b] of scenes.entries())b.addEventListener('click',()=>{
  const first=!film.getAttribute('src');userStarted=true;load();
  const seek=()=>{film.currentTime=i*4+.02;film.classList.add('is-playing');if(first){userPaused=false;sync()}updateScenes()};
  if(film.readyState>=1)seek();else film.addEventListener('loadedmetadata',seek,{once:true});
 });
 function updateScenes(){const index=Math.min(3,Math.floor(film.currentTime/4));for(const [i,b] of scenes.entries()){if(i===index)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');b.style.setProperty('--progress',String(i===index?(film.currentTime%4)/4:0))}}
 film.addEventListener('timeupdate',updateScenes);
 new IntersectionObserver(es=>{inView=es[0].isIntersecting;sync()},{threshold:.08}).observe(film.closest('.hero'));
 document.addEventListener('visibilitychange',sync);motionPreference.addEventListener('change',sync);navigator.connection?.addEventListener('change',sync);
}

// Entry motion runs once; there are no perpetual scroll or pointer animation loops.
if(!motionPreference.matches&&'IntersectionObserver' in window){
 document.documentElement.classList.add('motion-enabled');
 const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}},{threshold:.06,rootMargin:'0px 0px 35px 0px'});
 for(const e of document.querySelectorAll('.section-heading,.partnership,.stock-feature,.industry-row,.manufacturing-intro,.values-grid article,.sector-card,.home-products .product-card,.production-grid article,.green-card,.sector-intro,.range-copy,.reference-partnership,.real-bags .section-heading')){e.classList.add('reveal');observer.observe(e)}
 motionPreference.addEventListener('change',e=>{if(e.matches)document.documentElement.classList.remove('motion-enabled')});
}

const size=document.querySelector('#product-size'),quote=document.querySelector('.product-quote');
function quoteSize(){if(!size||!quote)return;let u=new URL(quote.href);u.searchParams.set('size',size.value);quote.href=u.href}
size?.addEventListener('change',quoteSize);quoteSize();
for(const form of document.querySelectorAll('.enquiry-form')){
 const bag=form.elements.namedItem('bag');
 if([...bag.options].some(x=>x.value===params.get('bag')))bag.value=params.get('bag');
 const note=form.elements.namedItem('message');
 if(params.has('size'))note.value=(sq?'Përmasat: ':'Dimensions: ')+params.get('size').slice(0,100);
 if(['Thank you','Smiley'].includes(params.get('collection'))){bag.value='stock';note.value=(sq?'Koleksioni: ':'Collection: ')+params.get('collection')}
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;
 const d=new FormData(form);const label=bag.options[bag.selectedIndex].textContent;
 const lines=[sq?'Kërkesë për ofertë Kobags':'Kobags quotation enquiry','',`${sq?'Emri':'Name'}: ${d.get('name')}`,`${sq?'Kompania':'Company'}: ${d.get('company')}`,`Email: ${d.get('email')}`,`${sq?'Telefoni':'Phone'}: ${d.get('phone')}`,`${sq?'Çanta':'Bag'}: ${label}`,`${sq?'Sasia':'Quantity'}: ${d.get('quantity')}`,`${sq?'Destinacioni':'Destination'}: ${d.get('destination')}`,'',String(d.get('message')||'')];
 const text=lines.join('\n'),result=form.querySelector('.form-result');result.hidden=false;result.querySelector('.enquiry-text').textContent=text;result.querySelector('.send-email').href='mailto:info@kobags-group.com?subject='+encodeURIComponent((sq?'Kërkesë për ofertë — ':'Quotation enquiry — ')+label)+'&body='+encodeURIComponent(text);result.querySelector('.copy-enquiry').onclick=async e=>{try{await navigator.clipboard.writeText(text);e.target.textContent=sq?'U kopjua':'Copied'}catch{e.target.textContent=sq?'Përzgjidhni dhe kopjoni tekstin poshtë':'Select and copy the text below'}};result.focus();result.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 });
 // Enable native submission only once the local email-draft handler is attached.
 form.querySelector('button[type="submit"]').disabled=false;
}

const stageButtons=[...document.querySelectorAll('[data-stage]')];
const stages=sq?[
 ['material-rolls.webp','Materiali që i përshtatet porosisë.','Zgjidhni peshën e materialit, ngjyrën dhe përmasat sipas produkteve që do të mbajnë klientët tuaj.','Rrotulla materiali jo të endur në fabrikën Kobags'],
 ['printing-line-fresh-food.jpg','Marka juaj, në material.','Shtyp fleksografik me bojëra me bazë uji. Kontrollojmë dizajnin dhe ngjyrat bashkë me ju para prodhimit.','Materiali me shtyp në linjën Kobags'],
 ['finished-stack-rail.webp','Nga materiali te çanta.','Formimi dhe përfundimi bashkojnë materialin dhe shtypin në çantën tuaj. Specifikimet dakordohen para fillimit të porosisë.','Çanta të përfunduara në linjën e prodhimit']
]:[
 ['material-rolls.webp','The right material for the job.','Choose the fabric weight, colour and dimensions around the products your customers carry.','Rolls of non-woven material in the Kobags factory'],
 ['printing-line-fresh-food.jpg','Your identity, on the material.','Flexographic printing with water-based inks. We review the artwork and print colours with you before production.','Printed material on the Kobags production line'],
 ['finished-stack-rail.webp','From material to finished bag.','Forming and finishing bring your chosen material and print together. Specifications are agreed before the order starts.','Finished bags moving through production']
];
function chooseStage(i,focus=false){const d=stages[i],panel=document.querySelector('#process-panel'),image=document.querySelector('.factory-band-photo img');for(const [j,b]of stageButtons.entries()){b.setAttribute('aria-selected',String(j===i));b.tabIndex=j===i?0:-1}panel.setAttribute('aria-labelledby','process-tab-'+i);panel.querySelector('h2').textContent=d[1];panel.querySelector('p:not(.eyebrow)').textContent=d[2];image.removeAttribute('srcset');image.src='/mo/1111/assets/'+d[0];image.alt=d[3];if(focus)stageButtons[i].focus()}
stageButtons.forEach((b,i)=>{b.addEventListener('click',()=>chooseStage(i));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%3;else if(e.key==='ArrowLeft')n=(i+2)%3;else if(e.key==='Home')n=0;else if(e.key==='End')n=2;else return;e.preventDefault();chooseStage(n,true)})});

// Original product clips load only after a deliberate tap, one decoder at a time.
const productClips=[...document.querySelectorAll('video[data-clip]')];
for(const video of productClips){
 const button=video.closest('.clip-frame').querySelector('.clip-play'),buttonLabel=button.querySelector('span:last-child'),watchLabel=buttonLabel.textContent;video.controls=false;
 button.addEventListener('click',async()=>{
  for(const other of productClips)if(other!==video)other.pause();
  if(film&&!film.paused)film.pause();
  if(!video.getAttribute('src')||video.error){video.src=video.dataset.clip;video.load()}
  video.muted=true;
  button.hidden=true;video.controls=true;
  try{await video.play();buttonLabel.textContent=watchLabel}catch{button.hidden=false;video.controls=false;buttonLabel.textContent=sq?'Provo sërish':'Try again'}
 });
 video.addEventListener('play',()=>{for(const other of productClips)if(other!==video)other.pause()});
 video.addEventListener('ended',()=>{button.hidden=false;video.controls=false});
 video.addEventListener('error',()=>{button.hidden=false;video.controls=false;buttonLabel.textContent=sq?'Provo sërish':'Try again'});
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting)video.pause()},{threshold:.05}).observe(video);
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)for(const video of productClips)video.pause()});
