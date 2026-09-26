var youScoreEl = document.getElementById('youScore');
var cpuScoreEl = document.getElementById('cpuScore');
var youEmoji = document.getElementById('youEmoji');
var cpuEmoji = document.getElementById('cpuEmoji');
var rpsResult = document.getElementById('rpsResult');
var resetBtn = document.getElementById('resetBtn');
var choices = document.querySelectorAll('.rps-choice');

var EMOJI = { rock: '✊', paper: '✋', scissors: '✌️' };
var BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

var youScore = 0, cpuScore = 0;

choices.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var youChoice = btn.getAttribute('data-choice');
    var options = ['rock', 'paper', 'scissors'];
    var cpuChoice = options[Math.floor(Math.random() * 3)];

    youEmoji.textContent = EMOJI[youChoice];
    cpuEmoji.textContent = EMOJI[cpuChoice];

    if (youChoice === cpuChoice) {
      rpsResult.textContent = "It's a tie! Both picked " + youChoice + '.';
    } else if (BEATS[youChoice] === cpuChoice) {
      youScore++;
      youScoreEl.textContent = youScore;
      rpsResult.textContent = 'You win! ' + cap(youChoice) + ' beats ' + cpuChoice + '.';
    } else {
      cpuScore++;
      cpuScoreEl.textContent = cpuScore;
      rpsResult.textContent = 'Computer wins! ' + cap(cpuChoice) + ' beats ' + youChoice + '.';
    }
  });
});

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

resetBtn.addEventListener('click', function () {
  youScore = 0;
  cpuScore = 0;
  youScoreEl.textContent = '0';
  cpuScoreEl.textContent = '0';
  youEmoji.textContent = '❔';
  cpuEmoji.textContent = '❔';
  rpsResult.textContent = 'Choose your move';
});