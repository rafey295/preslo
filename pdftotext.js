pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var filebar = document.getElementById('filebar');
var resetBtn = document.getElementById('resetBtn');
var actionRow = document.getElementById('actionRow');
var extractBtn = document.getElementById('extractBtn');
var progressWrap = document.getElementById('progressWrap');
var progressFill = document.getElementById('progressFill');
var progressLabel = document.getElementById('progressLabel');
var resultWrap = document.getElementById('resultWrap');
var textOutput = document.getElementById('textOutput');
var copyBtn = document.getElementById('copyBtn');
var downloadBtn = document.getElementById('downloadBtn');
var errorBox = document.getElementById('errorBox');

var currentFile = null;

function showError(msg) {
  errorBox.style.display = 'block';
  errorBox.textContent = msg;
  progressWrap.style.display = 'none';
  extractBtn.disabled = false;
}

function resetAll() {
  currentFile = null;
  filebar.style.display = 'none';
  actionRow.style.display = 'none';
  progressWrap.style.display = 'none';
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
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    showError("That file doesn't look like a PDF. Choose a .pdf file to continue.");
    return;
  }
  currentFile = file;
  document.getElementById('fileName').textContent = file.name;
  filebar.style.display = 'flex';
  dropzone.style.display = 'none';
  actionRow.style.display = 'block';
  resultWrap.style.display = 'none';
}

resetBtn.addEventListener('click', resetAll);

extractBtn.addEventListener('click', function () {
  if (!currentFile) return;
  extractBtn.disabled = true;
  progressWrap.style.display = 'block';
  resultWrap.style.display = 'none';
  errorBox.style.display = 'none';
  progressFill.style.width = '5%';

  runExtract().catch(function (err) {
    console.error(err);
    showError("This PDF couldn't be read — it may be password-protected or corrupted.");
  });
});

async function runExtract() {
  var buf = await currentFile.arrayBuffer();
  var pdfDoc = await pdfjsLib.getDocument({ data: buf }).promise;
  var numPages = pdfDoc.numPages;
  var fullText = '';

  for (var i = 1; i <= numPages; i++) {
    progressLabel.textContent = 'Reading page ' + i + ' of ' + numPages + '…';
    progressFill.style.width = (5 + (i / numPages) * 90) + '%';

    var page = await pdfDoc.getPage(i);
    var content = await page.getTextContent();
    var pageText = content.items.map(function (item) { return item.str; }).join(' ');
    fullText += pageText + '\n\n';
  }

  progressFill.style.width = '100%';
  setTimeout(function () {
    progressWrap.style.display = 'none';
    extractBtn.disabled = false;
    textOutput.value = fullText.trim() || '(No extractable text found — this PDF may be scanned/image-only.)';
    resultWrap.style.display = 'block';
  }, 200);
}

copyBtn.addEventListener('click', function () {
  textOutput.select();
  navigator.clipboard.writeText(textOutput.value).then(function () {
    var original = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(function () { copyBtn.textContent = original; }, 1200);
  });
});

downloadBtn.addEventListener('click', function () {
  var blob = new Blob([textOutput.value], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = currentFile.name.replace(/\.pdf$/i, '') + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
});