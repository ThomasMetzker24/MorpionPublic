"use strict";

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function createGame() {
  return { board: Array(9).fill(""), player: "X", finished: false, winner: null, winningLine: [] };
}

function play(game, index) {
  if (game.finished || !Number.isInteger(index) || index < 0 || index > 8 || game.board[index]) {
    return false;
  }

  game.board[index] = game.player;
  const line = WINNING_LINES.find(indices => indices.every(i => game.board[i] === game.player));
  if (line) {
    game.finished = true;
    game.winner = game.player;
    game.winningLine = [...line];
  } else if (game.board.every(Boolean)) {
    game.finished = true;
  } else {
    game.player = game.player === "X" ? "O" : "X";
  }
  return true;
}

if (typeof document !== "undefined") {
  let game = createGame();
  const cells = [...document.querySelectorAll(".cell")];
  const status = document.querySelector("#status");

  function render() {
    cells.forEach((cell, index) => {
      const symbol = game.board[index];
      cell.textContent = symbol;
      cell.classList.toggle("x", symbol === "X");
      cell.classList.toggle("o", symbol === "O");
      cell.classList.toggle("winner", game.winningLine.includes(index));
      cell.disabled = game.finished || Boolean(symbol);
      cell.setAttribute("aria-label", `Ligne ${Math.floor(index / 3) + 1}, colonne ${index % 3 + 1} : ${symbol || "vide"}`);
    });
    status.textContent = game.winner
      ? `Le joueur ${game.winner} a gagné !`
      : game.finished ? "Match nul !" : `Au tour de ${game.player}`;
    for (const player of ["X", "O"]) {
      document.querySelector(`#player-${player.toLowerCase()}`).classList.toggle("active", !game.finished && game.player === player);
    }
  }

  cells.forEach(cell => cell.addEventListener("click", () => {
    if (play(game, Number(cell.dataset.index))) render();
  }));
  document.querySelector("#restart").addEventListener("click", () => {
    game = createGame();
    render();
  });
  render();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { createGame, play };
}
