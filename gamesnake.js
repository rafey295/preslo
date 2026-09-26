var canvas = document.getElementById('snakeCanvas');
var ctx = canvas.getContext('2d');
var scoreEl = document.getElementById('score');
var bestEl = document.getElementById('best');
var newGameBtn = document.getElementById('newGameBtn');
var snakeOverlay = document.getElementById('snakeOverlay');
var overlayText = document.getElementById('overlayText');
var startBtn = document.getElementById('startBtn');
var touchControls = document.getElementById('touchControls');

var GRID = 18;
var CELL = canvas.width / GRID;

var snake, dir, nextDir, food, score, best = 0, running = false, gameLoop;

try { best = parseInt(localStorage.getItem('preslo-snake-best')) || 0; } catch (e) {}
bestEl.textContent = best;

function resetState() {
  snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
  dir = 'right';
  nextDir = 'right';
  score = 0;
  scoreEl.textContent = score;
  placeFood();
  draw();
}

function placeFood() {
  var valid = false;
  while (!valid) {
    food = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    valid = !snake.some(function (s) { return s.x === food.x && s.y === food.y; });
  }
}

function draw() {
  var cs = getComputedStyle(document.documentElement);
  ctx.fillStyle = cs.getPropertyValue('--surface-2').trim() || '#EAE4D6';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = cs.getPropertyValue('--danger').trim() || '#A5402F';
  ctx.beginPath();
  ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.4, 0, Math.PI * 2);
  ctx.fill();

  snake.forEach(function (seg, i) {
    ctx.fillStyle = i === 0 ? (cs.getPropertyValue('--accent').trim() || '#9C6E13') : (cs.getPropertyValue('--good').trim() || '#3F6E4A');
    ctx.beginPath();
    ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4);
    ctx.fill();
  });
}

function step() {
  dir = nextDir;
  var head = { x: snake[0].x, y: snake[0].y };
  if (dir === 'up') head.y -= 1;
  if (dir === 'down') head.y += 1;
  if (dir === 'left') head.x -= 1;
  if (dir === 'right') head.x += 1;

  if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || snake.some(function (s) { return s.x === head.x && s.y === head.y; })) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      try { localStorage.setItem('preslo-snake-best', best); } catch (e) {}
    }
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function startGame() {
  resetState();
  running = true;
  snakeOverlay.style.display = 'none';
  clearInterval(gameLoop);
  gameLoop = setInterval(step, 110);
}

function endGame() {
  running = false;
  clearInterval(gameLoop);
  overlayText.textContent = 'Game over — score: ' + score + '. Press Start to try again.';
  snakeOverlay.style.display = 'flex';
}

function setDirection(d) {
  var opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
  if (opposite[d] === dir) return;
  nextDir = d;
  if (!running) startGame();
}

document.addEventListener('keydown', function (e) {
  var map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  if (map[e.key]) {
    e.preventDefault();
    setDirection(map[e.key]);
  }
});

touchControls.querySelectorAll('.snake-dir').forEach(function (btn) {
  btn.addEventListener('click', function () { setDirection(btn.getAttribute('data-dir')); });
});

startBtn.addEventListener('click', startGame);
newGameBtn.addEventListener('click', startGame);

var touchStartX = 0, touchStartY = 0;
canvas.addEventListener('touchstart', function (e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
canvas.addEventListener('touchend', function (e) {
  var dx = e.changedTouches[0].clientX - touchStartX;
  var dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (Math.abs(dx) > 20) setDirection(dx > 0 ? 'right' : 'left');
  } else {
    if (Math.abs(dy) > 20) setDirection(dy > 0 ? 'down' : 'up');
  }
}, { passive: true });

resetState();