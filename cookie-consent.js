/* ===========================================
   Svettfri – Cookie Consent (GDPR/ePrivacy)
   
   Strategi:
   - Visa banner vid första besök
   - Ladda INTE Google Analytics förrän användaren accepterat
   - Spara valet i localStorage så banner inte visas igen
   - Tillåt ändring via "Cookies"-länk i footern
   =========================================== */

(function(){
  const STORAGE_KEY = 'svettfri_cookie_consent';
  const GA_ID = 'G-NGWH5GH7LJ';
  
  // ===== State =====
  function getConsent(){
    try { 
      const v = localStorage.getItem(STORAGE_KEY);
      return v ? JSON.parse(v) : null;
    } catch(e) { return null; }
  }
  
  function setConsent(accepted){
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accepted: accepted,
        date: new Date().toISOString()
      }));
    } catch(e) { console.error('Could not save consent', e); }
  }

  // ===== Google Analytics laddning =====
  function loadGoogleAnalytics(){
    // Förhindra dubbel laddning
    if (window.svettfriGALoaded) return;
    window.svettfriGALoaded = true;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, { 'anonymize_ip': true });
  }

  // ===== Banner UI =====
  function injectStyles(){
    const css = `
    .sv-cookie-banner {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: #1a1814;
      color: #fff;
      padding: 20px 24px;
      box-shadow: 0 -8px 32px rgba(0,0,0,0.15);
      z-index: 9999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px;
      line-height: 1.55;
      animation: sv-cookie-slide 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes sv-cookie-slide {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
    .sv-cookie-inner {
      max-width: 1040px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 24px;
      flex-wrap: wrap;
    }
    .sv-cookie-text {
      flex: 1;
      min-width: 240px;
      color: rgba(255,255,255,0.9);
    }
    .sv-cookie-text strong { color: #fff; }
    .sv-cookie-text a {
      color: #8fcfa8;
      text-decoration: underline;
    }
    .sv-cookie-text a:hover { color: #b5e0c5; }
    .sv-cookie-buttons {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .sv-cookie-btn {
      padding: 11px 22px;
      border-radius: 100px;
      border: none;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: -0.1px;
    }
    .sv-cookie-btn-accept {
      background: #fff;
      color: #1a1814;
    }
    .sv-cookie-btn-accept:hover {
      background: #e8f0ec;
    }
    .sv-cookie-btn-reject {
      background: transparent;
      color: rgba(255,255,255,0.85);
      border: 1.5px solid rgba(255,255,255,0.25);
    }
    .sv-cookie-btn-reject:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.4);
      color: #fff;
    }
    @media (max-width: 640px) {
      .sv-cookie-banner { padding: 16px 18px; font-size: 13px; }
      .sv-cookie-inner { gap: 14px; }
      .sv-cookie-btn { padding: 10px 18px; font-size: 13px; flex: 1; }
    }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function showBanner(){
    injectStyles();
    
    const banner = document.createElement('div');
    banner.className = 'sv-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie-samtycke');
    banner.innerHTML = `
      <div class="sv-cookie-inner">
        <div class="sv-cookie-text">
          <strong>Vi använder cookies.</strong> Svettfri använder Google Analytics för att förstå hur sajten används, samt cookies från affiliate-partners när du klickar på produktlänkar. Du kan tacka nej utan att förlora funktionalitet. <a href="cookies.html">Läs mer</a>.
        </div>
        <div class="sv-cookie-buttons">
          <button class="sv-cookie-btn sv-cookie-btn-reject" data-action="reject">Neka</button>
          <button class="sv-cookie-btn sv-cookie-btn-accept" data-action="accept">Acceptera</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    banner.querySelector('[data-action="accept"]').addEventListener('click', () => {
      setConsent(true);
      loadGoogleAnalytics();
      banner.remove();
    });
    
    banner.querySelector('[data-action="reject"]').addEventListener('click', () => {
      setConsent(false);
      banner.remove();
    });
  }

  // ===== Public API =====
  // För "Ändra cookie-inställningar"-länken på cookies.html
  window.svettfriCookies = {
    reset: function(){
      try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
      location.reload();
    },
    accept: function(){
      setConsent(true);
      loadGoogleAnalytics();
      alert('Cookies accepterade. Tack!');
    },
    reject: function(){
      setConsent(false);
      alert('Cookies nekade. Inga spårningscookies kommer att laddas.');
      location.reload();
    },
    status: function(){
      return getConsent();
    }
  };

  // ===== Init =====
  function init(){
    const consent = getConsent();
    
    if (consent === null) {
      // Första besök – visa banner
      showBanner();
    } else if (consent.accepted === true) {
      // Användaren har tidigare accepterat – ladda GA
      loadGoogleAnalytics();
    }
    // Om consent.accepted === false: ladda inget
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
