var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var fileListWrap = document.getElementById('fileListWrap');
var fileListEl = document.getElementById('fileList');
var actionRow = document.getElementById('actionRow');
var mergeBtn = document.getElementById('mergeBtn');
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
  mergeBtn.disabled = false;
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
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) continue;
    files.push(f);
    added = true;
  }
  if (!added && files.length === 0) {
    showError("Those don't look like PDF files. Choose .pdf files to continue.");
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
    row.setAttribute('data-index', i);

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

    row.addEventListener('dragstart', function () {
      dragIndex = i;
      row.classList.add('dragging');
    });
    row.addEventListener('dragend', function () {
      row.classList.remove('dragging');
    });
    row.addEventListener('dragover', function (e) { e.preventDefault(); });
    row.addEventListener('drop', function (e) {
      e.preventDefault();
      var dropIndex = i;
      if (dragIndex === null || dragIndex === dropIndex) return;
      var moved = files.splice(dragIndex, 1)[0];
      files.splice(dropIndex, 0, moved);
      dragIndex = null;
      renderFileList();
    });

    fileListEl.appendChild(row);
  });

  mergeBtn.disabled = files.length < 2;
}

mergeBtn.addEventListener('click', function () {
  if (files.length < 2) return;
  mergeBtn.disabled = true;
  progressWrap.style.display = 'block';
  resultEl.style.display = 'none';
  errorBox.style.display = 'none';
  progressFill.style.width = '4%';

  runMerge().catch(function (err) {
    console.error(err);
    showError("Couldn't merge these files — one of them may be password-protected or corrupted.");
  });
});

async function runMerge() {
  var outDoc = await PDFLib.PDFDocument.create();
  var totalPages = 0;

  for (var i = 0; i < files.length; i++) {
    progressLabel.textContent = 'Reading ' + files[i].name + '…';
    progressFill.style.width = (5 + (i / files.length) * 80) + '%';

    var buf = await files[i].arrayBuffer();
    var srcDoc = await PDFLib.PDFDocument.load(buf);
    var pageIndices = srcDoc.getPageIndices();
    var copiedPages = await outDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach(function (p) { outDoc.addPage(p); });
    totalPages += pageIndices.length;
  }

  progressLabel.textContent = 'Finalizing…';
  progressFill.style.width = '96%';

  var outBytes = await outDoc.save();
  outputBlob = new Blob([outBytes], { type: 'application/pdf' });

  progressFill.style.width = '100%';
  setTimeout(function () {
    progressWrap.style.display = 'none';
    mergeBtn.disabled = false;
    showResult(outputBlob.size, totalPages);
  }, 200);
}

function showResult(size, pageCount) {
  resultEl.style.display = 'block';
  sizeAfter.textContent = formatSize(size);
  pageCountPill.textContent = pageCount + ' pages';
}

downloadBtn.addEventListener('click', function () {
  if (!outputBlob) return;
  var url = URL.createObjectURL(outputBlob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'merged.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
});

anotherBtn.addEventListener('click', resetAll);