var SIZE = 4;
var board = [];
var score = 0;
var best = 0;

var boardEl = document.getElementById('board');
var scoreEl = document.getElementById('score');
var bestEl = document.getElementById('best');
var newGameBtn = document.getElementById('newGameBtn');
var gameMsg = document.getElementById('gameMsg');

try { best = parseInt(localStorage.getItem('preslo-2048-best')) || 0; } catch (e) {}
bestEl.textContent = best;

function emptyBoard() {
  var b = [];
  for (var i = 0; i < SIZE; i++) b.push(new Array(SIZE).fill(0));
  return b;
}

function addRandomTile() {
  var empty = [];
  for (var r = 0; r < SIZE; r++) {
    for (var c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return;
  var pick = empty[Math.floor(Math.random() * empty.length)];
  board[pick[0]][pick[1]] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  boardEl.innerHTML = '';
  for (var r = 0; r < SIZE; r++) {
    for (var c = 0; c < SIZE; c++) {
      var val = board[r][c];
      var cell = document.createElement('div');
      cell.className = 'g2048-cell' + (val ? ' g2048-v' + val : '');
      if (val) cell.textContent = val;
      boardEl.appendChild(cell);
    }
  }
  scoreEl.textContent = score;
  if (score > best) {
    best = score;
    bestEl.textContent = best;
    try { localStorage.setItem('preslo-2048-best', best); } catch (e) {}
  }
}

function slideRow(row) {
  var arr = row.filter(function (v) { return v !== 0; });
  for (var i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr.splice(i + 1, 1);
    }
  }
  while (arr.length < SIZE) arr.push(0);
  return arr;
}

function rotateBoard(b) {
  var newB = emptyBoard();
  for (var r = 0; r < SIZE; r++) {
    for (var c = 0; c < SIZE; c++) {
      newB[c][SIZE - 1 - r] = b[r][c];
    }
  }
  return newB;
}

function boardsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function move(direction) {
  var before = JSON.parse(JSON.stringify(board));
  var rotations = { left: 0, up: 1, right: 2, down: 3 };
  var times = rotations[direction];

  for (var i = 0; i < times; i++) board = rotateBoard(board);

  board = board.map(function (row) { return slideRow(row); });

  for (var j = 0; j < (4 - times) % 4; j++) board = rotateBoard(board);

  if (!boardsEqual(before, board)) {
    addRandomTile();
    render();
    checkGameState();
  }
}

function canMove() {
  for (var r = 0; r < SIZE; r++) {
    for (var c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return true;
      if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return true;
      if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return true;
    }
  }
  return false;
}

function checkGameState() {
  var won = board.some(function (row) { return row.some(function (v) { return v >= 2048; }); });
  if (won && !gameMsg.dataset.wonShown) {
    gameMsg.textContent = 'You reached 2048! Keep playing for a higher score, or start a new game.';
    gameMsg.style.display = 'block';
    gameMsg.dataset.wonShown = '1';
    return;
  }
  if (!canMove()) {
    gameMsg.textContent = 'Game over — no more moves. Final score: ' + score;
    gameMsg.style.display = 'block';
  }
}

function newGame() {
  board = emptyBoard();
  score = 0;
  gameMsg.style.display = 'none';
  delete gameMsg.dataset.wonShown;
  addRandomTile();
  addRandomTile();
  render();
}

document.addEventListener('keydown', function (e) {
  var map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
  if (map[e.key]) {
    e.preventDefault();
    move(map[e.key]);
  }
});

var touchStartX = 0, touchStartY = 0;
boardEl.addEventListener('touchstart', function (e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
boardEl.addEventListener('touchend', function (e) {
  var dx = e.changedTouches[0].clientX - touchStartX;
  var dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (Math.abs(dx) > 30) move(dx > 0 ? 'right' : 'left');
  } else {
    if (Math.abs(dy) > 30) move(dy > 0 ? 'down' : 'up');
  }
}, { passive: true });

newGameBtn.addEventListener('click', newGame);

newGame();