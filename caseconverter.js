var textInput = document.getElementById('textInput');
var wordCount = document.getElementById('wordCount');
var caseButtons = document.querySelectorAll('[data-case]');

function updateCount() {
  var text = textInput.value;
  var words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  wordCount.textContent = words + ' words · ' + text.length + ' characters';
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
}

function toSentenceCase(str) {
  var lower = str.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s*\w)/g, function (c) { return c.toUpperCase(); });
}

function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, function (m, chr) { return chr.toUpperCase(); });
}

function toSnakeCase(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

caseButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var mode = btn.getAttribute('data-case');
    var text = textInput.value;

    if (mode === 'upper') textInput.value = text.toUpperCase();
    if (mode === 'lower') textInput.value = text.toLowerCase();
    if (mode === 'title') textInput.value = toTitleCase(text);
    if (mode === 'sentence') textInput.value = toSentenceCase(text);
    if (mode === 'camel') textInput.value = toCamelCase(text);
    if (mode === 'snake') textInput.value = toSnakeCase(text);

    updateCount();
  });
});

textInput.addEventListener('input', updateCount);