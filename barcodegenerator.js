var barcodeText = document.getElementById('barcodeText');
var formatSelect = document.getElementById('formatSelect');
var generateBtn = document.getElementById('generateBtn');
var barcodeResult = document.getElementById('barcodeResult');
var barcodeSvg = document.getElementById('barcodeSvg');
var downloadBtn = document.getElementById('downloadBtn');
var errorBox = document.getElementById('errorBox');

generateBtn.addEventListener('click', function () {
  errorBox.style.display = 'none';
  var text = barcodeText.value.trim();

  if (!text) {
    errorBox.textContent = 'Enter some text or a number first.';
    errorBox.style.display = 'block';
    return;
  }

  try {
    JsBarcode(barcodeSvg, text, {
      format: formatSelect.value,
      lineColor: '#1B1F24',
      width: 2,
      height: 90,
      displayValue: true,
      background: '#FFFFFF',
      margin: 14
    });
    barcodeResult.style.display = 'block';
  } catch (err) {
    errorBox.textContent = "That value doesn't fit the " + formatSelect.value + ' format. Try CODE128 for general text, or check the digit count for EAN/UPC.';
    errorBox.style.display = 'block';
    barcodeResult.style.display = 'none';
  }
});

downloadBtn.addEventListener('click', function () {
  var svgData = new XMLSerializer().serializeToString(barcodeSvg);
  var svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  var url = URL.createObjectURL(svgBlob);

  var img = new Image();
  img.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    canvas.toBlob(function (blob) {
      var pngUrl = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'barcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(pngUrl); }, 1000);
    }, 'image/png');
  };
  img.src = url;
});

generateBtn.click();