const colorDisplays = document.querySelectorAll('.color-display');
const colorLists = document.querySelectorAll('.color-list');
const colorOptions = document.querySelectorAll('.color-option');

let secretCode = []
let numberRow = 1

function getSecretCode() {
    event.preventDefault();
    secretCode = document.getElementById("code").value.split(", ")
    console.log(secretCode)
    document.getElementById("code").value = "";
    tries()
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

document.querySelector('#submit-guess').addEventListener('click', guess);

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

    let code_light = new Array(...secretCode)

    input.forEach((value, index) => {
        if (code_light.includes(value)) {
            code_light[code_light.indexOf(value)] = "";
            softHit++;
        }
    });
    return softHit
}

function gameOver(hit) {
    const dialog = document.getElementById("gameend");
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
    divIndex.textContent = numberRow++;

    divGuesses.appendChild(divIndex);

    input.forEach(color => {
        let divGuessItem = document.createElement('div');
        divGuessItem.classList.add('guess-item');
        divGuessItem.setAttribute('data-color', color);
        divGuesses.appendChild(divGuessItem);
    });

    let divGuessResultL = document.createElement('div');
    divGuessResultL.classList.add("guess-result");

    let div_guess_result_r = divGuessResultL.cloneNode(true);
    let results = new Array(4).fill("white");
    results.fill("lavender", 0, softHit);
    results.fill("black", 0, hardtHit);

    results.forEach((color, index) => {
        let div_guess_result_item = document.createElement('div');
        div_guess_result_item.classList.add("guess-result-item");
        div_guess_result_item.setAttribute("data-color", color);
        (index < results.length / 2 ? divGuessResultL : div_guess_result_r)
            .appendChild(div_guess_result_item);
    });

    divGuesses.append(divGuessResultL, div_guess_result_r);
    guesses.appendChild(divGuesses);
}

function tries() {
    let tries_left = (11 - numberRow)
    const div_result = document.getElementById("tries_left")
    div_result.textContent = (tries_left + "  more guesses 👮")
}

function guess() {
    let input = []
    try {
        colorDisplays.forEach((color, index) => {
            if (color.style.backgroundColor === "") {
                throw new Error("please choose a color.")
            }
            input[index] = color.style.backgroundColor
        })
    } catch (e) {}
    const softHit = checkInputSoftHit(input)
    const hardtHit = checkInputHartHit(input)

    createAnswer(input, softHit, hardtHit)
    tries()
    if (hardtHit === 4 || numberRow >= 11) {
        gameOver(hardtHit)
    }
}