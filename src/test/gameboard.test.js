const Gameboard = require('../js/gameboard');
const Ship = require('../js/ship');

const gameboard = new Gameboard();

describe('Testing the this.placeShip method, placing ships at different locations', () => {
  test('Placing a ship at a coordinate, horizontally', () => {
    const aircraftCarrier = new Ship(5);
    const location = [0, 0];
    gameboard.placeShip(aircraftCarrier, location);

    expect(gameboard.field[0][0]).toBe(aircraftCarrier);
    expect(gameboard.field[0][1]).toBe(aircraftCarrier);
    expect(gameboard.field[0][2]).toBe(aircraftCarrier);
    expect(gameboard.field[0][3]).toBe(aircraftCarrier);
    expect(gameboard.field[0][4]).toBe(aircraftCarrier);
  });

  test('Placing a ship at a coordinate, vertically', () => {
    const battleship = new Ship(3);
    const location = [3, 4];
    gameboard.placeShip(battleship, location, 'vertical');

    expect(gameboard.field[3][4]).toBe(battleship);
    expect(gameboard.field[4][4]).toBe(battleship);
    expect(gameboard.field[5][4]).toBe(battleship);
  });

  test('Placing a ship at the edges of the field, horizontally and vertically', () => {
    const mockGameboard = new Gameboard();
    const patrolBoat = new Ship(2);
    const location1 = [8, 9];
    const location2 = [8, 1];
    mockGameboard.placeShip(patrolBoat, location1, 'vertical');
    mockGameboard.placeShip(patrolBoat, location2, 'horizontal');

    expect(mockGameboard.field[8][9]).toBe(patrolBoat);
    expect(mockGameboard.field[8][1]).toBe(patrolBoat);
  });

  test('Placing a ship at the end of the coordinate that is not allowed, horizontally', () => {
    const patrolBoat = new Ship(2);
    const location1 = [6, 9];
    const location2 = [9, 9];

    expect(gameboard.placeShip(patrolBoat, location1)).toBe('Placement not allowed, must be inside of field');
    expect(gameboard.placeShip(patrolBoat, location2)).toBe('Placement not allowed, must be inside of field');

    // expect the locations to be empty!
    expect(gameboard.field[6][9]).toBe('');
    expect(gameboard.field[9][9]).toBe('');
  });

  test('Placing a ship at the end of the coordinate that is not allowed, vertically', () => {
    const submarine = new Ship(3);
    const location = [9, 9];
    const location2 = [8, 2];

    expect(gameboard.placeShip(submarine, location, 'vertical')).toBe('Placement not allowed, must be inside of field');
    expect(gameboard.placeShip(submarine, location2, 'vertical')).toBe('Placement not allowed, must be inside of field');

    // expect the locations to be empty!
    expect(gameboard.field[9][9]).toBe('');
    expect(gameboard.field[8][2]).toBe('');
  });

  test('Placing a ship inside of another ship, horizontally and vertically', () => {
    const mockGameboard = new Gameboard();
    const aircraftCarrier = new Ship(5);
    mockGameboard.placeShip(aircraftCarrier, [0, 0]);

    const submarine = new Ship(3);
    const location = [0, 0];
    const location2 = [0, 4];
    const location3 = [0, 2];

    expect(mockGameboard.placeShip(submarine, location)).toBe("Can't place ship here, another ship already here");
    expect(mockGameboard.placeShip(submarine, location2)).toBe("Can't place ship here, another ship already here");
    expect(mockGameboard.placeShip(submarine, location3)).toBe("Can't place ship here, another ship already here");

    // expect the locations to still contain the aircraft carrier!
    expect(mockGameboard.field[0][0]).toBe(aircraftCarrier);
    expect(mockGameboard.field[0][4]).toBe(aircraftCarrier);
    expect(mockGameboard.field[0][2]).toBe(aircraftCarrier);

    // vertical stuff
    const verticalBoard = new Gameboard();
    const patrolBoat1 = new Ship(2);
    const patrolBoat2 = new Ship(2);

    verticalBoard.placeShip(patrolBoat1, [0, 0], 'vertical');

    expect(gameboard.placeShip(patrolBoat2, [0, 0], 'vertical')).toBe("Can't place ship here, another ship already here");
  });
});

