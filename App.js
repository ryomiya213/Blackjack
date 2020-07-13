'use strict';

function App() {
  const game = new Game;

  const startElement = document.querySelector('#start');
  const dealerElement = document.querySelector('#dealer');
  const playerElement = document.querySelector('#player');
  const infoElement = document.querySelector('#info');
  const hitElement = document.querySelector('#hit');
  const standElement = document.querySelector('#stand');

  startElement.addEventListener(('click'), () => {
    console.log('s')
    game.dealt();
    dealerElement.innerHTML = `ディーラー：${game.dealer.hand}点数${game.dealer.point}`;
    playerElement.innerHTML = `プレイヤー：${game.player.hand}点数${game.player.point}`;
  });
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
  }

  hit() {
    this.player.addCard(this.deck.getCard());
  }

  stand() {
    while (this.dealer.point < 17) {
      this.dealer.addCard(this.deck.getCard());
    }

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

}

class Dealer {
  constructor() {
    this.hand = [];
    this.point = 0;
  }

  addCard(card) {
    this.hand.push(card);
    this.point += card[1];
  }

  openCard() {
    return this.hand[0];
  }
}


App();