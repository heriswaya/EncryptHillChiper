function addDummyLetters(text, size) {
    text = text.replace(/\s+/g, ""); // Hapus spasi
    while (text.length % size !== 0) {
        text += 'X'; // Tambahkan 'X' sebagai dummy letter
    }
    return text;
}

function encryptDefault() {
    let text = document.getElementById("plain-text-default").value.toUpperCase();
    if (!text) {
        alert("Masukkan teks untuk dienkripsi.");
        return;
    }
    text = addDummyLetters(text, 2);
    let encryptedText = hillCipherEncrypt(text, [[3, 3], [2, 5]]);
    document.getElementById("encrypted-default").innerText = encryptedText;
}

function encryptCustom() {
    let text = document.getElementById("plain-text-custom").value.toUpperCase();
    let keyInput = document.getElementById("custom-key").value;
    if (!text || !keyInput) {
        alert("Masukkan teks dan matriks kunci.");
        return;
    }
    let keyMatrix = parseKeyMatrix(keyInput, 10);
    if (!keyMatrix) return;
    text = addDummyLetters(text, Math.sqrt(keyMatrix.length));
    let encryptedText = hillCipherEncrypt(text, keyMatrix);
    document.getElementById("encrypted-custom").innerText = encryptedText;
}

function decryptDefault() {
    let text = document.getElementById("encrypted-text-default").value.toUpperCase();
    if (!text) {
        alert("Masukkan teks terenkripsi.");
        return;
    }
    let decryptedText = hillCipherDecrypt(text, [[3, 3], [2, 5]]);
    document.getElementById("decrypted-default").innerText = decryptedText;
}

function decryptCustom() {
    let text = document.getElementById("encrypted-text-custom").value.toUpperCase();
    let keyInput = document.getElementById("custom-key-decrypt").value;
    if (!text || !keyInput) {
        alert("Masukkan teks terenkripsi dan matriks kunci.");
        return;
    }
    let keyMatrix = parseKeyMatrix(keyInput);
    if (!keyMatrix) return;
    let decryptedText = hillCipherDecrypt(text, keyMatrix);
    document.getElementById("decrypted-custom").innerText = decryptedText;
}

function parseKeyMatrix(input, maxSize) {
    let matrix = input.split(",").map(Number);
    let size = Math.sqrt(matrix.length);
    if (size % 1 !== 0 || size > maxSize) {
        alert("Matriks harus berbentuk NxN dan maksimal " + maxSize + "×" + maxSize);
        return null;
    }
    return matrix;
}

function hillCipherEncrypt(text, keyMatrix) {
    let size = keyMatrix.length;
    let textNumbers = text.split("").map(char => char.charCodeAt(0) - 65);
    let encryptedNumbers = [];
    for (let i = 0; i < textNumbers.length; i += size) {
        let chunk = textNumbers.slice(i, i + size);
        let result = new Array(size).fill(0);
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                result[row] += keyMatrix[row][col] * chunk[col];
            }
            result[row] = result[row] % 26;
        }
        encryptedNumbers.push(...result);
    }
    return encryptedNumbers.map(num => String.fromCharCode(num + 65)).join("");
}

function hillCipherDecrypt(text, keyMatrix) {
    let size = keyMatrix.length;
    let inverseMatrix = invertMatrixMod26(keyMatrix);
    if (!inverseMatrix) {
        return "Matriks tidak memiliki invers mod 26";
    }
    let textNumbers = text.split("").map(char => char.charCodeAt(0) - 65);
    let decryptedNumbers = [];
    for (let i = 0; i < textNumbers.length; i += size) {
        let chunk = textNumbers.slice(i, i + size);
        let result = new Array(size).fill(0);
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                result[row] += inverseMatrix[row][col] * chunk[col];
            }
            result[row] = (result[row] % 26 + 26) % 26;
        }
        decryptedNumbers.push(...result);
    }
    return decryptedNumbers.map(num => String.fromCharCode(num + 65)).join("");
}

function invertMatrixMod26(matrix) {
    let det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;
    if (det < 0) det += 26;
    let detInv = modInverse(det, 26);
    if (detInv === -1) return null;
    let inverse = [
        [matrix[1][1] * detInv % 26, (-matrix[0][1] * detInv + 26) % 26],
        [(-matrix[1][0] * detInv + 26) % 26, matrix[0][0] * detInv % 26]
    ];
    return inverse;
}

function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return -1;
}
