class ShipPlacement {
  constructor(gameboard, field) {
    this.gameboard = gameboard;
    this.field = field;
    this.placementMode = 'horizontal';
    this.draggedShip = null;
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
    const name = this.draggedShip.getAttribute('name');
    return name;
  }

  getShipLength() {
    const length = parseInt(this.draggedShip.getAttribute('length'), 10);
    return length;
  }

  getCoordinates(dropTarget, attributeName = 'coords') {
    const coordinates = dropTarget.getAttribute(attributeName);
    const row = parseInt(coordinates[0], 10);
    const col = parseInt(coordinates[2], 10);
    return [row, col];
  }

  areAllShipsTheSame(arrAllShips) {
    // compares all the ship names of the surrounding ships to the current ship's name
    const shipName = this.getShipName();

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
      } else {
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
      } else {
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
      } else {
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

  getCurrentShipLocation() {
    // returns the location of the current ship
    const shipName = this.getShipName();
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

    const isShipTheSame = this.areAllShipsTheSame(shipInProximity);

    let color;
    if (isPlacementAllowed === true || isShipTheSame) {
      // changes color to green, if placement is allowed and ship is itself
      color = 'green';
    }
    else {
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
      dropTarget.appendChild(this.draggedShip);
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
      currentShip.addEventListener('dragstart', (event) => { // USE EVENT DELEGATION HERE!
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
    });
  }

  enableButtons() {
    const randomButton = document.querySelector('.randomButton');

    const questionMark = document.querySelector('.test');
    const dropDown = document.querySelector('.content');

    questionMark.addEventListener('mouseover', () => {
      dropDown.style.display = 'block';
    });

    questionMark.addEventListener('mouseout', () => {
      dropDown.style.display = 'none';
    });

    const resetButton = document.querySelector('.resetButton');
    resetButton.addEventListener('click', () => {
      window.location.reload();
    });

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
      console.log(this.gameboard.field);
    });
  }
}

module.exports = ShipPlacement;
