class Player {
  constructor(type, gameboard) {
    if (!type || !gameboard) {
      throw new Error('Please create a gameboard for the user.');
    }
    this.type = type;
    this.gameboard = gameboard;
  }
}

const player = new Player();
console.log(player);

module.exports = Player;
