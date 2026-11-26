
const namaPemain = localStorage.getItem("namaPemain");

if (!namaPemain) {
    window.location.href = "./index.html";
}

document.getElementById("player-name").textContent =
    "👧 Halo, " + namaPemain + "!";

const totalSoal = 5;
const poinBenar = 10;
const batasLulus = 4;

const buah = ["🍎", "🍊", "🍓", "🍇", "🍌", "🍉", "🍐", "🥝"];

let level = Number(localStorage.getItem("levelTerbuka")) || 1;
let soalSekarang = 0;
let skor = 0;
let jawabanBenar = 0;
let jawabanSoal = false;
let jumlahBuah = 0;

const scoreElement = document.getElementById("score");
const levelNameElement = document.getElementById("level-name");
const levelNumberElement = document.getElementById("level-number");
const progressFill = document.getElementById("progress-fill");
const questionProgress = document.getElementById("question-progress");
const fruitArea = document.getElementById("fruit-area");
const answerArea = document.getElementById("answer-area");
const feedback = document.getElementById("feedback");
const nextButton = document.getElementById("next-button");

const playArea = document.getElementById("play-area");
const resultArea = document.getElementById("result-area");

const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const resultStar = document.getElementById("result-star");
const finalScore = document.getElementById("final-score");
const rewardMessage = document.getElementById("reward-message");
const resultButton = document.getElementById("result-button");

const namaLevel = [
    "🌱 Kebun Pemula",
    "🌼 Kebun Ceria",
    "🍎 Kebun Buah",
    "🌳 Kebun Hebat",
    "🌈 Kebun Pintar",
    "🏆 Kebun Juara"
];

function getNamaLevel(level) {
    return namaLevel[(level - 1) % namaLevel.length];
}

function goToDashboard() {
    window.location.href = "./dashboard.html";
}

function mulaiLevel() {
    soalSekarang = 0;
    skor = 0;
    jawabanBenar = 0;

    scoreElement.textContent = skor;
    levelNameElement.textContent = getNamaLevel(level);
    levelNumberElement.textContent = "Level " + level;

    playArea.hidden = false;
    resultArea.hidden = true;

    document.querySelector(".skip-game").hidden = false;

    tampilkanSoal();
}

function buatPilihan(jawaban) {
    const pilihan = new Set([jawaban]);

    while (pilihan.size < 3) {
        const selisih = Math.floor(Math.random() * 7) + 1;
        const arah = Math.random() < 0.5 ? -1 : 1;

        const angka = Math.max(1, jawaban + (selisih * arah));

        pilihan.add(angka);
    }

    return [...pilihan].sort(() => Math.random() - 0.5);
}

function tampilkanSoal() {
    jawabanSoal = false;

    jumlahBuah = Math.floor(
        Math.random() * (10 + (level - 1) * 5)
    ) + 1;

    const buahDipilih = buah[
        Math.floor(Math.random() * buah.length)
    ];

    fruitArea.innerHTML = "";

    for (let i = 0; i < jumlahBuah; i++) {
        const itemBuah = document.createElement("span");
        itemBuah.textContent = buahDipilih;
        fruitArea.appendChild(itemBuah);
    }

    answerArea.innerHTML = "";

    const pilihan = buatPilihan(jumlahBuah);

    pilihan.forEach(angka => {
        const tombol = document.createElement("button");

        tombol.className = "answer-button";
        tombol.textContent = angka;

        tombol.addEventListener("click", function() {
            periksaJawaban(angka, tombol);
        });

        answerArea.appendChild(tombol);
    });

    feedback.textContent = "Yuk, hitung buahnya dengan teliti! 🌼";

    nextButton.hidden = true;
    nextButton.textContent = "Soal Berikutnya ➜";

    questionProgress.textContent =
        "Soal " + (soalSekarang + 1) + " dari " + totalSoal;

    progressFill.style.width =
        (soalSekarang / totalSoal * 100) + "%";
}

function periksaJawaban(jawaban, tombolDipilih) {
    if (jawabanSoal) return;

    jawabanSoal = true;

    const semuaTombol = answerArea.querySelectorAll("button");

    semuaTombol.forEach(tombol => {
        tombol.disabled = true;

        if (Number(tombol.textContent) === jumlahBuah) {
            tombol.style.background = "#d8f3dc";
            tombol.style.borderColor = "#65b86b";
        }
    });

    if (jawaban === jumlahBuah) {
        skor += poinBenar;
        jawabanBenar++;

        scoreElement.textContent = skor;

        feedback.textContent =
            "Hebat! Jawaban kamu benar! 🎉⭐";

        tombolDipilih.style.color = "#28743b";
    } else {
        feedback.textContent =
            "Belum tepat. Tetap semangat, ya! 🌻";
    }

    soalSekarang++;

    progressFill.style.width =
        (soalSekarang / totalSoal * 100) + "%";

    if (soalSekarang < totalSoal) {
        nextButton.hidden = false;
    } else {
        nextButton.textContent = "Lihat Hasil 🏆";
        nextButton.hidden = false;
    }
}

function tampilkanHasil() {
    playArea.hidden = true;
    resultArea.hidden = false;

    document.querySelector(".skip-game").hidden = true;

    const lulus = jawabanBenar >= batasLulus;

    finalScore.textContent = "Skor: " + skor;

    if (lulus) {
        resultTitle.textContent = "Hebat Sekali! 🎉";
        resultMessage.textContent =
            "Kamu berhasil menyelesaikan tantangan level ini!";

        resultStar.textContent = "⭐⭐⭐";

        rewardMessage.textContent =
            "Kamu menjawab " + jawabanBenar +
            " dari 5 soal dengan benar. Pertahankan semangatmu!";

        const levelTerbuka =
            Number(localStorage.getItem("levelTerbuka")) || 1;

        if (level >= levelTerbuka) {
            localStorage.setItem("levelTerbuka", level + 1);
        }

        resultButton.textContent = "Lanjut Level ➜";

        resultButton.onclick = function() {
            level++;
            mulaiLevel();
        };

    } else {
        resultTitle.textContent = "Tetap Semangat! 🌻";
        resultMessage.textContent =
            "Kamu belum berhasil melewati level ini.";

        resultStar.textContent = "⭐";

        rewardMessage.textContent =
            "Kamu menjawab " + jawabanBenar +
            " dari 5 soal dengan benar. Ayo coba lagi!";

        resultButton.textContent = "Ulangi Level 🔄";

        resultButton.onclick = function() {
            mulaiLevel();
        };
    }
}

nextButton.addEventListener("click", function() {
    if (soalSekarang < totalSoal) {
        tampilkanSoal();
    } else {
        tampilkanHasil();
    }
});

mulaiLevel();
