var UNITS = {
  length: {
    label: 'Length',
    base: 'm',
    units: {
      mm: 0.001, cm: 0.01, m: 1, km: 1000,
      in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
    }
  },
  weight: {
    label: 'Weight',
    base: 'kg',
    units: {
      mg: 0.000001, g: 0.001, kg: 1, tonne: 1000,
      oz: 0.0283495, lb: 0.453592
    }
  },
  volume: {
    label: 'Volume',
    base: 'l',
    units: {
      ml: 0.001, l: 1, gal_us: 3.78541, qt_us: 0.946353,
      pt_us: 0.473176, cup_us: 0.236588, fl_oz_us: 0.0295735
    }
  },
  speed: {
    label: 'Speed',
    base: 'mps',
    units: {
      mps: 1, kph: 0.277778, mph: 0.44704, knot: 0.514444
    }
  },
  time: {
    label: 'Time',
    base: 'sec',
    units: {
      ms: 0.001, sec: 1, min: 60, hr: 3600, day: 86400, week: 604800
    }
  }
};

var categorySelect = document.getElementById('categorySelect');
var fromValue = document.getElementById('fromValue');
var toValue = document.getElementById('toValue');
var fromUnit = document.getElementById('fromUnit');
var toUnit = document.getElementById('toUnit');
var swapBtn = document.getElementById('swapBtn');

function populateUnits(category) {
  fromUnit.innerHTML = '';
  toUnit.innerHTML = '';

  if (category === 'temperature') {
    ['Celsius', 'Fahrenheit', 'Kelvin'].forEach(function (label, i) {
      var val = ['c', 'f', 'k'][i];
      fromUnit.innerHTML += '<option value="' + val + '">' + label + '</option>';
      toUnit.innerHTML += '<option value="' + val + '">' + label + '</option>';
    });
    toUnit.value = 'f';
    return;
  }

  var units = UNITS[category].units;
  var keys = Object.keys(units);
  keys.forEach(function (u) {
    fromUnit.innerHTML += '<option value="' + u + '">' + u + '</option>';
    toUnit.innerHTML += '<option value="' + u + '">' + u + '</option>';
  });
  toUnit.selectedIndex = 1;
}

function celsiusFrom(val, unit) {
  if (unit === 'c') return val;
  if (unit === 'f') return (val - 32) * 5 / 9;
  if (unit === 'k') return val - 273.15;
}
function celsiusTo(celsius, unit) {
  if (unit === 'c') return celsius;
  if (unit === 'f') return celsius * 9 / 5 + 32;
  if (unit === 'k') return celsius + 273.15;
}

function convert() {
  var val = parseFloat(fromValue.value);
  if (isNaN(val)) { toValue.value = ''; return; }

  var category = categorySelect.value;

  if (category === 'temperature') {
    var c = celsiusFrom(val, fromUnit.value);
    var result = celsiusTo(c, toUnit.value);
    toValue.value = round(result);
    return;
  }

  var units = UNITS[category].units;
  var baseVal = val * units[fromUnit.value];
  var result2 = baseVal / units[toUnit.value];
  toValue.value = round(result2);
}

function round(n) {
  if (Math.abs(n) >= 1000) return Math.round(n * 100) / 100;
  return Math.round(n * 1000000) / 1000000;
}

categorySelect.addEventListener('change', function () {
  populateUnits(categorySelect.value);
  convert();
});
fromValue.addEventListener('input', convert);
fromUnit.addEventListener('change', convert);
toUnit.addEventListener('change', convert);

swapBtn.addEventListener('click', function () {
  var tempUnit = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = tempUnit;
  fromValue.value = toValue.value;
  convert();
});

populateUnits('length');