function addDummyLetters(text, size) {
    while (text.length % size !== 0) {
        text += 'X'; // Tambahkan 'X' sebagai dummy letter
    }
    return text;
}

function isValidInput(text) {
    if (!/^[A-Z]+$/i.test(text)) { // Hanya huruf A-Z, case insensitive
        alert("Input hanya boleh berisi huruf A-Z tanpa angka atau simbol.");
        return false;
    }
    return true;
}

function textToNumbers(text) {
    return text.split('').map(char => char.charCodeAt(0) - 65);
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
    let text = document.getElementById("plain-text-default").value.toUpperCase();

    if (!text) {
        alert("Masukkan teks untuk dienkripsi.");
        return;
    }

    if (!isValidInput(text)) return; // Validasi input

    let keyMatrix = [[3, 5], [1, 2]];
    let blockSize = keyMatrix.length;
    let paddedText = addDummyLetters(text, blockSize).split("").map(char => char.charCodeAt(0) - 65);
    let encryptedNumbers = [];

    for (let i = 0; i < paddedText.length; i += blockSize) {
        let block = paddedText.slice(i, i + blockSize);
        encryptedNumbers.push(...multiplyMatrixVector(keyMatrix, block));
    }

    document.getElementById("encrypted-default").innerText = numbersToText(encryptedNumbers);
}

function decryptDefault() {
    let text = document.getElementById("encrypted-text-default").value.toUpperCase();

    if (!text) {
        alert("Masukkan teks terenkripsi.");
        return;
    }

    if (!isValidInput(text)) return; // Validasi input

    let keyMatrix = [[3, 5], [1, 2]];
    let inverseKey = inverseMatrix2x2(keyMatrix);
    if (!inverseKey) {
        alert("Matriks tidak memiliki invers mod 26.");
        return;
    }

    let blockSize = keyMatrix.length;
    let encryptedNumbers = text.split("").map(char => char.charCodeAt(0) - 65);
    let decryptedNumbers = [];

    for (let i = 0; i < encryptedNumbers.length; i += blockSize) {
        let block = encryptedNumbers.slice(i, i + blockSize);
        decryptedNumbers.push(...multiplyMatrixVector(inverseKey, block));
    }

    let decryptedText = numbersToText(decryptedNumbers);
    
    document.getElementById("decrypted-default").innerText = decryptedText; // Dummy letter tidak dihapus
}

function hillCipherEncrypt(text, keyMatrix) {
    let size = keyMatrix.length;
    
    if (!isValidInput(text)) return; // Validasi input

    let paddedText = addDummyLetters(cleanedText, size).split("").map(char => char.charCodeAt(0) - 65);
    
    let encryptedNumbers = [];
    for (let i = 0; i < paddedText.length; i += size) {
        let chunk = paddedText.slice(i, i + size);
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
        alert("Matriks tidak memiliki invers mod 26.");
        return "";
    }

    if (!isValidInput(text)) return; // Validasi input
    
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
