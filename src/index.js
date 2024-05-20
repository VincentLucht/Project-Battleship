import './styles/main.css';
import GUI from './dom/gui';
import Player from './js/player';
import AI from './js/ai';
import Gameboard from './js/gameboard';
import Ship from './js/ship';

const gameboard1 = new Gameboard();
const player1 = new Player('player1', gameboard1);
const field1 = document.querySelector('.field1');

const gameboard2 = new Gameboard();
const player2 = new AI(gameboard2);
const field2 = document.querySelector('.field2');

const turnBoard = document.querySelector('.turnBoard');

const gui = new GUI(player1, player2, field1, field2, turnBoard);
gui.placeDefaultShips(player1);
gui.placeDefaultShips(player2);
gui.displayField();

// AI testing
let player2Turn = true;
const mockGameboard = new Gameboard();
const mockAI = new AI(mockGameboard);

mockGameboard.placeShip(new Ship(5), [2, 2]);
mockGameboard.placeShip(new Ship(4), [5, 5]);
mockGameboard.placeShip(new Ship(3), [7, 3], 'vertical');
mockGameboard.placeShip(new Ship(2), [0, 8]);
mockGameboard.placeShip(new Ship(2), [9, 0]);

function simulateAiTurn() {
  if (player2Turn) {
    // get random attack coordinates
    const attackCoordinates = mockAI.getRandomCoordinates(); // random attack
    const rowAC = attackCoordinates[0];
    const colAC = attackCoordinates[1];

    // did it hit a ship?

    // yes
    if (typeof (mockAI.gameboard.field[rowAC][colAC]) === 'object') {
      // attack the ship
      mockAI.gameboard.receiveAttack(attackCoordinates);

      // remember coords
      mockAI.rememberHit(attackCoordinates);

      // get a random attack direction
      const randomDirection = mockAI.getRandomDirection();
      const newRow = rowAC + randomDirection.coordinates[0];
      const newCol = colAC + randomDirection.coordinates[1];

      // remove the random attack direction so that it won't attack there again
      mockAI.deleteDirection(randomDirection.direction);

      // attack the adjacent spot
      // did it hit?

      // yes
      if (typeof (mockAI.gameboard.field[newRow][newCol]) === 'object') {
        // attack the ship
        mockAI.gameboard.receiveAttack([newRow, newCol]);
        // remove from available moves
      }
      // no
      else if (mockAI.gameboard.field[newRow][newCol] === 'miss' || mockAI.gameboard.field[newRow][newCol] === '') {
        mockAI.gameboard.receiveAttack([newRow, newCol]);
        // end player 2 turn
        player2Turn = false;
      }
    }

    // no
    else if (mockAI.gameboard.field[rowAC][colAC] === '' || mockAI.gameboard.field[rowAC][colAC] === 'miss') {
      console.log('Ship missed');
      mockAI.gameboard.receiveAttack([rowAC, colAC]);
      // end player 2 turn
      player2Turn = false;
    }

    console.log(mockAI.gameboard.field);

    simulateAiTurn();
  }
}

simulateAiTurn();
