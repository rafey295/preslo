var CURRENCIES = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'AED', 'SAR', 'CNY', 'JPY', 'AUD', 'CAD', 'CHF', 'SGD', 'MYR', 'BDT', 'TRY', 'ZAR', 'NZD'];

var fromValue = document.getElementById('fromValue');
var toValue = document.getElementById('toValue');
var fromCurrency = document.getElementById('fromCurrency');
var toCurrency = document.getElementById('toCurrency');
var swapBtn = document.getElementById('swapBtn');
var rateNote = document.getElementById('rateNote');
var errorBox = document.getElementById('errorBox');

var rates = null;
var ratesDate = null;

CURRENCIES.forEach(function (c) {
  fromCurrency.innerHTML += '<option value="' + c + '">' + c + '</option>';
  toCurrency.innerHTML += '<option value="' + c + '">' + c + '</option>';
});
fromCurrency.value = 'USD';
toCurrency.value = 'PKR';

function convert() {
  if (!rates) return;
  var val = parseFloat(fromValue.value);
  if (isNaN(val)) { toValue.value = ''; return; }

  var from = fromCurrency.value;
  var to = toCurrency.value;

  var usdAmount = val / rates[from];
  var result = usdAmount * rates[to];
  toValue.value = Math.round(result * 100) / 100;
}

function loadRates() {
  var cached = null;
  try { cached = JSON.parse(localStorage.getItem('preslo-fx-cache')); } catch (e) {}

  var oneDay = 24 * 60 * 60 * 1000;
  if (cached && cached.timestamp && (Date.now() - cached.timestamp) < oneDay) {
    rates = cached.rates;
    ratesDate = cached.date;
    rateNote.textContent = 'Rates as of ' + ratesDate + ' (cached)';
    convert();
    return;
  }

  fetch('https://api.exchangerate-api.com/v4/latest/USD')
    .then(function (res) {
      if (!res.ok) throw new Error('bad response');
      return res.json();
    })
    .then(function (data) {
      rates = data.rates;
      ratesDate = data.date;
      try {
        localStorage.setItem('preslo-fx-cache', JSON.stringify({ rates: rates, date: ratesDate, timestamp: Date.now() }));
      } catch (e) {}
      rateNote.textContent = 'Rates as of ' + ratesDate;
      convert();
    })
    .catch(function () {
      if (cached && cached.rates) {
        rates = cached.rates;
        ratesDate = cached.date;
        rateNote.textContent = 'Rates as of ' + ratesDate + ' (offline copy)';
        convert();
      } else {
        rateNote.textContent = '';
        errorBox.textContent = "Couldn't load exchange rates right now. Check your connection and reload.";
        errorBox.style.display = 'block';
      }
    });
}

fromValue.addEventListener('input', convert);
fromCurrency.addEventListener('change', convert);
toCurrency.addEventListener('change', convert);

swapBtn.addEventListener('click', function () {
  var temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  fromValue.value = toValue.value || fromValue.value;
  convert();
});

loadRates();