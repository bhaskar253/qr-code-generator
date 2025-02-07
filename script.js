let qrInstance = null;
let debounceTimer;

// Initialize Material Components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Material Text Field
    const textFields = document.querySelectorAll('.mdc-text-field');
    textFields.forEach(textField => {
        new mdc.textField.MDCTextField(textField);
    });

    // Initialize Material Buttons with Ripple
    const buttons = document.querySelectorAll('.mdc-button');
    buttons.forEach(button => {
        new mdc.ripple.MDCRipple(button);
    });

    // Initialize theme
    initTheme();
});

// Theme management with Material Design color tokens
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Regenerate QR code to update colors if exists
    if (qrInstance) {
        generateQR();
    }

    // Update theme toggle button states
    updateThemeToggleStates(theme);
}

// Update visual state of theme toggle buttons
function updateThemeToggleStates(currentTheme) {
    const themeButtons = document.querySelectorAll('.material-symbols-rounded');
    themeButtons.forEach(button => {
        const buttonTheme = button.getAttribute('onclick').match(/'([^']*)'/)[1];
        button.classList.toggle('active', buttonTheme === currentTheme);
    });
}

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'system';
    setTheme(savedTheme);
}

// Debounce function to limit QR code regeneration
function debounce(func, wait) {
    return function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), wait);
    };
}

// Show Material Design-style toast message
function showSuccessMessage() {
    const message = document.getElementById('success-message');
    message.classList.add('show');
    setTimeout(() => message.classList.remove('show'), 2000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Size slider event listener
    const sizeSlider = document.getElementById('qr-size');
    sizeSlider.addEventListener('input', function() {
        document.getElementById('size-value').textContent = this.value;
        generateQR();
    });

    // QR text input event listener with debounce
    const qrInput = document.getElementById('qr-text');
    qrInput.addEventListener('input', debounce(generateQR, 300));

    // Download button event listener
    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.addEventListener('click', downloadQR);
});

// Generate QR Code
function generateQR() {
    const text = document.getElementById('qr-text').value;
    const size = document.getElementById('qr-size').value;
    const qrContainer = document.getElementById('qr-code');
    const downloadBtn = document.getElementById('download-btn');

    // Clear container if no text
    if (text.trim() === '') {
        qrContainer.innerHTML = '<span class="mdc-typography--body2">Type something to generate QR code</span>';
        downloadBtn.style.display = 'none';
        return;
    }

    // Clear previous QR code
    qrContainer.innerHTML = '';
    
    try {
        // Determine colors based on current theme
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        const colorDark = isDarkTheme ? "#ffffff" : "#000000";
        const colorLight = isDarkTheme ? "#2d2d2d" : "#ffffff";

        // Create QR Code
        qrInstance = new QRCode(qrContainer, {
            text: text,
            width: parseInt(size),
            height: parseInt(size),
            colorDark: colorDark,
            colorLight: colorLight,
            correctLevel: QRCode.CorrectLevel.H
        });

        // Show download button and success message
        downloadBtn.style.display = 'block';
        showSuccessMessage();
    } catch (error) {
        console.error('QR Code generation error:', error);
        qrContainer.innerHTML = '<span class="mdc-typography--body2">Error generating QR code</span>';
    }
}

// Download QR Code
function downloadQR() {
    if (!qrInstance) return;

    const img = document.querySelector('#qr-code img');
    if (!img) return;

    // Create download link
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `qrcode_${new Date().toISOString().replace(/:/g, '-')}.png`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optional: Show download confirmation
    showSuccessMessage();
}