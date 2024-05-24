class ShipPlacement {
  constructor(gameboard, field) {
    this.gameboard = gameboard;
    this.field = field;
    this.currentSelected = null;
    this.placementMode = 'horizontal';
  }

  getCoordinates(div) {
    const rawCoordinates = div.getAttribute('coords');
    const row = parseInt(rawCoordinates[0], 10);
    const col = parseInt(rawCoordinates[2], 10);
    const coordinates = [row, col];
    return coordinates;
  }

  getLength(div) {
    const length = div.getAttribute('length');
    return length;
  }

  getNextShipCoordinates(coordinates, length) {
    // gets the coordinates of the whole ship
    const nextCoordinatesArray = [];
    const row = coordinates[0];
    const col = coordinates[1];

    for (let i = 0; i < length; i++) {
      let newRow;
      let newCol;
      if (this.placementMode === 'horizontal') {
        newRow = row;
        newCol = col + i;
      }
      else {
        newRow = row + i;
        newCol = col;
      }
      nextCoordinatesArray.push([newRow, newCol]);
    }

    return nextCoordinatesArray;
  }

  getNextFieldCoordinates(nextCoordinatesArray) {
    // gets the div's next to where you placed the ship
    const allDivs = [];
    for (let i = 0; i < nextCoordinatesArray.length; i++) {
      const currentArray = nextCoordinatesArray[i];
      const row = currentArray[0];
      const col = currentArray[1];
      // sync with gameboard
      const selectorCoords = `[coords="${row},${col}"]`;
      const selectedDivNodeList = this.field.querySelectorAll(selectorCoords);
      const selectedDiv = selectedDivNodeList[0];
      if (selectedDiv === undefined) {
        return false;
      }
      allDivs.push(selectedDiv);
    }
    return allDivs;
  }

  placeNextShips(selectedShip) {
    const coordinates = this.getCoordinates(this.currentSelected);
    const length = parseInt(this.getLength(selectedShip), 10);
    const nextCoordinatesArray = this.getNextShipCoordinates(coordinates, length);
    const nextFieldArray = this.getNextFieldCoordinates(nextCoordinatesArray);
    console.log(nextFieldArray);
  }

  addInfoToShip(fakeShip, div) {
    // adds the fake ship object as a custom data attribute to the selected ship
    const fakeShipString = JSON.stringify(fakeShip);
    div.setAttribute('info', fakeShipString);
  }

  getInfoFromShip(div) {
    // retrieves the stringified object from the custom data attribute of the selected ship
    const fakeShip = div.getAttribute('info');
    const fakeShipObject = JSON.parse(fakeShip);
    return fakeShipObject;
  }

  getShipName(selectedShip) {
    const name = selectedShip.getAttribute('name');
    return name;
  }

  doesShipHaveInfo(selectedShip) {
    // checks if the ship has the info custom data attribute
    const fakeShipObject = this.getInfoFromShip(selectedShip);
    if (fakeShipObject) {
      return true;
    }
    else {
      return false;
    }
  }

  isPlacementAllowed(selectedShip) {
    const coordinates = this.getCoordinates(this.currentSelected);
    const length = parseInt(this.getLength(selectedShip), 10);
    const coordinatesArray = this.getNextShipCoordinates(coordinates, length);
    const shipName = this.getShipName(selectedShip);
    const fakeShip = { // need to create the fake ship here!
      name: shipName,
      length,
      position: coordinatesArray,
      mode: this.placementMode,
    };

    this.addInfoToShip(fakeShip, selectedShip);

    const placementAllowed = this.gameboard.placeShip(fakeShip, coordinates, this.placementMode);
    return placementAllowed;
  }

  removeShipFromGameboard(selectedShip) {
    // removes the ship from the actual gameboard field
    const fakeShipObject = this.getInfoFromShip(selectedShip);
    let detectedShip;

    for (let i = 0; i < fakeShipObject.length; i++) {
      const coordinates = fakeShipObject.position[i];
      const row = coordinates[0];
      const col = coordinates[1];
      // check if the coordinates are within the gameboard boundaries, extends gameboard otherwise
      if (row >= 0 && row < 10 && col >= 0 && col < 10) {
        if (typeof (this.gameboard.field[row][col]) === 'object') {
          detectedShip = this.gameboard.field[row][col];
          break;
        }
      }
    }

    if (detectedShip) {
      if (detectedShip.name !== fakeShipObject.name) {
        return false;
      }
    }

    for (let i = 0; i < fakeShipObject.length; i++) {
      const coordinates = fakeShipObject.position[i];
      const row = coordinates[0];
      const col = coordinates[1];
      // check if the coordinates are within the gameboard boundaries, extends gameboard otherwise
      if (row >= 0 && row < 10 && col >= 0 && col < 10) {
        if (this.gameboard.field[row][col] !== fakeShipObject) {
          this.gameboard.field[row][col] = '';
        }
      }
    }
  }

  addDraggableCursor() {
    // main loop
    const allShips = document.querySelectorAll('.ship');

    for (let i = 0; i < allShips.length; i++) {
      const ship = allShips[i];
      ship.addEventListener('dragstart', (event) => {
        let selectedShip = event.target;
        if (this.doesShipHaveInfo(selectedShip)) {
          // deletes the ship from the gameboard when moved
          if (!this.removeShipFromGameboard(selectedShip)) {
            console.log('Nope!');
          }
        }

        this.field.addEventListener('dragover', (event) => {
          event.preventDefault();
        });
        this.field.addEventListener('drop', () => {
          if (selectedShip !== null) {
            if (this.isPlacementAllowed(selectedShip) === 'Success') {
              console.log('Placement allowed!');

              this.currentSelected.appendChild(selectedShip);
              this.placeNextShips(selectedShip);

              selectedShip = null;
            }
            else {
              console.log('Not allowed');
              selectedShip = null;
            }
          }
        });
      });
    }
  }

  addListenerToField() {
    // gets the currently hovered over div
    let cooldownActive = false;
    const cooldownDuration = 200;

    const handleChildClick = (event) => {
      if (!cooldownActive) {
        const clickedElement = event.target;
        if (clickedElement.classList.contains('unselectable')) {
          this.currentSelected = event.target;
          console.log(this.currentSelected);

          cooldownActive = true;
          setTimeout(() => {
            cooldownActive = false;
          }, cooldownDuration);
        }
      }
    };

    const field = document.querySelector('.field1');
    field.addEventListener('dragover', handleChildClick);
  }

  // BUTTONS
  enableButtons() {
    const randomButton = document.querySelector('.randomButton');

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
