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
const mockGameboard = new Gameboard();
const mockShip = new Ship(4);
const mockAI = new AI(mockGameboard);

mockGameboard.placeShip(mockShip, [2, 2], 'vertical');

// remember the base location of the hit
mockAI.rememberFirstHitCoordinates([4, 2]);
// remember the ship
mockAI.rememberShip([4, 2]);
// attack that spot
mockGameboard.receiveAttack([4, 2]);

// it's still the AI's turn, it "randomly" attacks up
const nextAttackCoordinates = mockAI.getNextAttackCoordinates(mockAI.firstHitCoordinates, 1);

mockGameboard.receiveAttack(nextAttackCoordinates);
mockAI.shipSank();

console.log(mockAI.firstHitCoordinates);
console.log(mockGameboard.field);
