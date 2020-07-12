'use strict';

function App() {
  const app = new Game;
  console.log('ディーラーの1枚目のカード',app.dealt());
  app.draw();
  console.log(app.player.hand,app.player.point);
}

class Game {
  constructor() {
    this.deck = new Deck;
    this.player = new Player;
    this.dealer = new Dealer;
  }

  dealt() {
    this.player.addCard(this.deck.getCard());
    this.player.addCard(this.deck.getCard());
    this.dealer.addCard(this.deck.getCard());
    this.dealer.addCard(this.deck.getCard());
    return this.dealer.openCard();
  }

  draw() {
    this.player.addCard(this.deck.getCard());
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
    this.point = 0;
  }

  addCard(card) {
    this.hand.push(card);
    this.point += card[1];
  }


  judge() {
    //todo
  }
}

class Dealer {
  constructor() {
    this.hand = [];
  }

  addCard(card) {
    this.hand.push(card);
  }

  openCard() {
    return this.hand[0];
  }
}


App();