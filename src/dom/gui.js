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
    // using 'this' does not work without binding here, it will return undefined otherwise
    this.clickHandler = this.clickHandler.bind(this);
  }

  isGameOver(gameboard, offset = true) {
    let amountOfShips = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const currentField = gameboard.field[i][j];
        if (typeof (currentField) === 'object') {
          amountOfShips += 1;
        }
      }
    }

    if (offset) {
      if (amountOfShips === 1) {
        return true;
      }
    } else if (amountOfShips === 0) {
      return true;
    }

    return false;
  }

  removeHoverEffect() {
    const allDivs = this.field2.querySelectorAll('div');
    for (let i = 0; i < allDivs.length; i++) {
      const div = allDivs[i];
      div.classList.remove('hover');
    }
  }

  placeDefaultShips(player) {
    // places 5 ships at the default location
    player.gameboard.placeShip(new Ship(5), [0, 0]);
    player.gameboard.placeShip(new Ship(4), [5, 4], 'vertical');
    player.gameboard.placeShip(new Ship(3), [0, 9], 'vertical');
    player.gameboard.placeShip(new Ship(2), [3, 4]);
    player.gameboard.placeShip(new Ship(2), [9, 0]);
  }

  placeRandomShipsAI() {
    // const allShipLength = [5, 4, 4, 3, 3, 2, 2];
    const allShipLength = [2, 2];

    for (let i = 0; i < allShipLength.length; i++) {
      let hasPlaced = false;

      while (!hasPlaced) {
        const length = allShipLength[i];

        const random1To2 = Math.floor(Math.random() * 2) + 1;
        let mode;
        if (random1To2 === 1) {
          mode = 'horizontal';
        }
        else {
          mode = 'vertical';
        }

        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);

        if (this.player2.gameboard.placementAllowed(new Ship(length), [row, col], mode) === true) {
          this.player2.gameboard.placeShip(new Ship(length), [row, col], mode);
          hasPlaced = true;
        }
      }
    }
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

  addShipImages(arrAllShipObjects) {
    // adds the ship png's to the field
    for (let i = 0; i < arrAllShipObjects.length; i++) {
      const {
        currentPosition, mode, length, name,
      } = arrAllShipObjects[i];

      const [row, col] = currentPosition;

      for (let j = 0; j < length; j++) {
        let currentRow = row;
        let currentCol = col;

        if (mode === 'horizontal') {
          currentCol += j;
        }
        else if (mode === 'vertical') {
          currentRow += j;
        }

        const selectedDiv = document.querySelector(`[coords="${currentRow},${currentCol}"]`);
        selectedDiv.classList.add(`${name}`);
        selectedDiv.style.backgroundImage = `url(../../src/img/${name}/${j}.png)`;
        selectedDiv.style.backgroundSize = 'cover';
        selectedDiv.style.backgroundPosition = 'center';
        selectedDiv.style.backgroundRepeat = 'no-repeat';

        if (mode === 'vertical') {
          selectedDiv.style.transform = 'rotate(90deg)';
        }
        if (name === 'aircraftcarrier') {
          selectedDiv.style.backgroundSize = '98%';
        }
        if (name === 'cruiser' || name === 'destroyer' || name === 'falcon' || name === 'submarine') {
          selectedDiv.style.backgroundSize = '99%'; // to large otherwise, 1% apparently
        }
      }
    }
  }

  createField(player, field, mode, addHover = false) {
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
          if (addHover) {
            div.classList.add('hover');
          }
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

  displayFieldPlayer1() {
    this.createField(this.player1, this.field1, 'hidden');
  }

  createPlayer2Field() {
    const parentDiv = document.querySelector('.fieldWrapper');
    const newField = document.createElement('div');
    newField.classList = 'field2';
    parentDiv.appendChild(newField);
  }

  displayFieldPlayer2() {
    this.createField(this.player2, this.field2, 'hidden', true);
  }

  startGame() {
    this.changeOpacity();
    this.field2.addEventListener('click', this.clickHandler);
  }

  clickHandler(event) {
    const endGame = () => {
      this.player1Turn = false;
      this.field2.removeEventListener('click', this.clickHandler);

      this.disableOpacity();
      this.displayBoardMessage('Player 1 Won! Congratulations');
    };

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

        let shipSunk = false;

        // check if the ship sank
        const fieldContent = this.player2.gameboard.field[row][col];
        if (typeof (fieldContent) === 'object') {
          if (fieldContent.timesHit === fieldContent.length - 1) {
            this.displayBoardMessage('Ship sunk!');
            // eslint-disable-next-line max-len
            this.refreshSurroundings(startingPoint, this.field2, this.player2.gameboard, fieldContent, mode);
            this.hitField(clickedElement);
            shipSunk = true;

            if (this.isGameOver(this.player2.gameboard)) {
              endGame();
              this.removeHoverEffect();
            }
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
    // Attacks a random field, until it hits one - recursively(!!!) hunts the ship down
    const endGame = () => {
      this.player2Turn = false;
      this.disableOpacity();
      this.displayBoardMessage('You lost to the AI!');
    };

    const changeTurn = () => {
      this.player2Turn = false;
      this.player1Turn = true;
      this.field2.addEventListener('click', this.clickHandler);
      this.changeOpacity();
    };

    const executeAttack = (newRow, newCol, selectedDiv, hit) => {
      // removes move from all available moves, attacks field and gameboard
      if (hit) {
        this.hitField(selectedDiv);
      }
      else {
        this.missField(selectedDiv);
      }
      this.player1.gameboard.receiveAttack([newRow, newCol]);
      this.player2.removeFromAvailableMoves([newRow, newCol]);

      if (this.isGameOver(this.player1.gameboard, false)) {
        endGame();
        this.removeHoverEffect();
      }
    };

    const didShipSink = (row, col, fieldContent, selectedDiv) => {
      if (fieldContent.timesHit === fieldContent.length - 1) {
        const mode = this.player1.gameboard.determineMode([row, col]);
        const startingPoint = this.player1.gameboard.determineStartingPoint([row, col]);

        // eslint-disable-next-line max-len
        this.refreshSurroundings(startingPoint, this.field1, this.player1.gameboard, fieldContent, mode);
        this.hitField(selectedDiv);
        return true;
      }
      else {
        return false;
      }
    };

    if (!this.player2Turn) {
      return;
    }

    const TIMEOUTAMOUNT = 1;

    this.changeOpacity();

    // has memory
    if (this.player2.firstHitCoordinates) {
      console.log('I have memory!');

      // yes, it has memory+
      if (this.player2.nextHitCoordinates) {
        // Path 11: is the move inside of the field?
        const { attackDirection } = this.player2;
        const directionOffset = this.player2.getDirection(attackDirection);
        const newRow = this.player2.nextHitCoordinates[0];
        const newCol = this.player2.nextHitCoordinates[1];
        console.log('%cNext coordinates will be: [%d, %d]', 'color: red;', newRow, newCol);
        // sync with gameboard
        const selectorCoords = `[coords="${newRow},${newCol}"]`;
        const selectedDivNodeList = this.field1.querySelectorAll(selectorCoords);
        const selectedDiv = selectedDivNodeList[0];

        // Path 11: yes, move is inside of the field
        if (this.player2.isMoveInsideField(newRow, newCol)) {
          const fieldContent = this.player1.gameboard.field[newRow][newCol];
          console.log('Path 11: move is inside of field');
          // Path 11.5: is the move valid?
          if (this.player2.isFieldAttacked(fieldContent)) {
            // Path 11.5: yes, valid direction
            console.log('Path 11.5: valid direction');

            // Path 12: Does it hit a ship?
            if (fieldContent === 'miss') {
              console.log('%cPath 12.1: Field already attacked', 'color: red');
              // remove from available moves, due to AI not refreshing board
              this.player2.removeFromAvailableMoves([newRow, newCol]);
              // get the opposite direction
              const oppositeDirection = this.player2.getOppositeDirection(attackDirection);
              const newDirectionOffset = oppositeDirection;
              // get firstHitCoordinates and combine it with the opposite direction
              const nextRow = this.player2.firstHitCoordinates[0] + newDirectionOffset[0];
              const nextCol = this.player2.firstHitCoordinates[1] + newDirectionOffset[1];
              console.log({ nextRow, nextCol });
              // set it to nexHitCoordinates
              this.player2.nextHitCoordinates = [nextRow, nextCol];

              this.aiTurn();
            }
            else if (fieldContent === '') {
              // Path 12.1: no hit, misses
              console.log('%c Path 12.1: miss', 'color: blue');
              executeAttack(newRow, newCol, selectedDiv, false);
              // get the opposite direction
              const oppositeDirection = this.player2.getOppositeDirection(attackDirection);
              const newDirectionOffset = oppositeDirection;
              // get firstHitCoordinates and combine it with the opposite direction
              const nextRow = this.player2.firstHitCoordinates[0] + newDirectionOffset[0];
              const nextCol = this.player2.firstHitCoordinates[1] + newDirectionOffset[1];
              console.log({ nextRow, nextCol });
              // set it to nexHitCoordinates
              this.player2.nextHitCoordinates = [nextRow, nextCol];

              changeTurn();
            }
            else if (typeof (fieldContent) === 'object') {
              // Path 12.1: yes, hits a ship
              console.log('Path 12.1: hit');
              // Path 3: Does it sink the ship?
              if (didShipSink(newRow, newCol, fieldContent, selectedDiv) === true) {
                // Path 13.1: yes, sinks the ship
                console.log('Path 13.1: does sink the ship!');
                executeAttack(newRow, newCol, selectedDiv, true);
                this.player2.resetMemory();
                this.aiTurn();
              }
              else {
                // Path 13.1: no, does not sink the ship
                console.log('Path 13.1: does not sink ship');
                executeAttack(newRow, newCol, selectedDiv, true);
                // set the nextHitCoordinates
                const nextRow = newRow + directionOffset[0];
                const nextCol = newCol + directionOffset[1];
                this.player2.nextHitCoordinates = [nextRow, nextCol];
                // recursive call
                this.aiTurn();
              }
            }
          }

          // Path 11.5: no, field already attacked
          else if (!this.player2.isFieldAttacked(fieldContent)) {
            console.log('Path 11.5: field already missed');
            // delete it from available moves
            this.player2.removeFromAvailableMoves([newRow, newCol]);
            // get the opposite direction
            const oppositeDirection = this.player2.getOppositeDirection(attackDirection);
            // set attack direction to this
            this.player2.attackDirection = oppositeDirection;
            const newDirectionOffset = this.player2.getDirection(oppositeDirection);
            // get firstHitCoordinates and combine it with the opposite direction
            const nextRow = this.player2.firstHitCoordinates[0] + newDirectionOffset[0];
            const nextCol = this.player2.firstHitCoordinates[1] + newDirectionOffset[1];
            // set it to nextHitCoordinates
            this.player2.nextHitCoordinates = [nextRow, nextCol];
            // delete from attackDirection
            this.player2.deleteDirection(attackDirection);
            // recursive call
            this.aiTurn();
          }
        }

        // Path 11: no, not inside of field
        else if (!this.player2.isMoveInsideField(newRow, newCol)) {
          console.log('Path 11.5: Move is outside of the field');
          // switch to opposite direction
          const oppositeDirection = this.player2.getOppositeDirection(attackDirection);
          const newDirectionOffset = this.player2.getDirection(oppositeDirection);

          const nextRow = this.player2.firstHitCoordinates[0] + newDirectionOffset[0];
          const nextCol = this.player2.firstHitCoordinates[1] + newDirectionOffset[1];

          this.player2.nextHitCoordinates = [nextRow, nextCol];
          this.player2.attackDirection = oppositeDirection;

          this.player2.deleteDirection(attackDirection);
          this.aiTurn();
        }
      }

      // no, doesn't have memory+
      else if (!this.player2.nextHitCoordinates) {
        // Path 1: get a random direction
        const randomDirection = this.player2.getRandomDirection();
        const directionOffset = randomDirection.coordinates;
        const newRow = this.player2.firstHitCoordinates[0] + directionOffset[0];
        const newCol = this.player2.firstHitCoordinates[1] + directionOffset[1];
        // sync with the gameboard coordinates
        const selectorCoords = `[coords="${newRow},${newCol}"]`;
        const selectedDivNodeList = this.field1.querySelectorAll(selectorCoords);
        const selectedDiv = selectedDivNodeList[0];

        // Path 1.5: is the move inside of the field?
        // Path 1.5: yes, inside of the field
        if (this.player2.isMoveInsideField(newRow, newCol)) {
          console.log('Path 1.5: Move is inside of the field');
          // Path 2: is the direction valid?
          const fieldContent = this.player1.gameboard.field[newRow][newCol];
          // Path 2.1: yes, valid direction
          if (this.player2.isFieldAttacked(fieldContent)) {
            console.log('Path 2.1: valid direction');

            // Path 3: does it hit a ship?
            // Path 3.1: hit
            if (typeof (fieldContent) === 'object') {
              console.log('Path 3.1: hit a ship');
              // Path 4: does it sink the ship?
              // Path 4.1 yes, sinks ship
              if (didShipSink(newRow, newCol, fieldContent, selectedDiv) === true) {
                console.log('Path 4.1: ship did sink');
                executeAttack(newRow, newCol, selectedDiv, true);
                this.player2.resetMemory();
                this.aiTurn();
              }

              // Path 4.1 no, doesn't sink ship
              else {
                console.log('Path 4.1: ship did not sink');
                executeAttack(newRow, newCol, selectedDiv, true);
                // continue to attack this direction:
                // save attackDirection
                this.player2.attackDirection = randomDirection.direction;
                // set the nextHitCoordinates
                const nextRow = newRow + directionOffset[0];
                const nextCol = newCol + directionOffset[1];
                this.player2.nextHitCoordinates = [nextRow, nextCol];
                this.aiTurn();
              }
            }

            // Path 3.1: no hit, miss
            else if (fieldContent === '') {
              console.log('Path 3.1: miss');
              executeAttack(newRow, newCol, selectedDiv, false);
              this.player2.deleteDirection(randomDirection.direction);
              changeTurn();
            }
          }

          // Path 2.1: no, field already missed
          else if (!this.player2.isFieldAttacked(fieldContent)) {
            console.log('Path 2.1: field already missed');
            // delete from available moves
            this.player2.removeFromAvailableMoves([newRow, newCol]);
            // delete that direction
            this.player2.deleteDirection(randomDirection.direction);
            this.aiTurn();
          }
        }
        // Path 1.5: no, outside of the field
        else if (!this.player2.isMoveInsideField(newRow, newCol)) {
          console.log('Path 1.5: Move is outside of the field and invalid');
          this.player2.deleteDirection(randomDirection.direction);
          this.aiTurn();
        }
      }
    }

    // no memory
    else if (!this.player2.firstHitCoordinates) {
      console.log('I have no memory now');
      const attackCoordinates = this.player2.getRandomCoordinates();
      const row = attackCoordinates[0];
      const col = attackCoordinates[1];

      // AI exhausts all its moves, game over
      if (attackCoordinates === 'No more possible moves') {
        endGame();
        console.log('Game ended');
        return;
      }

      this.player2.removeFromAvailableMoves(attackCoordinates);

      const fieldContent = this.player1.gameboard.field[row][col];

      if (fieldContent === 'hit') {
        // fix being stuck!
        this.player2.removeFromAvailableMoves(attackCoordinates);
        this.aiTurn();
      }
      else if (fieldContent === 'miss') {
        // remove from available moves, due to AI not refreshing board
        this.player2.removeFromAvailableMoves([row, col]);
        this.aiTurn();
      }

      setTimeout(() => {
        // sync with the gameboard coordinates
        const selectorCoords = `[coords="${row},${col}"]`;
        const selectedDivNodeList = this.field1.querySelectorAll(selectorCoords);
        const selectedDiv = selectedDivNodeList[0];

        if (fieldContent === '') {
          // normal miss
          this.missField(selectedDiv);

          this.player1.gameboard.receiveAttack(attackCoordinates);
          changeTurn();
        }
        else if (typeof (fieldContent) === 'object') {
          // check if the ship sank and refresh surroundings, if memory is completed REMOVE THIS?
          didShipSink(row, col, fieldContent, selectedDiv);

          // hit field
          this.hitField(selectedDiv);
          this.player1.gameboard.receiveAttack(attackCoordinates);

          // save to memory (firstHitCoordinates)
          this.player2.rememberHit([row, col]);

          this.aiTurn();
        }
      }, TIMEOUTAMOUNT);
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

  disableOpacity() {
    // disables the opacity, signaling that the game is over
    this.field1.classList.remove('atTurn');
    this.field1.classList.add('notAtTurn');
    this.field2.classList.remove('atTurn');
    this.field2.classList.add('notAtTurn');
  }

  focusOnPlayerField() {
    // make player 1 field brighter
    this.field1.classList.remove('notAtTurn');
    this.field1.classList.add('atTurn');
  }
}

export default GUI;
