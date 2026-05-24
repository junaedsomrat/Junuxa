const $ = id => document.getElementById(id);

function buildJSON(){
  const data = {
    production_id: $("prodId").value.trim(),
    video_title: $("title").value.trim(),
    thumbnail: $("thumbnail").value.trim() || null,
    creation_date: $("date").value || null,
    editor: $("editor").value.trim(),
    voice_over: $("voice").value.trim(),
    online_link: $("online").value.trim() || null,
    backup_link: $("backup").value.trim() || null,
    notes: $("notes").value.trim() || null
  };
  
  // remove null values for cleaner JSON
  Object.keys(data).forEach(k => {
    if(data[k] === null || data[k] === "") delete data[k];
  });
  
  return JSON.stringify(data, null, 2);
}

$("genBtn").addEventListener("click", () => {
  const json = buildJSON();
  $("output").textContent = json;
  $("output").style.display = "block";
});

$("copyBtn").addEventListener("click", async () => {
  const json = $("output").textContent;
  if(!json){
    alert("আগে Generate JSON txt এ ক্লিক করুন");
    return;
  }
  try{
    await navigator.clipboard.writeText(json);
    const btn = $("copyBtn");
    const oldText = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => btn.textContent = oldText, 1500);
  }catch(e){
    alert("Copy করতে পারলাম না। ম্যানুয়ালি সিলেক্ট করে কপি করুন।");
  }
});