describe('Horizontally placing a ship in close proximity to each other', () => {
  describe('this.checkProximityFirst(), checking for the left upper left, left middle left, left bottom left', () => {
    test('Checking for each checkProximityLeft() function return value', () => {
      // check the left upper left
      const gameboard1 = new Gameboard();
      const submarine1 = new Ship(3);
      const mockShip1 = new Ship(2);

      gameboard1.placeShip(submarine1, [1, 3]);
      expect(gameboard1.placeShip(mockShip1, [2, 6])).toBe('Not allowed, left upper left found');
      expect(gameboard1.field[2][6]).toBe('');
      expect(gameboard1.field[2][7]).toBe('');

      // check the left middle left
      const gameboard2 = new Gameboard();
      const submarine2 = new Ship(3);
      const mockShip2 = new Ship(2);

      gameboard2.placeShip(submarine2, [2, 3]);
      expect(gameboard2.placeShip(mockShip2, [2, 6])).toBe('Not allowed, left middle left found');
      expect(gameboard2.field[2][6]).toBe('');
      expect(gameboard2.field[2][7]).toBe('');

      // check the left bottom left
      const gameboard3 = new Gameboard();
      const submarine3 = new Ship(3);
      const mockShip3 = new Ship(2);

      gameboard3.placeShip(submarine3, [3, 3]);
      expect(gameboard3.placeShip(mockShip3, [2, 6])).toBe('Not allowed, left bottom left found');
      expect(gameboard3.field[2][6]).toBe('');
      expect(gameboard3.field[2][7]).toBe('');
    });

    describe('Checking for out of bounds errors and placing at edges', () => {
      test('Placing a ship at the lop left edge is allowed', () => {
        const mockGameboard = new Gameboard();
        const patrolBoat = new Ship(2);

        mockGameboard.placeShip(patrolBoat, [0, 0]);
        expect(mockGameboard.field[0][0]).toBe(patrolBoat);
        expect(mockGameboard.field[0][1]).toBe(patrolBoat);
      });

      test('Placing a ship at the bottom left edge is allowed', () => {
        const mockGameboard = new Gameboard();
        const patrolBoat = new Ship(2);

        mockGameboard.placeShip(patrolBoat, [0, 0]);
        expect(mockGameboard.field[0][0]).toBe(patrolBoat);
        expect(mockGameboard.field[0][1]).toBe(patrolBoat);
      });

      test('Placing a ship at the top right edge is allowed', () => {
        const mockGameboard = new Gameboard();
        const patrolBoat = new Ship(2);

        mockGameboard.placeShip(patrolBoat, [0, 8]);
        expect(mockGameboard.field[0][8]).toBe(patrolBoat);
        expect(mockGameboard.field[0][9]).toBe(patrolBoat);
      });

      test('Placing a ship at the bottom right edge is allowed', () => {
        const mockGameboard = new Gameboard();
        const patrolBoat = new Ship(2);

        mockGameboard.placeShip(patrolBoat, [9, 8]);
        expect(mockGameboard.field[9][8]).toBe(patrolBoat);
        expect(mockGameboard.field[9][9]).toBe(patrolBoat);
      });
    });
  });

  const placeSubmarine = (mockGameboard, coordinates) => {
    const submarine = new Ship(3);
    mockGameboard.placeShip(submarine, coordinates);
  };

  // function to test quicker
  // eslint-disable-next-line max-len
  const testShipPlacement = (actualCoordinates, mockShipCoordinates, expectedMessage, mockShipLength = 2) => {
    const mockGameboard = new Gameboard();
    placeSubmarine(mockGameboard, actualCoordinates);
    const mockShip = new Ship(mockShipLength);
    expect(mockGameboard.placeShip(mockShip, mockShipCoordinates)).toBe(expectedMessage);
    for (let i = 0; i < mockShipLength; i++) {
      expect(mockGameboard.field[mockShipCoordinates[0]][mockShipCoordinates[1] + i]).toBe('');
    }
  };

  describe('this.checkProximityMiddle(), checking for upper and lower, for each ', () => {
    test('Checking for upper of all of ship.length', () => {
      // order check: first, middle, end
      testShipPlacement([2, 2], [3, 2], 'Not allowed, upper part found', 3);
      testShipPlacement([2, 2], [3, 1], 'Not allowed, upper part found', 3);
      testShipPlacement([2, 2], [3, 0], 'Not allowed, upper part found', 3);
    });

    test('Checking for the lower of all of ship.length', () => {
      testShipPlacement([3, 2], [2, 2], 'Not allowed, lower part found', 3);
      testShipPlacement([3, 2], [2, 1], 'Not allowed, lower part found', 3);
      testShipPlacement([3, 2], [2, 0], 'Not allowed, lower part found', 3);
    });

    describe('Checking for out of bound errors', () => {
      test('Lower left edge, check for lower', () => {
        testShipPlacement([1, 7], [0, 7], 'Not allowed, lower part found', 3);
      });
      test('Lower left edge, check for lower', () => {
        testShipPlacement([1, 7], [0, 6], 'Not allowed, lower part found', 3);
      });

      test('Lower left edge, check for upper', () => {
        testShipPlacement([8, 0], [9, 0], 'Not allowed, upper part found', 3);
      });
      test('Lower left edge, check for upper', () => {
        testShipPlacement([8, 0], [9, 0], 'Not allowed, upper part found', 3);
      });
    });
  });

  describe('this.checkProximityRight(), checking for the right upper right, right middle right, right middle right', () => {
    test('this.checkProximityRight(), checking for the right upper right, right middle right, right bottom right', () => {
      testShipPlacement([1, 3], [2, 1], 'Not allowed, right upper right found');
      testShipPlacement([2, 3], [2, 1], 'Not allowed, right middle right found');
      testShipPlacement([3, 3], [2, 1], 'Not allowed, right bottom right found');
    });
    describe('Checking for out of bound errors', () => {
      test('Right edge, expect no error', () => {
        const mock1 = new Gameboard();
        const submarine = new Ship(3);
        expect(mock1.placeShip(submarine, [4, 7])).toBe('Success');
      });
    });
  });
});

