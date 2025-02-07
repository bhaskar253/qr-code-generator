let qrInstance = null;
let debounceTimer;

// Theme management
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
}

// Function to debounce QR code generation
function debounce(func, wait) {
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), wait);
    };
}

// Show success message
function showSuccessMessage() {
    const message = document.getElementById('success-message');
    message.classList.add('show');
    setTimeout(() => message.classList.remove('show'), 2000);
}

// Add typing indicator
function handleTypingIndicator(show) {
    const inputWrapper = document.querySelector('.input-wrapper');
    if (show) {
        inputWrapper.classList.add('typing');
    } else {
        inputWrapper.classList.remove('typing');
    }
}

// Update size value display when slider moves
document.getElementById('qr-size').addEventListener('input', function() {
    document.getElementById('size-value').textContent = this.value;
    generateQR();
});

// Generate QR code when user types
const qrInput = document.getElementById('qr-text');
qrInput.addEventListener('input', function() {
    handleTypingIndicator(true);
    debounce(() => {
        generateQR();
        handleTypingIndicator(false);
    }, 300)();
});

function generateQR() {
    const text = document.getElementById('qr-text').value;
    const size = document.getElementById('qr-size').value;
    const qrContainer = document.getElementById('qr-code');
    const downloadBtn = document.getElementById('download-btn');
    const placeholder = qrContainer.querySelector('.placeholder-text');

    if (text.trim() === '') {
        qrContainer.innerHTML = '<div class="placeholder-text">Type something to generate QR code</div>';
        downloadBtn.style.display = 'none';
        return;
    }

    if (placeholder) {
        placeholder.remove();
    }

    // Clear previous QR code
    qrContainer.innerHTML = '';
    
    try {
        // Create new QR code
        qrInstance = new QRCode(qrContainer, {
            text: text,
            width: parseInt(size),
            height: parseInt(size),
            colorDark: document.documentElement.getAttribute('data-theme') === 'dark' ? "#ffffff" : "#000000",
            colorLight: document.documentElement.getAttribute('data-theme') === 'dark' ? "#2d2d2d" : "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Show download button and success message
        downloadBtn.style.display = 'block';
        showSuccessMessage();
    } catch (error) {
        console.error('QR Code generation error:', error);
        qrContainer.innerHTML = '<div class="error-message">Error generating QR code</div>';
    }
}

function downloadQR() {
    if (!qrInstance) return;

    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.classList.add('downloading');

    // Get the QR code image
    const img = document.querySelector('#qr-code img');
    if (!img) return;

    // Create a temporary link
    const link = document.createElement('a');
    link.href = img.src;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    
    // Simulate a brief delay for the download animation
    setTimeout(() => {
        link.click();
        document.body.removeChild(link);
        downloadBtn.classList.remove('downloading');
    }, 500);
}

// Initialize theme on page load
initTheme();

// Generate initial QR code if there's any text in the input
if (document.getElementById('qr-text').value) {
    generateQR();
}