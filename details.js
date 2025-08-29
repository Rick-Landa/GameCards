const params = new URLSearchParams(location.search);
const id = params.get('id');
const game = window.GAMES.find(g => g.id === id);

if (game) {
  const facts = game.facts || {};
  const factsTable = Object.entries(facts)
    .map(([k,v]) => `<tr><th>${k}</th><td>${Array.isArray(v)?v.join(', '):v}</td></tr>`)
    .join('');

  document.getElementById('detail').innerHTML = `
    <div class="head">
      <div class="cover">
        <img src="${game.image}" alt="Portada de ${game.title}">
      </div>
      <div class="info">
        <h1>${game.title}</h1>
        <section class="facts">
          <header>Información general</header>
          <table>${factsTable}</table>
        </section>
      </div>
    </div>
    <div class="desc"><p>${game.description}</p></div>
  `;
}
