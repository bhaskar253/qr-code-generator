document.addEventListener("DOMContentLoaded", function () {
    const qrText = document.getElementById("qr-text");
    const qrSize = document.getElementById("qr-size");
    const qrCodeContainer = document.getElementById("qr-code");
    const successMessage = document.getElementById("success-message");
    const downloadBtn = document.getElementById("download-btn");

    let qr = new QRCode(qrCodeContainer, {
        text: "",
        width: parseInt(qrSize.value),
        height: parseInt(qrSize.value),
    });

    function generateQR() {
        let text = qrText.value.trim();
        let size = parseInt(qrSize.value);

        if (text === "") {
            qrCodeContainer.innerHTML = `<span class="grey-text">Type something to generate QR code</span>`;
            downloadBtn.style.display = "none";
            successMessage.style.display = "none";
            return;
        }

        qr.clear();
        qr.makeCode(text);

        qrCodeContainer.querySelector("img").style.width = size + "px";
        qrCodeContainer.querySelector("img").style.height = size + "px";

        successMessage.style.display = "block";
        downloadBtn.style.display = "block";
    }

    qrText.addEventListener("input", generateQR);
    qrSize.addEventListener("input", generateQR);

    // Download QR Code
    downloadBtn.addEventListener("click", function () {
        let qrImage = qrCodeContainer.querySelector("img");
        if (!qrImage) return;

        let link = document.createElement("a");
        link.href = qrImage.src;
        link.download = "QRCode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    generateQR(); // Generate QR on page load if there's text
});