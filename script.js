const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const result = document.getElementById("result");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) {
        return;
    }

    const url = URL.createObjectURL(file);

    previewImage.src = url;
    previewImage.style.display = "block";

    result.innerHTML = `
        <p><strong>ファイル名:</strong> ${file.name}</p>
        <p><strong>サイズ:</strong> ${(file.size / 1024).toFixed(1)} KB</p>
        <p><strong>種類:</strong> ${file.type}</p>
    `;
});