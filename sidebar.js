function getCurrentPage() {
  var path = window.location.pathname.split('/');
  return path[path.length - 1] || 'index.html';
}

function buildSidebar() {
  var sideNav = document.getElementById('sideNav');
  if (!sideNav) return;

  var currentPage = getCurrentPage();
  sideNav.innerHTML = '';

  var homeLink = document.createElement('a');
  homeLink.className = 'side-link' + (currentPage === 'index.html' || currentPage === '' ? ' active' : '');
  homeLink.href = 'index.html';
  homeLink.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l9-8 9 8M5 10v10h14V10"/></svg><span>Home</span>';
  sideNav.appendChild(homeLink);

  TOOL_CATEGORIES.forEach(function (cat) {
    var containsCurrent = cat.tools.some(function (t) { return t.link === currentPage; });

    var catWrap = document.createElement('div');
    catWrap.className = 'side-cat' + (containsCurrent ? ' open' : '');

    var header = document.createElement('button');
    header.className = 'side-cat-header';
    header.innerHTML = cat.icon + '<span>' + cat.name + '</span><svg class="side-cat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9l6 6 6-6"/></svg>';
    header.addEventListener('click', function () {
      catWrap.classList.toggle('open');
    });
    catWrap.appendChild(header);

    var list = document.createElement('div');
    list.className = 'side-cat-list';
    cat.tools.forEach(function (tool) {
      var link = document.createElement('a');
      link.className = 'side-sublink' + (tool.link === currentPage ? ' active' : '');
      link.href = tool.link;
      link.textContent = tool.name;
      list.appendChild(link);
    });
    catWrap.appendChild(list);

    sideNav.appendChild(catWrap);
  });
}

document.addEventListener('DOMContentLoaded', buildSidebar);