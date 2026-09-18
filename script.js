
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];

window.addEventListener('load',()=>{
  $('#loader .loader-bar i').style.width='100%';
  setTimeout(()=>{$('#loader').classList.add('hide');document.body.classList.remove('lock')},900);
});
document.body.classList.add('lock');

const header=$('header'), progress=$('#progress'), topBtn=$('#topBtn');
addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',scrollY>30);
  const h=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(h>0?(scrollY/h)*100:0)+'%';
  topBtn.classList.toggle('show',scrollY>700);
},{passive:true});
topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});

const videos=$$('.hero video'); let vi=0, paused=false;
function showVideo(n){
  vi=(n+videos.length)%videos.length;
  videos.forEach((v,i)=>{
    v.classList.toggle('active',i===vi);
    if(i===vi && !paused) v.play().catch(()=>{});
    if(i!==vi) v.pause();
  });
  $('#vcount').textContent=String(vi+1).padStart(2,'0');
}
setInterval(()=>{if(!paused)showVideo(vi+1)},6500);
$('#pause').onclick=()=>{
  paused=!paused;
  videos.forEach(v=>paused?v.pause():v.play().catch(()=>{}));
  $('#pause').textContent=paused?'▶ Play film':'Ⅱ Pause film';
};

const slides=$$('.slide'), dots=$('#dots'); let si=0;
slides.forEach((_,i)=>{
  const b=document.createElement('button'); b.setAttribute('aria-label','Open slide '+(i+1));
  b.onclick=()=>showSlide(i); dots.appendChild(b);
});
function showSlide(n){
  si=(n+slides.length)%slides.length;
  slides.forEach((s,i)=>s.classList.toggle('active',i===si));
  $$('#dots button').forEach((b,i)=>b.classList.toggle('active',i===si));
  $('#scount').textContent=String(si+1).padStart(2,'0');
}
showSlide(0);
$('#prev').onclick=()=>showSlide(si-1); $('#next').onclick=()=>showSlide(si+1);
let galleryTimer=setInterval(()=>showSlide(si+1),5200);
$('.gallery').addEventListener('mouseenter',()=>clearInterval(galleryTimer));
$('.gallery').addEventListener('mouseleave',()=>galleryTimer=setInterval(()=>showSlide(si+1),5200));

const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
$$('.reveal').forEach((e,i)=>{e.style.transitionDelay=(i%5)*70+'ms';observer.observe(e)});

addEventListener('scroll',()=>{
  $$('.parallax img').forEach(img=>{
    const r=img.parentElement.getBoundingClientRect();
    const p=(innerHeight-r.top)/(innerHeight+r.height);
    img.style.transform=`translateY(${(p-.5)*55}px) scale(1.08)`;
  });
},{passive:true});

$$('a[href^="#"]').forEach(a=>a.onclick=e=>{
  const t=$(a.getAttribute('href'));
  if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}
});

const menu=$('#mobileMenu');
$('#menuBtn').onclick=()=>menu.classList.add('open');
$('#menuClose').onclick=()=>menu.classList.remove('open');
$$('.mobile-link').forEach(a=>a.onclick=()=>menu.classList.remove('open'));

const modal=$('#bookingModal'), serviceModal=$('#serviceModal');
function openModal(m){m.classList.add('open');document.body.classList.add('lock')}
function closeModal(m){m.classList.remove('open');document.body.classList.remove('lock')}
$$('[data-open-booking]').forEach(b=>b.onclick=()=>openModal(modal));
$$('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.closest('.modal')));
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m)}));

$$('.service').forEach(card=>card.addEventListener('click',()=>{
  $('#serviceTitle').textContent=card.querySelector('h3').textContent;
  $('#serviceText').textContent=card.querySelector('p').textContent;
  openModal(serviceModal);
}));

$('#bookingForm').addEventListener('submit',e=>{
  e.preventDefault();
  closeModal(modal);
  const toast=$('#toast');toast.textContent='Thank you — your enquiry is ready to send.';
  toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000);
});

document.addEventListener('mousemove',e=>{
  const c=$('#cursor');if(c){c.style.left=e.clientX+'px';c.style.top=e.clientY+'px'}
});
$$('a,button,.service').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});
$('#year').textContent=new Date().getFullYear();


// Premium GSAP motion layer (falls back to the native observer/parallax above if GSAP is unavailable)
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.fromTo(el, {y: 55, opacity: 0}, {y: 0, opacity: 1, duration: 1.05, delay: (i % 4) * .05, ease: 'power3.out', scrollTrigger: {trigger: el, start: 'top 88%', once: true}});
  });
  gsap.utils.toArray('.parallax img').forEach(img => {
    gsap.to(img, {yPercent: 8, ease: 'none', scrollTrigger: {trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true}});
  });
  gsap.to('.hero-content', {y: -35, ease: 'none', scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true}});
  gsap.utils.toArray('.service').forEach((card, i) => {
    gsap.from(card, {x: i % 2 ? 35 : -35, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: {trigger: card, start: 'top 88%', once: true}});
  });
}
