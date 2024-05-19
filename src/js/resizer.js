document.addEventListener('DOMContentLoaded', function () {
    let originalWidth, originalHeight;
    let img = new Image();
    let isImageLoaded = false;
    let originalFileName;

    function toggleSizeInput(isDimensions) {
        if (!isImageLoaded) {
            alert("Please upload an image first.");
            return;
        }
        document.getElementById('dimensionsInput').style.display = isDimensions ? 'block' : 'none';
    }

    function updateImageSizeDisplay() {
        if (!isImageLoaded) {
            return;
        }
        const canvas = document.getElementById('canvas');
        canvas.toBlob(function(blob) {
            const imageSizeBytes = blob.size;
            document.getElementById('currentImageSize').textContent = `${(imageSizeBytes / 1024).toFixed(2)} KB`;
        }, 'image/jpeg', 0.92);
    }

    function showOriginalImage() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        updateImageSizeDisplay();
    }

    function updatePreview() {
        if (!isImageLoaded) {
            alert("Please upload an image first.");
            return;
        }

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const widthInput = document.getElementById('width');
        const heightInput = document.getElementById('height');
        const maintainAspectRatio = document.getElementById('aspectRatio').checked;

        let newWidth = parseInt(widthInput.value);
        let newHeight = parseInt(heightInput.value);

        if (maintainAspectRatio && originalWidth && originalHeight) {
            if (document.activeElement === widthInput) {
                newHeight = Math.round(originalHeight * newWidth / originalWidth);
                heightInput.value = newHeight;
            }
            else if (document.activeElement === heightInput) {
                newWidth = Math.round(originalWidth * newHeight / originalHeight);
                widthInput.value = newWidth;
            }
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        updateImageSizeDisplay();
    }

    document.getElementById('imageInput').addEventListener('change', function() {
        if (this.files?.[0]) {
            originalFileName = this.files[0].name;
            const reader = new FileReader();
            reader.onload = function(e) {
                img.onload = function() {
                    originalWidth = img.width;
                    originalHeight = img.height;
                    isImageLoaded = true;
                    showOriginalImage();
                    enableInputs();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    function enableInputs() {
        document.querySelectorAll('#dimensionsInput input').forEach(input => {
            input.disabled = false;
        });

        document.getElementById('width').value = originalWidth;
        document.getElementById('height').value = originalHeight;
    }

    document.querySelectorAll('#dimensionsInput input').forEach(input => {
        input.disabled = true;
    });

    function downloadImage() {
        if (!isImageLoaded) {
            alert("Please upload and resize an image first.");
            return;
        }

        const canvas = document.getElementById('canvas');
        canvas.toBlob(function(blob) {
            const image = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const baseName = originalFileName.replace(/\.[^/.]+$/, "");
            const extension = originalFileName.split('.').pop();
            link.download = `${baseName}-resized.${extension}`;
            link.href = image;
            link.click();
        }, 'image/jpeg', 0.92);
    }

    function resizeImage() {
        if (!isImageLoaded) {
            alert("Please upload an image first.");
            return;
        }
        updatePreview();
        downloadImage();
    }

    window.resizeImage = resizeImage;
    window.toggleSizeInput = toggleSizeInput;

    document.getElementById('width').addEventListener('input', updatePreview);
    document.getElementById('height').addEventListener('input', updatePreview);
});

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
