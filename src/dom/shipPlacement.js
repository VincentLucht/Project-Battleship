const Gameboard = require('../js/gameboard');
const Ship = require('../js/ship');

class ShipPlacement {
  constructor(gameboard, field) {
    this.gameboard = gameboard;
    this.field = field;
    this.placementMode = 'horizontal';
    this.draggedShip = null;
    this.canStartGame = false;
  }

  convertGameboard() {
    // converts the gameboard to use the actual ship class instead of the "fake ship" object
    const newGameboard = new Gameboard();
    const allShips = document.querySelectorAll('div[name]');
    for (let i = 0; i < allShips.length; i++) {
      const currentShip = allShips[i];
      const shipObject = JSON.parse(currentShip.getAttribute('shipobject'));
      const { length, currentPosition, mode } = shipObject;

      newGameboard.placeShip(new Ship(length), currentPosition, mode);
    }
    return newGameboard;
  }

  getAllShipsInfo() {
    // puts all ship objects into an array
    const allShips = document.querySelectorAll('div[name]');
    const arrAllShipObjects = [];
    for (let i = 0; i < allShips.length; i++) {
      const currentShip = allShips[i];
      const shipObject = JSON.parse(currentShip.getAttribute('shipobject'));
      arrAllShipObjects.push(shipObject);
    }
    return arrAllShipObjects;
  }

