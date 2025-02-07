let qrInstance = null;

// Update size value display when slider moves
document.getElementById('qr-size').addEventListener('input', function() {
    document.getElementById('size-value').textContent = this.value;
});

function generateQR() {
    const text = document.getElementById('qr-text').value;
    const size = document.getElementById('qr-size').value;
    const qrContainer = document.getElementById('qr-code');
    const downloadBtn = document.getElementById('download-btn');

    if (text.trim() === '') {
        alert('Please enter text or URL');
        return;
    }

    // Clear previous QR code
    qrContainer.innerHTML = '';
    
    // Create new QR code
    qrInstance = new QRCode(qrContainer, {
        text: text,
        width: parseInt(size),
        height: parseInt(size),
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    // Show download button
    downloadBtn.style.display = 'block';
}

function downloadQR() {
    if (!qrInstance) return;

    // Get the QR code image
    const img = document.querySelector('#qr-code img');
    if (!img) return;

    // Create a temporary link
    const link = document.createElement('a');
    link.href = img.src;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}