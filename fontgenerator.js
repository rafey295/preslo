function mapAstral(text, upperBase, lowerBase, digitBase, exceptions) {
  var result = '';
  var chars = Array.from(text);
  for (var i = 0; i < chars.length; i++) {
    var ch = chars[i];
    if (exceptions && exceptions[ch] !== undefined) { result += exceptions[ch]; continue; }
    var code = ch.codePointAt(0);
    if (code >= 65 && code <= 90 && upperBase) { result += String.fromCodePoint(upperBase + (code - 65)); continue; }
    if (code >= 97 && code <= 122 && lowerBase) { result += String.fromCodePoint(lowerBase + (code - 97)); continue; }
    if (code >= 48 && code <= 57 && digitBase) { result += String.fromCodePoint(digitBase + (code - 48)); continue; }
    result += ch;
  }
  return result;
}

function mapTable(text, table) {
  var result = '';
  var chars = Array.from(text);
  for (var i = 0; i < chars.length; i++) {
    result += (table[chars[i]] !== undefined) ? table[chars[i]] : chars[i];
  }
  return result;
}

var MATH_STYLES = [
  { name: 'Bold', u: 0x1D400, l: 0x1D41A, d: 0x1D7CE },
  { name: 'Italic', u: 0x1D434, l: 0x1D44E, ex: { h: '\u210E' } },
  { name: 'Bold Italic', u: 0x1D468, l: 0x1D482 },
  { name: 'Script', u: 0x1D49C, l: 0x1D4B6, ex: { B:'\u212C', E:'\u2130', F:'\u2131', H:'\u210B', I:'\u2110', L:'\u2112', M:'\u2133', R:'\u211B', e:'\u212F', g:'\u210A', o:'\u2134' } },
  { name: 'Bold Script', u: 0x1D4D0, l: 0x1D4EA },
  { name: 'Fraktur', u: 0x1D504, l: 0x1D51E, ex: { C:'\u212D', H:'\u210C', I:'\u2111', R:'\u211C', Z:'\u2128' } },
  { name: 'Bold Fraktur', u: 0x1D56C, l: 0x1D586 },
  { name: 'Double-Struck', u: 0x1D538, l: 0x1D552, d: 0x1D7D8, ex: { C:'\u2102', H:'\u210D', N:'\u2115', P:'\u2119', Q:'\u211A', R:'\u211D', Z:'\u2124' } },
  { name: 'Sans', u: 0x1D5A0, l: 0x1D5BA, d: 0x1D7E2 },
  { name: 'Sans Bold', u: 0x1D5D4, l: 0x1D5EE, d: 0x1D7EC },
  { name: 'Sans Italic', u: 0x1D608, l: 0x1D622 },
  { name: 'Sans Bold Italic', u: 0x1D63C, l: 0x1D656 },
  { name: 'Monospace', u: 0x1D670, l: 0x1D68A, d: 0x1D7F6 },
  { name: 'Circled', u: 0x24B6, l: 0x24D0, ex: { '0': '\u24EA', '1':'\u2460','2':'\u2461','3':'\u2462','4':'\u2463','5':'\u2464','6':'\u2465','7':'\u2466','8':'\u2467','9':'\u2468' } },
  { name: 'Fullwidth', u: 0xFF21, l: 0xFF41, d: 0xFF10 }
];

var SMALL_CAPS = { a:'\u1D00',b:'\u0299',c:'\u1D04',d:'\u1D05',e:'\u1D07',f:'\uA730',g:'\u0262',h:'\u029C',i:'\u026A',j:'\u1D0A',k:'\u1D0B',l:'\u029F',m:'\u1D0D',n:'\u0274',o:'\u1D0F',p:'\u1D18',r:'\u0280',t:'\u1D1B',u:'\u1D1C',v:'\u1D20',w:'\u1D21',y:'\u028F',z:'\u1D22' };

