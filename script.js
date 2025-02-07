function generateQRCode() {
    const qrText = document.getElementById("qr-text").value;
    const qrcodeDiv = document.getElementById("qrcode");

    qrcodeDiv.innerHTML = ""; // Clear previous QR code

    if (qrText.trim() === "") {
        alert("Please enter text or URL.");
        return;
    }

    // Use makeCode instead of new QRCode
    const qrcode = qrcodeDiv.appendChild(document.createElement("div")); // Create a div inside the target div
    new QRCode(qrcode, {
        text: qrText,
        width: 200,
        height: 200,
    });
}
