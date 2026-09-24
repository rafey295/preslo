var pctTabs = document.getElementById('pctTabs');
var basicMode = document.getElementById('basicMode');
var increaseMode = document.getElementById('increaseMode');
var whatpctMode = document.getElementById('whatpctMode');
var calcBtn = document.getElementById('calcBtn');
var pctResult = document.getElementById('pctResult');
var pctAnswer = document.getElementById('pctAnswer');
var pctLabel = document.getElementById('pctLabel');
var errorBox = document.getElementById('errorBox');

var currentMode = 'basic';

pctTabs.addEventListener('click', function (e) {
  var btn = e.target.closest('.unit-btn');
  if (!btn) return;
  document.querySelectorAll('#pctTabs .unit-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  currentMode = btn.getAttribute('data-mode');

  basicMode.style.display = currentMode === 'basic' ? 'flex' : 'none';
  increaseMode.style.display = currentMode === 'increase' ? 'flex' : 'none';
  whatpctMode.style.display = currentMode === 'whatpct' ? 'flex' : 'none';

  pctResult.style.display = 'none';
  errorBox.style.display = 'none';
});

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
  pctResult.style.display = 'none';
}

calcBtn.addEventListener('click', function () {
  errorBox.style.display = 'none';

  if (currentMode === 'basic') {
    var pct = parseFloat(document.getElementById('basicPct').value);
    var val = parseFloat(document.getElementById('basicVal').value);
    if (isNaN(pct) || isNaN(val)) { showError('Fill in both fields.'); return; }
    var answer = (pct / 100) * val;
    pctAnswer.textContent = answer.toLocaleString(undefined, { maximumFractionDigits: 2 });
    pctLabel.textContent = pct + '% of ' + val;
  }

  if (currentMode === 'increase') {
    var from = parseFloat(document.getElementById('fromVal').value);
    var to = parseFloat(document.getElementById('toVal').value);
    if (isNaN(from) || isNaN(to) || from === 0) { showError('Enter a valid "from" (non-zero) and "to" value.'); return; }
    var change = ((to - from) / Math.abs(from)) * 100;
    pctAnswer.textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
    pctLabel.textContent = change >= 0 ? 'Increase' : 'Decrease';
  }

  if (currentMode === 'whatpct') {
    var x = parseFloat(document.getElementById('xVal').value);
    var y = parseFloat(document.getElementById('yVal').value);
    if (isNaN(x) || isNaN(y) || y === 0) { showError('Enter a valid X and a non-zero Y.'); return; }
    var result = (x / y) * 100;
    pctAnswer.textContent = result.toFixed(2) + '%';
    pctLabel.textContent = x + ' is this % of ' + y;
  }

  pctResult.style.display = 'block';
});