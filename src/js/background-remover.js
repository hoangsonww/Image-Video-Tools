document.addEventListener('DOMContentLoaded', () => {
    const upload = document.getElementById('upload');
    const removeBgBtn = document.getElementById('remove-bg-btn');
    const downloadBtn = document.getElementById('download-btn');
    const preview = document.getElementById('preview');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const message = document.getElementById('message');

    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.textContent = 'Removing background...';
    loader.style.display = 'none';
    removeBgBtn.parentNode.insertBefore(loader, removeBgBtn.nextSibling);

    let currentImage = null;
    let imageUrl = '';
    let processedImageUrl = '';

    function updateImagePreview(src, container) {
        container.innerHTML = '';
        const header = document.createElement('h3');
        header.textContent = 'Preview';
        const img = new Image();
        img.onload = function () {
            const aspectRatio = img.width / img.height;
            img.width = container.offsetWidth;
            img.height = container.offsetWidth / aspectRatio;
            container.appendChild(header);
            container.appendChild(img);
        };
        img.src = src;
    }

    upload.addEventListener('change', () => {
        const file = upload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imageUrl = e.target.result;
                updateImagePreview(imageUrl, preview);

                if (currentImage) {
                    preview.removeChild(currentImage);
                }

                const newImage = preview.querySelector('img');
                currentImage = newImage;

                removeBgBtn.disabled = false;
                message.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    removeBgBtn.addEventListener('click', () => {
        removeBgBtn.disabled = true;
        loader.style.display = 'block';
        loader.style.marginTop = '10px';

        const file = upload.files[0];
        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('size', 'auto');

        fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': 'Yu5LnHCRmLXRod3ZzU68zDQR',
            },
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                processedImageUrl = URL.createObjectURL(blob);
                updateImagePreview(processedImageUrl, preview);
                downloadBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error:', error);
                message.textContent = 'Error removing background. Your image might not have a clear subject. Please try again with a different image.';
                message.style.display = 'block';
            })
            .finally(() => {
                removeBgBtn.disabled = false;
                loader.style.display = 'none';
            });
    });

    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = processedImageUrl;
        link.download = 'no-bg-image.png';
        link.click();
    });
});

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
