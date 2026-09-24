var hashInput = document.getElementById('hashInput');
var hashResults = document.getElementById('hashResults');

var ALGORITHMS = [
  { name: 'MD5', fn: CryptoJS.MD5 },
  { name: 'SHA-1', fn: CryptoJS.SHA1 },
  { name: 'SHA-256', fn: CryptoJS.SHA256 },
  { name: 'SHA-512', fn: CryptoJS.SHA512 }
];

function render() {
  var text = hashInput.value;
  hashResults.innerHTML = '';

  if (!text) {
    hashResults.innerHTML = '<div class="font-empty">Type or paste text above to generate hashes.</div>';
    return;
  }

  ALGORITHMS.forEach(function (algo) {
    var hash = algo.fn(text).toString();
    var row = document.createElement('div');
    row.className = 'hash-row';
    row.innerHTML =
      '<div class="hash-label">' + algo.name + '</div>' +
      '<div class="hash-value mono">' + hash + '</div>';
    row.addEventListener('click', function () {
      navigator.clipboard.writeText(hash).then(function () {
        var label = row.querySelector('.hash-label');
        var original = label.textContent;
        label.textContent = 'Copied!';
        setTimeout(function () { label.textContent = original; }, 1000);
      });
    });
    hashResults.appendChild(row);
  });
}

hashInput.addEventListener('input', render);
render();