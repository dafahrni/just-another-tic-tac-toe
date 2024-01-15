class ElementBuilder {
  constructor(elementType) {
    this._child = document.createElement(elementType);
  }

  setId(elementId) {
    this._child.id = elementId;
    return this;
  }

  setClass(elementClass) {
    this._child.classList.add(elementClass);
    return this;
  }

  setText(text) {
    this._child.textContent = text;
    return this;
  }

  addListener(eventName, callback) {
    this._child.addEventListener(eventName, callback);
    return this;
  }

  appendTo(parent) {
    parent.appendChild(this._child);
    return this;
  }

  setContent(element) {
    const firstChild = this._child.firstChild;
    if (firstChild) {
      this._child.replaceChild(firstChild, element);
    } else {
      this._child.appendChild(element);
    }
    return this;
  }

  getResult() {
    return this._child;
  }
}

class FullScreen {
  constructor() {
    this._button = document.getElementById("fullscreen-button");
    this._button.addEventListener("click", () => this._handleButtonClick());
    this._button.textContent = "FULL SCR";
    this._isActivated = false;
  }

  get isActivated() {
    return this._isActivated;
  }

  get isSupported() {
    const element = document.documentElement;
    return (
      element.requestFullscreen ||
      element.mozRequestFullScreen || // Firefox
      element.webkitRequestFullscreen || // Chrome, Safari und Opera
      element.msRequestFullscreen // Internet Explorer
    );
  }

  showButton() {
    this._button.hidden = false;
  }

  hideButton() {
    this._button.hidden = true;
  }

  _handleButtonClick() {
    if (this._isActivated) {
      this._deactivate();
    } else {
      this._activate();
    }
  }

  _activate() {
    // Funktion, um den Vollbildmodus zu aktivieren
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    this._button.textContent = "NORMAL";
    this._isActivated = true;
  }

  _deactivate() {
    // Funktion, um den Vollbildmodus zu deaktivieren
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    this._button.textContent = "FULL SCR";
    this._isActivated = false;
  }
}

class ScreenLock {
  constructor() {
    this._button = document.getElementById("screen-lock-button");
    this._button.addEventListener("click", () => this._handleButtonClick());
    this._isActivated = false;
    this._updateText();
    window.addEventListener('orientationchange', () => this._updateText());
  }

  get isActivated() {
    return this._isActivated;
  }

  get isSupported() {
    return this._screenOrientation !== null;
  }

  showButton() {
    this._button.hidden = false;
  }

  hideButton() {
    this._button.hidden = true;
  }

  _handleButtonClick() {
    if (this.isActivated) {
      this._deactivate();
    } else {
      this._activate();
    }
    this._updateText();
  }

  _activate() {
    if (this._screenOrientation && this._screenOrientation.lock) {
      this._screenOrientation.lock(this._screenOrientation?.type);
    }
    this._isActivated = true;
  }

  _deactivate() {
    if (this._screenOrientation && this._screenOrientation.unlock) {
      this._screenOrientation.unlock();
    }
    this._isActivated = false;
  }

  _updateText() {
    if (this.isActivated) {
      this._button.textContent = "UNLOCK";
    } else {
      this._button.textContent = `LOCK ${
        this._screenOrientation?.type.split("-")[0]
      }`;
    }
  }

  get _screenOrientation() {
    return screen.orientation || screen.mozOrientation || screen.msOrientation;
  }
}

class ModalDialog {
  constructor() {
    this._notification = null;
    this._overlay = null;
    this._text = null;
    this._button = null;
    this._notificationTimeout = null;
    this._action = null;
    this._setupHtml();
  }

  showAlert(message, performAfterHiding) {
    // Nachricht und Aktion werden gesetzt
    this._text.textContent = message;
    this._action = performAfterHiding;

    // Anzeigen der Modal-Box
    this._notification.style.display = "block";
    this._overlay.style.display = "block";

    // Neues Timeout starten
    this._notificationTimeout = setTimeout(
      () => this._hideNotification(),
      5000
    );
  }

  _hideNotification() {
    // Modal-Box wird ausgeblendet
    this._notification.style.display = "none";
    this._overlay.style.display = "none";

    // perform action after hiding of notification
    if (this._action) {
      this._action();
    } else {
      console.warn("As action is undefined, nothing is performed.");
    }

    // Timeout zurücksetzen
    clearTimeout(this._notificationTimeout);
  }

  _setupHtml() {
    const root = document.getElementById("root");

    this._overlay = new ElementBuilder("div")
      .setId("overlay")
      .setClass("overlay")
      .appendTo(root)
      .getResult();

    this._notification = new ElementBuilder("div")
      .setId("notification")
      .setClass("modal")
      .appendTo(root)
      .getResult();

    this._text = new ElementBuilder("p")
      .setId("message")
      .appendTo(this._notification)
      .getResult();

    const bc = new ElementBuilder("div")
      .setClass("button-container")
      .appendTo(this._notification)
      .getResult();

    this._button = new ElementBuilder("button")
      .setId("confirm")
      .setText("OK")
      .appendTo(bc)
      .addListener("click", this._hideNotification.bind(this))
      .getResult();
  }
}

class SvgGenerator {
  constructor() {
    this._svgNamespace = "http://www.w3.org/2000/svg";
  }

  generateDefault(color = "black") {
    const svg = this._createSvg();

    const rectAttributes = {
      width: "10", height: "10",
      fill: color
    };

    const rect = this._createPart(rectAttributes, "rect");
    svg.appendChild(rect);

    return svg;
  }

