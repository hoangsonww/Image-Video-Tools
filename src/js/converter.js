const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const message = document.getElementById('message');
const convertToPngBtn = document.getElementById('convert-to-png');
const convertToJpegBtn = document.getElementById('convert-to-jpeg');
const convertToBmpBtn = document.getElementById('convert-to-bmp');
const convertToGifBtn = document.getElementById('convert-to-gif');
const convertToWebpBtn = document.getElementById('convert-to-webp');
const convertToTiffBtn = document.getElementById('convert-to-tiff');
const downloadBtn = document.getElementById('download-btn');
let img = new Image();
let convertedImageDataURL = '';
let activeBtn = null;

const MIN_IMAGE_DIMENSION = 100; // Minimum dimension for width and height

upload.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        img.onload = () => {
            if (img.width < MIN_IMAGE_DIMENSION || img.height < MIN_IMAGE_DIMENSION) {
                alert('Image is too small. Please upload an image with dimensions at least 100x100 pixels.');
                canvas.style.display = 'none';
                message.style.display = 'block';
                disableButtons();
            } else {
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

function convertImage(format, button) {
    if (activeBtn) {
        activeBtn.classList.remove('active');
    }
    button.classList.add('active');
    activeBtn = button;

    convertedImageDataURL = canvas.toDataURL(`image/${format}`);
    downloadBtn.disabled = false;
}

convertToPngBtn.addEventListener('click', () => convertImage('png', convertToPngBtn));
convertToJpegBtn.addEventListener('click', () => convertImage('jpeg', convertToJpegBtn));
convertToBmpBtn.addEventListener('click', () => convertImage('bmp', convertToBmpBtn));
convertToGifBtn.addEventListener('click', () => convertImage('gif', convertToGifBtn));
convertToWebpBtn.addEventListener('click', () => convertImage('webp', convertToWebpBtn));
convertToTiffBtn.addEventListener('click', () => convertImage('tiff', convertToTiffBtn));

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `converted-image.${activeBtn.textContent.split(' ')[2].toLowerCase()}`;
    link.href = convertedImageDataURL;
    link.click();
});

function enableButtons() {
    convertToPngBtn.disabled = false;
    convertToJpegBtn.disabled = false;
    convertToBmpBtn.disabled = false;
    convertToGifBtn.disabled = false;
    convertToWebpBtn.disabled = false;
    convertToTiffBtn.disabled = false;
    downloadBtn.disabled = true;
}

function disableButtons() {
    convertToPngBtn.disabled = true;
    convertToJpegBtn.disabled = true;
    convertToBmpBtn.disabled = true;
    convertToGifBtn.disabled = true;
    convertToWebpBtn.disabled = true;
    convertToTiffBtn.disabled = true;
    downloadBtn.disabled = true;
}