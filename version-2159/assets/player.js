(function () {
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function resolveHls(path) {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    return import(path).then(function (module) {
      return module.H || module.default || window.Hls;
    }).catch(function () {
      return loadScript('https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js');
    });
  }

  function setupMoviePlayer(options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var button = document.getElementById(options.buttonId);
    var started = false;
    var hlsInstance = null;

    if (!video || !options.source) {
      return;
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    function beginPlayback() {
      hideOverlay();
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    function bindNative() {
      video.src = options.source;
      started = true;
      beginPlayback();
    }

    function bindHls(Hls) {
      if (!Hls || !Hls.isSupported || !Hls.isSupported()) {
        bindNative();
        return;
      }

      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(options.source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        started = true;
        beginPlayback();
      });
      hlsInstance.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          try {
            hlsInstance.destroy();
          } catch (error) {}
          bindNative();
        }
      });
    }

    function start() {
      if (started) {
        beginPlayback();
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        bindNative();
        return;
      }

      resolveHls(options.hlsPath).then(bindHls).catch(bindNative);
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        start();
      });
    }

    video.addEventListener('play', hideOverlay);
    window.addEventListener('beforeunload', function () {
      if (hlsInstance && hlsInstance.destroy) {
        hlsInstance.destroy();
      }
    });
  }

  window.SitePlayer = {
    setupMoviePlayer: setupMoviePlayer
  };
})();
