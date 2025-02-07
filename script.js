document.addEventListener('DOMContentLoaded', function () {
    let qrInstance = null;
    let debounceTimer;

    // Function to debounce QR code generation
    function debounce(func, wait) {
        return function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    // Show success message
    function showSuccessMessage() {
        const message = document.getElementById('success-message');
        message.style.display = 'block';
        setTimeout(() => {
            message.style.display = 'none';
        }, 2000);
    }

    // Update size value display when slider moves
    document.getElementById('qr-size').addEventListener('input', function () {
        document.getElementById('size-value').textContent = this.value;
        generateQR();
    });

    // Generate QR code when user types
    const qrInput = document.getElementById('qr-text');
    qrInput.addEventListener('input', debounce(() => {
        generateQR();
    }, 300));

    function generateQR() {
        const text = qrInput.value.trim();
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
            // Create new QR code
            qrInstance = new QRCode(qrContainer, {
                text: text,
                width: parseInt(size),
                height: parseInt(size),
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Show download button and success message
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

    document.getElementById('download-btn').addEventListener('click', downloadQR);
});