/**
 * Detail nemovitosti – vykreslení stránky nemovitost.html
 */

const MAP_PIN_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatSoldDate(dateStr) {
  if (!dateStr) return null;
  const [year, month] = dateStr.split('-');
  if (!year || !month) return dateStr;
  return `${month}/${year}`;
}

function getStatusBadge(property, isSold) {
  if (isSold) return { text: 'Prodáno', className: 'property-detail__badge--sold' };
  if (property.reserved) return { text: 'Rezervováno', className: 'property-detail__badge--reserved' };
  return { text: 'V nabídce', className: 'property-detail__badge--active' };
}

function buildSpecRows(property, isSold) {
  const typeLabel = TYPE_LABELS[property.type] || property.type;
  const rows = [];

  rows.push(['Typ nemovitosti', typeLabel]);
  if (property.rooms) rows.push(['Dispozice', property.rooms]);
  if (property.area) rows.push(['Užitná plocha', `${property.area} m²`]);
  if (property.landArea) rows.push(['Pozemek', `${property.landArea} m²`]);
  if (property.city) rows.push(['Město', property.city]);

  if (isSold) {
    if (property.soldDays) rows.push(['Doba prodeje', `${property.soldDays} dní`]);
    if (property.soldDate) rows.push(['Datum prodeje', formatSoldDate(property.soldDate)]);
    rows.push(['Výsledek', 'Prodáno']);
  } else if (property.reserved) {
    rows.push(['Stav nabídky', 'Rezervováno']);
  } else {
    rows.push(['Stav nabídky', 'V nabídce']);
  }

  return rows;
}

function renderSpecs(property, isSold) {
  const rows = buildSpecRows(property, isSold);
  return rows.map(([label, value]) => `
    <div class="property-detail__spec">
      <p class="property-detail__spec-label">${escapeHtml(label)}</p>
      <p class="property-detail__spec-value">${escapeHtml(value)}</p>
    </div>
  `).join('');
}

function renderHighlights(property) {
  if (!property.highlights?.length) return '';

  return `
    <section class="property-detail__section" aria-labelledby="property-highlights-heading">
      <h2 id="property-highlights-heading" class="property-detail__section-title">Hlavní přednosti</h2>
      <ul class="property-detail__highlights">
        ${property.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderActions(property, isSold) {
  if (isSold) {
    return `
      <div class="property-detail__actions">
        <a href="odhad.html" class="btn btn--primary btn--lg">Chci prodat podobně</a>
        <a href="kontakt.html" class="btn btn--outline-dark btn--lg">Kontaktovat makléře</a>
      </div>
    `;
  }

  const externalLink = property.url
    ? `<a href="${property.url}" class="btn btn--outline-dark btn--lg" target="_blank" rel="noopener noreferrer">Zobrazit inzerát</a>`
    : '';

  return `
    <div class="property-detail__actions">
      <a href="kontakt.html" class="btn btn--primary btn--lg">Mám zájem – kontaktujte mě</a>
      ${externalLink}
    </div>
  `;
}

function buildSummary(property) {
  const typeLabel = TYPE_LABELS[property.type] || property.type;
  const parts = [typeLabel];
  if (property.rooms) parts.push(property.rooms);
  if (property.area) parts.push(`${property.area} m²`);
  return parts.join(' · ');
}

function updatePageMeta(property, isSold) {
  const title = `${property.title} | Dominik Adámek`;
  document.title = title;

  const description = property.description || '';
  let meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', description);

  meta = document.querySelector('meta[property="og:title"]');
  if (meta) meta.setAttribute('content', property.title);

  meta = document.querySelector('meta[property="og:description"]');
  if (meta) meta.setAttribute('content', description);

  meta = document.querySelector('meta[property="og:image"]');
  if (meta && property.image) meta.setAttribute('content', property.image);
}

function renderNotFound() {
  return `
    <section class="section property-detail property-detail--empty">
      <div class="container">
        <a href="nabidka.html" class="property-detail__back">← Zpět na nabídku</a>
        <div class="property-detail__empty">
          <h1>Nemovitost nenalezena</h1>
          <p>Tato nemovitost v nabídce není nebo odkaz není platný.</p>
          <a href="nabidka.html" class="btn btn--primary btn--lg">Zpět na nabídku</a>
        </div>
      </div>
    </section>
  `;
}

function renderPropertyDetail(property, isSold) {
  const badge = getStatusBadge(property, isSold);
  const backHref = isSold ? 'nabidka.html?tab=prodano' : 'nabidka.html';
  const priceDisplay = isSold ? 'Prodáno' : property.priceFormatted;
  const priceClass = isSold ? ' property-detail__price--sold' : '';
  const summary = buildSummary(property);
  const detailText = property.detailText
    ? `<p class="property-detail__desc property-detail__desc--secondary">${escapeHtml(property.detailText)}</p>`
    : '';

  updatePageMeta(property, isSold);

  return `
    <article class="property-detail">
      <div class="container">
        <a href="${backHref}" class="property-detail__back">← Zpět na nabídku</a>

        <div class="property-detail__grid">
          <div class="property-detail__gallery">
            <img class="property-detail__image" src="${property.image}" alt="${escapeHtml(property.title)}" width="1200" height="900" loading="eager">
            <span class="property-detail__badge ${badge.className}">${badge.text}</span>
          </div>

          <div class="property-detail__info">
            <header class="property-detail__header">
              <p class="property-detail__location">${MAP_PIN_ICON}<span>${escapeHtml(property.location)}</span></p>
              <h1 class="property-detail__title">${escapeHtml(property.title)}</h1>
              <p class="property-detail__price${priceClass}">${escapeHtml(priceDisplay)}</p>
              ${isSold && property.priceFormatted ? `<p class="property-detail__sold-price">Prodejní cena: ${escapeHtml(property.priceFormatted)}</p>` : ''}
              <p class="property-detail__summary">${escapeHtml(summary)}</p>
            </header>

            <section class="property-detail__section" aria-label="Parametry nemovitosti">
              <h2 class="property-detail__section-title">Parametry</h2>
              <div class="property-detail__specs">${renderSpecs(property, isSold)}</div>
            </section>

            <section class="property-detail__section" aria-labelledby="property-description-heading">
              <h2 id="property-description-heading" class="property-detail__section-title">Popis</h2>
              <div class="property-detail__copy">
                <p class="property-detail__desc">${escapeHtml(property.description || '')}</p>
                ${detailText}
              </div>
            </section>

            ${renderHighlights(property)}
            ${renderActions(property, isSold)}
          </div>
        </div>
      </div>
    </article>
  `;
}

function initPropertyDetail() {
  const root = document.getElementById('property-detail');
  if (!root || typeof PROPERTIES_DATA === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const isSold = params.get('prodano') === '1';

  if (!id) {
    root.innerHTML = renderNotFound();
    document.title = 'Nemovitost nenalezena | Dominik Adámek';
    return;
  }

  const property = findPropertyById(id, isSold);

  if (!property) {
    root.innerHTML = renderNotFound();
    document.title = 'Nemovitost nenalezena | Dominik Adámek';
    return;
  }

  root.innerHTML = renderPropertyDetail(property, isSold);

  root.querySelectorAll('[data-animate]').forEach((el) => {
    el.classList.add('is-visible');
  });
}

document.addEventListener('DOMContentLoaded', initPropertyDetail);
