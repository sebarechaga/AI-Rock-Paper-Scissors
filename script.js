let humanScore = 0;
let computerScore = 0;
let draws = 0;
let round = 1;
let gameWon = false;
const moves = ['R', 'P', 'S'];
const transitionMatrixTrigram = {
    RR: [0, 0, 0],
    RP: [0, 0, 0],
    RS: [0, 0, 0],
    PR: [0, 0, 0],
    PP: [0, 0, 0],
    PS: [0, 0, 0],
    SR: [0, 0, 0],
    SP: [0, 0, 0],
    SS: [0, 0, 0]
};
const transitionMatrixBigram = {
    R: [0, 0, 0],
    P: [0, 0, 0],
    S: [0, 0, 0]
};
let lastMoves = [];

function getComputerChoice() {
    let computerChoice = Math.floor(Math.random() * 3);
    if (lastMoves.length === 2) {
        let trigram = checkTrigramMatrix();
        if (trigram[0] > 0) {
            computerChoice = moves.indexOf(counter(moves[trigram[1]]));
        }
    }
    switch (computerChoice) {
        case 0:
            return 'R';
            break;
        case 1:
            return 'P';
            break;
        case 2:
            return 'S';
            break;
    }
}

function getHumanChoice(e) {
    let humanChoice;
    let id = e.target.id;

    switch (id) {
        case "rock":
            humanChoice = 'R';
            break;
        case "paper":
            humanChoice = 'P';
            break;
        case "scissors":
            humanChoice = 'S';
            break;
        default:
            humanChoice = "error";
            break;
    }
    return humanChoice;
}

function isValidChoice(choice) {
    choice = choice.toLowerCase();
    if (choice === 'R' || choice === 'P' || choice === 'S') {
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
    function playRound(humanChoice, computerChoice) {

        results.removeChild(results.lastChild);

        let roundResult = document.createElement("div");
        let humanChoiceText = document.createElement("p");
        let computerChoiceText = document.createElement("p");
        let resultText = document.createElement("p");

        humanChoiceText.textContent = ("You chose: " + humanChoice);
        computerChoiceText.textContent = ("Computer chooses: " + computerChoice);

        switch (humanChoice) {
            case 'R':
                if (computerChoice === 'R') {
                    resultText.textContent = ("You both picked rock. Try again.");
                    draws++;
                }
                else if (computerChoice === 'P') {
                    resultText.textContent = ("Paper beats rock. You lose.");
                    round++;
                    computerScore++;
                }
                else if (computerChoice === 'S') {
                    resultText.textContent = ("Rock beats scissors. You win.");
                    round++;
                    humanScore++;
                }
                break;
            case 'P': 
                switch (computerChoice) {
                    case 'R':
                        resultText.textContent = ("Paper beats rock. You win.");
                        round++;
                        humanScore++;
                        break;
                    case 'P':
                        resultText.textContent = ("You both chose paper. Try again.");
                        draws++;
                        break;
                    case 'S':
                        resultText.textContent = ("Scissors beats paper. You lose.");
                        round++;
                        computerScore++;
                        break;
                }
                break;
            case 'S':
                switch (computerChoice) {
                    case 'R':
                        resultText.textContent = ("Rock beats scissors. You lose.");
                        round++;
                        computerScore++;
                        break;
                    case 'P':
                        resultText.textContent = ("Scissors beats paper. You win.");
                        round++;
                        humanScore++;
                        break;
                    case 'S':
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

        updateTransitionMatrices(humanChoice);
    }

    const humanChoice = getHumanChoice(e);
    const computerChoice = getComputerChoice();

    if (!gameWon) {
        playRound(humanChoice, computerChoice);
    }

    determineWinner();
}
function updateTransitionMatrices(playerMove) {

    if(lastMoves.length === 2) {
        const lastTwoMoves = lastMoves.join('');
        transitionMatrixTrigram[lastTwoMoves][moves.indexOf(playerMove)] += 1;

        normalizeMatrix(lastTwoMoves);
    }
    updateMoveHistory(playerMove);
    updateTable();
}
function updateTable() {
    const trigramTable = document.getElementById("trigram-transition-matrix");
    const cells = trigramTable.getElementsByClassName("cell");

    let index = 0;
    for (const lastMovePair in transitionMatrixTrigram) {
        for (let j = 0; j < 3; j++) {
            cells[index].textContent = transitionMatrixTrigram[lastMovePair][j].toFixed(2);
            index++;
        }
    }
}
function updateMoveHistory(move) {
    if (lastMoves.length < 2) {
        lastMoves.push(move);
    }
    else {
        lastMoves.push(move);
        lastMoves.shift();
    }
}
function counter(move) {
    return moves[((moves.indexOf(move) + 1) % 3)];
}
function checkTrigramMatrix() {
    const lastTwoMoves = lastMoves.join('');
    let max = 0;
    let index = 0;
    for (let i = 0; i < 3; i++) {
        if (transitionMatrixTrigram[lastTwoMoves][i] > max) {
            max = transitionMatrixTrigram[lastTwoMoves][i];
            index = i;
        }
    }
    if (max === 0) { //if combination has not been played before
        return -1, -1;
    }
    return [max, index];
}
function normalizeMatrix(lastTwoMoves) {
    const total = transitionMatrixTrigram[lastTwoMoves].reduce((a, b) => a + b, 0);
    if (total > 0) {
        transitionMatrixTrigram[lastTwoMoves] = transitionMatrixTrigram[lastTwoMoves].map(count => count / total);
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