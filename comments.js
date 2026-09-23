var COMMENTS = [
  { name: "Ayesha K.", date: "2026-09-21T10:15:00", text: "Compressed a 40-page scanned contract from 22MB down to 3MB in under a minute. Text on it wasn't needed to be selectable anyway so this was perfect for emailing it across.", likes: 34, liked: false, replies: [ { name: "Preslo Team", date: "2026-09-21T14:00:00", text: "Glad it worked out for you! Merge and Split are coming next." } ] },
  { name: "Daniyal R.", date: "2026-09-19T09:00:00", text: "Didn't expect a browser-only tool to actually work this well. No upload wait time at all since nothing leaves the device.", likes: 19, liked: false, replies: [] },
  { name: "Meera S.", date: "2026-09-18T16:40:00", text: "Used the Strong setting on a photo-heavy report and it dropped from 58MB to 6MB. Some images got a bit soft but totally fine for internal sharing.", likes: 27, liked: false, replies: [] },
  { name: "Usman T.", date: "2026-09-16T11:20:00", text: "Simple and it just works. Would like a merge tool next please.", likes: 12, liked: false, replies: [ { name: "Preslo Team", date: "2026-09-16T18:05:00", text: "Noted — Merge PDF is next on the roadmap." } ] },
  { name: "Fatima N.", date: "2026-09-15T08:10:00", text: "The privacy angle is what got me here — everything staying on-device instead of some random server is a big deal for the documents I deal with.", likes: 41, liked: false, replies: [] },
  { name: "Hamza A.", date: "2026-09-09T13:30:00", text: "Recommended setting hit a nice balance. Light setting barely reduced size on my file but that's expected since it was already text-only.", likes: 8, liked: false, replies: [] },
  { name: "Zainab M.", date: "2026-09-08T12:00:00", text: "Works great on Android Chrome too, wasn't sure a browser-only tool would handle a 30MB file on mobile but it did.", likes: 15, liked: false, replies: [] },
  { name: "Bilal H.", date: "2026-09-07T17:45:00", text: "Would love a batch upload option for compressing multiple files at once.", likes: 22, liked: false, replies: [] },
  { name: "Sana I.", date: "2026-09-06T10:00:00", text: "Clean interface, no ads, no popups blocking the tool itself. Refreshing compared to most free PDF sites.", likes: 30, liked: false, replies: [] },
  { name: "Owais F.", date: "2026-09-05T09:15:00", text: "Strong compression made my scanned book PDF go from 210MB to 18MB. Took a couple minutes but worth it.", likes: 44, liked: false, replies: [] },
  { name: "Noor E.", date: "2026-09-04T14:20:00", text: "Dark mode looks great, matches my system theme automatically.", likes: 6, liked: false, replies: [] },
  { name: "Talha S.", date: "2026-09-03T11:50:00", text: "Tried it on a password protected PDF and got a clear error message instead of it just failing silently. Good UX.", likes: 9, liked: false, replies: [] },
  { name: "Iqra B.", date: "2026-09-02T15:10:00", text: "Recommend adding a way to preview pages before downloading the compressed version.", likes: 13, liked: false, replies: [] },
  { name: "Kashif D.", date: "2026-09-01T08:30:00", text: "Fast even on my old laptop, didn't expect that from a browser-based tool doing this much work.", likes: 17, liked: false, replies: [] },
  { name: "Mahnoor Q.", date: "2026-08-31T13:00:00", text: "Compressed my university thesis appendix from 95MB to 11MB, email finally accepted the attachment.", likes: 25, liked: false, replies: [] },
  { name: "Ahsan Z.", date: "2026-08-30T09:40:00", text: "The before/after size comparison is a nice touch, most tools don't show you the actual savings percentage.", likes: 11, liked: false, replies: [] },
  { name: "Rimsha K.", date: "2026-08-29T16:20:00", text: "Was skeptical about the privacy claim but checked the network tab myself, confirmed nothing gets uploaded.", likes: 36, liked: false, replies: [] },
  { name: "Faisal N.", date: "2026-08-28T10:05:00", text: "Would be nice to have a Merge tool live already, using a different site for that right now.", likes: 7, liked: false, replies: [] },
  { name: "Areeba L.", date: "2026-08-27T12:40:00", text: "Compression on the Light setting kept my document looking basically identical, exactly what I needed for an official submission.", likes: 20, liked: false, replies: [] },
  { name: "Hassan W.", date: "2026-08-26T18:00:00", text: "No signup wall before even trying the tool is a big plus, most sites make you register first.", likes: 29, liked: false, replies: [] }
];

function initials(name) {
  return name.split(' ').map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
}

function formatRelative(dateStr) {
  var then = new Date(dateStr).getTime();
  var now = Date.now();
  var diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return 'just now';
  var diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return diffMin + (diffMin === 1 ? ' minute ago' : ' minutes ago');
  var diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return diffHr + (diffHr === 1 ? ' hour ago' : ' hours ago');
  var diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return diffDay + (diffDay === 1 ? ' day ago' : ' days ago');
  var diffWeek = Math.floor(diffDay / 7);
  if (diffWeek < 5) return diffWeek + (diffWeek === 1 ? ' week ago' : ' weeks ago');
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
      '<div><div class="comment-name">' + r.name + '</div><div class="comment-time">' + formatRelative(r.date) + '</div></div>' +
    '</div>' +
    '<div class="comment-text">' + r.text + '</div>';
  return div;
}

function buildComment(c) {
  var wrap = document.createElement('div');
  wrap.className = 'comment';

  var head = document.createElement('div');
  head.className = 'comment-head';
  head.innerHTML =
    '<div class="comment-avatar">' + initials(c.name) + '</div>' +
    '<div><div class="comment-name">' + c.name + '</div><div class="comment-time">' + formatRelative(c.date) + '</div></div>';
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
    var newReply = { name: 'You', date: new Date().toISOString(), text: val };
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
  var preview = COMMENTS.slice(0, 6);
  preview.forEach(function (c) { list.appendChild(buildComment(c)); });
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