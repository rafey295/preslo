var gradientPreview = document.getElementById('gradientPreview');
var typeToggle = document.getElementById('typeToggle');
var angleField = document.getElementById('angleField');
var angleSlider = document.getElementById('angleSlider');
var angleValue = document.getElementById('angleValue');
var gradientColors = document.getElementById('gradientColors');
var addColorBtn = document.getElementById('addColorBtn');
var cssOutput = document.getElementById('cssOutput');
var copyBtn = document.getElementById('copyBtn');

var currentType = 'linear';
var colors = ['#9C6E13', '#E8B23D'];

function renderColorInputs() {
  gradientColors.innerHTML = '';
  colors.forEach(function (color, i) {
    var row = document.createElement('div');
    row.className = 'gradient-color-row';
    row.innerHTML =
      '<input type="color" value="' + color + '" data-index="' + i + '" />' +
      '<span class="mono">' + color.toUpperCase() + '</span>' +
      (colors.length > 2 ? '<button class="gradient-remove" data-index="' + i + '" aria-label="Remove">&times;</button>' : '');
    gradientColors.appendChild(row);
  });

  gradientColors.querySelectorAll('input[type="color"]').forEach(function (input) {
    input.addEventListener('input', function () {
      colors[parseInt(input.getAttribute('data-index'), 10)] = input.value;
      renderColorInputs();
      update();
    });
  });
  gradientColors.querySelectorAll('.gradient-remove').forEach(function (btn) {
    btn.addEventListener('click', function () {
      colors.splice(parseInt(btn.getAttribute('data-index'), 10), 1);
      renderColorInputs();
      update();
    });
  });
}

addColorBtn.addEventListener('click', function () {
  var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  colors.push(randomColor);
  renderColorInputs();
  update();
});

typeToggle.addEventListener('click', function (e) {
  var btn = e.target.closest('.unit-btn');
  if (!btn) return;
  document.querySelectorAll('#typeToggle .unit-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  currentType = btn.getAttribute('data-type');
  angleField.style.display = currentType === 'linear' ? 'block' : 'none';
  update();
});

angleSlider.addEventListener('input', function () {
  angleValue.textContent = angleSlider.value;
  update();
});

function update() {
  var css;
  if (currentType === 'linear') {
    css = 'linear-gradient(' + angleSlider.value + 'deg, ' + colors.join(', ') + ')';
  } else {
    css = 'radial-gradient(circle, ' + colors.join(', ') + ')';
  }
  gradientPreview.style.background = css;
  cssOutput.value = 'background: ' + css + ';';
}

copyBtn.addEventListener('click', function () {
  navigator.clipboard.writeText(cssOutput.value).then(function () {
    var original = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(function () { copyBtn.textContent = original; }, 1200);
  });
});

renderColorInputs();
update();