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
    // horizontal
    const row = location[0];
    const col = location[1];
    // loop through arr locations array, go n amount of steps to the right
    for (let i = 0; i < ship.length; i += 1) {
      // case: location exceeds array, check whether col length exceeds row length
      if (col + i >= this.field[row].length) {
        return 'Placement not allowed, must be inside of field';
      }
      // case: location is occupied
      if (this.field[location[0]][location[1]] !== '') {
        return "Can't place ship here, another ship already here.";
      }
      // increment the position's second, as it will go only in row
    }

    return true;

    // vertical
  }

  placeShip(ship, location, mode = 'horizontal') {
    // horizontal
    // check if placement is allowed first
    if (this.placementAllowed(ship, location) === true) {
      // loop for ship.length
      for (let i = 0; i < ship.length; i += 1) {
        // then for every ship.length, place the the ship inside of the location
        this.field[location[0]][location[1]] = ship;
        // increment the location
        location[1] += 1;
      }
    } else {
      return this.placementAllowed(ship, location);
    }

    // vertical
  }
}

const gameboard = new Gameboard();
const battleship = new Battleship(5);

gameboard.placeShip(battleship, [0, 0]);
console.log(gameboard);

module.exports = Gameboard;
