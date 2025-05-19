const deckValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;
let playerTurn = true;

function createDeck() {
    deck = [];
    for (let i = 0; i < 4; i++) {
        deck = deck.concat(deckValues);
    }
    shuffleDeck();
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    if (card >= '2' && card <= '9') return parseInt(card);
    if (card === 'A') return 11;
    return 10; // T, J, Q, K
}

function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;
    for (const card of hand) {
        score += getCardValue(card);
        if (card === 'A') aceCount++;
    }
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }
    return score;
}

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
    document.getElementById('player-score').textContent = calculateScore(playerHand);
    document.getElementById('dealer-score').textContent = calculateScore(dealerHand);
}

function startGame() {
    gameOver = false;
    playerTurn = true;
    playerHand = [];
    dealerHand = [];
    createDeck();

    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());
    playerHand.push(deck.pop());
    dealerHand.push(deck.pop());

    renderHand(playerHand, 'player-cards');
    renderHand(dealerHand, 'dealer-cards');
    updateScores();
    document.getElementById('result').textContent = '';
    document.getElementById('hit-btn').style.display = 'inline-block';
    document.getElementById('stand-btn').style.display = 'inline-block';
    document.getElementById('restart-btn').style.display = 'none';
}

function endGame(message) {
    gameOver = true;
    document.getElementById('result').textContent = message;
    document.getElementById('hit-btn').style.display = 'none';
    document.getElementById('stand-btn').style.display = 'none';
    document.getElementById('restart-btn').style.display = 'inline-block';
}

function playerHit() {
    if (!gameOver && playerTurn) {
        playerHand.push(deck.pop());
        renderHand(playerHand, 'player-cards');
        updateScores();
        if (calculateScore(playerHand) > 21) {
            endGame('Player busts! Dealer wins.');
        }
    }
}

function dealerTurn() {
    playerTurn = false;
    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(deck.pop());
        renderHand(dealerHand, 'dealer-cards');
        updateScores();
    }
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);
    if (dealerScore > 21 || playerScore > dealerScore) {
        endGame('Player wins!');
    } else if (dealerScore > playerScore) {
        endGame('Dealer wins!');
    } else {
        endGame("It's a tie!");
    }
}

document.getElementById('hit-btn').addEventListener('click', playerHit);
document.getElementById('stand-btn').addEventListener('click', dealerTurn);
document.getElementById('restart-btn').addEventListener('click', startGame);

startGame();
