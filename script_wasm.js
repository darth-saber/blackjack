let blackjackModule;

function cwrap(name, returnType, argTypes) {
    return blackjackModule.cwrap(name, returnType, argTypes);
}

let startGame, getPlayerHandSize, getDealerHandSize, getPlayerCard, getDealerCard;
let getPlayerScore, getDealerScore, isGameOver, isPlayerTurn, playerHit, playerStand, getResult;

function renderHand(hand, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    hand.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.textContent = card;
        container.appendChild(cardDiv);
    });
}

function updateScores() {
    document.getElementById('player-score').textContent = getPlayerScore();
    document.getElementById('dealer-score').textContent = getDealerScore();
}

function updateUI() {
    const playerHand = [];
    const dealerHand = [];
    const playerHandSize = getPlayerHandSize();
    const dealerHandSize = getDealerHandSize();

    for (let i = 0; i < playerHandSize; i++) {
        playerHand.push(String.fromCharCode(getPlayerCard(i)));
    }
    for (let i = 0; i < dealerHandSize; i++) {
        dealerHand.push(String.fromCharCode(getDealerCard(i)));
    }

    renderHand(playerHand, 'player-cards');
    renderHand(dealerHand, 'dealer-cards');
    updateScores();

    if (isGameOver()) {
        const result = getResult();
        let message = '';
        switch (result) {
            case 1:
                message = 'Player wins!';
                break;
            case 2:
                message = 'Dealer wins!';
                break;
            case 3:
                message = "It's a tie!";
                break;
            default:
                message = '';
        }
        endGame(message);
    }
}

function startNewGame() {
    startGame();
    document.getElementById('result').textContent = '';
    document.getElementById('hit-btn').style.display = 'inline-block';
    document.getElementById('stand-btn').style.display = 'inline-block';
    document.getElementById('restart-btn').style.display = 'none';
    updateUI();
}

function endGame(message) {
    document.getElementById('result').textContent = message;
    document.getElementById('hit-btn').style.display = 'none';
    document.getElementById('stand-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'inline-block';
}

function onHit() {
    if (!isGameOver() && isPlayerTurn()) {
        playerHit();
        updateUI();
    }
}

function onStand() {
    if (!isGameOver() && isPlayerTurn()) {
        playerStand();
        updateUI();
    }
}

document.getElementById('hit-btn').addEventListener('click', onHit);
document.getElementById('stand-btn').addEventListener('click', onStand);
document.getElementById('restart-btn').addEventListener('click', startNewGame);

createBlackjackModule().then(Module => {
    blackjackModule = Module;
    startGame = cwrap('startGame', null, []);
    getPlayerHandSize = cwrap('getPlayerHandSize', 'number', []);
    getDealerHandSize = cwrap('getDealerHandSize', 'number', []);
    getPlayerCard = cwrap('getPlayerCard', 'number', ['number']);
    getDealerCard = cwrap('getDealerCard', 'number', ['number']);
    getPlayerScore = cwrap('getPlayerScore', 'number', []);
    getDealerScore = cwrap('getDealerScore', 'number', []);
    isGameOver = cwrap('isGameOver', 'boolean', []);
    isPlayerTurn = cwrap('isPlayerTurn', 'boolean', []);
    playerHit = cwrap('playerHit', null, []);
    playerStand = cwrap('playerStand', null, []);
    getResult = cwrap('getResult', 'number', []);

    startNewGame();
});
