'use strict';

function App() {
  const game = new Game;

  const betFormElement = document.querySelector('#bet-form');
  const betMoneyElement = document.querySelector('#bet-money-value');
  const dealerElement = document.querySelector('#dealer');
  const playerElement = document.querySelector('#player');
  const playerMoneyElement = document.querySelector('#player-money')
  const infoElement = document.querySelector('#info');
  const startElement = document.querySelector('#start');
  const hitElement = document.querySelector('#hit');
  const standElement = document.querySelector('#stand');
  const DoubleDownElement = document.querySelector('#Double-Down');
  const splitElement = document.querySelector('#split');

  const splitBlockElement = document.querySelector('#split-block');
  const splitPlayerElement = document.querySelector('#split-player');
  const splitInfoElement = document.querySelector('#split-info');
  const splitHitElement = document.querySelector('#split-hit');
  const splitStandElement = document.querySelector('#split-stand');
  const splitDoubleDownElement = document.querySelector('#split-Double-Down');


  let gameStart = false;
  let playerTurn = false;

  betFormElement.addEventListener(('submit'), (event) => {
    event.preventDefault();
    const betMoney = Number(betMoneyElement.value);
    if (5 <= betMoney && betMoney <= 100) {
      if (!gameStart){
        game.start();
        gameStart = true;
        startElement.setAttribute('value', '次のゲームへ');
      }
      game.dealt(betMoney);
      // ブラックジャック
      updatePlayerElement();
      if (game.player.getPoint() === 21) {
        if (game.dealer.getPoint() === 21) {
          infoElement.innerHTML = `引き分け`
        } else {
          infoElement.innerHTML = `ブラックジャック！賭け金の1.5倍払い戻しします`
          game.player.myMoney.blackjack();
        }
        updateDealerElement();
        updatePlayerMoneyElement();
        enableNextGameButton();
        playerTurn = false;
      // 通常の動作
      } else {
        dealerElement.innerHTML = game.dealer.openCard();
        infoElement.innerHTML = `貴方の現在の得点は${game.player.getTextPoint()}です。`;
        enableButton(hitElement, standElement, DoubleDownElement);
        disableButton(startElement, betMoneyElement);
        playerTurn = true;
      }
  } else {
    infoElement.innerHTML = '1回あたりの賭け金は$5から$100までです。';
  }
  });

  hitElement.addEventListener(('click'), () => {
    if (playerTurn) {
      game.hit();
      infoElement.innerHTML = `貴方の現在の得点は${game.player.getTextPoint()}です。`;
      disableButton(DoubleDownElement);
      if (game.player.getPoint() > 21) {
        infoElement.innerHTML = game.judgeDealerTurn();
        updatePlayerMoneyElement();
        enableNextGameButton();
        playerTurn = false;
      }
      updatePlayerElement();
    }
  });

  standElement.addEventListener(('click'), () => {
    if (playerTurn) {
      game.stand();
      infoElement.innerHTML = game.judgeDealerTurn();
      updateDealerElement();
      updatePlayerElement();
      updatePlayerMoneyElement();
      enableNextGameButton();
      playerTurn = false;
    }
  });

  DoubleDownElement.addEventListener('click', () => {
    if (playerTurn) {
      game.doubleDown();
      infoElement.innerHTML = `ダブルダウン ${game.judgeDealerTurn()}`
      updateDealerElement();
      updatePlayerElement();
      updatePlayerMoneyElement();
      enableNextGameButton();
      playerTurn = false;
    }
  });

  splitElement.addEventListener('click', () => {
    if (playerTurn) {
      splitBlockElement.classList.remove('display-none');
      enableButton(splitHitElement, splitStandElement, splitDoubleDownElement);
    }
  });

  /**
   * buttonタグのdiabledを削除してボタンを活性化する
   * @param  {...HTMLElement} elements 
   */
  function enableButton(...elements) {
    elements.forEach(element => {
      element.removeAttribute('disabled');
    });
  }

  /**
   * buttonタグのdiabledを追加してボタンを非活性化する
   * @param  {...HTMLElement} elements 
   */
  function disableButton(...elements) {
    elements.forEach(element => {
      element.setAttribute('disabled', true);
    })
  }

  /**
   * 各種プレーボタンを非活性化して次のゲームへ
   */
  function enableNextGameButton() {
    enableButton(startElement, betMoneyElement);
    disableButton(hitElement, standElement, DoubleDownElement);
  }

  /**
   * playerElementの点数と手札を更新
   */
  function updatePlayerElement() {
    playerElement.innerHTML = `プレイヤー ${game.player.getTextPoint()}：${game.player.allHand()}`;
  }

  /**
   * dealerElementの点数と手札を更新
   */
  function updateDealerElement() {
    dealerElement.innerHTML = `ディーラー ${game.dealer.getTextPoint()}：${game.dealer.allHand()}`;
  }

  /**
   * playerMoneyElement 軍資金を更新
   */
  function updatePlayerMoneyElement() {
    playerMoneyElement.innerHTML = `軍資金：$${game.player.myMoney.myMoney}`;
  }
}

