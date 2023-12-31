class Game {
  constructor() {
    this.setupGameBoard();
  }

  setupGameBoard() {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.classList.add("game-container");

    for (let i = 1; i <= 9; i++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      gameContainer.appendChild(tile);
    }
  }
}

const game = new Game();