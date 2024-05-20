class AI {
  constructor(gameboard) {
    this.gameboard = gameboard;
    this.firstHitCoordinates = undefined;
    this.attackedShip = undefined;
    this.nextHitCoordinates = undefined;
    this.attackDirection = undefined;

    this.directions = {
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

  clearHitData() {
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

  removeAvailableMoveSurroundings() {

  }

  removeFromAvailableMoves(valueToRemove) {
    for (let i = 0; i < this.availableMoves.length; i++) {
      const index = this.availableMoves[i].indexOf(valueToRemove);
      if (index !== -1) {
        this.availableMoves[i].splice(index, 1);
        // Assuming each value appears only once, so we can break after removal.
        break;
      }
    }
  }

  getRandomCoordinates() {
    // it's a bit inefficient, but arr is only size 100
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
