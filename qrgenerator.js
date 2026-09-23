var qrText = document.getElementById('qrText');
var generateBtn = document.getElementById('generateBtn');
var qrResult = document.getElementById('qrResult');
var qrCanvasWrap = document.getElementById('qrCanvasWrap');
var downloadBtn = document.getElementById('downloadBtn');
var errorBox = document.getElementById('errorBox');

var qrInstance = null;

function showError(msg) {
  errorBox.style.display = 'block';
  errorBox.textContent = msg;
}

generateBtn.addEventListener('click', function () {
  errorBox.style.display = 'none';
  var text = qrText.value.trim();
  if (!text) {
    showError('Type a link or some text first.');
    return;
  }

  qrCanvasWrap.innerHTML = '';

  try {
    qrInstance = new QRCode(qrCanvasWrap, {
      text: text,
      width: 260,
      height: 260,
      colorDark: '#1B1F24',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.H
    });
  } catch (err) {
    console.error(err);
    showError("Couldn't generate a QR code for that input. Try shorter text.");
    return;
  }

  qrResult.style.display = 'block';
});

downloadBtn.addEventListener('click', function () {
  var img = qrCanvasWrap.querySelector('img');
  var canvas = qrCanvasWrap.querySelector('canvas');
  var dataUrl = img ? img.src : (canvas ? canvas.toDataURL('image/png') : null);
  if (!dataUrl) return;

  var a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'qr-code.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

qrText.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    generateBtn.click();
  }
});