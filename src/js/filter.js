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
    } else {
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

const filterMap = {
    grayscale: 'grayscale(100%)',
    sepia: 'sepia(100%)',
    invert: 'invert(100%)',
    brightness: 'brightness(150%)',
    contrast: 'contrast(150%)',
    blur: 'blur(5px)',
    saturate: 'saturate(200%)',
    'hue-rotate': 'hue-rotate(90deg)',
    opacity: 'opacity(50%)',
    'drop-shadow': 'drop-shadow(16px 16px 20px blue)',
    'grayscale-invert': 'grayscale(100%) invert(100%)',
    'sepia-blur': 'sepia(100%) blur(5px)'
};

let currentFilter = '';

function applyFilter(filterName) {
    currentFilter = filterMap[filterName];
    canvas.style.filter = currentFilter;
}

function getFilterCSS(filterName) {
    return filterMap[filterName] || '';
}

function applyCSSFilterToCanvas(ctx, filterCSS) {
    ctx.filter = filterCSS;
}

grayscaleBtn.addEventListener('click', () => applyFilter('grayscale'));
sepiaBtn.addEventListener('click', () => applyFilter('sepia'));
invertBtn.addEventListener('click', () => applyFilter('invert'));
brightnessBtn.addEventListener('click', () => applyFilter('brightness'));
contrastBtn.addEventListener('click', () => applyFilter('contrast'));
blurBtn.addEventListener('click', () => applyFilter('blur'));
saturateBtn.addEventListener('click', () => applyFilter('saturate'));
hueRotateBtn.addEventListener('click', () => applyFilter('hue-rotate'));
opacityBtn.addEventListener('click', () => applyFilter('opacity'));
dropShadowBtn.addEventListener('click', () => applyFilter('drop-shadow'));
grayscaleInvertBtn.addEventListener('click', () => applyFilter('grayscale-invert'));
sepiaBlurBtn.addEventListener('click', () => applyFilter('sepia-blur'));

downloadBtn.addEventListener('click', () => {
    const filteredCanvas = document.createElement('canvas');
    const filteredCtx = filteredCanvas.getContext('2d');

    filteredCanvas.width = canvas.width;
    filteredCanvas.height = canvas.height;

    applyCSSFilterToCanvas(filteredCtx, currentFilter);
    filteredCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = 'filtered-image.png';
    link.href = filteredCanvas.toDataURL();
    link.click();

    document.getElementById('message1').style.display = 'block';
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
