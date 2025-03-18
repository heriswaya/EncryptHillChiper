function mod(n, m) {
    return ((n % m) + m) % m;
}

function textToNumbers(text) {
    return text.toUpperCase().replace(/[^A-Z]/g, '').split('').map(char => char.charCodeAt(0) - 65);
}

function numbersToText(numbers) {
    return numbers.map(num => String.fromCharCode(num + 65)).join('');
}

function multiplyMatrixVector(matrix, vector) {
    let result = Array(matrix.length).fill(0);
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < vector.length; j++) {
            result[i] += matrix[i][j] * vector[j];
        }
        result[i] = mod(result[i], 26);
    }
    return result;
}

function encryptDefault() {
    let keyMatrix = [[6, 24], [1, 13]]; // Contoh kunci bawaan
    let plaintext = document.getElementById("plain-text-default").value;
    let numbers = textToNumbers(plaintext);
    
    if (numbers.length % keyMatrix.length !== 0) {
        alert("Panjang teks harus sesuai dengan ukuran matriks!");
        return;
    }
    
    let encryptedNumbers = [];
    for (let i = 0; i < numbers.length; i += keyMatrix.length) {
        let vector = numbers.slice(i, i + keyMatrix.length);
        encryptedNumbers.push(...multiplyMatrixVector(keyMatrix, vector));
    }
    
    document.getElementById("encrypted-default").innerText = numbersToText(encryptedNumbers);
}

function encryptCustom() {
    let plaintext = document.getElementById("plain-text-custom").value;
    let keyInput = document.getElementById("custom-matrix").value;
    let keyMatrix = parseMatrixInput(keyInput);
    let numbers = textToNumbers(plaintext);
    
    if (!keyMatrix || numbers.length % keyMatrix.length !== 0) {
        alert("Matriks tidak valid atau panjang teks tidak sesuai!");
        return;
    }
    
    let encryptedNumbers = [];
    for (let i = 0; i < numbers.length; i += keyMatrix.length) {
        let vector = numbers.slice(i, i + keyMatrix.length);
        encryptedNumbers.push(...multiplyMatrixVector(keyMatrix, vector));
    }
    
    document.getElementById("encrypted-custom").innerText = numbersToText(encryptedNumbers);
}

function parseMatrixInput(input) {
    try {
        let rows = input.split(';').map(row => row.split(',').map(Number));
        let size = rows.length;
        if (rows.some(row => row.length !== size)) return null;
        return rows;
    } catch (e) {
        return null;
    }
}

// TODO: Dekripsi memerlukan invers matriks modulo 26
function decryptDefault() {
    alert("Dekripsi masih dalam pengembangan!");
}

function decryptCustom() {
    alert("Dekripsi masih dalam pengembangan!");
}
