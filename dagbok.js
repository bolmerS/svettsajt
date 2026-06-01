/* ===========================================
   Svettfri – Dagbok loader
   Läser dagbok.json och renderar dagboksinlägg på dagbok.html
   =========================================== */

(function(){
  const JSON_URL = 'dagbok.json';

  function escapeHtml(s){
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  function formatDate(iso){
    if (!iso) return '';
    try {
      const months = ['januari','februari','mars','april','maj','juni',
                      'juli','augusti','september','oktober','november','december'];
      const d = new Date(iso);
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch(e) {
      return iso;
    }
  }

  async function loadEntries(){
    try {
      const res = await fetch(JSON_URL + '?v=' + Date.now());
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch(e) {
      console.error('[Svettfri Dagbok] Kunde inte ladda dagbok.json:', e);
      return null;
    }
  }

  function render(data){
    const wrap = document.getElementById('diary-list');
    if (!wrap) return;

    if (!data || !data.entries || data.entries.length === 0) {
      wrap.innerHTML = `<div class="diary-empty">
        <p>Inga dagboksinlägg ännu. Kom tillbaka snart!</p>
      </div>`;
      return;
    }

    // Filtrera bort opublicerade och sortera nyaste först
    const entries = data.entries
      .filter(e => e.published !== false)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    if (entries.length === 0) {
      wrap.innerHTML = `<div class="diary-empty">
        <p>Inga dagboksinlägg ännu. Kom tillbaka snart!</p>
      </div>`;
      return;
    }

    wrap.innerHTML = entries.map(e => `
      <a href="${escapeHtml(e.url)}" class="diary-card">
        <div class="diary-card-meta">${escapeHtml(formatDate(e.date))}${e.tag ? ' · <span style="text-transform:none; letter-spacing:0;">' + escapeHtml(e.tag) + '</span>' : ''}</div>
        <h2>${escapeHtml(e.title)}</h2>
        <p>${escapeHtml(e.excerpt || '')}</p>
        <span class="diary-card-arrow">Läs hela inlägget →</span>
      </a>
    `).join('');
  }

  loadEntries().then(render);
})();
