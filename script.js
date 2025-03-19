function addDummyLetters(text, size) {
    while (text.length % size !== 0) {
        text += 'X'; // Tambahkan 'X' sebagai dummy letter
    }
    return text;
}

function textToNumbers(text) {
    return text.toUpperCase().replace(/[^A-Z]/g, '') // Hanya huruf A-Z
                .split('').map(char => char.charCodeAt(0) - 65);
}

function numbersToText(numbers) {
    return numbers.map(num => String.fromCharCode((num % 26) + 65)).join('');
}

function multiplyMatrixVector(matrix, vector) {
    let result = [];
    for (let i = 0; i < matrix.length; i++) {
        let sum = 0;
        for (let j = 0; j < matrix[i].length; j++) {
            sum += matrix[i][j] * vector[j];
        }
        result.push(sum % 26);
    }
    return result;
}

function modInverse(a, m) {
    for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) return i;
    }
    return null;
}

function inverseMatrix2x2(matrix) {
    let det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;
    if (det < 0) det += 26;
    let detInv = modInverse(det, 26);
    if (detInv === null) {
        alert("Matriks tidak memiliki invers di mod 26.");
        return null;
    }
    return [
        [(matrix[1][1] * detInv) % 26, (-matrix[0][1] * detInv + 26) % 26],
        [(-matrix[1][0] * detInv + 26) % 26, (matrix[0][0] * detInv) % 26]
    ];
}

function encryptDefault() {
    let text = document.getElementById("plain-text-default").value;
    if (!text) {
        alert("Masukkan teks untuk dienkripsi.");
        return;
    }
    let keyMatrix = [[3, 5], [1, 2]];
    let blockSize = keyMatrix.length;
    let cleanedText = textToNumbers(text);
    let paddedText = addDummyLetters(cleanedText, blockSize);
    let encryptedNumbers = [];
    
    for (let i = 0; i < paddedText.length; i += blockSize) {
        let block = paddedText.slice(i, i + blockSize);
        encryptedNumbers.push(...multiplyMatrixVector(keyMatrix, block));
    }
    
    document.getElementById("encrypted-default").innerText = numbersToText(encryptedNumbers);
}

function decryptDefault() {
    let text = document.getElementById("encrypted-text-default").value;
    if (!text) {
        alert("Masukkan teks terenkripsi.");
        return;
    }
    let keyMatrix = [[3, 5], [1, 2]];
    let inverseKey = inverseMatrix2x2(keyMatrix);
    if (!inverseKey) return;
    
    let blockSize = keyMatrix.length;
    let encryptedNumbers = textToNumbers(text);
    let decryptedNumbers = [];
    
    for (let i = 0; i < encryptedNumbers.length; i += blockSize) {
        let block = encryptedNumbers.slice(i, i + blockSize);
        decryptedNumbers.push(...multiplyMatrixVector(inverseKey, block));
    }
    
    let decryptedText = numbersToText(decryptedNumbers);
    decryptedText = decryptedText.replace(/X+$/, ''); // Hilangkan padding 'X' di akhir
    
    document.getElementById("decrypted-default").innerText = decryptedText;
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
