const Gameboard = require('../js/gameboard');
const Ship = require('../js/ship');

const gameboard = new Gameboard();

describe('Testing the this.placeShip method, placing ships at different locations', () => {
  test('Placing a ship at a coordinate, horizontally', () => {
    // mock aircraft carrier ship
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
    mockGameboard.placeShip(patrolBoat, location2, 'vertical');

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

describe('Testing placing a ship in close proximity to each other, horizontal', () => {
  describe('this.checkProximityLeft(), checking for the left upper left, left middle left, left bottom left', () => {
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

    describe('this.checkProximityLeft() for out of bounds errors and placing at edges', () => {
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

  describe('this.checkProximityRight(), checking for the right upper right, right middle right, right middle right', () => {
    const placeSubmarine = (mockGameboard, coordinates) => {
      const submarine = new Ship(3);
      mockGameboard.placeShip(submarine, coordinates);
    };

    // function to test quicker
    const testShipPlacement = (submarineCoordinates, mockShipCoordinates, expectedMessage) => {
      const mockGameboard = new Gameboard();
      placeSubmarine(mockGameboard, submarineCoordinates);
      const mockShip = new Ship(2);
      expect(mockGameboard.placeShip(mockShip, mockShipCoordinates)).toBe(expectedMessage);
      expect(mockGameboard.field[mockShipCoordinates[0]][mockShipCoordinates[1]]).toBe('');
      expect(mockGameboard.field[mockShipCoordinates[0]][mockShipCoordinates[1] + 1]).toBe('');
    };

    test('this.checkProximityRight(), checking for the right upper right, right middle right, right bottom right', () => {
      testShipPlacement([1, 3], [2, 1], 'Not allowed, right upper right found');
      testShipPlacement([2, 3], [2, 1], 'Not allowed, right middle right found');
      testShipPlacement([3, 3], [2, 1], 'Not allowed, right bottom right found');
    });
  });
});

// describe('Testing placing a ship in close proximity to each other, Part 2', () => {
//   test('Allow placing ships with one space between, vertically', () => {
//     // standard tests
//     const mockGameboard = new Gameboard();
//     const aircraftCarrier = new Ship(5);
//     const patrolBoat = new Ship(2);
//     mockGameboard.placeShip(aircraftCarrier, [1, 4], 'vertical');
//     mockGameboard.placeShip(patrolBoat, [2, 6], 'vertical');

//     expect(mockGameboard.field[1][4]).toBe(aircraftCarrier);
//     expect(mockGameboard.field[2][4]).toBe(aircraftCarrier);
//     expect(mockGameboard.field[3][4]).toBe(aircraftCarrier);
//     expect(mockGameboard.field[4][4]).toBe(aircraftCarrier);
//     expect(mockGameboard.field[5][4]).toBe(aircraftCarrier);

//     expect(mockGameboard.field[2][6]).toBe(patrolBoat);
//     expect(mockGameboard.field[3][6]).toBe(patrolBoat);
//   });

//   test('Placing another ship in close proximity should not be allowed, vertically', () => {
//     // scenario one, both in middle
//     const mockGameboard = new Gameboard();
//     const patrolBoat1 = new Ship(2);
//     const patrolBoat2 = new Ship(2);

//     mockGameboard.placeShip(patrolBoat1, [3, 5], 'vertical');

//     expect(mockGameboard.placeShip(patrolBoat2, [4, 4], 'vertical')).toBe("Can't place ship here, another ship in close proximity");
//     expect(mockGameboard.field[4][4]).toBe('');
//     expect(mockGameboard.field[5][4]).toBe('');

//     expect(mockGameboard.field[3][5]).toBe(patrolBoat1);
//     expect(mockGameboard.field[4][5]).toBe(patrolBoat1);

//     const gameboardV = new Gameboard();
//     const patrolBoatV1 = new Ship(2);
//     const patrolBoatV2 = new Ship(3);

//     gameboardV.placeShip(patrolBoatV1, [1, 1], 'vertical');
//     expect(gameboardV.placeShip(patrolBoatV2, [2, 2], 'vertical')).toBe("Can't place ship here, another ship in close proximity");
//     expect(gameboardV.field[1][1]).toBe(patrolBoatV1);
//     expect(gameboardV.field[2][1]).toBe(patrolBoatV1);
//   });

//   test('Placing another ship in close proximity should not be allowed, horizontally', () => {
//     const mockGameboard = new Gameboard();
//     const patrolBoat1 = new Ship(2);
//     const patrolBoat2 = new Ship(2);

//     mockGameboard.placeShip(patrolBoat1, [7, 3]);

//     expect(mockGameboard.placeShip(patrolBoat2, [7, 5])).toBe("Can't place ship here, another ship in close proximity");

//     // expect patrol boat 1 to be placed
//     expect(mockGameboard.field[7][3]).toBe(patrolBoat1);
//     expect(mockGameboard.field[7][4]).toBe(patrolBoat1);
//     // expect other fields to be empty
//     expect(mockGameboard.field[7][5]).toBe('');
//     expect(mockGameboard.field[7][6]).toBe('');
//   });

//   test('Placing a ship in close proximity should not be allowed', () => {
//     const mockGameboard = new Gameboard();
//     const battleship = new Ship(4);
//     const destroyer = new Ship(3);

//     mockGameboard.placeShip(battleship, [3, 3], 'vertical');

//     expect(mockGameboard.placeShip(destroyer, [5, 4])).toBe("Can't place ship here, another ship in close proximity");

//     // expect the destroyer fields to be empty
//     expect(mockGameboard.field[5][4]).toBe('');
//     expect(mockGameboard.field[5][5]).toBe('');
//     expect(mockGameboard.field[5][6]).toBe('');

//     // expect other fields to be battleship
//     expect(mockGameboard.field[3][3]).toBe(battleship);
//     expect(mockGameboard.field[4][3]).toBe(battleship);
//     expect(mockGameboard.field[5][3]).toBe(battleship);
//     expect(mockGameboard.field[6][3]).toBe(battleship);
//   });

//   test('Placing another ship near a ship should not be allowed, horizontally and vertically should not make a difference', () => {
//     const mockGameboard = new Gameboard();
//     const patrolBoatH1 = new Ship(2);
//     const patrolBoatH2 = new Ship(2);

//     // horizontal, placing ship, only patrolBoatH1 allowed, other spaces should be empty
//     mockGameboard.placeShip(patrolBoatH1, [7, 2]);
//     expect(mockGameboard.field[7][2]).toBe(patrolBoatH1);
//     expect(mockGameboard.field[7][3]).toBe(patrolBoatH1);

//     expect(mockGameboard.placeShip(patrolBoatH2, [7, 4])).toBe("Can't place ship here, another ship in close proximity");
//     expect(mockGameboard.field[7][4]).toBe('');
//     expect(mockGameboard.field[7][5]).toBe('');

//     // vertical, placing ship
//     const patrolBoatV1 = new Ship(2);
//     const patrolBoatV2 = new Ship(2);
//     mockGameboard.placeShip(patrolBoatV1, [4, 7], 'vertical');
//     expect(mockGameboard.field[4][7]).toBe(patrolBoatV1);
//     expect(mockGameboard.field[5][7]).toBe(patrolBoatV1);

//     // place other ship, expect to not be allowed, and be empty
//     expect(mockGameboard.placeShip(patrolBoatV2, [4, 8], 'vertical')).toBe("Can't place ship here, another ship in close proximity");
//     expect(mockGameboard.field[4][8]).toBe('');
//     expect(mockGameboard.field[5][8]).toBe('');
//   });

//   test('Allow placing a ship in close proximity at the edges', () => {
//     const mockGameboard = new Gameboard();
//     const patrolBoat = new Ship(2);
//     const submarine = new Ship(3);

//     mockGameboard.placeShip(submarine, [7, 9], 'vertical');
//     mockGameboard.placeShip(patrolBoat, [9, 6]);

//     // expect both fields to be submarine and patrolBoat
//     expect(mockGameboard.field[7][9]).toBe(submarine);
//     expect(mockGameboard.field[8][9]).toBe(submarine);
//     expect(mockGameboard.field[9][9]).toBe(submarine);

//     expect(mockGameboard.field[9][6]).toBe(patrolBoat);
//     expect(mockGameboard.field[9][7]).toBe(patrolBoat);
//   });

//   test('Placing a ship in close proximity at the edges should not be allowed, horizontally and vertically', () => {
//     const mockGameboard = new Gameboard();
//     const patrolBoat = new Ship(2);
//     const submarine = new Ship(3);

//     mockGameboard.placeShip(submarine, [7, 9], 'vertical');

//     expect(mockGameboard.placeShip(patrolBoat, [9, 7])).toBe("Can't place ship here, another ship in close proximity");

//     // expect other fields to be submarine
//     expect(mockGameboard.field[7][9]).toBe(submarine);
//     expect(mockGameboard.field[8][9]).toBe(submarine);
//     expect(mockGameboard.field[9][9]).toBe(submarine);

//     // expect patrolBoat fields to be empty
//     expect(mockGameboard.field[9][7]).toBe('');
//     expect(mockGameboard.field[9][8]).toBe('');

//     // horizontal
//     const patrolBoat1 = new Ship(2);
//     const patrolBoat2 = new Ship(2);

//     mockGameboard.placeShip(patrolBoat1, [0, 8]);
//     expect(mockGameboard.field[0][8]).toBe(patrolBoat1);
//     expect(mockGameboard.field[0][9]).toBe(patrolBoat1);

//     // expect patrolBoat fields to be empty
//     expect(mockGameboard.placeShip(patrolBoat2, [1, 9], 'vertical')).toBe("Can't place ship here, another ship in close proximity");
//     expect(mockGameboard[1][9]).toBe('');
//     expect(mockGameboard[2][9]).toBe('');
//   });
// });

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
