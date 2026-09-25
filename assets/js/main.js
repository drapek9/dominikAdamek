/**
 * Dominik Adámek – Realitní makléř
 * Hlavní JavaScript
 */
(function () {
  'use strict';

  /* ── Header ── */
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const headerNav = document.querySelector('.header-nav');
  const navLinks = document.querySelectorAll('.header-nav a');

  function closeMenu() {
    headerNav?.classList.remove('is-open');
    navToggle?.classList.remove('is-active');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  navToggle?.addEventListener('click', () => {
    const isOpen = headerNav?.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      headerNav?.classList.add('is-open');
      navToggle.classList.add('is-active');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-open');
    }
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.body.classList.contains('service-modal-open')) {
      closeMenu();
    }
  });

  window.addEventListener('scroll', () => {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }
  }, { passive: true });

  function pageFileName(pathname) {
    const name = String(pathname || '').split('/').pop();
    return name === '' ? 'index.html' : name;
  }

  const currentPage = pageFileName(window.location.pathname);
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function scrollPageTo(top) {
    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  }

  function isModifiedClick(event) {
    return event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey;
  }

  function resolveSamePageUrl(anchor) {
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return null;

    const href = anchor.getAttribute('href');
    if (!href || /^(mailto:|tel:|javascript:)/i.test(href)) return null;

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return null;
    }

    if (url.origin !== window.location.origin) return null;
    if (pageFileName(url.pathname) !== currentPage) return null;
    if (url.search !== window.location.search) return null;
    return url;
  }

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || isModifiedClick(event)) return;

    const url = resolveSamePageUrl(anchor);
    if (!url) return;

    event.preventDefault();
    closeMenu();

    if (url.hash && url.hash !== '#') {
      const target = document.querySelector(url.hash);
      if (window.location.hash !== url.hash) {
        window.location.hash = url.hash;
      }
      if (target) {
        const offset = header ? header.offsetHeight + 16 : 80;
        scrollPageTo(target.getBoundingClientRect().top + window.scrollY - offset);
      }
      return;
    }

    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }

    scrollPageTo(0);
  });

  /* ── Scroll animations ── */
  const animateElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animateElements.forEach((el) => observer.observe(el));
  } else {
    animateElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ── Counter animation ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ── Form validation ── */
  function validateForm(form) {
    let valid = true;
    const fields = form.querySelectorAll('[required]');

    fields.forEach((field) => {
      const group = field.closest('.form-group');
      const error = group?.querySelector('.form-error');
      let fieldValid = true;

      if (field.type === 'checkbox') {
        fieldValid = field.checked;
      } else if (field.type === 'email') {
        fieldValid = field.value.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      } else if (field.type === 'tel') {
        fieldValid = field.value.trim() !== '' && /^[\d\s+()-]{9,}$/.test(field.value);
      } else {
        fieldValid = field.value.trim() !== '';
      }

      group?.classList.toggle('has-error', !fieldValid);
      if (error) error.style.display = fieldValid ? 'none' : 'block';
      if (!fieldValid) valid = false;
    });

    return valid;
  }

  function handleFormSubmit(form, successMsg) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;

      const btn = form.querySelector('[type="submit"]');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Odesílám...';

      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.textContent = originalText;

        const success = form.querySelector('.form-success');
        if (success) {
          success.hidden = false;
          success.textContent = successMsg;
          setTimeout(() => { success.hidden = true; }, 6000);
        }
      }, 1200);
    });

    form.querySelectorAll('[required]').forEach((field) => {
      field.addEventListener('input', () => {
        const group = field.closest('.form-group');
        group?.classList.remove('has-error');
      });
    });
  }

  document.querySelectorAll('.contact-form, .estimate-form').forEach((form) => {
    const isEstimate = form.classList.contains('estimate-form');
    handleFormSubmit(
      form,
      isEstimate
        ? 'Děkuji! Brzy vás budu kontaktovat s odhadem ceny vaší nemovitosti.'
        : 'Děkuji za zprávu! Ozvu se vám co nejdříve.'
    );
  });

  /* ── Property cards rendering ── */
  function getPreviewLimit(container) {
    const limit = parseInt(container?.dataset.limit, 10);
    return Number.isFinite(limit) && limit > 0 ? limit : 0;
  }

  function createListingCard(property) {
    const badgeHtml = property.reserved
      ? '<span class="listing-card__badge listing-card__badge--reserved">Rezervováno</span>'
      : '';
    const href = typeof propertyDetailUrl === 'function'
      ? propertyDetailUrl(property)
      : 'kontakt.html';
    const meta = [];
    if (property.rooms) meta.push(`<span>${property.rooms}</span>`);
    if (property.area) meta.push(`<span>${property.area} m²</span>`);

    return `
      <a href="${href}" class="listing-card" data-animate data-type="${property.type}" aria-label="${property.title}, ${property.priceFormatted}">
        <div class="listing-card__image-wrap">
          <img class="listing-card__image" src="${property.image}" alt="${property.title}" loading="lazy" width="600" height="450">
          ${badgeHtml}
        </div>
        <div class="listing-card__body">
          <p class="listing-card__price">${property.priceFormatted}</p>
          <p class="listing-card__location">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${property.location}
          </p>
          <div class="listing-card__meta">${meta.join('')}</div>
        </div>
      </a>
    `;
  }

  function createDealCard(property, options = {}) {
    const href = options.href || (typeof propertyDetailUrl === 'function'
      ? propertyDetailUrl(property, true)
      : 'nabidka.html?tab=prodano');
    const typeLabel = typeof TYPE_LABELS !== 'undefined' ? TYPE_LABELS[property.type] || property.type : property.type;
    const subtitle = property.rooms ? `${typeLabel} · ${property.rooms}` : typeLabel;
    const meta = [];
    if (property.rooms) meta.push(`<span>${property.rooms}</span>`);
    if (property.area) meta.push(`<span>${property.area} m²</span>`);

    return `
      <a href="${href}" class="deal-card" data-animate aria-label="${property.location} – prodáno">
        <img class="deal-card__image" src="${property.image}" alt="${property.location}" loading="lazy" width="600" height="450">
        <span class="deal-card__result">Prodáno</span>
        <div class="deal-card__overlay">
          <h3 class="deal-card__location">${property.location}</h3>
          <p class="deal-card__type">${subtitle}</p>
        </div>
        <div class="deal-card__sizer" aria-hidden="true">
          <div class="listing-card__image-wrap"></div>
          <div class="listing-card__body">
            <p class="listing-card__price">${property.priceFormatted}</p>
            <p class="listing-card__location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              ${property.location}
            </p>
            <div class="listing-card__meta">${meta.join('')}</div>
          </div>
        </div>
      </a>
    `;
  }

  function initPropertyCarousel(track) {
    const root = track.closest('[data-carousel]');
    if (!root) return;

    const slides = [...track.children].filter((el) => el.matches('a.listing-card, a.deal-card'));
    slides.forEach((slide) => slide.classList.add('is-visible'));
    if (slides.length < 2) return;

    const prev = root.querySelector('[data-carousel-prev]');
    const next = root.querySelector('[data-carousel-next]');
    const mq = window.matchMedia('(max-width: 768px)');
    let index = 0;

    root.classList.add('is-carousel');

    function render() {
      const mobile = mq.matches;
      track.style.transform = mobile ? `translate3d(-${index * 100}%, 0, 0)` : '';
      slides.forEach((slide, i) => {
        const active = !mobile || i === index;
        slide.toggleAttribute('inert', !active);
        if (mobile) {
          slide.setAttribute('aria-hidden', active ? 'false' : 'true');
          if (active) slide.removeAttribute('tabindex');
          else slide.setAttribute('tabindex', '-1');
        } else {
          slide.removeAttribute('aria-hidden');
          slide.removeAttribute('tabindex');
        }
      });
    }

    function goTo(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      render();
    }

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', render);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(render);
    }
    render();
  }

  const COMING_SOON_ACTIVE = '<p class="listing-empty">Nemovitosti budou brzy k dispozici. Právě na tom pracujeme.</p>';
  const COMING_SOON_SOLD = '<p class="listing-empty">Přehled prodaných nemovitostí bude brzy k dispozici. Právě na tom pracujeme.</p>';

  function propertiesComingSoon() {
    return typeof PROPERTIES_COMING_SOON !== 'undefined' && PROPERTIES_COMING_SOON;
  }

  /* Homepage – featured properties */
  const featuredContainer = document.getElementById('featured-properties');
  if (featuredContainer && typeof PROPERTIES_DATA !== 'undefined') {
    const limit = getPreviewLimit(featuredContainer) || 3;
    const featured = propertiesComingSoon() ? [] : PROPERTIES_DATA.active.slice(0, limit);
    featuredContainer.innerHTML = featured.length
      ? featured.map((p) => createListingCard(p)).join('')
      : COMING_SOON_ACTIVE;
    initPropertyCarousel(featuredContainer);
  }

  /* Homepage – sold preview */
  const soldPreview = document.getElementById('sold-preview');
  if (soldPreview && typeof PROPERTIES_DATA !== 'undefined') {
    const limit = getPreviewLimit(soldPreview) || 3;
    const sold = propertiesComingSoon() ? [] : PROPERTIES_DATA.sold.slice(0, limit);
    soldPreview.innerHTML = sold.length
      ? sold.map((p) => createDealCard(p)).join('')
      : COMING_SOON_SOLD;
    initPropertyCarousel(soldPreview);
  }

  /* Nabídka – view switch */
  const listingContainer = document.getElementById('property-listing');
  const soldGallery = document.getElementById('sold-gallery');
  const viewTabs = document.querySelectorAll('[data-property-view]');
  const panelNabidka = document.getElementById('panel-nabidka');
  const panelProdano = document.getElementById('panel-prodano');

  function renderListing() {
    if (!listingContainer || typeof PROPERTIES_DATA === 'undefined') return;

    listingContainer.innerHTML = !propertiesComingSoon() && PROPERTIES_DATA.active.length
      ? PROPERTIES_DATA.active.map((p) => createListingCard(p)).join('')
      : COMING_SOON_ACTIVE;

    listingContainer.querySelectorAll('[data-animate]').forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  function renderSoldGallery() {
    if (!soldGallery || typeof PROPERTIES_DATA === 'undefined') return;

    soldGallery.innerHTML = !propertiesComingSoon() && PROPERTIES_DATA.sold.length
      ? PROPERTIES_DATA.sold.map((p) => createDealCard(p)).join('')
      : COMING_SOON_SOLD;

    soldGallery.querySelectorAll('[data-animate]').forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  function setPropertyView(view) {
    const isNabidka = view !== 'prodano';

    viewTabs.forEach((tab) => {
      const active = tab.dataset.propertyView === (isNabidka ? 'nabidka' : 'prodano');
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (panelNabidka) {
      panelNabidka.classList.toggle('property-panel--active', isNabidka);
      panelNabidka.hidden = !isNabidka;
    }

    if (panelProdano) {
      panelProdano.classList.toggle('property-panel--active', !isNabidka);
      panelProdano.hidden = isNabidka;
    }
  }

  if (listingContainer) {
    renderListing();
    renderSoldGallery();

    viewTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        setPropertyView(tab.dataset.propertyView);
      });
    });

    const params = new URLSearchParams(window.location.search);
    const initialView = params.get('tab') === 'prodano' || window.location.hash === '#prodano'
      ? 'prodano'
      : 'nabidka';
    setPropertyView(initialView);
  }

  /* ── Estimate wizard (Odhad zdarma) ── */
  function initEstimateWizard() {
    const formRoot = document.getElementById('estimate-wizard');
    if (!formRoot) return;

    const steps = [...formRoot.querySelectorAll('.estimate-wizard-step')];
    const progressBar = document.getElementById('estimate-progress-bar');
    const feedback = document.getElementById('estimate-feedback');
    const successEl = document.querySelector('.estimate-wizard-success');
    let step = 0;

    const data = {
      type: '',
      city: '',
      street: '',
      ownerRole: '',
      disposition: '',
      area: '',
      ownership: '',
      name: '',
      email: '',
      phone: '',
      message: '',
      consent: false
    };

    function setStep(index) {
      step = Math.max(0, Math.min(index, steps.length - 1));
      steps.forEach((s, idx) => s.classList.toggle('is-active', idx === step));
      if (progressBar) {
        progressBar.style.width = `${((step + 1) / steps.length) * 100}%`;
      }
      if (feedback) {
        feedback.innerHTML = step === steps.length - 1
          ? '<strong>Téměř hotovo.</strong> Zkontrolujte údaje a odešlete žádost o odhad.'
          : `Krok <strong>${step + 1}</strong> ze ${steps.length}`;
      }
    }

    formRoot.querySelectorAll('[data-estimate-choice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        formRoot.querySelectorAll('[data-estimate-choice]').forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        data.type = btn.getAttribute('data-estimate-choice') || '';
        setTimeout(() => setStep(1), 280);
      });
    });

    document.getElementById('estimate-next-1')?.addEventListener('click', () => {
      const cityInp = document.getElementById('estimate-city');
      const streetInp = document.getElementById('estimate-street');
      data.city = cityInp?.value.trim() || '';
      data.street = streetInp?.value.trim() || '';
      if (data.city.length < 2) {
        cityInp?.focus();
        return;
      }
      if (data.street.length < 2) {
        streetInp?.focus();
        return;
      }
      setStep(2);
    });

    document.getElementById('estimate-next-owner')?.addEventListener('click', () => {
      const sel = formRoot.querySelector('input[name="estimate-owner-role"]:checked');
      data.ownerRole = sel?.value || '';
      if (!data.ownerRole) return;
      setStep(3);
    });

    document.getElementById('estimate-next-2')?.addEventListener('click', () => {
      const dispositionEl = document.getElementById('estimate-disposition');
      const areaEl = document.getElementById('estimate-area');
      const ownershipSel = formRoot.querySelector('input[name="estimate-ownership"]:checked');

      data.disposition = dispositionEl?.value || '';
      data.area = areaEl?.value.trim() || '';
      data.ownership = ownershipSel?.value || '';

      if (!data.disposition) {
        dispositionEl?.focus();
        return;
      }
      const areaNum = Number(data.area);
      if (!data.area || Number.isNaN(areaNum) || areaNum < 1) {
        areaEl?.focus();
        return;
      }
      if (!data.ownership) return;
      setStep(4);
    });

    formRoot.querySelectorAll('.estimate-wizard-back').forEach((btn) => {
      btn.addEventListener('click', () => setStep(step - 1));
    });

    document.getElementById('estimate-submit')?.addEventListener('click', () => {
      const submitBtn = document.getElementById('estimate-submit');
      data.name = document.getElementById('estimate-name')?.value.trim() || '';
      data.email = document.getElementById('estimate-email')?.value.trim() || '';
      data.phone = document.getElementById('estimate-phone')?.value.trim() || '';
      data.message = document.getElementById('estimate-message')?.value.trim() || '';
      data.consent = document.getElementById('estimate-consent')?.checked === true;

      if (data.name.length < 2) {
        document.getElementById('estimate-name')?.focus();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        document.getElementById('estimate-email')?.focus();
        return;
      }
      const phoneDigits = data.phone.replace(/\D/g, '');
      if (phoneDigits.length < 9) {
        document.getElementById('estimate-phone')?.focus();
        return;
      }
      if (!data.consent) {
        document.getElementById('estimate-consent')?.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Odesílám...';
      }

      setTimeout(() => {
        formRoot.hidden = true;
        if (successEl) {
          successEl.hidden = false;
        }
        if (feedback) {
          feedback.innerHTML = '<strong>Děkuji.</strong> Ozvu se co nejdříve s nezávazným odhadem.';
        }
      }, 600);
    });

    setStep(0);
  }

  initEstimateWizard();

  /* ── Service detail modal ── */
  const SERVICE_DETAILS = {
    prodej: {
      title: 'Prodej nemovitosti',
      paragraphs: [
        'Prodej nemovitosti není jen o vyvěšení inzerátu. Připravím strategii, nastavím reálnou cenu podle trhu a postarám se, aby vaše nemovitost zaujala správné zájemce.',
        'Od první konzultace vás provedu celým procesem – příprava, prezentace, prohlídky, výběr kupujícího, vyjednání podmínek i dotažení až k podpisu a předání klíčů. Cílem je maximální cena při férovém a přehledném průběhu.'
      ],
      benefits: [
        'Strategie prodeje a reálná tržní cena',
        'Příprava nemovitosti a profesionální prezentace',
        'Prohlídky, výběr zájemců a vyjednání podmínek',
        'Kompletní dotažení až k podpisu a předání'
      ]
    },
    odhad: {
      title: 'Odhad ceny nemovitosti',
      paragraphs: [
        'Než se rozhodnete prodat, potřebujete vědět, za kolik má nemovitost reálnou šanci jít. Připravím nezávazný odhad zdarma na základě lokality, stavu, dispozice a aktuálních prodejů v okolí.',
        'Číslo vám srozumitelně vysvětlím – odkud vychází a co by cenu mohlo posunout nahoru nebo dolů. Bez závazku a bez tlaku. Pokud budete chtít pokračovat k prodeji, navážeme plynule.'
      ],
      benefits: [
        'Orientační tržní cena zdarma',
        'Zohlednění lokality, stavu i dispozice',
        'Srozumitelné vysvětlení, z čeho číslo vychází',
        'Možnost navázat na prodej, až budete chtít'
      ]
    },
    koupe: {
      title: 'Koupě nemovitosti',
      paragraphs: [
        'Hledání nemovitosti umí být únavné. Pomohu vám zúžit výběr podle lokality, rozpočtu a toho, jak chcete bydlet. U vybraných nabídek ověřím stav, cenu i rizika, abyste nekupovali naslepo.',
        'Následně vás provedu jednáním, přípravou koupě i převodem vlastnictví. Budu ten, kdo hlídá termíny, dokumenty a férovost podmínek.'
      ],
      benefits: [
        'Výběr nemovitosti podle vašich požadavků',
        'Ověření stavu, lokality i reálné ceny',
        'Jednání s prodávajícím a příprava koupě',
        'Doprovod až do katastru'
      ]
    },
    'home-staging': {
      title: 'Home staging a příprava',
      paragraphs: [
        'První dojem rozhoduje. Před focením doporučím drobné úpravy, pomohu s úklidem prostoru a home stagingem, aby interiér působil světle, prostorně a přívětivě.',
        'Profesionální fotografie a srozumitelný popis pak z nabídky udělají něco, u čeho se lidé zastaví. Dobře připravená nemovitost se prohlíží rychleji a často se prodá výhodněji.'
      ],
      benefits: [
        'Doporučení drobných úprav před focením',
        'Home staging interiéru',
        'Profesionální fotografie a prezentace',
        'Příprava textů a podkladů k inzerci'
      ]
    },
    marketing: {
      title: 'Marketing nemovitosti',
      paragraphs: [
        'Inzerát na jednom portálu dnes nestačí. Připravím prezentaci, která nemovitost odliší, a dostanu ji na hlavní realitní weby, sociální sítě i k lidem, kteří v dané lokalitě aktivně hledají.',
        'Průběžně sleduji, jak nabídka funguje, a upravím cenu, text nebo vizuály, pokud je potřeba. Cílem není jen viditelnost, ale relevantní zájemci.'
      ],
      benefits: [
        'Inzerce na hlavních realitních portálech',
        'Prezentace na sociálních sítích',
        'Oslovení relevantních zájemců',
        'Průběžné vyhodnocení a úprava nabídky'
      ]
    },
    'pravni-servis': {
      title: 'Právní servis',
      paragraphs: [
        'Právní část prodeje nebo koupě nemusí být stresující. Zajistím přípravu a kontrolu smluv, úschovu kupní ceny i převod vlastnictví na katastru.',
        'Celý postup vám vysvětlím srozumitelně a včas, abyste věděli, co se děje a co od vás bude potřeba. Vy se soustředíte na stěhování, já na papíry.'
      ],
      benefits: [
        'Příprava a kontrola smluv',
        'Úschova kupní ceny',
        'Převod vlastnictví na katastru',
        'Srozumitelný postup bez překvapení'
      ]
    }
  };

  function escapeServiceHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function initServiceDetails() {
    const cards = document.querySelectorAll('[data-service]');
    if (!cards.length) return;

    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.innerHTML = `
      <div class="service-modal__backdrop" data-service-close></div>
      <div class="service-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="service-modal-title" tabindex="-1">
        <button type="button" class="service-modal__close" data-service-close aria-label="Zavřít detail služby">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <div class="service-modal__icon" aria-hidden="true"></div>
        <h2 class="service-modal__title" id="service-modal-title"></h2>
        <div class="service-modal__body"></div>
      </div>
    `;
    modal.setAttribute('aria-hidden', 'true');
    document.body.appendChild(modal);

    const dialog = modal.querySelector('.service-modal__dialog');
    const iconEl = modal.querySelector('.service-modal__icon');
    const titleEl = modal.querySelector('.service-modal__title');
    const bodyEl = modal.querySelector('.service-modal__body');
    let lastTrigger = null;
    let openId = '';

    function getFocusable() {
      return [...dialog.querySelectorAll('a[href], button:not([disabled])')];
    }

    function setServiceHash(id) {
      if (id) {
        if (!document.getElementById(id)) return;
        if (window.location.hash !== `#${id}`) {
          history.replaceState(null, '', `#${id}`);
        }
        return;
      }
      const current = window.location.hash.replace('#', '');
      if (current && SERVICE_DETAILS[current]) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }

    function closeServiceModal(clearHash = true) {
      if (!modal.classList.contains('is-open')) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('service-modal-open');
      openId = '';
      if (clearHash) setServiceHash('');
      lastTrigger?.focus();
    }

    function openServiceModal(id, trigger) {
      const data = SERVICE_DETAILS[id];
      if (!data) return;

      lastTrigger = trigger || document.querySelector(`[data-service="${id}"]`);
      openId = id;

      const triggerIcon = lastTrigger?.querySelector('.service-card__icon');
      iconEl.innerHTML = triggerIcon ? triggerIcon.innerHTML : '';
      titleEl.textContent = data.title;
      bodyEl.innerHTML = `
        ${data.paragraphs.map((p) => `<p>${escapeServiceHtml(p)}</p>`).join('')}
        <ul class="service-modal__benefits">
          ${data.benefits.map((item) => `<li>${escapeServiceHtml(item)}</li>`).join('')}
        </ul>
      `;

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('service-modal-open');
      closeMenu();
      setServiceHash(id);
      dialog.focus();
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        openServiceModal(card.getAttribute('data-service'), card);
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-service-close]')) {
        closeServiceModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeServiceModal();
        return;
      }

      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('hashchange', () => {
      const id = window.location.hash.replace('#', '');
      if (SERVICE_DETAILS[id]) {
        openServiceModal(id);
      } else {
        closeServiceModal(false);
      }
    });

    const initialId = window.location.hash.replace('#', '');
    if (SERVICE_DETAILS[initialId]) {
      openServiceModal(initialId);
    }
  }

  initServiceDetails();

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* Smooth scroll for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight + 16 : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
