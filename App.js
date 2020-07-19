'use strict';

function App() {
  const game = new Game;

  const betFormElement = document.querySelector('#bet-form');
  const startElement = document.querySelector('#start');
  const betMoneyElement = document.querySelector('#bet-money-value');
  const dealerElement = document.querySelector('#dealer');
  const playerElement = document.querySelector('#player');
  const playerMoneyElement = document.querySelector('#player-money')
  const infoElement = document.querySelector('#info');
  const hitElement = document.querySelector('#hit');
  const standElement = document.querySelector('#stand');

  let gameStart = false;
  let playerTurn = false;

  betFormElement.addEventListener(('submit'), (event) => {
    event.preventDefault();
    const betMoney = Number(betMoneyElement.value);
    if (!gameStart){
      game.start();
      gameStart = true;
    }
    game.dealt(betMoney);
    dealerElement.innerHTML = game.dealer.openCard();
    playerElement.innerHTML = `プレイヤー ${game.player.getTextPoint()}：${game.player.allHand()}`;
    infoElement.innerHTML = `貴方の現在の得点は${game.player.getTextPoint()}です。<br>ヒットかスタンドを選んでください。`
    
    playerTurn = true;
  });

  hitElement.addEventListener(('click'), () => {
    if (playerTurn) {
      game.hit();
      playerElement.innerHTML = `プレイヤー ${game.player.getTextPoint()}：${game.player.allHand()}`;
      infoElement.innerHTML = `貴方の現在の得点は${game.player.getTextPoint()}です。<br>ヒットかスタンドを選んでください。`
      if (game.player.getPoint() > 21) {
        infoElement.innerHTML = game.judgeDealerTurn();
        playerMoneyElement.innerHTML = `軍資金：$${game.player.myMoney.myMoney}`
        playerTurn = false;
      }
    }
  });

  standElement.addEventListener(('click'), () => {
    if (playerTurn) {
      game.stand();
      dealerElement.innerHTML = `ディーラー ${game.dealer.getTextPoint()}：${game.dealer.allHand()}`;
      infoElement.innerHTML = game.judgeDealerTurn();
      playerMoneyElement.innerHTML = `軍資金：$${game.player.myMoney.myMoney}`;
      playerTurn = false;
    }
  });

}

class Game {
  start() {
    this.player = new Player(1000);
    this.dealer = new Dealer;
  }

  dealt(betMoney) {
    this.deck = new Deck;
    this.resetHand();
    this.player.myMoney.bet(betMoney);
    this.player.addCard(this.deck.getCard());
    this.player.addCard(this.deck.getCard());
    this.dealer.addCard(this.deck.getCard());
    this.dealer.addCard(this.deck.getCard());
  }

  hit() {
    this.player.addCard(this.deck.getCard());
  }

  stand() {
    // ソフト17はヒット
    while (this.dealt.point < 17 || this.dealer.includeAcePoint <= 17) {
      this.dealer.addCard(this.deck.getCard());
    }
  }

  judgeDealerTurn() {
    switch (true) {
      case (this.player.getPoint() > 21):
        this.player.myMoney.minusMoney();
        return 'プレイヤーの負け';
      case (this.dealer.getPoint() > 21):
        this.player.myMoney.plusMoney();
        return 'プレイヤーの勝ち';
      case (this.player.getPoint() > this.dealer.getPoint()):
        this.player.myMoney.plusMoney();
        return 'プレイヤーの勝ち';
      case (this.player.getPoint() < this.dealer.getPoint()):
        this.player.myMoney.minusMoney();
        return 'プレイヤーの負け';
      default:
        return '引き分け';
    }
  }

  resetHand() {
    this.player.resetHand();
    this.dealer.resetHand();
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
    return this.replaceSuitNumber(this._cardValue);
  }

  set cardValue(card) {
    this._cardValue = card;
  }

  cardPoint() {
    let point = 0;
    if (this._cardValue[1] > 10) {
      point = 10;
    } else {
      point = this._cardValue[1];
    }
    return point;
  }

  /**
   * 配列で格納されているカードを文字列に整形する
   * @param {Array} card 例:['C',1]
   * @return {string} 例:♠A
   */
  replaceSuitNumber(card) {
    const suit = card[0]
                .replace('C', '\u{2663}')
                .replace('D', '\u{2662}')
                .replace('H', '\u{2661}')
                .replace('S', '\u{2660}');
    card[1] = card[1].toString();
    const number = card[1]
                  .replace(/^1$/, 'A')
                  .replace('11', 'J')
                  .replace('12', 'Q')
                  .replace('13', 'K');
    return suit + number;
  }
}

class Money {
  constructor(money) {
    this.myMoney = money;
    this.betMoney = 0;
  }

  plusMoney() {
    this.myMoney += this.betMoney;
  }

  minusMoney() {
    this.myMoney -= this.betMoney;
  }

  bet(money) {
    this.betMoney = money;
  }
}

class PlayerBase {
  constructor() {
    this.hand = [];
    this.point = 0;
    this.includeAcePoint = 0;
  }

  addCard(card) {
    this.hand.push(card);
    this.point += card.cardPoint();
    if (card.cardPoint() === 1) {
      this.includeAcePoint += 11
    } else {
      this.includeAcePoint += card.cardPoint();
    }
  }

  allHand() {
    let allString = '';
    this.hand.forEach(card => {
      allString += card.cardValue;
    });
    return allString;
  }

  getTextPoint() {
    let pointText = '';
    if (this.point === this.includeAcePoint || this.includeAcePoint > 21) {
      pointText = `${this.point}点`
    } else {
      pointText = `${this.includeAcePoint}点 ${this.point}点`
    }
    return pointText;
  }

  getPoint() {
    if (this.includeAcePoint <= 21) {
      return this.includeAcePoint;
    } else {
      return this.point;
    }
  }

  resetHand() {
    this.hand = [];
    this.point = 0;
    this.includeAcePoint = 0;
  }
}

class Player extends PlayerBase {
  constructor(money) {
    super();
    this.myMoney = new Money(money);
  }
}

class Dealer extends PlayerBase{
  openCard() {
    let point = 0
    if (this.hand[0].cardPoint() === 1) {
      point = 11;
    } else {
      point = this.hand[0].cardPoint();
    }
    return `ディーラー${point}点：${this.hand[0].cardValue} (1枚目のカード)`;
  }
}


App();