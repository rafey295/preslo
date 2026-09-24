var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var fileListWrap = document.getElementById('fileListWrap');
var fileListEl = document.getElementById('fileList');
var actionRow = document.getElementById('actionRow');
var convertBtn = document.getElementById('convertBtn');
var progressWrap = document.getElementById('progressWrap');
var progressFill = document.getElementById('progressFill');
var progressLabel = document.getElementById('progressLabel');
var resultEl = document.getElementById('result');
var sizeAfter = document.getElementById('sizeAfter');
var pageCountPill = document.getElementById('pageCountPill');
var downloadBtn = document.getElementById('downloadBtn');
var anotherBtn = document.getElementById('anotherBtn');
var errorBox = document.getElementById('errorBox');

var files = [];
var outputBlob = null;
var dragIndex = null;

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function showError(msg) {
  errorBox.style.display = 'block';
  errorBox.textContent = msg;
  progressWrap.style.display = 'none';
  convertBtn.disabled = false;
}

function resetAll() {
  files = [];
  outputBlob = null;
  fileListWrap.style.display = 'none';
  actionRow.style.display = 'none';
  progressWrap.style.display = 'none';
  resultEl.style.display = 'none';
  errorBox.style.display = 'none';
  dropzone.style.display = 'block';
  fileInput.value = '';
  renderFileList();
}

dropzone.addEventListener('click', function () { fileInput.click(); });
dropzone.addEventListener('dragover', function (e) { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', function () { dropzone.classList.remove('drag'); });
dropzone.addEventListener('drop', function (e) {
  e.preventDefault();
  dropzone.classList.remove('drag');
  if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', function (e) {
  if (e.target.files) addFiles(e.target.files);
});

function addFiles(fileListObj) {
  errorBox.style.display = 'none';
  var added = false;
  for (var i = 0; i < fileListObj.length; i++) {
    var f = fileListObj[i];
    if (f.type !== 'image/jpeg' && f.type !== 'image/png') continue;
    files.push(f);
    added = true;
  }
  if (!added && files.length === 0) {
    showError("Those don't look like JPG or PNG images.");
    return;
  }
  dropzone.style.display = 'none';
  fileListWrap.style.display = 'block';
  actionRow.style.display = 'block';
  resultEl.style.display = 'none';
  renderFileList();
  fileInput.value = '';
}

function renderFileList() {
  fileListEl.innerHTML = '';
  files.forEach(function (f, i) {
    var row = document.createElement('div');
    row.className = 'file-row';
    row.draggable = true;

    row.innerHTML =
      '<svg class="drag-handle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01"/></svg>' +
      '<div class="file-row-info">' +
        '<div class="file-row-name mono">' + f.name + '</div>' +
        '<div class="file-row-size">' + formatSize(f.size) + '</div>' +
      '</div>' +
      '<button class="file-row-remove" aria-label="Remove">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      '</button>';

    row.querySelector('.file-row-remove').addEventListener('click', function () {
      files.splice(i, 1);
      if (files.length === 0) { resetAll(); return; }
      renderFileList();
    });

    row.addEventListener('dragstart', function () { dragIndex = i; row.classList.add('dragging'); });
    row.addEventListener('dragend', function () { row.classList.remove('dragging'); });
    row.addEventListener('dragover', function (e) { e.preventDefault(); });
    row.addEventListener('drop', function (e) {
      e.preventDefault();
      if (dragIndex === null || dragIndex === i) return;
      var moved = files.splice(dragIndex, 1)[0];
      files.splice(i, 0, moved);
      dragIndex = null;
      renderFileList();
    });

    fileListEl.appendChild(row);
  });

  convertBtn.disabled = files.length < 1;
}

convertBtn.addEventListener('click', function () {
  if (files.length < 1) return;
  convertBtn.disabled = true;
  progressWrap.style.display = 'block';
  resultEl.style.display = 'none';
  errorBox.style.display = 'none';
  progressFill.style.width = '4%';

  runConvert().catch(function (err) {
    console.error(err);
    showError("Couldn't build the PDF — one of the images may be corrupted.");
  });
});

async function runConvert() {
  var outDoc = await PDFLib.PDFDocument.create();

  for (var i = 0; i < files.length; i++) {
    progressLabel.textContent = 'Adding ' + files[i].name + '…';
    progressFill.style.width = (5 + (i / files.length) * 85) + '%';

    var bytes = await files[i].arrayBuffer();
    var img;
    if (files[i].type === 'image/png') {
      img = await outDoc.embedPng(bytes);
    } else {
      img = await outDoc.embedJpg(bytes);
    }

    var page = outDoc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  progressLabel.textContent = 'Finalizing…';
  progressFill.style.width = '96%';

  var outBytes = await outDoc.save();
  outputBlob = new Blob([outBytes], { type: 'application/pdf' });

  progressFill.style.width = '100%';
  setTimeout(function () {
    progressWrap.style.display = 'none';
    convertBtn.disabled = false;
    showResult(outputBlob.size, files.length);
  }, 200);
}

function showResult(size, pageCount) {
  resultEl.style.display = 'block';
  sizeAfter.textContent = formatSize(size);
  pageCountPill.textContent = pageCount + (pageCount === 1 ? ' page' : ' pages');
}

downloadBtn.addEventListener('click', function () {
  if (!outputBlob) return;
  var url = URL.createObjectURL(outputBlob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'images.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
});

anotherBtn.addEventListener('click', resetAll);