const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const previewImg = document.getElementById('previewImg');
const fileInfo = document.getElementById('fileInfo');
const base64Output = document.getElementById('base64Output');

// Click to upload
dropZone.addEventListener('click', () => fileInput.click());

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
                handleFile(e.dataTransfer.files[0]);
        }
});

fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
                handleFile(e.target.files[0]);
        }
});

function handleFile(file) {
        if (!file.type.startsWith('image/')) {
                alert('শুধু ইমেজ ফাইল সাপোর্ট করে!');
                return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
                const base64 = e.target.result;
                
                // Show preview
                previewImg.src = base64;
                preview.style.display = 'block';
                
                // Show info
                fileInfo.innerHTML = `
            <strong>নাম:</strong> ${file.name} |
            <strong>সাইজ:</strong> ${(file.size / 1024).toFixed(2)} KB |
            <strong>টাইপ:</strong> ${file.type}
        `;
                
                // Show base64
                base64Output.value = base64;
        };
        
        reader.readAsDataURL(file);
}

function copyBase64() {
        base64Output.select();
        document.execCommand('copy');
        
        const alert = document.getElementById('alert');
        alert.style.display = 'block';
        setTimeout(() => alert.style.display = 'none', 2000);
}

function downloadTxt() {
        const text = base64Output.value;
        if (!text) return;
        
        const blob = new Blob([text], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'base64.txt';
        a.click();
        URL.revokeObjectURL(a.href);
}

function resetAll() {
        fileInput.value = '';
        preview.style.display = 'none';
        base64Output.value = '';
}