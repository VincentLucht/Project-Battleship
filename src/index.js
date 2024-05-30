import './styles/main.css';
import GUI from './dom/gui';
import ShipPlacement from './dom/shipPlacement';
import Player from './js/player';
import AI from './js/ai';
import Gameboard from './js/gameboard';

const gameboard1 = new Gameboard();
const player1 = new Player('player1', gameboard1);
const field1 = document.querySelector('.field1');

const gameboard2 = new Gameboard();
const player2 = new AI(gameboard2);
const field2 = document.querySelector('.field2');

const turnBoard = document.querySelector('.turnBoard');

const displayGui = new GUI(player1, player2, field1, field2, turnBoard);

// Placing Ships
displayGui.displayFieldPlayer1();
displayGui.focusOnPlayerField();

const testGameboard = new Gameboard();
const shipPlacer = new ShipPlacement(testGameboard, field1);
shipPlacer.enableButtons();
shipPlacer.addEventListeners();

const startGameButton = document.querySelector('.startGame');
startGameButton.addEventListener('click', () => {
  if (shipPlacer.canStartGame) {
    // save info before deletion
    player1.gameboard = shipPlacer.convertGameboard();
    const arrAllShipObjects = shipPlacer.getAllShipsInfo();

    // remove everything from DOM
    shipPlacer.removeStartButton();
    shipPlacer.removeFieldWrapper();
    shipPlacer.createNewFields();

    const field11 = document.querySelector('.field1');
    const field22 = document.querySelector('.field2');
    const gui = new GUI(player1, player2, field11, field22, turnBoard);
    gui.displayFieldPlayer1();
    gui.displayFieldPlayer2();
    gui.startGame();
    gui.displayBoardMessage('Attack!');
    gui.placeRandomShipsAI();
    gui.addShipImages(arrAllShipObjects);
    console.log(player2.gameboard.field);
  }
});
