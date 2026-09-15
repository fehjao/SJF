(function () {
  'use strict';

  const DEFAULT_MIN_PRICE = null;
  const DEFAULT_MAX_PRICE = 250000;
  const DEFAULT_UF = 'MG';
  const DEFAULT_CITY = 'Betim';

  let currentResults = [];
  let isSearching = false;
  let currentSort = { field: null, direction: 'asc' };

  let currentSelectedUf = DEFAULT_UF;
  let currentSelectedCity = DEFAULT_CITY;

  const ufSelectBox = document.getElementById('uf-select-box');
  const ufSelectTrigger = document.getElementById('uf-select-trigger');
  const ufSelectedLabel = document.getElementById('uf-selected-label');
  const ufOptionsList = document.getElementById('uf-options-list');

  const citySelectBox = document.getElementById('city-select-box');
  const citySelectTrigger = document.getElementById('city-select-trigger');
  const citySelectedLabel = document.getElementById('city-selected-label');
  const citySearchInput = document.getElementById('city-search-input');
  const cityOptionsList = document.getElementById('city-options-list');

  const inputNeighborhoods = document.getElementById('input-neighborhoods');
  const selectBedrooms = document.getElementById('select-bedrooms');
  const selectBathrooms = document.getElementById('select-bathrooms');
  const inputMinPrice = document.getElementById('input-min-price');
  const inputMaxPrice = document.getElementById('input-max-price');
  const selectViewMode = document.getElementById('select-view-mode');

  const btnSearch = document.getElementById('btn-search');
  const btnExport = document.getElementById('btn-export');
  const btnExtension = document.getElementById('btn-extension');

  const statusContainer = document.getElementById('status-container');
  const statusMessage = document.getElementById('status-message');
  const statusDetails = document.getElementById('status-details');

  const resultsSummary = document.getElementById('results-summary');
  const resultsCount = document.getElementById('results-count');
  const filterAppliedInfo = document.getElementById('filter-applied-info');

  const tableWrapper = document.getElementById('table-wrapper');
  const resultsTable = document.getElementById('results-table');
  const resultsTbody = document.getElementById('results-tbody');
  const rowTemplate = document.getElementById('row-template');
  const resultsCards = document.getElementById('results-cards');
  const cardTemplate = document.getElementById('card-template');

  const agencyGalleryOverlay = document.getElementById('agency-gallery-overlay');
  const agencyGalleryOverlayImage = document.getElementById('agency-gallery-overlay-image');

  const emptyState = document.getElementById('empty-state');
  const stateInitial = document.getElementById('state-initial');
  const stateNoResults = document.getElementById('state-no-results');
  const stateCorsError = document.getElementById('state-cors-error');
  const stateGenericError = document.getElementById('state-generic-error');
  const errorMessageText = document.getElementById('error-message-text');

  function openOverlayImage(src) {
    if (!agencyGalleryOverlay || !agencyGalleryOverlayImage || !src) return;
    agencyGalleryOverlayImage.src = src;
    agencyGalleryOverlay.classList.add('open');
  }

  function closeOverlayImage() {
    if (!agencyGalleryOverlay) return;
    agencyGalleryOverlay.classList.remove('open');
  }

  function showEmptyState(stateName, errorText) {
    emptyState.style.display = 'block';
    if (stateInitial) stateInitial.style.display = stateName === 'initial' ? 'block' : 'none';
    if (stateNoResults) stateNoResults.style.display = stateName === 'no-results' ? 'block' : 'none';
    if (stateCorsError) stateCorsError.style.display = stateName === 'cors-error' ? 'block' : 'none';
    if (stateGenericError) stateGenericError.style.display = stateName === 'error' ? 'block' : 'none';
    if (errorText && errorMessageText) {
      errorMessageText.textContent = errorText;
    }
  }

  function renderOptions(container, options, selectedValue, onSelect) {
    container.innerHTML = '';
    if (!options || options.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'custom-select-option';
      emptyDiv.style.color = '#9c8a5a';
      emptyDiv.style.cursor = 'default';
      emptyDiv.textContent = 'Nenhuma opção encontrada';
      container.appendChild(emptyDiv);
      return;
    }

    options.forEach(opt => {
      const optDiv = document.createElement('div');
      optDiv.className = 'custom-select-option' + (opt === selectedValue ? ' selected' : '');
      optDiv.textContent = opt;
      optDiv.addEventListener('click', function (e) {
        e.stopPropagation();
        onSelect(opt);
      });
      container.appendChild(optDiv);
    });
  }

  function updateCityOptions(uf, targetCity) {
    const cities = (typeof BRAZIL_LOCATIONS !== 'undefined' && BRAZIL_LOCATIONS[uf]) ? BRAZIL_LOCATIONS[uf] : [];
    if (targetCity && cities.includes(targetCity)) {
      currentSelectedCity = targetCity;
    } else if (cities.length > 0) {
      currentSelectedCity = cities[0];
    } else {
      currentSelectedCity = '';
    }

    citySelectedLabel.textContent = currentSelectedCity;
    if (citySearchInput) citySearchInput.value = '';

    renderOptions(cityOptionsList, cities, currentSelectedCity, function (chosenCity) {
      currentSelectedCity = chosenCity;
      citySelectedLabel.textContent = chosenCity;
      citySelectBox.classList.remove('open');
      updateCityOptionsHighlight();
    });
  }

  function updateCityOptionsHighlight() {
    cityOptionsList.querySelectorAll('.custom-select-option').forEach(item => {
      if (item.textContent === currentSelectedCity) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }

  function initLocations() {
    if (typeof BRAZIL_LOCATIONS === 'undefined') return;

    const states = Object.keys(BRAZIL_LOCATIONS).sort();
    currentSelectedUf = DEFAULT_UF;
    ufSelectedLabel.textContent = currentSelectedUf;

    renderOptions(ufOptionsList, states, currentSelectedUf, function (chosenUf) {
      currentSelectedUf = chosenUf;
      ufSelectedLabel.textContent = chosenUf;
      ufSelectBox.classList.remove('open');
      ufOptionsList.querySelectorAll('.custom-select-option').forEach(item => {
        if (item.textContent === chosenUf) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });

      const nextDefaultCity = chosenUf === 'MG' ? DEFAULT_CITY : null;
      updateCityOptions(chosenUf, nextDefaultCity);
    });

    updateCityOptions(DEFAULT_UF, DEFAULT_CITY);

    ufSelectTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = ufSelectBox.classList.contains('open');
      closeAllSelects();
      if (!isOpen) {
        ufSelectBox.classList.add('open');
      }
    });

    citySelectTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = citySelectBox.classList.contains('open');
      closeAllSelects();
      if (!isOpen) {
        citySelectBox.classList.add('open');
        if (citySearchInput) {
          setTimeout(() => citySearchInput.focus(), 50);
        }
        const selectedOption = cityOptionsList.querySelector('.custom-select-option.selected');
        if (selectedOption) {
          selectedOption.scrollIntoView({ block: 'nearest' });
        }
      }
    });

    if (citySearchInput) {
      citySearchInput.addEventListener('input', function () {
        const query = normalizeText(this.value);
        const allCities = BRAZIL_LOCATIONS[currentSelectedUf] || [];
        const filtered = allCities.filter(c => normalizeText(c).includes(query));
        renderOptions(cityOptionsList, filtered, currentSelectedCity, function (chosenCity) {
          currentSelectedCity = chosenCity;
          citySelectedLabel.textContent = chosenCity;
          citySelectBox.classList.remove('open');
          updateCityOptionsHighlight();
        });
      });

      citySearchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const firstOpt = cityOptionsList.querySelector('.custom-select-option');
          if (firstOpt && firstOpt.textContent !== 'Nenhuma opção encontrada') {
            currentSelectedCity = firstOpt.textContent;
            citySelectedLabel.textContent = firstOpt.textContent;
            citySelectBox.classList.remove('open');
            updateCityOptionsHighlight();
          }
        }
      });
    }

    document.addEventListener('click', closeAllSelects);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAllSelects();
        closeOverlayImage();
      }
    });
  }

  function closeAllSelects() {
    if (ufSelectBox) ufSelectBox.classList.remove('open');
    if (citySelectBox) citySelectBox.classList.remove('open');
  }

  function formatCurrencyValue(centsValue) {
    if (isNaN(centsValue) || centsValue === null) return '';
    return (centsValue / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function parseCurrencyInputToNumber(inputValue) {
    if (!inputValue) return null;
    const digitsOnly = inputValue.replace(/\D/g, '');
    if (!digitsOnly) return null;
    return parseFloat(digitsOnly) / 100;
  }

  function setupCurrencyInput(inputElement, defaultValue) {
    if (defaultValue !== null && defaultValue !== undefined && defaultValue !== '') {
      const cents = typeof defaultValue === 'number' ? Math.round(defaultValue * 100) : parseInt(defaultValue.toString().replace(/\D/g, ''), 10);
      if (!isNaN(cents)) {
        inputElement.value = formatCurrencyValue(cents);
      }
    }

    inputElement.addEventListener('input', function () {
      let rawDigits = this.value.replace(/\D/g, '');
      if (!rawDigits) {
        this.value = '';
        return;
      }
      const cents = parseInt(rawDigits, 10);
      this.value = formatCurrencyValue(cents);
    });

    inputElement.addEventListener('focus', function () {
      if (!this.value) {
        this.placeholder = 'R$ 0,00';
      }
    });
  }

  function normalizeText(text) {
    if (!text) return '';
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function slugify(text) {
    const norm = normalizeText(text);
    return norm.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function formatFee(value) {
    if (value === null || value === undefined || value === '' || value === '?' || value === '-' || value === 'null' || value === '$undefined') {
      return '-';
    }
    if (typeof value === 'string') {
      const lower = value.trim().toLowerCase();
      if (lower === 'isento') return 'Isento';
      if (lower === 'não informado' || lower === 'nao informado' || lower === '-' || lower === '?' || lower === 'null' || lower === '$undefined') return '-';
      const cleanDigits = value.replace(/[^\d,\.]/g, '').replace(/\./g, '').replace(',', '.');
      const num = parseFloat(cleanDigits);
      if (!isNaN(num)) {
        if (num > 1) {
          return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        } else if (num === 0) {
          return 'Isento';
        } else if (num === 1) {
          return '-';
        }
      }
    } else if (typeof value === 'number') {
      if (value > 1) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      } else if (value === 0) {
        return 'Isento';
      } else if (value === 1) {
        return '-';
      }
    }
    return '-';
  }

  function detectNeighborhood(url, title, images, city, uf, targetMap, targetNeighborhoods) {
    const slug = url.split('/imovel/').pop() || '';
    const normBlob = normalizeText(slug + ' ' + (title || ''));

    if (targetNeighborhoods && targetNeighborhoods.length > 0) {
      for (const [normTarget, origName] of Object.entries(targetMap)) {
        if (slugify(origName) && slug.includes(slugify(origName))) {
          return origName;
        } else if (normBlob.includes(normTarget)) {
          return origName;
        }
      }
      return null;
    }

    const citySlug = slugify(city);

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imgUrl = images[i];
        if (typeof imgUrl === 'string') {
          const imgMatch = imgUrl.match(new RegExp('-(?:no|na|em)-([a-z0-9-]+)-' + citySlug + '(?:\\.webp|\\?|$)', 'i'));
          if (imgMatch && imgMatch[1]) {
            const raw = imgMatch[1].replace(/-/g, ' ').trim();
            if (raw.length > 1) {
              return raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            }
          }
        }
      }
    }

    if (title && city) {
      const escapedCity = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = title.match(new RegExp('em\\s+([^,]+),\\s*' + escapedCity, 'i'));
      if (match && match[1]) {
        const found = match[1].trim();
        if (found.length > 1 && !found.toLowerCase().includes('comprar') && !found.toLowerCase().includes('vender') && !found.toLowerCase().includes('venda') && !found.toLowerCase().includes('alugar')) {
          return found;
        }
      }
    }

    if (city && uf) {
      const ufSlug = slugify(uf);
      const matchSlug = slug.match(new RegExp('-(.+?)-' + citySlug + '-' + ufSlug, 'i'));
      if (matchSlug && matchSlug[1]) {
        let rawNb = matchSlug[1];
        rawNb = rawNb.replace(/^(?:venda|aluguel)-(?:apartamento|casa|cobertura|imovel|kitnet|flat|studio)(?:-\d+-quartos)?/i, '');
        rawNb = rawNb.replace(/^-com-(?:piscina|churrasqueira|garagem|varanda|suite|elevador|seguranca-interna|interfone|cozinha-americana|area-de-servico|infraestrutura-internet|copa|academia|sacada|portaria-24-horas|ar-condicionado|vista-panoramica|playground|quadra)[a-z0-9-]*/i, '');
        rawNb = rawNb.replace(/^-(?:mobiliado|reformado|novo|decorado|duplex|triplex)/i, '');
        rawNb = rawNb.replace(/-(?:apartamento|casa|imovel)(?:-\d+-quartos)?$/i, '');
        rawNb = rawNb.replace(/^-+|-+$/g, '');
        const words = rawNb.split('-').filter(Boolean);
        if (words.length > 0) {
          return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
      }
    }

    return '-';
  }

  function cleanAddress(street) {
    if (!street || typeof street !== 'string') return '-';
    const trimmed = street.trim();
    if (!trimmed || trimmed.length < 3) return '-';
    const lower = trimmed.toLowerCase();
    if (lower.startsWith('apartamento') || lower.startsWith('casa para') || lower.startsWith('imovel em') || lower.includes('quartos') || trimmed.length > 100) {
      return '-';
    }
    return trimmed;
  }

  function cleanDescription(desc) {
    if (!desc || typeof desc !== 'string') return '';
    let text = desc;
    text = text.replace(/<br\s*[\/]?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n\n');
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&nbsp;/gi, ' ');
    text = text.replace(/&amp;/gi, '&');
    text = text.replace(/&lt;/gi, '<');
    text = text.replace(/&gt;/gi, '>');
    text = text.replace(/&quot;/gi, '"');
    text = text.replace(/&#39;/g, "'");
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    text = text.replace(/\n{3,}/g, '\n\n');
    return text.trim();
  }

  async function fetchDirectZapPage(targetUrl) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      return await response.text();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  function extractDetailsFromPageHtml(html) {
    let description = '';
    let images = [];

    const scriptRegex = /<script type="application\/ld\+json">(.*?)<\/script>/gis;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
      try {
        const data = JSON.parse(match[1].trim());
        let rawList = [];
        if (Array.isArray(data)) rawList = data;
        else if (typeof data === 'object' && data !== null) {
          if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) rawList = data.itemListElement;
          else rawList = [data];
        }
        for (const it of rawList) {
          const prod = it.item || it;
          if (prod && typeof prod === 'object') {
            const cleanDesc = cleanDescription(prod.description);
            if (cleanDesc && cleanDesc.length > description.length) {
              description = cleanDesc;
            }
            if (prod.image) {
              const list = Array.isArray(prod.image) ? prod.image : [prod.image];
              list.forEach(img => {
                if (typeof img === 'string' && img.startsWith('http') && !images.includes(img)) {
                  images.push(img);
                }
              });
            }
          }
        }
      } catch (e) {}
    }

    if (!description) {
      const descMatch = html.match(/<div[^>]*data-cy="rp-description-txt"[^>]*>([\s\S]*?)<\/div>/i) ||
                        html.match(/<p[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
      if (descMatch) {
        description = cleanDescription(descMatch[1]);
      }
    }

    const htmlImgMatches = [...html.matchAll(/<img[^>]*src=["'](https:\/\/resizedimgs\.zapimoveis\.com\.br\/[^"']+)["']/gi)];
    htmlImgMatches.forEach(m => {
      const cleanUrl = m[1].replace(/&amp;/g, '&');
      if (!images.includes(cleanUrl)) {
        images.push(cleanUrl);
      }
    });

    return { description: cleanDescription(description), images };
  }

  async function loadItemFullDetails(item, onLoaded) {
    if (item.fullDetailsLoaded || !item.url) return;
    try {
      const pageHtml = await fetchDirectZapPage(item.url);
      const details = extractDetailsFromPageHtml(pageHtml);
      if (details.description && (!item.description || details.description.length > item.description.length)) {
        item.description = cleanDescription(details.description);
      }
      if (details.images && details.images.length > 0) {
        const combined = [...(item.images || [])];
        details.images.forEach(img => {
          if (!combined.includes(img)) combined.push(img);
        });
        item.images = combined;
      }
      item.fullDetailsLoaded = true;
      if (onLoaded) onLoaded();
    } catch (err) {}
  }

  function parseListingsFromHtml(html) {
    const items = [];
    const cardFeesMap = {};

    const cardRegex = /<a\b[^>]*href=["']([^"']*?imovel[^"']*?-id-(\d+)[^"']*?)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let cardMatch;
    while ((cardMatch = cardRegex.exec(html)) !== null) {
      const id = cardMatch[2];
      const cardBody = cardMatch[3];
      let condo = null;
      let iptu = null;
      const condM = cardBody.match(/Cond\.\s*(?:R\$\s*([\d\.,]+)|(isento))/i);
      if (condM) {
        condo = condM[1] || condM[2];
      }
      const iptuM = cardBody.match(/IPTU\s*(?:R\$\s*([\d\.,]+)|(isento))/i);
      if (iptuM) {
        iptu = iptuM[1] || iptuM[2];
      }
      cardFeesMap[id] = { condo, iptu };
    }

    const priceBlocks = [
      ...html.matchAll(/(?:"id"|\\"id\\"):"?(\d{8,12})"?.*?"prices":\{"rental":(?:null|\{[^\}]*\}),"sale":\{([^}]*)\}/gi),
      ...html.matchAll(/\\"id\\":\\"(\d{8,12})\\".*?\\"prices\\":\{\\"rental\\":(?:null|\{[^\}]*\}),\\"sale\\":\{([^}]*)\}/gi)
    ];
    for (const pb of priceBlocks) {
      const id = pb[1];
      const saleObjStr = pb[2];
      const iptuM = saleObjStr.match(/(?:"|\\")iptu(?:"|\\"):([0-9\.]+)/);
      const condoM = saleObjStr.match(/(?:"|\\")condominium(?:"|\\"):([0-9\.]+)/);

      if (!cardFeesMap[id]) {
        cardFeesMap[id] = {};
      }
      if (cardFeesMap[id].iptu === undefined || cardFeesMap[id].iptu === null) {
        if (iptuM) cardFeesMap[id].iptu = parseFloat(iptuM[1]);
      }
      if (cardFeesMap[id].condo === undefined || cardFeesMap[id].condo === null) {
        if (condoM) cardFeesMap[id].condo = parseFloat(condoM[1]);
      }
    }

    const scriptRegex = /<script type="application\/ld\+json">(.*?)<\/script>/gis;
    let match;

    while ((match = scriptRegex.exec(html)) !== null) {
      try {
        const jsonContent = match[1].trim();
        const data = JSON.parse(jsonContent);

        let rawList = [];
        if (Array.isArray(data)) {
          rawList = data.map(d => (typeof d === 'object' ? { item: d } : null)).filter(Boolean);
        } else if (typeof data === 'object' && data !== null) {
          if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
            rawList = data.itemListElement;
          } else if (['Apartment', 'Product', 'RealEstateListing', 'SingleFamilyResidence'].includes(data['@type'])) {
            rawList = [{ item: data }];
          }
        }

        for (const it of rawList) {
          const prod = it.item || it;
          if (!prod || typeof prod !== 'object') continue;

          const url = prod.url || '';
          if (!url || !url.includes('imovel')) continue;

          let price = null;
          if (prod.offers) {
            price = typeof prod.offers === 'object' ? prod.offers.price : prod.offers;
          }

          const rawId = (prod['@id'] || url.split('-id-').pop() || '').replace(/\D/g, '');
          let condo = cardFeesMap[rawId] ? cardFeesMap[rawId].condo : null;
          let iptu = cardFeesMap[rawId] ? cardFeesMap[rawId].iptu : null;

          if (!condo && prod.offers && prod.offers.additionalProperty) {
            const apList = Array.isArray(prod.offers.additionalProperty) ? prod.offers.additionalProperty : [prod.offers.additionalProperty];
            apList.forEach(ap => {
              if (ap && ap.name && ap.name.toLowerCase().includes('condominium') && ap.value) {
                condo = ap.value;
              }
              if (ap && ap.name && ap.name.toLowerCase().includes('iptu') && ap.value) {
                iptu = ap.value;
              }
            });
          }

          if (!condo && prod.additionalProperty) {
            const apList = Array.isArray(prod.additionalProperty) ? prod.additionalProperty : [prod.additionalProperty];
            apList.forEach(ap => {
              if (ap && ap.name && ap.name.toLowerCase().includes('condominium') && ap.value) {
                condo = ap.value;
              }
              if (ap && ap.name && ap.name.toLowerCase().includes('iptu') && ap.value) {
                iptu = ap.value;
              }
            });
          }

          const bathrooms = prod.numberOfBathroomsTotal || prod.numberOfBathrooms || null;
          const bedrooms = prod.numberOfBedroomsTotal || prod.numberOfRooms || null;
          const floorSize = prod.floorSize && typeof prod.floorSize === 'object' ? prod.floorSize.value : null;

          let street = '';
          if (prod.address) {
            street = typeof prod.address === 'object' ? prod.address.streetAddress || '' : '';
          }

          const description = cleanDescription(prod.description || '');

          let images = [];
          if (prod.image) {
            if (Array.isArray(prod.image)) {
              images = prod.image;
            } else if (typeof prod.image === 'string') {
              images = [prod.image];
            }
          }

          items.push({
            id: prod['@id'] || url,
            title: prod.name || '',
            url: url.split('?')[0],
            price: price ? parseFloat(price) : null,
            condo: condo,
            iptu: iptu,
            bathrooms: bathrooms ? parseInt(bathrooms, 10) : null,
            bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
            area_m2: floorSize ? parseFloat(floorSize) : null,
            street: street,
            description: description,
            images: images
          });
        }
      } catch (e) {
      }
    }

    return items;
  }

  async function executeSearch() {
    if (isSearching) return;

    const uf = (currentSelectedUf || DEFAULT_UF).trim();
    const city = (currentSelectedCity || DEFAULT_CITY).trim();
    const rawNeighborhoods = inputNeighborhoods.value.trim();
    const minBedrooms = parseInt(selectBedrooms.value, 10) || 1;
    const minBathrooms = parseInt(selectBathrooms.value, 10) || 1;
    const minPrice = parseCurrencyInputToNumber(inputMinPrice.value);
    const maxPrice = parseCurrencyInputToNumber(inputMaxPrice.value) || 999999999;

    if (!city) {
      alert('Por favor, selecione uma cidade.');
      return;
    }

    const citySlug = slugify(city);
    const stateSlug = slugify(uf);

    const targetNeighborhoods = rawNeighborhoods
      ? rawNeighborhoods.split(',').map(n => n.trim()).filter(Boolean)
      : [];
    const targetMap = {};
    targetNeighborhoods.forEach(n => {
      targetMap[normalizeText(n)] = n;
    });

    setSearchingState(true);
    currentResults = [];
    currentSort = { field: null, direction: 'asc' };
    updateSortIcons();
    resultsTbody.innerHTML = '';
    if (resultsCards) resultsCards.innerHTML = '';
    emptyState.style.display = 'none';
    if (tableWrapper) tableWrapper.style.display = 'none';
    if (resultsTable) resultsTable.style.display = 'none';
    if (resultsCards) resultsCards.style.display = 'none';
    resultsSummary.style.display = 'none';

    updateStatus(`Iniciando busca para ${city} (${uf.toUpperCase()})...`, 'Consultando anúncios do Zap Imóveis');

    try {
      const bathQuery = [];
      for (let b = minBathrooms; b <= 5; b++) bathQuery.push(b);
      const bathParam = bathQuery.join('%2C');

      const collectedListings = new Map();
      let page = 1;
      const maxPagesToScrape = 12;
      let shouldStop = false;

      while (page <= maxPagesToScrape && !shouldStop) {
        updateStatus(`Buscando página ${page} no Zap Imóveis...`, `${collectedListings.size} anúncios coletados até agora`);

        const targetUrl = `https://www.zapimoveis.com.br/venda/apartamentos/${stateSlug}+${citySlug}/?banheiros=${bathParam}&ordem=LOWEST_PRICE&pagina=${page}`;

        const html = await fetchDirectZapPage(targetUrl);

        const items = parseListingsFromHtml(html);

        if (!items || items.length === 0) {
          break;
        }

        const validPrices = items.map(it => it.price).filter(p => p !== null && !isNaN(p));
        if (validPrices.length > 0 && Math.min(...validPrices) > maxPrice) {
          shouldStop = true;
        }

        let newItemsInThisPage = 0;
        for (const item of items) {
          if (!collectedListings.has(item.url)) {
            collectedListings.set(item.url, item);
            newItemsInThisPage++;
          }
        }

        if (newItemsInThisPage === 0) {
          break;
        }

        page++;
        await new Promise(r => setTimeout(r, 200));
      }

      updateStatus('Processando anúncios encontrados...', 'Formatando valores e organizando resultados');

      const processedResults = [];

      for (const [url, item] of collectedListings.entries()) {
        const price = item.price;
        if (price !== null && price > maxPrice) continue;
        if (minPrice !== null && price !== null && price < minPrice) continue;

        const detectedNeighborhood = detectNeighborhood(url, item.title, item.images, city, uf, targetMap, targetNeighborhoods);
        if (targetNeighborhoods.length > 0 && !detectedNeighborhood) {
          continue;
        }

        const formattedPrice = price
          ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : '-';

        const formattedCondo = formatFee(item.condo);
        const formattedIptu = formatFee(item.iptu);
        const formattedArea = item.area_m2 ? `${item.area_m2} m²` : '-';

        processedResults.push({
          neighborhood: detectedNeighborhood || '-',
          address: cleanAddress(item.street),
          price: formattedPrice,
          rawPrice: price,
          size: formattedArea,
          rawSize: item.area_m2 || 0,
          condo: formattedCondo,
          iptu: formattedIptu,
          url: url,
          title: item.title || '',
          description: item.description || '',
          images: item.images || [],
          fullDetailsLoaded: false
        });
      }

      processedResults.sort((a, b) => (a.rawPrice || 0) - (b.rawPrice || 0));
      currentResults = processedResults;

      renderResults();

      resultsCount.textContent = currentResults.length !== 1 ? `${currentResults.length} imóveis encontrados` : `${currentResults.length} imóvel encontrado`;
      filterAppliedInfo.textContent = `UF: ${uf} | Cidade: ${city} | Max: ${inputMaxPrice.value || 'Sem limite'}`;
      resultsSummary.style.display = 'flex';
      btnExport.disabled = currentResults.length === 0;

      if (currentResults.length === 0) {
        showEmptyState('no-results');
      }

    } catch (error) {
      if (error && (error.name === 'TypeError' || error.message.includes('fetch') || error.message.includes('CORS') || error.message.includes('aborted') || error.message.includes('Failed to fetch'))) {
        showEmptyState('cors-error');
      } else {
        showEmptyState('error', error.message || 'Verifique se a extensão CORS está ativa e tente novamente.');
      }
    } finally {
      setSearchingState(false);
    }
  }

  function handleSort(field) {
    if (!currentResults || currentResults.length === 0) return;

    if (currentSort.field === field) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.field = field;
      currentSort.direction = 'asc';
    }

    const dir = currentSort.direction === 'asc' ? 1 : -1;

    currentResults.sort((a, b) => {
      if (field === 'neighborhood') {
        const nameA = a.neighborhood || '';
        const nameB = b.neighborhood || '';
        return dir * nameA.localeCompare(nameB, 'pt-BR', { sensitivity: 'base' });
      } else if (field === 'price') {
        const valA = a.rawPrice ?? (dir === 1 ? Infinity : -Infinity);
        const valB = b.rawPrice ?? (dir === 1 ? Infinity : -Infinity);
        return dir * (valA - valB);
      } else if (field === 'size') {
        const sizeA = a.rawSize ?? (parseFloat(a.size) || (dir === 1 ? Infinity : -Infinity));
        const sizeB = b.rawSize ?? (parseFloat(b.size) || (dir === 1 ? Infinity : -Infinity));
        return dir * (sizeA - sizeB);
      }
      return 0;
    });

    updateSortIcons();
    renderResults();
  }

  function updateSortIcons() {
    const fields = ['neighborhood', 'price', 'size'];

    fields.forEach(field => {
      const icon = document.getElementById(`sort-icon-${field}`);
      const th = document.querySelector(`th[data-sort="${field}"]`);

      if (th) {
        th.classList.remove('sorted-asc', 'sorted-desc');
      }

      if (icon) {
        if (currentSort.field === field) {
          if (currentSort.direction === 'asc') {
            icon.textContent = '▲';
            if (th) th.classList.add('sorted-asc');
          } else {
            icon.textContent = '▼';
            if (th) th.classList.add('sorted-desc');
          }
        } else {
          icon.textContent = '⇅';
        }
      }
    });
  }

  function renderResults() {
    if (!currentResults || currentResults.length === 0) {
      if (tableWrapper) tableWrapper.style.display = 'none';
      if (resultsTable) resultsTable.style.display = 'none';
      if (resultsCards) resultsCards.style.display = 'none';
      return;
    }

    const mode = selectViewMode ? selectViewMode.value : 'compact';
    if (mode === 'complete') {
      if (tableWrapper) tableWrapper.style.display = 'none';
      if (resultsTable) resultsTable.style.display = 'none';
      if (resultsCards) resultsCards.style.display = 'flex';
      renderCards(currentResults);
    } else {
      if (resultsCards) resultsCards.style.display = 'none';
      if (tableWrapper) tableWrapper.style.display = 'block';
      if (resultsTable) resultsTable.style.display = 'table';
      renderTable(currentResults);
    }
  }

  function renderTable(results) {
    if (!results || results.length === 0) {
      if (tableWrapper) tableWrapper.style.display = 'none';
      if (resultsTable) resultsTable.style.display = 'none';
      return;
    }

    resultsTbody.innerHTML = '';

    results.forEach(item => {
      let rowNode = null;
      if (rowTemplate && rowTemplate.content) {
        rowNode = rowTemplate.content.cloneNode(true);
        rowNode.querySelector('.cell-neighborhood').textContent = item.neighborhood;
        rowNode.querySelector('.cell-address').textContent = item.address;
        rowNode.querySelector('.cell-price').textContent = item.price;
        rowNode.querySelector('.cell-area').textContent = item.size;
        rowNode.querySelector('.cell-condo').textContent = item.condo;
        rowNode.querySelector('.cell-iptu').textContent = item.iptu;

        const linkEl = rowNode.querySelector('.btn-table-link');
        linkEl.href = item.url;
        resultsTbody.appendChild(rowNode);
      } else {
        const tr = document.createElement('tr');
        const tdNb = document.createElement('td');
        tdNb.className = 'cell-neighborhood';
        tdNb.textContent = item.neighborhood;
        tr.appendChild(tdNb);

        const tdAddr = document.createElement('td');
        tdAddr.className = 'cell-address';
        tdAddr.textContent = item.address;
        tr.appendChild(tdAddr);

        const tdPrice = document.createElement('td');
        tdPrice.className = 'cell-price';
        tdPrice.textContent = item.price;
        tr.appendChild(tdPrice);

        const tdArea = document.createElement('td');
        tdArea.className = 'cell-area';
        tdArea.textContent = item.size;
        tr.appendChild(tdArea);

        const tdCondo = document.createElement('td');
        tdCondo.className = 'cell-condo';
        tdCondo.textContent = item.condo;
        tr.appendChild(tdCondo);

        const tdIptu = document.createElement('td');
        tdIptu.className = 'cell-iptu';
        tdIptu.textContent = item.iptu;
        tr.appendChild(tdIptu);

        const tdLink = document.createElement('td');
        const aLink = document.createElement('a');
        aLink.className = 'btn-table-link';
        aLink.target = '_blank';
        aLink.rel = 'noopener noreferrer';
        aLink.href = item.url;
        aLink.textContent = 'Ver Anúncio ↗';
        tdLink.appendChild(aLink);
        tr.appendChild(tdLink);

        resultsTbody.appendChild(tr);
      }
    });

    if (tableWrapper) tableWrapper.style.display = 'block';
    if (resultsTable) resultsTable.style.display = 'table';
  }

  function renderCards(results) {
    if (!resultsCards) return;
    resultsCards.innerHTML = '';

    results.forEach(item => {
      if (!cardTemplate || !cardTemplate.content) return;
      const cardNode = cardTemplate.content.cloneNode(true);

      const nbEl = cardNode.querySelector('.card-cell-neighborhood');
      const addrEl = cardNode.querySelector('.card-cell-address');
      const priceEl = cardNode.querySelector('.card-cell-price');
      const areaEl = cardNode.querySelector('.card-cell-area');
      const condoEl = cardNode.querySelector('.card-cell-condo');
      const iptuEl = cardNode.querySelector('.card-cell-iptu');
      const linkEl = cardNode.querySelector('.card-link');

      if (nbEl) nbEl.textContent = item.neighborhood;
      if (addrEl) addrEl.textContent = item.address;
      if (priceEl) priceEl.textContent = item.price;
      if (areaEl) areaEl.textContent = item.size;
      if (condoEl) condoEl.textContent = item.condo;
      if (iptuEl) iptuEl.textContent = item.iptu;
      if (linkEl) linkEl.href = item.url;

      const descEl = cardNode.querySelector('.card-description-text');
      const toggleBtn = cardNode.querySelector('.btn-toggle-description');

      function updateDescriptionUI() {
        if (!descEl) return;
        const text = item.description || '-';
        descEl.textContent = text;
        if (toggleBtn) {
          if (text && text !== '-' && (text.length > 220 || text.split('\n').length > 5)) {
            toggleBtn.style.display = 'inline-block';
            toggleBtn.textContent = descEl.classList.contains('card-description-collapsed') ? 'Ver mais' : 'Ver menos';
          } else {
            toggleBtn.style.display = 'none';
          }
        }
      }

      if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
          if (!descEl) return;
          const isCollapsed = descEl.classList.toggle('card-description-collapsed');
          this.textContent = isCollapsed ? 'Ver mais' : 'Ver menos';
        });
      }

      updateDescriptionUI();

      const imgEl = cardNode.querySelector('.card-carousel-img');
      const counterEl = cardNode.querySelector('.card-carousel-counter');
      const prevBtn = cardNode.querySelector('.btn-carousel-prev');
      const nextBtn = cardNode.querySelector('.btn-carousel-next');
      const imgBox = cardNode.querySelector('.card-carousel-image-box');

      let currentImgIndex = 0;

      function updateCarouselUI() {
        const list = item.images && item.images.length > 0 ? item.images : [];
        if (list.length > 0) {
          if (currentImgIndex >= list.length) currentImgIndex = 0;
          if (currentImgIndex < 0) currentImgIndex = list.length - 1;
          if (imgEl) imgEl.src = list[currentImgIndex];
          if (counterEl) counterEl.textContent = `${currentImgIndex + 1} / ${list.length}`;
          if (prevBtn) prevBtn.disabled = list.length <= 1;
          if (nextBtn) nextBtn.disabled = list.length <= 1;
        } else {
          if (imgEl) imgEl.src = 'img/favicon.ico';
          if (counterEl) counterEl.textContent = '-';
          if (prevBtn) prevBtn.disabled = true;
          if (nextBtn) nextBtn.disabled = true;
        }
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          const list = item.images && item.images.length > 0 ? item.images : [];
          if (list.length > 1) {
            currentImgIndex = (currentImgIndex - 1 + list.length) % list.length;
            updateCarouselUI();
          }
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          const list = item.images && item.images.length > 0 ? item.images : [];
          if (list.length > 1) {
            currentImgIndex = (currentImgIndex + 1) % list.length;
            updateCarouselUI();
          }
        });
      }

      if (imgBox) {
        imgBox.addEventListener('click', function () {
          const list = item.images && item.images.length > 0 ? item.images : [];
          if (list.length > 0) {
            openOverlayImage(list[currentImgIndex]);
          }
        });
      }

      updateCarouselUI();

      if (!item.fullDetailsLoaded) {
        loadItemFullDetails(item, function () {
          updateCarouselUI();
          updateDescriptionUI();
        });
      }

      resultsCards.appendChild(cardNode);
    });
  }

  function exportToCsv() {
    if (!currentResults || currentResults.length === 0) {
      alert('Não há dados disponíveis para exportação.');
      return;
    }

    const headers = ['Bairro', 'Endereço', 'Valor', 'Tamanho', 'Condomínio', 'IPTU', 'Link'];
    const rows = currentResults.map(item => [
      `"${(item.neighborhood || '').replace(/"/g, '""')}"`,
      `"${(item.address || '').replace(/"/g, '""')}"`,
      `"${(item.price || '').replace(/"/g, '""')}"`,
      `"${(item.size || '').replace(/"/g, '""')}"`,
      `"${(item.condo || '').replace(/"/g, '""')}"`,
      `"${(item.iptu || '').replace(/"/g, '""')}"`,
      `"${(item.url || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(';'),
      ...rows.map(r => r.join(';'))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const currentCity = currentSelectedCity || 'imoveis';
    const cityName = slugify(currentCity);
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `zap_imoveis_${cityName}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function setSearchingState(active) {
    isSearching = active;
    btnSearch.disabled = active;
    btnExport.disabled = active || currentResults.length === 0;
    inputNeighborhoods.disabled = active;
    selectBedrooms.disabled = active;
    selectBathrooms.disabled = active;
    inputMinPrice.disabled = active;
    inputMaxPrice.disabled = active;
    if (selectViewMode) selectViewMode.disabled = active;

    if (ufSelectTrigger) ufSelectTrigger.style.pointerEvents = active ? 'none' : 'auto';
    if (citySelectTrigger) citySelectTrigger.style.pointerEvents = active ? 'none' : 'auto';

    statusContainer.style.display = active ? 'flex' : 'none';
  }

  function updateStatus(message, details) {
    if (statusMessage) statusMessage.textContent = message;
    if (statusDetails) statusDetails.textContent = details || '';
  }

  function init() {
    initLocations();
    setupCurrencyInput(inputMinPrice, DEFAULT_MIN_PRICE);
    setupCurrencyInput(inputMaxPrice, DEFAULT_MAX_PRICE);

    btnSearch.addEventListener('click', executeSearch);
    btnExport.addEventListener('click', exportToCsv);

    if (selectViewMode) {
      selectViewMode.addEventListener('change', function () {
        if (currentResults && currentResults.length > 0) {
          renderResults();
        }
      });
    }

    if (agencyGalleryOverlay) {
      agencyGalleryOverlay.addEventListener('click', closeOverlayImage);
    }

    document.querySelectorAll('.th-sortable').forEach(th => {
      th.addEventListener('click', function () {
        const field = this.getAttribute('data-sort');
        if (field) handleSort(field);
      });
    });

    document.getElementById('search-form').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
