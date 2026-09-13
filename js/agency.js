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

  const btnSearch = document.getElementById('btn-search');
  const btnExport = document.getElementById('btn-export');
  const btnExtension = document.getElementById('btn-extension');

  const statusContainer = document.getElementById('status-container');
  const statusMessage = document.getElementById('status-message');
  const statusDetails = document.getElementById('status-details');

  const resultsSummary = document.getElementById('results-summary');
  const resultsCount = document.getElementById('results-count');
  const filterAppliedInfo = document.getElementById('filter-applied-info');

  const resultsTable = document.getElementById('results-table');
  const resultsTbody = document.getElementById('results-tbody');
  const rowTemplate = document.getElementById('row-template');

  const emptyState = document.getElementById('empty-state');
  const stateInitial = document.getElementById('state-initial');
  const stateNoResults = document.getElementById('state-no-results');
  const stateCorsError = document.getElementById('state-cors-error');
  const stateGenericError = document.getElementById('state-generic-error');
  const errorMessageText = document.getElementById('error-message-text');

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
      if (e.key === 'Escape') closeAllSelects();
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

  function analyzeHighlights(text) {
    const norm = normalizeText(text);
    const tags = [];

    const kitchenKeywords = [
      'cozinha planejada',
      'armarios na cozinha',
      'armario na cozinha',
      'cozinha com armarios',
      'moveis planejados na cozinha',
      'cozinha modulada',
      'planejados na cozinha',
      'planejada na cozinha'
    ];
    if (kitchenKeywords.some(k => norm.includes(k)) || (norm.includes('planejad') && norm.includes('cozinha'))) {
      tags.push({ key: 'kitchen', label: 'Cozinha planejada', class: 'badge-kitchen' });
    }

    const waterKeywords = [
      'agua inclusa',
      'agua inclusa no condominio',
      'incluso agua',
      'taxa de condominio inclui agua',
      'condominio inclui agua',
      'condominio com agua inclusa',
      'agua inclusos',
      'inclusa agua'
    ];
    if (waterKeywords.some(k => norm.includes(k))) {
      tags.push({ key: 'water', label: 'Água inclusa', class: 'badge-water' });
    }

    const gasKeywords = [
      'gas incluso',
      'gas incluso no condominio',
      'incluso gas',
      'taxa de condominio inclui gas',
      'condominio inclui gas',
      'condominio com gas incluso',
      'gas canalizado incluso'
    ];
    if (gasKeywords.some(k => norm.includes(k))) {
      tags.push({ key: 'gas', label: 'Gás incluso', class: 'badge-gas' });
    }

    return tags;
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

    return '?';
  }

  function cleanAddress(street) {
    if (!street || typeof street !== 'string') return '?';
    const trimmed = street.trim();
    if (!trimmed || trimmed.length < 3) return '?';
    const lower = trimmed.toLowerCase();
    if (lower.startsWith('apartamento') || lower.startsWith('casa para') || lower.startsWith('imovel em') || lower.includes('quartos') || trimmed.length > 100) {
      return '?';
    }
    return trimmed;
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

  function parseListingsFromHtml(html) {
    const items = [];
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

          let condo = null;
          if (prod.additionalProperty) {
            if (Array.isArray(prod.additionalProperty)) {
              for (const ap of prod.additionalProperty) {
                if (ap && ['Condominium Fee', 'condominio', 'taxa de condominio'].includes(ap.name)) {
                  condo = ap.value;
                }
              }
            } else if (typeof prod.additionalProperty === 'object') {
              condo = prod.additionalProperty.value;
            }
          }

          const bathrooms = prod.numberOfBathroomsTotal || prod.numberOfBathrooms || null;
          const bedrooms = prod.numberOfBedroomsTotal || prod.numberOfRooms || null;
          const floorSize = prod.floorSize && typeof prod.floorSize === 'object' ? prod.floorSize.value : null;

          let street = '';
          if (prod.address) {
            street = typeof prod.address === 'object' ? prod.address.streetAddress || '' : '';
          }

          const description = prod.description || '';

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
            condo: condo ? parseFloat(condo) : null,
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
    emptyState.style.display = 'none';
    resultsTable.style.display = 'none';
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

      updateStatus('Analisando descrições e aplicando filtros...', 'Identificando cozinha planejada, água e gás inclusos');

      const processedResults = [];

      for (const [url, item] of collectedListings.entries()) {
        const price = item.price;
        if (price !== null && price > maxPrice) continue;
        if (minPrice !== null && price !== null && price < minPrice) continue;

        const detectedNeighborhood = detectNeighborhood(url, item.title, item.images, city, uf, targetMap, targetNeighborhoods);
        if (targetNeighborhoods.length > 0 && !detectedNeighborhood) {
          continue;
        }

        const highlights = analyzeHighlights(`${item.title} ${item.description}`);

        const formattedPrice = price
          ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : '?';

        const formattedCondo = item.condo
          ? item.condo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
          : '?';

        const formattedArea = item.area_m2 ? `${item.area_m2} m²` : '?';

        processedResults.push({
          neighborhood: detectedNeighborhood || '?',
          address: cleanAddress(item.street),
          price: formattedPrice,
          rawPrice: price,
          size: formattedArea,
          rawSize: item.area_m2 || 0,
          condo: formattedCondo,
          highlights: highlights,
          highlightsText: highlights.length > 0 ? highlights.map(h => h.label).join(', ') : '-',
          url: url
        });
      }

      processedResults.sort((a, b) => (a.rawPrice || 0) - (b.rawPrice || 0));
      currentResults = processedResults;

      renderTable(currentResults);

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
    renderTable(currentResults);
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

  function renderTable(results) {
    if (!results || results.length === 0) {
      resultsTable.style.display = 'none';
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

        const badgesContainer = rowNode.querySelector('.badges-container');
        if (item.highlights && item.highlights.length > 0) {
          item.highlights.forEach(h => {
            const badgeSpan = document.createElement('span');
            badgeSpan.className = 'badge ' + h.class;
            badgeSpan.textContent = h.label;
            badgesContainer.appendChild(badgeSpan);
          });
        } else {
          const badgeNone = document.createElement('span');
          badgeNone.className = 'badge-none';
          badgeNone.textContent = '-';
          badgesContainer.appendChild(badgeNone);
        }

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

        const tdDesc = document.createElement('td');
        const badgesDiv = document.createElement('div');
        badgesDiv.className = 'badges-container';
        if (item.highlights && item.highlights.length > 0) {
          item.highlights.forEach(h => {
            const bSpan = document.createElement('span');
            bSpan.className = 'badge ' + h.class;
            bSpan.textContent = h.label;
            badgesDiv.appendChild(bSpan);
          });
        } else {
          const bNone = document.createElement('span');
          bNone.className = 'badge-none';
          bNone.textContent = '-';
          badgesDiv.appendChild(bNone);
        }
        tdDesc.appendChild(badgesDiv);
        tr.appendChild(tdDesc);

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

    resultsTable.style.display = 'table';
  }

  function exportToCsv() {
    if (!currentResults || currentResults.length === 0) {
      alert('Não há dados disponíveis para exportação.');
      return;
    }

    const headers = ['Bairro', 'Endereço', 'Valor', 'Tamanho', 'Condomínio', 'Descrição', 'Link'];
    const rows = currentResults.map(item => [
      `"${(item.neighborhood || '').replace(/"/g, '""')}"`,
      `"${(item.address || '').replace(/"/g, '""')}"`,
      `"${(item.price || '').replace(/"/g, '""')}"`,
      `"${(item.size || '').replace(/"/g, '""')}"`,
      `"${(item.condo || '').replace(/"/g, '""')}"`,
      `"${(item.highlightsText || '-').replace(/"/g, '""')}"`,
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
