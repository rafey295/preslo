document.addEventListener('DOMContentLoaded', function () {

  // ---------- Sidebar drawer (mobile) ----------
  var hamburger = document.getElementById('hamburger');
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  }
  if (hamburger) hamburger.addEventListener('click', openSidebar);
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // ---------- Theme toggle ----------
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

  // ---------- Modal helpers ----------
  function openModal(overlayEl) {
    overlayEl.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(overlayEl) {
    overlayEl.classList.remove('show');
    document.body.style.overflow = '';
  }
  function wireModalClose(overlayEl, closeBtn) {
    closeBtn.addEventListener('click', function () { closeModal(overlayEl); });
    overlayEl.addEventListener('click', function (e) {
      if (e.target === overlayEl) closeModal(overlayEl);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.show').forEach(function (o) { closeModal(o); });
    }
  });

  // ---------- Welcome modal ----------
  var welcomeOverlay = document.getElementById('welcomeOverlay');
  var welcomeClose = document.getElementById('welcomeClose');
  var welcomeSignup = document.getElementById('welcomeSignup');
  var welcomeContinue = document.getElementById('welcomeContinue');
    if (welcomeOverlay && welcomeClose && welcomeSignup && welcomeContinue) {
    wireModalClose(welcomeOverlay, welcomeClose);

    var seenWelcome = null;
    try { seenWelcome = localStorage.getItem('preslo-seen-welcome'); } catch (e) {}
    if (!seenWelcome) {
      setTimeout(function () { openModal(welcomeOverlay); }, 500);
      try { localStorage.setItem('preslo-seen-welcome', '1'); } catch (e) {}
    }
    welcomeContinue.addEventListener('click', function () { closeModal(welcomeOverlay); });

    welcomeSignup.addEventListener('click', function () {
      closeModal(welcomeOverlay);
      showInfo('✨', 'Almost there', 'Accounts will be enabled once Preslo is fully hosted — for now, jump straight into compressing files below.');
    });
  }

  // ---------- Generic info modal ----------
  var infoOverlay = document.getElementById('infoOverlay');
  var infoClose = document.getElementById('infoClose');
  var infoOk = document.getElementById('infoOk');
  var infoIcon = document.getElementById('infoIcon');
  var infoTitle = document.getElementById('infoTitle');
  var infoBody = document.getElementById('infoBody');
  wireModalClose(infoOverlay, infoClose);
  infoOk.addEventListener('click', function () { closeModal(infoOverlay); });

  function showInfo(icon, title, body) {
    infoIcon.textContent = icon;
    infoTitle.textContent = title;
    infoBody.textContent = body;
    openModal(infoOverlay);
  }



  // Login / Sign up buttons
  var loginBtn = document.getElementById('loginBtn');
  var signupBtn = document.getElementById('signupBtn');
  if (loginBtn) loginBtn.addEventListener('click', function () {
    showInfo('🔒', 'Log in coming soon', 'Accounts aren\'t live yet — they\'ll be enabled once Preslo is hosted.');
  });
  if (signupBtn) signupBtn.addEventListener('click', function () {
    showInfo('✨', 'Sign up coming soon', 'Accounts aren\'t live yet — they\'ll be enabled once Preslo is hosted.');
  });

  // "Coming soon" sidebar tools
  document.querySelectorAll('.side-link.soon').forEach(function (link) {
    link.addEventListener('click', function () {
      var name = link.getAttribute('data-tool-name') || 'This tool';
      showInfo('🛠️', name, 'This tool is under build. We\'re working on it — check back soon.');
    });
  });

  // Newsletter form
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('input');
      var email = input.value;
      input.value = '';
      showInfo('📬', 'You\'re on the list', "We'll email " + email + ' when a new tool launches.');
    });
  }

  // ---------- Cookie banner ----------
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAccept = document.getElementById('cookieAccept');
  var cookieOk = null;
  try { cookieOk = localStorage.getItem('preslo-cookie-ok'); } catch (e) {}
  if (!cookieOk && cookieBanner) {
    setTimeout(function () { cookieBanner.classList.add('show'); }, 1200);
  }
  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      cookieBanner.classList.remove('show');
      try { localStorage.setItem('preslo-cookie-ok', '1'); } catch (e) {}
    });
  }

  // ---------- Post a new comment ----------
  var postCommentBtn = document.getElementById('postCommentBtn');
  var commentNameInput = document.getElementById('commentName');
  var commentTextInput = document.getElementById('commentText');
  var commentsList = document.getElementById('commentsList');

  if (postCommentBtn) {
    postCommentBtn.addEventListener('click', function () {
      var name = commentNameInput.value.trim() || 'Guest';
      var text = commentTextInput.value.trim();
      if (!text) {
        commentTextInput.focus();
        return;
      }
      var newComment = {
        name: name,
        time: 'just now',
        text: text,
        likes: 0,
        liked: false,
        replies: []
      };
      COMMENTS.unshift(newComment);
      commentsList.insertBefore(buildComment(newComment), commentsList.firstChild);
      commentNameInput.value = '';
      commentTextInput.value = '';
    });
  }

});