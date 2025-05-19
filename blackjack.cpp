#include <iostream>
#include <vector>
#include <algorithm>
#include <ctime>
#include <cstdlib>
#include <random>

using namespace std;

int getCardValue(char card) {
    if (card >= '2' && card <= '9') return card - '0';
    if (card == 'A') return 11;
    return 10; // J, Q, K
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

void printHand(const vector<char>& hand, const string &name) {
    cout << name << "'s hand: ";
    for (char card : hand) {
        cout << card << " ";
    }
    cout << endl;
}

int main() {
    srand(time(0));
    vector<char> deck = {'2','3','4','5','6','7','8','9','T','J','Q','K','A',
                        '2','3','4','5','6','7','8','9','T','J','Q','K','A',
                        '2','3','4','5','6','7','8','9','T','J','Q','K','A',
                        '2','3','4','5','6','7','8','9','T','J','Q','K','A'};
    std::random_device rd;
    std::mt19937 g(rd());
    std::shuffle(deck.begin(), deck.end(), g);

    vector<char> playerHand;
    vector<char> dealerHand;

    playerHand.push_back(deck.back()); deck.pop_back();
    dealerHand.push_back(deck.back()); deck.pop_back();
    playerHand.push_back(deck.back()); deck.pop_back();
    dealerHand.push_back(deck.back()); deck.pop_back();

    bool playerTurn = true;
    bool gameOver = false;

    while (!gameOver) {
        printHand(playerHand, "Player");
        cout << "Player score: " << calculateScore(playerHand) << endl;
        printHand(dealerHand, "Dealer");
        cout << "Dealer score: " << calculateScore(dealerHand) << endl;

        if (calculateScore(playerHand) > 21) {
            cout << "Player busts! Dealer wins." << endl;
            break;
        }

        if (playerTurn) {
            cout << "Hit or stand? (h/s): ";
            char choice;
            cin >> choice;
            if (choice == 'h') {
                playerHand.push_back(deck.back());
                deck.pop_back();
            } else {
                playerTurn = false;
            }
        } else {
            if (calculateScore(dealerHand) < 17) {
                dealerHand.push_back(deck.back());
                deck.pop_back();
            } else {
                int playerScore = calculateScore(playerHand);
                int dealerScore = calculateScore(dealerHand);
                if (dealerScore > 21 || playerScore > dealerScore) {
                    cout << "Player wins!" << endl;
                } else if (dealerScore > playerScore) {
                    cout << "Dealer wins!" << endl;
                } else {
                    cout << "It's a tie!" << endl;
                }
                gameOver = true;
            }
        }
    }

    return 0;
}
