(function () {
    function all(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var toggle = document.querySelector('[data-mobile-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (toggle && panel) {
            toggle.addEventListener('click', function () {
                panel.classList.toggle('is-open');
            });
            all('a', panel).forEach(function (link) {
                link.addEventListener('click', function () {
                    panel.classList.remove('is-open');
                });
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = all('[data-hero-slide]', hero);
            var dots = all('[data-hero-dot]', hero);
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('is-active', slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle('is-active', dotIndex === current);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            var prev = hero.querySelector('[data-hero-prev]');
            var next = hero.querySelector('[data-hero-next]');
            if (prev) {
                prev.addEventListener('click', function () {
                    show(current - 1);
                    start();
                });
            }
            if (next) {
                next.addEventListener('click', function () {
                    show(current + 1);
                    start();
                });
            }
            dots.forEach(function (dot, index) {
                dot.addEventListener('click', function () {
                    show(index);
                    start();
                });
            });
            hero.addEventListener('mouseenter', stop);
            hero.addEventListener('mouseleave', start);
            show(0);
            start();
        }

        var searchRoot = document.querySelector('[data-search-root]');
        if (searchRoot) {
            var input = searchRoot.querySelector('[data-search-input]');
            var year = searchRoot.querySelector('[data-year-filter]');
            var region = searchRoot.querySelector('[data-region-filter]');
            var type = searchRoot.querySelector('[data-type-filter]');
            var cards = all('[data-search-card]', searchRoot);
            var empty = searchRoot.querySelector('[data-empty-state]');

            function apply() {
                var keyword = normalize(input && input.value);
                var selectedYear = normalize(year && year.value);
                var selectedRegion = normalize(region && region.value);
                var selectedType = normalize(type && type.value);
                var visible = 0;
                cards.forEach(function (card) {
                    var text = normalize([
                        card.dataset.title,
                        card.dataset.genre,
                        card.dataset.tags,
                        card.dataset.category,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.year
                    ].join(' '));
                    var matched = true;
                    if (keyword && text.indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (selectedYear && normalize(card.dataset.year) !== selectedYear) {
                        matched = false;
                    }
                    if (selectedRegion && normalize(card.dataset.region) !== selectedRegion) {
                        matched = false;
                    }
                    if (selectedType && normalize(card.dataset.type) !== selectedType) {
                        matched = false;
                    }
                    card.style.display = matched ? '' : 'none';
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            [input, year, region, type].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });
            apply();
        }
    });
})();
