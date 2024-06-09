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
    loader.style.display = 'none'; // Initially hidden
    removeBgBtn.parentNode.insertBefore(loader, removeBgBtn.nextSibling);

    let imageUrl = '';
    let processedImageUrl = '';

    function updateImagePreview(src, container) {
        const img = new Image();
        img.onload = function () {
            container.innerHTML = '';
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
                message.textContent = 'Error removing background. Please try again.';
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
