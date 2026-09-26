function cardHtml(tool, categoryIcon) {
  return (
    '<a class="tool-card" href="' + tool.link + '">' +
      '<div class="tool-card-icon">' + categoryIcon + '</div>' +
      '<div class="tool-card-name">' + tool.name + '</div>' +
      '<div class="tool-card-desc">' + tool.desc + '</div>' +
    '</a>'
  );
}

function renderMostUsed() {
  var grid = document.getElementById('mostUsedGrid');
  if (!grid) return;
  grid.innerHTML = '';
  MOST_USED_LINKS.forEach(function (link) {
    var found = findToolByLink(link);
    if (!found) return;
    grid.innerHTML += cardHtml(found.tool, found.icon);
  });
}

function renderCategories() {
  var wrap = document.getElementById('homeCategories');
  if (!wrap) return;
  wrap.innerHTML = '';

  TOOL_CATEGORIES.forEach(function (cat) {
    var section = document.createElement('div');
    section.className = 'home-category-block';
    section.innerHTML =
      '<div class="home-category-head">' +
        '<div class="home-category-icon">' + cat.icon + '</div>' +
        '<h2>' + cat.name + '</h2>' +
        '<span class="home-category-count">' + cat.tools.length + ' tools</span>' +
      '</div>' +
      '<div class="home-card-grid"></div>';

    var grid = section.querySelector('.home-card-grid');
    cat.tools.forEach(function (tool) {
      grid.innerHTML += cardHtml(tool, cat.icon);
    });

    wrap.appendChild(section);
  });
}

function renderHeroVisual() {
  var visual = document.getElementById('homeHeroVisual');
  if (!visual) return;
  visual.innerHTML =
    '<div class="hero-float hero-float-1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"/></svg></div>' +
    '<div class="hero-float hero-float-2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="9" r="1.5"/><path d="M21 15l-5-5-9 9"/></svg></div>' +
    '<div class="hero-float hero-float-3"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01"/></svg></div>' +
    '<div class="hero-float hero-float-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="7" width="20" height="12" rx="4"/><path d="M7 11v4M5 13h4"/></svg></div>' +
    '<div class="hero-glow"></div>';
}

document.addEventListener('DOMContentLoaded', function () {
  renderHeroVisual();
  renderMostUsed();
  renderCategories();
});