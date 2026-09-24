var colorPicker = document.getElementById('colorPicker');
var hexValue = document.getElementById('hexValue');
var rgbValue = document.getElementById('rgbValue');
var hslValue = document.getElementById('hslValue');
var paletteGrid = document.getElementById('paletteGrid');

function hexToRgb(hex) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return { r: r, g: g, b: b };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  var c = (1 - Math.abs(2 * l - 1)) * s;
  var x = c * (1 - Math.abs((h / 60) % 2 - 1));
  var m = l - c / 2;
  var r = 0, g = 0, b = 0;

  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  var toHex = function (n) {
    var v = Math.round((n + m) * 255);
    return v.toString(16).padStart(2, '0');
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

function copyToClipboard(text, el) {
  navigator.clipboard.writeText(text).then(function () {
    var original = el.textContent;
    el.textContent = 'Copied!';
    setTimeout(function () { el.textContent = original; }, 1000);
  });
}

function update() {
  var hex = colorPicker.value.toUpperCase();
  var rgb = hexToRgb(hex);
  var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  hexValue.value = hex;
  rgbValue.value = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
  hslValue.value = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';

  var palette = [
    { label: 'Darker', hex: hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30)) },
    { label: 'Dark', hex: hslToHex(hsl.h, hsl.s, Math.max(15, hsl.l - 15)) },
    { label: 'Base', hex: hex },
    { label: 'Light', hex: hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 15)) },
    { label: 'Lighter', hex: hslToHex(hsl.h, hsl.s, Math.min(95, hsl.l + 30)) }
  ];

  paletteGrid.innerHTML = '';
  palette.forEach(function (p) {
    var swatch = document.createElement('div');
    swatch.className = 'palette-swatch';
    swatch.innerHTML =
      '<div class="palette-color" style="background:' + p.hex + ';"></div>' +
      '<div class="palette-hex mono">' + p.hex + '</div>' +
      '<div class="palette-label">' + p.label + '</div>';
    swatch.addEventListener('click', function () {
      copyToClipboard(p.hex, swatch.querySelector('.palette-hex'));
    });
    paletteGrid.appendChild(swatch);
  });
}

[hexValue, rgbValue, hslValue].forEach(function (input) {
  input.addEventListener('click', function () { copyToClipboard(input.value, input); });
});

colorPicker.addEventListener('input', update);
update();