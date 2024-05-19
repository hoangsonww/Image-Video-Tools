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
const downloadBtn = document.getElementById('download-btn');
const message = document.getElementById('message');

let img = new Image();
let isDragging = false;
let startX, startY, endX, endY;
let animationFrameId;

const MIN_IMAGE_DIMENSION = 700;
const MIN_CANVAS_DIMENSION = 700;

upload.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        img.onload = () => {
            if (img.width < MIN_IMAGE_DIMENSION || img.height < MIN_IMAGE_DIMENSION) {
                alert('Image is too small to be cropped. Please upload an image with a minimum dimension of 700x700.');
                canvas.style.display = 'none';
                message.style.display = 'block';
                downloadBtn.disabled = true;
            }
            else {
                const ratio = img.width / img.height;
                canvas.width = Math.max(Math.min(window.innerWidth * 0.9, img.width), MIN_CANVAS_DIMENSION);
                canvas.height = canvas.width / ratio;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.style.display = 'block';
                message.style.display = 'none';
                downloadBtn.disabled = false;
                enableCanvas();
            }
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

function enableCanvas() {
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
}

function onMouseDown(e) {
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
    endX = startX;
    endY = startY;
}

function onMouseMove(e) {
    if (isDragging) {
        endX = e.offsetX;
        endY = e.offsetY;

        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(draw);
    }
}

function onMouseUp() {
    isDragging = false;
}

function draw() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

    const rectStartX = Math.min(startX, endX);
    const rectStartY = Math.min(startY, endY);
    const rectEndX = Math.max(startX, endX);
    const rectEndY = Math.max(startY, endY);

    ctx.fillRect(0, 0, canvas.width, rectStartY);
    ctx.fillRect(0, rectStartY, rectStartX, rectEndY - rectStartY);
    ctx.fillRect(rectEndX, rectStartY, canvas.width - rectEndX, rectEndY - rectStartY);
    ctx.fillRect(0, rectEndY, canvas.width, canvas.height - rectEndY);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(rectStartX, rectStartY, rectEndX - rectStartX, rectEndY - rectStartY);
}

downloadBtn.addEventListener('click', () => {
    if (startX !== undefined && startY !== undefined && endX !== undefined && endY !== undefined) {
        const rectStartX = Math.min(startX, endX);
        const rectStartY = Math.min(startY, endY);
        const rectEndX = Math.max(startX, endX);
        const rectEndY = Math.max(startY, endY);

        const croppedWidth = rectEndX - rectStartX;
        const croppedHeight = rectEndY - rectStartY;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = croppedWidth;
        tempCanvas.height = croppedHeight;

        tempCtx.drawImage(img, rectStartX * (img.width / canvas.width), rectStartY * (img.height / canvas.height), croppedWidth * (img.width / canvas.width), croppedHeight * (img.height / canvas.height), 0, 0, croppedWidth, croppedHeight);
        const link = document.createElement('a');
        link.download = 'cropped-image.png';
        link.href = tempCanvas.toDataURL();
        link.click();
    }
});
