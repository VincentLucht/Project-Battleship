const Ship = require('../js/ship');

class GUI {
  constructor(player1, player2, field1, field2, turnBoard) {
    this.player1 = player1;
    this.player2 = player2;
    this.field1 = field1;
    this.field2 = field2;
    this.turnBoard = turnBoard;
    this.player1Turn = true;
    this.player2Turn = false;
    this.gameOver = false;
    // using 'this' does not work without binding here, it will return undefined otherwise
    this.clickHandler = this.clickHandler.bind(this);
  }

  placeDefaultShips(player) {
    // places 5 ships at the default location
    player.gameboard.placeShip(new Ship(5), [0, 0]);
    player.gameboard.placeShip(new Ship(4), [5, 4], 'vertical');
    player.gameboard.placeShip(new Ship(3), [0, 9], 'vertical');
    player.gameboard.placeShip(new Ship(2), [3, 4]);
    player.gameboard.placeShip(new Ship(2), [9, 0]);
  }

  /* eslint-disable no-param-reassign */
  hitField(clickedElement) {
    clickedElement.textContent = '✕';
    clickedElement.style.backgroundColor = 'red';
    clickedElement.style.fontSize = '2rem';
  }

  missField(clickedElement) {
    clickedElement.textContent = '✕';
    clickedElement.style.fontSize = '1rem';
  }
  // eslint-enable no-param-reassign

  refreshSurroundingsFirst(row, col, parentDiv, gameboard, mode) {
    const revealFieldFirst = (rowOffset, colOffset) => {
      if (gameboard.field[rowOffset] && gameboard.field[rowOffset][colOffset] !== undefined) {
        const gameboardContent = gameboard.field[rowOffset][colOffset];
        const selectorCoords = `[coords="${rowOffset},${colOffset}"]`;
        const selectedDiv = parentDiv.querySelectorAll(selectorCoords);

        if (gameboardContent === '') {
          selectedDiv[0].textContent = '✕';
          selectedDiv[0].classList.add('hit-effect');
          setTimeout(() => {
            selectedDiv[0].classList.remove('hit-effect');
          }, 200);
        }
      }
    };

    if (mode === 'horizontal') {
      // left upper left
      revealFieldFirst(row - 1, col - 1);
      // left middle left
      revealFieldFirst(row, col - 1);
      // left bottom left
      revealFieldFirst(row + 1, col - 1);
    }

    else if (mode === 'vertical') {
      // upper left
      revealFieldFirst(row - 1, col - 1);
      // upper middle
      revealFieldFirst(row - 1, col);
      // upper right
      revealFieldFirst(row - 1, col + 1);
    }
  }

  refreshSurroundingsMiddle(row, col, parentDiv, gameboard, ship, mode) {
    const revealFieldMiddle = (rowOffset, colOffset) => {
      if (gameboard.field[rowOffset] && gameboard.field[rowOffset][colOffset] !== undefined) {
        const gameBoardContent = gameboard.field[rowOffset][colOffset];
        const selectorCoords = `[coords="${rowOffset},${colOffset}"]`;
        const selectedDiv = parentDiv.querySelectorAll(selectorCoords);

        if (gameBoardContent === '') {
          selectedDiv[0].textContent = '✕';
          selectedDiv[0].classList.add('hit-effect');
          setTimeout(() => {
            selectedDiv[0].classList.remove('hit-effect');
          }, 200);
        }
      }
    };

    if (mode === 'horizontal') {
      for (let i = 0; i < ship.length; i++) {
        // upper
        revealFieldMiddle(row - 1, col + i);
        // lower
        revealFieldMiddle(row + 1, col + i);
      }
    }

    else if (mode === 'vertical') {
      for (let i = 0; i < ship.length; i++) {
        // left
        revealFieldMiddle(row + i, col - 1);
        // right
        revealFieldMiddle(row + i, col + 1);
      }
    }
  }

