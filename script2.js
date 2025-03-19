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

// Fungsi utama untuk dekripsi Hill Cipher dengan custom key
function decryptCustom() {
    let encryptedText = document.getElementById("encrypted-text-custom").value.toUpperCase().replace(/[^A-Z]/g, "");
    let size = parseInt(document.getElementById("matrix-size").value);
    
    if (!encryptedText) {
        alert("Masukkan teks terenkripsi!");
        return;
    }

    // Ambil matriks kunci dari input
    let keyMatrix = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            let value = parseInt(document.getElementById(`key-${i}-${j}`).value);
            if (isNaN(value)) {
                alert("Matriks kunci harus diisi dengan angka!");
                return;
            }
            row.push(value);
        }
        keyMatrix.push(row);
    }

    // Hitung invers matriks dalam mod 26
    let inverseMatrix = getModularInverseMatrix(keyMatrix, size);
    if (!inverseMatrix) {
        alert("Matriks kunci tidak memiliki invers modular (mod 26)!");
        return;
    }

    // Ubah teks terenkripsi menjadi vektor angka
    let textVector = [];
    for (let i = 0; i < encryptedText.length; i++) {
        textVector.push(encryptedText.charCodeAt(i) - 65);
    }

    // Tambahkan padding jika panjang teks tidak sesuai ukuran matriks
    while (textVector.length % size !== 0) {
        textVector.push(23); // 'X' sebagai padding
    }

    // Proses dekripsi menggunakan matriks invers
    let decryptedText = "";
    for (let i = 0; i < textVector.length; i += size) {
        let vector = textVector.slice(i, i + size);
        let resultVector = multiplyMatrix(inverseMatrix, vector, size);

        // Konversi hasil ke huruf
        for (let num of resultVector) {
            decryptedText += String.fromCharCode((num % 26 + 26) % 26 + 65);
        }
    }

    // Tampilkan hasil dekripsi
    document.getElementById("decrypted-custom").value = decryptedText;
}

// Fungsi untuk menghitung invers modular matriks (mod 26)
function getModularInverseMatrix(matrix, size) {
    let determinant = getDeterminant(matrix, size);
    let determinantMod = ((determinant % 26) + 26) % 26;
    let inverseDet = getModularInverse(determinantMod, 26);

    if (inverseDet === -1) return null; // Tidak memiliki invers modular

    let adjugateMatrix = getAdjugate(matrix, size);
    
    // Kalikan adjugate dengan invers determinan dalam mod 26
    let inverseMatrix = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(((adjugateMatrix[i][j] * inverseDet) % 26 + 26) % 26);
        }
        inverseMatrix.push(row);
    }
    return inverseMatrix;
}

// Fungsi untuk menghitung determinan matriks (hanya 2x2 dan 3x3)
function getDeterminant(matrix, size) {
    if (size === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    } else if (size === 3) {
        return (
            matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
        );
    }
    return null;
}

// Fungsi untuk menghitung invers modular dari sebuah angka
function getModularInverse(a, mod) {
    for (let x = 1; x < mod; x++) {
        if ((a * x) % mod === 1) {
            return x;
        }
    }
    return -1;
}

// Fungsi untuk menghitung adjugate dari matriks 2x2 atau 3x3
function getAdjugate(matrix, size) {
    if (size === 2) {
        return [
            [matrix[1][1], -matrix[0][1]],
            [-matrix[1][0], matrix[0][0]]
        ];
    } else if (size === 3) {
        let adj = [];
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                let minor = getMinor(matrix, i, j);
                let detMinor = getDeterminant(minor, 2);
                row.push((detMinor * (i + j) % 2 === 0 ? 1 : -1));
            }
            adj.push(row);
        }
        return transposeMatrix(adj);
    }
    return null;
}

// Fungsi untuk mendapatkan minor dari matriks 3x3
function getMinor(matrix, row, col) {
    let minor = [];
    for (let i = 0; i < 3; i++) {
        if (i !== row) {
            let minorRow = [];
            for (let j = 0; j < 3; j++) {
                if (j !== col) {
                    minorRow.push(matrix[i][j]);
                }
            }
            minor.push(minorRow);
        }
    }
    return minor;
}

// Fungsi untuk mentranspos matriks
function transposeMatrix(matrix) {
    let transposed = [];
    for (let i = 0; i < matrix.length; i++) {
        let row = [];
        for (let j = 0; j < matrix.length; j++) {
            row.push(matrix[j][i]);
        }
        transposed.push(row);
    }
    return transposed;
}

// Fungsi untuk mengalikan matriks dengan vektor
function multiplyMatrix(matrix, vector, size) {
    let result = [];
    for (let i = 0; i < size; i++) {
        let sum = 0;
        for (let j = 0; j < size; j++) {
            sum += matrix[i][j] * vector[j];
        }
        result.push((sum % 26 + 26) % 26);
    }
    return result;
}

// Event listener untuk tombol dekripsi
document.getElementById("decrypt-button").addEventListener("click", decryptCustom);

