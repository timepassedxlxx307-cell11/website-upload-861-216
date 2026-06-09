import { H as Hls } from "./hls-vendor-dru42stk.js";

export function preparePlayer(source) {
    var video = document.querySelector("[data-player-video]");
    var trigger = document.querySelector("[data-player-trigger]");
    var hlsInstance = null;
    var loaded = false;

    if (!video || !trigger || !source) {
        return;
    }

    function loadMedia() {
        if (loaded) {
            return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play().catch(function () {});
            });
            hlsInstance.on(Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    hlsInstance.startLoad();
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    hlsInstance.recoverMediaError();
                } else {
                    hlsInstance.destroy();
                }
            });
        } else {
            video.src = source;
        }
    }

    function start() {
        loadMedia();
        trigger.classList.add("is-hidden");
        video.controls = true;
        video.play().catch(function () {});
    }

    trigger.addEventListener("click", start);
    video.addEventListener("click", function () {
        if (video.paused) {
            start();
        }
    });

    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
