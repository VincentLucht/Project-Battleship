const Ship = require('../js/ship');

test('Creating ships of different sizes', () => {
  const aircraftCarrier = new Ship(5);
  const battleship = new Ship(4);
  const submarine = new Ship(3);
  const destroyer = new Ship(3);
  const patrolBoat = new Ship(2);

  expect(aircraftCarrier.length).toBe(5);
  expect(battleship.length).toBe(4);
  expect(submarine.length).toBe(3);
  expect(destroyer.length).toBe(3);
  expect(patrolBoat.length).toBe(2);
});

test('Hitting a ship should increase timeshit, but not sink it', () => {
  const aircraftCarrier = new Ship(5);

  aircraftCarrier.hit();
  aircraftCarrier.hit();

  expect(aircraftCarrier.length).toBe(5);
  expect(aircraftCarrier.timesHit).toBe(2);
  expect(aircraftCarrier.sunk).toBe(false);
});

test('Sinking a ship', () => {
  const patrolBoat = new Ship(2);

  patrolBoat.hit();
  patrolBoat.hit();

  expect(patrolBoat.timesHit).toBe(2);
  expect(patrolBoat.sunk).toBe(true);
});

test('Hitting a ship beyond its length', () => {
  const submarine = new Ship(3);

  submarine.hit();
  submarine.hit();
  submarine.hit();
  submarine.hit(); // Hit beyond its length

  expect(submarine.timesHit).toBe(3); // Times hit shouldn't exceed length
  expect(submarine.sunk).toBe(true); // Ship should be sunk
});

test('Multiple ships interactions', () => {
  const aircraftCarrier = new Ship(5);
  const battleship = new Ship(4);

  aircraftCarrier.hit();
  battleship.hit();
  battleship.hit();

  expect(aircraftCarrier.timesHit).toBe(1); // Aircraft carrier hit only once
  expect(battleship.timesHit).toBe(2); // Battleship hit twice
});
