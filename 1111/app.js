'use strict';
const sq=document.documentElement.lang==='sq';
const menu=document.querySelector('#mobile-menu'),toggle=document.querySelector('.menu-toggle');
function closeMenu(){menu.close();toggle.setAttribute('aria-expanded','false');toggle.focus()}
toggle.addEventListener('click',()=>{menu.showModal();toggle.setAttribute('aria-expanded','true')});
menu.querySelector('.close-menu').addEventListener('click',closeMenu);
menu.addEventListener('cancel',()=>toggle.setAttribute('aria-expanded','false'));
menu.addEventListener('click',e=>{if(e.target===menu){const r=menu.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeMenu()}});
for(const b of document.querySelectorAll('[data-filter]'))b.addEventListener('click',()=>{for(const x of document.querySelectorAll('[data-filter]'))x.setAttribute('aria-pressed',String(x===b));for(const c of document.querySelectorAll('[data-family]'))c.hidden=b.dataset.filter!=='all'&&c.dataset.family!==b.dataset.filter});
const params=new URLSearchParams(location.search),mainPhoto=document.querySelector('.main-product');
function setPhoto(button){if(!button||!mainPhoto)return;mainPhoto.removeAttribute('srcset');mainPhoto.src='/mo/1111/assets/'+button.dataset.photo+'.webp';for(const b of document.querySelectorAll('[data-photo]'))b.setAttribute('aria-pressed',String(b===button))}
for(const b of document.querySelectorAll('[data-photo]'))b.addEventListener('click',()=>setPhoto(b));
if(params.has('photo'))setPhoto([...document.querySelectorAll('[data-photo]')].find(b=>b.dataset.photo===params.get('photo')));
const modal=document.querySelector('.photo-dialog');
document.querySelector('.zoom-photo')?.addEventListener('click',()=>{const img=modal.querySelector('img');img.src=mainPhoto.src;img.alt=mainPhoto.alt;modal.showModal()});
modal.querySelector('.close-photo').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
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
}
// Keep the visitor on the same product/example when changing language.
for(const a of document.querySelectorAll('a[hreflang]')){const u=new URL(a.href);for(const key of ['bag','size','photo','collection'])if(params.has(key))u.searchParams.set(key,params.get(key));a.href=u.href}

// Ambient film: never download automatically for reduced-motion or data-saving visitors.
const film=document.querySelector('.hero-film'),motionButton=document.querySelector('.motion-toggle');
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
if(film&&motionButton){
 let userPaused=false,userStarted=false,inView=true;
 function label(){const playing=!film.paused;motionButton.setAttribute('aria-pressed',String(playing));motionButton.querySelector('span').textContent=playing?'Ⅱ':'▶';motionButton.querySelector('.motion-label').textContent=playing?(sq?'Ndalo videon':'Pause film'):(sq?'Luaj videon':'Play film')}
 async function play(){if(!film.src){film.src=film.dataset.src;film.load()}film.muted=true;try{await film.play()}catch{}label()}
 function sync(){if(inView&&!document.hidden&&!userPaused&&(userStarted||(!motionPreference.matches&&!navigator.connection?.saveData)))play();else film.pause()}
 motionButton.addEventListener('click',()=>{if(film.paused){userPaused=false;userStarted=true;play()}else{userPaused=true;film.pause()}});
 film.addEventListener('playing',()=>{film.classList.add('is-playing');label()});film.addEventListener('pause',label);film.addEventListener('error',()=>{film.classList.remove('is-playing');label()});
 new IntersectionObserver(es=>{inView=es[0].isIntersecting;sync()},{threshold:.08}).observe(film.closest('.hero'));
 document.addEventListener('visibilitychange',sync);motionPreference.addEventListener('change',sync);
}
if(!motionPreference.matches&&'IntersectionObserver' in window){
 document.documentElement.classList.add('motion-enabled');
 const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}},{threshold:.06,rootMargin:'0px 0px 35px 0px'});
 for(const e of document.querySelectorAll('.section-heading,.partnership,.stock-feature,.industry-row,.manufacturing-intro,.values-grid article')){e.classList.add('reveal');observer.observe(e)}
 motionPreference.addEventListener('change',e=>{if(e.matches)document.documentElement.classList.remove('motion-enabled')});
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
