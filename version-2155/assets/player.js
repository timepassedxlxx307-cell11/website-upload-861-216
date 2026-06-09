(function () {
    function setupMoviePlayer(options) {
        var video = document.querySelector(options.videoSelector);
        var overlay = document.querySelector(options.overlaySelector);
        var button = document.querySelector(options.buttonSelector);
        var message = document.querySelector(options.messageSelector);
        var hlsInstance = null;
        var prepared = false;

        if (!video || !options.url) {
            return;
        }

        function showMessage() {
            if (message) {
                message.hidden = false;
            }
        }

        function prepare() {
            if (prepared) {
                return;
            }

            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = options.url;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(options.url);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showMessage();
                    }
                });
                return;
            }

            showMessage();
        }

        function play() {
            prepare();
            video.controls = true;
            var attempt = video.play();

            if (attempt && typeof attempt.then === 'function') {
                attempt.then(function () {
                    if (overlay) {
                        overlay.classList.add('hidden');
                    }
                }).catch(function () {
                    showMessage();
                });
            } else if (overlay) {
                overlay.classList.add('hidden');
            }
        }

        function toggle() {
            if (video.paused) {
                play();
            } else {
                video.pause();
            }
        }

        if (overlay) {
            overlay.addEventListener('click', play);
        }

        if (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                play();
            });
        }

        video.addEventListener('click', toggle);
        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('hidden');
            }
        });
        video.addEventListener('error', showMessage);
        prepare();

        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;
})();
