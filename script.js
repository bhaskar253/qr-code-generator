document.addEventListener('DOMContentLoaded', function () {
    let qrInstance = null;

    // Materialize CSS init (if needed)
    M.updateTextFields();

    function showSuccessMessage() {
        const message = document.getElementById('success-message');
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 2000);
    }

    function generateQR() {
        const text = document.getElementById('qr-text').value.trim();
        const size = document.getElementById('qr-size').value;
        const qrContainer = document.getElementById('qr-code');
        const downloadBtn = document.getElementById('download-btn');

        qrContainer.innerHTML = '';

        if (!text) {
            qrContainer.innerHTML = '<span class="grey-text">Type something to generate QR code</span>';
            downloadBtn.style.display = 'none';
            return;
        }

        try {
            qrInstance = new QRCode(qrContainer, {
                text: text,
                width: parseInt(size),
                height: parseInt(size),
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            downloadBtn.style.display = 'inline-block';
            showSuccessMessage();
        } catch (error) {
            console.error('QR Code generation error:', error);
            qrContainer.innerHTML = '<span class="red-text">Error generating QR code</span>';
        }
    }

    function downloadQR() {
        if (!qrInstance) return;

        const img = document.querySelector('#qr-code img');
        if (!img) return;

        const link = document.createElement('a');
        link.href = img.src;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Smooth slider updates
    const qrSizeInput = document.getElementById('qr-size');
    const sizeValueDisplay = document.getElementById('size-value');
    qrSizeInput.addEventListener('input', function () {
        requestAnimationFrame(() => {
            sizeValueDisplay.textContent = this.value;
            generateQR();
        });
    });

    document.getElementById('download-btn').addEventListener('click', downloadQR);
});