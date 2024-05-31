class AI {
  constructor(gameboard) {
    this.gameboard = gameboard;
    this.firstHitCoordinates = undefined;
    this.nextHitCoordinates = undefined;
    this.attackDirection = undefined;

    this.directions = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
    };

    this.directionsFull = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
    };

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

  rememberHit(coordinates) {
    this.firstHitCoordinates = coordinates;
  }

  resetMemory() {
    this.firstHitCoordinates = undefined;
    this.nextHitCoordinates = undefined;
    this.attackDirection = undefined;
    this.directions = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
    };
  }

  clearNextHitCoordinates() {
    this.nextHitCoordinates = undefined;
  }

  removeFromAvailableMoves(valueToRemove) {
    for (let i = 0; i < this.availableMoves.length; i++) {
      const index = this.availableMoves[i].indexOf(valueToRemove);
      if (index !== -1) {
        this.availableMoves[i].splice(index, 1);
        // each value appears only once, break after removal.
        break;
      }
    }
  }

  isMoveInsideField(row, col) {
    const rowAmount = 10;
    const colAmount = 10;

    if (row >= 0 && row < rowAmount && col >= 0 && col < colAmount) {
      return true;
    }
    else {
      return false;
    }
  }

  isFieldAttacked(fieldContent) {
    if (fieldContent === 'miss') {
      return false;
    }
    else {
      return true;
    }
  }

  getRandomCoordinates() {
    // iterate over availableMoves to collect non-empty rows
    const nonEmptyRows = [];
    for (let i = 0; i < this.availableMoves.length; i++) {
      if (this.availableMoves[i].length > 0) {
        nonEmptyRows.push(this.availableMoves[i]);
      }
    }

    if (nonEmptyRows.length === 0) {
      return 'No more possible moves';
    }

    // select a random row and col from non-empty rows
    const randomRowIndex = Math.floor(Math.random() * nonEmptyRows.length);
    const randomRowArray = nonEmptyRows[randomRowIndex];
    const randomColIndex = Math.floor(Math.random() * randomRowArray.length);
    const move = randomRowArray[randomColIndex];

    return move;
  }

  getNextCoordinates() {
    if (!this.nextHitCoordinates || !this.attackDirection) {
      return null;
    }

    const directionOffset = this.directions[this.attackDirection];
    const newRow = this.nextHitCoordinates[0] + directionOffset[0];
    const newCol = this.nextHitCoordinates[1] + directionOffset[1];
    return [newRow, newCol];
  }

  deleteDirection(key) {
    delete this.directions[key];
  }

  getDirection(key) {
    return this.directions[key];
  }

  getRandomDirection() {
    const keys = Object.keys(this.directions);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomValue = this.directions[randomKey];

    return { direction: randomKey, coordinates: randomValue };
  }

  switchToOppositeDirection() {
    this.attackDirection = this.getOppositeDirection(this.attackDirection);
  }

  getOppositeDirection(direction) {
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };
    return opposites[direction];
  }
}

module.exports = AI;
