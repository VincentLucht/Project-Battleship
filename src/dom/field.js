const Ship = require('../js/ship');
// const Player = require('../js/player');
// const Gameboard = require('../js/gameboard');

class GUI {
  constructor(player1, player2, field1, field2, turnBoard) {
    this.player1 = player1;
    this.player2 = player2;
    this.field1 = field1;
    this.field2 = field2;
    this.turnBoard = turnBoard;
    this.player1Turn = true;
    this.player2Turn = false;
    // using 'this' does not work without binding here, it will return undefined otherwise
    this.clickHandler = this.clickHandler.bind(this);
  }

  placeDefaultShips(player) {
    // places 5 ships at the default location
    player.gameboard.placeShip(new Ship(5), [1, 1]);
    player.gameboard.placeShip(new Ship(4), [5, 3], 'vertical');
    player.gameboard.placeShip(new Ship(3), [7, 7], 'vertical');
    player.gameboard.placeShip(new Ship(2), [3, 4]);
    player.gameboard.placeShip(new Ship(2), [0, 8]);
  }

  createField(player, field) {
    // creates the 10x10 square gameboard
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const div = document.createElement('div');
        if (typeof (player.gameboard.field[i][j]) === 'object') {
          div.textContent = '•';
        }
        else if (player.gameboard.field[i][j] === 'hit') {
          div.textContent = 'x'; // change to a red x?
        }
        else if (player.gameboard.field[i][j] === 'miss') {
          div.textContent = 'x'; // user other x, so that it centers!
        }
        else {
          div.textContent = player.gameboard.field[i][j];
        }
        div.setAttribute('coords', `${i},${j}`);
        div.classList.add('unselectable');
        field.appendChild(div);
      }
    }
  }

  removeField(field) {
    while (field.firstChild) {
      field.removeChild(field.firstChild);
    }
  }

  displayField() {
    // create the field
    this.createField(this.player1, this.field1);
    this.createField(this.player2, this.field2);

    // display the turn
    this.displayTurn();

    if (this.player1Turn === true) {
      this.field1.addEventListener('click', this.clickHandler); // add an event listener to each square of the parent div
    }
  }

  clickHandler(event) {
    const clickedElement = event.target;

    // if it is player1's turn, then add an event listener, remove player2's event listener
    if (this.player1Turn === true) {
      if (clickedElement.classList.contains('unselectable')) {
        // put coords here, can otherwise click on background div accidentally, resulting in null
        const coordsRaw = clickedElement.getAttribute('coords');
        const coords = coordsRaw.split(',');

        // check if placement is allowed first, DISALLOW IF INVALID!
        if (this.player1.gameboard.receiveAttack(coords) !== 'Success') {
          console.log(this.player1.gameboard.receiveAttack(coords));
        } else {
          // disable player1 EL and set to false
          this.field1.removeEventListener('click', this.clickHandler);
          this.player1Turn = false;

          // enable player2 EL and set to true
          this.field2.addEventListener('click', this.clickHandler);
          this.player2Turn = true;

          // refresh screen
          this.removeField(this.field1);
          this.createField(this.player1, this.field1);
        }
      }
    }

    // if it is player2's turn, then add an event listener, remove player1's event listener
    else if (this.player2Turn === true) {
      if (clickedElement.classList.contains('unselectable')) {
        const coordsRaw = clickedElement.getAttribute('coords');
        const coords = coordsRaw.split(',');

        // disable player2 EL and set to false
        this.field2.removeEventListener('click', this.clickHandler);
        this.player2Turn = false;

        // enable player1 EL and set to true
        this.field1.addEventListener('click', this.clickHandler);
        this.player1Turn = true;
      }
    }
  }

  removeTurn() {
    while (this.turnBoard.firstChild) {
      this.turnBoard.removeChild(this.turnBoard.firstChild);
    }
  }

  displayTurn() {
    // if player one's turn
    if (this.player1Turn === true) {
      // make player2 field brighter
      // make player1 field darker
      // change text content to "Turn: Player 1"
      this.turnBoard.textContent = 'Turn: Player 1';
    }
    else {
      this.turnBoard.textContent = 'Turn: Player 2';
    }
  }
}

export default GUI;