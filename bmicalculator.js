var unitToggle = document.getElementById('unitToggle');
var metricFields = document.getElementById('metricFields');
var imperialFields = document.getElementById('imperialFields');
var calcBtn = document.getElementById('calcBtn');
var bmiResult = document.getElementById('bmiResult');
var bmiValue = document.getElementById('bmiValue');
var bmiCategory = document.getElementById('bmiCategory');
var bmiMarker = document.getElementById('bmiMarker');
var errorBox = document.getElementById('errorBox');

var currentUnit = 'metric';

unitToggle.addEventListener('click', function (e) {
  var btn = e.target.closest('.unit-btn');
  if (!btn) return;
  document.querySelectorAll('.unit-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  currentUnit = btn.getAttribute('data-unit');
  metricFields.style.display = currentUnit === 'metric' ? 'flex' : 'none';
  imperialFields.style.display = currentUnit === 'imperial' ? 'flex' : 'none';
});

function categoryFor(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', pct: (bmi / 18.5) * 25 };
  if (bmi < 25) return { label: 'Normal', pct: 25 + ((bmi - 18.5) / (25 - 18.5)) * 25 };
  if (bmi < 30) return { label: 'Overweight', pct: 50 + ((bmi - 25) / (30 - 25)) * 25 };
  return { label: 'Obese', pct: Math.min(100, 75 + ((bmi - 30) / 10) * 25) };
}

calcBtn.addEventListener('click', function () {
  errorBox.style.display = 'none';
  bmiResult.style.display = 'none';

  var bmi = null;

  if (currentUnit === 'metric') {
    var h = parseFloat(document.getElementById('heightCm').value);
    var w = parseFloat(document.getElementById('weightKg').value);
    if (!h || !w || h <= 0 || w <= 0) {
      errorBox.textContent = 'Enter a valid height and weight.';
      errorBox.style.display = 'block';
      return;
    }
    var hMeters = h / 100;
    bmi = w / (hMeters * hMeters);
  } else {
    var ft = parseFloat(document.getElementById('heightFt').value) || 0;
    var inch = parseFloat(document.getElementById('heightIn').value) || 0;
    var lb = parseFloat(document.getElementById('weightLb').value);
    var totalInches = ft * 12 + inch;
    if (!totalInches || !lb || totalInches <= 0 || lb <= 0) {
      errorBox.textContent = 'Enter a valid height and weight.';
      errorBox.style.display = 'block';
      return;
    }
    bmi = (lb / (totalInches * totalInches)) * 703;
  }

  var cat = categoryFor(bmi);
  bmiValue.textContent = bmi.toFixed(1);
  bmiCategory.textContent = cat.label;
  bmiMarker.style.left = cat.pct + '%';
  bmiResult.style.display = 'block';
});