describe('Vertically placing ships in close proximity', () => {
  // function to test quicker, but for vertical
  const testShipPlacementVertical = (
    actualCoordinates,
    detectingShipCoordinates,
    expectedMessage,
    checkPlacement = true,
    actualShipLength = 2,
    detectingShipLength = 3,
    actualShipMode = 'vertical',
  ) => {
    const newGameboard = new Gameboard();
    const placedShip = new Ship(actualShipLength);
    newGameboard.placeShip(placedShip, actualCoordinates, actualShipMode);

    const detectingShip = new Ship(detectingShipLength);
    expect(newGameboard.placeShip(detectingShip, detectingShipCoordinates, 'vertical')).toBe(expectedMessage);

    // expect the detecting ship to not have been placed
    if (checkPlacement === true) {
      for (let i = 0; i < detectingShipLength; i++) {
        expect(newGameboard.field[detectingShipCoordinates[0] + i][detectingShipCoordinates[1]]).toBe('');
      }
    }
  };

  describe('this.checkProximityFirst()', () => {
    test('Checking for the upper left, upper middle, upper right', () => {
      testShipPlacementVertical([0, 3], [2, 4], 'Not allowed, upper left found');
      testShipPlacementVertical([0, 4], [2, 4], 'Not allowed, upper middle found');
      testShipPlacementVertical([0, 5], [2, 4], 'Not allowed, upper right found');
    });

    describe('Check for out of bound errors', () => {
      test('Top left edge, top middle edge, top right edge', () => {
        testShipPlacementVertical([0, 0], [0, 3], 'Success', false, 2, 4);
        testShipPlacementVertical([0, 0], [0, 6], 'Success', false, 2, 1);
        testShipPlacementVertical([0, 0], [0, 9], 'Success', false, 2, 5);
      });
    });
  });

  describe('this.checkProximityMiddle()', () => {
    test('Checking for each of all of the left side', () => {
      testShipPlacementVertical([3, 2], [3, 4], 'Not allowed, left side found', true, 2, 3, 'horizontal');
      testShipPlacementVertical([4, 2], [3, 4], 'Not allowed, left side found', true, 2, 3, 'horizontal');
      testShipPlacementVertical([5, 2], [3, 4], 'Not allowed, left side found', true, 2, 3, 'horizontal');
    });

    test('Checking for each of all of the right side', () => {
      testShipPlacementVertical([3, 5], [3, 4], 'Not allowed, right side found', true, 2, 3, 'horizontal');
      testShipPlacementVertical([4, 5], [3, 4], 'Not allowed, right side found', true, 2, 3, 'horizontal');
      testShipPlacementVertical([5, 5], [3, 4], 'Not allowed, right side found', true, 2, 3, 'horizontal');
    });

    describe('Checking for out of bound errors', () => {
      test('Left edge and right edge', () => {
        testShipPlacementVertical([3, 1], [3, 0], 'Not allowed, right side found');
        testShipPlacementVertical([3, 8], [3, 9], 'Not allowed, left side found');
      });
    });
  });

  describe('this.checkProximityLast()', () => {
    test('Bottom left, bottom middle, bottom right', () => {
      testShipPlacementVertical([6, 3], [3, 4], 'Not allowed, bottom left found');
      testShipPlacementVertical([6, 4], [3, 4], 'Not allowed, bottom middle found');
      testShipPlacementVertical([6, 5], [3, 4], 'Not allowed, bottom right found');
    });

    describe('Checking for out of bound errors', () => {
      test('Bottom edge', () => {
        testShipPlacementVertical([0, 0], [7, 1], 'Success', false);
        testShipPlacementVertical([0, 0], [7, 5], 'Success', false);
        testShipPlacementVertical([0, 0], [7, 9], 'Success', false);
      });
    });
  });
});

