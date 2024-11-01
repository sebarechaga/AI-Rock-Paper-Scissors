let humanScore = 0;
let computerScore = 0;
let draws = 0;
let round = 1;
let gameWon = false;
let transitionMatrix = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
]

function getComputerChoice() {
    let computerChoice = Math.floor(Math.random() * 3);
    switch (computerChoice) {
        case 0:
            return "rock";
            break;
        case 1:
            return "paper";
            break;
        case 2:
            return "scissors";
            break;
    }
}

function getHumanChoice(e) {
    let humanChoice;
    let id = e.target.id;

    switch (id) {
        case "rock":
            humanChoice = "rock";
            break;
        case "paper":
            humanChoice = "paper";
            break;
        case "scissors":
            humanChoice = "scissors";
            break;
        default:
            humanChoice = "error";
            break;
    }
    return humanChoice;
}

function isValidChoice(choice) {
    choice = choice.toLowerCase();
    if (choice === "rock" || choice === "paper" || choice === "scissors") {
        return true;
    }
    return false;
}

function determineWinner() {
    if(computerScore >= 1000) {
        winner.textContent = ("You lose. Refresh the page to play again.");
        gameWon = true;
        results.appendChild(winner);
    }
    else if (humanScore >= 1000){
        winner.textContent = ("You win. Refresh the page to play again.");
        gameWon = true;
        results.appendChild(winner);
    }
}
function playGame(e) {

    updateDecisionMatrix();

    function playRound(humanChoice, computerChoice) {

        results.removeChild(results.lastChild);

        let roundResult = document.createElement("div");
        let humanChoiceText = document.createElement("p");
        let computerChoiceText = document.createElement("p");
        let resultText = document.createElement("p");

        humanChoiceText.textContent = ("You chose: " + humanChoice);
        computerChoiceText.textContent = ("Computer chooses: " + computerChoice);

        switch (humanChoice) {
            case "rock":
                if (computerChoice === "rock") {
                    resultText.textContent = ("You both picked rock. Try again.");
                    draws++;
                }
                else if (computerChoice === "paper") {
                    resultText.textContent = ("Paper beats rock. You lose.");
                    round++;
                    computerScore++;
                }
                else if (computerChoice === "scissors") {
                    resultText.textContent = ("Rock beats scissors. You win.");
                    round++;
                    humanScore++;
                }
                break;
            case "paper": 
                switch (computerChoice) {
                    case "rock":
                        resultText.textContent = ("Paper beats rock. You win.");
                        round++;
                        humanScore++;
                        break;
                    case "paper":
                        resultText.textContent = ("You both chose paper. Try again.");
                        draws++;
                        break;
                    case "scissors":
                        resultText.textContent = ("Scissors beats paper. You lose.");
                        round++;
                        computerScore++;
                        break;
                }
                break;
            case "scissors":
                switch (computerChoice) {
                    case "rock":
                        resultText.textContent = ("Rock beats scissors. You lose.");
                        round++;
                        computerScore++;
                        break;
                    case "paper":
                        resultText.textContent = ("Scissors beats paper. You win.");
                        round++;
                        humanScore++;
                        break;
                    case "scissors":
                        resultText.textContent = ("You both chose scissors. Try again.");
                        draws++;
                        break;
                }
                break;
        }
        currentRound.textContent = "Current Round: " + round;
        currentScore.textContent = scoreString();
        
        roundResult.appendChild(humanChoiceText);
        roundResult.appendChild(computerChoiceText);
        roundResult.appendChild(resultText);
        results.appendChild(roundResult);

        updateDecisionMatrix();
    }

    const humanChoice = getHumanChoice(e);
    const computerChoice = getComputerChoice();

    if (!gameWon) {
        playRound(humanChoice, computerChoice);
    }

    determineWinner();
}
function updateDecisionMatrix(playerMove, computerMove) {
    updateTable();
}
function updateTable() {
    const table = document.getElementById("transition-matrix");
    const cells = table.getElementsByClassName("cell");

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            cells[(i * 3) + j].textContent = transitionMatrix[i][j].toFixed(2);
        }
    }
}
function scoreString() {
    return ("You: " + humanScore + ", Computer: " + computerScore + ", Draws: " + draws);
}

const buttons = document.querySelector("#buttons");
const results = document.querySelector("#results");
const currentRound = document.querySelector("#current-round");
currentRound.textContent = "Current Round: " + round;
const currentScore = document.querySelector("#current-score");
currentScore.textContent = scoreString();

const winner = document.createElement("p");
//const rock = document.querySelector("#rock");
//const paper = document.querySelector("#paper");
//const scissors = document.querySelector("#scissors");

buttons.addEventListener("click", (e) => {playGame(e);});