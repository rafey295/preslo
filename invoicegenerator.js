var invoiceItems = document.getElementById('invoiceItems');
var addItemBtn = document.getElementById('addItemBtn');
var invoiceTotal = document.getElementById('invoiceTotal');
var currencySymbol = document.getElementById('currencySymbol');
var downloadBtn = document.getElementById('downloadBtn');
var errorBox = document.getElementById('errorBox');

var items = [{ desc: '', qty: 1, price: 0 }];

document.getElementById('invoiceDate').value = new Date().toISOString().slice(0, 10);

function renderItems() {
  invoiceItems.innerHTML = '';
  items.forEach(function (item, i) {
    var row = document.createElement('div');
    row.className = 'invoice-item-row';
    row.innerHTML =
      '<input type="text" placeholder="Item description" class="inv-desc" value="' + item.desc + '" />' +
      '<input type="number" placeholder="Qty" class="inv-qty" value="' + item.qty + '" min="0" />' +
      '<input type="number" placeholder="Price" class="inv-price" value="' + item.price + '" min="0" step="0.01" />' +
      (items.length > 1 ? '<button class="gradient-remove inv-remove" aria-label="Remove">&times;</button>' : '<span></span>');
    invoiceItems.appendChild(row);

    row.querySelector('.inv-desc').addEventListener('input', function (e) { items[i].desc = e.target.value; });
    row.querySelector('.inv-qty').addEventListener('input', function (e) { items[i].qty = parseFloat(e.target.value) || 0; updateTotal(); });
    row.querySelector('.inv-price').addEventListener('input', function (e) { items[i].price = parseFloat(e.target.value) || 0; updateTotal(); });
    var removeBtn = row.querySelector('.inv-remove');
    if (removeBtn) removeBtn.addEventListener('click', function () { items.splice(i, 1); renderItems(); updateTotal(); });
  });
}

function updateTotal() {
  var total = items.reduce(function (sum, item) { return sum + (item.qty * item.price); }, 0);
  invoiceTotal.textContent = 'Total: ' + (currencySymbol.value || '$') + total.toFixed(2);
}

addItemBtn.addEventListener('click', function () {
  items.push({ desc: '', qty: 1, price: 0 });
  renderItems();
});

currencySymbol.addEventListener('input', updateTotal);

downloadBtn.addEventListener('click', async function () {
  errorBox.style.display = 'none';

  var fromName = document.getElementById('fromName').value.trim() || 'Your Business';
  var toName = document.getElementById('toName').value.trim() || 'Client';
  var invoiceNum = document.getElementById('invoiceNum').value.trim() || 'INV-001';
  var invoiceDate = document.getElementById('invoiceDate').value || new Date().toISOString().slice(0, 10);
  var currency = currencySymbol.value || '$';

  var validItems = items.filter(function (i) { return i.desc.trim() !== ''; });
  if (validItems.length === 0) {
    errorBox.textContent = 'Add at least one item with a description.';
    errorBox.style.display = 'block';
    return;
  }

  var pdfDoc = await PDFLib.PDFDocument.create();
  var page = pdfDoc.addPage([595, 842]);
  var font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
  var fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

  var y = 800;
  page.drawText('INVOICE', { x: 50, y: y, size: 26, font: fontBold, color: PDFLib.rgb(0.15, 0.15, 0.15) });
  y -= 40;

  page.drawText('From: ' + fromName, { x: 50, y: y, size: 11, font: font });
  page.drawText('Invoice #: ' + invoiceNum, { x: 350, y: y, size: 11, font: font });
  y -= 18;
  page.drawText('To: ' + toName, { x: 50, y: y, size: 11, font: font });
  page.drawText('Date: ' + invoiceDate, { x: 350, y: y, size: 11, font: font });
  y -= 40;

  page.drawLine({ start: { x: 50, y: y }, end: { x: 545, y: y }, thickness: 1, color: PDFLib.rgb(0.8, 0.8, 0.8) });
  y -= 20;

  page.drawText('Description', { x: 50, y: y, size: 10, font: fontBold });
  page.drawText('Qty', { x: 350, y: y, size: 10, font: fontBold });
  page.drawText('Price', { x: 410, y: y, size: 10, font: fontBold });
  page.drawText('Total', { x: 480, y: y, size: 10, font: fontBold });
  y -= 10;
  page.drawLine({ start: { x: 50, y: y }, end: { x: 545, y: y }, thickness: 1, color: PDFLib.rgb(0.85, 0.85, 0.85) });
  y -= 20;

  var grandTotal = 0;
  validItems.forEach(function (item) {
    var lineTotal = item.qty * item.price;
    grandTotal += lineTotal;
    page.drawText(item.desc.slice(0, 45), { x: 50, y: y, size: 10, font: font });
    page.drawText(String(item.qty), { x: 350, y: y, size: 10, font: font });
    page.drawText(currency + item.price.toFixed(2), { x: 410, y: y, size: 10, font: font });
    page.drawText(currency + lineTotal.toFixed(2), { x: 480, y: y, size: 10, font: font });
    y -= 22;
  });

  y -= 10;
  page.drawLine({ start: { x: 350, y: y }, end: { x: 545, y: y }, thickness: 1, color: PDFLib.rgb(0.7, 0.7, 0.7) });
  y -= 22;
  page.drawText('Total: ' + currency + grandTotal.toFixed(2), { x: 400, y: y, size: 13, font: fontBold });

  var pdfBytes = await pdfDoc.save();
  var blob = new Blob([pdfBytes], { type: 'application/pdf' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = invoiceNum + '.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
});

renderItems();
updateTotal();