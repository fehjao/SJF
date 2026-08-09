function buildHeader() {
  const headerContainer = document.getElementById('site-header-container');

  headerContainer.innerHTML = `
    <header class="site-header">
      <div class="header-left">
        <a href="home.html" class="site-logo">SJF</a>
        <span class="site-subtitle">Serviços de João para Fernanda</span>
      </div>
      <img src="img/heart.png" alt="Coração" class="header-icon">
    </header>
  `;
}

function buildMenu() {
  const menuContainer = document.getElementById('site-menu-container');

  menuContainer.innerHTML = `
    <nav class="site-menu">
      <ul class="menu-list">
        <li class="menu-item"><a href="home.html" class="menu-link">Início</a></li>
        <li class="menu-item"><a href="faq.html" class="menu-link">FAQ</a></li>
        <li class="menu-item"><a href="gallery.html" class="menu-link">Galeria</a></li>
        <li class="menu-item"><a href="day.html" class="menu-link">23/05</a></li>
        <li class="menu-item"><a href="lessons.html" class="menu-link">Lições</a></li>
        <li class="menu-item"><a href="memorial.html" class="menu-link">Memorial</a></li>
      </ul>
    </nav>
  `;
}

function buildFooter() {
  const footerContainer = document.getElementById('site-footer-container');

  footerContainer.innerHTML = `
    <footer class="site-footer">
      <p class="footer-text">2026 - Todos os Direitos Reservados para João e Fernanda</p>
    </footer>
  `;
}

function highlightActiveMenuItem() {
  const currentPage = window.location.pathname.split('/').pop();
  const menuLinks = document.querySelectorAll('.menu-link');

  menuLinks.forEach(function (link) {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}

buildHeader();
buildMenu();
buildFooter();
highlightActiveMenuItem();