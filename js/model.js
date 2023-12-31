/**
 * Implementation der Logik
 */
export class Logic {
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
