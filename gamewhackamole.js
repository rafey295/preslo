var moleGrid = document.getElementById('moleGrid');
var scoreEl = document.getElementById('score');
var timeLeftEl = document.getElementById('timeLeft');
var startBtn = document.getElementById('startBtn');
var moleMsg = document.getElementById('moleMsg');

var HOLE_COUNT = 9;
var score = 0;
var timeLeft = 30;
var running = false;
var activeHole = -1;
var moleTimeout = null;
var countdownInterval = null;

function buildGrid() {
  moleGrid.innerHTML = '';
  for (var i = 0; i < HOLE_COUNT; i++) {
    var hole = document.createElement('button');
    hole.className = 'mole-hole';
    hole.innerHTML = '<span class="mole-face">🐹</span>';
    hole.addEventListener('click', function (e) {
      var idx = Array.prototype.indexOf.call(moleGrid.children, e.currentTarget);
      whack(idx);
    });
    moleGrid.appendChild(hole);
  }
}

function whack(idx) {
  if (!running || idx !== activeHole) return;
  score++;
  scoreEl.textContent = score;
  moleGrid.children[idx].classList.remove('up');
  activeHole = -1;
}

function popRandomMole() {
  if (!running) return;
  if (activeHole > -1) moleGrid.children[activeHole].classList.remove('up');

  activeHole = Math.floor(Math.random() * HOLE_COUNT);
  moleGrid.children[activeHole].classList.add('up');

  var upTime = Math.max(450, 1000 - (30 - timeLeft) * 18);
  moleTimeout = setTimeout(function () {
    if (activeHole > -1) moleGrid.children[activeHole].classList.remove('up');
    activeHole = -1;
    if (running) popRandomMole();
  }, upTime);
}

function startGame() {
  running = true;
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timeLeftEl.textContent = timeLeft;
  moleMsg.style.display = 'none';
  startBtn.disabled = true;
  startBtn.textContent = 'Playing…';

  buildGrid();
  popRandomMole();

  countdownInterval = setInterval(function () {
    timeLeft--;
    timeLeftEl.textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  running = false;
  clearInterval(countdownInterval);
  clearTimeout(moleTimeout);
  if (activeHole > -1) moleGrid.children[activeHole].classList.remove('up');
  activeHole = -1;

  startBtn.disabled = false;
  startBtn.textContent = 'Play Again';
  moleMsg.textContent = "Time's up! Final score: " + score;
  moleMsg.style.display = 'block';
}

startBtn.addEventListener('click', startGame);
buildGrid();