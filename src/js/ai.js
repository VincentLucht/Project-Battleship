class AI {
  constructor(gameboard) {
    this.gameboard = gameboard;
    this.hitShipCoords = undefined;
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

  checkHit() {
    // if a ship is hit, remember where it hit the boat
    // attack either the top, bottom, right, or left
    // if it doesn't hit, return to the previous hit (this.hitShipCoords)

    // if it hits, continue that direction, until the ship sinks
    // if it misses, and the ship is not sank, return to the previous hit,
    // and hit the opposite direction, until ship sinks
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

  attack() {
    const move = this.randomMove();

    if (this.isMoveValid(move) === true) {
      this.gameboard.receiveAttack(move);
    }
    else {
      return 'No more possible moves';
    }

    return 'Success';
  }
}

module.exports = AI;
