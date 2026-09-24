var CATEGORY_DATA = {
  general: {
    prefixes: ['Nova', 'Prime', 'Vivid', 'Bright', 'Swift', 'Nex', 'Zen', 'Pure', 'Echo', 'Bold'],
    modern: ['ly', 'io', 'ify', 'hub', 'base', 'loop', 'wave', 'spark', 'forge', 'nest'],
    playful: ['Buddy', 'Pals', 'Nook', 'Cozy', 'Bunch', 'Party', 'Squad', 'Corner'],
    professional: ['Group', 'Solutions', 'Partners', '& Co', 'Global', 'Ventures', 'Consulting']
  },
  tech: {
    prefixes: ['Cloud', 'Byte', 'Data', 'Code', 'Cyber', 'Quantum', 'Neuron', 'Logic', 'Pixel', 'Circuit'],
    modern: ['ify', 'io', 'hub', 'stack', 'sync', 'flow', 'core', 'grid'],
    playful: ['Bot', 'Buddy', 'Bit', 'Sprite'],
    professional: ['Systems', 'Technologies', 'Solutions', 'Labs', 'Software', 'Dynamics']
  },
  creative: {
    prefixes: ['Ink', 'Canvas', 'Muse', 'Studio', 'Craft', 'Palette', 'Sketch', 'Vision'],
    modern: ['ify', 'lab', 'works', 'studio', 'craft'],
    playful: ['Doodle', 'Sparkle', 'Whimsy'],
    professional: ['Studio', 'Design Co', 'Creative Group', 'Collective']
  },
  business: {
    prefixes: ['Apex', 'Summit', 'Vertex', 'Meridian', 'Sterling', 'Crown', 'Elevate'],
    modern: ['ify', 'io', 'ly'],
    playful: ['Hub', 'Circle'],
    professional: ['Group', 'Partners', 'Holdings', 'Capital', 'Consulting', 'Enterprises', '& Associates']
  },
  food: {
    prefixes: ['Fresh', 'Golden', 'Spice', 'Harvest', 'Savory', 'Sweet', 'Rustic'],
    modern: ['ery', 'eats', 'bites', 'table'],
    playful: ['Nom', 'Yum', 'Bites', 'Munch'],
    professional: ['Kitchen', 'Eatery', 'Bistro', 'Cafe & Co']
  },
  fashion: {
    prefixes: ['Glow', 'Velvet', 'Silk', 'Blush', 'Aura', 'Luxe', 'Noir'],
    modern: ['ista', 'ique', 'ly'],
    playful: ['Chic', 'Glam', 'Sparkle'],
    professional: ['Boutique', 'Atelier', 'Couture', 'Fashion House']
  },
  fitness: {
    prefixes: ['Flex', 'Vital', 'Pulse', 'Peak', 'Iron', 'Core', 'Thrive'],
    modern: ['fit', 'ify', 'core'],
    playful: ['Buddy', 'Squad', 'Crew'],
    professional: ['Fitness', 'Wellness', 'Performance', 'Health Co']
  },
  gaming: {
    prefixes: ['Pixel', 'Nova', 'Frag', 'Byte', 'Vortex', 'Cyber', 'Quantum'],
    modern: ['verse', 'craft', 'realm', 'zone', 'nexus'],
    playful: ['Squad', 'Clan', 'Crew', 'Party'],
    professional: ['Studios', 'Interactive', 'Entertainment', 'Games']
  }
};

var keywordInput = document.getElementById('keywordInput');
var categorySelect = document.getElementById('categorySelect');
var styleToggle = document.getElementById('styleToggle');
var generateBtn = document.getElementById('generateBtn');
var nameResults = document.getElementById('nameResults');

var currentStyle = 'modern';

styleToggle.addEventListener('click', function (e) {
  var btn = e.target.closest('.unit-btn');
  if (!btn) return;
  document.querySelectorAll('#styleToggle .unit-btn').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  currentStyle = btn.getAttribute('data-style');
});

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

function generateNames(keyword, category, style) {
  var data = CATEGORY_DATA[category];
  var kw = cap(keyword.trim());
  var kwTrimmed = cap(keyword.trim().replace(/[aeiou]$/i, ''));
  var names = [];

  if (style === 'modern') {
    data.modern.forEach(function (sfx) { names.push(kw + cap(sfx)); });
    data.modern.forEach(function (sfx) { names.push(kwTrimmed + sfx); });
    data.prefixes.forEach(function (pfx) { names.push(pfx + kw); });
  }
  if (style === 'playful') {
    data.playful.forEach(function (sfx) { names.push(kw + ' ' + sfx); });
    data.prefixes.forEach(function (pfx) { names.push(pfx + ' ' + kw); });
    data.playful.forEach(function (sfx) { names.push(sfx + ' ' + kw); });
  }
  if (style === 'professional') {
    data.professional.forEach(function (sfx) { names.push(kw + ' ' + sfx); });
    data.prefixes.forEach(function (pfx) { names.push(pfx + ' ' + kw + (data.professional[0] ? '' : '')); });
    data.professional.forEach(function (sfx) { names.push('The ' + kw + ' ' + sfx); });
  }

  var unique = Array.from(new Set(names));
  return shuffle(unique).slice(0, 24);
}

generateBtn.addEventListener('click', function () {
  var keyword = keywordInput.value.trim();
  nameResults.innerHTML = '';

  if (!keyword) {
    nameResults.innerHTML = '<div class="font-empty">Type a keyword first.</div>';
    return;
  }

  var names = generateNames(keyword, categorySelect.value, currentStyle);

  names.forEach(function (name) {
    var noSpace = name.replace(/\s+/g, '');
    var row = document.createElement('div');
    row.className = 'name-row';
    row.innerHTML =
      '<span class="name-text">' + name + '</span>' +
      (noSpace.length <= 12 ? '<span class="name-badge">Short &amp; catchy</span>' : '<span class="name-badge name-badge-muted">' + noSpace.length + ' chars</span>');
    row.addEventListener('click', function () {
      navigator.clipboard.writeText(name).then(function () {
        var span = row.querySelector('.name-text');
        var original = span.textContent;
        span.textContent = 'Copied: ' + name;
        setTimeout(function () { span.textContent = original; }, 1000);
      });
    });
    nameResults.appendChild(row);
  });
});