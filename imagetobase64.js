var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var filebar = document.getElementById('filebar');
var resetBtn = document.getElementById('resetBtn');
var previewWrap = document.getElementById('previewWrap');
var previewImg = document.getElementById('previewImg');
var resultWrap = document.getElementById('resultWrap');
var base64Output = document.getElementById('base64Output');
var copyBtn = document.getElementById('copyBtn');
var copyCssBtn = document.getElementById('copyCssBtn');
var anotherBtn = document.getElementById('anotherBtn');
var errorBox = document.getElementById('errorBox');

var currentFile = null;
var currentDataUrl = null;

function showError(msg) {
  errorBox.style.display = 'block';
  errorBox.textContent = msg;
}

function resetAll() {
  currentFile = null;
  currentDataUrl = null;
  filebar.style.display = 'none';
  previewWrap.style.display = 'none';
  resultWrap.style.display = 'none';
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
  if (file.type.indexOf('image/') !== 0) {
    showError('Choose an image file to continue.');
    return;
  }
  currentFile = file;

  var reader = new FileReader();
  reader.onload = function (e) {
    currentDataUrl = e.target.result;
    previewImg.src = currentDataUrl;
    previewWrap.style.display = 'block';
    base64Output.value = currentDataUrl;
    resultWrap.style.display = 'block';
  };
  reader.readAsDataURL(file);

  document.getElementById('fileName').textContent = file.name;
  filebar.style.display = 'flex';
  dropzone.style.display = 'none';
}

resetBtn.addEventListener('click', resetAll);
anotherBtn.addEventListener('click', resetAll);

copyBtn.addEventListener('click', function () {
  navigator.clipboard.writeText(base64Output.value).then(function () {
    var original = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(function () { copyBtn.textContent = original; }, 1200);
  });
});

copyCssBtn.addEventListener('click', function () {
  var css = 'background-image: url("' + currentDataUrl + '");';
  navigator.clipboard.writeText(css).then(function () {
    var original = copyCssBtn.textContent;
    copyCssBtn.textContent = 'Copied!';
    setTimeout(function () { copyCssBtn.textContent = original; }, 1200);
  });
});