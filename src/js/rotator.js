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
const rotateBtn = document.getElementById('rotate-btn');
const flipHorizontalBtn = document.getElementById('flip-horizontal-btn');
const flipVerticalBtn = document.getElementById('flip-vertical-btn');
const downloadBtn = document.getElementById('download-btn');
const message = document.getElementById('message');

let img = new Image();
let rotationAngle = 0;
let flipH = false;
let flipV = false;

const MIN_IMAGE_DIMENSION = 100;

upload.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        img.onload = () => {
            if (img.width < MIN_IMAGE_DIMENSION || img.height < MIN_IMAGE_DIMENSION) {
                alert('Image is too small. Please upload an image with dimensions at least 100x100 pixels.');
                canvas.style.display = 'none';
                message.style.display = 'block';
                rotateBtn.disabled = true;
                flipHorizontalBtn.disabled = true;
                flipVerticalBtn.disabled = true;
                downloadBtn.disabled = true;
            }
            else {
                rotationAngle = 0;
                flipH = false;
                flipV = false;
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.style.display = 'block';
                message.style.display = 'none';
                rotateBtn.disabled = false;
                flipHorizontalBtn.disabled = false;
                flipVerticalBtn.disabled = false;
                downloadBtn.disabled = false;
            }
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

rotateBtn.addEventListener('click', () => {
    rotationAngle = (rotationAngle + 90) % 360;
    drawTransformedImage();
});

flipHorizontalBtn.addEventListener('click', () => {
    flipH = !flipH;
    drawTransformedImage();
});

flipVerticalBtn.addEventListener('click', () => {
    flipV = !flipV;
    drawTransformedImage();
});

function drawTransformedImage() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (rotationAngle % 180 === 0) {
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
    }
    else {
        tempCanvas.width = img.height;
        tempCanvas.height = img.width;
    }

    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.save();
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate(rotationAngle * Math.PI / 180);
    tempCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    tempCtx.drawImage(img, -img.width / 2, -img.height / 2);
    tempCtx.restore();

    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);
}

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'transformed-image.png';
    link.href = canvas.toDataURL();
    link.click();
});
