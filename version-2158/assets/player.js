(function () {
    function initPlayer(videoId, buttonId, shellId, source) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var shell = document.getElementById(shellId);
        var hls = null;
        var loaded = false;

        function load() {
            if (loaded || !video || !source) {
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            load();
            if (shell) {
                shell.classList.add('is-playing');
            }
            if (button) {
                button.hidden = true;
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    if (button) {
                        button.hidden = false;
                    }
                    if (shell) {
                        shell.classList.remove('is-playing');
                    }
                });
            }
        }

        if (button && video) {
            button.addEventListener('click', play);
        }
        if (video) {
            video.addEventListener('click', function () {
                if (!loaded) {
                    play();
                }
            });
        }
        window.addEventListener('beforeunload', function () {
            if (hls && hls.destroy) {
                hls.destroy();
            }
        });
    }

    window.MoviePlayer = {
        init: initPlayer
    };
})();
