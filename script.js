/**
 * Modal-Box für die Benachrichtigung
 */
class ModalDialog {
  constructor() {
    this.notification = null;
    this.overlay = null;
    this.text = null;
    this.button = null;

    this.notificationTimeout = null;
    this.action = null;

    this.setupHtml();
    this.setupEventListeners();
  }

  showAlert(message, performAfterHiding) {
    // Nachricht und Aktion werden gesetzt
    this.text.textContent = message;
    this.action = performAfterHiding;

    // Anzeigen der Modal-Box
    this.notification.style.display = "block";
    this.overlay.style.display = "block";

    // Neues Timeout starten
    this.notificationTimeout = setTimeout(() => this.hideNotification(), 5000);
  }

  hideNotification() {
    // Modal-Box wird ausgeblendet
    this.notification.style.display = "none";
    this.overlay.style.display = "none";

    // perform action after hiding of notification
    if (this.action) {
      this.action();
    } else {
      console.log("Warning: As action is undefined, nothing is performed.");
    }

    // Timeout zurücksetzen
    clearTimeout(this.notificationTimeout);
  }

  setupHtml() {
    const root = document.getElementById("root");
    const overlay = document.getElementById("overlay");
    const notification = document.getElementById("notification");
    const text = document.getElementById("message");
    const button = document.getElementById("confirm");

    this.overlay =
      overlay ?? Helper.appendChild(root, "div", "overlay", "overlay");
    this.notification =
      notification ?? Helper.appendChild(root, "div", "notification", "modal");
    this.text = text ?? Helper.appendChild(this.notification, "p", "message");
    this.button = button ?? Helper.appendChild(this.notification, "button", "confirm", null, "OK");
  }

  setupEventListeners() {
    this.button.addEventListener("click", this.hideNotification.bind(this));
  }
}

class Helper {
  static appendChild(
    parent,
    elementType,
    elementId = null,
    elementClass = null,
    text = null
  ) {
    const child = document.createElement(elementType);
    if (elementId) child.id = elementId;
    if (elementClass) child.classList.add(elementClass);
    if (text) child.textContent = text;
    parent.appendChild(child);
    return child;
  }
}

/**
 * Kachel mit '.', 'X' oder 'O'
 */
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

  toString() {
    return `text: ${this.text}, isEmpty: ${this.isEmpty}`;
  }
}

/**
 * Spielfeld mit Spielstand
 */
class Board {
  constructor(ressources, dialog, logic) {
    this.ressources = ressources;
    this.dialog = dialog;
    this.logic = logic;

    this.currentPlayer = null;

    this.setupHtml();
    this.setupEventListeners();
    this.reset();
  }

  setupHtml() {
    const root = document.getElementById("root");
    const container =
      document.getElementById("board") ??
      Helper.appendChild(root, "div", "board", "game-container");

    for (let i = 1; i <= 9; i++) {
      const element = document.createElement("div");
      element.classList.add("tile");
      container.appendChild(element);
    }
  }

  setupEventListeners() {
    const container = document.querySelector(".game-container");
    container.addEventListener("click", this.handleTileClick.bind(this));
  }

  reset() {
    const tiles = this.allTiles;
    tiles.forEach((tile) => tile.reset());
    this.currentPlayer = "X";
    console.log(this.asText);
  }

  handleTileClick(event) {
    const clickedTile = event.target;
    if (!clickedTile.classList.contains("tile")) {
      return;
    }

    const tileObject = new Tile(clickedTile);
    if (!tileObject.isEmpty) {
      this.ressources["wrong"].play();
      return;
    }

    // do move
    this.ressources[this.currentPlayer === "X" ? "click" : "clack"].play();
    tileObject.text = this.currentPlayer;
    console.log(this.asText);

    if (this.logic.checkForWinner(this)) {
      this.ressources["bell"].play();
      this.dialog.showAlert(`Spieler ${this.currentPlayer} gewinnt!`, () => this.reset());
    } else if (this.logic.checkForDraw(this)) {
      this.ressources["draw"].play();
      this.dialog.showAlert("Unentschieden!", () => this.reset());
    } else {
      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    }
  }

  toString() {
    return `text: ${this.asText}`;
  }

  get asText() {
    let text = "";
    let count = 0;
    for (const tile of this.allTiles) {
      count++;
      text += tile.text;
      text = count % 3 == 0 ? text + "\n" : text + " ";
    }
    return text;
  }

  get allTiles() {
    const elements = document.querySelectorAll(".tile");
    //console.log(`Info: ${elements.length} tiles found.`)
    return Array.from(elements, (e) => new Tile(e));
  }
}

/**
 * Implementation der Logik
 */
class Logic {
  constructor() {}

  checkForWinner(board) {
    // Die Logik für die Überprüfung eines Gewinners
    // Beispiel: Wenn Sie eine Zeile, Spalte oder Diagonale mit dem gleichen Spieler finden, gibt es einen Gewinner.
    const rows = board.asText.split("\n");
    const cells = Array.from(rows, (row) => row.split(" "));

    // Überprüfen von horizontalen Linien
    for (let row = 0; row < 3; row++) {
      if (
        cells[row][0] !== "." &&
        cells[row][0] === cells[row][1] &&
        cells[row][1] === cells[row][2]
      ) {
        return true; // Gewonnen
      }
    }

    // Überprüfen von vertikalen Linien
    for (let col = 0; col < 3; col++) {
      if (
        cells[0][col] !== "." &&
        cells[0][col] === cells[1][col] &&
        cells[1][col] === cells[2][col]
      ) {
        return true; // Gewonnen
      }
    }

    // Überprüfen der Diagonalen
    if (
      cells[0][0] !== "." &&
      cells[0][0] === cells[1][1] &&
      cells[1][1] === cells[2][2]
    ) {
      return true; // Gewonnen
    }

    if (
      cells[0][2] !== "." &&
      cells[0][2] === cells[1][1] &&
      cells[1][1] === cells[2][0]
    ) {
      return true; // Gewonnen
    }

    return false; // Kein Gewinner
  }

  checkForDraw(board) {
    // Überprüfen, ob alle Kacheln belegt sind
    for (const tile of board.allTiles) {
      if (tile.isEmpty) {
        // Es gibt mindestens eine leere Kachel, also kein Unentschieden
        return false;
      }
    }
    // Alle Kacheln sind belegt, es ist ein Unentschieden
    return true;
  }
}

const ressources = {
  click: new Audio("resources/click.mp3"),
  clack: new Audio("resources/clack.mp3"),
  wrong: new Audio("resources/buzz.mp3"),
  bell: new Audio("resources/success.mp3"),
  draw: new Audio("resources/draw.mp3"),
};
const dialog = new ModalDialog();
const logic = new Logic();
const board = new Board(ressources, dialog, logic);
