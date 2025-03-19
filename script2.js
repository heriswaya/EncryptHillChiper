document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("encrypt-button").addEventListener("click", encryptCustom);
});

function encryptCustom() {
    let text = document.getElementById("plain-text-custom").value.toUpperCase();

    if (!text) {
        alert("Masukkan teks untuk dienkripsi.");
        return;
    }

    if (!isValidInput(text)) return; // Validasi input

    let matrixSize = parseInt(document.getElementById("matrix-size").value);
    let keyMatrix = getCustomKeyMatrix(matrixSize);
    
    if (!keyMatrix) {
        alert("Matriks kunci tidak valid. Pastikan semua nilai terisi dan berupa angka.");
        return;
    }

    let paddedText = addDummyLetters(text, matrixSize).split("").map(char => char.charCodeAt(0) - 65);
    let encryptedNumbers = [];

    for (let i = 0; i < paddedText.length; i += matrixSize) {
        let block = paddedText.slice(i, i + matrixSize);
        encryptedNumbers.push(...multiplyMatrixVector(keyMatrix, block));
    }

    document.getElementById("encrypted-custom").value = numbersToText(encryptedNumbers);
}

// Fungsi mendapatkan matriks kunci dari input pengguna
function getCustomKeyMatrix(size) {
    let keyMatrix = [];
    for (let i = 0; i < size; i++) {
        keyMatrix[i] = [];
        for (let j = 0; j < size; j++) {
            let value = document.getElementById(`key-${i}-${j}`).value;
            if (isNaN(value) || value.trim() === "") return null;
            keyMatrix[i][j] = parseInt(value) % 26;
        }
    }
    return keyMatrix;
}

// Perkalian Matriks dengan Vektor
function multiplyMatrixVector(matrix, vector) {
    let size = matrix.length;
    let result = new Array(size).fill(0);

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            result[i] += matrix[i][j] * vector[j];
        }
        result[i] = result[i] % 26;
    }

    return result;
}

// Konversi angka kembali ke teks
function numbersToText(numbers) {
    return numbers.map(num => String.fromCharCode((num % 26) + 65)).join('');
}

// Validasi input hanya huruf dan spasi
function isValidInput(text) {
    if (/[^A-Z ]/.test(text)) {
        alert("Teks hanya boleh mengandung huruf A-Z dan spasi.");
        return false;
    }
    return true;
}

// Tambah dummy letter jika panjang teks tidak sesuai ukuran matriks
function addDummyLetters(text, blockSize) {
    text = text.replace(/\s/g, ""); // Hilangkan spasi
    while (text.length % blockSize !== 0) {
        text += "X"; // Tambah 'X' sebagai padding
    }
    return text;
}

