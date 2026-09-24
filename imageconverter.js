var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var filebar = document.getElementById('filebar');
var resetBtn = document.getElementById('resetBtn');
var previewWrap = document.getElementById('previewWrap');
var previewImg = document.getElementById('previewImg');
var formatRow = document.getElementById('formatRow');
var actionRow = document.getElementById('actionRow');
var convertBtn = document.getElementById('convertBtn');
var resultEl = document.getElementById('result');
var sizeBefore = document.getElementById('sizeBefore');
var sizeAfter = document.getElementById('sizeAfter');
var downloadBtn = document.getElementById('downloadBtn');
var anotherBtn = document.getElementById('anotherBtn');
var errorBox = document.getElementById('errorBox');

var currentFile = null;
var currentFormat = 'webp';
var currentExt = 'webp';
var outputBlob = null;

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
  formatRow.style.display = 'none';
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
  var valid = ['image/jpeg', 'image/png', 'image/webp'];
  if (valid.indexOf(file.type) === -1) {
    showError("That doesn't look like a JPG, PNG, or WebP image.");
    return;
  }
  currentFile = file;

  var reader = new FileReader();
  reader.onload = function (e) {
    previewImg.src = e.target.result;
    previewWrap.style.display = 'block';
  };
  reader.readAsDataURL(file);

  document.getElementById('fileName').textContent = file.name + ' · ' + formatSize(file.size);
  filebar.style.display = 'flex';
  dropzone.style.display = 'none';
  formatRow.style.display = 'grid';
  actionRow.style.display = 'block';
  resultEl.style.display = 'none';
}

resetBtn.addEventListener('click', resetAll);
anotherBtn.addEventListener('click', resetAll);

formatRow.addEventListener('click', function (e) {
  var card = e.target.closest('.level');
  if (!card) return;
  document.querySelectorAll('#formatRow .level').forEach(function (l) { l.classList.remove('active'); });
  card.classList.add('active');
  currentFormat = card.getAttribute('data-format');
  currentExt = card.getAttribute('data-ext');
});

convertBtn.addEventListener('click', function () {
  errorBox.style.display = 'none';

  var img = new Image();
  img.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext('2d');

    if (currentFormat === 'jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0);

    var mime = 'image/' + currentFormat;
    canvas.toBlob(function (blob) {
      if (!blob) {
        showError('Your browser could not create a ' + currentFormat.toUpperCase() + ' image.');
        return;
      }
      outputBlob = blob;
      resultEl.style.display = 'block';
      sizeBefore.textContent = formatSize(currentFile.size);
      sizeAfter.textContent = formatSize(blob.size);
    }, mime, 0.92);
  };
  img.onerror = function () { showError("Couldn't read this image."); };
  img.src = previewImg.src;
});

downloadBtn.addEventListener('click', function () {
  if (!outputBlob) return;
  var url = URL.createObjectURL(outputBlob);
  var a = document.createElement('a');
  a.href = url;
  a.download = currentFile.name.replace(/\.(jpg|jpeg|png|webp)$/i, '') + '.' + currentExt;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
});