var SUPERSCRIPT = { a:'\u1D43',b:'\u1D47',c:'\u1D9C',d:'\u1D48',e:'\u1D49',f:'\u1DA0',g:'\u1D4D',h:'\u02B0',i:'\u2071',j:'\u02B2',k:'\u1D4F',l:'\u02E1',m:'\u1D50',n:'\u207F',o:'\u1D52',p:'\u1D56',r:'\u02B3',s:'\u02E2',t:'\u1D57',u:'\u1D58',v:'\u1D5B',w:'\u02B7',x:'\u02E3',y:'\u02B8',z:'\u1DBB','0':'\u2070','1':'\u00B9','2':'\u00B2','3':'\u00B3','4':'\u2074','5':'\u2075','6':'\u2076','7':'\u2077','8':'\u2078','9':'\u2079' };

var SUBSCRIPT = { a:'\u2090',e:'\u2091',h:'\u2095',i:'\u1D62',j:'\u2C7C',k:'\u2096',l:'\u2097',m:'\u2098',n:'\u2099',o:'\u2092',p:'\u209A',r:'\u1D63',s:'\u209B',t:'\u209C',u:'\u1D64',v:'\u1D65',x:'\u2093','0':'\u2080','1':'\u2081','2':'\u2082','3':'\u2083','4':'\u2084','5':'\u2085','6':'\u2086','7':'\u2087','8':'\u2088','9':'\u2089' };

function upsideDown(text) {
  var map = { a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z',
    A:'∀',B:'𐐒',C:'Ɔ',D:'ᗡ',E:'Ǝ',F:'Ⅎ',G:'⅁',H:'H',I:'I',J:'ſ',K:'Ʞ',L:'˥',M:'W',N:'N',O:'O',P:'Ԁ',Q:'Ό',R:'ᴚ',S:'S',T:'⊥',U:'∩',V:'Λ',W:'M',X:'X',Y:'⅄',Z:'Z',
    '0':'0','1':'Ɩ','2':'ᄅ','3':'Ɛ','4':'ㄣ','5':'ϛ','6':'9','7':'ㄥ','8':'8','9':'6','.':'˙',',':"'","'":',','?':'¿','!':'¡' };
  return Array.from(text).map(function (c) { return map[c] || c; }).reverse().join('');
}

function combining(text, mark) {
  return Array.from(text).map(function (c) { return c === ' ' ? c : c + mark; }).join('');
}

function perCharWrap(text, open, close) {
  return Array.from(text).map(function (c) { return c === ' ' ? c : open + c + close; }).join('');
}

function joinWith(text, symbol) {
  return Array.from(text.replace(/\s+/g, '')).join(symbol);
}

// Build items generically
var items = [];

MATH_STYLES.forEach(function (s) {
  items.push({ cat: (s.name.indexOf('Circled') > -1 || s.name.indexOf('Fullwidth') > -1) ? 'Boxed & Wide' : (s.name.indexOf('Script') > -1 || s.name.indexOf('Fraktur') > -1 || s.name.indexOf('Double') > -1) ? 'Special Alphabets' : 'Bold & Sans Styles', name: s.name, out: function (t, s2) { return mapAstral(t, s2.u, s2.l, s2.d, s2.ex); }, style: s });
});

items.push({ cat: 'Small & Script', name: 'Small Caps', style: null, out: function (t) { return mapTable(t.toLowerCase(), SMALL_CAPS); } });
items.push({ cat: 'Small & Script', name: 'Superscript', style: null, out: function (t) { return mapTable(t.toLowerCase(), SUPERSCRIPT); } });
items.push({ cat: 'Small & Script', name: 'Subscript', style: null, out: function (t) { return mapTable(t.toLowerCase(), SUBSCRIPT); } });
items.push({ cat: 'Small & Script', name: 'Upside Down', style: null, out: function (t) { return upsideDown(t); } });
items.push({ cat: 'Small & Script', name: 'Mirror', style: null, out: function (t) { return Array.from(t).reverse().join(''); } });

items.push({ cat: 'Line Effects', name: 'Strikethrough', style: null, out: function (t) { return combining(t, '\u0336'); } });
items.push({ cat: 'Line Effects', name: 'Underline', style: null, out: function (t) { return combining(t, '\u0332'); } });
items.push({ cat: 'Line Effects', name: 'Double Underline', style: null, out: function (t) { return combining(t, '\u0333'); } });
items.push({ cat: 'Line Effects', name: 'Slash Through', style: null, out: function (t) { return combining(t, '\u0337'); } });
items.push({ cat: 'Line Effects', name: 'Top Line', style: null, out: function (t) { return combining(t, '\u0305'); } });
items.push({ cat: 'Line Effects', name: 'Glitch', style: null, out: function (t) { return combining(t, '\u0316\u0347'); } });

