function addDummyLetters(text, size) {
    while (text.length % size !== 0) {
        text += 'X'; // Tambahkan 'X' sebagai dummy letter
    }
    return text;
}

function encryptDefault() {
    let text = document.getElementById("plain-text-default").value;
    if (!text) {
        alert("Masukkan teks untuk dienkripsi.");
        return;
    }
    let encryptedText = hillCipherEncrypt(text, [[3, 3], [2, 5]]);
    document.getElementById("encrypted-default").innerText = encryptedText;
}

function encryptCustom() {
    let text = document.getElementById("plain-text-custom").value;
    let keyInput = document.getElementById("custom-key").value;
    if (!text || !keyInput) {
        alert("Masukkan teks dan matriks kunci.");
        return;
    }
    let keyMatrix = parseKeyMatrix(keyInput, 10); // Maksimal 10×10
    let encryptedText = hillCipherEncrypt(text, keyMatrix);
    document.getElementById("encrypted-custom").innerText = encryptedText;
}

function decryptDefault() {
    let text = document.getElementById("encrypted-text-default").value;
    if (!text) {
        alert("Masukkan teks terenkripsi.");
        return;
    }
    let decryptedText = hillCipherDecrypt(text, [[3, 3], [2, 5]]);
    document.getElementById("decrypted-default").innerText = decryptedText;
}

function decryptCustom() {
    let text = document.getElementById("encrypted-text-custom").value;
    let keyInput = document.getElementById("custom-key-decrypt").value;
    if (!text || !keyInput) {
        alert("Masukkan teks terenkripsi dan matriks kunci.");
        return;
    }
    let keyMatrix = parseKeyMatrix(keyInput);
    let decryptedText = hillCipherDecrypt(text, keyMatrix);
    document.getElementById("decrypted-custom").innerText = decryptedText;
}

function parseKeyMatrix(input, maxSize) {
    let matrix = input.split(",").map(Number);
    if (matrix.length > maxSize * maxSize) {
        alert("Matriks terlalu besar! Maksimal " + maxSize + "×" + maxSize);
        return null;
    }
    return matrix;
}

function hillCipherEncrypt(text, keyMatrix) {
    return "[Hasil Enkripsi]"; // Implementasikan logika Hill Cipher di sini
}

function hillCipherDecrypt(text, keyMatrix) {
    return "[Hasil Dekripsi]"; // Implementasikan logika Hill Cipher di sini
}
