var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
var Hls = window.Hls;

players.forEach(function (player) {
  var video = player.querySelector('video');
  var button = player.querySelector('[data-play]');
  var source = video ? video.getAttribute('data-src') : '';
  var hls = null;
  var attached = false;

  function attachSource() {
    if (!video || !source || attached) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function startPlayback() {
    if (!video) {
      return;
    }

    attachSource();
    video.controls = true;
    player.classList.add('is-playing');

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        player.classList.remove('is-playing');
      });
    }
  }

  if (button) {
    button.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener('play', function () {
      player.classList.add('is-playing');
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
});
