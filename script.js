/*
 * Rock Paper Scissors AI Game
 * This script implements a rock-paper-scissors game with an AI opponent.
 * The AI uses both bigram and trigram models with weighted probabilities
 * to predict the player’s moves and choose its counter-move.
 */

// -------- Global Variables --------

let humanScore = 0;
let computerScore = 0;
let draws = 0; 
let round = 1;
let choseFrom = -1; //0: chose randomly, 1: chose from bigram matrix, 2: chose from trigram matrix
const moves = ['R', 'P', 'S']; //0 for rock, 1 for paper, 2 for scissors
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
let lastMoves = []; //updated with the player's last two moves

// -------- Logic and Decision-Making Functions --------

/*
* getComputerChoice() - calculate AI's move based on information from transition matrices
*
* returns R, P, or S
*/
function getComputerChoice() {
    let bigramProbability = 0;
    let trigramProbability = 0;
    let bigramChoice;
    let trigramChoice;

    //if move history is long enough, check bigram matrix
    if (lastMoves.length > 0) {
        let bigram = checkBigramMatrix();
        if (bigram[0] > 0) {
            bigramProbability = bigram[0];
            bigramChoice = moves.indexOf(counter(moves[bigram[1]]));
        }
    }
    //if move history is long enough, check trigram matrix
    if (lastMoves.length === 2) {
        let trigram = checkTrigramMatrix();
        if (trigram[0] > 0) {
            trigramProbability = trigram[0];
            trigramChoice = moves.indexOf(counter(moves[trigram[1]]));
        }
    }

    //call decide() method and pass in data from both matrices
    let computerChoice = decide(bigramProbability, bigramChoice, trigramProbability, trigramChoice);

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

/*
* decide() - Determine's which matrix to use based on weighted probabilities
*
* Parameters:
* bp: probability from bigram matrix
* bc: best choice according to bigram matrix
* tp: probability from trigram matrix
* tc: best choice according to trigram matrix
*
* returns AI's next move
*/
function decide(bp, bc, tp, tc) {
    if (bp > 0 && tp > 0) {
        //Apply weights to balance bigram and trigram influence
        bp *= 0.6;
        tp *= 0.4;
        if (bp >= tp) {
            choseFrom = 1;
            return bc;
        }
        else if (bp < tp) {
            choseFrom = 2;
            return tc;
        }
    }
    if (bp > 0) {
        choseFrom = 1;
        return bc;
    }
    if (tp > 0) {
        choseFrom = 2;
        return tc;
    }
    //Default to random choice if no probabilities are available
    choseFrom = 0;
    return (Math.floor(Math.random() * 3));
}

/*
* counter() - returns the move that "beats" the input move
* example: counter('R') returns 'P'
*/
function counter(move) {
    return moves[((moves.indexOf(move) + 1) % 3)];
}

/*
* checkTrigramMatrix() - returns the most likely next move based on the player's last two moves
*
* returns an array containing the probability of the
* most likely next move and the index of that move 
*
*/
function checkTrigramMatrix() {
    const lastTwoMoves = lastMoves.join('');
    let max = 0;
    let index = 0;
    let total = 0;

    for (let i = 0; i < 3; i++) {
        total += transitionMatrixTrigram[lastTwoMoves][i];
        if (transitionMatrixTrigram[lastTwoMoves][i] > max) {
            max = transitionMatrixTrigram[lastTwoMoves][i];
            index = i;
        }
    }
    //if combination has not been played before
    if (max === 0) { 
        return [-1, -1];
    }
    return [max/total, index];
}

/*
* checkBigramMatrix() - returns the most likely next move based on the player's last move
*
* returns an array containing the probability of the
* most likely next move and the index of that move 
*
*/
function checkBigramMatrix() {
    const lastMove = lastMoves[lastMoves.length - 1];
    let max = 0;
    let index = 0;
    let total = 0;

    for (let i = 0; i < 3; i++) {
        total += transitionMatrixBigram[lastMove][i];
        if (transitionMatrixBigram[lastMove][i] > max) {
            max = transitionMatrixBigram[lastMove][i];
            index = i
        }
    }
    //if combination has not been played before
    if (max === 0) { 
        return [-1, -1];
    }
    return [max/total, index];
}

//isValidChoice() - checks if player's choice is valid
function isValidChoice(choice) {
    if (choice === 'R' || choice === 'P' || choice === 'S') {
        return true;
    }
    return false;
}

// -------- Game State Management Functions --------

// updateTransitionMatrices() - updates bigram and trigram matrices based on previous player move
function updateTransitionMatrices(playerMove) {
    if (lastMoves.length > 0) {
        transitionMatrixBigram[lastMoves[lastMoves.length - 1]][moves.indexOf(playerMove)] += 1;
    }
    if(lastMoves.length === 2) {
        const lastTwoMoves = lastMoves.join('');
        transitionMatrixTrigram[lastTwoMoves][moves.indexOf(playerMove)] += 1;
    }
    updateTables();
    updateMoveHistory(playerMove);
}

//updateMoveHistory() - updates last moves array
function updateMoveHistory(move) {
    if (lastMoves.length < 2) {
        lastMoves.push(move);
    }
    else {
        lastMoves.push(move);
        lastMoves.shift();
    }
}

// -------- Event Handling and DOM Manipulation Functions --------

//updateTables() - normalizes matrices and updates table content
function updateTables() {
    const trigramTable = document.getElementById("trigram-transition-matrix");
    const bigramTable = document.getElementById("bigram-transition-matrix");
    const bigramCells = bigramTable.getElementsByClassName("cell")
    const trigramCells = trigramTable.getElementsByClassName("cell"); 

    if (lastMoves.length > 0) {
        let normalizedBigram = normalizeBigramMatrix();
        
        let index = 0;
        for (const lastMove in normalizedBigram) {
            for (let j = 0; j < 3; j++) {
                bigramCells[index].textContent = normalizedBigram[lastMove][j].toFixed(2);
                index++;
            }
        }
    }
    if (lastMoves.length === 2) {
        let normalizedTrigram = normalizeTrigramMatrix();

        let index = 0;
        for (const lastMovePair in normalizedTrigram) {
            for (let j = 0; j < 3; j++) {
                trigramCells[index].textContent = normalizedTrigram[lastMovePair][j].toFixed(2);
                index++;
            }
        }
    }
}

//normalizeTrigramMatrix() - creates trigram matrix with probability values
function normalizeTrigramMatrix() {
    const normalized = JSON.parse(JSON.stringify(transitionMatrixTrigram));
    for (const lastMovePair in normalized) {
        const total = normalized[lastMovePair].reduce((a, b) => a + b, 0);
        if (total > 0) {
            normalized[lastMovePair] = transitionMatrixTrigram[lastMovePair].map(count => count / total);
        }
    }
    return normalized;
}

//normalizeBigramMatrix() - creates bigram matrix with probability values
function normalizeBigramMatrix() {
    const normalized = JSON.parse(JSON.stringify(transitionMatrixBigram));
    for (const lastMove in normalized) {
        const total = normalized[lastMove].reduce((a, b) => a + b, 0);
        if (total > 0) {
            normalized[lastMove] = transitionMatrixBigram[lastMove].map(count => count / total);
        }
    }
    return normalized;
}

//getHumanChoice() - determines player move based on button press event
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

//playGame() - gets choices and plays a round
function playGame(e) {
    const humanChoice = getHumanChoice(e);
    const computerChoice = getComputerChoice();

    if (isValidChoice(humanChoice)) {
        playRound(humanChoice, computerChoice);
    }
}

//playRound() - updates UI and determines the winner of a round
function playRound(humanChoice, computerChoice) {

    results.removeChild(results.lastChild);

    let roundResult = document.createElement("div");
    let humanChoiceText = document.createElement("p");
    let computerChoiceText = document.createElement("p");
    let choseFromText = document.createElement("p");
    let resultText = document.createElement("p");

    humanChoiceText.textContent = ("You chose: " + choiceString(humanChoice));
    computerChoiceText.textContent = ("Computer chooses: " + choiceString(computerChoice));
    choseFromText.textContent = choseFromString();

    switch (humanChoice) {
        case 'R':
            switch (computerChoice) {
                case 'R':
                    resultText.textContent = ("You both picked rock. Try again.");
                    draws++;
                    break;
                case 'P':
                    resultText.textContent = ("Paper beats rock. You lose.");
                    round++;
                    computerScore++;
                    break;
                case 'S':
                    resultText.textContent = ("Rock beats scissors. You win.");
                    round++;
                    humanScore++;
                    break;
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
    roundResult.appendChild(choseFromText);
    roundResult.appendChild(resultText);
    results.appendChild(roundResult);

    updateTransitionMatrices(humanChoice);
}

// -------- String Functions --------

function choseFromString() {
    switch(choseFrom) {
        case 0:
            return "Computer chose this option randomly.";
        case 1:
            return "Computer chose this option from the bigram transition matrix";
        case 2:
            return "Computer chose this option from the trigram transition matrix";
        default:
            return "error";
    }
}
function scoreString() {
    return ("You: " + humanScore + ", Computer: " + computerScore + ", Draws: " + draws);
}
function choiceString(choice) {
    switch (choice) {
        case 'R':
            return "rock";
        case 'P':
            return "paper";
        case 'S':
            return "scissors";
        default:
            return "error";
    }
}

const buttons = document.querySelector("#buttons");
const results = document.querySelector("#results");
const currentRound = document.querySelector("#current-round");
currentRound.textContent = "Current Round: " + round;
const currentScore = document.querySelector("#current-score");
currentScore.textContent = scoreString();

const winner = document.createElement("p");

buttons.addEventListener("click", (e) => {playGame(e);});