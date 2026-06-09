(function () {
    function setupPlayer(player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-player-button]');
        var source = video ? video.getAttribute('data-src') : '';
        var started = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function playVideo() {
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        function start() {
            if (started) {
                playVideo();
                return;
            }
            started = true;
            player.classList.add('is-playing');
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo();
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                playVideo();
            } else {
                video.src = source;
                playVideo();
            }
        }

        if (button) {
            button.addEventListener('click', start);
        }
        video.addEventListener('click', start, { once: true });
        video.addEventListener('play', function () {
            player.classList.add('is-playing');
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
    });
}());
