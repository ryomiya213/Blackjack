'use strict';

function App() {
  const app = new Game;
}

class Game {
  constructor() {
    this.deck = new Deck();
    this.deck.getCard();
  }
}

class Deck {
  constructor() {
    this.cards = [];
    const suit = ['S','C','D','H'];
    for (let i = 1; i <= 13; i++) {
      suit.forEach(suit => {
        this.cards.push([suit, i]);
      })
    }
  }

  getCard() {
    const randomNumber = Math.floor(this.cards.length * Math.random());
    const card = this.cards[randomNumber];
    this.cards.splice(randomNumber,1);
    console.log(card,this.cards);
  }
}

class Player {

}

class Dealer {

}


App();