class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
    this.sunk = false;
  }

  hit(targetShip) {
    targetShip.timesHit += 1;
    targetShip.isSunk();
  }

  isSunk() {
    if (this.timesHit === this.length) {
      this.sunk = true;
    }
  }
}

module.exports = Ship;
