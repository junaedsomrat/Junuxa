document.getElementById("year").textContent=new Date().getFullYear();

const toggle=document.getElementById("menuToggle");
const navLinks=document.getElementById("navLinks");
toggle.addEventListener("click",()=>{toggle.classList.toggle("active");navLinks.classList.toggle("active");});

const $=id=>document.getElementById(id);

function showText(id,val){
 const el=$(id);
 if(val&&String(val).trim()!==""){
  el.textContent=val;
  el.className="value";
 }else{
  el.textContent="No data found";
  el.className="value missing";
 }
}

function showLink(id,url){
 const el=$(id);
 if(url&&String(url).trim()!==""){
  const safeUrl=url.startsWith("http")?url:"https://"+url;
  el.innerHTML=`<a href="${safeUrl}" target="_blank" rel="noopener">${url}</a>`;
 }else{
  el.textContent="No data found";
  el.className="value missing";
 }
}

async function loadData(id){
 if(!id)return;
 $("loader").style.display="block";
 $("card").style.display="none";
 $("error").textContent="";
 $("thumb").style.display="none";
 $("prodId").value=id;
 try{
  const res=await fetch("https://junaedsomrat.github.io/Junuxa/data/json/production.json",{cache:"no-store"});
  if(!res.ok)throw new Error("Path not loaded");
  const data=await res.json();
  const item=Array.isArray(data)?data.find(v=>v.production_id===id):null;
  $("loader").style.display="none";
  $("card").style.display="block";
  if(!item){
   showText("out_id",id);
   ["out_title","out_date","out_editor","out_voice","out_notes"].forEach(f=>showText(f,""));
   showLink("out_online","");
   showLink("out_backup","");
   return;
  }
  showText("out_id",item.production_id);
  showText("out_title",item.video_title);
  showText("out_date",item.creation_date);
  showText("out_editor",item.editor);
  showText("out_voice",item.voice_over);
  showLink("out_online",item.online_link);
  showLink("out_backup",item.backup_link);
  showText("out_notes",item.notes);
  if(item.thumbnail){
   const img=$("thumb");
   img.src=item.thumbnail;
   img.style.display="block";
   img.onerror=()=>img.style.display="none";
  }
 }catch(err){
  $("loader").style.display="none";
  $("error").textContent=err.message;
 }
}

window.addEventListener("DOMContentLoaded",()=>{
 const params=new URLSearchParams(window.location.search);
 const idFromUrl=params.get("id");
 if(idFromUrl)loadData(idFromUrl);
});

$("btn").addEventListener("click",()=>{loadData($("prodId").value.trim());});
$("prodId").addEventListener("keydown",e=>{if(e.key==="Enter")loadData($("prodId").value.trim());});
