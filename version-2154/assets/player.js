(function () {
    window.setupMoviePlayer = function (playlist) {
        var video = document.querySelector('[data-player-video]');
        var cover = document.querySelector('[data-player-cover]');
        var button = document.querySelector('[data-player-button]');
        var player = document.querySelector('[data-player]');
        var instance = null;
        var ready = false;

        if (!video || !cover || !player || !playlist) {
            return;
        }

        function showMessage(text) {
            var message = player.querySelector('.player-message');

            if (!message) {
                message = document.createElement('div');
                message.className = 'player-message';
                player.appendChild(message);
            }

            message.textContent = text;
        }

        function prepare() {
            if (ready) {
                return;
            }

            ready = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = playlist;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                instance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                instance.loadSource(playlist);
                instance.attachMedia(video);
                instance.on(window.Hls.Events.ERROR, function (eventName, data) {
                    if (data && data.fatal && instance) {
                        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                            instance.startLoad();
                        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                            instance.recoverMediaError();
                        } else {
                            showMessage('播放暂时不可用，请稍后再试');
                        }
                    }
                });
                return;
            }

            showMessage('播放暂时不可用，请稍后再试');
        }

        function start() {
            prepare();
            cover.classList.add('is-hidden');
            video.setAttribute('controls', 'controls');

            var playResult = video.play();

            if (playResult && typeof playResult.catch === 'function') {
                playResult.catch(function () {
                    cover.classList.remove('is-hidden');
                });
            }
        }

        cover.addEventListener('click', start);

        if (button) {
            button.addEventListener('click', function (event) {
                event.stopPropagation();
                start();
            });
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });

        window.addEventListener('beforeunload', function () {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            }
        });
    };
})();
