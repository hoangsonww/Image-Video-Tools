document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    document.getElementById('message1').style.display = 'none';
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

const upload = document.getElementById('upload');
const uploadMessage = document.getElementById('upload-message');
const processBtn = document.getElementById('process-btn');
const downloadBtn = document.getElementById('download-btn');
const spinner = document.getElementById('spinner');
const outputVideo = document.getElementById('output-video');
const message = document.getElementById('message');
const progress = document.querySelector('.progress');
const progressBarFill = document.querySelector('.progress-bar-fill');
const progressText = document.getElementById('progress-text');
let processedVideoBlob = null;

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file?.type?.startsWith('video/')) {
        outputVideo.src = URL.createObjectURL(file);
        uploadMessage.style.display = 'none';
        processBtn.disabled = false;
    }
    else {
        alert('Please upload a valid video file.');
    }
});

processBtn.addEventListener('click', () => {
    handleProcessing();

    document.getElementById('message1').style.display = 'block';
});

async function handleProcessing() {
    processBtn.disabled = true;
    spinner.style.display = 'block';
    progress.style.display = 'flex';
    message.textContent = '';
    progressText.textContent = '0%';
    progressBarFill.style.width = '0%';

    try {
        const file = upload.files[0];
        const videoURL = URL.createObjectURL(file);
        const videoElement = document.createElement('video');

        videoElement.src = videoURL;
        await videoElement.play();

        const stream = videoElement.captureStream();
        const audioTracks = stream.getAudioTracks();
        audioTracks.forEach(track => track.stop());

        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
                const percentComplete = ((chunks.length / (stream.getVideoTracks()[0].getSettings().frameRate * videoElement.duration)) * 100).toFixed(2);
                progressText.textContent = `${(percentComplete * 3.5).toFixed(2)}%`;
                progressBarFill.style.width = `${percentComplete * 3.5}%`;
            }
        };

        mediaRecorder.onstop = () => {
            processedVideoBlob = new Blob(chunks, { type: 'video/webm' });
            const processedUrl = URL.createObjectURL(processedVideoBlob);
            outputVideo.src = processedUrl;
            message.textContent = 'Audio Removed';
            downloadBtn.disabled = false;
            spinner.style.display = 'none';
            progress.style.display = 'none';
        };

        mediaRecorder.start(100);
        videoElement.onended = () => {
            mediaRecorder.stop();
        };
    }
    catch (error) {
        console.error(error);
        spinner.style.display = 'none';
        progress.style.display = 'none';
        message.textContent = 'Error processing video.';
    }
}

downloadBtn.addEventListener('click', () => {
    if (processedVideoBlob) {
        const url = URL.createObjectURL(processedVideoBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'video_without_audio.webm';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    }
});