// receiveAttack tests
describe('Testing this.receiveAttack method, hitting other ships', () => {
  test("Hitting a ship's coordinate should remove it and change it to hit", () => {
    const mockGameboard = new Gameboard();
    const aircraftCarrier = new Ship(5);

    mockGameboard.placeShip(aircraftCarrier, [9, 5]);
    mockGameboard.receiveAttack([9, 5]);

    expect(aircraftCarrier.timesHit).toBe(1);
    expect(mockGameboard.field[9][5]).toBe('hit');
  });

  test('Hitting an empty spot should change it to "miss"', () => {
    const mockGameboard = new Gameboard();
    const aircraftCarrier = new Ship(5);

    mockGameboard.placeShip(aircraftCarrier, [9, 5]);
    mockGameboard.receiveAttack([9, 5]);

    expect(aircraftCarrier.timesHit).toBe(1);
    expect(mockGameboard.field[9][5]).toBe('hit');

    mockGameboard.receiveAttack([9, 4]);
    expect(aircraftCarrier.timesHit).toBe(1);
    expect(mockGameboard.field[9][4]).toBe('miss');
  });

  test('Hitting an already hit spot, should not be allowed', () => {
    const mockGameboard = new Gameboard();
    const aircraftCarrier = new Ship(5);

    mockGameboard.placeShip(aircraftCarrier, [9, 5]);
    mockGameboard.receiveAttack([9, 5]);

    expect(aircraftCarrier.timesHit).toBe(1);
    expect(mockGameboard.field[9][5]).toBe('hit');

    expect(mockGameboard.receiveAttack([9, 5])).toBe("Can't hit an already attacked spot");
  });

  test('Hitting different ships on the gameboard', () => {
    const mockGameboard = new Gameboard();
    const ship1 = new Ship(4); // Create first ship
    const ship2 = new Ship(3); // Create second ship

    // Place ships on the gameboard
    mockGameboard.placeShip(ship1, [0, 0]);
    mockGameboard.placeShip(ship2, [5, 5]);

    // Attack coordinates where ships are placed
    mockGameboard.receiveAttack([0, 0]); // Hit ship1
    mockGameboard.receiveAttack([5, 5]); // Hit ship2

    // Verify that the ships were hit
    expect(ship1.timesHit).toBe(1);
    expect(ship2.timesHit).toBe(1);

    // Verify that the hit spots are marked as 'hit'
    expect(mockGameboard.field[0][0]).toBe('hit');
    expect(mockGameboard.field[5][5]).toBe('hit');
  });
});

