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

  test('Placing a ship inside of another ship', () => {
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
  });
});

describe('Testing placing a ship in close proximity to each other', () => {
  test('Allow placing ships with one space between', () => {
    const mockGameboard = new Gameboard();
    const aircraftCarrier = new Ship(5);
    const patrolBoat = new Ship(2);
    mockGameboard.placeShip(aircraftCarrier, [1, 4], 'vertical');
    mockGameboard.placeShip(patrolBoat, [2, 6], 'vertical');

    expect(mockGameboard.field[1][4].toBe(aircraftCarrier));
    expect(mockGameboard.field[2][4].toBe(aircraftCarrier));
    expect(mockGameboard.field[3][4].toBe(aircraftCarrier));
    expect(mockGameboard.field[4][4].toBe(aircraftCarrier));
    expect(mockGameboard.field[5][4].toBe(aircraftCarrier));

    expect(mockGameboard.field[2][6]).toBe(patrolBoat);
    expect(mockGameboard.field[3][6]).toBe(patrolBoat);
  });

  test('Placing another ship near a ship should not be allowed', () => {
    const mockGameboard = new Gameboard();
    const patrolBoat1 = new Ship(2);
    const patrolBoat2 = new Ship(2);
    const patrolBoat3 = new Ship(2);

    // placing these two should cause no issues
    mockGameboard.placeShip(patrolBoat1, [3, 5], 'vertical');
    mockGameboard.placeShip(patrolBoat2, [4, 4], 'vertical');

    expect(mockGameboard.placeShip(patrolBoat3, [3, 5])).toBe("Can't place ship here, another ship in close proximity");
    expect(mockGameboard.field[3][5]).toBe('');
    expect(mockGameboard.field[3][6]).toBe('');

    expect(mockGameboard.field[2][2]).toBe(patrolBoat1);
    expect(mockGameboard.field[3][2]).toBe(patrolBoat1);

    expect(mockGameboard.field[4][4]).toBe(patrolBoat2);
    expect(mockGameboard.field[5][4]).toBe(patrolBoat2);
  });

  test('Placing a ship in close proximity should not be allowed', () => {
    const mockGameboard = new Gameboard();
    const battleship = new Ship(4);
    const destroyer = new Ship(3);

    mockGameboard.placeShip(battleship, [3, 3], 'vertical');

    expect(mockGameboard.placeShip(destroyer, [5, 4])).toBe("Can't place ship here, another ship in close proximity");

    expect(mockGameboard.field[5][4]).toBe('');
    expect(mockGameboard.field[5][5]).toBe('');
    expect(mockGameboard.field[5][6]).toBe('');

    expect(mockGameboard.field[3][3]).toBe(battleship);
    expect(mockGameboard.field[4][3]).toBe(battleship);
    expect(mockGameboard.field[5][3]).toBe(battleship);
    expect(mockGameboard.field[6][3]).toBe(battleship);
  });

  test('Placing another ship near a ship should not be allowed, horizontally and vertically should not make a difference', () => {
  });

  test('Placing a ship in close proximity at the edges', () => {
    const mockGameboard = new Gameboard();
    const patrolBoat = new Ship(2);
    const submarine = new Ship(3);

    mockGameboard.placeShip(submarine, [7, 9], 'vertical');
    mockGameboard.placeShip(patrolBoat, [9, 6]);

    expect(mockGameboard.field[7][9]).toBe(submarine);
    expect(mockGameboard.field[8][9]).toBe(submarine);
    expect(mockGameboard.field[9][9]).toBe(submarine);

    expect(mockGameboard.field[9][6]).toBe(patrolBoat);
    expect(mockGameboard.field[9][7]).toBe(patrolBoat);
  });

  test('Placing a ship in close proximity at the edges should not be allowed', () => {
    const mockGameboard = new Gameboard();
    const patrolBoat = new Ship(2);
    const submarine = new Ship(3);

    mockGameboard.placeShip(submarine, [7, 9], 'vertical');

    expect(mockGameboard.placeShip(patrolBoat, [9, 7])).toBe("Can't place ship here, another ship in close proximity");

    expect(mockGameboard.field[9][7]).toBe('');
    expect(mockGameboard.field[9][8]).toBe('');

    expect(mockGameboard.field[7][9]).toBe(submarine);
    expect(mockGameboard.field[8][9]).toBe(submarine);
    expect(mockGameboard.field[9][9]).toBe(submarine);
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
