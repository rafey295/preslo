var pwText = document.getElementById('pwText');
var pwCopyBtn = document.getElementById('pwCopyBtn');
var pwStrength = document.getElementById('pwStrength');
var lengthSlider = document.getElementById('lengthSlider');
var lengthValue = document.getElementById('lengthValue');
var optUpper = document.getElementById('optUpper');
var optLower = document.getElementById('optLower');
var optNumbers = document.getElementById('optNumbers');
var optSymbols = document.getElementById('optSymbols');
var generateBtn = document.getElementById('generateBtn');
var errorBox = document.getElementById('errorBox');

var CHAR_SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_-+=?'
};

lengthSlider.addEventListener('input', function () {
  lengthValue.textContent = lengthSlider.value;
});

function secureRandomInt(max) {
  var array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function generatePassword() {
  errorBox.style.display = 'none';

  var sets = [];
  if (optUpper.checked) sets.push(CHAR_SETS.upper);
  if (optLower.checked) sets.push(CHAR_SETS.lower);
  if (optNumbers.checked) sets.push(CHAR_SETS.numbers);
  if (optSymbols.checked) sets.push(CHAR_SETS.symbols);

  if (sets.length === 0) {
    errorBox.textContent = 'Select at least one character type.';
    errorBox.style.display = 'block';
    return;
  }

  var length = parseInt(lengthSlider.value, 10);
  var allChars = sets.join('');
  var passwordChars = [];

  sets.forEach(function (set) {
    passwordChars.push(set[secureRandomInt(set.length)]);
  });

  while (passwordChars.length < length) {
    passwordChars.push(allChars[secureRandomInt(allChars.length)]);
  }

  for (var i = passwordChars.length - 1; i > 0; i--) {
    var j = secureRandomInt(i + 1);
    var temp = passwordChars[i];
    passwordChars[i] = passwordChars[j];
    passwordChars[j] = temp;
  }

  var password = passwordChars.join('');
  pwText.textContent = password;
  updateStrength(password, sets.length);
}

function updateStrength(password, typeCount) {
  var score = 0;
  if (password.length >= 12) score++;
  if (password.length >= 18) score++;
  if (typeCount >= 3) score++;
  if (typeCount === 4) score++;

  var labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  var colors = ['var(--danger)', 'var(--danger)', 'var(--star)', 'var(--good)', 'var(--good)'];
  pwStrength.textContent = labels[score];
  pwStrength.style.color = colors[score];
}

pwCopyBtn.addEventListener('click', function () {
  var text = pwText.textContent;
  if (!text || text === 'Click Generate') return;
  navigator.clipboard.writeText(text).then(function () {
    var original = pwCopyBtn.innerHTML;
    pwCopyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
    setTimeout(function () { pwCopyBtn.innerHTML = original; }, 1200);
  });
});

generateBtn.addEventListener('click', generatePassword);
generatePassword();