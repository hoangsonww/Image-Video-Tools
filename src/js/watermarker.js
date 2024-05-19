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
const watermarkText = document.getElementById('watermarkText');
const fontSize = document.getElementById('fontSize');
const watermarkColor = document.getElementById('watermarkColor');
const xPosition = document.getElementById('xPosition');
const yPosition = document.getElementById('yPosition');
const fontFamily = document.getElementById('fontFamily');
const fontStyle = document.getElementById('fontStyle');
const watermarkBtn = document.getElementById('watermark-btn');
const downloadBtn = document.getElementById('download-btn');
const message = document.getElementById('message');
const instructions = document.getElementById('instructions');
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
                watermarkBtn.disabled = true;
                downloadBtn.disabled = true;
            }
            else {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.style.display = 'block';
                message.style.display = 'none';
                watermarkBtn.disabled = false;
                downloadBtn.disabled = true;

                // default position is bottom left
                xPosition.value = 10;
                yPosition.value = canvas.height - 30;
                instructions.style.textAlign = 'center';
                instructions.textContent = `For X Position, enter a value between 0 and ${canvas.width}. For Y Position, enter a value between 0 and ${canvas.height}. Default position is bottom left. The higher the X value, the further right the watermark will be. The higher the Y value, the lower the watermark will be. Vice versa.`;
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

watermarkBtn.addEventListener('click', () => {
    const xPos = parseInt(xPosition.value, 10);
    const yPos = parseInt(yPosition.value, 10);

    if (xPos < 0 || xPos > canvas.width || yPos < 0 || yPos > canvas.height) {
        alert(`Please enter valid positions. Maximum X: ${canvas.width}, Maximum Y: ${canvas.height}`);
        return;
    }

    ctx.drawImage(img, 0, 0);
    ctx.font = `${fontStyle.value} ${fontSize.value}px ${fontFamily.value}`;
    ctx.fillStyle = watermarkColor.value;
    ctx.fillText(watermarkText.value, xPos, yPos);
    downloadBtn.disabled = false;
});

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'watermarked-image.png';
    link.href = canvas.toDataURL();
    link.click();
});
