// ============================================
// main.js — AlphaVerse LMS Main Script
// ============================================

let COURSES = {};
let S = { cId:null, sI:null, chI:null, tI:null };

// ── Page Navigation ──────────────────────────
function showPage(n){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+n).classList.add('active');
  window.scrollTo(0,0);
}

function goHome(){ showPage('home'); }

function scrollToCourses(){
  document.getElementById('courses-anchor').scrollIntoView({behavior:'smooth'});
}

function setBc(ids,val){
  ids.forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=val});
}

// ── Course Navigation ─────────────────────────
function openCourse(cId){
  const courses = window.COURSES || {};
  S.cId=cId;
  const c=courses[cId];
  if(!c)return;
  document.getElementById('sub-title').textContent=c.name;
  document.getElementById('sub-sub').textContent='Subject select karo';
  setBc(['bc1','bc2','bc4','bc7'],c.name);
  const con=document.getElementById('sub-container');
  con.innerHTML='';
  c.subjects.forEach((s,i)=>{
    const d=document.createElement('div');
    d.className='sub-card';
    d.style.borderLeft='4px solid '+c.color;
    d.innerHTML=`
      <div class="icon">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <p style="font-size:.78rem;color:var(--text-muted)">📂 ${s.chapters.length} Chapters</p>
      <div class="arr">Show Chapters →</div>`;
    d.onclick=()=>openSubject(i);
    con.appendChild(d);
  });
  showPage('subjects');
}

function openSubject(sI){
  const courses = window.COURSES || {};
  S.sI=sI;
  const s=courses[S.cId].subjects[sI];
  document.getElementById('ch-title').textContent=s.name;
  document.getElementById('ch-sub').textContent=s.desc;
  setBc(['bc3','bc5','bc8'],s.name);
  const con=document.getElementById('ch-container');
  con.innerHTML='';
  s.chapters.forEach((ch,i)=>{
    const d=document.createElement('div');
    d.className='ch-card';
    d.style.borderTop='3px solid '+(courses[S.cId].color||'#e94560');
    d.innerHTML=`
      <h3>📖 ${ch.name}</h3>
      <p>${ch.desc}</p>
      <p style="font-size:.78rem;color:var(--text-muted)">🎬 ${ch.topics.length} Topics</p>
      <div class="arr">Select Topics →</div>`;
    d.onclick=()=>openChapter(i);
    con.appendChild(d);
  });
  showPage('chapters');
}

function openChapter(chI){
  const courses = window.COURSES || {};
  S.chI=chI;
  const ch=courses[S.cId].subjects[S.sI].chapters[chI];
  document.getElementById('tp-title').textContent=ch.name;
  document.getElementById('tp-sub').textContent=ch.desc;
  setBc(['bc6','bc9'],ch.name);
  const con=document.getElementById('tp-container');
  con.innerHTML='';
  ch.topics.forEach((t,i)=>{
    const d=document.createElement('div');
    d.className='tp-card';
    d.innerHTML=`
      <h3>🎬 ${t.name}</h3>
      <p>${t.desc}</p>
      <div class="arr" style="margin-top:.4rem">▶ Play Video →</div>`;
    d.onclick=()=>openTopic(i);
    con.appendChild(d);
  });
  showPage('topics');
}

async function openTopic(tI){
  const courses = window.COURSES || {};
  S.tI=tI;
  const t=courses[S.cId].subjects[S.sI].chapters[S.chI].topics[tI];
  if(!t)return;
  document.getElementById('vid-title').textContent=t.name;
  document.getElementById('vid-sub').textContent=t.desc||'';
  document.getElementById('bc10').textContent=t.name;
  document.getElementById('vid-topic-name').textContent=t.name;
  document.getElementById('vid-topic-desc').textContent=t.desc||'';
  const ifr=document.getElementById('vid-iframe');
  ifr.style.display='none';ifr.src='';
  document.getElementById('vid-placeholder').style.display='flex';
  showPage('video');
  if(typeof window.getVidUrl==='function'){
    const subjectId = courses[S.cId].subjects[S.sI].id || S.sI;
    const chapterId = courses[S.cId].subjects[S.sI].chapters[S.chI].id || S.chI;
    const topicId   = t.id || tI;
    const url=await window.getVidUrl(S.cId, subjectId, chapterId, topicId);
    if(url) embedVid(url);
  }
}

// ── Video Embed ───────────────────────────────
function embedVid(url){
  let em=url;

  // Normal YouTube: watch?v=ID
  const yt=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if(yt) em='https://www.youtube.com/embed/'+yt[1]+'?rel=0&autoplay=1';

  // ScreenApp support
  if(url.includes("screenapp.io/app/v/")) em=url;

  // PW Live / any live page URL
  if(url.includes("pwthor.live/live")||url.includes("pw.live/live")) em=url;

  // YouTube Live: /live/ID
  const ytLive=url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
  if(ytLive) em='https://www.youtube.com/embed/'+ytLive[1]+'?rel=0&autoplay=1';

  // YouTube Shorts: /shorts/ID
  const ytShort=url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if(ytShort) em='https://www.youtube.com/embed/'+ytShort[1]+'?rel=0&autoplay=1';

  // Google Drive
  const gd=url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if(gd) em='https://drive.google.com/file/d/'+gd[1]+'/preview';

  // Direct MP4
  if(url.match(/\.(mp4|webm|ogg|mkv)(\?.*)?$/i)) em=url;

  const ifr=document.getElementById('vid-iframe');
  ifr.src=em;ifr.style.display='block';
  document.getElementById('vid-placeholder').style.display='none';
}

// ── Login Modal ───────────────────────────────
function openLogin(){ document.getElementById('login-modal').classList.add('open'); }
function closeLogin(){ document.getElementById('login-modal').classList.remove('open'); }
function modalOutClick(e){ if(e.target===document.getElementById('login-modal')) closeLogin(); }

function switchTab(t){
  document.getElementById('f-login').style.display=t==='l'?'block':'none';
  document.getElementById('f-signup').style.display=t==='s'?'block':'none';
  document.getElementById('t-login').classList.toggle('active',t==='l');
  document.getElementById('t-signup').classList.toggle('active',t==='s');
}

// ── Toast ─────────────────────────────────────
function showToast(m,err=false){
  const t=document.getElementById('toast');
  t.textContent=m;
  t.style.background=err?'#e94560':'#10b981';
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3200);
}

// ── Auth Wall ─────────────────────────────────
window.closeAuthWall=function(){
  document.getElementById('auth-wall').classList.remove('show');
};

// ── Fullscreen Landscape Lock ─────────────────
document.addEventListener('fullscreenchange',()=>{
  if(document.fullscreenElement){
    screen.orientation?.lock('landscape').catch(()=>{});
  } else {
    screen.orientation?.unlock();
  }
});
document.addEventListener('webkitfullscreenchange',()=>{
  if(document.webkitFullscreenElement){
    screen.orientation?.lock('landscape').catch(()=>{});
  } else {
    screen.orientation?.unlock();
  }
});

// ── Fallbacks ─────────────────────────────────
window.doLogin   = window.doLogin   || (()=>showToast('Firebase setup required',true));
window.doSignup  = window.doSignup  || (()=>showToast('Firebase setup required',true));
window.doGoogle  = window.doGoogle  || (()=>showToast('Firebase setup required',true));
window.doLogout  = window.doLogout  || (()=>{});
window.doReset   = window.doReset   || (()=>{});
window.goCourse  = window.goCourse  || (()=>showToast('Loading...',false));
