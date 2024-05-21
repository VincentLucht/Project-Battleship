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
mockGameboard.placeShip(new Ship(5), [0, 0]);
mockGameboard.placeShip(new Ship(5), [2, 0], 'vertical');
mockGameboard.placeShip(new Ship(5), [7, 5]);
mockGameboard.placeShip(new Ship(5), [9, 5]);
mockGameboard.placeShip(new Ship(4), [5, 5]);
mockGameboard.placeShip(new Ship(3), [4, 2], 'vertical');
mockGameboard.placeShip(new Ship(3), [7, 3], 'vertical');
mockGameboard.placeShip(new Ship(2), [0, 8]);
mockGameboard.placeShip(new Ship(2), [9, 0]);

function simulateAiTurn() {
  // logs missed coords, attacks the board, deletes the direction and ends player2 turn
  const handleMiss = (row, col) => {
    console.log('Miss on coordinates: ', [row, col]);
    mockAI.gameboard.receiveAttack([row, col]);
    mockAI.deleteDirection(mockAI.attackDirection);
    player2Turn = false;
  };

  if (player2Turn) {
    return;
  }

  // does the AI have memory?
  // yes
  if (mockAI.firstHitCoordinates) {
    // does it have nextHitCoordinates?
    if (mockAI.nextHitCoordinates) {
      // remove from available moves
      console.log('I have memory');
      mockAI.removeFromAvailableMoves(mockAI.firstHitCoordinates);

      // does it hit?

      // add increment from attack direction
      const attackDirectionIncrement = mockAI.directions[mockAI.attackDirection];

      // CHECK IF COORDS EXIST FIRST!!!

      const [newRow, newCol] = [mockAI.nextHitCoordinates[0],
        mockAI.nextHitCoordinates[1]];

      console.log([newRow, newCol]);
      console.log(mockAI.gameboard.field[newRow][newCol]);

      // no, miss
      if (mockAI.gameboard.field[newRow][newCol] === 'miss' || mockAI.gameboard.field[newRow][newCol] === '') {
        console.log('missed');
        console.log('Previous direction: ', mockAI.attackDirection);
        // remove from available moves
        mockAI.removeFromAvailableMoves([newRow, newCol]);
        // attack board
        mockAI.gameboard.receiveAttack([newRow, newCol]);

        // get the opposite direction
        const oppositeDirection = mockAI.getOppositeDirection(mockAI.attackDirection);
        // set attackDirection to the opposite direction
        mockAI.attackDirection = oppositeDirection;
        // remove direction from this.directions
        mockAI.deleteDirection(mockAI.attackDirection);
        // set the nextHitCoordinates to undefined
        mockAI.clearNextHitCoordinates();
        // end player 2 turn
        player2Turn = false;

        console.log('I will attack this direction next: ', mockAI.attackDirection);
      }

      // yes, hit
      else if (typeof (mockAI.gameboard.field[newRow][newCol]) === 'object') {
        console.log('I ran too');
        mockAI.gameboard.receiveAttack([newRow, newCol]);
        // get the next coordinates
        const [nextRow, nexCol] = [newRow + attackDirectionIncrement[0],
          newCol + attackDirectionIncrement[1]];
          // save them to memory
        mockAI.nextHitCoordinates = [nextRow, nexCol];
        // recursive call
        simulateAiTurn();
      }
    }

    else if (!mockAI.nextHitCoordinates) {
      // attack another direction that is still available
      // const randomDirection = mockAI.getRandomDirection();
      // get attack coordinates from firstHitCoordinates
      // const attackDirectionIncrement = mockAI.directions[randomDirection.coordinates];

      // attack that, check for hit
      // if not
      // if (typeof (mockAI.gameboard.field[]))
      // if yes
    }
  }

  // no
  else if (!mockAI.firstHitCoordinates) {
    // get random attack coordinates
    const attackCoordinates = mockAI.getRandomCoordinates(); // random attack
    const rowAC = attackCoordinates[0];
    const colAC = attackCoordinates[1];

    // did the coordinates hit a ship?
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

      // remember the random attack direction
      mockAI.attackDirection = randomDirection.direction;

      // attack either up, down, left, right (the adjacent spot), did it hit
      // CHECK IF IT EXISTS FIRST !!!!!!!!!!!!!!!
      // yes (adjacent spot)
      if (typeof (mockAI.gameboard.field[newRow][newCol]) === 'object') {
        // attack the ship
        mockAI.gameboard.receiveAttack([newRow, newCol]);
        // remove from available moves
        mockAI.removeFromAvailableMoves([newRow, newCol]);

        // remember the attack direction
        mockAI.nextHitCoordinates = [
          newRow + randomDirection.coordinates[0],
          newCol + randomDirection.coordinates[1],
        ];
        // WATCH OUT! CAN BE OUT OF BOUNDS!

        console.log('Next hit at: ', mockAI.nextHitCoordinates);
        // recursive call
        simulateAiTurn();
      }

      // no (adjacent spot)
      else if (mockAI.gameboard.field[newRow][newCol] === 'miss' || mockAI.gameboard.field[newRow][newCol] === '') {
        mockAI.gameboard.receiveAttack([newRow, newCol]);
        // remove the random attack direction so that it won't attack there again
        mockAI.deleteDirection(randomDirection.direction);
        // end player 2 turn
        player2Turn = false;
      }
    }

    // no, did not hit a ship
    else if (mockAI.gameboard.field[rowAC][colAC] === '' || mockAI.gameboard.field[rowAC][colAC] === 'miss') {
      mockAI.gameboard.receiveAttack([rowAC, colAC]);
      // end player 2 turn
      player2Turn = false;
      // remove from possible moves
    }

    console.log(mockAI.gameboard.field);
  }
}

simulateAiTurn();
player2Turn = true;

simulateAiTurn();

console.log(mockAI.gameboard.field);
