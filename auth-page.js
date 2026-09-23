document.addEventListener('DOMContentLoaded', function () {
  var authTabs = document.querySelectorAll('.auth-tab');
  var loginForm = document.getElementById('loginForm');
  var signupForm = document.getElementById('signupForm');
  var loginError = document.getElementById('loginError');
  var signupError = document.getElementById('signupError');
  var loginSubmit = document.getElementById('loginSubmit');
  var signupSubmit = document.getElementById('signupSubmit');

  var avatarPreview = document.getElementById('avatarPreview');
  var avatarUploadBtn = document.getElementById('avatarUploadBtn');
  var avatarFileInput = document.getElementById('avatarFileInput');
  var avatarDataUrl = null;

  function switchTab(tab) {
    authTabs.forEach(function (t) { t.classList.toggle('active', t.getAttribute('data-tab') === tab); });
    loginForm.style.display = tab === 'login' ? 'flex' : 'none';
    signupForm.style.display = tab === 'signup' ? 'flex' : 'none';
  }
  authTabs.forEach(function (t) {
    t.addEventListener('click', function () { switchTab(t.getAttribute('data-tab')); });
  });

  avatarUploadBtn.addEventListener('click', function () { avatarFileInput.click(); });
  avatarFileInput.addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;

    var img = new Image();
    var reader = new FileReader();
    reader.onload = function (ev) {
      img.onload = function () {
        var size = 160;
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        var ctx = canvas.getContext('2d');

        var scale = Math.max(size / img.width, size / img.height);
        var w = img.width * scale;
        var h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

        avatarDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        avatarPreview.innerHTML = '<img src="' + avatarDataUrl + '" alt="avatar preview" />';
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  function friendlyError(code) {
    if (code === 'auth/email-already-in-use') return 'That email is already registered — try logging in instead.';
    if (code === 'auth/invalid-email') return 'That email address looks invalid.';
    if (code === 'auth/weak-password') return 'Password should be at least 6 characters.';
    if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') return 'Incorrect email or password.';
    if (code === 'auth/too-many-requests') return 'Too many attempts — try again in a bit.';
    return 'Something went wrong. Please try again.';
  }

  function waitForFirebase(cb) {
    if (window.PresloAuth) { cb(); return; }
    window.addEventListener('preslo-firebase-ready', cb, { once: true });
  }

  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    signupError.style.display = 'none';
    signupSubmit.disabled = true;

    var name = document.getElementById('signupName').value.trim();
    var email = document.getElementById('signupEmail').value.trim();
    var password = document.getElementById('signupPassword').value;

    waitForFirebase(function () {
      var P = window.PresloAuth;
      P.createUserWithEmailAndPassword(P.auth, email, password)
        .then(function (cred) {
          return P.setDoc(P.doc(P.db, 'users', cred.user.uid), {
            name: name,
            email: email,
            photoURL: avatarDataUrl || null,
            createdAt: new Date().toISOString()
          });
        })
        .then(function () {
          window.location.href = 'index.html';
        })
        .catch(function (err) {
          signupSubmit.disabled = false;
          signupError.textContent = friendlyError(err.code);
          signupError.style.display = 'block';
        });
    });
  });

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    loginError.style.display = 'none';
    loginSubmit.disabled = true;

    var email = document.getElementById('loginEmail').value.trim();
    var password = document.getElementById('loginPassword').value;

    waitForFirebase(function () {
      var P = window.PresloAuth;
      P.signInWithEmailAndPassword(P.auth, email, password)
        .then(function () {
          window.location.href = 'index.html';
        })
        .catch(function (err) {
          loginSubmit.disabled = false;
          loginError.textContent = friendlyError(err.code);
          loginError.style.display = 'block';
        });
    });
  });
});