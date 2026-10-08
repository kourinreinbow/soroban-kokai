// ========================================
// グローバル変数
// ========================================

let currentAnswer = null;

let currentTextParts = [];

let japaneseVoices = [];


// ========================================
// DOM要素
// ========================================

const voiceSelect =
    document.getElementById("voiceSelect");

const speechRate =
    document.getElementById("speechRate");

const speechRateValue =
    document.getElementById("speechRateValue");

const speechPitch =
    document.getElementById("speechPitch");

const speechPitchValue =
    document.getElementById("speechPitchValue");


// ========================================
// 音声一覧を取得
// ========================================

function loadVoices() {

    const voices =
        speechSynthesis.getVoices();


    // 日本語音声だけを抽出

    japaneseVoices =
        voices.filter(voice =>
            voice.lang.toLowerCase().startsWith("ja")
        );


    voiceSelect.innerHTML = "";


    // 日本語音声が見つからない場合

    if (japaneseVoices.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent =
            "日本語音声が見つかりません";

        voiceSelect.appendChild(option);

        return;
    }


    // 日本語音声を選択肢に追加

    japaneseVoices.forEach(
        (voice, index) => {

            const option =
                document.createElement("option");


            option.value = index;


            option.textContent =
                `${voice.name} (${voice.lang})`;


            voiceSelect.appendChild(option);
        }
    );


    // 最初の音声を選択

    voiceSelect.value = "0";
}


// ========================================
// 音声読み込み
// ========================================

// ブラウザによっては、音声一覧が
// 非同期で読み込まれるため両方設定する

speechSynthesis.onvoiceschanged =
    loadVoices;


loadVoices();


// ========================================
// 読み上げ速度の表示
// ========================================

speechRate.addEventListener(
    "input",
    () => {

        speechRateValue.textContent =
            speechRate.value;
    }
);


// ========================================
// 音程の表示
// ========================================

speechPitch.addEventListener(
    "input",
    () => {

        speechPitchValue.textContent =
            speechPitch.value;
    }
);


// ========================================
// 音声読み上げ
// ========================================

function speak(text) {

    if (!window.speechSynthesis) {

        alert(
            "このブラウザは音声読み上げに対応していません。"
        );

        return;
    }


    // 現在の読み上げを停止

    speechSynthesis.cancel();


    // 音声一覧を取得

    const voices =
        speechSynthesis
            .getVoices()
            .filter(voice =>
                voice.lang
                    .toLowerCase()
                    .startsWith("ja")
            );


    const selectedIndex =
        Number(voiceSelect.value);


    const selectedVoice =
        voices[selectedIndex];


    // 音声オブジェクト作成

    const utterance =
        new SpeechSynthesisUtterance(text);


    // 日本語

    utterance.lang = "ja-JP";


    // 選択された音声

    if (selectedVoice) {

        utterance.voice =
            selectedVoice;
    }


    // 読み上げ速度

    utterance.rate =
        Number(speechRate.value);


    // 音程

    utterance.pitch =
        Number(speechPitch.value);


    // 音量

    utterance.volume = 1.0;


    // 読み上げ

    speechSynthesis.speak(
        utterance
    );
}


// ========================================
// 音声テスト
// ========================================

function testVoice() {

    speak(
        "こちらはテスト音声です"
    );
}


document
    .getElementById("testVoiceButton")
    .addEventListener(
        "click",
        testVoice
    );


// ========================================
// 問題生成
// ========================================