class Game {
  /**
   * PlayerとDealerを初期化
   * Playerの軍資金はリセットされる
   */
  start() {
    this.player = new Player(1000);
    this.dealer = new Dealer;
  }

  /**
   * ゲーム開始時にPlayerとDealerがそれぞれカードを2枚引いて、手札に加える
   * @param {Number} betMoney 賭ける金額
   */
  dealt(betMoney) {
    this.deck = new Deck;
    this.resetHand();
    this.player.myMoney.bet(betMoney);
    this.player.addCard(this.deck.getCard());
    this.player.addCard(this.deck.getCard());
    this.dealer.addCard(this.deck.getCard());
    this.dealer.addCard(this.deck.getCard());
  }

  /**
   * Playerがカードを1枚引く
   */
  hit() {
    this.player.addCard(this.deck.getCard());
  }

  /**
   * Dealerが17点以上になるまでカードを引く
   * ソフト17はヒット
   */
  stand() {
    while (this.dealt.point < 17 || this.dealer.includeAcePoint <= 17) {
      this.dealer.addCard(this.deck.getCard());
    }
  }

  doubleDown() {
    this.player.myMoney.betDobuleDown();
    this.hit();
    this.stand();
  }

  /**
   * PlayerとDealerのポイントを比較して結果を表示する
   * @return {String} 結果を文字列で返す
   */
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

  /**
   * PlayerとDealerの手札とポイントをリセットする
   */
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

  /**
   * カードをランダムに引く
   */
  getCard() {
    const randomNumber = Math.floor(this.cards.length * Math.random());
    const card = this.cards[randomNumber];
    this.cards.splice(randomNumber,1);
    return card;
  }
}

class Card {
  /**
   * カードのスートと数字を配列で保存し、文字出力できるようにする
   * @param {String} suit スート
   * @param {Number} number 数字
   */
  constructor(suit, number) {
    this._cardValue = [suit, number];
  }

  get cardValue() {
    return this.replaceSuitNumber(this._cardValue);
  }

  set cardValue(card) {
    this._cardValue = card;
  }

  /**
   * カードの点数を返す
   * @return {Number} カードの点数(Aは1点として扱う)
   */
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
  /**
   * 軍資金と賭け金の管理をする
   * @param {Number} myMoney 最初に持っている軍資金
   */
  constructor(myMoney) {
    this.myMoney = myMoney;
    this.betMoney = 0;
  }

  plusMoney() {
    this.myMoney += this.betMoney;
  }

  minusMoney() {
    this.myMoney -= this.betMoney;
  }

  blackjack() {
    this.myMoney += this.betMoney * 3 / 2;
  }

  betDobuleDown() {
    this.betMoney = this.betMoney * 2;
  }

  /**
   * 賭ける金額を保持する
   * @param {Number} money 賭け金
   */
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
    // 引いたカードがA && 今まで引いたカードにAが含まれていない
    if (card.cardPoint() === 1 && this.includeAcePoint === this.point) {
      this.includeAcePoint += 11
    } else {
      this.includeAcePoint += card.cardPoint();
    }
    this.point += card.cardPoint();
  }

  /**
   * 手札を文字列で出力
   * @return {String} 手札一覧
   */
  allHand() {
    let allString = '';
    this.hand.forEach(card => {
      allString += card.cardValue;
    });
    return allString;
  }

  /**
   * 現在の点数を返す
   * @return {String} 現在の点数。 Aを含み2パターンある場合は両方出力
   */
  getTextPoint() {
    let pointText = '';
    if (this.point === this.includeAcePoint || this.includeAcePoint > 21) {
      pointText = `${this.point}点`
    } else {
      pointText = `${this.includeAcePoint}点 ${this.point}点`
    }
    return pointText;
  }

  /**
   * 手札で21点に一番近い点数を返す
   * @return {Number} 現在の点数。 Aも考慮
   */
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
  /**
   * Dealerが2枚配られた手札のうち1枚を公開する
   * @retun {String} Dealerの手札を1枚公開
   */
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