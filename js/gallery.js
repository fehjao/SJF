const galleryImages = [
  'gallery/p1.png',
  'gallery/p2.png',
  'gallery/p3.png',
  'gallery/p4.png',
  'gallery/p5.png',
  'gallery/p6.png',
  'gallery/p7.png',
  'gallery/p8.png',
  'gallery/p9.png',
  'gallery/p10.png',
  'gallery/p11.png',
  'gallery/p12.png',
];

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