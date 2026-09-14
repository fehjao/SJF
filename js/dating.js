document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carousel-track');
  const captionEl = document.getElementById('carousel-caption');
  const indicatorsEl = document.getElementById('carousel-indicators');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const card = document.getElementById('carousel-card');

  if (!track || typeof datingData === 'undefined' || !Array.isArray(datingData)) {
    return;
  }

  if (datingData.length === 0) {
    if (card) {
      card.innerHTML = '<p class="carousel-empty-message">Nenhuma foto adicionada ainda.</p>';
    }
    return;
  }

  let currentIndex = 0;

  // Gerar Slides
  datingData.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.text || `Foto ${index + 1}`;
    img.className = 'carousel-image';
    
    // Tratamento caso a imagem ainda não exista ou dê erro
    img.onerror = function() {
      this.src = 'img/favicon.ico';
      this.style.objectFit = 'contain';
      this.style.padding = '40px';
    };

    slide.appendChild(img);
    track.appendChild(slide);
  });

  // Gerar Indicadores (Dots)
  if (indicatorsEl && datingData.length > 1) {
    datingData.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      indicatorsEl.appendChild(dot);
    });
  }

  // Esconder botões se houver apenas 1 imagem
  if (datingData.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (indicatorsEl) indicatorsEl.style.display = 'none';
  }

  function updateCaption(index) {
    if (!captionEl) return;
    captionEl.style.opacity = '0';
    setTimeout(() => {
      captionEl.textContent = datingData[index]?.text || '';
      captionEl.style.opacity = '1';
    }, 150);
  }

  function updateDots(index) {
    if (!indicatorsEl) return;
    const dots = indicatorsEl.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = datingData.length - 1;
    } else if (index >= datingData.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateCaption(currentIndex);
    updateDots(currentIndex);
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Inicializar primeira legenda
  updateCaption(0);

  // Navegação por teclado (Setas Esquerda e Direita)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  // Suporte a swipe em telas sensíveis ao toque
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }
});
