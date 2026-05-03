const API = 'http://localhost:3000';
let allTournois = [];
let selectedTournoiId = null;

async function get(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t, i) =>
    t.classList.toggle('active', ['joueurs', 'tournois', 'ouvertures'][i] === name));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  applyFilters();
}

async function init() {
  try {
    const pays = await get('/api/pays');
    const sel = document.getElementById('f-pays');
    pays.sort((a, b) => a.nom.localeCompare(b.nom)).forEach(p => {
      sel.innerHTML += `<option value="${p.code}">${p.nom}</option>`;
    });
  } catch (e) { console.warn('Pays:', e.message); }

  try {
    allTournois = await get('/api/tournois');
    const sel = document.getElementById('f-tournoi');
    allTournois.sort((a, b) => a.nom.localeCompare(b.nom)).forEach(t => {
      sel.innerHTML += `<option value="${t.id}">${t.nom}</option>`;
    });
  } catch (e) { console.warn('Tournois:', e.message); }

  ['f-joueur', 'f-elo-min', 'f-elo-max', 'f-date-debut', 'f-date-fin'].forEach(id => {
    document.getElementById(id).addEventListener('keypress', e => {
      if (e.key === 'Enter') applyFilters();
    });
  });
  ['f-pays', 'f-tournoi'].forEach(id => {
    document.getElementById(id).addEventListener('change', () => applyFilters());
  });
}

async function applyFilters() {
  const joueur = document.getElementById('f-joueur').value.trim();
  const pays = document.getElementById('f-pays').value;
  const tournoi = document.getElementById('f-tournoi').value;
  const activePanel = document.querySelector('.panel.active').id;

  document.getElementById('detail-joueur').className = 'detail-panel';
  document.getElementById('detail-tournoi').className = 'detail-panel';

  if (activePanel === 'panel-joueurs') {
    try {
      const eloMin    = document.getElementById('f-elo-min').value;
      const eloMax    = document.getElementById('f-elo-max').value;
      const tournoiId = selectedTournoiId || tournoi;
      const params    = [];
      if (joueur)    params.push('nom='     + encodeURIComponent(joueur));
      if (pays)      params.push('pays='    + pays);
      if (tournoiId) params.push('tournoi=' + tournoiId);
      if (eloMin)    params.push('eloMin='  + eloMin);
      if (eloMax)    params.push('eloMax='  + eloMax);
      const url = '/api/joueurs' + (params.length ? '?' + params.join('&') : '');
      const joueurs = await get(url);
      renderJoueurs(joueurs);
    } catch (e) { renderError('tbody-joueurs', 4, e.message); }
  }

  if (activePanel === 'panel-tournois') {
    try {
      const dateDebut = document.getElementById('f-date-debut').value;
      const dateFin   = document.getElementById('f-date-fin').value;
      const params    = [];
      if (pays)      params.push('pays='  + pays);
      if (dateDebut) params.push('debut=' + dateDebut);
      if (dateFin)   params.push('fin='   + dateFin);
      const url = '/api/tournois' + (params.length ? '?' + params.join('&') : '');
      let tournois = await get(url);
      const tournoiId = selectedTournoiId || tournoi;
      if (tournoiId) tournois = tournois.filter(t => String(t.id) === String(tournoiId));
      renderTournois(tournois);
    } catch (e) { renderError('tbody-tournois', 5, e.message); }
  }

  if (activePanel === 'panel-ouvertures') {
    try {
      const tournoiId = selectedTournoiId || tournoi;
      if (joueur) {
        const ouv = await get('/api/joueurs/' + encodeURIComponent(joueur) + '/ouvertures?detail=true');
        renderOuvertures(ouv);
      } else if (tournoiId) {
        const stats = await get('/api/tournois/' + tournoiId + '/stats');
        renderOuvertures(stats.topOuvertures || []);
      } else if (pays) {
        const ouv = await get('/api/stats/ouvertures?pays=' + pays);
        renderOuvertures(ouv);
      } else {
        document.getElementById('tbody-ouvertures').innerHTML =
          '<tr><td colspan="4"><div class="empty"><span class="icon">♟</span>Sélectionne un joueur, un tournoi ou un pays</div></td></tr>';
      }
    } catch (e) { renderError('tbody-ouvertures', 4, e.message); }
  }
}

function renderJoueurs(joueurs) {
  const tbody = document.getElementById('tbody-joueurs');
  document.getElementById('count-joueurs').textContent = joueurs.length;
  if (!joueurs.length) {
    tbody.innerHTML = '<tr><td colspan="4"><div class="empty"><span class="icon">♟</span>Aucun joueur</div></td></tr>';
    return;
  }
  tbody.innerHTML = joueurs.map(j => `
  <tr onclick="loadJoueurStats('${j.nomComplet.replace(/'/g, "\\'")}')">
    <td>${j.nomComplet}</td>
    <td>${j.pays ? '<span class="badge badge-primary">' + j.pays.code.toUpperCase() + '</span>' : '—'}</td>
    <td>—</td>
    <td>—</td>
  </tr>
`).join('');
}

