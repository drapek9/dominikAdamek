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
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('scroll', () => {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }
  }, { passive: true });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
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

  /* Homepage – featured properties */
  const featuredContainer = document.getElementById('featured-properties');
  if (featuredContainer && typeof PROPERTIES_DATA !== 'undefined') {
    const limit = getPreviewLimit(featuredContainer) || 3;
    const featured = PROPERTIES_DATA.active.slice(0, limit);
    featuredContainer.innerHTML = featured.length
      ? featured.map((p) => createListingCard(p)).join('')
      : '<p class="listing-empty">Momentálně nemáme aktivní nabídku.</p>';
    featuredContainer.querySelectorAll('[data-animate]').forEach((el) => {
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        obs.observe(el);
      }
    });
  }

  /* Homepage – sold preview */
  const soldPreview = document.getElementById('sold-preview');
  if (soldPreview && typeof PROPERTIES_DATA !== 'undefined') {
    const limit = getPreviewLimit(soldPreview) || 3;
    soldPreview.innerHTML = PROPERTIES_DATA.sold.slice(0, limit).map((p) =>
      createDealCard(p)
    ).join('');
    soldPreview.querySelectorAll('[data-animate]').forEach((el) => {
      if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });
        obs.observe(el);
      }
    });
  }

  /* Nabídka – view switch */
  const listingContainer = document.getElementById('property-listing');
  const soldGallery = document.getElementById('sold-gallery');
  const viewTabs = document.querySelectorAll('[data-property-view]');
  const panelNabidka = document.getElementById('panel-nabidka');
  const panelProdano = document.getElementById('panel-prodano');

  function renderListing() {
    if (!listingContainer || typeof PROPERTIES_DATA === 'undefined') return;

    listingContainer.innerHTML = PROPERTIES_DATA.active.length
      ? PROPERTIES_DATA.active.map((p) => createListingCard(p)).join('')
      : '<p class="listing-empty">Momentálně nemáme aktivní nabídku. Kontaktujte mě – rád vám pomohu najít vhodnou nemovitost.</p>';

    listingContainer.querySelectorAll('[data-animate]').forEach((el) => {
      el.classList.add('is-visible');
    });
  }

  function renderSoldGallery() {
    if (!soldGallery || typeof PROPERTIES_DATA === 'undefined') return;

    soldGallery.innerHTML = PROPERTIES_DATA.sold.length
      ? PROPERTIES_DATA.sold.map((p) => createDealCard(p)).join('')
      : '<p class="listing-empty">Zatím zde nejsou žádné prodané nemovitosti k zobrazení.</p>';

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
