(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
    }

    var backTop = document.querySelector('[data-back-top]');

    if (backTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 420) {
                backTop.classList.add('show');
            } else {
                backTop.classList.remove('show');
            }
        });

        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.querySelectorAll('[data-hero]').forEach(function (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }

        show(0);
        restart();
    });

    document.querySelectorAll('[data-filter-box]').forEach(function (box) {
        var root = box.parentElement;
        var input = box.querySelector('[data-filter-input]');
        var region = box.querySelector('[data-filter-region]');
        var type = box.querySelector('[data-filter-type]');
        var year = box.querySelector('[data-filter-year]');
        var list = root ? root.querySelector('[data-filter-list]') : null;

        if (!list) {
            return;
        }

        var cards = Array.prototype.slice.call(list.children);

        function valueOf(element) {
            return element ? element.value.trim().toLowerCase() : '';
        }

        function applyFilters() {
            var keyword = valueOf(input);
            var regionValue = valueOf(region);
            var typeValue = valueOf(type);
            var yearValue = valueOf(year);

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-search') || '').toLowerCase();
                var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
                var cardType = (card.getAttribute('data-type') || '').toLowerCase();
                var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (regionValue && cardRegion !== regionValue) {
                    matched = false;
                }

                if (typeValue && cardType !== typeValue) {
                    matched = false;
                }

                if (yearValue && cardYear !== yearValue) {
                    matched = false;
                }

                card.classList.toggle('hidden-by-filter', !matched);
            });
        }

        [input, region, type, year].forEach(function (element) {
            if (element) {
                element.addEventListener('input', applyFilters);
                element.addEventListener('change', applyFilters);
            }
        });
    });
})();
