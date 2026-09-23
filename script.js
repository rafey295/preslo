pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var filebar = document.getElementById('filebar');
var resetBtn = document.getElementById('resetBtn');
var levelsEl = document.getElementById('levels');
var actionRow = document.getElementById('actionRow');
var compressBtn = document.getElementById('compressBtn');
var progressWrap = document.getElementById('progressWrap');
var progressFill = document.getElementById('progressFill');
var progressLabel = document.getElementById('progressLabel');
var resultEl = document.getElementById('result');
var sizeBefore = document.getElementById('sizeBefore');
var sizeAfter = document.getElementById('sizeAfter');
var savingsPill = document.getElementById('savingsPill');
var downloadBtn = document.getElementById('downloadBtn');
var anotherBtn = document.getElementById('anotherBtn');
var errorBox = document.getElementById('errorBox');

var currentFile = null;
var currentLevel = 'recommended';
var outputBlob = null;
var outputName = 'compressed.pdf';

var LEVELS = {
  low: { scale: 1.8, quality: 0.85 },
  recommended: { scale: 1.35, quality: 0.68 },
  high: { scale: 1.0, quality: 0.48 }
};

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function showError(msg) {
  errorBox.style.display = 'block';
  errorBox.textContent = msg;
  progressWrap.style.display = 'none';
  compressBtn.disabled = false;
}

function resetAll() {
  currentFile = null;
  outputBlob = null;
  filebar.style.display = 'none';
  levelsEl.style.display = 'none';
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

function handleFile(file) {
  errorBox.style.display = 'none';
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    showError("That file doesn't look like a PDF. Choose a .pdf file to continue.");
    return;
  }
  currentFile = file;
  outputName = file.name.replace(/\.pdf$/i, '') + '-compressed.pdf';
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
  document.querySelectorAll('.level').forEach(function (l) { l.classList.remove('active'); });
  card.classList.add('active');
  currentLevel = card.getAttribute('data-level');
});

compressBtn.addEventListener('click', function () {
  if (!currentFile) return;
  compressBtn.disabled = true;
  progressWrap.style.display = 'block';
  resultEl.style.display = 'none';
  errorBox.style.display = 'none';
  progressFill.style.width = '4%';
  progressLabel.textContent = 'Reading file…';

  var reader = new FileReader();
  reader.onerror = function () {
    showError("Couldn't read that file. Try choosing it again.");
  };
  reader.onload = function () {
    runCompression(new Uint8Array(reader.result)).catch(function (err) {
      console.error(err);
      showError("This PDF couldn't be processed — it may be password-protected or corrupted. Try a different file.");
    });
  };
  reader.readAsArrayBuffer(currentFile);
});

async function runCompression(bytes) {
  var settings = LEVELS[currentLevel];
  var originalSize = bytes.byteLength;

  var loadingTask = pdfjsLib.getDocument({ data: bytes });
  var pdfDoc = await loadingTask.promise;
  var numPages = pdfDoc.numPages;

  var outDoc = await PDFLib.PDFDocument.create();

  for (var i = 1; i <= numPages; i++) {
    progressLabel.textContent = 'Processing page ' + i + ' of ' + numPages + '…';
    progressFill.style.width = (8 + (i / numPages) * 80) + '%';

    var page = await pdfDoc.getPage(i);
    var baseViewport = page.getViewport({ scale: 1 });
    var renderViewport = page.getViewport({ scale: settings.scale });

    var canvas = document.createElement('canvas');
    canvas.width = Math.ceil(renderViewport.width);
    canvas.height = Math.ceil(renderViewport.height);
    var ctx = canvas.getContext('2d');

    await page.render({ canvasContext: ctx, viewport: renderViewport }).promise;

    var jpegDataUrl = canvas.toDataURL('image/jpeg', settings.quality);
    var jpegBytes = dataUrlToBytes(jpegDataUrl);

    var jpgImage = await outDoc.embedJpg(jpegBytes);
    var outPage = outDoc.addPage([baseViewport.width, baseViewport.height]);
    outPage.drawImage(jpgImage, {
      x: 0, y: 0,
      width: baseViewport.width,
      height: baseViewport.height
    });

    canvas.width = 0;
    canvas.height = 0;
  }

  progressLabel.textContent = 'Finalizing…';
  progressFill.style.width = '96%';

  var outBytes = await outDoc.save({ useObjectStreams: true });
  outputBlob = new Blob([outBytes], { type: 'application/pdf' });

  progressFill.style.width = '100%';
  setTimeout(function () {
    progressWrap.style.display = 'none';
    compressBtn.disabled = false;
    showResult(originalSize, outputBlob.size);
  }, 200);
}

function dataUrlToBytes(dataUrl) {
  var base64 = dataUrl.split(',')[1];
  var binary = atob(base64);
  var len = binary.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

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
  a.download = outputName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
});