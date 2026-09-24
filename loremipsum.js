var WORDS = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum'];

var typeToggle = document.getElementById('typeToggle');
var countSlider = document.getElementById('countSlider');
var countValue = document.getElementById('countValue');
var startClassic = document.getElementById('startClassic');
var generateBtn = document.getElementById('generateBtn');
var loremOutputWrap = document.getElementById('loremOutputWrap');
var loremOutput = document.getElementById('loremOutput');
var copyBtn = document.getElementById('copyBtn');

var currentType = 'paragraphs';

typeToggle.addEventListener('click', function (e) {
  var btn = e.target.closest('.unit-btn');
  if (!btn) return;
  document.querySelectorAll('#typeToggle .unit-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  currentType = btn.getAttribute('data-type');

  if (currentType === 'paragraphs') { countSlider.max = 20; if (countSlider.value > 20) countSlider.value = 20; }
  if (currentType === 'sentences') { countSlider.max = 50; }
  if (currentType === 'words') { countSlider.max = 300; if (countSlider.value < 10) countSlider.value = 50; }
  countValue.textContent = countSlider.value;
});

countSlider.addEventListener('input', function () {
  countValue.textContent = countSlider.value;
});

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function randomSentence(minWords, maxWords) {
  var len = minWords + Math.floor(Math.random() * (maxWords - minWords));
  var words = [];
  for (var i = 0; i < len; i++) words.push(randomWord());
  var sentence = words.join(' ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

function randomParagraph(sentenceCount) {
  var sentences = [];
  for (var i = 0; i < sentenceCount; i++) sentences.push(randomSentence(6, 16));
  return sentences.join(' ');
}

generateBtn.addEventListener('click', function () {
  var count = parseInt(countSlider.value, 10);
  var result = '';

  if (currentType === 'paragraphs') {
    var paras = [];
    for (var p = 0; p < count; p++) {
      var sentCount = 4 + Math.floor(Math.random() * 4);
      var text = randomParagraph(sentCount);
      if (p === 0 && startClassic.checked) {
        text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + text;
      }
      paras.push(text);
    }
    result = paras.join('\n\n');
  }

  if (currentType === 'sentences') {
    var sentences = [];
    for (var s = 0; s < count; s++) sentences.push(randomSentence(6, 16));
    if (startClassic.checked) sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    result = sentences.join(' ');
  }

  if (currentType === 'words') {
    var words = [];
    if (startClassic.checked) {
      words = 'lorem ipsum dolor sit amet consectetur adipiscing elit'.split(' ');
    }
    while (words.length < count) words.push(randomWord());
    words = words.slice(0, count);
    result = words.join(' ') + '.';
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  loremOutput.value = result;
  loremOutputWrap.style.display = 'block';
});

copyBtn.addEventListener('click', function () {
  loremOutput.select();
  navigator.clipboard.writeText(loremOutput.value).then(function () {
    var original = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(function () { copyBtn.textContent = original; }, 1200);
  });
});