var PAGE_SIZE = 15;
var currentPage = 1;

function sortedComments() {
  return COMMENTS.slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
}

function renderPage(page) {
  currentPage = page;
  var all = sortedComments();
  var totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;

  var start = (currentPage - 1) * PAGE_SIZE;
  var pageItems = all.slice(start, start + PAGE_SIZE);

  var list = document.getElementById('commentsList');
  list.innerHTML = '';
  pageItems.forEach(function (c) { list.appendChild(buildComment(c)); });

  renderPagination(totalPages);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderPagination(totalPages) {
  var el = document.getElementById('pagination');
  el.innerHTML = '';
  if (totalPages <= 1) return;

  for (var i = 1; i <= totalPages; i++) {
    var btn = document.createElement('button');
    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
    btn.textContent = i;
    (function (pageNum) {
      btn.addEventListener('click', function () { renderPage(pageNum); });
    })(i);
    el.appendChild(btn);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  renderPage(1);

  // Theme toggle
  var themeToggle = document.getElementById('themeToggle');
  var root = document.documentElement;
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('preslo-theme'); } catch (e) {}
  if (savedTheme === 'dark' || savedTheme === 'light') {
    root.setAttribute('data-theme', savedTheme);
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var isDark = current === 'dark' ||
        (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('preslo-theme', next); } catch (e) {}
    });
  }

  // Login/signup -> info modal
  var infoOverlay = document.getElementById('infoOverlay');
  var infoClose = document.getElementById('infoClose');
  var infoOk = document.getElementById('infoOk');
  function openModal() { infoOverlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
  function closeModal() { infoOverlay.classList.remove('show'); document.body.style.overflow = ''; }
  infoClose.addEventListener('click', closeModal);
  infoOk.addEventListener('click', closeModal);
  infoOverlay.addEventListener('click', function (e) { if (e.target === infoOverlay) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  var loginBtn = document.getElementById('loginBtn');
  var signupBtn = document.getElementById('signupBtn');
  if (loginBtn) loginBtn.addEventListener('click', openModal);
  if (signupBtn) signupBtn.addEventListener('click', openModal);
});