class ModalDialogBase {
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
    this.button =
      button ??
      Helper.appendChild(this.notification, "button", "confirm", null, "OK");
  }

  setupEventListeners() {
    this.button.addEventListener("click", this.hideNotification.bind(this));
  }
}

/**
 * Modal-Box für die Benachrichtigung
 */
export class ModalDialog extends ModalDialogBase {
  constructor() {
    super();
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

class BoardBase {
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
      this.dialog.showAlert(`Spieler ${this.currentPlayer} gewinnt!`, () =>
        this.reset()
      );
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
 * Spielfeld mit Spielstand
 */
export class Board extends BoardBase {
  constructor(ressources, dialog, logic) {
    super(ressources, dialog, logic);
  }
}
