function generateQRCode() {
    const qrText = document.getElementById("qr-text").value;
    const qrcodeDiv = document.getElementById("qrcode");

    // Clear previous QR code
    qrcodeDiv.innerHTML = "";

    if (qrText.trim() === "") {
        alert("Please enter text or URL.");
        return;
    }

    const qrcode = new QRCode(qrcodeDiv, {
        text: qrText,
        width: 200, // Adjust size as needed
        height: 200,
    });
}
