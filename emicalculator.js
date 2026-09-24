var calcBtn = document.getElementById('calcBtn');
var emiResult = document.getElementById('emiResult');
var emiMonthly = document.getElementById('emiMonthly');
var totalInterest = document.getElementById('totalInterest');
var totalPayment = document.getElementById('totalPayment');
var numPayments = document.getElementById('numPayments');
var errorBox = document.getElementById('errorBox');

function formatNum(n) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

calcBtn.addEventListener('click', function () {
  errorBox.style.display = 'none';
  emiResult.style.display = 'none';

  var principal = parseFloat(document.getElementById('loanAmount').value);
  var annualRate = parseFloat(document.getElementById('interestRate').value);
  var tenureVal = parseFloat(document.getElementById('tenureValue').value);
  var tenureUnit = document.getElementById('tenureUnit').value;

  if (!principal || principal <= 0 || isNaN(annualRate) || annualRate < 0 || !tenureVal || tenureVal <= 0) {
    errorBox.textContent = 'Fill in a valid loan amount, interest rate, and tenure.';
    errorBox.style.display = 'block';
    return;
  }

  var months = tenureUnit === 'years' ? tenureVal * 12 : tenureVal;
  var monthlyRate = annualRate / 12 / 100;

  var emi;
  if (monthlyRate === 0) {
    emi = principal / months;
  } else {
    var factor = Math.pow(1 + monthlyRate, months);
    emi = (principal * monthlyRate * factor) / (factor - 1);
  }

  var totalPay = emi * months;
  var totalInt = totalPay - principal;

  emiMonthly.textContent = formatNum(emi);
  totalInterest.textContent = formatNum(totalInt);
  totalPayment.textContent = formatNum(totalPay);
  numPayments.textContent = Math.round(months);

  emiResult.style.display = 'block';
});