var BRACKET_WRAPS = [
  ['⎰', '⎱'], ['【', '】'], ['『', '』'], ['⟦', '⟧'], ['⧼', '⧽'], ['⦏', '⦎'], ['「', '」'], ['〖', '〗']
];
BRACKET_WRAPS.forEach(function (pair, i) {
  items.push({ cat: 'Bracket Letters', name: 'Boxed ' + (i + 1), style: null, out: function (t) { return perCharWrap(t, pair[0], pair[1]); } });
});

var JOIN_SYMBOLS = ['♥', '★', '~', '•', '⊶', '░', '╬', '◦', '·', '∿'];
JOIN_SYMBOLS.forEach(function (sym, i) {
  items.push({ cat: 'Joiners', name: 'Joiner ' + (i + 1) + ' (' + sym + ')', style: null, out: function (t) { return joinWith(t, sym); } });
});

var WRAPS = [
  ['꧁༺ ', ' ༻꧂'], ['꧁•⊹٭ ', ' ٭⊹•꧂'], ['★彡[ ', ' ]彡★'], ['▀▄▀▄▀▄ ', ' ▄▀▄▀▄▀'],
  ['╰•★★ ', ' ★★•╯'], ['¸.·✩·.¸¸.·¯⍣✩ ', ' ✩⍣¯·.¸¸.·✩·.¸'], ['·.★·.·´¯`·.·★ ', ' ★·.·´¯`·.·★.·'],
  ['♡︎༺☆༻♡︎ ', ' ♡︎༺☆༻♡︎'], ['━━╬٨ـﮩﮩ❤٨ـﮩﮩـ╬━❤️❥❥═══ ', ' ══'], ['ミ★ ', ' ★彡'],
  ['亗 ', ' ☯︎'], ['▂▃▅▇█▓▒░۩۞۩ ', ' ۩۞۩░▒▓█▇▅▃▂'], ['(づ｡◕‿‿◕｡)づ ', ' ٩(˘◡˘)۶'],
  ['(◕︿◕✿) ', ' (๑′°︿°๑)'], ['🍉  🎀  ', '  🎀  🍉'], ['✷🌌  🎀  ', '  🎀  🌌✷']
];
WRAPS.forEach(function (pair, i) {
  items.push({ cat: 'Decorated & Fun', name: 'Decorated ' + (i + 1), style: null, out: function (t) { return pair[0] + t + pair[1]; } });
});

var fontInput = document.getElementById('fontInput');
var fontResults = document.getElementById('fontResults');

function render() {
  var text = fontInput.value;
  fontResults.innerHTML = '';

  if (!text.trim()) {
    fontResults.innerHTML = '<div class="font-empty">Type something above to see the styles.</div>';
    return;
  }

  var grouped = {};
  var order = [];
  items.forEach(function (item) {
    var out;
    try {
      out = item.style ? item.out(text, item.style) : item.out(text);
    } catch (e) {
      out = text;
    }
    if (!out || out === text && item.name.indexOf('Small') === -1 && item.name.indexOf('Super') === -1 && item.name.indexOf('Sub') === -1) {
      // still show, some styles legitimately don't change certain inputs
    }
    if (!grouped[item.cat]) { grouped[item.cat] = []; order.push(item.cat); }
    grouped[item.cat].push({ name: item.name, text: out });
  });

  order.forEach(function (cat) {
    var header = document.createElement('div');
    header.className = 'font-cat-header';
    header.textContent = cat;
    fontResults.appendChild(header);

    grouped[cat].forEach(function (r) {
      var row = document.createElement('div');
      row.className = 'font-row';
      row.innerHTML = '<div class="font-row-text">' + r.text + '</div><div class="font-row-label">' + r.name + '</div>';
      row.addEventListener('click', function () {
        navigator.clipboard.writeText(r.text).then(function () {
          var label = row.querySelector('.font-row-label');
          var original = label.textContent;
          label.textContent = 'Copied!';
          setTimeout(function () { label.textContent = original; }, 1000);
        });
      });
      fontResults.appendChild(row);
    });
  });
}

fontInput.addEventListener('input', render);
render();