  areAllShipsPlaced() {
    let amountOfShips = 0;
    const REQUIREDAMOUNT = 23;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (typeof (this.gameboard.field[i][j]) === 'object') {
          amountOfShips += 1;
        }
      }
    }

    if (amountOfShips === REQUIREDAMOUNT) {
      return true;
    }
    else {
      return false;
    }
  }

  removeStartButton() {
    const startButton = document.querySelector('.startGame');
    startButton.remove();
  }

  removeFieldWrapper() {
    const fieldWrapper = document.querySelector('.fieldWrapper');
    while (fieldWrapper.firstChild) {
      fieldWrapper.removeChild(fieldWrapper.firstChild);
    }
  }

  createNewFields() {
    // creates new fields for both players
    const fieldWrapper = document.querySelector('.fieldWrapper');
    const field1 = document.createElement('div');
    const field2 = document.createElement('div');

    field1.classList.add('field1');
    field2.classList.add('field2');

    fieldWrapper.appendChild(field1);
    fieldWrapper.appendChild(field2);
  }

  startGame() {
    // changes the color of the startGame button and allows the game to start
    const startGameButton = document.querySelector('.startGame');
    if (this.areAllShipsPlaced()) {
      this.canStartGame = true;
      startGameButton.style.border = '3px solid rgb(7, 166, 7)';
      startGameButton.style.color = 'rgb(7, 166, 7)';
      startGameButton.classList.remove('startGameNoHover');
      startGameButton.classList.add('startGameHover');
    }
    else {
      startGameButton.style.border = '3px solid red';
      startGameButton.style.color = 'red';
    }
  }

  refreshGUI() {
    // loop through field and create a node list of all divs there
    const arrChildDivs = [];
    for (let i = 0; i < 100; i++) {
      const child = this.field.children[i];
      if (child.classList.contains('unselectable')) {
        arrChildDivs.push(child);
      }
    }

    // convert to a 2D array
    const arr2D = [];
    for (let i = 0; i < 10; i++) {
      const row = [];
      for (let j = 0; j < 10; j++) {
        row.push(arrChildDivs[i * 10 + j]);
      }
      arr2D.push(row);
    }

    // loop through the gameboard and assign the correct color to the field
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const field = this.gameboard.field[i][j];
        const GUIfield = arr2D[i][j];
        if (typeof (field) === 'object') {
          GUIfield.style.backgroundColor = 'orange';
        }
        else if (field === '') {
          GUIfield.style.backgroundColor = '';
        }
      }
    }
  }

  getShipName() {
    if (this.draggedShip && typeof this.draggedShip.getAttribute === 'function') {
      return this.draggedShip.getAttribute('name');
    }
    return null;
  }

  getShipLength() {
    if (this.draggedShip && typeof this.draggedShip.getAttribute === 'function') {
      const length = parseInt(this.draggedShip.getAttribute('length'), 10);
      return Number.isNaN(length) ? null : length;
    }
    return null;
  }

  getCoordinates(dropTarget, attributeName = 'coords') {
    const coordinates = dropTarget.getAttribute(attributeName);
    const row = parseInt(coordinates[0], 10);
    const col = parseInt(coordinates[2], 10);
    return [row, col];
  }

  isShipOutOfBounds(startingPoint) {
    const row = startingPoint[0];
    const col = startingPoint[1];

    if (this.placementMode === 'horizontal') {
      for (let i = 0; i < this.getShipLength(); i++) {
        if (this.gameboard.field[row][col + i] === undefined) {
          return true;
        }
      }
    }
    else {
      for (let i = 0; i < this.getShipLength(); i++) {
        if (this.gameboard.field[row + i] === undefined) {
          return true;
        }
      }
    }

    return false;
  }

  areAllShipsTheSame(arrAllShips) {
    // compares all the ship names of the surrounding ships to the current ship's name
    const shipName = this.getShipName();

    if (arrAllShips.length === 0) {
      return false;
    }

    if (arrAllShips.length !== 0) {
      for (let i = 0; i < arrAllShips.length; i++) {
        if (shipName !== arrAllShips[i].name) {
          return false;
        }
      }
    }

    return true;
  }

  checkField(rowOffset, colOffset) {
    // helper function to check if field exists and if it is an object
    return (
      this.gameboard.field[rowOffset] &&
      this.gameboard.field[rowOffset][colOffset] &&
      typeof (this.gameboard.field[rowOffset][colOffset]) === 'object'
    );
  }

  scanSurroundings(startingPoint) {
    // gets the surrounding gameboard fields and collects all ships in the proximity
    const row = startingPoint[0];
    const col = startingPoint[1];
    const shipsInProximity = [];

    const scanSurroundingsFirst = () => {
      if (this.placementMode === 'horizontal') {
        if (this.checkField(row - 1, col - 1)) {
          shipsInProximity.push(this.gameboard.field[row - 1][col - 1]);
        }

        if (this.checkField(row, col - 1)) {
          shipsInProximity.push(this.gameboard.field[row][col - 1]);
        }

        if (this.checkField(row + 1, col - 1)) {
          shipsInProximity.push(this.gameboard.field[row + 1][col - 1]);
        }
      }
      else {
        if (this.checkField(row - 1, col - 1)) {
          shipsInProximity.push(this.gameboard.field[row - 1][col - 1]);
        }

        if (this.checkField(row - 1, col)) {
          shipsInProximity.push(this.gameboard.field[row - 1][col]);
        }

        if (this.checkField(row - 1, col + 1)) {
          shipsInProximity.push(this.gameboard.field[row - 1][col + 1]);
        }
      }
    };

    const scanSurroundingsMiddle = () => {
      if (this.placementMode === 'horizontal') {
        for (let i = 0; i < this.getShipLength(); i++) {
          if (this.checkField(row - 1, col + i)) {
            shipsInProximity.push(this.gameboard.field[row - 1][col + i]);
          }
          if (this.checkField(row + 1, col + i)) {
            shipsInProximity.push(this.gameboard.field[row + 1][col + i]);
          }
        }
      }
      else {
        for (let i = 0; i < this.getShipLength(); i++) {
          if (this.checkField(row + i, col - 1)) {
            shipsInProximity.push(this.gameboard.field[row + i][col - 1]);
          }
          if (this.checkField(row + i, col + 1)) {
            shipsInProximity.push(this.gameboard.field[row + i][col + 1]);
          }
        }
      }
    };

    const scanSurroundingsLast = () => {
      if (this.placementMode === 'horizontal') {
        const endPoint = this.getShipLength() - 1;
        const rowOffset = startingPoint[0];
        const colOffset = startingPoint[1] + endPoint;

        if (this.checkField(rowOffset - 1, colOffset + 1)) {
          shipsInProximity.push(this.gameboard.field[rowOffset - 1][colOffset + 1]);
        }

        if (this.checkField(rowOffset, colOffset + 1)) {
          shipsInProximity.push(this.gameboard.field[rowOffset][colOffset + 1]);
        }

        if (this.checkField(rowOffset + 1, colOffset + 1)) {
          shipsInProximity.push(this.gameboard.field[rowOffset + 1][colOffset + 1]);
        }
      }
      else {
        const endPoint = this.getShipLength() - 1;
        const rowOffset = startingPoint[0] + endPoint;
        const colOffset = startingPoint[1];

        if (this.checkField(rowOffset + 1, colOffset - 1)) {
          shipsInProximity.push(this.gameboard.field[rowOffset + 1][colOffset - 1]);
        }

        if (this.checkField(rowOffset + 1, colOffset)) {
          shipsInProximity.push(this.gameboard.field[rowOffset + 1][colOffset]);
        }

        if (this.checkField(rowOffset + 1, colOffset + 1)) {
          shipsInProximity.push(this.gameboard.field[rowOffset + 1][colOffset + 1]);
        }
      }
    };

    scanSurroundingsFirst();
    scanSurroundingsMiddle();
    scanSurroundingsLast();

    return shipsInProximity;
  }

  getNextFieldsGUI(hoveredOverElement) {
    // gets the next fields for the ship placement color hovering
    const length = this.getShipLength();
    const startingPoint = this.getCoordinates(hoveredOverElement);

    const arrNextFields = [];
    for (let i = 0; i < length; i++) {
      let row;
      let col;
      const subArray = [];

      if (this.placementMode === 'horizontal') {
        [row] = startingPoint;
        col = startingPoint[1] + i;
      }
      else {
        row = startingPoint[0] + i;
        [, col] = startingPoint;
      }
      subArray.push(row, col);
      arrNextFields.push(subArray);
    }
    return arrNextFields;
  }

  createShipObject(dropTarget) {
    // creates a "fake ship" object to save the previous location to the ship, and conversion
    const name = this.getShipName();
    const length = this.getShipLength();
    const coordinates = this.getCoordinates(dropTarget);
    this.getShipName();

    const shipObject = {
      name,
      length,
      currentPosition: coordinates,
      mode: this.placementMode,
    };

    return shipObject;
  }

  removeFromGameboard() {
    const mode = this.draggedShip.getAttribute('mode');
    const startingPoint = this.getCoordinates(this.draggedShip, 'startingPoint');
    const length = this.getShipLength();

    for (let i = 0; i < length; i++) {
      let row;
      let col;

      if (mode === 'horizontal') {
        [row] = startingPoint;
        col = startingPoint[1] + i;
      }
      else {
        row = startingPoint[0] + i;
        [, col] = startingPoint;
      }

      this.gameboard.field[row][col] = '';
    }
  }

  resetGameboard() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.gameboard.field[i][j] = '';
      }
    }
  }

  getCurrentShipLocation(name = this.getShipName()) {
    // returns the location of the current ship
    const shipName = name;
    const arrCoordinates = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const field = this.gameboard.field[i][j];
        if (typeof (field) === 'object') {
          if (field.name === shipName) {
            arrCoordinates.push([i, j]);
          }
        }
      }
    }
    return arrCoordinates;
  }

  doesShipExist() {
    // checks if the currently dragged ship already exists in the gameboard
    const shipName = this.getShipName();
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const field = this.gameboard.field[i][j];
        if (typeof (field) === 'object') {
          if (field.name === shipName) {
            return true;
          }
        }
      }
    }
    return false;
  }

  restorePreviousShipLocation() {
    // restores the position of the ship, if invalidly places it
    const arrCoordinatesRaw = this.draggedShip.getAttribute('location');
    const shipObjectRaw = this.draggedShip.getAttribute('shipobject');
    const shipObject = JSON.parse(shipObjectRaw);
    const arrCoordinates = JSON.parse(arrCoordinatesRaw);

    for (let i = 0; i < arrCoordinates.length; i++) {
      const currentArr = arrCoordinates[i];
      const row = currentArr[0];
      const col = currentArr[1];
      this.gameboard.field[row][col] = shipObject;
    }
  }

  saveInfoToShip(dropTarget, arrCoordinates, shipObject) {
    // saves the starting point, mode, location, and copy of the ship to its attributes
    const coordinates = this.getCoordinates(dropTarget);
    if (this.draggedShip) {
      this.draggedShip.setAttribute('startingPoint', coordinates);
      this.draggedShip.setAttribute('mode', this.placementMode);

      if (arrCoordinates.length !== 0) {
        // save the current location to the ship
        const convertedArrCoordinates = JSON.stringify(arrCoordinates);
        this.draggedShip.setAttribute('location', convertedArrCoordinates);
      }

      const convertedShipObject = JSON.stringify(shipObject);
      this.draggedShip.setAttribute('shipObject', convertedShipObject);
    }
  }

  highlightShipPlacement(hoveredOverElement) {
    // changes the color of the ship according to if it is allowed to be placed
    if (!hoveredOverElement.classList.contains('unselectable')) {
      return;
    }

    const shipStartingPoint = this.getCoordinates(hoveredOverElement);
    const shipInProximity = this.scanSurroundings(shipStartingPoint);

    const arrNextLocations = this.getNextFieldsGUI(hoveredOverElement);
    const startingPoint = arrNextLocations[0];
    const length = this.getShipLength();

    const isPlacementAllowed = this.gameboard.placementAllowed(
      { length },
      startingPoint,
      this.placementMode,
    );

    let color;
    if (isPlacementAllowed === true) {
      color = 'green';
    }
    else if (this.areAllShipsTheSame(shipInProximity) && !this.isShipOutOfBounds(startingPoint)) {
      // changes color to green, if placement is allowed and ship is itself
      color = 'green';
    } else {
      color = 'red';
    }

    for (let i = 0; i < arrNextLocations.length; i++) {
      const currentSubArray = arrNextLocations[i];
      const row = currentSubArray[0];
      const col = currentSubArray[1];

      const selectorCoords = `[coords="${row},${col}"]`;
      const selectedDivNodeList = this.field.querySelectorAll(selectorCoords);
      const selectedDiv = selectedDivNodeList[0];

      if (selectedDiv) {
        selectedDiv.style.backgroundColor = color;
      }
    }
  }

  processShipPlacement(dropTarget) {
    // controls placing the ships and removing them from the field
    if (!dropTarget.classList.contains('unselectable')) {
      return;
    }

    const shipObject = this.createShipObject(dropTarget);
    const doesShipExist = this.doesShipExist();

    if (doesShipExist) {
      this.removeFromGameboard();
    }

    if (this.gameboard.placeShip(shipObject, shipObject.currentPosition, this.placementMode) === 'Success') {
      if (this.draggedShip) {
        dropTarget.appendChild(this.draggedShip);
      }
      const currentLocation = this.getCurrentShipLocation();
      this.saveInfoToShip(dropTarget, currentLocation, shipObject);
    }
    else {
      // eslint-disable-next-line no-lonely-if
      if (doesShipExist) {
        this.restorePreviousShipLocation();
      }
    }

    this.refreshGUI();

    this.draggedShip = null;
  }

  addEventListeners() {
    // controls the flow of ship placements by setting up event listeners for each drag type

    // adds an event listener to each of the draggable ships
    const arrDraggableShips = document.querySelectorAll('.ship');
    arrDraggableShips.forEach((currentShip) => { // use forEach bc of possible closure issues
      currentShip.addEventListener('dragstart', (event) => {
        this.draggedShip = event.target;
        this.refreshGUI();
      });
    });

    // select the hovered over field
    this.field.addEventListener('dragover', (event) => {
      event.preventDefault(); // doesn't allow drop event otherwise
      const hoveredOverElement = event.target;
      this.highlightShipPlacement(hoveredOverElement);
    });

    // remove the background color when not hovering over it anymore
    this.field.addEventListener('dragleave', () => {
      this.refreshGUI();
    });

    // allow to drop the ship into a field
    this.field.addEventListener('drop', (event) => {
      const dropTarget = event.target;
      this.processShipPlacement(dropTarget);
      this.startGame();
    });
  }

  enableButtons() {
    // add style to start game button
    const startGame = document.querySelector('.startGame');
    startGame.classList.add('startGameNoHover');

    const randomButton = document.querySelector('.randomButton');
    randomButton.addEventListener('click', () => {
      this.resetGameboard();
      this.placeRandomShips();
      this.refreshGUI();
    });

    const resetButton = document.querySelector('.resetButton');
    resetButton.addEventListener('click', () => {
      this.resetButton();
    });

    const questionMark = document.querySelector('.help');
    const dropDown = document.querySelector('.content');
    const dropDownContainer = document.querySelector('.help');

    questionMark.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) {
        if (dropDown.classList.contains('visible')) {
          dropDown.classList.remove('visible');
          dropDown.classList.add('hidden');
        } else {
          dropDown.classList.remove('hidden');
          dropDown.classList.add('visible');
        }
      }
    });
    window.addEventListener('click', (event) => {
      if (!dropDownContainer.contains(event.target) && dropDown.classList.contains('visible')) {
        dropDown.classList.remove('visible');
        dropDown.classList.add('hidden');
      }
    });

    // switching modes
    const switchModeButton = document.querySelector('.switchModeButton');
    switchModeButton.addEventListener('click', () => {
      if (this.placementMode === 'horizontal') {
        this.placementMode = 'vertical';
        switchModeButton.textContent = 'Mode: Vertical';
      }
      else {
        this.placementMode = 'horizontal';
        switchModeButton.textContent = 'Mode: Horizontal';
      }
    });

    // switch mode when pressing r
    document.addEventListener('keydown', (event) => {
      if (event.key === 'r' || event.key === 'R') {
        switchModeButton.click();
      }
    });
  }

  resetButton() {
    const saveShip = (ship) => {
      return {
        shipClass: 'ship',
        id: ship.getAttribute('name'),
        draggable: 'true',
        length: parseInt(ship.getAttribute('length'), 10),
        name: ship.getAttribute('name'),
      };
    };

    const sortArrayLength = (array) => {
      const lengthArray = [];
      let max = { length: 0, name: 'zzz' };

      while (array.length > 0) {
        for (let i = 0; i < array.length; i++) {
          const ship = array[i];
          const { length } = ship;
          // if ship.length is larger than max.length, then update max
          if (length > max.length) {
            max = ship;
          }
          else if (length === max.length) {
            // Compare first letters to determine alphabetical order
            if (ship.name < max.name) {
              max = ship;
            }
          }
        }
        // add, remove, and reset
        lengthArray.push(max);
        array.splice(array.indexOf(max), 1);
        max = { length: 0, firstLetter: null };
      }

      return lengthArray;
    };

    const shipContainer = document.querySelector('.placeShips');
    const arrAllParentDivs = shipContainer.querySelectorAll(':scope > div');

    const arrAllShips = document.querySelectorAll('.ship');

    // create an object with each attribute from the ship
    const arrAllShipObjects = [];
    for (let i = 0; i < arrAllShips.length; i++) {
      const ship = arrAllShips[i];
      const shipObject = saveShip(ship);
      arrAllShipObjects.push(shipObject);
    }

    const arrAllShipSorted = sortArrayLength(arrAllShipObjects);

    // Remove ships from their current containers
    for (let i = 0; i < arrAllShipSorted.length; i++) {
      arrAllShips[i].remove();
    }

    // Append ships back to the placeShips div
    for (let i = 0; i < arrAllShipSorted.length; i++) {
      const {
        shipClass, id, draggable, length, name,
      } = arrAllShipSorted[i];

      const shipDiv = document.createElement('div');

      shipDiv.classList.add(shipClass);
      shipDiv.setAttribute('id', id);
      shipDiv.setAttribute('draggable', draggable);
      shipDiv.setAttribute('length', length);
      shipDiv.setAttribute('name', name);

      const parentDiv = arrAllParentDivs[i];
      parentDiv.appendChild(shipDiv);
    }

    // refresh everything else
    this.gameboard = new Gameboard();
    this.draggedShip = null;
    this.canStartGame = false;
    this.refreshGUI();
    this.addEventListeners();
  }

  placeRandomShips() {
    // places all the ships on random spots on both gameboards, simulating a drag and drop
    const switchModeButton = document.querySelector('.switchModeButton');
    const arrAllShip = document.querySelectorAll('.ship');

    for (let i = 0; i < arrAllShip.length; i++) {
      let hasPlaced = false;

      while (!hasPlaced) {
        const currentShip = arrAllShip[i];

        // select a random mode
        const mode = Math.floor(Math.random() * 2) + 1;
        if (mode === 1) {
          this.placementMode = 'horizontal';
          switchModeButton.textContent = 'Mode: Horizontal';
        }
        else {
          this.placementMode = 'vertical';
          switchModeButton.textContent = 'Mode: Vertical';
        }

        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);

        // create ship object
        const ship = {
          name: currentShip.getAttribute('name'),
          length: parseInt(currentShip.getAttribute('length'), 10),
          currentPosition: [row, col],
          mode: this.placementMode,
        };

        if (this.gameboard.placementAllowed(ship, [row, col], this.placementMode) === true) {
          hasPlaced = true;
          this.gameboard.placeShip(ship, [row, col], this.placementMode);

          // simulate dragging and dropping the ship
          currentShip.setAttribute('startingpoint', `${row},${col}`);
          currentShip.setAttribute('mode', this.placementMode);
          const shipName = currentShip.getAttribute('name');

          const currentLocation = JSON.stringify(this.getCurrentShipLocation(shipName));
          currentShip.setAttribute('location', currentLocation);
          const shipObject = JSON.stringify(ship);
          currentShip.setAttribute('shipObject', shipObject);

          const placementField = document.querySelector(`[coords="${row},${col}"]`);
          placementField.appendChild(currentShip);
        }
      }
    }
    this.startGame();
  }
}

module.exports = ShipPlacement;
