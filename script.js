const result = document.getElementById("result");
const previous = document.getElementById("previous");
const themeToggle = document.getElementById("themeToggle");

let currentValue = "0";
let firstValue = null;
let operator = null;
let waitingForSecond = false;

function updateDisplay() {
    result.textContent = currentValue;
}

function inputNumber(number) {
    if (waitingForSecond) {
        currentValue = number;
        waitingForSecond = false;
    } else {
        currentValue =
            currentValue === "0" ? number : currentValue + number;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecond) {
        currentValue = "0.";
        waitingForSecond = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }
    updateDisplay();
}

function calculate() {
    if (operator === null || waitingForSecond) return;

    const secondValue = parseFloat(currentValue);
    const first = firstValue;

    let answer;

    switch (operator) {
        case "+":
            answer = first + secondValue;
            break;
        case "-":
            answer = first - secondValue;
            break;
        case "×":
            answer = first * secondValue;
            break;
        case "÷":
            if (secondValue === 0) {
                currentValue = "Error";
                firstValue = null;
                operator = null;
                waitingForSecond = true;
                previous.textContent = "";
                updateDisplay();
                return;
            }
            answer = first / secondValue;
            break;
    }

    currentValue = String(
        Number.parseFloat(answer.toPrecision(12))
    );

    firstValue = null;
    operator = null;
    waitingForSecond = true;
    previous.textContent = "";
    updateDisplay();
}

function chooseOperator(nextOperator) {
    const inputValue = parseFloat(currentValue);

    if (operator && !waitingForSecond) {
        calculate();
    }

    firstValue = parseFloat(currentValue);
    operator = nextOperator;
    waitingForSecond = true;

    previous.textContent = firstValue + " " + operator;
}

function clearAll() {
    currentValue = "0";
    firstValue = null;
    operator = null;
    waitingForSecond = false;
    previous.textContent = "";
    updateDisplay();
}

function deleteNumber() {
    if (waitingForSecond) return;

    currentValue =
        currentValue.length > 1
            ? currentValue.slice(0, -1)
            : "0";

    updateDisplay();
}

function changeSign() {
    if (currentValue === "0" || currentValue === "Error") return;

    currentValue = String(parseFloat(currentValue) * -1);
    updateDisplay();
}

function percentage() {
    currentValue = String(parseFloat(currentValue) / 100);
    updateDisplay();
}

document.querySelectorAll("[data-number]").forEach(button => {
    button.addEventListener("click", () => {
        inputNumber(button.dataset.number);
    });
});

document.querySelectorAll("[data-operator]").forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.dataset.operator);
    });
});

document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;

        switch (action) {
            case "clear":
                clearAll();
                break;
            case "delete":
                deleteNumber();
                break;
            case "sign":
                changeSign();
                break;
            case "percent":
                percentage();
                break;
            case "decimal":
                inputDecimal();
                break;
            case "equals":
                calculate();
                break;
        }
    });
});

// Light / Dark Mode

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");

    themeToggle.textContent =
        document.body.classList.contains("dark-mode")
            ? "☀️"
            : "🌙";
});

updateDisplay();