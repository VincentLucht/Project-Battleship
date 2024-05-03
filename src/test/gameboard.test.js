const Gameboard = require('../js/gameboard');
const Ship = require('../js/ship');

const gameboard = new Gameboard();

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

// test("Hitting a ship's coordinate should remove it (or change it to hit?)");
