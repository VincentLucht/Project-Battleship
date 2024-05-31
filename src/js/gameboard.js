class Gameboard {
  constructor() {
    this.field = [
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', ''],
    ];
  }

  checkField(rowOffset, colOffset, additionalArgument = false) {
    // helper function to check if field exists and if it is an object
    if (!additionalArgument) {
      return (
        this.field[rowOffset] &&
        this.field[rowOffset][colOffset] &&
        typeof (this.field[rowOffset][colOffset]) === 'object'
      );
    }
    else {
      return (
        this.field[rowOffset] &&
        this.field[rowOffset][colOffset] &&
        (typeof (this.field[rowOffset][colOffset]) === 'object' || this.field[rowOffset][colOffset] === 'hit')
      );
    }
  }

  determineMode(startingPoint) {
    // checks the mode of the ship that is in the coordinates
    const row = startingPoint[0];
    const col = startingPoint[1];

    if (this.checkField(row, col + 1, true)) { // horizontal right
      return 'horizontal';
    }
    if (this.checkField(row, col - 1, true)) { // horizontal left
      return 'horizontal';
    }

    if (this.checkField(row + 1, col, true)) { // vertical upper
      return 'vertical';
    }
    if (this.checkField(row - 1, col, true)) { // vertical lower
      return 'vertical';
    }

    return 'No mode determined';
  }

  determineStartingPoint(coordinates) {
    // determines the starting point of the ship
    const [row, col] = coordinates;
    const mode = this.determineMode([row, col]);

    let foundStandingPoint = false;
    let startingPoint = [row, col]; // default starting point in case it's the first one hit

    if (mode === 'horizontal') {
      // go as far left as possible
      let i = 0;
      while (foundStandingPoint !== true) {
        i += 1;
        if (this.checkField(row, col - i, true)) {
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
        if (this.checkField(row - i, col, true)) {
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

  checkAndMiss(rowOffset, colOffset) {
    if (this.field[rowOffset] && (this.field[rowOffset][colOffset] === '' || this.field[rowOffset][colOffset] === 'miss')) {
      this.field[rowOffset][colOffset] = 'miss';
    }
  }

  hitSurroundingsFirst(row, col, mode) {
    // assigns 'miss' to the surroundings of the first part of the ship

    if (mode === 'horizontal') {
      this.checkAndMiss(row - 1, col - 1); // left upper left
      this.checkAndMiss(row, col - 1); // left middle left
      this.checkAndMiss(row + 1, col - 1); // left bottom left
    }

    else if (mode === 'vertical') {
      this.checkAndMiss(row - 1, col - 1); // upper left
      this.checkAndMiss(row - 1, col); // upper middle
      this.checkAndMiss(row - 1, col + 1); // upper right
    }
  }

  hitSurroundingsMiddle(row, col, mode, ship) {
    // assigns 'miss' to the middle part of the ship, one after the first, one before the last
    if (mode === 'horizontal') {
      for (let i = 0; i < ship.length; i++) {
        this.checkAndMiss(row - 1, col + i); // upper
        this.checkAndMiss(row + 1, col + i); // lower
      }
    }
    else if (mode === 'vertical') {
      for (let i = 0; i < ship.length; i++) {
        this.checkAndMiss(row + i, col - 1); // left
        this.checkAndMiss(row + i, col + 1); // right
      }
    }
  }

  hitSurroundingsLast(startingPoint, mode, ship) {
    // assigns 'miss' to the surroundings of the last part of the ship
    const endPoint = ship.length - 1;

    if (mode === 'horizontal') {
      const row = startingPoint[0];
      const col = startingPoint[1] + endPoint;

      this.checkAndMiss(row - 1, col + 1); // right upper right
      this.checkAndMiss(row, col + 1); // right middle right
      this.checkAndMiss(row + 1, col + 1); // right bottom right
    }

    else if (mode === 'vertical') {
      const row = startingPoint[0] + endPoint;
      const col = startingPoint[1];

      this.checkAndMiss(row + 1, col - 1);// bottom left
      this.checkAndMiss(row + 1, col); // bottom middle
      this.checkAndMiss(row + 1, col + 1); // bottom right
    }
  }

  hitSurroundings(coordinates, ship) {
    // if a ship is sunk, it hits the surrounding areas
    const row = coordinates[0];
    const col = coordinates[1];
    const mode = this.determineMode(coordinates);

    this.hitSurroundingsFirst(row, col, mode);
    this.hitSurroundingsMiddle(row, col, mode, ship);
    this.hitSurroundingsLast(coordinates, mode, ship);
  }

  checkProximityFirst(startingPoint, mode) {
    // checks if there any ships on the first part of the ship
    const [row, col] = startingPoint;

    if (mode === 'horizontal') {
      // checks the left upper left, left middle left, left bottom left

      if (this.checkField(row - 1, col - 1)) { // left upper left
        return 'Not allowed, left upper left found';
      }
      if (this.checkField(row, col - 1)) { // left middle left
        return 'Not allowed, left middle left found';
      }
      if (this.checkField(row + 1, col - 1)) { // left bottom left
        return 'Not allowed, left bottom left found';
      }
    }
    else if (mode === 'vertical') {
      // checks the upper left, upper middle, upper right

      if (this.checkField(row - 1, col - 1)) { // upper left
        return 'Not allowed, upper left found';
      }
      if (this.checkField(row - 1, col)) { // upper middle
        return 'Not allowed, upper middle found';
      }
      if (this.checkField(row - 1, col + 1)) { // upper right
        return 'Not allowed, upper right found';
      }
    }
    return true;
  }

  checkProximityMiddle(startingPoint, ship, mode) {
    // checks for a ship for all the middle parts, after the first part and before the first
    const [row, col] = startingPoint;

    if (mode === 'horizontal') {
      for (let i = 0; i < ship.length; i++) {
        if (this.checkField(row - 1, col + i)) { // upper
          return 'Not allowed, upper part found';
        }
        if (this.checkField(row + 1, col + i)) { // lower
          return 'Not allowed, lower part found';
        }
      }
    }
    else if (mode === 'vertical') {
      for (let i = 0; i < ship.length; i++) {
        if (this.checkField(row + i, col - 1)) { // left
          return 'Not allowed, left side found';
        }
        if (this.checkField(row + i, col + 1)) { // right
          return 'Not allowed, right side found';
        }
      }
    }
    return true;
  }

  checkProximityLast(startingPoint, ship, mode) {
    // checks the right upper right, right middle right, right middle right
    // needs ship arg to calculate the end point location of the ship, to increase the column
    const endPoint = ship.length - 1;

    if (mode === 'horizontal') {
      const row = startingPoint[0];
      const col = startingPoint[1] + endPoint;

      if (this.checkField(row - 1, col + 1)) { // right upper right
        return 'Not allowed, right upper right found';
      }
      if (this.checkField(row, col + 1)) { // right middle right
        return 'Not allowed, right middle right found';
      }
      if (this.checkField(row + 1, col + 1)) { // right bottom right
        return 'Not allowed, right bottom right found';
      }
    }
    else if (mode === 'vertical') {
      const row = startingPoint[0] + endPoint;
      const col = startingPoint[1];

      if (this.checkField(row + 1, col - 1)) { // bottom left
        return 'Not allowed, bottom left found';
      }
      if (this.checkField(row + 1, col)) { // bottom middle
        return 'Not allowed, bottom middle found';
      }
      if (this.checkField(row + 1, col + 1)) { // bottom right
        return 'Not allowed, bottom right found';
      }
    }
    return true;
  }

  placementAllowed(ship, location, mode = 'horizontal') {
    // checks if the ship would be placed out of bounds
    // also checks for ships in close proximity (a one square radius all around the ship)
    const [row, col] = location;
    if (mode === 'horizontal') {
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
      if (this.checkProximityFirst(location, mode) !== true) {
        return this.checkProximityFirst(location, mode);
      }
      if (this.checkProximityMiddle(location, ship, mode) !== true) {
        return this.checkProximityMiddle(location, ship, mode);
      }
      if (this.checkProximityLast(location, ship, mode) !== true) {
        return this.checkProximityLast(location, ship, mode);
      }

      return true;
    }

    else if (mode === 'vertical') {
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
      if (this.checkProximityFirst(location, mode) !== true) {
        return this.checkProximityFirst(location, mode);
      }
      if (this.checkProximityMiddle(location, ship, mode) !== true) {
        return this.checkProximityMiddle(location, ship, mode);
      }
      if (this.checkProximityLast(location, ship, mode) !== true) {
        return this.checkProximityLast(location, ship, mode);
      }

      return true;
    }
    return 'Success';
  }

  placeShip(ship, location, mode = 'horizontal') {
    // places a ship at the given location, checks whether the placement is allowed
    const [row, col] = location;
    if (mode === 'horizontal') {
      if (this.placementAllowed(ship, location) === true) {
        for (let i = 0; i < ship.length; i++) {
          // then for every i, place the the ship to coordinates
          this.field[row][col + i] = ship;
        }
      }
      else {
        return this.placementAllowed(ship, location);
      }
    }

    else if (mode === 'vertical') {
      if (this.placementAllowed(ship, location, 'vertical') === true) {
        for (let i = 0; i < ship.length; i++) {
          // place ship on location and increment by i
          this.field[row + i][col] = ship;
        }
      }
      else {
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

    if (field === 'miss' || field === 'hit') {
      return "Can't hit an already attacked spot";
    }
    if (field === '') {
      this.field[row][col] = 'miss';
    }
    if (typeof (field) === 'object') {
      const ship = field;
      ship.hit();

      if (ship.sunk === true) {
        const startingLocation = this.determineStartingPoint([row, col]);
        this.hitSurroundings(startingLocation, ship);
      }

      this.field[row][col] = 'hit';
    }
    return 'Success';
  }
}

module.exports = Gameboard;
