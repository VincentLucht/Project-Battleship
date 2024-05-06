class Gameboard {
  constructor() {
    this.field = [
      ['', '', '', '', '', '', '', '', '', ''], // Row 0
      ['', '', '', '', '', '', '', '', '', ''], // Row 1
      ['', '', '', '', '', '', '', '', '', ''], // Row 2
      ['', '', '', '', '', '', '', '', '', ''], // Row 3
      ['', '', '', '', '', '', '', '', '', ''], // Row 4
      ['', '', '', '', '', '', '', '', '', ''], // Row 5
      ['', '', '', '', '', '', '', '', '', ''], // Row 6
      ['', '', '', '', '', '', '', '', '', ''], // Row 7
      ['', '', '', '', '', '', '', '', '', ''], // Row 8
      ['', '', '', '', '', '', '', '', '', ''], // Row 9
    ];
  }

  checkProximityLeft(startingPoint) {
    // checks the left upper left, left middle left, left bottom left
    const row = startingPoint[0];
    const col = startingPoint[1];

    // left upper left: this.field[row - 1][col - 1]
    if (
      this.field[row - 1] && // check if row exists first, otherwise access's undefined
      this.field[row - 1][col - 1] &&
      typeof (this.field[row - 1][col - 1]) === 'object'
    ) {
      return 'Not allowed, left upper left found';
    }

    // left middle left: this.field[row][col - 1]
    if (
      this.field[row] &&
      this.field[row][col - 1] &&
      typeof (this.field[row][col - 1]) === 'object'
    ) {
      return 'Not allowed, left middle left found';
    }

    // left bottom left: this.field[row + 1][col - 1]
    if (
      this.field[row + 1] &&
      this.field[row + 1][col - 1] &&
      typeof (this.field[row + 1][col - 1])
    ) {
      return 'Not allowed, left bottom left found';
    }

    // always return true at end
    return true;
  }

  placementAllowed(ship, location, mode = 'horizontal') {
    if (mode === 'horizontal') {
      const row = location[0];
      const col = location[1];
      // loop through arr locations array, go n amount of steps to the right
      for (let i = 0; i < ship.length; i++) {
        // case: location exceeds array, check whether col length exceeds row length
        if (col + i >= this.field[row].length) {
          return 'Placement not allowed, must be inside of field';
        }
        // case: location is occupied
        if (this.field[row][col + i] !== '') {
          return "Can't place ship here, another ship already here";
        }
      }
      // case: ship close to proximity
      if (this.checkProximityLeft(location) !== true) {
        return this.checkProximityLeft(location);
      }
      return true;
    }

    else if (mode === 'vertical') {
      const row = location[0];
      const col = location[1];
      // loop through row instead of columns now
      for (let i = 0; i < ship.length; i++) {
        // case: ship length exceeds column length
        if (row + i >= this.field[row].length) {
          return 'Placement not allowed, must be inside of field';
        }
        // case: location occupied
        if (this.field[row + i][col] !== '') {
          return "Can't place ship here, another ship already here";
        }
      }

      // case: ship close to proximity
      // const errorMessage = "Can't place ship here, another ship in close proximity";

      return true;
    }
    return 'Invalid';
  }

  placeShip(ship, location, mode = 'horizontal') {
    if (mode === 'horizontal') {
      if (this.placementAllowed(ship, location) === true) {
        const row = location[0];
        const col = location[1];
        // loop for ship.length
        for (let i = 0; i < ship.length; i++) {
          // then for every ship.length, place the the ship inside of the location
          this.field[row][col + i] = ship;
        }
      } else {
        return this.placementAllowed(ship, location);
      }
    }
    else if (mode === 'vertical') {
      if (this.placementAllowed(ship, location, 'vertical') === true) {
        // check for placement
        const row = location[0];
        const col = location[1];

        for (let i = 0; i < ship.length; i++) {
          // place ship on location and increment by i
          this.field[row + i][col] = ship;
        }
      } else {
        return this.placementAllowed(ship, location, 'vertical');
      }
    }
    return 'Invalid';
  }

  receiveAttack(coordinates) {
    const row = coordinates[0];
    const col = coordinates[1];
    const field = this.field[row][col];
    // if the space is already hit, return "Can't hit an already hit spot"
    if (field === 'miss' || field === 'hit') {
      return "Can't hit an already attacked spot";
    }
    // if the space is empty, change this.[row][col] to 'hit'
    if (field === '') {
      this.field[row][col] = 'miss';
    }
    // if there is a ship, save ship to var
    if (typeof (field) === 'object') {
      const ship = field;
      // send a hit attack to that ship
      ship.hit();
      // change the coords to 'hit'
      this.field[row][col] = 'hit';
    }
    return 'Invalid';
  }
}

const Ship = require('./ship');

const gameboard = new Gameboard();
const submarine = new Ship(3);
const patrolBoat = new Ship(2);

gameboard.placeShip(submarine, [2, 3]);
const result = gameboard.placeShip(patrolBoat, [2, 6]);

console.log(result);

module.exports = Gameboard;