  refreshSurroundingsLast(coordinates, parentDiv, gameboard, ship, mode) {
    const revealFieldLast = (rowOffset, colOffset) => {
      if (gameboard.field[rowOffset] && gameboard.field[rowOffset][colOffset] !== undefined) {
        const gameboardContent = gameboard.field[rowOffset][colOffset];
        const selectorCoords = `[coords="${rowOffset},${colOffset}"]`;
        const selectedDiv = parentDiv.querySelectorAll(selectorCoords);

        if (gameboardContent === '') {
          selectedDiv[0].textContent = '✕';
          selectedDiv[0].classList.add('hit-effect');
          setTimeout(() => {
            selectedDiv[0].classList.remove('hit-effect');
          }, 200);
        }
      }
    };

    if (mode === 'horizontal') {
      const endPoint = ship.length - 1;
      const row = coordinates[0];
      const col = coordinates[1] + endPoint;

      // right upper right
      revealFieldLast(row - 1, col + 1);
      // right middle right
      revealFieldLast(row, col + 1);
      // right bottom right
      revealFieldLast(row + 1, col + 1);
    }

    else if (mode === 'vertical') {
      const endPoint = ship.length - 1;
      const row = coordinates[0] + endPoint;
      const col = coordinates[1];

      // bottom left
      revealFieldLast(row + 1, col - 1);
      // bottom middle
      revealFieldLast(row + 1, col);
      // bottom right
      revealFieldLast(row + 1, col + 1);
    }
  }

  refreshSurroundings(coordinates, parentDiv, gameboard, ship, mode) {
    const row = coordinates[0];
    const col = coordinates[1];

    this.refreshSurroundingsFirst(row, col, parentDiv, gameboard, mode);
    this.refreshSurroundingsMiddle(row, col, parentDiv, gameboard, ship, mode);
    this.refreshSurroundingsLast([row, col], parentDiv, gameboard, ship, mode);
  }

