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

  getNextShipCoordinates(coordinates, length, mode = 'horizontal') {
    const nextCoordinatesArray = [];
    const row = coordinates[0];
    const col = coordinates[1];

    for (let i = 0; i < length; i++) {
      let newRow;
      let newCol;
      if (mode === 'horizontal') {
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
    if (this.placementMode === 'horizontal') {
      const coordinates = this.getCoordinates(this.currentSelected);
      const length = parseInt(this.getLength(selectedShip), 10);
      const coordinatesArray = this.getNextShipCoordinates(coordinates, length);
      const fakeShip = { // need to create the fake ship here!
        length,
        position: coordinatesArray,
        mode: 'horizontal',
      };

      this.addInfoToShip(fakeShip, selectedShip);

      const placementAllowed = this.gameboard.placeShip(fakeShip, coordinates);
      return placementAllowed;
    }
  }

  searchForShip(selectedDiv) {
  }

  removeShipFromGameboard(selectedShip) {
    // removes the ship from the actual gameboard field
    const fakeShipObject = this.getInfoFromShip(selectedShip);
    for (let i = 0; i < fakeShipObject.length; i++) {
      const coordinates = fakeShipObject.position[i];
      const row = coordinates[0];
      const col = coordinates[1];
      // check if the coordinates are within the gameboard boundaries, extends gameboard otherwise
      if (row >= 0 && row < 10 && col >= 0 && col < 10) {
        this.gameboard.field[row][col] = '';
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
          this.removeShipFromGameboard(selectedShip);
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
            }
          }
        });
      });
    }
  }

  addListenerToField() {
    // gets the currently hovered over div
    let cooldownActive = false;
    const cooldownDuration = 100;

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
}

module.exports = ShipPlacement;
