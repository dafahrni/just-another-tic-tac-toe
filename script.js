class Tile {
  constructor(element) {
    this.element = element;
  }

  get isEmpty() {
    return this.text === ".";
  }

  get text() {
    return this.element.textContent;
  }

  set text(player) {
    if (!this.isEmpty) {
      return;
    }
    if (!this.isValid(player)) {
      return;
    }
    this.element.textContent = player;
    this.element.style.color = "white";
  }

  reset() {
    this.element.textContent = ".";
    this.element.style.color = "transparent";
  }

  isValid(player) {
    return player === "X" || player === "O";
  }
}

class Game {
  constructor() {
    this.setupGameBoard();
    this.setupEventListeners();
    this.reset();
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

  setupEventListeners() {
    const gameContainer = document.querySelector(".game-container");
    gameContainer.addEventListener("click", this.handleTileClick.bind(this));
  }

  reset() {
    this.allTiles().forEach((tile) => tile.reset());
    this.currentPlayer = "X";
    console.log(this.asText());
  }

  allTiles() {
    return Array.from(
      document.querySelectorAll(".tile"),
      (element) => new Tile(element)
    );
  }

  asText() {
    let text = "";
    let count = 0;
    for (const tile of this.allTiles()) {
      count++;
      text += tile.text;
      text = count % 3 == 0 ? text + "\n" : text + " ";
    }
    return text;
  }

  handleTileClick(event) {
    const clickedTile = event.target;

    if (clickedTile.classList.contains("tile")) {
      const tileObject = new Tile(clickedTile);

      if (tileObject.isEmpty) {
        tileObject.text = this.currentPlayer;
        console.log(this.asText());

        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
      }
    }
  }
}

const game = new Game();