  createField(player, field, mode) {
    // creates the 10x10 square gameboard

    if (mode === 'show') {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const div = document.createElement('div');
          if (typeof (player.gameboard.field[i][j]) === 'object') {
            div.textContent = '•';
            div.style.fontSize = '2vw';
          }
          else if (player.gameboard.field[i][j] === 'hit') {
            div.textContent = '✕'; // use multiplication, so that it centers!
            div.style.fontSize = '2vw'; // dynamic font size
            div.style.backgroundColor = 'red';
          }
          else if (player.gameboard.field[i][j] === 'miss') {
            div.textContent = '✕';
            div.style.fontSize = '1vw';
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

    else if (mode === 'hidden') {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const div = document.createElement('div');

          div.setAttribute('coords', `${i},${j}`);
          div.classList.add('unselectable');
          field.appendChild(div);
        }
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
    this.createField(this.player1, this.field1, 'show');
    this.createField(this.player2, this.field2, 'hidden');

    // show that its player1's turn
    this.changeOpacity();

    if (this.player1Turn === true) {
      this.field2.addEventListener('click', this.clickHandler); // add an event listener to each square of the parent div
    }
  }

  clickHandler(event) {
    const clickedElement = event.target;

    // if it is player1's turn, then add an event listener, remove player2's event listener
    if (this.player1Turn) {
      if (clickedElement.classList.contains('unselectable')) {
        // put coords here, can otherwise click on background div accidentally, resulting in null
        const coordsRaw = clickedElement.getAttribute('coords');
        const coords = coordsRaw.split(',');
        const row = parseInt(coords[0], 10);
        const col = parseInt(coords[1], 10);

        // get mode and starting point
        const mode = this.player2.gameboard.determineMode([row, col]);
        const startingPoint = this.player2.gameboard.determineStartingPoint([row, col]);

        let shipSunk = false; // can be removed

        // check if the ship sank
        const fieldContent = this.player2.gameboard.field[row][col];
        if (typeof (fieldContent) === 'object') {
          if (fieldContent.timesHit === fieldContent.length - 1) {
            this.displayBoardMessage('Ship sunk!');
            // eslint-disable-next-line max-len
            this.refreshSurroundings(startingPoint, this.field2, this.player2.gameboard, fieldContent, mode);
            this.hitField(clickedElement);
            shipSunk = true;
          }
        }

        // check if placement is allowed first, DISALLOW IF INVALID!
        if (this.player2.gameboard.receiveAttack(coords) !== 'Success') {
          this.displayBoardMessage(this.player2.gameboard.receiveAttack(coords));
        }
        else if (shipSunk !== true) { // this so eslint doesnt cry
          if (fieldContent === '') {
            this.displayBoardMessage('Miss!');
            this.missField(clickedElement);

            this.changeOpacity();

            // disable player1 EL and set to false
            this.field2.removeEventListener('click', this.clickHandler);
            this.player1Turn = false;

            // enable player2's turn
            this.player2Turn = true;

            // player 2's turn
            this.aiTurn();
          }
          else if (typeof (fieldContent) === 'object') {
            this.displayBoardMessage('Hit!');
            this.hitField(clickedElement);
          }
        }
      }
    }
  }

  aiTurn() {
    this.changeOpacity();

    // has memory
    if (this.player2.firstHitCoordinates) {
      console.log('Has memory');
    }

    // no memory
    else if (!this.player2.firstHitCoordinates) {
      // get the attack coordinates
      const attackCoordinates = this.player2.getRandomCoordinates();
      const row = attackCoordinates[0];
      const col = attackCoordinates[1];

      console.log(attackCoordinates);

      // delete from available moves (gameboard)
      this.player2.removeFromAvailableMoves(attackCoordinates);

      setTimeout(() => {
        // sync with the gameboard coordinates
        const selectorCoords = `[coords="${row},${col}"]`;
        const selectedDivNodeList = this.field1.querySelectorAll(selectorCoords);
        const selectedDiv = selectedDivNodeList[0];

        // check if the ship sank
        const fieldContent = this.player1.gameboard.field[row][col];
        if (typeof (fieldContent) === 'object') {
          if (fieldContent.timesHit === fieldContent.length - 1) {
            // get mode and starting point
            const mode = this.player1.gameboard.determineMode([row, col]);
            const startingPoint = this.player1.gameboard.determineStartingPoint([row, col]);

            // eslint-disable-next-line max-len
            this.refreshSurroundings(startingPoint, this.field1, this.player1.gameboard, fieldContent, mode);
            this.hitField(selectedDiv);
          }
        }

        if (fieldContent === 'miss') {
          // remove from available moves, due to AI not refreshing board
          this.player2.removeFromAvailableMoves([row, col]);
          this.aiTurn();
        }
        else if (fieldContent === '') {
          this.missField(selectedDiv);

          this.player1.gameboard.receiveAttack(attackCoordinates);
          this.player2Turn = false;
          this.player1Turn = true;
          this.field2.addEventListener('click', this.clickHandler);

          this.changeOpacity();
        }
        else if (typeof (fieldContent) === 'object') {
          this.hitField(selectedDiv);
          this.player1.gameboard.receiveAttack(attackCoordinates);

          // ai attack again
          this.aiTurn();
        }
      }, 1);
    }
  }

  removeBoardMessage() {
    while (this.turnBoard.firstChild) {
      this.turnBoard.removeChild(this.turnBoard.firstChild);
    }
  }

  displayBoardMessage(message) {
    if (message) {
      this.removeBoardMessage();
      this.turnBoard.textContent = message;
    }
  }

  changeOpacity() {
    // ALSOOOO REMOVE HOVER CSS FROM OTHER FIELD!

    // if player one's turn
    if (this.player1Turn === true) {
      // change text content to "Turn: Player 1"
      // this.turnBoard.textContent = 'Turn: Player 1';

      // make player 2 field brighter
      this.field2.classList.remove('notAtTurn');
      this.field2.classList.add('atTurn');
      // make player 1 field darker
      this.field1.classList.remove('atTurn');
      this.field1.classList.add('notAtTurn');
    }
    else if (this.player2Turn === true) {
      // this.turnBoard.textContent = 'Turn: Player 2';

      // make player 1 field brighter
      this.field1.classList.remove('notAtTurn');
      this.field1.classList.add('atTurn');
      // make player 2 field darker
      this.field2.classList.remove('atTurn');
      this.field2.classList.add('notAtTurn');
    }
  }
}

export default GUI;
