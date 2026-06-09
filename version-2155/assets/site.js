(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var navToggle = document.querySelector('.nav-toggle');
        var mobileNav = document.querySelector('.mobile-nav');

        if (navToggle && mobileNav) {
            navToggle.addEventListener('click', function () {
                var open = mobileNav.classList.toggle('open');
                navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }

        var slider = document.querySelector('[data-hero-slider]');

        if (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
            var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
            var previous = slider.querySelector('.hero-prev');
            var next = slider.querySelector('.hero-next');
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

            if (previous) {
                previous.addEventListener('click', function () {
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

            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    show(Number(dot.getAttribute('data-slide')) || 0);
                    start();
                });
            });

            slider.addEventListener('mouseenter', stop);
            slider.addEventListener('mouseleave', start);
            show(0);
            start();
        }

        var searchInput = document.getElementById('searchInput');
        var filterRegion = document.getElementById('filterRegion');
        var filterYear = document.getElementById('filterYear');
        var filterGenre = document.getElementById('filterGenre');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));

        if (searchInput && cards.length) {
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get('q');

            if (initialQuery) {
                searchInput.value = initialQuery;
            }

            function applyFilters() {
                var query = (searchInput.value || '').trim().toLowerCase();
                var region = filterRegion ? filterRegion.value : '';
                var year = filterYear ? filterYear.value : '';
                var genre = filterGenre ? filterGenre.value : '';

                cards.forEach(function (card) {
                    var searchText = (card.getAttribute('data-search-text') || '').toLowerCase();
                    var cardRegion = card.getAttribute('data-region') || '';
                    var cardYear = card.getAttribute('data-year') || '';
                    var cardGenre = card.getAttribute('data-genre') || '';
                    var matched = true;

                    if (query && searchText.indexOf(query) === -1) {
                        matched = false;
                    }

                    if (region && cardRegion !== region) {
                        matched = false;
                    }

                    if (year && cardYear !== year) {
                        matched = false;
                    }

                    if (genre && cardGenre.indexOf(genre) === -1) {
                        matched = false;
                    }

                    card.classList.toggle('is-hidden', !matched);
                });
            }

            searchInput.addEventListener('input', applyFilters);

            if (filterRegion) {
                filterRegion.addEventListener('change', applyFilters);
            }

            if (filterYear) {
                filterYear.addEventListener('change', applyFilters);
            }

            if (filterGenre) {
                filterGenre.addEventListener('change', applyFilters);
            }

            applyFilters();
        }
    });
})();
