'use strict';

function App() {
  const game = new Game;

  const startElement = document.querySelector('#start');
  const dealerElement = document.querySelector('#dealer');
  const playerElement = document.querySelector('#player');
  const infoElement = document.querySelector('#info');
  const hitElement = document.querySelector('#hit');
  const standElement = document.querySelector('#stand');

  let playerTurn = false;

  startElement.addEventListener(('click'), () => {
    game.start();
    game.dealt();
    dealerElement.innerHTML = `ディーラー ${game.dealer.point}点：1枚目のカード${game.dealer.openCard()}`;
    playerElement.innerHTML = `プレイヤー ${game.player.point}点：${game.player.allHand()}`;
    infoElement.innerHTML = `貴方の現在の得点は${game.player.point}です。<br>ヒットかスタンドを選んでください。`
    playerTurn = true;
  });

  hitElement.addEventListener(('click'), () => {
    if (playerTurn) {
      game.hit();
      playerElement.innerHTML = `プレイヤー：${game.player.allHand()}得点${game.player.point}`;
      infoElement.innerHTML = `貴方の現在の得点は${game.player.point}です。<br>ヒットかスタンドを選んでください。`
      if (game.player.point > 21) {
        infoElement.innerHTML = 'プレイヤーの負け';
        playerTurn = false;
      }
    }
  });

  standElement.addEventListener(('click'), () => {
    if (playerTurn) {
      game.stand();
      dealerElement.innerHTML = `ディーラー ${game.dealer.point}点：${game.dealer.allHand()}`;
      infoElement.innerHTML = game.judgeDealerTurn();
      playerTurn = false;
    }
  });

}

class Game {
  start() {
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

  judgeDealerTurn() {
    if (this.dealer.point > 21) {
      return 'プレイヤーの勝ち';
    }

    if (this.player.point > this.dealer.point) {
      return 'プレイヤーの勝ち';
    } else if (this.player.point < this.dealer.point) {
      return 'プレイヤーの負け';
    } else {
      return '引き分け';
    }
  }

}

class Deck {
  constructor() {
    this.cards = [];
    const suit = ['S','C','D','H'];
    for (let i = 1; i <= 13; i++) {
      suit.forEach(suit => {
        const card = new Card(suit, i);
        this.cards.push(card);
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

class Card {
  constructor(suit, number) {
    this._cardValue = [suit, number];
  }

  get cardValue() {
    return this.replaceSuit(this._cardValue);
  }

  set cardValue(card) {
    this._cardValue = card;
  }

  cardPoint() {
    return this._cardValue[1];
  }

  replaceSuit(card) {
    const suit = card[0]
                .replace('C', '\u{2663}')
                .replace('D', '\u{2662}')
                .replace('H', '\u{2661}')
                .replace('S', '\u{2660}');
    return suit + card[1];
  }
}

class Player {
  constructor() {
    this.hand = [];
    this.point = 0;
  }

  addCard(card) {
    this.hand.push(card);
    this.point += card.cardPoint();
  }

  allHand() {
    let allString = '';
    this.hand.forEach(card => {
      allString += card.cardValue;
    });
    return allString;
  }

}

class Dealer {
  constructor() {
    this.hand = [];
    this.point = 0;
  }

  addCard(card) {
    this.hand.push(card);
    this.point += card.cardPoint();
  }

  allHand() {
    let allString = '';
    this.hand.forEach(card => {
      allString += card.cardValue;
    });
    return allString;
  }

  openCard() {
    return this.hand[0].cardValue;
  }
}


App();