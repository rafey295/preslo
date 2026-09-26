var tttBoard = document.getElementById('tttBoard');
var tttStatus = document.getElementById('tttStatus');
var resetBtn = document.getElementById('resetBtn');
var modeToggle = document.getElementById('modeToggle');

var cells = new Array(9).fill(null);
var currentPlayer = 'X';
var mode = 'cpu';
var gameOver = false;

var WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(board) {
  for (var i = 0; i < WIN_LINES.length; i++) {
    var l = WIN_LINES[i];
    if (board[l[0]] && board[l[0]] === board[l[1]] && board[l[1]] === board[l[2]]) {
      return { winner: board[l[0]], line: l };
    }
  }
  if (board.every(function (c) { return c !== null; })) return { winner: 'draw' };
  return null;
}

function render() {
  tttBoard.innerHTML = '';
  cells.forEach(function (val, i) {
    var cell = document.createElement('button');
    cell.className = 'ttt-cell' + (val ? ' ttt-' + val.toLowerCase() : '');
    cell.textContent = val || '';
    cell.addEventListener('click', function () { handleMove(i); });
    tttBoard.appendChild(cell);
  });
}

function handleMove(i) {
  if (gameOver || cells[i]) return;
  cells[i] = currentPlayer;
  render();

  var result = checkWinner(cells);
  if (result) { endGame(result); return; }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  if (mode === 'cpu' && currentPlayer === 'O') {
    tttStatus.textContent = "Computer's turn…";
    setTimeout(cpuMove, 400);
  } else {
    tttStatus.textContent = 'Turn: ' + currentPlayer;
  }
}

function cpuMove() {
  if (gameOver) return;
  var best = minimax(cells, 'O');
  cells[best.index] = 'O';
  render();

  var result = checkWinner(cells);
  if (result) { endGame(result); return; }

  currentPlayer = 'X';
  tttStatus.textContent = 'Your turn (X)';
}

function minimax(board, player) {
  var emptyIndices = board.map(function (v, i) { return v === null ? i : null; }).filter(function (v) { return v !== null; });
  var result = checkWinner(board);

  if (result) {
    if (result.winner === 'O') return { score: 10 };
    if (result.winner === 'X') return { score: -10 };
    return { score: 0 };
  }

  var moves = [];
  emptyIndices.forEach(function (i) {
    var newBoard = board.slice();
    newBoard[i] = player;
    var moveResult = minimax(newBoard, player === 'O' ? 'X' : 'O');
    moves.push({ index: i, score: moveResult.score });
  });

  if (player === 'O') {
    return moves.reduce(function (a, b) { return b.score > a.score ? b : a; });
  } else {
    return moves.reduce(function (a, b) { return b.score < a.score ? b : a; });
  }
}

function endGame(result) {
  gameOver = true;
  if (result.winner === 'draw') {
    tttStatus.textContent = "It's a draw!";
  } else {
    tttStatus.textContent = (result.winner === 'X' ? 'You win!' : (mode === 'cpu' ? 'Computer wins!' : 'O wins!'));
    result.line.forEach(function (i) {
      tttBoard.children[i].classList.add('ttt-win');
    });
  }
}

function resetGame() {
  cells = new Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  tttStatus.textContent = 'Your turn (X)';
  render();
}

modeToggle.addEventListener('click', function (e) {
  var btn = e.target.closest('.unit-btn');
  if (!btn) return;
  document.querySelectorAll('#modeToggle .unit-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  mode = btn.getAttribute('data-mode');
  resetGame();
});

resetBtn.addEventListener('click', resetGame);

render();