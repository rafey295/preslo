var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var filebar = document.getElementById('filebar');
var resetBtn = document.getElementById('resetBtn');
var previewWrap = document.getElementById('previewWrap');
var previewImg = document.getElementById('previewImg');
var levelsEl = document.getElementById('levels');
var actionRow = document.getElementById('actionRow');
var compressBtn = document.getElementById('compressBtn');
var resultEl = document.getElementById('result');
var sizeBefore = document.getElementById('sizeBefore');
var sizeAfter = document.getElementById('sizeAfter');
var savingsPill = document.getElementById('savingsPill');
var downloadBtn = document.getElementById('downloadBtn');
var anotherBtn = document.getElementById('anotherBtn');
var errorBox = document.getElementById('errorBox');

var currentFile = null;
var currentQuality = 0.65;
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
  compressBtn.disabled = false;
}

function resetAll() {
  currentFile = null;
  outputBlob = null;
  filebar.style.display = 'none';
  previewWrap.style.display = 'none';
  levelsEl.style.display = 'none';
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
    showError("That doesn't look like a JPG or PNG. Choose an image file to continue.");
    return;
  }
  currentFile = file;
  outputExt = file.type === 'image/png' ? 'png' : 'jpg';

  var reader = new FileReader();
  reader.onload = function (e) {
    previewImg.src = e.target.result;
    previewWrap.style.display = 'block';
  };
  reader.readAsDataURL(file);

  document.getElementById('fileName').textContent = file.name + ' · ' + formatSize(file.size);
  filebar.style.display = 'flex';
  dropzone.style.display = 'none';
  levelsEl.style.display = 'grid';
  actionRow.style.display = 'block';
  resultEl.style.display = 'none';
}

resetBtn.addEventListener('click', resetAll);
anotherBtn.addEventListener('click', resetAll);

levelsEl.addEventListener('click', function (e) {
  var card = e.target.closest('.level');
  if (!card) return;
  document.querySelectorAll('#levels .level').forEach(function (l) { l.classList.remove('active'); });
  card.classList.add('active');
  currentQuality = parseFloat(card.getAttribute('data-quality'));
});

compressBtn.addEventListener('click', function () {
  if (!currentFile) return;
  compressBtn.disabled = true;
  errorBox.style.display = 'none';

  var img = new Image();
  img.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    var mime = currentFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
    canvas.toBlob(function (blob) {
      outputBlob = blob;
      compressBtn.disabled = false;
      showResult(currentFile.size, blob.size);
    }, mime, currentQuality);
  };
  img.onerror = function () {
    showError("Couldn't read this image. Try a different file.");
  };
  img.src = previewImg.src;
});

function showResult(before, after) {
  resultEl.style.display = 'block';
  sizeBefore.textContent = formatSize(before);
  sizeAfter.textContent = formatSize(after);
  var pct = Math.max(0, Math.round((1 - after / before) * 100));
  savingsPill.textContent = pct > 0 ? '−' + pct + '%' : 'no change';
}

downloadBtn.addEventListener('click', function () {
  if (!outputBlob) return;
  var url = URL.createObjectURL(outputBlob);
  var a = document.createElement('a');
  a.href = url;
  a.download = currentFile.name.replace(/\.(jpg|jpeg|png)$/i, '') + '-compressed.' + outputExt;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
});