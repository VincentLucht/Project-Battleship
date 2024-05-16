import './styles/main.css';
import GUI from './dom/gui';
import Player from './js/player';
import Gameboard from './js/gameboard';

const gameboard1 = new Gameboard();
const player1 = new Player('player1', gameboard1);
const field1 = document.querySelector('.field1');

const gameboard2 = new Gameboard();
const player2 = new Player('player2', gameboard2);
const field2 = document.querySelector('.field2');

const turnBoard = document.querySelector('.turnBoard');

const gui = new GUI(player1, player2, field1, field2, turnBoard);
gui.placeDefaultShips(player1);
gui.placeDefaultShips(player2);
gui.displayField();
