let deck_id = "";

document.onload = fetchHand();

function fetchHand() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        deck_id = data.deck_id;
    })
}


function getHand() {
     fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=5`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Display the cards on the webpage
        displayCards(data.cards);
        // Determine the best hand
        let bestHand = determineBestHand(data.cards);
        console.log('Best Hand:', bestHand);
        displayBestHandResult(bestHand);

    })
    .catch(error => console.error('Error fetching data:', error)); // Handling errors
}
// Display the cards on the webpage
function displayCards(cards) {
    let cardHTML = cards.map(card => `<img src="${card.image}" alt="${card.value} of ${card.suit}">`);
    document.getElementById('cards').innerHTML = cardHTML.join('');
}

function determineBestHand(cards) {
    // Sort the cards by value
    cards.sort((a, b) => getValue(a.value) - getValue(b.value));

    // Check for different hands in decreasing order of strength
    if (isRoyalFlush(cards)) {
        return "Royal Flush";
    } else if (isStraightFlush(cards)) {
        return "Straight Flush";
    } else if (isFourOfAKind(cards)) {
        return "Four of a Kind";
    } else if (isFullHouse(cards)) {
        return "Full House";
    } else if (isFlush(cards)) {
        return "Flush";
    } else if (isStraight(cards)) {
        return "Straight";
    } else if (isThreeOfAKind(cards)) {
        return "Three of a Kind";
    } else if (isTwoPair(cards)) {
        return "Two Pair";
    } else if (isOnePair(cards)) {
        return "One Pair";
    } else {
        return "High Card";
    }
}

function isRoyalFlush(cards) {

    const royalFlushCodes = new Set(['10', 'JACK', 'QUEEN', 'KING', 'ACE']);
    const suit = cards[0].suit;

    for (let card of cards) {
        if (!royalFlushCodes.has(card.value) || card.suit !== suit) {
            return false;
        }
    }
    return true;
}

function isStraightFlush(cards) {
    // Check if the cards form a Straight Flush
    return isStraight(cards) && isFlush(cards);
}

function isFullHouse(cards) {
    const valueCounts = {};
    cards.forEach(card => {
        valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    });

    // Check if there is a Three of a Kind and a Pair
    return Object.values(valueCounts).includes(3) && Object.values(valueCounts).includes(2);
}

function isFourOfAKind(cards) {
    const valueCounts = {}; // Object to count occurrences of each card value
    cards.forEach(card => {
        valueCounts[card.value] = (valueCounts[card.value] || 0) + 1; // Count occurrences of each value
    });

    // Check if any card value occurs four times
    return Object.values(valueCounts).includes(4);
}
function isFlush(cards) {
    const firstSuit = cards[0].suit;
    let isFlush = true;
    cards.forEach(card => {
        if (card.suit !== firstSuit) {
            isFlush = false;
        }
    });
    return isFlush;
}
function isStraight(cards) {
    // Check if the cards form a Straight
    let values = [];
    for (let i = 0; i < cards.length; i++) {
        values.push(getValue(cards[i].value));
    }
    values.sort((a, b) => a - b);
    for (let i = 0; i < values.length - 1; i++) {
        if (values[i + 1] - values[i] !== 1) {
            return false;
        }
    }
    return true;
}
function isThreeOfAKind(cards) {
    const valueCounts = {};
    cards.forEach(card => {
        valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    });
    return Object.values(valueCounts).includes(3);
}

function isTwoPair(cards) {
    const valueCounts = {};
    cards.forEach(card => {
        valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    });
    return Object.values(valueCounts).filter(count => count === 2).length === 2;
}

function isOnePair(cards) {
    const valueCounts = {};
    cards.forEach(card => {
        valueCounts[card.value] = (valueCounts[card.value] || 0) + 1;
    });
    return Object.values(valueCounts).includes(2);
}

function getValue(value) {
    // Convert face cards and strings to numbers
    switch (value) {
        case 'JACK':
            return 11;
        case 'QUEEN':
            return 12;
        case 'KING':
            return 13;
        case 'ACE':
            return 14;
        default:
            return parseInt(value);
    }
}

function displayBestHandResult(bestHand) {
    // Display the result text on the page
    document.getElementById('bestHandResult').innerText = "You have a " + bestHand + "!";
}