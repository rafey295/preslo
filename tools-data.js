var TOOL_CATEGORIES = [
  {
    name: 'PDF Tools',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg>',
    tools: [
      { name: 'Compress PDF', link: 'compress.html', desc: 'Shrink PDF file size without losing much quality.' },
      { name: 'Merge PDF', link: 'merge.html', desc: 'Combine multiple PDFs into one file.' },
      { name: 'Split PDF', link: 'split.html', desc: 'Extract a page range into a new PDF.' },
      { name: 'Images to PDF', link: 'imagestopdf.html', desc: 'Turn JPG or PNG images into a PDF.' },
      { name: 'PDF to Image', link: 'pdftoimage.html', desc: 'Convert PDF pages into JPG or PNG images.' },
      { name: 'PDF to Text', link: 'pdftotext.html', desc: 'Extract plain text from a PDF.' }
    ]
  },
  {
    name: 'Image Tools',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="M21 15l-5-5-9 9"/></svg>',
    tools: [
      { name: 'Image Compressor', link: 'imagecompress.html', desc: 'Reduce JPG or PNG file size.' },
      { name: 'Image Resizer', link: 'imageresizer.html', desc: 'Resize an image to exact dimensions.' },
      { name: 'Image Format Converter', link: 'imageconverter.html', desc: 'Convert between JPG, PNG, and WebP.' },
      { name: 'Image to Base64', link: 'imagetobase64.html', desc: 'Convert an image into an embeddable data URI.' },
      { name: 'Color Picker & Palette', link: 'colorpicker.html', desc: 'Pick a color and generate a matching palette.' }
    ]
  },
  {
    name: 'Text & Generators',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 6h16M4 12h10M4 18h16"/></svg>',
    tools: [
      { name: 'Word Counter', link: 'wordcounter.html', desc: 'Count words, characters, and reading time.' },
      { name: 'Case Converter', link: 'caseconverter.html', desc: 'Switch between UPPER, lower, and Title Case.' },
      { name: 'Text Diff Checker', link: 'textdiff.html', desc: 'Compare two texts and highlight differences.' },
      { name: 'Lorem Ipsum Generator', link: 'loremipsum.html', desc: 'Generate placeholder text for designs.' },
      { name: 'Fancy Font Generator', link: 'fontgenerator.html', desc: 'Turn text into 50+ cool Unicode fonts.' },
      { name: 'Password Generator', link: 'passwordgenerator.html', desc: 'Create a strong, random password.' },
      { name: 'Hash Generator', link: 'hashgenerator.html', desc: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes.' },
      { name: 'CSS Gradient Generator', link: 'gradientgenerator.html', desc: 'Build a linear or radial CSS gradient.' },
      { name: 'Name Generator', link: 'namegenerator.html', desc: 'Generate business or username ideas from a keyword.' }
    ]
  },
  {
    name: 'Calculators',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01"/></svg>',
    tools: [
      { name: 'Age Calculator', link: 'agecalculator.html', desc: 'Find your exact age in years, months, days.' },
      { name: 'BMI Calculator', link: 'bmicalculator.html', desc: 'Calculate your Body Mass Index.' },
      { name: 'Percentage Calculator', link: 'percentagecalculator.html', desc: 'Find percentages and percent change.' },
      { name: 'EMI / Loan Calculator', link: 'emicalculator.html', desc: 'Calculate monthly loan payments.' },
      { name: 'Unit Converter', link: 'unitconverter.html', desc: 'Convert length, weight, temperature, and more.' },
      { name: 'Currency Converter', link: 'currencyconverter.html', desc: 'Convert between world currencies live.' }
    ]
  },
  {
    name: 'Business',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
    tools: [
      { name: 'Invoice Generator', link: 'invoicegenerator.html', desc: 'Create and download a PDF invoice.' },
      { name: 'Barcode Generator', link: 'barcodegenerator.html', desc: 'Generate a scannable barcode.' },
      { name: 'QR Code Generator', link: 'qrgenerator.html', desc: 'Turn text or a link into a QR code.' }
    ]
  },
  {
    name: 'Games',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="7" width="20" height="12" rx="4"/><path d="M7 11v4M5 13h4M15.5 12.5h.01M18 14.5h.01"/></svg>',
    tools: [
      { name: '2048', link: 'game2048.html', desc: 'Slide and merge tiles to reach 2048.' },
      { name: 'Snake', link: 'gamesnake.html', desc: 'Classic snake — eat, grow, don\'t crash.' },
      { name: 'Tic-Tac-Toe', link: 'gametictactoe.html', desc: 'Play vs a friend or an unbeatable computer.' },
      { name: 'Memory Match', link: 'gamememory.html', desc: 'Flip cards and find all the pairs.' },
      { name: 'Whack-a-Mole', link: 'gamewhackamole.html', desc: '30 seconds to whack as many moles as you can.' },
      { name: 'Typing Speed Test', link: 'gametyping.html', desc: 'Test your typing speed and accuracy.' },
      { name: 'Rock Paper Scissors', link: 'gamerps.html', desc: 'Classic hand game vs the computer.' },
      { name: 'Minesweeper', link: 'gameminesweeper.html', desc: 'Clear the board without hitting a mine.' },
      { name: 'Sudoku', link: 'gamesudoku.html', desc: 'Classic number puzzle, new board every game.' },
      { name: 'Hangman', link: 'gamehangman.html', desc: 'Guess the word before you run out of tries.' }
    ]
  }
];

var MOST_USED_LINKS = ['compress.html', 'merge.html', 'qrgenerator.html', 'agecalculator.html', 'passwordgenerator.html', 'game2048.html'];

function findToolByLink(link) {
  for (var i = 0; i < TOOL_CATEGORIES.length; i++) {
    var found = TOOL_CATEGORIES[i].tools.find(function (t) { return t.link === link; });
    if (found) return { tool: found, category: TOOL_CATEGORIES[i].name, icon: TOOL_CATEGORIES[i].icon };
  }
  return null;
}