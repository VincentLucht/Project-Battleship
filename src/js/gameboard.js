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
      return true;
    }
    else if (mode === 'vertical') {
      const row = location[0];
      // loop through row instead of columns now
      for (let i = 0; i < ship.length; i++) {
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
    return 'Invalid mode';
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
    return 'Invalid mode';
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
    return 'Invalid coordinates';
  }
}

module.exports = Gameboard;
