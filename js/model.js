export class Model {
  constructor(side = 3) {
    this._side = side;
    this._size = side * side;
    this._player = "X";
    this._cells = Array.from({ length: this.size }, () => new Cell());
  }

  get side() {
    return this._side;
  }

  get size() {
    return this._size;
  }

  nextPlayer() {
    this._player = this._player === "X" ? "O" : "X";
  }

  get player() {
    return this._player;
  }

  readCell(index) {
    return this._isValid(index) ? this._cells[index].value : "!";
  }

  changeCell(index) {
    if (this._isValid(index)) {
      this._cells[index].value = this.player;
      console.log(this._asText);
      return true;
    }
    return false;
  }

  resetCells() {
    this._cells.forEach((c) => c.reset());
    this._player = "X";
    console.log(this._asText);
  }

  checkForWinner() {
    // Die Logik für die Überprüfung eines Gewinners
    // Beispiel: bei einer Zeile, Spalte oder Diagonale mit dem gleichen Spieler gibt es einen Gewinner.
    const rows = this._asText.split("\n");
    const board = Array.from(rows, (row) => row.split(" "));

    // Überprüfen von horizontalen Linien
    for (let row = 0; row < this.side; row++) {
      if (
        board[row][0] !== "." &&
        board[row][0] === board[row][1] &&
        board[row][1] === board[row][2]
      ) {
        return true; // Gewonnen
      }
    }

    // Überprüfen von vertikalen Linien
    for (let col = 0; col < this.side; col++) {
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
    for (const cell of this._cells) {
      if (cell.isEmpty) {
        // Es gibt mindestens eine leere Kachel, also kein Unentschieden
        return false;
      }
    }
    // Alle Kacheln sind belegt, es ist ein Unentschieden
    return true;
  }

  toString() {
    return `text: ${this._asText}`;
  }

  get _asText() {
    let text = "";
    let count = 0;
    for (const cell of this._cells) {
      count++;
      text += cell.value;
      text = count % this.side == 0 ? text + "\n" : text + " ";
    }
    return text;
  }

  _isValid(index) {
    if (index < 0 || index >= this.size) {
      console.log(
        `Error: Index ${index} outside of intervall [0..${this.size - 1}]`
      );
      return false;
    }
    return true;
  }
}

class Cell {
  constructor(player = null) {
    this._value = this.isValid(player) ? player : ".";
  }

  get isEmpty() {
    return this.value === ".";
  }

  get value() {
    return this._value;
  }

  set value(player) {
    if (!this.isEmpty) {
      return;
    }
    if (!this.isValid(player)) {
      return;
    }
    this._value = player;
  }

  reset() {
    this._value = ".";
  }

  isValid(player) {
    return player === "X" || player === "O";
  }

  toString() {
    return `value: ${this.value}, isEmpty: ${this.isEmpty}`;
  }
}
