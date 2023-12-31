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
    this.click = new Audio("resources/click.mp3");
    this.clack = new Audio("resources/clack.mp3");

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

  playClickOrClack() {
    if (this.currentPlayer === "X") {
      this.click.play();
    } else {
      this.clack.play();
    }
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
  
  checkForWinner() {
    // Die Logik für die Überprüfung eines Gewinners
    // Beispiel: Wenn Sie eine Zeile, Spalte oder Diagonale mit dem gleichen Spieler finden, gibt es einen Gewinner.
    const rows = this.asText().split("\n");
    const board = Array.from(rows, (row) => row.split(" "));

    // Überprüfen von horizontalen Linien
    for (let row = 0; row < 3; row++) {
      if (
        board[row][0] !== "." &&
        board[row][0] === board[row][1] &&
        board[row][1] === board[row][2]
      ) {
        return true; // Gewonnen
      }
    }

    // Überprüfen von vertikalen Linien
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col] !== "." &&
        board[0][col] === board[1][col] &&
        board[1][col] === board[2][col]
      ) {
        return true; // Gewonnen
      }
    }

    // Überprüfen der Diagonalen
    if (
      board[0][0] !== "." &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return true; // Gewonnen
    }

    if (
      board[0][2] !== "." &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return true; // Gewonnen
    }

    return false; // Kein Gewinner
  }

  checkForDraw() {
    // Überprüfen, ob alle Kacheln belegt sind
    for (const tile of this.allTiles()) {
      if (tile.isEmpty) {
        // Es gibt mindestens eine leere Kachel, also kein Unentschieden
        return false;
      }
    }
    // Alle Kacheln sind belegt, es ist ein Unentschieden
    return true;
  }

  handleTileClick(event) {
    const clickedTile = event.target;

    if (clickedTile.classList.contains("tile")) {
      const tileObject = new Tile(clickedTile);

      if (tileObject.isEmpty) {
        tileObject.text = this.currentPlayer;
        this.playClickOrClack();
        console.log(this.asText());

        if (this.checkForWinner()) {
          showAlert(`Spieler ${this.currentPlayer} gewinnt!`);
        } else if (this.checkForDraw()) {
          showAlert("Unentschieden!");
        } else {
          this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        }
      }
    }
  }
}

const game = new Game();

let notificationTimeout;

function showAlert(message) {
  // Modal-Box mit Nachricht wird angezeigt
  const notificationModal = document.getElementById("notificationModal");
  const overlay = document.getElementById("overlay");
  const messageElement = document.getElementById("notificationMessage");

  // Setzen der Nachricht in die Modal-Box
  messageElement.textContent = message;

  // Anzeigen der Modal-Box
  notificationModal.style.display = "block";
  overlay.style.display = "block";

  // Neues Timeout starten
  notificationTimeout = setTimeout(function () {
    hideNotification();
  }, 5000);
}

function hideNotification() {
  // Modal-Box wird ausgeblendet
  const notificationModal = document.getElementById("notificationModal");
  const overlay = document.getElementById("overlay");

  notificationModal.style.display = "none";
  overlay.style.display = "none";

  game.reset();

  // Timeout zurücksetzen
  clearTimeout(notificationTimeout);
}
