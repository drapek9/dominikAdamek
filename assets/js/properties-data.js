/**
 * Data nemovitostí – připraveno pro budoucí napojení na XML feed.
 */
const PROPERTIES_DATA = {
  active: [
    {
      id: '437359',
      type: 'dum',
      title: 'Prostorný dům 9+kk pro bydlení i podnikání',
      location: 'Praha-východ – Říčany',
      city: 'Říčany',
      price: 5490000,
      priceFormatted: '5 490 000 Kč',
      area: 441,
      landArea: 1200,
      rooms: '9+kk',
      image: 'assets/images/property-1.jpg',
      description: 'Rodinný dům s užitnou plochou 441 m², velkou dílnou a investičním potenciálem. V rekonstrukci, solární panely.',
      detailText: 'Nemovitost nabízí flexibilní využití pro rodinné bydlení i podnikání. Velkorysé dispozice, samostatná dílna a pozemek umožňují široké možnosti dalšího rozvoje. Dům je v rekonstrukci s instalovanými solárními panely.',
      highlights: [
        'Užitná plocha 441 m²',
        'Vhodné pro bydlení i podnikání',
        'Solární panely',
        'Velká dílna a investiční potenciál'
      ],
      status: 'active',
      featured: true,
    },
    {
      id: '421278',
      type: 'dum',
      title: 'Rodinný dům 189 m², pozemek 1 729 m²',
      location: 'Praha-západ – Černošice',
      city: 'Černošice',
      price: 6370000,
      priceFormatted: '6 370 000 Kč',
      area: 189,
      landArea: 1729,
      rooms: '4+1 / 3+1',
      image: 'assets/images/property-2.jpg',
      description: 'Prostorný dům se dvěma bytovými jednotkami, zahradou 1 206 m². Po rekonstrukci, tepelné čerpadlo.',
      detailText: 'Dům nabízí dvě samostatné bytové jednotky a velkorysý pozemek se zahradou. Po kompletní rekonstrukci je vybaven tepelným čerpadlem. Ideální pro rodinné bydlení s možností pronájmu části domu.',
      highlights: [
        'Dvě bytové jednotky',
        'Pozemek 1 729 m²',
        'Tepelné čerpadlo',
        'Po rekonstrukci'
      ],
      status: 'active',
      featured: true,
      reserved: true,
    },
    {
      id: '433839',
      type: 'dum',
      title: 'Rodinný dům se zahradou na Zbraslavi',
      location: 'Praha 5 – Zbraslav',
      city: 'Praha 5',
      price: 4890000,
      priceFormatted: '4 890 000 Kč',
      area: 102,
      landArea: 696,
      rooms: '4 pokoje',
      image: 'assets/images/property-3.jpg',
      description: 'Samostatně stojící dům v klidné části města, zahrada 696 m². Potenciál pro rekonstrukci dle představ.',
      detailText: 'Samostatně stojící rodinný dům v klidné části Zbraslavi. Zahrada o rozloze 696 m² nabízí dostatek soukromí. Nemovitost má potenciál pro rekonstrukci podle vašich představ.',
      highlights: [
        'Klidná lokalita',
        'Zahrada 696 m²',
        'Samostatně stojící dům',
        'Potenciál rekonstrukce'
      ],
      status: 'active',
      featured: true,
    },
    {
      id: '434692',
      type: 'dum',
      title: 'Řadový dům 4+kk s terasou a 2 garážemi',
      location: 'Beroun',
      city: 'Beroun',
      price: 2249000,
      priceFormatted: '2 249 000 Kč',
      area: 212,
      landArea: 350,
      rooms: '4+kk',
      image: 'assets/images/property-4.jpg',
      description: 'Řadový dům 212 m² v Berouně s dobrou dostupností do Prahy. Terasa, 2 garáže, klenutý sklep.',
      detailText: 'Prostorný řadový dům v Berouně. K dispozici terasa, dvě garáže a klenutý sklep. Vhodné jako trvalé bydlení i s dobrou dostupností do Prahy.',
      highlights: [
        'Terasa a 2 garáže',
        'Klenutý sklep',
        'Dobrá dostupnost do Prahy',
        'Užitná plocha 212 m²'
      ],
      status: 'active',
      featured: true,
    }
  ],
  sold: [
    {
      id: 'sold-001',
      type: 'byt',
      title: 'Byt 3+1',
      location: 'Praha 5 – Smíchov',
      city: 'Praha 5',
      price: 3890000,
      priceFormatted: '3 890 000 Kč',
      area: 78,
      rooms: '3+1',
      image: 'assets/images/property-1.jpg',
      description: 'Byt 3+1 v Praze s praktickou dispozicí a dobrou dostupností služeb. Prodej proběhl bez komplikací.',
      detailText: 'Klient ocenil rychlou komunikaci a profesionální přístup při celém prodeji. Nemovitost byla prezentována kvalitním marketingem a prodána v dohodnutém termínu.',
      highlights: [
        'Prodej do 42 dní',
        'Praha 5 – Smíchov',
        'Dispozice 3+1',
        'Spokojený klient'
      ],
      soldDays: 42,
      soldDate: '2025-11',
      status: 'sold'
    },
    {
      id: 'sold-002',
      type: 'dum',
      title: 'Rodinný dům',
      location: 'Praha-západ',
      city: 'Praha-západ',
      price: 5450000,
      priceFormatted: '5 450 000 Kč',
      area: 132,
      landArea: 850,
      rooms: '4+1',
      image: 'assets/images/property-2.jpg',
      description: 'Rodinný dům za Prahou s zahradou. Kompletní servis od odhadu po předání klíčů.',
      detailText: 'Prodej rodinného domu včetně právního servisu a komunikace s kupujícími. Důraz na férové jednání a transparentní průběh celého procesu.',
      highlights: [
        'Kompletní právní servis',
        'Zahrada a garáž',
        'Prodej do 67 dní',
        'Praha-západ'
      ],
      soldDays: 67,
      soldDate: '2025-09',
      status: 'sold'
    },
    {
      id: 'sold-003',
      type: 'byt',
      title: 'Byt 1+kk',
      location: 'Praha 8 – Karlín',
      city: 'Praha 8',
      price: 2150000,
      priceFormatted: '2 150 000 Kč',
      area: 42,
      rooms: '1+kk',
      image: 'assets/images/property-3.jpg',
      description: 'Kompaktní byt 1+kk v Karlíně. Rychlý prodej díky cílenému marketingu.',
      detailText: 'Menší byt vhodný pro jednotlivce nebo pár. Díky správné cenové strategii a prezentaci na realitních portálech byl prodej uzavřen do 28 dní.',
      highlights: [
        'Prodej do 28 dní',
        'Ideální pro začínající',
        'Karlín – centrum',
        'Cílený marketing'
      ],
      soldDays: 28,
      soldDate: '2025-12',
      status: 'sold'
    },
    {
      id: 'sold-004',
      type: 'dum',
      title: 'Vila s bazénem',
      location: 'Praha 6 – Dejvice',
      city: 'Praha 6',
      price: 8900000,
      priceFormatted: '8 900 000 Kč',
      area: 210,
      landArea: 1400,
      rooms: '6+1',
      image: 'assets/images/property-4.jpg',
      description: 'Vila s bazénem a velkým pozemkem. Náročnější prodej s individuálním přístupem ke každému zájemci.',
      detailText: 'Prémiová nemovitost vyžadovala individuální marketing a pečlivý výběr kupujícího. Prodej zahrnoval osobní prohlídky, vyjednávání podmínek a kompletní právní servis.',
      highlights: [
        'Bazén a velký pozemek',
        'Prémiová prezentace',
        'Individuální přístup',
        'Praha 6 – Dejvice'
      ],
      soldDays: 95,
      soldDate: '2025-06',
      status: 'sold'
    },
    {
      id: 'sold-005',
      type: 'pozemek',
      title: 'Pozemek pro RD',
      location: 'Praha-východ',
      city: 'Praha-východ',
      price: 1650000,
      priceFormatted: '1 650 000 Kč',
      area: 650,
      rooms: null,
      image: 'assets/images/property-1.jpg',
      description: 'Stavební pozemek pro rodinný dům. Rychlý prodej investorovi.',
      detailText: 'Pozemek určený pro výstavbu rodinného domu. Prodej proběhl efektivně díky správnému zacílení na investory a stavebníky v regionu.',
      highlights: [
        'Stavební pozemek 650 m²',
        'Prodej do 35 dní',
        'Praha-východ',
        'Vhodné pro RD'
      ],
      soldDays: 35,
      soldDate: '2025-10',
      status: 'sold'
    },
    {
      id: 'sold-006',
      type: 'byt',
      title: 'Byt 4+kk',
      city: 'Praha 2',
      price: 5120000,
      priceFormatted: '5 120 000 Kč',
      area: 95,
      rooms: '4+kk',
      image: 'assets/images/property-2.jpg',
      description: 'Prostorný byt 4+kk v atraktivní lokalitě Vinohrad. Prodej za cenu převyšující očekávání klienta.',
      detailText: 'Byt v žádané lokalitě Vinohrad. Díky profesionální prezentaci a aktivnímu marketingu byl dosažen výsledek nad očekáváním majitele.',
      highlights: [
        'Atraktivní lokalita',
        'Dispozice 4+kk',
        'Prodej do 51 dní',
        'Cena nad očekáváním'
      ],
      soldDays: 51,
      soldDate: '2025-08',
      status: 'sold'
    }
  ]
};

