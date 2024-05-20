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

  refreshMemory() {
    this.firstHitCoordinates = undefined;
    this.attackedShip = undefined;
    this.nextHitCoordinates = undefined;
    this.attackDirection = undefined;
    this.attackChoices = [1, 2, 3, 4];
  }

  removeSurroundingMoves() {
    // Implement the logic to remove surrounding moves if a ship sank
  }

  getRandomDirection() {
    if (this.attackChoices.length === 0) {
      return 'No attack possible';
    }

    const randomIndex = Math.floor(Math.random() * this.attackChoices.length);
    return this.attackChoices[randomIndex];
  }

  shipSank() {
    if (this.attackedShip && this.attackedShip.sunk) {
      return 'Sunk';
    }
    return 'Ship not sunk';
  }

  getNextAttackCoordinates(coordinates, attackNumber, depth = 0) {
    if (depth > 10) { // depth limit to prevent infinite recursion
      return 'Invalid attack direction';
    }

    const row = coordinates[0];
    const col = coordinates[1];

    const randomAttackDirection = attackNumber;

    // Helper function to remove an attack direction from attackChoices
    const removeAttackChoice = (direction) => {
      const index = this.attackChoices.indexOf(direction);
      if (index > -1) {
        this.attackChoices.splice(index, 1);
      }
    };

    const performAttack = (newRow, newCol, direction) => {
      if (this.gameboard.field[newRow] && this.gameboard.field[newRow][newCol] !== undefined) {
        const fieldContent = this.gameboard.field[newRow][newCol];

        // hits ship
        if (typeof fieldContent === 'object') {
          this.attackDirection = direction;
          this.gameboard.receiveAttack([newRow, newCol]);
          return this.getNextAttackCoordinates([newRow, newCol], attackNumber, depth + 1);
        }
        else {
          removeAttackChoice(attackNumber);
          if (this.shipSank() === 'Sunk') {
            console.log('Ship successfully sunk');
          } else {
            this.setNextHitCoordinates(direction);
          }
        }
      }
    };

    // attack upper
    if (randomAttackDirection === 1) {
      return performAttack(row - 1, col, 'vertical');
    }

    // attack lower
    if (randomAttackDirection === 2) {
      return performAttack(row + 1, col, 'vertical');
    }

    // attack right
    if (randomAttackDirection === 3) {
      return performAttack(row, col + 1, 'horizontal');
    }

    // attack left
    if (randomAttackDirection === 4) {
      return performAttack(row, col - 1, 'horizontal');
    }

    return 'Invalid attack direction';
  }

  setNextHitCoordinates(direction) {
    const [row, col] = this.firstHitCoordinates;
    if (direction === 'vertical') {
      if (this.attackChoices.includes(1) && this.gameboard.field[row + 1]) {
        this.nextHitCoordinates = [row + 1, col];
      }
      else if (this.attackChoices.includes(2) && this.gameboard.field[row - 1]) {
        this.nextHitCoordinates = [row - 1, col];
      }
    }

    else if (direction === 'horizontal') {
      if (
        this.attackChoices.includes(3) &&
        this.gameboard.field[row] &&
        this.gameboard.field[row][col + 1] !== undefined
      ) {
        this.nextHitCoordinates = [row, col + 1];
      }
      else if (
        this.attackChoices.includes(4) &&
        this.gameboard.field[row] &&
        this.gameboard.field[row][col - 1] !== undefined
      ) {
        this.nextHitCoordinates = [row, col - 1];
      }
    }
  }

  rememberFirstHitCoordinates(coordinates) {
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
    let availableCells = [];
    for (const row of this.availableMoves) {
      availableCells = availableCells.concat(row);
    }

    if (availableCells.length === 0) {
      return 'No more possible moves';
    }

    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const move = availableCells[randomIndex];

    const row = move[0];
    const colIndex = this.availableMoves[row].indexOf(move);
    this.availableMoves[row].splice(colIndex, 1);

    return move;
  }

  isMoveValid(move) {
    return move !== 'No more possible moves';
  }

  getAttackCoordinates() {
    const move = this.randomMove();

    if (this.isMoveValid(move)) {
      return move;
    }
    return 'No more possible moves';
  }
}

module.exports = AI;
