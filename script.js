/* DOM бэлэн болсны дараа ажиллана (ямар ч орчинд найдвартай) */
function initApp(){
const SERVICES=[["🪪","Иргэний үнэмлэх сэргээх"],["🚗","Жолооны үнэмлэх"],["🏠","Өмчлөлийн гэрчилгээ"],["👶","Төрсний гэрчилгээ"],["💍","Гэрлэлтийн гэрчилгээ"],["🎖","Цэргийн албаны мэдээлэл"],["🧸","Хүүхдийн тэтгэмж"],["💳","Торгуулийн төлбөр төлөх"],["🎓","Боловсролын гэрчилгээ"],["🏥","Эрүүл мэндийн даатгал"]];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];

/* ---- Мэдэгдэл ---- */
let tt;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),1600)}

/* ---- Табууд ---- */
function show(id){
  $$('.tab').forEach(t=>t.classList.toggle('on',t.id===id));
  $$('.nav [data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===id));
  $('#screen').scrollTop=0;
}
$$('.nav [data-tab]').forEach(b=>b.onclick=()=>show(b.dataset.tab));
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-toast]');if(t)toast(t.dataset.toast);
  const g=e.target.closest('[data-go]');if(g){show('services');toast(g.dataset.go)}
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList.contains('item'))e.target.click()});

/* ---- Үйлчилгээ хайх ---- */
function render(list,el){
  el.innerHTML=list.length?list.map(s=>`<div class="item" tabindex="0" data-toast="${s[1]}"><i>${s[0]}</i>${s[1]}<em>›</em></div>`).join(''):'<div class="empty">Үйлчилгээ олдсонгүй</div>';
}
render(SERVICES,$('#svcList'));
$('#q').oninput=e=>{
  const v=e.target.value.trim().toLowerCase(),r=$('#results');
  r.style.display=v?'block':'none';
  if(v)render(SERVICES.filter(s=>s[1].toLowerCase().includes(v)),r);
};
$('#date').textContent=new Date().toLocaleDateString('mn-MN',{month:'long',day:'numeric'});

/* ---- Харанхуй / гэрэл горим ---- */
$('#theme').onclick=()=>{
  const r=document.documentElement;
  const dark=getComputedStyle(r).getPropertyValue('--bg').trim()==='#0f1420';
  r.dataset.theme=dark?'light':'dark';
  try{localStorage.setItem('theme',r.dataset.theme)}catch(e){}
};
try{const t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}

/* ---- Үнэмлэхний слайдер ---- */
const slider=$('#slider'),slides=$$('.slide'),dotsBox=$('#dots');
slides.forEach((_,i)=>{
  const d=document.createElement('button');
  d.className='dot'+(i===0?' on':'');
  d.setAttribute('aria-label','Карт '+(i+1));
  d.onclick=()=>slides[i].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
  dotsBox.appendChild(d);
});
slider.addEventListener('scroll',()=>{
  const i=Math.min(Math.round(slider.scrollLeft/slider.clientWidth),slides.length-1);
  [...dotsBox.children].forEach((d,k)=>d.classList.toggle('on',k===i));
});

/* ---- Цээж зураг: карт бүр дээр тусдаа "+ Зураг" ---- */
const input=$('#photoInput'),slots=$$('.photo-slot');
let active=0;
function setPhoto(i,src){
  const s=slots[i],img=s.querySelector('.photo');
  if(src){img.src=src;s.classList.add('has')}
  else{img.removeAttribute('src');s.classList.remove('has')}
}
slots.forEach((s,i)=>s.onclick=()=>{active=i;input.click()});
input.onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    setPhoto(active,r.result);
    try{localStorage.setItem('idPhoto'+active,r.result)}catch(err){toast('Зураг хэт том, хадгалагдсангүй')}
    toast('Зураг орлоо');
  };
  r.readAsDataURL(f);
  input.value='';
};
/* "Зураг устгах" — одоо харагдаж буй картын зургийг устгана */
$('#clearPhoto').onclick=()=>{
  const i=Math.min(Math.round(slider.scrollLeft/slider.clientWidth),slides.length-1);
  setPhoto(i,null);
  try{localStorage.removeItem('idPhoto'+i)}catch(e){}
  toast('Зураг устлаа');
};
slots.forEach((_,i)=>{try{const p=localStorage.getItem('idPhoto'+i);if(p)setPhoto(i,p)}catch(e){}});

}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initApp);else initApp();