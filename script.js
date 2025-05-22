const deckValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

let deck = [];
let players = [];
let currentPlayerIndex = 0;
let gameOver = false;

const playerTypes = {
    HUMAN: 'human',
    AI_EASY: 'ai_easy',
    AI_MEDIUM: 'ai_medium',
    AI_HARD: 'ai_hard',
};

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
    players.forEach(player => {
        const scoreElement = document.getElementById(`${player.id}-score`);
        scoreElement.textContent = calculateScore(player.hand);
    });
}

function startGame() {
    gameOver = false;
    currentPlayerIndex = 0;
    createDeck();

    players = [
        { id: 'player1', type: playerTypes.HUMAN, hand: [] },
        { id: 'player2', type: playerTypes.HUMAN, hand: [] },
        { id: 'ai1', type: playerTypes.AI_EASY, hand: [] },
        { id: 'ai2', type: playerTypes.AI_MEDIUM, hand: [] },
        { id: 'ai3', type: playerTypes.AI_HARD, hand: [] },
        { id: 'dealer', type: 'dealer', hand: [] },
    ];

    // Deal initial cards
    players.forEach(player => {
        player.hand = [];
        player.hand.push(deck.pop());
        player.hand.push(deck.pop());
    });

    renderAllHands();
    updateScores();
    updateControls();
    document.getElementById('result').textContent = '';
}

function renderAllHands() {
    players.forEach(player => {
        renderHand(player.hand, `${player.id}-cards`);
    });
}

function updateControls() {
    const currentPlayer = players[currentPlayerIndex];
    if (gameOver || currentPlayer.type === 'dealer') {
        document.getElementById('hit-btn').style.display = 'none';
        document.getElementById('stand-btn').style.display = 'none';
    } else if (currentPlayer.type === playerTypes.HUMAN) {
        document.getElementById('hit-btn').style.display = 'inline-block';
        document.getElementById('stand-btn').style.display = 'inline-block';
    } else {
        document.getElementById('hit-btn').style.display = 'none';
        document.getElementById('stand-btn').style.display = 'none';
    }
    document.getElementById('restart-btn').style.display = gameOver ? 'inline-block' : 'none';
}

function endGame(message) {
    gameOver = true;
    document.getElementById('result').textContent = message;
    updateControls();
}

function playerHit() {
    if (gameOver) return;
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer.type !== playerTypes.HUMAN) return;

    currentPlayer.hand.push(deck.pop());
    renderHand(currentPlayer.hand, `${currentPlayer.id}-cards`);
    updateScores();

    if (calculateScore(currentPlayer.hand) > 21) {
        nextPlayer();
    }
}

function playerStand() {
    if (gameOver) return;
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer.type !== playerTypes.HUMAN) return;

    nextPlayer();
}

function nextPlayer() {
    currentPlayerIndex++;
    if (currentPlayerIndex >= players.length) {
        dealerTurn();
        return;
    }
    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer.type === 'dealer') {
        dealerTurn();
    } else if (currentPlayer.type !== playerTypes.HUMAN) {
        aiTurn(currentPlayer);
    } else {
        updateControls();
    }
}

function aiTurn(player) {
    // Simple AI logic based on difficulty
    const score = calculateScore(player.hand);
    if (score >= 21) {
        nextPlayer();
        return;
    }

    let hit = false;
    switch (player.type) {
        case playerTypes.AI_EASY:
            hit = score < 15;
            break;
        case playerTypes.AI_MEDIUM:
            hit = score < 17;
            break;
        case playerTypes.AI_HARD:
            hit = score < 19;
            break;
    }

    if (hit) {
        player.hand.push(deck.pop());
        renderHand(player.hand, `${player.id}-cards`);
        updateScores();
        setTimeout(() => aiTurn(player), 1000);
    } else {
        nextPlayer();
    }
}

function dealerTurn() {
    const dealer = players.find(p => p.type === 'dealer');
    while (calculateScore(dealer.hand) < 17) {
        dealer.hand.push(deck.pop());
        renderHand(dealer.hand, `${dealer.id}-cards`);
        updateScores();
    }
    determineWinners();
}

function determineWinners() {
    const dealer = players.find(p => p.type === 'dealer');
    const dealerScore = calculateScore(dealer.hand);

    let results = [];
    players.forEach(player => {
        if (player.type === 'dealer') return;
        const score = calculateScore(player.hand);
        let result = '';
        if (score > 21) {
            result = 'Bust - Dealer wins';
        } else if (dealerScore > 21) {
            result = 'Player wins';
        } else if (score > dealerScore) {
            result = 'Player wins';
        } else if (score < dealerScore) {
            result = 'Dealer wins';
        } else {
            result = 'Tie';
        }
        results.push(`${player.id}: ${result}`);
    });

    document.getElementById('result').textContent = results.join(' | ');
    gameOver = true;
    updateControls();
}

document.getElementById('hit-btn').addEventListener('click', playerHit);
document.getElementById('stand-btn').addEventListener('click', playerStand);
document.getElementById('restart-btn').addEventListener('click', startGame);

startGame();
