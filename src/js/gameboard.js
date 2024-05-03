const Battleship = require('./ship');

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

  placementAllowed(ship, location, mode = 'horizontal') {
    if (mode === 'horizontal') {
      const row = location[0];
      const col = location[1];
      // loop through arr locations array, go n amount of steps to the right
      for (let i = 0; i < ship.length; i += 1) {
        // case: location exceeds array, check whether col length exceeds row length
        if (col + i >= this.field[row].length) {
          return 'Placement not allowed, must be inside of field';
        }
        // case: location is occupied
        if (this.field[row][col + i] !== '') {
          return "Can't place ship here, another ship already here";
        }
      }
      return true;
    }
    else if (mode === 'vertical') {
      const row = location[0];
      // loop through row instead of columns now
      for (let i = 0; i < ship.length; i += 1) {
        // case: ship length exceeds column length
        if (row + i >= this.field[row].length) {
          return 'Placement not allowed, must be inside of field';
        }
        // case: location occupied
        if (!this.field[row + i]) {
          return "Can't place ship here, another ship already here";
        }
      }
      return true;
    }
  }

  placeShip(ship, location, mode = 'horizontal') {
    if (mode === 'horizontal') {
      if (this.placementAllowed(ship, location) === true) {
        const row = location[0];
        const col = location[1];
        // loop for ship.length
        for (let i = 0; i < ship.length; i += 1) {
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

        for (let i = 0; i < ship.length; i += 1) {
          // place ship on location and increment by i
          this.field[row + i][col] = ship;
        }
      } else {
        return this.placementAllowed(ship, location, 'vertical');
      }
    }
  }
}

const gameboard = new Gameboard();
const patrolBoat = new Battleship(2);

gameboard.placeShip(patrolBoat, [8, 9]);
console.log(gameboard.field);

module.exports = Gameboard;
