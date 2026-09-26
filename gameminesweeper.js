var mineBoard = document.getElementById('mineBoard');
var minesLeftEl = document.getElementById('minesLeft');
var timeValEl = document.getElementById('timeVal');
var newGameBtn = document.getElementById('newGameBtn');
var mineMsg = document.getElementById('mineMsg');

var ROWS = 9, COLS = 9, MINES = 10;
var grid = [];
var revealedCount = 0;
var flagCount = 0;
var gameOver = false;
var timer = 0;
var timerInterval = null;
var firstClick = true;

function buildGrid() {
  grid = [];
  for (var r = 0; r < ROWS; r++) {
    var row = [];
    for (var c = 0; c < COLS; c++) {
      row.push({ mine: false, revealed: false, flagged: false, count: 0 });
    }
    grid.push(row);
  }
}

function placeMines(excludeR, excludeC) {
  var placed = 0;
  while (placed < MINES) {
    var r = Math.floor(Math.random() * ROWS);
    var c = Math.floor(Math.random() * COLS);
    if (grid[r][c].mine) continue;
    if (Math.abs(r - excludeR) <= 1 && Math.abs(c - excludeC) <= 1) continue;
    grid[r][c].mine = true;
    placed++;
  }

  for (var r2 = 0; r2 < ROWS; r2++) {
    for (var c2 = 0; c2 < COLS; c2++) {
      if (grid[r2][c2].mine) continue;
      grid[r2][c2].count = countNeighborMines(r2, c2);
    }
  }
}

function countNeighborMines(r, c) {
  var count = 0;
  for (var dr = -1; dr <= 1; dr++) {
    for (var dc = -1; dc <= 1; dc++) {
      var nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc].mine) count++;
    }
  }
  return count;
}

function render() {
  mineBoard.innerHTML = '';
  for (var r = 0; r < ROWS; r++) {
    for (var c = 0; c < COLS; c++) {
      var cell = grid[r][c];
      var btn = document.createElement('button');
      btn.className = 'mine-cell' + (cell.revealed ? ' revealed' : '') + (cell.revealed && cell.mine ? ' mine' : '');
      if (cell.revealed && !cell.mine && cell.count > 0) {
        btn.textContent = cell.count;
        btn.classList.add('num-' + cell.count);
      }
      if (cell.revealed && cell.mine) btn.textContent = '💣';
      if (!cell.revealed && cell.flagged) btn.textContent = '🚩';

      (function (row, col) {
        btn.addEventListener('click', function () { reveal(row, col); });
        btn.addEventListener('contextmenu', function (e) { e.preventDefault(); toggleFlag(row, col); });
        var pressTimer;
        btn.addEventListener('touchstart', function () {
          pressTimer = setTimeout(function () { toggleFlag(row, col); }, 450);
        }, { passive: true });
        btn.addEventListener('touchend', function () { clearTimeout(pressTimer); }, { passive: true });
      })(r, c);

      mineBoard.appendChild(btn);
    }
  }
}

function toggleFlag(r, c) {
  if (gameOver || grid[r][c].revealed) return;
  grid[r][c].flagged = !grid[r][c].flagged;
  flagCount += grid[r][c].flagged ? 1 : -1;
  minesLeftEl.textContent = MINES - flagCount;
  render();
}

function reveal(r, c) {
  if (gameOver || grid[r][c].flagged || grid[r][c].revealed) return;

  if (firstClick) {
    placeMines(r, c);
    firstClick = false;
    startTimer();
  }

  floodReveal(r, c);
  render();

  if (grid[r][c].mine) {
    endGame(false);
    return;
  }

  checkWin();
}

function floodReveal(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
  var cell = grid[r][c];
  if (cell.revealed || cell.flagged) return;

  cell.revealed = true;
  revealedCount++;

  if (cell.mine) return;

  if (cell.count === 0) {
    for (var dr = -1; dr <= 1; dr++) {
      for (var dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        floodReveal(r + dr, c + dc);
      }
    }
  }
}

function checkWin() {
  if (revealedCount === ROWS * COLS - MINES) {
    endGame(true);
  }
}

function endGame(won) {
  gameOver = true;
  clearInterval(timerInterval);
  if (won) {
    mineMsg.textContent = 'You cleared the board in ' + timer + ' seconds!';
  } else {
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        if (grid[r][c].mine) grid[r][c].revealed = true;
      }
    }
    render();
    mineMsg.textContent = 'Boom — you hit a mine. Try again!';
  }
  mineMsg.style.display = 'block';
}

function startTimer() {
  timer = 0;
  timeValEl.textContent = timer;
  timerInterval = setInterval(function () {
    timer++;
    timeValEl.textContent = timer;
  }, 1000);
}

function newGame() {
  clearInterval(timerInterval);
  buildGrid();
  revealedCount = 0;
  flagCount = 0;
  gameOver = false;
  firstClick = true;
  timer = 0;
  timeValEl.textContent = 0;
  minesLeftEl.textContent = MINES;
  mineMsg.style.display = 'none';
  render();
}

newGameBtn.addEventListener('click', newGame);
newGame();