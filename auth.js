document.addEventListener('DOMContentLoaded', function () {
  var P = window.PresloAuth;

  var loginBtn = document.getElementById('loginBtn');
  var signupBtn = document.getElementById('signupBtn');

  if (loginBtn) loginBtn.addEventListener('click', function () { window.location.href = 'auth.html'; });
  if (signupBtn) signupBtn.addEventListener('click', function () { window.location.href = 'auth.html'; });

  function initials(name) {
    return name.split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
  }

  function closeAllDropdowns() {
    document.querySelectorAll('.user-dropdown.show').forEach(function (d) { d.classList.remove('show'); });
  }
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.user-menu-wrap')) closeAllDropdowns();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllDropdowns();
  });

  function renderLoggedIn(user, name, photoURL) {
    var topRight = document.querySelector('.topbar-right');
    if (!topRight) return;
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';

    var existing = document.getElementById('userMenuWrap');
    if (existing) existing.remove();

    var displayName = name || user.email;
    var avatarContent = photoURL ? '<img src="' + photoURL + '" alt="' + displayName + '" />' : initials(displayName);

    var wrap = document.createElement('div');
    wrap.className = 'user-menu-wrap';
    wrap.id = 'userMenuWrap';
    wrap.innerHTML =
      '<button class="user-avatar-btn" id="userAvatarBtn" aria-label="Account menu">' + avatarContent + '</button>' +
      '<div class="user-dropdown" id="userDropdown">' +
        '<div class="user-dropdown-head">' +
          '<div class="avatar-preview">' + avatarContent + '</div>' +
          '<div style="min-width:0;">' +
            '<div class="user-dropdown-name">' + displayName + '</div>' +
            '<div class="user-dropdown-email">' + user.email + '</div>' +
          '</div>' +
        '</div>' +
        '<button class="user-dropdown-item" id="ddHistory">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/></svg>' +
          '<span>History</span>' +
        '</button>' +
        '<button class="user-dropdown-item" id="ddSettings">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>' +
          '<span>Settings</span>' +
        '</button>' +
        '<button class="user-dropdown-item danger" id="ddLogout">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>' +
          '<span>Log out</span>' +
        '</button>' +
      '</div>';

    topRight.appendChild(wrap);

    var avatarBtn = document.getElementById('userAvatarBtn');
    var dropdown = document.getElementById('userDropdown');
    avatarBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    document.getElementById('ddHistory').addEventListener('click', function () {
      closeAllDropdowns();
      alert('History is coming soon.');
    });
    document.getElementById('ddSettings').addEventListener('click', function () {
      closeAllDropdowns();
      alert('Account settings are coming soon.');
    });
    document.getElementById('ddLogout').addEventListener('click', function () {
      closeAllDropdowns();
      P.signOut(P.auth);
    });
  }

  function renderLoggedOut() {
    if (loginBtn) loginBtn.style.display = '';
    if (signupBtn) signupBtn.style.display = '';
    var existing = document.getElementById('userMenuWrap');
    if (existing) existing.remove();
  }

  P.onAuthStateChanged(P.auth, function (user) {
    if (user) {
      P.getDoc(P.doc(P.db, 'users', user.uid)).then(function (snap) {
        var data = snap.exists() ? snap.data() : {};
        renderLoggedIn(user, data.name, data.photoURL);
      });
    } else {
      renderLoggedOut();
    }
  });
});