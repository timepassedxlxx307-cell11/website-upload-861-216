(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        if (slides.length === 0) {
            return;
        }
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var previous = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(target) {
            index = (target + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
                restart();
            });
        });

        if (previous) {
            previous.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }

        show(0);
        restart();
    }

    function setupFilters() {
        var root = document.querySelector("[data-filter-root]");
        if (!root) {
            return;
        }
        var input = root.querySelector("[data-filter-input]");
        var region = root.querySelector("[data-filter-region]");
        var year = root.querySelector("[data-filter-year]");
        var type = root.querySelector("[data-filter-type]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".searchable-card"));
        var empty = document.querySelector("[data-empty-state]");
        var summary = document.querySelector("[data-filter-summary]");
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");

        if (query && input) {
            input.value = query;
        }

        function includesValue(source, value) {
            return source.toLowerCase().indexOf(value.toLowerCase()) !== -1;
        }

        function applyFilters() {
            var keyword = input ? input.value.trim() : "";
            var selectedRegion = region ? region.value : "";
            var selectedYear = year ? year.value : "";
            var selectedType = type ? type.value : "";
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title") || "",
                    card.getAttribute("data-region") || "",
                    card.getAttribute("data-year") || "",
                    card.getAttribute("data-genre") || "",
                    card.getAttribute("data-type") || ""
                ].join(" ");
                var matched = true;
                if (keyword && !includesValue(haystack, keyword)) {
                    matched = false;
                }
                if (selectedRegion && card.getAttribute("data-region") !== selectedRegion) {
                    matched = false;
                }
                if (selectedYear && card.getAttribute("data-year") !== selectedYear) {
                    matched = false;
                }
                if (selectedType && card.getAttribute("data-type") !== selectedType) {
                    matched = false;
                }
                card.style.display = matched ? "" : "none";
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
            if (summary) {
                summary.textContent = visible > 0 ? "已匹配到可浏览影片" : "未匹配到影片";
            }
        }

        [input, region, year, type].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });

        applyFilters();
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
