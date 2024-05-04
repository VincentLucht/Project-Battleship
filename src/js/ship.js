class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
    this.sunk = false;
  }

  hit() {
    if (this.timesHit !== this.length) { // don't allow ship to be hit beyond length
      this.timesHit += 1;
      this.isSunk();
    }
  }

  isSunk() {
    if (this.timesHit === this.length) {
      this.sunk = true;
    }
  }
}

module.exports = Ship;
