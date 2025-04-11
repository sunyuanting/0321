let table;
let currentQuestion = 0;
let feedback = '';
let buttons = [];
let nextButton;
let inputBox;
let correctCount = 0;
let incorrectCount = 0;

function preload() {
  // load any images or sounds
  table = loadTable('questions.csv', 'csv', 'header'); // Load the updated CSV file
}

function setup() {
  createCanvas(windowWidth, windowHeight);// create a canvas the size of the window
  textSize(24);
  textAlign(CENTER, CENTER);
  createOptionButtons();
  createNextButton();
  createInputBox(); // Create input box for fill-in-the-blank questions
  console.log(table); // Log the table to verify it loaded correctly
  console.log(`Loaded ${table.getRowCount()} questions.`);
}

function draw() {
  background('#8ecae6'); // Set background color to #8ecae6
  if (table) {
    // Draw the centered rectangle
    let rectWidth = 500;
    let rectHeight = 300;
    let rectX = (width - rectWidth) / 2;
    let rectY = (height - rectHeight) / 2;
    fill(255);
    stroke(0);
    rect(rectX, rectY, rectWidth, rectHeight);

    if (currentQuestion < table.getRowCount()) {
      // Display the question inside the rectangle
      let question = table.getString(currentQuestion, 'question');
      fill(0);
      noStroke();
      text(question, width / 2, rectY + 50);

      // Show or hide input box based on question type
      let type = table.getString(currentQuestion, 'type');
      if (type === 'fill') {
        inputBox.show();
        inputBox.position(rectX + 50, rectY + 150);
      } else {
        inputBox.hide();
      }

      // Display feedback below the rectangle
      text(feedback, width / 2, rectY + rectHeight - 30);
    } else {
      // Display results at the end
      fill(0);
      noStroke();
      text(`答對了 ${correctCount} 題`, width / 2, rectY + 100);
      text(`答錯了 ${incorrectCount} 題`, width / 2, rectY + 150);
    }
  }
}

function createOptionButtons() {
  if (table) {
    let type = table.getString(currentQuestion, 'type');
    if (type === 'mcq') {
      let options = [
        table.getString(currentQuestion, 'option1'),
        table.getString(currentQuestion, 'option2'),
        table.getString(currentQuestion, 'option3'),
        table.getString(currentQuestion, 'option4'),
      ];

      // Clear existing buttons
      buttons.forEach(button => button.remove());
      buttons = [];

      // Create new buttons inside the rectangle
      let rectWidth = 500;
      let rectHeight = 300;
      let rectX = (width - rectWidth) / 2;
      let rectY = (height - rectHeight) / 2;

      for (let i = 0; i < options.length; i++) {
        let btn = createButton(options[i]);
        btn.position(rectX + 50 + i * 110, rectY + 150); // Arrange buttons horizontally
        btn.mousePressed(() => checkAnswer(options[i]));
        buttons.push(btn);
      }
    } else {
      // Clear buttons for non-MCQ questions
      buttons.forEach(button => button.remove());
      buttons = [];
    }
  }
}

function createNextButton() {
  nextButton = createButton('下一題');
  let rectWidth = 500;
  let rectHeight = 300;
  let rectX = (width - rectWidth) / 2;
  let rectY = (height - rectHeight) / 2;
  nextButton.position(rectX + rectWidth - 100, rectY + rectHeight - 50); // Position in the bottom-right corner of the rectangle
  nextButton.mousePressed(nextQuestion);
  nextButton.hide(); // Initially hide the button
}

function checkAnswer(selectedOption) {
  let correctAnswer = table.getString(currentQuestion, 'answer');
  if (selectedOption === correctAnswer) {
    feedback = '答對了';
    correctCount++; // Increment correct answer count
    nextButton.show(); // Show the "下一題" button if the answer is correct
  } else {
    feedback = '答錯了，再試一次'; // Display "再試一次" if the answer is incorrect
    incorrectCount++; // Increment incorrect answer count
  }
}

function nextQuestion() {
  if (currentQuestion < table.getRowCount() - 1) {
    currentQuestion++;
    feedback = '';
    nextButton.hide(); // Hide the button for the next question
    inputBox.value(''); // Clear the input box
    createOptionButtons(); // Update buttons for the new question
  } else {
    currentQuestion++; // Move to the "end" state
    feedback = '';
    nextButton.hide(); // Hide the button at the end
    inputBox.hide(); // Hide the input box at the end
    buttons.forEach(button => button.remove()); // Remove all buttons
  }
}

function createInputBox() {
  inputBox = createInput('');
  inputBox.hide(); // Initially hide the input box
  inputBox.input(() => {
    let userAnswer = inputBox.value();
    let correctAnswer = table.getString(currentQuestion, 'answer');
    if (userAnswer === correctAnswer) {
      feedback = '答對了';
      correctCount++; // Increment correct answer count
      nextButton.show(); // Show the "下一題" button if the answer is correct
    } else {
      feedback = '答錯了，再試一次'; // Display "再試一次" if the answer is incorrect
      incorrectCount++; // Increment incorrect answer count
    }
  });
}
