import './styles/main.css';
import GUI from './dom/gui';
import ShipPlacement from './dom/shipPlacement';
import Player from './js/player';
import AI from './js/ai';
import Gameboard from './js/gameboard';

// create placeholder for placing ships
const gameboard1 = new Gameboard();
const player1 = new Player('player1', gameboard1);
const field1 = document.querySelector('.field1');
const turnBoard = document.querySelector('.turnBoard');
const displayGui = new GUI(player1, null, field1, null, turnBoard);

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

    const newField1 = document.querySelector('.field1');
    const newField2 = document.querySelector('.field2');
    const gui = new GUI(player1, new AI(new Gameboard()), newField1, newField2, turnBoard);
    gui.displayFieldPlayer1();
    gui.displayFieldPlayer2();
    gui.startGame();
    gui.displayBoardMessage('Attack!');
    gui.placeRandomShipsAI();
    gui.addShipImages(arrAllShipObjects);
  }
});
