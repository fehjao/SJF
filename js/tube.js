document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('main-video');
  const playPauseBtn = document.getElementById('play-pause-btn');
  if (video && playPauseBtn) {
    
    function togglePlay() {
      if (video.paused) {
        video.play();
        playPauseBtn.textContent = '❚❚'; // Ícone de Pause
      } else {
        video.pause();
        playPauseBtn.textContent = '▶'; // Ícone de Play
      }
    }
    
    playPauseBtn.addEventListener('click', togglePlay);
    
    video.addEventListener('click', togglePlay);
    
    video.addEventListener('ended', function () {
      playPauseBtn.textContent = '▶';
    });
  }
});