function generateProblem() {

    // ------------------------------------
    // 設定値取得
    // ------------------------------------

    const minima =
        Number(
            document.getElementById(
                "minima"
            ).value
        );


    const maxabs =
        Number(
            document.getElementById(
                "maxabs"
            ).value
        );


    const numCount =
        Number(
            document.getElementById(
                "numCount"
            ).value
        );


    const allowSubtraction =
        document.getElementById(
            "allowSubtraction"
        ).checked;


    const generateAudio =
        document.getElementById(
            "generateAudio"
        ).checked;


    // ------------------------------------
    // 入力値チェック
    // ------------------------------------

    if (
        !Number.isInteger(minima) ||
        !Number.isInteger(maxabs) ||
        !Number.isInteger(numCount)
    ) {

        alert(
            "設定値には整数を入力してください。"
        );

        return;
    }


    if (minima < 1) {

        alert(
            "最小値は1以上にしてください。"
        );

        return;
    }


    if (minima > maxabs) {

        alert(
            "最小値は最大値以下にしてください。"
        );

        return;
    }


    if (
        numCount < 1 ||
        numCount > 50
    ) {

        alert(
            "数字の個数は1～50の範囲にしてください。"
        );

        return;
    }


    // ------------------------------------
    // 問題生成
    // ------------------------------------

    const numbers = [];

    const textParts = [
        "願いましては"
    ];


    let currentSum = 0;

    let lastOperation = null;


    for (
        let i = 0;
        i < numCount;
        i++
    ) {


        // ==================================
        // 最初の数字
        // ==================================

        if (i === 0) {

            const rand =
                randomInteger(
                    minima,
                    maxabs
                );


            numbers.push(rand);

            currentSum += rand;

            if (i < numCount-1)
                textParts.push(
                    `${rand}円なり`
                );
            else{
                textParts.push(
                    `${rand}円では`
                );
            }



            lastOperation = "add";


            continue;
        }


        // ==================================
        // 引き算判定
        // ==================================

        let isNegative = false;


        if (allowSubtraction) {

            isNegative =
                Math.random() < 0.5;
        }


        // ==================================
        // 引き算
        // ==================================

        if (
            isNegative &&
            currentSum > minima
        ) {

            const limit =
                Math.min(
                    maxabs,
                    currentSum
                );


            const rand =
                randomInteger(
                    minima,
                    limit
                );


            numbers.push(-rand);


            currentSum -= rand;


            // 「引いては」は
            // 引き算に切り替わった時だけ

            if (
                lastOperation !== "sub"
            ) {

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


        // ==================================
        // 足し算
        // ==================================

        else {

            const rand =
                randomInteger(
                    minima,
                    maxabs
                );


            numbers.push(rand);


            currentSum += rand;


            // 「加えては」は
            // 足し算に切り替わった時だけ

            if (
                lastOperation !== "add"
            ) {

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


    // ------------------------------------
    // 答えを保存
    // ------------------------------------

    currentAnswer =
        currentSum;


    currentTextParts =
        textParts;


    // ------------------------------------
    // 問題文を表示
    // ------------------------------------

    const problemText =
        document.getElementById(
            "problemText"
        );


    problemText.innerHTML =
        textParts.join("<br>");


    // ------------------------------------
    // 答えを隠す
    // ------------------------------------

    document.getElementById(
        "answerText"
    ).textContent = "？";


    // ------------------------------------
    // 音声読み上げ
    // ------------------------------------

    if (generateAudio) {

        /*
         * 元のPython版では各フレーズの間に
         * 0.8秒程度の無音を入れていました。
         *
         * Web Speech APIでは細かい無音時間を
         * 同じように制御することが難しいため、
         * ここでは「、」を入れて自然な間を作ります。
         */

        const speechText =
            textParts.join("、");


        speak(
            speechText
        );
    }


    // デバッグ用

    console.log(
        "生成された数字:",
        numbers
    );


    console.log(
        "答え:",
        currentAnswer
    );
}


// ========================================
// 答えを表示
// ========================================

function showAnswer() {

    if (
        currentAnswer === null
    ) {

        alert(
            "先に問題を生成してください。"
        );

        return;
    }


    document.getElementById(
        "answerText"
    ).textContent =
        `${currentAnswer}円`;
}


document
    .getElementById(
        "showAnswerButton"
    )
    .addEventListener(
        "click",
        showAnswer
    );


// ========================================
// 乱数生成
// ========================================

function randomInteger(
    min,
    max
) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;
}


// ========================================
// 問題生成ボタン
// ========================================

document
    .getElementById(
        "generateButton"
    )
    .addEventListener(
        "click",
        generateProblem
    );