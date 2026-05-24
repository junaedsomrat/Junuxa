(function(){
  const params = new URLSearchParams(window.location.search);
  const content = document.getElementById('content');
  
  if(!content){
    document.body.innerHTML = '<h2>Error: Content container missing</h2>';
    return;
  }

  let file, folder, element;
  if(params.has('img')){ file = params.get('img'); folder = 'https://junaedsomrat.github.io/Junuxa/Images/'; element = 'img'; }
  else if(params.has('audio')){ file = params.get('audio'); folder = 'https://junaedsomrat.github.io/Junuxa/Audio/'; element = 'audio'; }
  else if(params.has('v')){ file = params.get('v'); folder = 'https://junaedsomrat.github.io/Junuxa/v/'; element = 'video'; }
  else if(params.has('apk')){ file = params.get('apk'); folder = 'https://junaedsomrat.github.io/Junuxa/Apk/'; element = 'download'; }
  else{ showError('No file specified', ''); return; }

  // Sanitize filename
  file = decodeURIComponent(file).split('/').pop().split('\\').pop();
  file = file.replace(/[^a-zA-Z0-9._-]/g, '');
  
  if(!file || file.length > 100){
    showError('Invalid file name', 'File name is empty or too long');
    return;
  }

  const fullPath = folder + file;

  if(element === 'img'){ loadImage(fullPath, file); }
  else if(element === 'video'){ loadVideo(fullPath, file); }
  else if(element === 'audio'){ loadAudio(fullPath, file); }
  else if(element === 'download'){ loadDownload(fullPath, file); }

  function loadImage(src, name){
    if(!/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(name)){ showError('Invalid file type', 'Only images allowed'); return; }
    const img = new Image();
    img.src = src;
    img.alt = name;
    img.onload = () => content.appendChild(img);
    img.onerror = () => showError('Image not found', src);
  }

  function loadVideo(src, name){
    if(!/\.(mp4|webm|ogg)$/i.test(name)){ showError('Invalid file type', 'Only mp4, webm, ogg allowed'); return; }
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.onloadeddata = () => content.appendChild(video);
    video.onerror = () => showError('Video not found', src);
  }

  function loadAudio(src, name){
    if(!/\.(mp3|wav|ogg|m4a)$/i.test(name)){ showError('Invalid file type', 'Only mp3, wav, ogg, m4a allowed'); return; }
    const audio = document.createElement('audio');
    audio.src = src;
    audio.controls = true;
    audio.onloadeddata = () => content.appendChild(audio);
    audio.onerror = () => showError('Audio not found', src);
  }

  function loadDownload(src, name){
    if(!/\.apk$/i.test(name)){ showError('Invalid file type', 'Only apk allowed'); return; }
    const h2 = document.createElement('h2');
    h2.textContent = 'Download Ready';
    const p = document.createElement('p');
    p.textContent = name;
    const a = document.createElement('a');
    a.href = src;
    a.className = 'download';
    a.download = name;
    a.textContent = 'Download APK';
    content.append(h2, p, a);
  }

  function showError(title, msg){
    content.innerHTML = `<div class="error"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(msg)}</p></div>`;
  }

  function escapeHtml(str){
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
