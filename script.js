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
    let keyMatrix = [[3, 3], [2, 5]]; // Matriks kunci bawaan 2x2
    text = addDummyLetters(text, keyMatrix.length); // Sesuaikan dengan ukuran matriks

    let encryptedText = hillCipherEncrypt(text, keyMatrix);
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
    if (!keyMatrix) return;

    let matrixSize = keyMatrix.length;
    text = addDummyLetters(text, matrixSize); // Tambahkan dummy letters sesuai ukuran matriks

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
    let keyMatrix = parseKeyMatrix(keyInput, 10);
    if (!keyMatrix) return;

    let decryptedText = hillCipherDecrypt(text, keyMatrix);
    document.getElementById("decrypted-custom").innerText = decryptedText;
}

function parseKeyMatrix(input, maxSize) {
    let numbers = input.split(",").map(Number);
    let size = Math.sqrt(numbers.length);
    if (!Number.isInteger(size)) {
        alert("Matriks harus berbentuk persegi (2x2, 3x3, dll.).");
        return null;
    }
    if (size > maxSize) {
        alert("Matriks terlalu besar! Maksimal " + maxSize + "×" + maxSize);
        return null;
    }

    let matrix = [];
    for (let i = 0; i < size; i++) {
        matrix.push(numbers.slice(i * size, (i + 1) * size));
    }
    return matrix;
}

function hillCipherEncrypt(text, keyMatrix) {
    return "[Hasil Enkripsi]"; // Implementasikan logika Hill Cipher di sini
}

function hillCipherDecrypt(text, keyMatrix) {
    return "[Hasil Dekripsi]"; // Implementasikan logika Hill Cipher di sini
}
