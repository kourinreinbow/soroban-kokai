let currentAnswer = null;
let currentTextParts = [];


// ----------------------------------------
// 音声読み上げ
// ----------------------------------------

function speak(text) {

    if (!window.speechSynthesis) {
        alert("このブラウザは音声読み上げに対応していません。");
        return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    speechSynthesis.speak(utterance);
}


// ----------------------------------------
// 問題生成
// ----------------------------------------

function generateProblem() {

    const minima =
        Number(document.getElementById("minima").value);

    const maxabs =
        Number(document.getElementById("maxabs").value);

    const numCount =
        Number(document.getElementById("numCount").value);

    const allowSubtraction =
        document.getElementById("allowSubtraction").checked;

    const generateAudio =
        document.getElementById("generateAudio").checked;


    if (minima > maxabs) {

        alert("最小値は最大値以下にしてください。");

        return;
    }


    let numbers = [];

    let textParts = ["願いましては"];

    let currentSum = 0;

    let lastOperation = null;


    // ----------------------------------------
    // 数字生成
    // ----------------------------------------

    for (let i = 0; i < numCount; i++) {

        // 最初の数字
        if (i === 0) {

            const rand =
                randomInteger(minima, maxabs);

            numbers.push(rand);

            currentSum += rand;

            textParts.push(`${rand}円なり`);

            lastOperation = "add";

            continue;
        }


        // ------------------------------------
        // 引き算かどうか
        // ------------------------------------

        let isNegative = false;

        if (allowSubtraction) {

            isNegative =
                Math.random() < 0.5;
        }


        // ------------------------------------
        // 引き算
        // ------------------------------------

        if (isNegative && currentSum > minima) {

            const limit =
                Math.min(maxabs, currentSum);

            const rand =
                randomInteger(minima, limit);


            numbers.push(-rand);

            currentSum -= rand;


            if (lastOperation !== "sub") {

                textParts.push(
                    `引いては${rand}円なり`
                );

            } else {

                textParts.push(
                    `${rand}円なり`
                );
            }


            lastOperation = "sub";

        }


        // ------------------------------------
        // 足し算
        // ------------------------------------

        else {

            const rand =
                randomInteger(minima, maxabs);


            numbers.push(rand);

            currentSum += rand;


            if (lastOperation !== "add") {

                textParts.push(
                    `加えては${rand}円なり`
                );

            } else {

                textParts.push(
                    `${rand}円なり`
                );
            }


            lastOperation = "add";
        }
    }


    currentAnswer = currentSum;

    currentTextParts = textParts;


    // ----------------------------------------
    // 表示
    // ----------------------------------------

    const problemText =
        document.getElementById("problemText");

    problemText.innerHTML =
        textParts.join("<br>");


    document.getElementById("answerText").textContent =
        "？";


    // ----------------------------------------
    // 音声
    // ----------------------------------------

    if (generateAudio) {

        const speechText =
            textParts.join("、");

        speak(speechText);
    }


    console.log("生成された数字:", numbers);

    console.log("答え:", currentAnswer);
}


// ----------------------------------------
// 答えを表示
// ----------------------------------------

function showAnswer() {

    if (currentAnswer === null) {

        alert("先に問題を生成してください。");

        return;
    }


    document.getElementById("answerText")
        .textContent = `${currentAnswer}円`;
}


// ----------------------------------------
// 乱数
// ----------------------------------------

function randomInteger(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


// ----------------------------------------
// イベント
// ----------------------------------------

document
    .getElementById("generateButton")
    .addEventListener(
        "click",
        generateProblem
    );


document
    .getElementById("showAnswerButton")
    .addEventListener(
        "click",
        showAnswer
    );