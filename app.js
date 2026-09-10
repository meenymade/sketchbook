(function(){
  const catalog = document.getElementById('catalog');
  const filtersEl = document.getElementById('filters');

  const tags = ['All', ...Array.from(new Set(WORKS.map(w => w.tag)))];
  let active = 'All';

  function renderFilters(){
    filtersEl.innerHTML = '';
    tags.forEach(tag => {
      const btn = document.createElement('button');
      btn.textContent = tag;
      if(tag === active) btn.classList.add('active');
      btn.addEventListener('click', () => {
        active = tag;
        renderFilters();
        renderCatalog();
      });
      filtersEl.appendChild(btn);
    });
  }

  function renderCatalog(){
    catalog.innerHTML = '';
    const items = active === 'All' ? WORKS : WORKS.filter(w => w.tag === active);

    if(items.length === 0){
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'Nothing here yet.';
      catalog.appendChild(empty);
      return;
    }

    items.forEach(work => {
      const a = document.createElement('a');
      a.className = 'entry';
      a.href = work.url;
      a.target = '_blank';
      a.rel = 'noopener';

      a.innerHTML = `
        <span class="frame">
          <iframe src="${work.url}" loading="lazy" tabindex="-1" title="${work.title} preview"></iframe>
          <span class="index">${work.number}</span>
          <span class="label">
            <span class="title">${work.title}</span>
            <span class="meta">${work.tag} · ${work.year}</span>
          </span>
        </span>
      `;

      catalog.appendChild(a);
    });
  }

  renderFilters();
  renderCatalog();
})();
