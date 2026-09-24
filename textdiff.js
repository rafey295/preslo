var textA = document.getElementById('textA');
var textB = document.getElementById('textB');
var compareBtn = document.getElementById('compareBtn');
var diffOutputWrap = document.getElementById('diffOutputWrap');
var diffOutput = document.getElementById('diffOutput');

function escapeHtml(s) {
  var div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function diffWords(a, b) {
  var wordsA = a.split(/(\s+)/);
  var wordsB = b.split(/(\s+)/);

  var m = wordsA.length;
  var n = wordsB.length;

  var lcs = [];
  for (var i = 0; i <= m; i++) lcs.push(new Array(n + 1).fill(0));

  for (var i2 = 1; i2 <= m; i2++) {
    for (var j2 = 1; j2 <= n; j2++) {
      if (wordsA[i2 - 1] === wordsB[j2 - 1]) {
        lcs[i2][j2] = lcs[i2 - 1][j2 - 1] + 1;
      } else {
        lcs[i2][j2] = Math.max(lcs[i2 - 1][j2], lcs[i2][j2 - 1]);
      }
    }
  }

  var result = [];
  var i = m, j = n;
  while (i > 0 && j > 0) {
    if (wordsA[i - 1] === wordsB[j - 1]) {
      result.unshift({ type: 'same', text: wordsA[i - 1] });
      i--; j--;
    } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
      result.unshift({ type: 'removed', text: wordsA[i - 1] });
      i--;
    } else {
      result.unshift({ type: 'added', text: wordsB[j - 1] });
      j--;
    }
  }
  while (i > 0) { result.unshift({ type: 'removed', text: wordsA[i - 1] }); i--; }
  while (j > 0) { result.unshift({ type: 'added', text: wordsB[j - 1] }); j--; }

  return result;
}

compareBtn.addEventListener('click', function () {
  var a = textA.value;
  var b = textB.value;

  if (!a.trim() && !b.trim()) {
    diffOutputWrap.style.display = 'none';
    return;
  }

  var diff = diffWords(a, b);
  var html = diff.map(function (part) {
    var escaped = escapeHtml(part.text);
    if (part.type === 'added') return '<span class="diff-add">' + escaped + '</span>';
    if (part.type === 'removed') return '<span class="diff-remove">' + escaped + '</span>';
    return escaped;
  }).join('');

  diffOutput.innerHTML = html || '<span class="diff-none">No differences found — both texts are identical.</span>';
  diffOutputWrap.style.display = 'block';
});