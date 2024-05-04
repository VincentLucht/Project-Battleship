class Player {
  constructor(type, gameboard) {
    if (!type || !gameboard) {
      throw new Error('Please create a gameboard for the user.');
    }
    this.type = type;
    this.gameboard = gameboard;
  }
}

module.exports = Player;
