var textInput = document.getElementById('textInput');
var wcWords = document.getElementById('wcWords');
var wcChars = document.getElementById('wcChars');
var wcCharsNoSpace = document.getElementById('wcCharsNoSpace');
var wcSentences = document.getElementById('wcSentences');
var wcParagraphs = document.getElementById('wcParagraphs');
var wcReadTime = document.getElementById('wcReadTime');

function updateStats() {
  var text = textInput.value;

  var words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  var chars = text.length;
  var charsNoSpace = text.replace(/\s/g, '').length;

  var sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+(\s|$)/g) || []).length;
  if (sentences === 0 && text.trim() !== '') sentences = 1;

  var paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(function (p) { return p.trim() !== ''; }).length;
  if (paragraphs === 0 && text.trim() !== '') paragraphs = 1;

  var readMinutes = Math.ceil(words / 200);

  wcWords.textContent = words.toLocaleString();
  wcChars.textContent = chars.toLocaleString();
  wcCharsNoSpace.textContent = charsNoSpace.toLocaleString();
  wcSentences.textContent = sentences.toLocaleString();
  wcParagraphs.textContent = paragraphs.toLocaleString();
  wcReadTime.textContent = words === 0 ? '0 min' : readMinutes + ' min';
}

textInput.addEventListener('input', updateStats);
updateStats();