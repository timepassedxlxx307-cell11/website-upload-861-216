(function () {
    window.initMoviePlayer = function (source, poster) {
        var shell = document.querySelector("[data-player]");

        if (!shell) {
            return;
        }

        var video = shell.querySelector("video");
        var cover = shell.querySelector(".player-cover");
        var button = shell.querySelector(".player-button");
        var ready = false;
        var hls = null;

        if (!video || !cover) {
            return;
        }

        if (poster) {
            video.setAttribute("poster", poster);
        }

        function attachSource() {
            if (ready) {
                return;
            }

            ready = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
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
            attachSource();
            cover.hidden = true;
            video.controls = true;

            var playResult = video.play();

            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {
                    cover.hidden = false;
                });
            }
        }

        cover.addEventListener("click", startPlayback);

        if (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                startPlayback();
            });
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                startPlayback();
            } else {
                video.pause();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    };
})();