describe('Sinking a ship should remove all the squares around it', () => {
  test('Placing the ships with different length', () => {
    const mockGameboard = new Gameboard();
    const aircraftCarrier = new Ship(5);
    const submarine = new Ship(3);

    // destroy both ships
    mockGameboard.placeShip(aircraftCarrier, [7, 3]);
    mockGameboard.receiveAttack([7, 3]);
    mockGameboard.receiveAttack([7, 4]);
    mockGameboard.receiveAttack([7, 5]);
    mockGameboard.receiveAttack([7, 6]);
    mockGameboard.receiveAttack([7, 7]);

    mockGameboard.placeShip(submarine, [3, 4]);
    mockGameboard.receiveAttack([3, 4]);
    mockGameboard.receiveAttack([3, 5]);
    mockGameboard.receiveAttack([3, 6]);

    // check top
    for (let i = 0; i < submarine.length + 1; i++) {
      expect(mockGameboard.field[2][3 + i]).toBe('miss');
    }
    // check left and right
    expect(mockGameboard.field[3][3]).toBe('miss');
    expect(mockGameboard.field[3][7]).toBe('miss');
    // check bottom
    for (let i = 0; i < submarine.length + 1; i++) {
      expect(mockGameboard.field[4][3 + i]).toBe('miss');
    }

    // check top
    for (let i = 0; i < aircraftCarrier.length + 1; i++) {
      expect(mockGameboard.field[6][2 + i]).toBe('miss');
    }
    // check left and right
    expect(mockGameboard.field[7][2]).toBe('miss');
    expect(mockGameboard.field[7][8]).toBe('miss');
    // check bottom
    for (let i = 0; i < aircraftCarrier.length + 1; i++) {
      expect(mockGameboard.field[8][2 + i]).toBe('miss');
    }
  });

  test('Placing the ships at the borders', () => {
    const mockGameboard = new Gameboard();
    const sub1 = new Ship(3);
    const sub2 = new Ship(3);

    mockGameboard.placeShip(sub1, [0, 9], 'vertical');
    mockGameboard.receiveAttack([0, 9]);
    mockGameboard.receiveAttack([1, 9]);
    mockGameboard.receiveAttack([2, 9]);

    // check left
    expect(mockGameboard.field[0][8]).toBe('miss');
    expect(mockGameboard.field[1][8]).toBe('miss');
    expect(mockGameboard.field[2][8]).toBe('miss');
    expect(mockGameboard.field[3][8]).toBe('miss');
    // check bottom
    expect(mockGameboard.field[3][9]).toBe('miss');

    mockGameboard.placeShip(sub2, [9, 0], 'horizontal');
    mockGameboard.receiveAttack([9, 0]);
    mockGameboard.receiveAttack([9, 1]);
    mockGameboard.receiveAttack([9, 2]);

    // check top
    expect(mockGameboard.field[8][0]).toBe('miss');
    expect(mockGameboard.field[8][1]).toBe('miss');
    expect(mockGameboard.field[8][2]).toBe('miss');
    expect(mockGameboard.field[8][3]).toBe('miss');
    // check right
    expect(mockGameboard.field[9][3]).toBe('miss');
  });
});
