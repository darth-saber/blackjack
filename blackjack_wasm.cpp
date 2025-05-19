#include <vector>
#include <algorithm>
#include <random>
#include <emscripten.h>

using namespace std;

extern "C" {

static vector<char> deck;
static vector<char> playerHand;
static vector<char> dealerHand;
static bool playerTurn;
static bool gameOver;

int getCardValue(char card) {
    if (card >= '2' && card <= '9') return card - '0';
    if (card == 'A') return 11;
    return 10; // J, Q, K, T
}

int calculateScore(const vector<char>& hand) {
    int score = 0;
    int aceCount = 0;
    for (char card : hand) {
        score += getCardValue(card);
        if (card == 'A') aceCount++;
    }
    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }
    return score;
}

void shuffleDeck() {
    deck = {'2','3','4','5','6','7','8','9','T','J','Q','K','A',
            '2','3','4','5','6','7','8','9','T','J','Q','K','A',
            '2','3','4','5','6','7','8','9','T','J','Q','K','A',
            '2','3','4','5','6','7','8','9','T','J','Q','K','A'};
    std::random_device rd;
    std::mt19937 g(rd());
    std::shuffle(deck.begin(), deck.end(), g);
}

EMSCRIPTEN_KEEPALIVE
void startGame() {
    gameOver = false;
    playerTurn = true;
    playerHand.clear();
    dealerHand.clear();
    shuffleDeck();

    playerHand.push_back(deck.back()); deck.pop_back();
    dealerHand.push_back(deck.back()); deck.pop_back();
    playerHand.push_back(deck.back()); deck.pop_back();
    dealerHand.push_back(deck.back()); deck.pop_back();
}

EMSCRIPTEN_KEEPALIVE
int getPlayerHandSize() {
    return playerHand.size();
}

EMSCRIPTEN_KEEPALIVE
int getDealerHandSize() {
    return dealerHand.size();
}

EMSCRIPTEN_KEEPALIVE
char getPlayerCard(int index) {
    if (index < 0 || index >= (int)playerHand.size()) return 0;
    return playerHand[index];
}

EMSCRIPTEN_KEEPALIVE
char getDealerCard(int index) {
    if (index < 0 || index >= (int)dealerHand.size()) return 0;
    return dealerHand[index];
}

EMSCRIPTEN_KEEPALIVE
int getPlayerScore() {
    return calculateScore(playerHand);
}

EMSCRIPTEN_KEEPALIVE
int getDealerScore() {
    return calculateScore(dealerHand);
}

EMSCRIPTEN_KEEPALIVE
bool isGameOver() {
    return gameOver;
}

EMSCRIPTEN_KEEPALIVE
bool isPlayerTurn() {
    return playerTurn;
}

EMSCRIPTEN_KEEPALIVE
void playerHit() {
    if (!gameOver && playerTurn) {
        playerHand.push_back(deck.back());
        deck.pop_back();
        if (calculateScore(playerHand) > 21) {
            gameOver = true;
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void playerStand() {
    if (!gameOver && playerTurn) {
        playerTurn = false;
        while (calculateScore(dealerHand) < 17) {
            dealerHand.push_back(deck.back());
            deck.pop_back();
        }
        int playerScore = calculateScore(playerHand);
        int dealerScore = calculateScore(dealerHand);
        if (dealerScore > 21 || playerScore > dealerScore) {
            // player wins
        } else if (dealerScore > playerScore) {
            // dealer wins
        } else {
            // tie
        }
        gameOver = true;
    }
}

EMSCRIPTEN_KEEPALIVE
int getResult() {
    // 0 = ongoing, 1 = player wins, 2 = dealer wins, 3 = tie
    if (!gameOver) return 0;
    int playerScore = calculateScore(playerHand);
    int dealerScore = calculateScore(dealerHand);
    if (playerScore > 21) return 2; // player busts, dealer wins
    if (dealerScore > 21) return 1; // dealer busts, player wins
    if (playerScore > dealerScore) return 1;
    if (dealerScore > playerScore) return 2;
    return 3;
}

} // extern "C"
