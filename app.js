const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

const grid = $('#grid');
const empty = $('#empty');
const q = $('#q');
const chips = $$('.chip');
let selectedCats = new Set(['all']);

const fmtStars = (s) => {
  const n = Math.round((s / 100) * 5);
  return Array.from({ length: 5 }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('');
};

function card(g) {
  return `
  <article class="card" role="listitem">
    <figure>
      <img src="${g.image}" alt="Arte de ${g.title}" loading="lazy">
    </figure>
    <div class="body">
      <h3 class="title">
        <a href="game.html?id=${encodeURIComponent(g.id)}">${g.title}</a>
      </h3>
      <div class="tags">
        ${g.genres.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <p class="excerpt">${g.short}</p>
      <div class="meta">
        <span class="score">${g.score}/100</span>
        <span class="stars">${fmtStars(g.score)}</span>
      </div>
    </div>
  </article>`;
}

function apply() {
  const term = (q.value || '').toLowerCase();
  let list = window.GAMES || [];

  const active = [...selectedCats].filter(c => c !== 'all');
  if (active.length) {
    list = list.filter(g => active.some(c => g.genres.includes(c)));
  }

  if (term) {
    list = list.filter(g =>
      (g.title + ' ' + g.genres.join(' ') + ' ' + (g.short || '')).toLowerCase().includes(term)
    );
  }

  grid.innerHTML = '';
  if (!list.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  list.forEach(g => grid.insertAdjacentHTML('beforeend', card(g)));
}

chips.forEach(btn =>
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;

    if (cat === 'all') {
      selectedCats = new Set(['all']);
      chips.forEach(b => {
        const isAll = b.dataset.cat === 'all';
        b.classList.toggle('is-active', isAll);
        b.setAttribute('aria-pressed', String(isAll));
      });
    } else {
      selectedCats.delete('all');

      if (btn.classList.contains('is-active')) {
        selectedCats.delete(cat);
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        selectedCats.add(cat);
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
      }

      if (selectedCats.size === 0) {
        selectedCats.add('all');
        chips[0].classList.add('is-active');
        chips[0].setAttribute('aria-pressed', 'true');
      } else {
        chips[0].classList.remove('is-active');
        chips[0].setAttribute('aria-pressed', 'false');
      }
    }

    apply();
  })
);

q.addEventListener('input', apply);

apply();
document.getElementById('year').textContent = new Date().getFullYear();
