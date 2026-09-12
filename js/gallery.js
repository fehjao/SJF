const galleryGrid = document.getElementById('gallery-grid');
const galleryOverlay = document.getElementById('gallery-overlay');
const galleryOverlayImage = document.getElementById('gallery-overlay-image');

function openImage(src) {
  galleryOverlayImage.src = src;
  galleryOverlay.classList.add('open');
}

function closeImage() {
  galleryOverlay.classList.remove('open');
}

function buildGallery() {
  galleryImages.reverse();
  for (let i = 0; i < galleryImages.length; i++) {
    const src = galleryImages[i];

    const thumb = document.createElement('img');
    thumb.src = 'img/' + src;
    thumb.alt = 'Foto ' + (i + 1);
    thumb.classList.add('gallery-thumb');

    thumb.addEventListener('click', function () {
      openImage('img/' + src);
    });

    galleryGrid.appendChild(thumb);
  }
}

galleryOverlay.addEventListener('click', closeImage);

buildGallery();