async function loadJoueurStats(nom) {
  try {
    const stats = await get('/api/joueurs/' + encodeURIComponent(nom) + '/stats');
    const panel = document.getElementById('detail-joueur');
    panel.className = 'detail-panel visible';
    panel.innerHTML = `
    <div class="detail-title">${stats.nomComplet}</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Parties</div>
        <div class="value">${stats.nbParties}</div>
      </div>
      <div class="stat-card">
        <div class="label">Victoires</div>
        <div class="value" style="color:var(--secondary)">${stats.nbVictoires}</div>
      </div>
      <div class="stat-card">
        <div class="label">Nulles</div>
        <div class="value">${stats.nbNulles}</div>
      </div>
      <div class="stat-card">
        <div class="label">Défaites</div>
        <div class="value" style="color:var(--error)">${stats.nbDefaites}</div>
      </div>
      <div class="stat-card">
        <div class="label">Taux de victoire</div>
        <div class="value" style="color:var(--secondary)">${stats.tauxVictoire != null ? stats.tauxVictoire.toFixed(1) + ' %' : '—'}</div>
      </div>
      <div class="stat-card">
        <div class="label">ELO moyen</div>
        <div class="value">${stats.eloMoyen ?? '—'}</div>
      </div>
    </div>
  `;
  } catch (e) { console.error(e); }
}

function renderTournois(tournois) {
  const tbody = document.getElementById('tbody-tournois');
  document.getElementById('count-tournois').textContent = tournois.length;
  if (!tournois.length) {
    tbody.innerHTML = '<tr><td colspan="5"><div class="empty"><span class="icon">♟</span>Aucun tournoi</div></td></tr>';
    return;
  }
  tbody.innerHTML = tournois.map(t => `
  <tr onclick="loadTournoiStats(${t.id}, '${t.nom.replace(/'/g, "\\'")}')">
    <td>${t.nom}</td>
    <td>${t.date || '—'}</td>
    <td>${t.pays ? '<span class="badge badge-primary">' + t.pays.code.toUpperCase() + '</span>' : '—'}</td>
    <td>${t.nbrJoueurs ?? '—'}</td>
    <td>${t.classementMoyen ?? '—'}</td>
  </tr>
`).join('');
}

async function loadTournoiStats(id, nom) {
  selectedTournoiId = id;
  document.getElementById('f-tournoi').value = id;
  try {
    const stats = await get('/api/tournois/' + id + '/stats');
    const panel = document.getElementById('detail-tournoi');
    panel.className = 'detail-panel visible';
    panel.innerHTML = `
    <div class="detail-title">${stats.nom}</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">Parties</div>
        <div class="value">${(stats.nbVictoiresBlancs || 0) + (stats.nbVictoiresNoirs || 0) + (stats.nbNulles || 0)}</div>
      </div>
      <div class="stat-card">
        <div class="label">Joueurs</div>
        <div class="value">${stats.nbrJoueurs ?? '—'}</div>
      </div>
      <div class="stat-card">
        <div class="label">ELO moyen</div>
        <div class="value">${stats.classementMoyen ?? '—'}</div>
      </div>
    </div>
  `;
  } catch (e) { console.error(e); }
}

function renderOuvertures(ouvertures) {
  const tbody = document.getElementById('tbody-ouvertures');
  document.getElementById('count-ouvertures').textContent = ouvertures.length;
  if (!ouvertures.length) {
    tbody.innerHTML = '<tr><td colspan="4"><div class="empty"><span class="icon">♟</span>Aucune ouverture</div></td></tr>';
    return;
  }
  tbody.innerHTML = ouvertures.map(o => `
  <tr>
    <td><span class="badge badge-success">${o.codeEco}</span></td>
    <td>${o.libelle}</td>
    <td>${o.nbParties}</td>
    <td>${o.nbVictoires ?? '—'}</td>
  </tr>
`).join('');
}

function renderError(tbodyId, cols, msg) {
  document.getElementById(tbodyId).innerHTML =
    `<tr><td colspan="${cols}"><div class="empty"><span class="icon">⚠</span>${msg}</div></td></tr>`;
}

function resetFilters() {
  selectedTournoiId = null;
  ['f-joueur', 'f-elo-min', 'f-elo-max', 'f-date-debut', 'f-date-fin'].forEach(id =>
    document.getElementById(id).value = '');
  ['f-pays', 'f-tournoi'].forEach(id =>
    document.getElementById(id).selectedIndex = 0);
  document.getElementById('detail-joueur').className = 'detail-panel';
  document.getElementById('detail-tournoi').className = 'detail-panel';
  document.getElementById('tbody-joueurs').innerHTML = '<tr><td colspan="4"><div class="empty"><span class="icon">♟</span>Recherche pour afficher les joueurs</div></td></tr>';
  document.getElementById('tbody-tournois').innerHTML = '<tr><td colspan="5"><div class="empty"><span class="icon">♟</span>Recherche pour afficher les tournois</div></td></tr>';
  document.getElementById('tbody-ouvertures').innerHTML = '<tr><td colspan="4"><div class="empty"><span class="icon">♟</span>Sélectionne un joueur ou un pays</div></td></tr>';
  document.getElementById('count-joueurs').textContent = '—';
  document.getElementById('count-tournois').textContent = '—';
  document.getElementById('count-ouvertures').textContent = '—';
}

function resetAll() {
  resetFilters();
  switchTab('joueurs');
}

init();