  generateO(color) {
    const svg = this._createSvg();

    const circleAttributes = {
      cx: "50", cy: "50", r: "37",
      stroke: color,
      "stroke-width": "20",
      fill: "transparent"
    };

    const circle = this._createPart(circleAttributes, "circle");
    svg.appendChild(circle);

    return svg;
  }

  generateX(color) {
    const svg = this._createSvg();

    // Gemeinsame Vorlage für die Linienattribute
    const lineAttributesTemplate = {
      x1: "10", y1: "10",
      x2: "90", y2: "90",
      stroke: color,
      "stroke-width": "20",
    };

    // Erstellen der Linien mit der gemeinsamen Vorlage
    const line1 = this._createPart(lineAttributesTemplate, "line");
    const line2 = this._createPart(lineAttributesTemplate, "line");

    // Anpassen von spezifischen Attributen für line2
    this._setAttributes(line2, {
      x1: "90", y1: "10",
      x2: "10", y2: "90",
    });

    // Hinzufügen zum SVG-Element
    svg.appendChild(line1);
    svg.appendChild(line2);

    return svg;
  }

  _createSvg() {
    const svg = document.createElementNS(this._svgNamespace, "svg");
    this._setAttributes(svg, {
      xmlns: this._svgNamespace,
      viewBox: "0 0 100 100",
    });
    return svg;
  }

  _createPart(attributes, form) {
    const part = document.createElementNS(this._svgNamespace, form);
    this._setAttributes(part, attributes);
    return part;
  }

  _setAttributes(element, attributes) {
    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        element.setAttribute(key, attributes[key]);
      }
    }
  }
}

class Board {
  constructor(model) {
    this._tiles = Array(model.size);
    this._selectedTile = null;
    this._notifySelectionChanged = null;
    this._model = model;
    this._setupHtml();
  }

  bindSelectionChanged(handler) {
    this._notifySelectionChanged = handler;
  }

  updateSelectedTile() {
    if (this._selectedTile) {
      this._update(this._selectedTile);
    }
  }

  updateAll() {
    this._tiles.forEach((tile) => {
      this._update(tile);
    });
    this._selectedTile = null;
  }

  _setupHtml() {
    const root = document.getElementById("root");
    const container = new ElementBuilder("div")
      .setClass("game-container")
      .appendTo(root)
      .addListener("click", this._tileSelected.bind(this))
      .getResult();
    for (let i = 0; i < this._tiles.length; i++) {
      this._tiles[i] = new ElementBuilder("div")
        .setClass("tile")
        .setContent(this._generateSvg())
        .appendTo(container)
        .getResult();
    }
    const side = this._model.side;
    container.style.gridTemplateColumns = `repeat(${side}, 1fr)`;
  }

  _tileSelected(event) {
    const selectedTile = event.target.closest(".tile");
    if (!selectedTile) {
      return;
    }

    this._selectedTile = selectedTile;

    if (this._notifySelectionChanged) {
      const index = this._indexOf(this._selectedTile);
      this._notifySelectionChanged(index);
    }
  }

  _update(tile) {
    const index = this._indexOf(tile);
    const value = this._model.readCell(index);
    const svg = this._generateSvg(value);
    tile.replaceChild(svg, tile.firstChild);
  }

  _indexOf(tile) {
    return this._tiles.indexOf(tile);
  }

  _generateSvg(value = ".") {
    const generator = new SvgGenerator();
    const color = value === "X" ? "red" : "blue";
    switch (value) {
      case "X":
        return generator.generateX(color);
      case "O":
        return generator.generateO(color);
      default:
        return generator.generateDefault();
    }
  }
}

/**
 * Spielfeld mit Spielstand
 */
export class View {
  constructor(model) {
    this._model = model;
    this._board = new Board(model);
    this._board.updateAll();
    this._dialog = new ModalDialog();
    this._fullScreen = new FullScreen();
    this._screenLock = new ScreenLock();
    this._ressources = {
      click: new Audio("resources/click.mp3"),
      clack: new Audio("resources/clack.mp3"),
      wrong: new Audio("resources/buzz.mp3"),
      bell: new Audio("resources/success.mp3"),
      draw: new Audio("resources/draw.mp3"),
    };
  }

  main() {
    if (this._fullScreen.isSupported) {
      if (this._fullScreen.isActivated) {
        if (this._screenLock.isSupported) {
          this._screenLock.showButton();
        } 
      } else {
        this._fullScreen.showButton();
        this._screenLock.hideButton();
      }
    }
  }

  bindSelectionChanged(handler) {
    this._board.bindSelectionChanged(handler);
  }

  wrongMove() {
    this._playSound("wrong");
  }

  updateBoard() {
    this._playSound(this._model.player === "X" ? "click" : "clack");
    this._board.updateSelectedTile();
  }

  gameIsWon() {
    this._playSound("bell");
    this._showAlert(`Spieler ${this._model.player} gewinnt!`, () => {
      this._model.resetCells();
      this._board.updateAll();
    });
  }

  gameIsDraw() {
    this._playSound("draw");
    this._showAlert("Unentschieden!", () => {
      this._model.resetCells();
      this._board.updateAll();
    });
  }

  _showAlert(message, performAfterHiding) {
    this._dialog.showAlert(message, performAfterHiding);
  }

  _playSound(key) {
    if (key in this._ressources) {
      this._ressources[key].play();
    }
  }
}
