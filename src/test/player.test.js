const Player = require('../js/player');
const Gameboard = require('../js/gameboard');

test('Creating a both players with type of "player" and "computer", also have to have their own gameboard', () => {
  const gameboardPlayer = new Gameboard();
  const gameboardComputer = new Gameboard();

  const player = new Player('player', gameboardPlayer);
  const computer = new Player('computer', gameboardComputer);

  expect(player.type).toBe('player');
  expect(computer.type).toBe('computer');
});

test('Both players must have a gameboard', () => {
  // Testing when both type and gameboard are provided
  expect(() => new Player('human', 'gameboard')).not.toThrow();

  // Testing when type is missing
  expect(() => new Player(undefined, 'gameboard')).toThrow(
    'Please create a gameboard for the user',
  );

  // Testing when gameboard is missing
  expect(() => new Player('human', undefined)).toThrow(
    'Please create a gameboard for the user',
  );

  // Testing when both type and gameboard are missing
  expect(() => new Player(undefined, undefined)).toThrow(
    'Please create a gameboard for the user',
  );
});
