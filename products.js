/* ===========================================
   Svettfri – Products loader
   Laddar products.json och renderar produktdata på sidor.
   Använd genom att inkludera <script src="products.js" defer></script>
   och lägg data-attribut på element som vill ha innehåll injicerat.
   =========================================== */

(function(){
  const JSON_URL = 'products.json';

  function escapeHtml(s){
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  async function loadData(){
    try {
      const res = await fetch(JSON_URL + '?v=' + Date.now());
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch(e) {
      console.error('[Svettfri] Kunde inte ladda products.json:', e);
      return null;
    }
  }

  /* -------------------------------------------
     Quiz-rekommendationer
     Ersätter logiken i index.html: window.SVETTFRI_QUIZ_DATA
     ------------------------------------------- */
  function buildQuizData(data){
    const out = {};
    ['mild','moderate','strong','severe'].forEach(level => {
      const rec = data.quizRecommendations?.[level];
      if (!rec) return;
      const useFav = new Set(rec.useFavoriteDesc || []);
      const useFb = new Set(rec.useFallbackDesc || []);
      const products = (rec.productIds || []).map(pid => {
        const p = data.products.find(x => x.id === pid && x.active !== false);
        if (!p) return null;
        let desc = p.shortDesc;
        if (useFav.has(pid) && p.favoriteDesc) desc = p.favoriteDesc;
        else if (useFb.has(pid) && p.fallbackDesc) desc = p.fallbackDesc;
        return { icon: p.icon || '📦', name: p.name, desc: desc, link: p.link || '#' };
      }).filter(Boolean);
      out[level] = {
        title: rec.title,
        text: rec.text,
        products,
        article: rec.article || { text:'', link:'#', cta:'' }
      };
    });
    return out;
  }

  /* -------------------------------------------
     Jämförelsekort på artikelsidor
     Markup: <div data-svettfri-comparison="absolut-torr-35"></div>
     ------------------------------------------- */
  function renderComparisonCard(el, product){
    const cc = product.comparisonCard || {};
    el.innerHTML = `
      <h3>${escapeHtml(product.name)}</h3>
      ${cc.experience ? `<p><strong>Min upplevelse:</strong> ${escapeHtml(cc.experience)}</p>` : ''}
      ${cc.pricing ? `<p><strong>Prissegment:</strong> ${escapeHtml(cc.pricing)}</p>` : ''}
      ${cc.pros ? `<p><strong>Plus:</strong> ${escapeHtml(cc.pros)}</p>` : ''}
      ${cc.cons ? `<p><strong>Minus:</strong> ${escapeHtml(cc.cons)}</p>` : ''}
      ${product.link ? `<a href="${escapeHtml(product.link)}" target="_blank" rel="noopener nofollow" class="cta-button-small">${escapeHtml(cc.ctaLabel || 'Se mer')}</a>` : ''}
    `;
  }

  /* -------------------------------------------
     Produktkort på startsidan
     Markup: <div data-svettfri-product-card="absolut-torr-35"></div>
     ------------------------------------------- */
  function renderProductCard(el, product){
    el.innerHTML = `
      <h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.shortDesc)}</p>
      ${product.link ? `<a href="${escapeHtml(product.link)}" target="_blank" rel="noopener nofollow" class="link-arrow">Se på Apotea →</a>` : ''}
    `;
  }

  /* -------------------------------------------
     Init
     ------------------------------------------- */
  loadData().then(data => {
    if (!data) return;

    // Exponera quiz-data så index.html:s script kan använda den
    window.SVETTFRI_QUIZ_DATA = buildQuizData(data);
    window.dispatchEvent(new CustomEvent('svettfri:loaded', { detail: data }));

    // Rendera jämförelsekort
    document.querySelectorAll('[data-svettfri-comparison]').forEach(el => {
      const id = el.getAttribute('data-svettfri-comparison');
      const p = data.products.find(x => x.id === id);
      if (p) renderComparisonCard(el, p);
      else el.innerHTML = `<p style="color:#b85c3a;">⚠ Produkt "${id}" hittades inte i products.json</p>`;
    });

    // Rendera produktkort
    document.querySelectorAll('[data-svettfri-product-card]').forEach(el => {
      const id = el.getAttribute('data-svettfri-product-card');
      const p = data.products.find(x => x.id === id);
      if (p) renderProductCard(el, p);
    });
  });
})();
