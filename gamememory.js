var memoryBoard = document.getElementById('memoryBoard');
var movesEl = document.getElementById('moves');
var pairsEl = document.getElementById('pairs');
var newGameBtn = document.getElementById('newGameBtn');
var memoryMsg = document.getElementById('memoryMsg');

var EMOJIS = ['🐶', '🐱', '🦊', '🐼', '🐸', '🐵', '🦁', '🐷'];

var cards = [];
var flipped = [];
var matched = [];
var moves = 0;
var locked = false;

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

function newGame() {
  cards = shuffle(EMOJIS.concat(EMOJIS));
  flipped = [];
  matched = [];
  moves = 0;
  locked = false;
  movesEl.textContent = moves;
  pairsEl.textContent = '0/' + EMOJIS.length;
  memoryMsg.style.display = 'none';
  render();
}

function render() {
  memoryBoard.innerHTML = '';
  cards.forEach(function (emoji, i) {
    var isFlipped = flipped.indexOf(i) > -1 || matched.indexOf(i) > -1;
    var card = document.createElement('button');
    card.className = 'memory-card' + (isFlipped ? ' flipped' : '') + (matched.indexOf(i) > -1 ? ' matched' : '');
    card.innerHTML = '<span class="memory-card-inner">' + (isFlipped ? emoji : '?') + '</span>';
    card.addEventListener('click', function () { handleFlip(i); });
    memoryBoard.appendChild(card);
  });
}

function handleFlip(i) {
  if (locked || flipped.indexOf(i) > -1 || matched.indexOf(i) > -1) return;

  flipped.push(i);
  render();

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    locked = true;

    var a = flipped[0], b = flipped[1];
    if (cards[a] === cards[b]) {
      matched.push(a, b);
      flipped = [];
      locked = false;
      pairsEl.textContent = (matched.length / 2) + '/' + EMOJIS.length;
      render();
      if (matched.length === cards.length) {
        memoryMsg.textContent = 'You matched all pairs in ' + moves + ' moves!';
        memoryMsg.style.display = 'block';
      }
    } else {
      setTimeout(function () {
        flipped = [];
        locked = false;
        render();
      }, 800);
    }
  }
}

newGameBtn.addEventListener('click', newGame);
newGame();