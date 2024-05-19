const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const message = document.getElementById('message');
const downloadBtn = document.getElementById('download-btn');
const formatLabel = document.createElement('div');

formatLabel.id = 'format-label';
downloadBtn.parentNode.insertBefore(formatLabel, downloadBtn);

let img = new Image();
let convertedImageDataURL = '';
let activeBtn = null;

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
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
});

function convertImage(format, button) {
    convertedImageDataURL = canvas.toDataURL(`image/${format}`);
    downloadBtn.disabled = false;

    setActiveButton(button);
    updateFormatLabel(format);
}

function setActiveButton(button) {
    if (activeBtn && activeBtn !== button) {
        activeBtn.classList.remove('active');
    }

    if (activeBtn !== button) {
        button.classList.add('active');
        activeBtn = button;
    }
}

function addConversionEventListeners() {
    const buttons = document.querySelectorAll('#formats button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const format = button.textContent.split(' ')[2].toLowerCase();
            convertImage(format, button);
        });
    });
}

function updateFormatLabel(format) {
    formatLabel.textContent = `Selected output format: ${format.toUpperCase()}`;
    formatLabel.style.marginTop = '10px';
}

addConversionEventListeners();

downloadBtn.addEventListener('click', () => {
    if (activeBtn) {
        const format = activeBtn.textContent.split(' ')[2].toLowerCase();
        const link = document.createElement('a');
        link.download = `converted-image.${format}`;
        link.href = convertedImageDataURL;
        link.click();
    }
});

function enableButtons() {
    document.querySelectorAll('#formats button').forEach(button => {
        button.disabled = false;
    });

    downloadBtn.disabled = true;
}

function disableButtons() {
    document.querySelectorAll('#formats button').forEach(button => {
        button.disabled = true;
    });

    downloadBtn.disabled = true;
}

document.addEventListener('DOMContentLoaded', () => {
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