const TYPE_LABELS = {
  byt: 'Byt',
  dum: 'Dům',
  pozemek: 'Pozemek',
  komercni: 'Komerční'
};

function findPropertyById(id, sold = false) {
  const list = sold ? PROPERTIES_DATA.sold : PROPERTIES_DATA.active;
  return list.find((property) => String(property.id) === String(id)) || null;
}

function propertyDetailUrl(property, sold = false) {
  const isSold = sold || property.status === 'sold';
  const id = encodeURIComponent(property.id);
  return isSold ? `nemovitost.html?id=${id}&prodano=1` : `nemovitost.html?id=${id}`;
}

/**
 * Budoucí parser XML feedu – připravená struktura.
 * @param {Document} xmlDoc - Parsed XML document
 * @returns {Array} Normalized property objects
 */
function parseXmlFeed(xmlDoc) {
  const items = xmlDoc.querySelectorAll('property, listing, nemovitost');
  return Array.from(items).map((item) => ({
    id: item.querySelector('id')?.textContent || '',
    type: item.querySelector('type')?.textContent || 'byt',
    title: item.querySelector('title, nazev')?.textContent || '',
    location: item.querySelector('location, lokalita')?.textContent || '',
    city: item.querySelector('city, mesto')?.textContent || '',
    price: parseInt(item.querySelector('price, cena')?.textContent || '0', 10),
    priceFormatted: item.querySelector('price_formatted')?.textContent || '',
    area: parseInt(item.querySelector('area, plocha')?.textContent || '0', 10),
    rooms: item.querySelector('rooms, dispozice')?.textContent || null,
    image: item.querySelector('image, foto')?.textContent || '',
    description: item.querySelector('description, popis')?.textContent || '',
    status: item.querySelector('status, stav')?.textContent || 'active',
    url: item.querySelector('url, odkaz')?.textContent || ''
  }));
}
