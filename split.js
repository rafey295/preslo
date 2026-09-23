var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var filebar = document.getElementById('filebar');
var resetBtn = document.getElementById('resetBtn');
var rangeRow = document.getElementById('rangeRow');
var rangeInfo = document.getElementById('rangeInfo');
var fromPage = document.getElementById('fromPage');
var toPage = document.getElementById('toPage');
var actionRow = document.getElementById('actionRow');
var splitBtn = document.getElementById('splitBtn');
var progressWrap = document.getElementById('progressWrap');
var progressFill = document.getElementById('progressFill');
var progressLabel = document.getElementById('progressLabel');
var resultEl = document.getElementById('result');
var sizeAfter = document.getElementById('sizeAfter');
var pageCountPill = document.getElementById('pageCountPill');
var downloadBtn = document.getElementById('downloadBtn');
var anotherBtn = document.getElementById('anotherBtn');
var errorBox = document.getElementById('errorBox');

var currentFile = null;
var totalPages = 0;
var outputBlob = null;

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function showError(msg) {
  errorBox.style.display = 'block';
  errorBox.textContent = msg;
  progressWrap.style.display = 'none';
  splitBtn.disabled = false;
}

function resetAll() {
  currentFile = null;
  outputBlob = null;
  filebar.style.display = 'none';
  rangeRow.style.display = 'none';
  actionRow.style.display = 'none';
  progressWrap.style.display = 'none';
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

async function handleFile(file) {
  errorBox.style.display = 'none';
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    showError("That file doesn't look like a PDF. Choose a .pdf file to continue.");
    return;
  }

  try {
    var buf = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(buf);
    totalPages = doc.getPageCount();
  } catch (err) {
    showError("This PDF couldn't be read — it may be password-protected or corrupted.");
    return;
  }

  currentFile = file;
  document.getElementById('fileName').textContent = file.name + ' · ' + formatSize(file.size);
  filebar.style.display = 'flex';
  dropzone.style.display = 'none';

  rangeInfo.textContent = totalPages + (totalPages === 1 ? ' page' : ' pages') + ' total';
  fromPage.min = 1; fromPage.max = totalPages; fromPage.value = 1;
  toPage.min = 1; toPage.max = totalPages; toPage.value = totalPages;
  rangeRow.style.display = 'block';

  actionRow.style.display = 'block';
  resultEl.style.display = 'none';
}

resetBtn.addEventListener('click', resetAll);
anotherBtn.addEventListener('click', resetAll);

splitBtn.addEventListener('click', function () {
  if (!currentFile) return;

  var from = parseInt(fromPage.value, 10);
  var to = parseInt(toPage.value, 10);

  if (isNaN(from) || isNaN(to) || from < 1 || to > totalPages || from > to) {
    showError('Enter a valid page range between 1 and ' + totalPages + '.');
    return;
  }

  splitBtn.disabled = true;
  progressWrap.style.display = 'block';
  resultEl.style.display = 'none';
  errorBox.style.display = 'none';
  progressFill.style.width = '10%';

  runSplit(from, to).catch(function (err) {
    console.error(err);
    showError("Couldn't extract those pages. Try a different range.");
  });
});

async function runSplit(from, to) {
  var buf = await currentFile.arrayBuffer();
  var srcDoc = await PDFLib.PDFDocument.load(buf);

  progressLabel.textContent = 'Extracting pages ' + from + '–' + to + '…';
  progressFill.style.width = '40%';

  var indices = [];
  for (var i = from - 1; i <= to - 1; i++) indices.push(i);

  var outDoc = await PDFLib.PDFDocument.create();
  var copiedPages = await outDoc.copyPages(srcDoc, indices);
  copiedPages.forEach(function (p) { outDoc.addPage(p); });

  progressFill.style.width = '90%';
  var outBytes = await outDoc.save();
  outputBlob = new Blob([outBytes], { type: 'application/pdf' });

  progressFill.style.width = '100%';
  setTimeout(function () {
    progressWrap.style.display = 'none';
    splitBtn.disabled = false;
    showResult(outputBlob.size, indices.length);
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
  a.download = currentFile.name.replace(/\.pdf$/i, '') + '-extracted.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
});