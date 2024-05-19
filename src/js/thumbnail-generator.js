document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    }
    else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const message = document.getElementById('message');
const generateThumbnailsBtn = document.getElementById('generate-thumbnails-btn');
const generateThumbnailBtn = document.getElementById('generate-thumbnail-btn');
const downloadBtn = document.getElementById('download-btn');
const thumbnailsContainer = document.getElementById('thumbnails');
const timestampInput = document.getElementById('timestamp');

let videoElement = document.createElement('video');
let selectedThumbnail = null;
let thumbnailTimes = [];
let currentThumbnailIndex = 0;

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];

    if (file?.type?.startsWith('video/')) {
        videoElement.src = URL.createObjectURL(file);
        message.style.display = 'none';
        generateThumbnailsBtn.disabled = false;
        generateThumbnailBtn.disabled = false;
        timestampInput.disabled = false;
        videoElement.addEventListener('loadeddata', () => {
            console.log('Video metadata loaded');
        });
    }
    else {
        alert('Please upload a valid video file.');
    }
});

generateThumbnailsBtn.addEventListener('click', () => {
    generateThumbnails();
});

generateThumbnailBtn.addEventListener('click', () => {
    const timestamp = parseFloat(timestampInput.value);

    if (isNaN(timestamp) || timestamp < 0 || timestamp > videoElement.duration) {
        alert('Please enter a valid timestamp within the video duration.');
    }
    else {
        captureThumbnail(timestamp);
    }
});

function generateThumbnails() {
    thumbnailsContainer.innerHTML = '';
    thumbnailTimes = [];
    const duration = videoElement.duration;

    for (let i = 0; i < 20; i++) {
        thumbnailTimes.push((i / 20) * duration);
    }

    currentThumbnailIndex = 0;
    captureNextThumbnail();
}

function captureNextThumbnail() {
    if (currentThumbnailIndex < thumbnailTimes.length) {
        captureThumbnail(thumbnailTimes[currentThumbnailIndex], true);
        currentThumbnailIndex++;
    }
}

function captureThumbnail(time, isBatch = false) {
    videoElement.currentTime = time;
    videoElement.addEventListener('seeked', function capture() {
        const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;
        const canvasWidth = canvas.width;
        const canvasHeight = canvasWidth / videoAspectRatio;
        canvas.height = canvasHeight;

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const thumbnailDataURL = canvas.toDataURL('image/png');
        const img = document.createElement('img');

        img.src = thumbnailDataURL;
        img.className = 'thumbnail';
        img.style.width = '90%';
        img.addEventListener('click', () => selectThumbnail(img, thumbnailDataURL));

        thumbnailsContainer.appendChild(img);
        videoElement.removeEventListener('seeked', capture);

        if (isBatch) {
            setTimeout(captureNextThumbnail, 100);
        }
    });
}

function selectThumbnail(img, dataURL) {
    if (selectedThumbnail) {
        selectedThumbnail.classList.remove('selected');
    }

    img.classList.add('selected');
    selectedThumbnail = img;
    downloadBtn.disabled = false;
    downloadBtn.onclick = () => downloadThumbnail(dataURL);
}

function downloadThumbnail(dataURL) {
    const link = document.createElement('a');
    link.download = 'thumbnail.png';
    link.href = dataURL;
    link.click();
}
