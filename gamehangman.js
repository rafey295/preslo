var WORDS = [
  { word: 'PYTHON', category: 'Programming' },
  { word: 'BROWSER', category: 'Technology' },
  { word: 'ELEPHANT', category: 'Animals' },
  { word: 'MOUNTAIN', category: 'Geography' },
  { word: 'GUITAR', category: 'Music' },
  { word: 'PIZZA', category: 'Food' },
  { word: 'OCEAN', category: 'Nature' },
  { word: 'LIBRARY', category: 'Places' },
  { word: 'ASTRONAUT', category: 'Space' },
  { word: 'KEYBOARD', category: 'Technology' },
  { word: 'BUTTERFLY', category: 'Animals' },
  { word: 'CHOCOLATE', category: 'Food' },
  { word: 'VOLCANO', category: 'Geography' },
  { word: 'PAINTING', category: 'Art' },
  { word: 'BICYCLE', category: 'Transport' },
  { word: 'DIAMOND', category: 'Gems' },
  { word: 'JOURNEY', category: 'Travel' },
  { word: 'WHISPER', category: 'Words' },
  { word: 'PENGUIN', category: 'Animals' },
  { word: 'GALAXY', category: 'Space' }
];

var wrongCountEl = document.getElementById('wrongCount');
var newGameBtn = document.getElementById('newGameBtn');
var hangmanWord = document.getElementById('hangmanWord');
var hangmanHint = document.getElementById('hangmanHint');
var hangmanKeyboard = document.getElementById('hangmanKeyboard');
var hangmanMsg = document.getElementById('hangmanMsg');

var PARTS = ['hm-head', 'hm-body', 'hm-armL', 'hm-armR', 'hm-legL', 'hm-legR'];
var MAX_WRONG = 6;

var currentWord = '';
var category = '';
var guessed = [];
var wrongCount = 0;
var gameOver = false;

function newGame() {
  var pick = WORDS[Math.floor(Math.random() * WORDS.length)];
  currentWord = pick.word;
  category = pick.category;
  guessed = [];
  wrongCount = 0;
  gameOver = false;

  wrongCountEl.textContent = wrongCount + '/' + MAX_WRONG;
  hangmanHint.textContent = 'Category: ' + category;
  hangmanMsg.style.display = 'none';

  PARTS.forEach(function (id) { document.getElementById(id).style.display = 'none'; });

  renderWord();
  buildKeyboard();
}

function renderWord() {
  hangmanWord.textContent = currentWord.split('').map(function (letter) {
    return guessed.indexOf(letter) > -1 ? letter : '_';
  }).join(' ');
}

function buildKeyboard() {
  hangmanKeyboard.innerHTML = '';
  var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letters.forEach(function (letter) {
    var btn = document.createElement('button');
    btn.className = 'hangman-key';
    btn.textContent = letter;
    btn.addEventListener('click', function () { guessLetter(letter, btn); });
    hangmanKeyboard.appendChild(btn);
  });
}

function guessLetter(letter, btn) {
  if (gameOver || guessed.indexOf(letter) > -1) return;
  guessed.push(letter);

  if (currentWord.indexOf(letter) > -1) {
    btn.classList.add('correct');
    renderWord();
    checkWin();
  } else {
    btn.classList.add('wrong');
    document.getElementById(PARTS[wrongCount]).style.display = 'block';
    wrongCount++;
    wrongCountEl.textContent = wrongCount + '/' + MAX_WRONG;
    if (wrongCount >= MAX_WRONG) endGame(false);
  }
  btn.disabled = true;
}

function checkWin() {
  var solved = currentWord.split('').every(function (letter) { return guessed.indexOf(letter) > -1; });
  if (solved) endGame(true);
}

function endGame(won) {
  gameOver = true;
  hangmanMsg.textContent = won ? 'You got it! The word was ' + currentWord + '.' : 'Out of tries — the word was ' + currentWord + '.';
  hangmanMsg.style.display = 'block';
  document.querySelectorAll('.hangman-key').forEach(function (btn) { btn.disabled = true; });
}

document.addEventListener('keydown', function (e) {
  var letter = e.key.toUpperCase();
  if (letter.length === 1 && letter >= 'A' && letter <= 'Z') {
    var btn = Array.prototype.find.call(hangmanKeyboard.children, function (b) { return b.textContent === letter; });
    if (btn && !btn.disabled) guessLetter(letter, btn);
  }
});

newGameBtn.addEventListener('click', newGame);
newGame();