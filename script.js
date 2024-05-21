const colorDisplays = document.querySelectorAll('.color-display');
const colorLists = document.querySelectorAll('.color-list');
const colorOptions = document.querySelectorAll('.color-option');

// const colors = ["red", "blue", "green", "yellow", "brown"]
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

function checkInputHartHit(input) {
    let hartHit = 0
    secretCode.forEach((code, i) => {
        if (code === input[i]) {
            hartHit++;
        }
    });
    return hartHit
}

function gameOver(hardhit) {
    const dialog = document.getElementById("gameend");
    dialog.textContent = (hardhit === 4)
        ? `You won ! 🐦‍🔥`
        : "You lost 🚫 try again ! 🔁";
    dialog.parentElement.showModal();
}

function createAnswer(input, softHit, hardtHit) {
    const guesses = document.getElementById("guesses")
    const div_guess_row = document.createElement('div')
    div_guess_row.classList.add("guess-row")

    const div_index_number = document.createElement('div')
    div_index_number.classList.add("index-number")
    div_index_number.textContent = numberRow++

    div_guess_row.appendChild(div_index_number)

    for (let i = 0; i < input.length; i++) {
        const div_guess_item = document.createElement('div')
        div_guess_item.classList.add('guess-item')
        div_guess_item.setAttribute('data-color', input[i])
        div_guess_row.appendChild(div_guess_item)
    }

    const div_guess_result_left = document.createElement('div')
    div_guess_result_left.classList.add("guess-result")

    const div_guess_result_right = div_guess_result_left.cloneNode(true)

    const results = ["white", "white", "white", "white"]
    for (let i = 0; i < softHit; i++) {
        results[i] = "lavender"
    }
    for (let i = 0; i < hardtHit; i++) {
        results[i] = "black"
    }

    for (let i = 0; i < results.length; i++) {
        const div_guess_result_item = document.createElement('div')
        div_guess_result_item.classList.add("guess-result-item")
        div_guess_result_item.setAttribute("data-color", results[i])

        if (i + 1 <= results.length / 2) {
            div_guess_result_left.appendChild(div_guess_result_item)
        } else {
            div_guess_result_right.appendChild(div_guess_result_item)
        }
    }
    div_guess_row.appendChild(div_guess_result_left)
    div_guess_row.appendChild(div_guess_result_right)
    guesses.appendChild(div_guess_row)
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