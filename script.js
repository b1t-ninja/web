let secretCode = []
let rowNumber = 1
const colorDisplays = document.querySelectorAll('.color-display');
const colorLists = document.querySelectorAll('.color-list');
const colorOptions = document.querySelectorAll('.color-option');

function getSecretCode() {
    event.preventDefault();
    secretCode = document.getElementById("code").value.split(", ")
    console.log(secretCode)
    document.getElementById("code").value = "";
    setTry()
}

colorDisplays.forEach((display, index) => {
    display.addEventListener('click', () => {
        colorLists[index].classList.toggle('show');
    });
});

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        const color = option.dataset.color;
        if (color) {
            option.parentNode.previousElementSibling.style.backgroundColor = color;
            option.parentNode.classList.toggle('show');
        }
    });
});

document.querySelector('#submit-guess').addEventListener('click', makeGuess);

function checkInputHartHit(input) {
    let hartHit = 0
    secretCode.forEach((code, i) => {
        if (code === input[i]) {
            hartHit++;
        }
    });
    return hartHit
}

function checkInputSoftHit(input) {
    let softHit = 0

    let codeLight = secretCode

    input.forEach((value, index) => {
        if (codeLight.includes(value)) {
            codeLight[codeLight.indexOf(value)] = "";
            softHit++;
        }
    });
    return softHit
}

function gameOver(hit) {
    let dialog = document.getElementById("gameend");
    dialog.textContent = (hit === 4)
        ? `You won ! 🐦‍🔥`
        : "You lost 🚫 try again ! 🔁";
    dialog.parentElement.showModal();
}

function createAnswer(input, softHit, hardtHit) {
    let guesses = document.getElementById("guesses");
    let divGuesses = document.createElement('div');
    divGuesses.classList.add("guess-row");
    let divIndex = document.createElement('div');
    divIndex.classList.add("index-number");
    divIndex.textContent = rowNumber++;
    divGuesses.appendChild(divIndex);
    input.forEach(color => {
        let divGuessItem = document.createElement('div');
        divGuessItem.classList.add('guess-item');
        divGuessItem.setAttribute('data-color', color);
        divGuesses.appendChild(divGuessItem);
    });
    let divGuessResultL = document.createElement('div');
    divGuessResultL.classList.add("guess-result");
    let divGuessResultR = divGuessResultL.cloneNode(true);
    let results = new Array(4).fill("white");
    results.fill("lavender", 0, softHit);
    results.fill("black", 0, hardtHit);
    results.forEach((color, index) => {
        let divGuessResultI = document.createElement('div');
        divGuessResultI.classList.add("guess-result-item");
        divGuessResultI.setAttribute("data-color", color);
        (index < results.length / 2 ? divGuessResultL : divGuessResultR)
            .appendChild(divGuessResultI);
    });
    divGuesses.append(divGuessResultL, divGuessResultR);
    guesses.appendChild(divGuesses);
}

function setTry() {
    let triesLeft = (11 - rowNumber)
    const divRes = document.getElementById("tries_left")
    divRes.textContent = (`${triesLeft} more guesses 👮`)
}

function makeGuess() {
    let input = []
    try {
        colorDisplays.forEach((color, index) => {
            input[index] = color.style.backgroundColor
        })
    } catch (e) {}
    const softHit = checkInputSoftHit(input)
    const hardtHit = checkInputHartHit(input)

    createAnswer(input, softHit, hardtHit)
    setTry()
    if (hardtHit === 4 || rowNumber >= 11) {
        gameOver(hardtHit)
    }
}