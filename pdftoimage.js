pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

var dropzone = document.getElementById('dropzone');
var fileInput = document.getElementById('fileInput');
var filebar = document.getElementById('filebar');
var resetBtn = document.getElementById('resetBtn');
var optionsRow = document.getElementById('optionsRow');
var actionRow = document.getElementById('actionRow');
var convertBtn = document.getElementById('convertBtn');
var progressWrap = document.getElementById('progressWrap');
var progressFill = document.getElementById('progressFill');
var progressLabel = document.getElementById('progressLabel');
var resultEl = document.getElementById('result');
var imageGrid = document.getElementById('imageGrid');
var downloadAllBtn = document.getElementById('downloadAllBtn');
var anotherBtn = document.getElementById('anotherBtn');
var errorBox = document.getElementById('errorBox');

var currentFile = null;
var currentFormat = 'jpeg';
var images = [];

function showError(msg) {
  errorBox.style.display = 'block';
  errorBox.textContent = msg;
  progressWrap.style.display = 'none';
  convertBtn.disabled = false;
}

function resetAll() {
  currentFile = null;
  images = [];
  filebar.style.display = 'none';
  optionsRow.style.display = 'none';
  actionRow.style.display = 'none';
  progressWrap.style.display = 'none';
  resultEl.style.display = 'none';
  errorBox.style.display = 'none';
  imageGrid.innerHTML = '';
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
  optionsRow.style.display = 'grid';
  actionRow.style.display = 'block';
  resultEl.style.display = 'none';
}

resetBtn.addEventListener('click', resetAll);
anotherBtn.addEventListener('click', resetAll);

optionsRow.addEventListener('click', function (e) {
  var card = e.target.closest('.level');
  if (!card) return;
  document.querySelectorAll('#optionsRow .level').forEach(function (l) { l.classList.remove('active'); });
  card.classList.add('active');
  currentFormat = card.getAttribute('data-format');
});

convertBtn.addEventListener('click', function () {
  if (!currentFile) return;
  convertBtn.disabled = true;
  progressWrap.style.display = 'block';
  resultEl.style.display = 'none';
  errorBox.style.display = 'none';
  progressFill.style.width = '4%';

  runConvert().catch(function (err) {
    console.error(err);
    showError("This PDF couldn't be converted — it may be password-protected or corrupted.");
  });
});

async function runConvert() {
  var buf = await currentFile.arrayBuffer();
  var pdfDoc = await pdfjsLib.getDocument({ data: buf }).promise;
  var numPages = pdfDoc.numPages;
  images = [];

  var ext = currentFormat === 'png' ? 'png' : 'jpg';
  var mime = currentFormat === 'png' ? 'image/png' : 'image/jpeg';

  for (var i = 1; i <= numPages; i++) {
    progressLabel.textContent = 'Converting page ' + i + ' of ' + numPages + '…';
    progressFill.style.width = (5 + (i / numPages) * 85) + '%';

    var page = await pdfDoc.getPage(i);
    var viewport = page.getViewport({ scale: 1.8 });
    var canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    var ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport: viewport }).promise;

    var dataUrl = currentFormat === 'png' ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', 0.9);
    var fileName = 'page-' + i + '.' + ext;
    images.push({ name: fileName, dataUrl: dataUrl, mime: mime });

    canvas.width = 0;
    canvas.height = 0;
  }

  progressFill.style.width = '100%';
  setTimeout(function () {
    progressWrap.style.display = 'none';
    convertBtn.disabled = false;
    showResult();
  }, 150);
}

function dataUrlToBytes(dataUrl) {
  var base64 = dataUrl.split(',')[1];
  var binary = atob(base64);
  var bytes = new Uint8Array(binary.length);
  for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function showResult() {
  resultEl.style.display = 'block';
  imageGrid.innerHTML = '';
  images.forEach(function (img) {
    var cell = document.createElement('div');
    cell.className = 'image-cell';
    cell.innerHTML =
      '<img src="' + img.dataUrl + '" alt="' + img.name + '" />' +
      '<div class="image-cell-footer">' +
        '<span class="mono">' + img.name + '</span>' +
        '<a class="image-download" href="' + img.dataUrl + '" download="' + img.name + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>' +
        '</a>' +
      '</div>';
    imageGrid.appendChild(cell);
  });
}

downloadAllBtn.addEventListener('click', async function () {
  downloadAllBtn.disabled = true;
  downloadAllBtn.textContent = 'Zipping…';

  var zip = new JSZip();
  images.forEach(function (img) {
    zip.file(img.name, dataUrlToBytes(img.dataUrl));
  });
  var blob = await zip.generateAsync({ type: 'blob' });

  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = currentFile.name.replace(/\.pdf$/i, '') + '-images.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);

  downloadAllBtn.disabled = false;
  downloadAllBtn.textContent = 'Download All as ZIP';
});