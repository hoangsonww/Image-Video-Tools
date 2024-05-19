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
const grayscaleBtn = document.getElementById('grayscale-btn');
const sepiaBtn = document.getElementById('sepia-btn');
const invertBtn = document.getElementById('invert-btn');
const brightnessBtn = document.getElementById('brightness-btn');
const contrastBtn = document.getElementById('contrast-btn');
const blurBtn = document.getElementById('blur-btn');
const saturateBtn = document.getElementById('saturate-btn');
const hueRotateBtn = document.getElementById('hue-rotate-btn');
const opacityBtn = document.getElementById('opacity-btn');
const dropShadowBtn = document.getElementById('drop-shadow-btn');
const grayscaleInvertBtn = document.getElementById('grayscale-invert-btn');
const sepiaBlurBtn = document.getElementById('sepia-blur-btn');
const downloadBtn = document.getElementById('download-btn');
let img = new Image();

const MIN_IMAGE_DIMENSION = 100;

upload.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        img.onload = () => {
            if (img.width < MIN_IMAGE_DIMENSION || img.height < MIN_IMAGE_DIMENSION) {
                alert('Image is too small. Please upload an image with dimensions at least 100x100 pixels.');
                canvas.style.display = 'none';
                message.style.display = 'block';
                disableButtons();
            }
            else {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.style.display = 'block';
                message.style.display = 'none';
                enableButtons();
            }
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
});

function applyFilter(filter) {
    ctx.drawImage(img, 0, 0);
    ctx.filter = filter;
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';
}

grayscaleBtn.addEventListener('click', () => applyFilter('grayscale(100%)'));
sepiaBtn.addEventListener('click', () => applyFilter('sepia(100%)'));
invertBtn.addEventListener('click', () => applyFilter('invert(100%)'));
brightnessBtn.addEventListener('click', () => applyFilter('brightness(150%)'));
contrastBtn.addEventListener('click', () => applyFilter('contrast(150%)'));
blurBtn.addEventListener('click', () => applyFilter('blur(5px)'));
saturateBtn.addEventListener('click', () => applyFilter('saturate(200%)'));
hueRotateBtn.addEventListener('click', () => applyFilter('hue-rotate(90deg)'));
opacityBtn.addEventListener('click', () => applyFilter('opacity(50%)'));
dropShadowBtn.addEventListener('click', () => applyFilter('drop-shadow(16px 16px 20px blue)'));
grayscaleInvertBtn.addEventListener('click', () => applyFilter('grayscale(100%) invert(100%)'));
sepiaBlurBtn.addEventListener('click', () => applyFilter('sepia(100%) blur(5px)'));

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'filtered-image.png';
    link.href = canvas.toDataURL();
    link.click();
});

function enableButtons() {
    grayscaleBtn.disabled = false;
    sepiaBtn.disabled = false;
    invertBtn.disabled = false;
    brightnessBtn.disabled = false;
    contrastBtn.disabled = false;
    blurBtn.disabled = false;
    saturateBtn.disabled = false;
    hueRotateBtn.disabled = false;
    opacityBtn.disabled = false;
    dropShadowBtn.disabled = false;
    grayscaleInvertBtn.disabled = false;
    sepiaBlurBtn.disabled = false;
    downloadBtn.disabled = false;
}

function disableButtons() {
    grayscaleBtn.disabled = true;
    sepiaBtn.disabled = true;
    invertBtn.disabled = true;
    brightnessBtn.disabled = true;
    contrastBtn.disabled = true;
    blurBtn.disabled = true;
    saturateBtn.disabled = true;
    hueRotateBtn.disabled = true;
    opacityBtn.disabled = true;
    dropShadowBtn.disabled = true;
    grayscaleInvertBtn.disabled = true;
    sepiaBlurBtn.disabled = true;
    downloadBtn.disabled = true;
}
