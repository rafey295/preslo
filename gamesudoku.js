var sudokuBoard = document.getElementById('sudokuBoard');
var sudokuNumpad = document.getElementById('sudokuNumpad');
var timeValEl = document.getElementById('timeVal');
var checkBtn = document.getElementById('checkBtn');
var newGameBtn = document.getElementById('newGameBtn');
var sudokuMsg = document.getElementById('sudokuMsg');

var solution = [];
var puzzle = [];
var given = [];
var selectedCell = null;
var seconds = 0;
var timerInterval = null;

function emptyGrid() {
  var g = [];
  for (var i = 0; i < 9; i++) g.push(new Array(9).fill(0));
  return g;
}

function isValid(grid, r, c, val) {
  for (var i = 0; i < 9; i++) {
    if (grid[r][i] === val) return false;
    if (grid[i][c] === val) return false;
  }
  var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
  for (var dr = 0; dr < 3; dr++) {
    for (var dc = 0; dc < 3; dc++) {
      if (grid[br + dr][bc + dc] === val) return false;
    }
  }
  return true;
}

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

function fillGrid(grid) {
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      if (grid[r][c] !== 0) continue;
      var nums = shuffle([1,2,3,4,5,6,7,8,9]);
      for (var i = 0; i < nums.length; i++) {
        if (isValid(grid, r, c, nums[i])) {
          grid[r][c] = nums[i];
          if (fillGrid(grid)) return true;
          grid[r][c] = 0;
        }
      }
      return false;
    }
  }
  return true;
}

function generatePuzzle() {
  solution = emptyGrid();
  fillGrid(solution);

  puzzle = solution.map(function (row) { return row.slice(); });
  given = solution.map(function (row) { return row.map(function () { return true; }); });

  var cellsToRemove = 42;
  var positions = [];
  for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) positions.push([r, c]);
  shuffle(positions);

  for (var i = 0; i < cellsToRemove; i++) {
    var pos = positions[i];
    puzzle[pos[0]][pos[1]] = 0;
    given[pos[0]][pos[1]] = false;
  }
}

function render() {
  sudokuBoard.innerHTML = '';
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var cell = document.createElement('button');
      var classes = ['sudoku-cell'];
      if (given[r][c]) classes.push('given');
      if (selectedCell && selectedCell[0] === r && selectedCell[1] === c) classes.push('selected');
      if (c % 3 === 0) classes.push('border-left');
      if (r % 3 === 0) classes.push('border-top');
      if (c === 8) classes.push('border-right');
      if (r === 8) classes.push('border-bottom');
      cell.className = classes.join(' ');
      cell.textContent = puzzle[r][c] || '';

      (function (row, col) {
        cell.addEventListener('click', function () {
          if (given[row][col]) return;
          selectedCell = [row, col];
          render();
        });
      })(r, c);

      sudokuBoard.appendChild(cell);
    }
  }
}

function buildNumpad() {
  sudokuNumpad.innerHTML = '';
  for (var n = 1; n <= 9; n++) {
    (function (num) {
      var btn = document.createElement('button');
      btn.className = 'sudoku-num-btn';
      btn.textContent = num;
      btn.addEventListener('click', function () { placeNumber(num); });
      sudokuNumpad.appendChild(btn);
    })(n);
  }
  var eraseBtn = document.createElement('button');
  eraseBtn.className = 'sudoku-num-btn';
  eraseBtn.textContent = '✕';
  eraseBtn.addEventListener('click', function () { placeNumber(0); });
  sudokuNumpad.appendChild(eraseBtn);
}

function placeNumber(num) {
  if (!selectedCell) return;
  var r = selectedCell[0], c = selectedCell[1];
  if (given[r][c]) return;
  puzzle[r][c] = num;
  render();
  checkWin();
}

function checkWin() {
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      if (puzzle[r][c] !== solution[r][c]) return;
    }
  }
  clearInterval(timerInterval);
  sudokuMsg.textContent = 'Solved it in ' + formatTime(seconds) + '!';
  sudokuMsg.style.display = 'block';
}

checkBtn.addEventListener('click', function () {
  document.querySelectorAll('.sudoku-cell').forEach(function (el) { el.classList.remove('conflict'); });
  var cells = sudokuBoard.children;
  var hasConflict = false;
  for (var r = 0; r < 9; r++) {
    for (var c = 0; c < 9; c++) {
      var val = puzzle[r][c];
      if (val === 0) continue;
      var testGrid = puzzle.map(function (row) { return row.slice(); });
      testGrid[r][c] = 0;
      if (!isValid(testGrid, r, c, val)) {
        cells[r * 9 + c].classList.add('conflict');
        hasConflict = true;
      }
    }
  }
  sudokuMsg.textContent = hasConflict ? 'Some numbers conflict — highlighted in red.' : 'No conflicts so far, keep going!';
  sudokuMsg.style.display = 'block';
});

function formatTime(s) {
  var m = Math.floor(s / 60);
  var sec = s % 60;
  return m + ':' + (sec < 10 ? '0' : '') + sec;
}

function startTimer() {
  seconds = 0;
  timeValEl.textContent = '0:00';
  clearInterval(timerInterval);
  timerInterval = setInterval(function () {
    seconds++;
    timeValEl.textContent = formatTime(seconds);
  }, 1000);
}

function newGame() {
  generatePuzzle();
  selectedCell = null;
  sudokuMsg.style.display = 'none';
  render();
  startTimer();
}

newGameBtn.addEventListener('click', newGame);
buildNumpad();
newGame();