// Setting Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By Muhammed AL-Sous`;

// ======================================================================== //

// Setting Game Options
let numberOfTries = 5;
let numberOfLetters = 6;
let currentTry = 1;

// Manage Hints
let numberOfHints = 2;
document.querySelector(".hint span").innerHTML = numberOfHints;
const hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", getHint);

// ======================================================================== //

function generateInput() {
  const inputsContainer = document.querySelector(".inputs");

  // Create Main Try Div
  for (let i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i} </span>`;

    if (i !== 1) {
      tryDiv.classList.add("disabled-inputs");
    }

    // Create Inputs
    for (let j = 1; j <= numberOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }
    inputsContainer.appendChild(tryDiv);
  }
  // Focus On First Input In First Try Element
  inputsContainer.children[0].children[1].focus();

  // Disable All Inputs Except First One
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisabledDiv.forEach((input) => {
    input.disabled = true;
  });

  // Target All Input Elements And Loop Through Them
  const inputs = document.querySelectorAll("input");

  inputs.forEach((input, index) => {
    // Convert Input Letter Value To UpperCase
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      // OR With ES6
      // input.addEventListener("input", (e) => {
      //   e.target.value = e.target.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      const currentIndex = Array.from(inputs).indexOf(e.target);

      if (e.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) {
          inputs[nextInput].focus();
        }
      }

      if (e.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) {
          inputs[prevInput].focus();
        }
      }
    });
  });
}

// ======================================================================== //

window.onload = function () {
  generateInput();
};

// ======================================================================== //

// Manage Words
let wordToGuess = "";
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

const checkButton = document.querySelector(".check");
let messageArea = document.querySelector(".message");

checkButton.addEventListener("click", handleGuess);

function handleGuess() {
  let successGuess = true;

  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.getElementById(
      `guess-${currentTry}-letter-${i}`
    );

    const letter = inputField.value.toLowerCase(); // The character entered by the user

    // We put [i - 1] because the Loop here starts at one and the letter index in wordToGuess Array start at zero => wordToGuess[0] in first loop
    const actualLetter = wordToGuess[i - 1]; // The first letter of the random word

    // Game Logic

    if (letter === actualLetter) {
      // Letter Is Correct And In Place
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter Is Correct But Not In Place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      // Letter Is Wrong OR The Input Value Is Empty
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  // Check If User Win Or Lose
  if (successGuess) {
    messageArea.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;

    if (numberOfHints === 2) {
      messageArea.innerHTML = `<p>Congratz You Didn't Use Hints</p>`;
    }

    // Add Disabled Class On All Try Divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => {
      tryDiv.classList.add("disabled-inputs");
    });

    // Disabled Check Button & Hint Button
    checkButton.disabled = true;
    hintButton.disabled = true;
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");

    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => {
      input.disabled = true;
    });

    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);

    nextTryInputs.forEach((input) => {
      input.disabled = false;
    });

    let element = document.querySelector(`.try-${currentTry}`);

    if (element) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      element.children[1].focus();
    } else {
      // Disabled Check Button & Hint Button
      checkButton.disabled = true;
      hintButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}

// ======================================================================== //

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }

  if (numberOfHints === 0) {
    hintButton.disabled = true;
  }
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  
  // احصل على الحقول الفارغة فقط
  const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => {
    return input.value == "";
  });

  if (emptyEnabledInputs.length > 0) {
    // ابحث عن الحرف الصحيح في الكلمة لم يتم إدخاله بعد
    // نستخدم emptyEnabledInputs[0] 
    // لأننا نريد ملء أول حقل فارغ فقط عندما نضغط على زر المساعدة، مما يضمن أن المساعدة تملأ الحقول الفارغة بالترتيب الصحيح.
    const emptyInputIndex = Array.from(enabledInputs).indexOf(emptyEnabledInputs[0]);

    // إذا كانت الحقول الفارغة موجودة، قم بإدخال الحرف الصحيح في المكان الصحيح
    const letterToFill = wordToGuess[emptyInputIndex].toUpperCase();

    // ملء الحرف الصحيح أو ملء أول حرف فارغ موجود عندي 
    emptyEnabledInputs[0].value = letterToFill;
  }
}
// ======================================================================== //

function handleBackSpace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      prevInput.focus();
      currentInput.value = "";
      prevInput.value = "";
    }
  }
}

document.addEventListener("keydown", handleBackSpace);

// ======================================================================== //
