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

  determineMode(startingPoint) {
    // checks the mode of the ship that is in the coordinates
    const row = startingPoint[0];
    const col = startingPoint[1];

    // horizontal right
    if (
      this.field[row] &&
      this.field[row][col + 1] &&
      (typeof (this.field[row][col + 1]) === 'object' || this.field[row][col + 1] === 'hit')
    ) {
      return 'horizontal';
    }
    // horizontal left
    if (
      this.field[row] &&
      this.field[row][col - 1] &&
      (typeof (this.field[row][col - 1]) === 'object' || this.field[row][col - 1] === 'hit')
    ) {
      return 'horizontal';
    }

    // vertical upper
    if (
      this.field[row + 1] &&
      this.field[row + 1][col] &&
      (typeof (this.field[row + 1][col]) === 'object' || this.field[row + 1][col] === 'hit')
    ) {
      return 'vertical';
    }
    // vertical lower
    if (
      this.field[row - 1] &&
      this.field[row - 1][col] &&
      (typeof (this.field[row - 1][col]) === 'object' || this.field[row - 1][col] === 'hit')
    ) {
      return 'vertical';
    }

    return 'No mode determined';
  }

  determineStartingPoint(coordinates) {
    // determines the starting point of the ship
    const row = coordinates[0];
    const col = coordinates[1];
    const mode = this.determineMode([row, col]);

    let foundStandingPoint = false;
    let startingPoint = [row, col]; // default starting point in case it's the first one hit

    if (mode === 'horizontal') {
      // go as far left as possible
      let i = 0;
      while (foundStandingPoint !== true) {
        i += 1;
        if (
          this.field[row] &&
          this.field[row][col - i] &&
          (typeof (this.field[row][col - i]) === 'object' || this.field[row][col - i] === 'hit')
        ) {
          startingPoint = [row, col - i];
        }
        else {
          foundStandingPoint = true;
        }
      }
      return startingPoint;
    }

    else if (mode === 'vertical') {
      // go as far up as possible
      let i = 0;
      while (foundStandingPoint !== true) {
        i += 1;
        if (
          this.field[row - i] &&
          this.field[row - i][col] &&
          // check if row+i, col === object and if row+i, col === hit
          (typeof (this.field[row - i][col]) === 'object' || this.field[row - i][col] === 'hit')
        ) {
          startingPoint = [row - i, col];
        }
        else {
          foundStandingPoint = true;
        }
      }
      return startingPoint;
    }

    return 'No starting point determined';
  }

  hitSurroundingsFirst(row, col, mode) {
    // assigns 'miss' to the surroundings of the first part of the ship

    if (mode === 'horizontal') {
      // left upper left: this.field[row - 1][col - 1]
      if (
        this.field[row - 1] && // check if row exists first, otherwise access's undefined
        (this.field[row - 1][col - 1] === '' || this.field[row - 1][col - 1] === 'miss')
      ) {
        this.field[row - 1][col - 1] = 'miss';
      }

      // left middle left: this.field[row][col - 1]
      if (
        this.field[row] &&
        (this.field[row][col - 1] === '' || this.field[row][col - 1] === 'miss')
      ) {
        this.field[row][col - 1] = 'miss';
      }

      // left bottom left: this.field[row + 1][col - 1]
      if (
        this.field[row + 1] &&
        (this.field[row + 1][col - 1] === '' || this.field[row + 1][col - 1] === 'miss')
      ) {
        this.field[row + 1][col - 1] = 'miss';
      }
    }

    else if (mode === 'vertical') {
      // upper left
      if (
        this.field[row - 1] &&
        (this.field[row - 1][col - 1] === '' || (this.field[row - 1][col - 1]) === 'miss')
      ) {
        this.field[row - 1][col - 1] = 'miss';
      }

      // upper middle
      if (
        this.field[row - 1] &&
        (this.field[row - 1][col] === '' || this.field[row - 1][col] === 'miss')
      ) {
        this.field[row - 1][col] = 'miss';
      }

      // upper right
      if (
        this.field[row - 1] &&
        (this.field[row - 1][col + 1] === '' || this.field[row - 1][col + 1] === 'miss')
      ) {
        this.field[row - 1][col + 1] = 'miss';
      }
    }
  }

  hitSurroundingsMiddle(row, col, mode, ship) {
    // assigns 'miss' to the middle part of the ship, one after the first, one before the last
    if (mode === 'horizontal') {
      for (let i = 0; i < ship.length; i++) {
        // upper
        if (
          this.field[row - 1] &&
          (this.field[row - 1][col + i] === '' || this.field[row - 1][col + i] === 'miss')
        ) {
          this.field[row - 1][col + i] = 'miss';
        }
        // lower
        if (
          this.field[row + 1] &&
          (this.field[row + 1][col + i] === '' || this.field[row + 1][col + i] === 'miss')
        ) {
          this.field[row + 1][col + i] = 'miss';
        }
      }
    }

    else if (mode === 'vertical') {
      for (let i = 0; i < ship.length; i++) {
        // left
        if (
          this.field[row + i] &&
          (this.field[row + i][col - 1] === '' || this.field[row + i][col - 1] === 'miss')
        ) {
          this.field[row + i][col - 1] = 'miss';
        }
        // right
        if (
          this.field[row + i] &&
          (this.field[row + i][col + 1] === '' || this.field[row + i][col + 1] === 'miss')
        ) {
          this.field[row + i][col + 1] = 'miss';
        }
      }
    }
  }

  hitSurroundingsLast(startingPoint, mode, ship) {
    // assigns 'miss' to the surroundings of the last part of the ship
    if (mode === 'horizontal') {
      const endPoint = ship.length - 1;
      const row = startingPoint[0];
      const col = startingPoint[1] + endPoint;

      // right upper right
      if (
        this.field[row - 1] &&
        (this.field[row - 1][col + 1] === '' || this.field[row - 1][col + 1] === 'miss')
      ) {
        this.field[row - 1][col + 1] = 'miss';
      }
      // right middle right
      if (
        this.field[row] &&
        (this.field[row][col + 1] === '' || this.field[row][col + 1] === 'miss')
      ) {
        this.field[row][col + 1] = 'miss';
      }
      // right bottom right
      if (
        this.field[row + 1] &&
        (this.field[row + 1][col + 1] === '' || this.field[row + 1][col + 1] === 'miss')
      ) {
        this.field[row + 1][col + 1] = 'miss';
      }
    }

    else if (mode === 'vertical') {
      const endPoint = ship.length - 1;
      const row = startingPoint[0] + endPoint;
      const col = startingPoint[1];

      // bottom left
      if (
        this.field[row + 1] &&
        (this.field[row + 1][col - 1] === '' || this.field[row + 1][col - 1] === 'miss')
      ) {
        this.field[row + 1][col - 1] = 'miss';
      }
      // bottom middle
      if (
        this.field[row + 1] &&
        (this.field[row + 1][col] === '' || this.field[row + 1][col] === 'miss')
      ) {
        this.field[row + 1][col] = 'miss';
      }
      // bottom right
      if (
        this.field[row + 1] &&
        (this.field[row + 1][col + 1] === '' || this.field[row + 1][col + 1] === 'miss')
      ) {
        this.field[row + 1][col + 1] = 'miss';
      }
    }
  }

  hitSurroundings(coordinates, ship) {
    // if a ship is sunk, it hits the surrounding areas
    const row = coordinates[0];
    const col = coordinates[1];
    const mode = this.determineMode(coordinates);

    // could actually skip if statements!!!
    if (mode === 'horizontal') {
      this.hitSurroundingsFirst(row, col, mode);
      this.hitSurroundingsMiddle(row, col, mode, ship);
      this.hitSurroundingsLast(coordinates, mode, ship);
    }
    else if (mode === 'vertical') {
      this.hitSurroundingsFirst(row, col, mode);
      this.hitSurroundingsMiddle(row, col, mode, ship);
      this.hitSurroundingsLast(coordinates, mode, ship);
    }
  }

  checkProximityFirst(startingPoint, mode) {
    // checks if there any ships on the first part of the ship

    if (mode === 'horizontal') {
      // checks the left upper left, left middle left, left bottom left
      const row = startingPoint[0];
      const col = startingPoint[1];

      // left upper left
      if (
        this.field[row - 1] && // check if row exists first, otherwise access's undefined
        this.field[row - 1][col - 1] &&
        typeof (this.field[row - 1][col - 1]) === 'object'
      ) {
        return 'Not allowed, left upper left found';
      }

      // left middle left
      if (
        this.field[row] &&
        this.field[row][col - 1] &&
        typeof (this.field[row][col - 1]) === 'object'
      ) {
        return 'Not allowed, left middle left found';
      }

      // left bottom left
      if (
        this.field[row + 1] &&
        this.field[row + 1][col - 1] &&
        typeof (this.field[row + 1][col - 1])
      ) {
        return 'Not allowed, left bottom left found';
      }
      return true;
    }

    else if (mode === 'vertical') {
      // checks the upper left, upper middle, upper right
      const row = startingPoint[0];
      const col = startingPoint[1];

      // upper left
      if (
        this.field[row - 1] &&
        this.field[row - 1][col - 1] &&
        typeof (this.field[row - 1][col - 1]) === 'object'
      ) {
        return 'Not allowed, upper left found';
      }

      // upper middle
      if (
        this.field[row - 1] &&
        this.field[row - 1][col] &&
        typeof (this.field[row - 1][col]) === 'object'
      ) {
        return 'Not allowed, upper middle found';
      }

      // upper right
      if (
        this.field[row - 1] &&
        this.field[row - 1][col + 1] &&
        typeof (this.field[row - 1][col + 1]) === 'object'
      ) {
        return 'Not allowed, upper right found';
      }
    }
    return true;
  }

  checkProximityMiddle(startingPoint, ship, mode) {
    // checks for a ship for all the middle parts, after the first part and before the first
    if (mode === 'horizontal') {
      const row = startingPoint[0];
      const col = startingPoint[1];

      for (let i = 0; i < ship.length; i++) {
        // upper
        if (
          this.field[row - 1] &&
          this.field[row - 1][col + i] &&
          typeof (this.field[row - 1][col + i]) === 'object'
        ) {
          return 'Not allowed, upper part found';
        }
        // lower
        if (
          this.field[row + 1] &&
          this.field[row + 1][col + i] &&
          typeof (this.field[row + 1][col + i]) === 'object'
        ) {
          return 'Not allowed, lower part found';
        }
      }
      return true;
    }

    else if (mode === 'vertical') {
      const row = startingPoint[0];
      const col = startingPoint[1];

      for (let i = 0; i < ship.length; i++) {
        // left
        if (
          this.field[row + i] &&
          this.field[row + i][col - 1] &&
          typeof (this.field[row + i][col - 1]) === 'object'
        ) {
          return 'Not allowed, left side found';
        }
        // righ
        if (
          this.field[row + i] &&
          this.field[row + i][col + 1] &&
          typeof (this.field[row + i][col + 1]) === 'object'
        ) {
          return 'Not allowed, right side found';
        }
      }
      return true;
    }
    return true;
  }

  checkProximityLast(startingPoint, ship, mode) {
    // checks the right upper right, right middle right, right middle right
    // needs ship arg to calculate the end point location of the ship, to increase the column
    if (mode === 'horizontal') {
      const endPoint = ship.length - 1;
      const row = startingPoint[0];
      const col = startingPoint[1] + endPoint;

      // right upper right
      if (
        this.field[row - 1] &&
        this.field[row - 1][col + 1] &&
        typeof (this.field[row - 1][col + 1]) === 'object'
      ) {
        return 'Not allowed, right upper right found';
      }
      // right middle right
      if (
        this.field[row] &&
        this.field[row][col + 1] &&
        typeof (this.field[row][col + 1]) === 'object'
      ) {
        return 'Not allowed, right middle right found';
      }
      // right bottom right
      if (
        this.field[row + 1] &&
        this.field[row + 1][col + 1] &&
        typeof (this.field[row + 1][col + 1]) === 'object'
      ) {
        return 'Not allowed, right bottom right found';
      }
      return true;
    }

    else if (mode === 'vertical') {
      const endPoint = ship.length - 1;
      const row = startingPoint[0] + endPoint;
      const col = startingPoint[1];

      // bottom left
      if (
        this.field[row + 1] &&
        this.field[row + 1][col - 1] &&
        typeof (this.field[row + 1][col - 1]) === 'object'
      ) {
        return 'Not allowed, bottom left found';
      }
      // bottom middle
      if (
        this.field[row + 1] &&
        this.field[row + 1][col] &&
        typeof (this.field[row + 1][col]) === 'object'
      ) {
        return 'Not allowed, bottom middle found';
      }
      // bottom right
      if (
        this.field[row + 1] &&
        this.field[row + 1][col + 1] &&
        typeof (this.field[row + 1][col + 1]) === 'object'
      ) {
        return 'Not allowed, bottom right found';
      }
    }
    return true;
  }

  placementAllowed(ship, location, mode = 'horizontal') {
    // checks if the ship would be placed out of bounds
    // also checks for ships in close proximity (a one square radius all around the ship)
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
      // check left
      if (this.checkProximityFirst(location, mode) !== true) {
        return this.checkProximityFirst(location, mode);
      }

      // check middle
      if (this.checkProximityMiddle(location, ship, mode) !== true) {
        return this.checkProximityMiddle(location, ship, mode);
      }

      // check right
      if (this.checkProximityLast(location, ship, mode) !== true) {
        return this.checkProximityLast(location, ship, mode);
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
      // check left
      if (this.checkProximityFirst(location, mode) !== true) {
        return this.checkProximityFirst(location, mode);
      }

      // check middle
      if (this.checkProximityMiddle(location, ship, mode) !== true) {
        return this.checkProximityMiddle(location, ship, mode);
      }

      // check right
      if (this.checkProximityLast(location, ship, mode) !== true) {
        return this.checkProximityLast(location, ship, mode);
      }

      return true;
    }
    return 'Success';
  }

  placeShip(ship, location, mode = 'horizontal') {
    // places a ship at the given location, checks whether the placement is allowed
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
    return 'Success';
  }

  receiveAttack(coordinates) {
    // allows for a ship to be attacked and reduce its hitpoints, also considers misses
    const row = parseInt(coordinates[0], 10);
    const col = parseInt(coordinates[1], 10);
    const field = this.field[row][col];
    // if the space is already hit, return "Can't hit an already hit spot"
    if (field === 'miss' || field === 'hit') {
      return "Can't hit an already attacked spot";
    }
    // if the space is empty, change this.[row][col] to 'miss'
    if (field === '') {
      this.field[row][col] = 'miss';
    }
    // if there is a ship, save ship to var
    if (typeof (field) === 'object') {
      const ship = field;
      // send a hit attack to that ship
      ship.hit();

      // HIT SURROUNDINGS, if ship sank
      if (ship.sunk === true) {
        const startingLocation = this.determineStartingPoint([row, col]);
        this.hitSurroundings(startingLocation, ship);
      }

      // change the coords to 'hit'
      this.field[row][col] = 'hit';
    }
    return 'Success';
  }
}

module.exports = Gameboard;
