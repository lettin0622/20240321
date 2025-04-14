let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;

let questionText;
let options; // 選擇題的選項
let inputBox; // 填空題的輸入框
let submitButton;
let resultText;

function preload() {
  // 載入 CSV 檔案
  questions = loadTable("questions.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 建立題目文字
  questionText = createP("");
  questionText.style("font-size", "30px");
  questionText.style("color", "black");
  questionText.style("text-align", "center");
  questionText.style("line-height", "2");
  questionText.position(windowWidth / 2 - 150, windowHeight / 2 - 200);

  // 建立選擇題選項
  options = createRadio();
  options.style("font-size", "25px");
  options.style("line-height", "2");
  options.position(windowWidth / 2 - 50, windowHeight / 2 - 100);

  // 建立填空題輸入框
  inputBox = createInput("");
  inputBox.style("font-size", "25px");
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 - 100);
  inputBox.hide(); // 預設隱藏，只有填空題時顯示

  // 建立送出按鈕
  submitButton = createButton("送出");
  submitButton.style("font-size", "25px");
  submitButton.style("padding", "10px 20px");
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 50);
  submitButton.mousePressed(handleButtonClick);

  // 建立結果文字
  resultText = createP("");
  resultText.style("font-size", "25px");
  resultText.style("color", "black");
  resultText.style("text-align", "center");
  resultText.position(windowWidth / 2 - 150, windowHeight / 2 + 100);

  // 顯示第一題
  loadQuestion();
}

function draw() {
  background("#EDE7E3");

  // 計算矩形的寬和高
  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;

  // 計算矩形的起始位置，使其位於視窗中央
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;

  // 設定矩形顏色並繪製
  fill("#FEEAFA");
  noStroke();
  rect(rectX, rectY, rectWidth, rectHeight);
}

// 載入當前題目
function loadQuestion() {
  if (currentQuestionIndex < questions.getRowCount()) {
    let currentRow = questions.getRow(currentQuestionIndex);

    // 更新題目文字
    questionText.html(currentRow.get("question"));

    // 判斷題型（選擇題或填空題）
    if (currentRow.get("type") === "choice") {
      // 顯示選擇題
      options.show();
      inputBox.hide();
      options.html(""); // 清空選項
      options.option(currentRow.get("option1"));
      options.option(currentRow.get("option2"));
      options.option(currentRow.get("option3"));
      options.option(currentRow.get("option4"));
    } else if (currentRow.get("type") === "fill") {
      // 顯示填空題
      options.hide();
      inputBox.show();
      inputBox.value(""); // 清空輸入框
    }

    // 清空結果文字
    resultText.html("");

    // 按鈕文字設為 "送出"
    submitButton.html("送出");
  } else {
    // 顯示測驗結果
    questionText.html("測驗完成！");
    options.hide();
    inputBox.hide();
    resultText.html(`答對題數：${correctCount}，答錯題數：${incorrectCount}`);
    submitButton.html("再試一次");
  }
}

// 處理按鈕點擊
function handleButtonClick() {
  if (currentQuestionIndex < questions.getRowCount()) {
    let currentRow = questions.getRow(currentQuestionIndex);
    let correctAnswer = currentRow.get("answer");
    let selectedOption;

    if (currentRow.get("type") === "choice") {
      // 選擇題檢查答案
      selectedOption = options.value();
    } else if (currentRow.get("type") === "fill") {
      // 填空題檢查答案
      selectedOption = inputBox.value().trim();
    }

    if (selectedOption === correctAnswer) {
      resultText.html("答對了");
      correctCount++;
    } else {
      resultText.html("答錯了");
      incorrectCount++;
    }

    // 如果按鈕文字是 "送出"，則切換到下一題
    if (submitButton.html() === "送出") {
      submitButton.html("下一題");
    } else {
      // 切換到下一題
      currentQuestionIndex++;
      loadQuestion();
    }
  } else {
    // 重置測驗
    currentQuestionIndex = 0;
    correctCount = 0;
    incorrectCount = 0;
    loadQuestion();
  }
}