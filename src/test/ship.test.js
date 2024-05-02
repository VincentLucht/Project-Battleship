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

test('Hitting another ship enough times, sinks the other ship', () => {
  const aircraftCarrier = new Ship(5);
  const patrolBoat = new Ship(2);

  aircraftCarrier.hit(patrolBoat);
  aircraftCarrier.hit(patrolBoat);

  expect(patrolBoat.length).toBe(2);
  expect(patrolBoat.timesHit).toBe(2);
  expect(patrolBoat.sunk).toBe(true);
});
