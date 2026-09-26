var PASSAGES = [
  "The quiet morning light spread slowly across the valley as the first birds began to sing. Somewhere in the distance a train whistled, reminding the small town that the world was still turning.",
  "Learning to type quickly is a skill that pays off in almost every part of modern life, whether you are writing an email, chatting with a friend, or working on a big project at your job.",
  "A good idea rarely arrives fully formed. It usually starts as a rough sketch, gets tested against reality, and slowly turns into something worth building and sharing with other people.",
  "Technology changes fast, but the basics of clear thinking and steady practice never really go out of style, no matter how many new tools and platforms come along each year."
];

var typingPassage = document.getElementById('typingPassage');
var typingInput = document.getElementById('typingInput');
var wpmVal = document.getElementById('wpmVal');
var accVal = document.getElementById('accVal');
var timeVal = document.getElementById('timeVal');
var restartBtn = document.getElementById('restartBtn');
var typingMsg = document.getElementById('typingMsg');

var passage = '';
var startTime = null;
var timerInterval = null;
var timeLeft = 60;
var finished = false;

function loadPassage() {
  passage = PASSAGES[Math.floor(Math.random() * PASSAGES.length)];
  typingPassage.innerHTML = passage.split('').map(function (ch) {
    return '<span>' + ch + '</span>';
  }).join('');
}

function reset() {
  clearInterval(timerInterval);
  startTime = null;
  timeLeft = 60;
  finished = false;
  wpmVal.textContent = '0';
  accVal.textContent = '100%';
  timeVal.textContent = timeLeft;
  typingMsg.style.display = 'none';
  typingInput.value = '';
  typingInput.disabled = false;
  loadPassage();
  typingInput.focus();
}

function updateHighlight() {
  var typed = typingInput.value;
  var spans = typingPassage.querySelectorAll('span');
  var correct = 0;

  spans.forEach(function (span, i) {
    span.className = '';
    if (i < typed.length) {
      if (typed[i] === passage[i]) {
        span.className = 'char-correct';
        correct++;
      } else {
        span.className = 'char-wrong';
      }
    } else if (i === typed.length) {
      span.className = 'char-current';
    }
  });

  var accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
  accVal.textContent = accuracy + '%';

  if (typed.length >= passage.length) {
    finishTest();
  }
}

function updateWpm() {
  if (!startTime) return;
  var elapsedMin = (Date.now() - startTime) / 60000;
  var wordsTyped = typingInput.value.trim().length / 5;
  var wpm = elapsedMin > 0 ? Math.round(wordsTyped / elapsedMin) : 0;
  wpmVal.textContent = wpm;
}

typingInput.addEventListener('input', function () {
  if (finished) return;
  if (!startTime) {
    startTime = Date.now();
    timerInterval = setInterval(function () {
      timeLeft--;
      timeVal.textContent = timeLeft;
      updateWpm();
      if (timeLeft <= 0) finishTest();
    }, 1000);
  }
  updateHighlight();
  updateWpm();
});

function finishTest() {
  if (finished) return;
  finished = true;
  clearInterval(timerInterval);
  typingInput.disabled = true;
  updateWpm();
  typingMsg.textContent = 'Done! ' + wpmVal.textContent + ' WPM at ' + accVal.textContent + ' accuracy.';
  typingMsg.style.display = 'block';
}

restartBtn.addEventListener('click', reset);
reset();