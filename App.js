'use strict';

function App() {
  const app = new Game;
  app.dealt();
}

class Game {
  constructor() {
    this.deck = new Deck;
    this.player = new Player;
    this.dealer = new Dealer;
  }

  dealt() {
    this.player.hand.push(this.deck.getCard());
    this.player.hand.push(this.deck.getCard());
    this.dealer.hand.push(this.deck.getCard());
    this.dealer.hand.push(this.deck.getCard());
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
    return card;
  }
}

class Player {
  constructor() {
    this.hand = [];
  }
}

class Dealer {
  constructor() {
    this.hand = [];
  }
}


App();