var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var filebar = document.getElementById('filebar');
var resetBtn = document.getElementById('resetBtn');
var previewWrap = document.getElementById('previewWrap');
var previewImg = document.getElementById('previewImg');
var dimsRow = document.getElementById('dimsRow');
var widthInput = document.getElementById('widthInput');
var heightInput = document.getElementById('heightInput');
var lockBtn = document.getElementById('lockBtn');
var actionRow = document.getElementById('actionRow');
var resizeBtn = document.getElementById('resizeBtn');
var resultEl = document.getElementById('result');
var sizeAfter = document.getElementById('sizeAfter');
var dimsPill = document.getElementById('dimsPill');
var downloadBtn = document.getElementById('downloadBtn');
var anotherBtn = document.getElementById('anotherBtn');
var errorBox = document.getElementById('errorBox');

var currentFile = null;
var originalWidth = 0, originalHeight = 0;
var aspectLocked = true;
var outputBlob = null;
var outputExt = 'jpg';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function showError(msg) {
  errorBox.style.display = 'block';
  errorBox.textContent = msg;
}

function resetAll() {
  currentFile = null;
  outputBlob = null;
  filebar.style.display = 'none';
  previewWrap.style.display = 'none';
  dimsRow.style.display = 'none';
  actionRow.style.display = 'none';
  resultEl.style.display = 'none';
  errorBox.style.display = 'none';
  dropzone.style.display = 'block';
  fileInput.value = '';
}

dropzone.addEventListener('click', function () { fileInput.click(); });
dropzone.addEventListener('dragover', function (e) { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', function () { dropzone.classList.remove('drag'); });
dropzone.addEventListener('drop', function (e) {
  e.preventDefault();
  dropzone.classList.remove('drag');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', function (e) {
  if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
});

function handleFile(file) {
  errorBox.style.display = 'none';
  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    showError("That doesn't look like a JPG or PNG.");
    return;
  }
  currentFile = file;
  outputExt = file.type === 'image/png' ? 'png' : 'jpg';

  var reader = new FileReader();
  reader.onload = function (e) {
    previewImg.src = e.target.result;
    previewImg.onload = function () {
      originalWidth = previewImg.naturalWidth;
      originalHeight = previewImg.naturalHeight;
      widthInput.value = originalWidth;
      heightInput.value = originalHeight;
    };
    previewWrap.style.display = 'block';
  };
  reader.readAsDataURL(file);

  document.getElementById('fileName').textContent = file.name + ' · ' + formatSize(file.size);
  filebar.style.display = 'flex';
  dropzone.style.display = 'none';
  dimsRow.style.display = 'flex';
  actionRow.style.display = 'block';
  resultEl.style.display = 'none';
}

resetBtn.addEventListener('click', resetAll);
anotherBtn.addEventListener('click', resetAll);

lockBtn.addEventListener('click', function () {
  aspectLocked = !aspectLocked;
  lockBtn.style.opacity = aspectLocked ? '1' : '0.4';
});

widthInput.addEventListener('input', function () {
  if (aspectLocked && originalWidth) {
    var ratio = originalHeight / originalWidth;
    heightInput.value = Math.round(widthInput.value * ratio);
  }
});
heightInput.addEventListener('input', function () {
  if (aspectLocked && originalHeight) {
    var ratio = originalWidth / originalHeight;
    widthInput.value = Math.round(heightInput.value * ratio);
  }
});

resizeBtn.addEventListener('click', function () {
  errorBox.style.display = 'none';
  var w = parseInt(widthInput.value, 10);
  var h = parseInt(heightInput.value, 10);

  if (!w || !h || w <= 0 || h <= 0) {
    showError('Enter a valid width and height.');
    return;
  }

  var canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(previewImg, 0, 0, w, h);

  var mime = currentFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
  canvas.toBlob(function (blob) {
    outputBlob = blob;
    resultEl.style.display = 'block';
    sizeAfter.textContent = formatSize(blob.size);
    dimsPill.textContent = w + ' × ' + h;
  }, mime, 0.92);
});

downloadBtn.addEventListener('click', function () {
  if (!outputBlob) return;
  var url = URL.createObjectURL(outputBlob);
  var a = document.createElement('a');
  a.href = url;
  a.download = currentFile.name.replace(/\.(jpg|jpeg|png)$/i, '') + '-resized.' + outputExt;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
});