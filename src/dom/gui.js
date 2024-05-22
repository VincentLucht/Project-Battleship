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

  placeDefaultShipsPlus(player) {
    // places 5 ships at the default location
    player.gameboard.placeShip(new Ship(5), [0, 0]);
    player.gameboard.placeShip(new Ship(5), [2, 2]);
    player.gameboard.placeShip(new Ship(5), [2, 0], 'vertical');
    player.gameboard.placeShip(new Ship(5), [5, 3], 'vertical');
    player.gameboard.placeShip(new Ship(5), [5, 5]);
    player.gameboard.placeShip(new Ship(5), [7, 5]);
    player.gameboard.placeShip(new Ship(5), [9, 5]);

    player.gameboard.placeShip(new Ship(4), [5, 4], 'vertical');
    player.gameboard.placeShip(new Ship(3), [0, 9], 'vertical');
    player.gameboard.placeShip(new Ship(2), [3, 4]);
    player.gameboard.placeShip(new Ship(2), [9, 0]);
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
    const changeTurn = () => {
      this.player2Turn = false;
      this.player1Turn = true;
      this.field2.addEventListener('click', this.clickHandler);
      // ADD OPACITY HERE?
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
        // sync with gameboard
        const selectorCoords = `[coords="${newRow},${newCol}"]`;
        const selectedDivNodeList = this.field1.querySelectorAll(selectorCoords);
        const selectedDiv = selectedDivNodeList[0];

        // Path 11: yes, move is inside of the field
        if (this.player2.isMoveInsideField(newRow, newCol)) {
          // (can be undefined/ out of bounds!!!!!!)
          const fieldContent = this.player1.gameboard.field[newRow][newCol];
          console.log('Path 11: move is inside of field');
          // Path 11.5: is the move valid?
          if (this.player2.isFieldAttacked(fieldContent)) {
            // Path 11.5: yes, valid direction
            console.log('Path 11.5: valid direction');

            // Path 12: Does it hit a ship?
            if (fieldContent === 'miss') {
              // remove from available moves, due to AI not refreshing board
              this.player2.removeFromAvailableMoves([newRow, newCol]);

              // get the opposite direction
              const oppositeDirection = this.player2.getOppositeDirection(attackDirection);
              const newDirectionOffset = oppositeDirection;
              // get firstHitCoordinates and combine it with the opposite direction
              const nextRow = this.player2.firstHitCoordinates[0] + newDirectionOffset[0];
              const nextCol = this.player2.firstHitCoordinates[1] + newDirectionOffset[1];
              // set it to nexHitCoordinates
              this.player2.nextHitCoordinates = [nextRow, nextCol];

              this.aiTurn();
            }
            else if (fieldContent === '') {
              // Path 12.1: no hit, misses
              console.log('Path 12.1: miss');
              // change opacity

              // attack the gameboard
              this.player1.gameboard.receiveAttack([newRow, newCol]);
              // attack the field
              this.missField(selectedDiv);
              // delete from available moves
              this.player2.removeFromAvailableMoves([newRow, newCol]);
              // get the opposite direction
              const oppositeDirection = this.player2.getOppositeDirection(attackDirection);
              const newDirectionOffset = oppositeDirection;
              console.log({ oppositeDirection });
              console.log({ newDirectionOffset });
              // get firstHitCoordinates and combine it with the opposite direction
              const nextRow = this.player2.firstHitCoordinates[0] + newDirectionOffset[0];
              const nextCol = this.player2.firstHitCoordinates[1] + newDirectionOffset[1];
              // set it to nexHitCoordinates
              this.player2.nextHitCoordinates = [nextRow, nextCol];

              // end turn
              changeTurn();
            }
            else if (typeof (fieldContent) === 'object') {
              // Path 12.1: yes, hits a ship
              console.log('Path 12.1: hit');
              // Path 3: Does it sink the ship?
              if (didShipSink(newRow, newCol, fieldContent, selectedDiv) === true) {
                // Path 13.1: yes, sinks the ship
                console.log('Path 13.1: does sink the ship!');
                // attack the field
                this.hitField(selectedDiv);
                // attack the gameboard
                this.player1.gameboard.receiveAttack([newRow, newCol]);
                // delete it from availableMoves
                this.player2.removeFromAvailableMoves([newRow, newCol]);
                // reset the computer memory
                this.player2.resetMemory();
                // recursive call
                this.aiTurn();
              }
              else {
                // Path 13.1: no, does not sink the ship
                console.log('Path 13.1: does not sink ship');
                // attack the field
                this.hitField(selectedDiv);
                // attack the gameboard
                this.player1.gameboard.receiveAttack([newRow, newCol]);
                // delete from available moves
                this.player2.removeFromAvailableMoves([newRow, newCol]);
                // set the nextHitCoordinates // can be out of bounds!
                const availableMoves = this.player2.directions;
                console.log({ directionOffset, availableMoves });
                const nextRow = newRow + directionOffset[0];
                const nextCol = newCol + directionOffset[1];
                this.player2.nextHitCoordinates = [nextRow, nextCol];
                console.log({ directionOffset });
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
          console.log(fieldContent);
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
                // attack the gameboard
                this.player1.gameboard.receiveAttack([newRow, newCol]);
                this.hitField(selectedDiv);
                // delete from availableMoves
                this.player2.removeFromAvailableMoves([newRow, newCol]);
                // reset the computer memory
                this.player2.resetMemory();
                // recursive call
                this.aiTurn();
              }

              // Path 4.1 no, doesn't sink ship
              else {
                console.log('Path 4.1: ship did not sink');
                // attack the field
                this.hitField(selectedDiv);
                // attack the gameboard
                this.player1.gameboard.receiveAttack([newRow, newCol]);
                // delete from availableMoves
                this.player2.removeFromAvailableMoves([newRow, newCol]);
                // continue to attack this direction:
                // save attackDirection
                this.player2.attackDirection = randomDirection.direction;
                // set the nextHitCoordinates
                const nextRow = newRow + directionOffset[0];
                const nextCol = newCol + directionOffset[1];
                this.player2.nextHitCoordinates = [nextRow, nextCol];
                // console.log('Next hit coordinates: ', this.player2.nextHitCoordinates);
                this.aiTurn();
              }
            }

            // Path 3.1: no hit, miss
            else if (fieldContent === '') {
              console.log('Path 3.1: miss');
              // change opacity
              this.changeOpacity();
              // attack the field
              this.missField(selectedDiv);
              // attack the gameboard
              this.player1.gameboard.receiveAttack([newRow, newCol]);
              // delete from availableMoves
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
            // recursive call, as it didn't attack
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

      // AI exhausts all its moves, game over (can this happen?)
      if (attackCoordinates === 'No more possible moves') {
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
          this.changeOpacity();
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
      }, 1000);
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
