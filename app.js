(function(){
  const catalog = document.getElementById('catalog');
  const filtersEl = document.getElementById('filters');

  const tags = ['전체', ...Array.from(new Set(WORKS.map(w => w.tag)))];
  let active = '전체';

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
    const items = active === '전체' ? WORKS : WORKS.filter(w => w.tag === active);

    if(items.length === 0){
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = '아직 이 분류의 작업물이 없습니다.';
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
        <span class="num">No. ${work.number}</span>
        <span class="frame">
          <iframe src="${work.url}" loading="lazy" tabindex="-1" title="${work.title} 미리보기"></iframe>
        </span>
        <span class="meta">
          <h2>${work.title}</h2>
          <p>${work.description}</p>
          <span class="line"><span class="tag">${work.tag}</span> · ${work.year}</span>
        </span>
      `;

      catalog.appendChild(a);
    });
  }

  renderFilters();
  renderCatalog();
})();
