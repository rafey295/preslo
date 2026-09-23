var COMMENTS = [
  {
    name: "Ayesha K.",
    time: "2 days ago",
    text: "Compressed a 40-page scanned contract from 22MB down to 3MB in under a minute. Text on it wasn't needed to be selectable anyway so this was perfect for emailing it across.",
    likes: 34,
    liked: false,
    replies: [
      { name: "Preslo Team", time: "1 day ago", text: "Glad it worked out for you! Merge and Split are coming next." }
    ]
  },
  {
    name: "Daniyal R.",
    time: "4 days ago",
    text: "Didn't expect a browser-only tool to actually work this well. No upload wait time at all since nothing leaves the device.",
    likes: 19,
    liked: false,
    replies: []
  },
  {
    name: "Meera S.",
    time: "5 days ago",
    text: "Used the Strong setting on a photo-heavy report and it dropped from 58MB to 6MB. Some images got a bit soft but totally fine for internal sharing.",
    likes: 27,
    liked: false,
    replies: []
  },
  {
    name: "Usman T.",
    time: "1 week ago",
    text: "Simple and it just works. Would like a merge tool next please.",
    likes: 12,
    liked: false,
    replies: [
      { name: "Preslo Team", time: "6 days ago", text: "Noted — Merge PDF is next on the roadmap." }
    ]
  },
  {
    name: "Fatima N.",
    time: "1 week ago",
    text: "The privacy angle is what got me here — everything staying on-device instead of some random server is a big deal for the documents I deal with.",
    likes: 41,
    liked: false,
    replies: []
  },
  {
    name: "Hamza A.",
    time: "2 weeks ago",
    text: "Recommended setting hit a nice balance. Light setting barely reduced size on my file but that's expected since it was already text-only.",
    likes: 8,
    liked: false,
    replies: []
  }
];

function initials(name) {
  return name.split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
}

function heartSvg() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-10-9.2C.5 8.2 2.4 4.8 6 4.2c2-.3 3.8.6 5 2.3 1.2-1.7 3-2.6 5-2.3 3.6.6 5.5 4 4 7.6-2.5 4.6-10 9.2-10 9.2z"/></svg>';
}

function buildReply(r) {
  var div = document.createElement('div');
  div.className = 'comment';
  div.style.background = 'var(--surface-2)';
  div.innerHTML =
    '<div class="comment-head">' +
      '<div class="comment-avatar">' + initials(r.name) + '</div>' +
      '<div><div class="comment-name">' + r.name + '</div><div class="comment-time">' + r.time + '</div></div>' +
    '</div>' +
    '<div class="comment-text">' + r.text + '</div>';
  return div;
}

function buildComment(c, index) {
  var wrap = document.createElement('div');
  wrap.className = 'comment';

  var head = document.createElement('div');
  head.className = 'comment-head';
  head.innerHTML =
    '<div class="comment-avatar">' + initials(c.name) + '</div>' +
    '<div><div class="comment-name">' + c.name + '</div><div class="comment-time">' + c.time + '</div></div>';
  wrap.appendChild(head);

  var textEl = document.createElement('div');
  textEl.className = 'comment-text';
  textEl.textContent = c.text;
  wrap.appendChild(textEl);

  var readMore = document.createElement('button');
  readMore.className = 'comment-readmore';
  readMore.textContent = 'Read more';
  readMore.style.display = 'none';
  wrap.appendChild(readMore);

  var actions = document.createElement('div');
  actions.className = 'comment-actions';

  var likeBtn = document.createElement('button');
  likeBtn.className = 'comment-like';
  likeBtn.innerHTML = heartSvg() + '<span>' + c.likes + '</span>';

  var replyBtn = document.createElement('button');
  replyBtn.className = 'comment-reply-btn';
  replyBtn.textContent = 'Reply';

  actions.appendChild(likeBtn);
  actions.appendChild(replyBtn);
  wrap.appendChild(actions);

  var replyInput = document.createElement('div');
  replyInput.className = 'comment-reply-input';
  replyInput.innerHTML = '<input type="text" placeholder="Write a reply…" /><button>Post</button>';
  wrap.appendChild(replyInput);

  var repliesWrap = document.createElement('div');
  repliesWrap.className = 'comment-replies';
  c.replies.forEach(function (r) { repliesWrap.appendChild(buildReply(r)); });
  wrap.appendChild(repliesWrap);

  likeBtn.addEventListener('click', function () {
    c.liked = !c.liked;
    c.likes += c.liked ? 1 : -1;
    likeBtn.classList.toggle('liked', c.liked);
    likeBtn.querySelector('span').textContent = c.likes;
  });

  replyBtn.addEventListener('click', function () {
    replyInput.classList.toggle('open');
  });

  var replyPostBtn = replyInput.querySelector('button');
  var replyField = replyInput.querySelector('input');
  replyPostBtn.addEventListener('click', function () {
    var val = replyField.value.trim();
    if (!val) return;
    var newReply = { name: 'You', time: 'just now', text: val };
    c.replies.push(newReply);
    repliesWrap.appendChild(buildReply(newReply));
    replyField.value = '';
    replyInput.classList.remove('open');
  });

  setTimeout(function () {
    if (textEl.scrollHeight > textEl.clientHeight + 2) {
      readMore.style.display = 'block';
      readMore.addEventListener('click', function () {
        var expanded = textEl.classList.toggle('expanded');
        readMore.textContent = expanded ? 'Show less' : 'Read more';
      });
    }
  }, 0);

  return wrap;
}

function renderComments() {
  var list = document.getElementById('commentsList');
  if (!list) return;
  COMMENTS.forEach(function (c, i) {
    list.appendChild(buildComment(c, i));
  });
}

function renderStars() {
  var el = document.getElementById('rsStars');
  if (!el) return;
  var rating = 4.2;
  var html = '';
  for (var i = 1; i <= 5; i++) {
    var fill = i <= Math.round(rating) ? 'var(--star)' : 'var(--border)';
    html += '<svg viewBox="0 0 24 24" fill="' + fill + '" stroke="none"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7L2 9.2l7.1-.6L12 2z"/></svg>';
  }
  el.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
  renderComments();
  renderStars();
});