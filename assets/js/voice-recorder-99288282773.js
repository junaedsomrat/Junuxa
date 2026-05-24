document.getElementById("year").textContent=new Date().getFullYear();

const toggle=document.getElementById("menuToggle");
const navLinks=document.getElementById("navLinks");
toggle.addEventListener("pointerdown",(e)=>{e.preventDefault();toggle.classList.toggle("active");navLinks.classList.toggle("active");});

let mediaRecorder,audioStream,audioContext,analyser,dataArray,animationId,chunks=[],isRecording=false,startTime,timerInterval;
const recordBtn=document.getElementById('recordBtn');
const saveBtn=document.getElementById('saveBtn');
const timerEl=document.getElementById('timer');
const statusEl=document.getElementById('status');
const canvas=document.getElementById('visualizer');
const canvasCtx=canvas.getContext('2d');
const saveModal=document.getElementById('saveModal');
const filenameInput=document.getElementById('filename');
const confirmSave=document.getElementById('confirmSave');
const cancelSave=document.getElementById('cancelSave');
const constraints={audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true,sampleRate:48000,channelCount:1}};

recordBtn.addEventListener('pointerdown',(e)=>{e.preventDefault();toggleRecording()});
saveBtn.addEventListener('pointerdown',(e)=>{e.preventDefault();openSaveModal()});
cancelSave.addEventListener('pointerdown',(e)=>{e.preventDefault();closeModal()});
confirmSave.addEventListener('pointerdown',(e)=>{e.preventDefault();saveRecording()});
saveModal.addEventListener('pointerdown',(e)=>{if(e.target===saveModal) closeModal();});

function openSaveModal(){
  saveModal.classList.add('active');
  filenameInput.value='recording_'+new Date().toISOString().slice(0,19).replace(/[:T]/g,'-');
  setTimeout(()=>filenameInput.focus(),100);
}
function closeModal(){saveModal.classList.remove('active');}
async function toggleRecording(){if(!isRecording){await startRecording()}else{stopRecording()}}
async function startRecording(){
  try{
    chunks=[];
    audioStream=await navigator.mediaDevices.getUserMedia(constraints);
    audioContext=new (window.AudioContext||window.webkitAudioContext)();
    const source=audioContext.createMediaStreamSource(audioStream);
    analyser=audioContext.createAnalyser();
    analyser.fftSize=256;
    source.connect(analyser);
    dataArray=new Uint8Array(analyser.frequencyBinCount);
    let mimeType='audio/webm;codecs=opus';
    if(!MediaRecorder.isTypeSupported(mimeType)){
      mimeType='audio/mp4';
      if(!MediaRecorder.isTypeSupported(mimeType)){mimeType='';}
    }
    mediaRecorder=new MediaRecorder(audioStream,mimeType?{mimeType}:{});
    mediaRecorder.ondataavailable=e=>{if(e.data.size>0)chunks.push(e.data)};
    mediaRecorder.onstop=()=>{statusEl.textContent='Recording stopped. Click Save to download.';saveBtn.disabled=false;if(audioContext)audioContext.close();};
    mediaRecorder.start(100);
    isRecording=true;
    recordBtn.textContent='Stop';
    recordBtn.classList.add('recording');
    statusEl.textContent='Recording...';
    saveBtn.disabled=true;
    startTimer();
    drawWaveform();
  }catch(err){statusEl.textContent='Microphone access denied';console.error(err)}
}
function stopRecording(){
  if(!mediaRecorder||!isRecording)return;
  mediaRecorder.stop();
  if(audioStream)audioStream.getTracks().forEach(track=>track.stop());
  cancelAnimationFrame(animationId);
  stopTimer();
  isRecording=false;
  recordBtn.textContent='Record';
  recordBtn.classList.remove('recording');
}
function saveRecording(){
  const filename=filenameInput.value.trim();
  if(!filename)return;
  if(chunks.length===0){statusEl.textContent='No recording data';return}
  const blob=new Blob(chunks);
  const url=URL.createObjectURL(blob);
  const ext=blob.type.includes('mp4')?'m4a':'webm';
  const a=document.createElement('a');
  a.href=url;a.download=filename+'.'+ext;a.style.display='none';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  statusEl.textContent='File saved as '+filename+'.'+ext;
  chunks=[];saveBtn.disabled=true;closeModal();
}
function drawWaveform(){
  animationId=requestAnimationFrame(drawWaveform);
  if(!analyser)return;
  analyser.getByteTimeDomainData(dataArray);
  canvasCtx.fillStyle='rgba(59,130,246,0.04)';
  canvasCtx.fillRect(0,0,canvas.width,canvas.height);
  canvasCtx.lineWidth=2;
  canvasCtx.strokeStyle='#3b82f6';
  canvasCtx.beginPath();
  const sliceWidth=canvas.width/dataArray.length;
  let x=0;
  for(let i=0;i<dataArray.length;i++){
    const v=dataArray[i]/128.0;
    const y=v*canvas.height/2;
    if(i===0)canvasCtx.moveTo(x,y);else canvasCtx.lineTo(x,y);
    x+=sliceWidth
  }
  canvasCtx.stroke()
}
function startTimer(){
  startTime=Date.now();
  timerInterval=setInterval(()=>{
    const elapsed=Math.floor((Date.now()-startTime)/1000);
    const mins=String(Math.floor(elapsed/60)).padStart(2,'0');
    const secs=String(elapsed%60).padStart(2,'0');
    timerEl.textContent=`${mins}:${secs}`
  },1000)
}
function stopTimer(){clearInterval(timerInterval)}
function resizeCanvas(){canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight}
window.addEventListener('resize',resizeCanvas);
resizeCanvas()