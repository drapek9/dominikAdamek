/**
 * Cookie lišta a správa souhlasu
 * Nastavení: assets/js/cookies-config.js → COOKIES
 */

function getStoredConsent() {
  try {
    var raw = localStorage.getItem(COOKIES.storageKey);
    if (!raw) return null;
    var data = JSON.parse(raw);
    if (data.version !== COOKIES.version) return null;
    return data;
  } catch (err) {
    return null;
  }
}

function saveConsent(analytics) {
  var data = {
    version: COOKIES.version,
    essential: true,
    analytics: Boolean(analytics),
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(COOKIES.storageKey, JSON.stringify(data));
  applyConsent(data);
  hideCookieBanner();
  updateConsentPanel();
}

function applyConsent(consent) {
  if (consent && consent.analytics && COOKIES.analytics && COOKIES.analytics.googleAnalyticsId) {
    loadGoogleAnalytics(COOKIES.analytics.googleAnalyticsId);
  }
}

function loadGoogleAnalytics(measurementId) {
  if (window.__daGaLoaded || !measurementId) return;
  window.__daGaLoaded = true;

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, { anonymize_ip: true });
}

function renderCookieBanner() {
  if (document.getElementById('cookie-banner')) return;

  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Nastavení cookies');
  banner.setAttribute('aria-live', 'polite');
  banner.innerHTML =
    '<div class="cookie-banner__inner container">' +
      '<div class="cookie-banner__copy">' +
        '<div class="cookie-banner__text">' +
          '<p class="cookie-banner__title">Cookies a ochrana soukromí</p>' +
          '<p class="cookie-banner__desc">' +
            'Používáme nezbytné cookies pro správné fungování webu a ukládání vaší volby. ' +
            'Po souhlasu můžeme používat i analytické cookies pro měření návštěvnosti. ' +
            'Více v <a href="cookies.html">zásadách cookies</a> a ' +
            '<a href="ochrana-osobnich-udaju.html">ochraně osobních údajů</a>.' +
          '</p>' +
        '</div>' +
      '</div>' +
      '<div class="cookie-banner__actions">' +
        '<button type="button" class="btn btn--outline-dark btn--sm" data-cookie-reject>Nepovinné odmítnout</button>' +
        '<button type="button" class="btn btn--primary btn--sm" data-cookie-accept>Přijmout vše</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(banner);
  requestAnimationFrame(function () {
    banner.classList.add('is-visible');
  });

  var acceptBtn = banner.querySelector('[data-cookie-accept]');
  var rejectBtn = banner.querySelector('[data-cookie-reject]');
  if (acceptBtn) acceptBtn.addEventListener('click', function () { saveConsent(true); });
  if (rejectBtn) rejectBtn.addEventListener('click', function () { saveConsent(false); });
}

function hideCookieBanner() {
  var banner = document.getElementById('cookie-banner');
  if (!banner) return;
  banner.classList.remove('is-visible');
  setTimeout(function () { banner.remove(); }, 350);
}

function updateConsentPanel() {
  var panel = document.getElementById('cookie-consent-panel');
  if (!panel) return;

  var consent = getStoredConsent();
  var statusEl = panel.querySelector('[data-consent-status]');
  if (!statusEl) return;

  if (!consent) {
    statusEl.textContent = 'Zatím jste nevyjádřili souhlas s cookies.';
  } else if (consent.analytics) {
    statusEl.textContent = 'Máte povoleny nezbytné i analytické cookies.';
  } else {
    statusEl.textContent = 'Máte povoleny pouze nezbytné cookies.';
  }
}

function initCookieConsentPanel() {
  var panel = document.getElementById('cookie-consent-panel');
  if (!panel) return;

  var acceptBtn = panel.querySelector('[data-cookie-accept]');
  var rejectBtn = panel.querySelector('[data-cookie-reject]');
  if (acceptBtn) acceptBtn.addEventListener('click', function () { saveConsent(true); });
  if (rejectBtn) rejectBtn.addEventListener('click', function () { saveConsent(false); });
  updateConsentPanel();
}

function initCookieSettingsLinks() {
  document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
    el.addEventListener('click', function () {
      renderCookieBanner();
    });
  });
}

function initCookieConsent() {
  var consent = getStoredConsent();
  if (consent) {
    applyConsent(consent);
  } else {
    renderCookieBanner();
  }

  initCookieConsentPanel();
  initCookieSettingsLinks();

  window.DACookieConsent = {
    acceptAll: function () { saveConsent(true); },
    rejectOptional: function () { saveConsent(false); },
    getConsent: getStoredConsent,
    showBanner: renderCookieBanner
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
  initCookieConsent();
}
