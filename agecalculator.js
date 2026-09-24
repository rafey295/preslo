var dobInput = document.getElementById('dobInput');
var calcBtn = document.getElementById('calcBtn');
var ageResult = document.getElementById('ageResult');
var errorBox = document.getElementById('errorBox');

var ageYears = document.getElementById('ageYears');
var ageMonths = document.getElementById('ageMonths');
var ageDays = document.getElementById('ageDays');
var totalDays = document.getElementById('totalDays');
var totalWeeks = document.getElementById('totalWeeks');
var nextBirthday = document.getElementById('nextBirthday');

calcBtn.addEventListener('click', function () {
  errorBox.style.display = 'none';
  ageResult.style.display = 'none';

  var value = dobInput.value;
  if (!value) {
    errorBox.textContent = 'Pick a date of birth first.';
    errorBox.style.display = 'block';
    return;
  }

  var dob = new Date(value + 'T00:00:00');
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  if (dob > today) {
    errorBox.textContent = "That date is in the future — pick a valid date of birth.";
    errorBox.style.display = 'block';
    return;
  }

  var years = today.getFullYear() - dob.getFullYear();
  var months = today.getMonth() - dob.getMonth();
  var days = today.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    var prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  var msPerDay = 1000 * 60 * 60 * 24;
  var totalDaysLived = Math.floor((today - dob) / msPerDay);
  var weeksLived = Math.floor(totalDaysLived / 7);

  var nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBday < today) nextBday.setFullYear(nextBday.getFullYear() + 1);
  var daysToNext = Math.round((nextBday - today) / msPerDay);

  ageYears.textContent = years;
  ageMonths.textContent = months;
  ageDays.textContent = days;
  totalDays.textContent = totalDaysLived.toLocaleString();
  totalWeeks.textContent = weeksLived.toLocaleString();
  nextBirthday.textContent = daysToNext === 0 ? 'Today!' : daysToNext;

  ageResult.style.display = 'block';
});

dobInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') calcBtn.click();
});