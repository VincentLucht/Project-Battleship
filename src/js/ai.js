class AI {
  constructor(gameboard) {
    this.gameboard = gameboard;
    this.firstHitCoordinates = undefined;
    this.attackedShip = undefined;
    this.nextHitCoordinates = undefined;
    this.attackDirection = undefined;

    this.attackChoices = [1, 2, 3, 4];

    this.availableMoves = [
      [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]],
      [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9]],
      [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9]],
      [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6], [3, 7], [3, 8], [3, 9]],
      [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9]],
      [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [5, 6], [5, 7], [5, 8], [5, 9]],
      [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9]],
      [[7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], [7, 9]],
      [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9]],
      [[9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9]],
    ];
  }

  removeSurroundingMoves() {
    // removes the surrounding hits from this.availableMoves, if a ship sank
  }

  getRandomDirection() {
    if (this.attackChoices.length === 0) {
      return 'No attack possible';
    }

    const randomIndex = Math.floor(Math.random() * this.attackChoices.length);
    return this.attackChoices[randomIndex];
  }

  shipSank() {
    if (this.attackedShip.sunk) {
      return 'Sunk';
    }
    return 'Ship not sunk';
  }

  getNextAttackCoordinates(coordinates, attackNumber) {
    const row = coordinates[0];
    const col = coordinates[1];

    const randomAttackDirection = attackNumber;

    // attack upper
    if (randomAttackDirection === 1) {
      // save the ship to memory
      if (this.gameboard.field[row - 1]) {
        const fieldContent = this.gameboard.field[row - 1][col];

        // hits ship
        if (typeof (fieldContent) === 'object') {
          this.attackDirection = 'vertical';
          this.gameboard.receiveAttack([row - 1, col]);
          return this.getNextAttackCoordinates([row - 1, col], 1);
        }

        // does not hit ship
        else {
          // check if ship sank
          if (this.attackedShip.sunk === true) {
            console.log('Ship successfully sunk');
          }
          // determine the next attackDirection
          if (this.attackedShip.sunk === false) {
            if (this.gameboard.field[this.firstHitCoordinates[0] + 1]) {
              return [this.firstHitCoordinates[0] + 1, this.firstHitCoordinates[1]];
            }
          }
        }
      }
    }

    // attack lower
    if (randomAttackDirection === 2) {
      if (this.gameboard.field[row + 1]) {
        const fieldContent = this.gameboard.field[row + 1][col];
        // hits ship
        if (typeof (fieldContent) === 'object') {
          this.attackDirection = 'vertical';
        }
        // does not hit ship
        else {
          const index = this.attackChoices.indexOf(randomAttackDirection);
          if (index !== -1) {
            this.attackChoices.splice(index, 1);
          }
        }
        return [row + 1, col];
      }
      else {
        return 'Lower field does not exist';
      }
    }

    // attack right
    // if right hit, attackDirection = horizontal

    // attack left
    // if left hit, attackDirection = horizontal

    // if it doesn't hit, return to the previous hit (this.firstHitCoords)

    return 'Invalid attack direction';
  }

  rememberFirstHitCoordinates(coordinates) {
    // if a ship is hit, remember where it hit the boat
    if (!this.firstHitCoordinates) {
      this.firstHitCoordinates = coordinates;
    }
  }

  rememberShip(coordinates) {
    if (!this.attackedShip) {
      const ship = this.gameboard.field[coordinates[0]][coordinates[1]];
      this.attackedShip = ship;
    }
  }

  randomMove() {
    // it's a bit inefficient, but arr is only size 100
    // Check if the main array is empty!
    const randomRowIndex = Math.floor(Math.random() * this.availableMoves.length);
    let randomRowArray = this.availableMoves[randomRowIndex];

    // Check if the selected subarray is empty!
    let i = 9;
    while (randomRowArray.length === 0) {
      const newRandomArray = this.availableMoves[i];
      if (newRandomArray === undefined) {
        return 'No more possible move';
      }
      if (newRandomArray.length !== 0) {
        randomRowArray = newRandomArray;
        break;
      }
      else if (newRandomArray.length === undefined) {
        return 'No more possible moves';
      }
      i -= 1;
    }

    const randomColIndex = Math.floor(Math.random() * randomRowArray.length);
    const move = randomRowArray[randomColIndex];

    // remove it from the available choices first
    randomRowArray.splice(randomColIndex, 1);

    return move;
  }

  isMoveValid(move) {
    if (move === 'No more possible move') {
      return false;
    }
    return true;
  }

  getAttackCoordinates() {
    const move = this.randomMove();

    if (this.isMoveValid(move) === true) {
      return move;
    }
    else {
      return 'No more possible moves';
    }
  }
}

module.exports = AI;
