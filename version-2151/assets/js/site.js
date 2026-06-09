(function () {
    function getText(value) {
        return (value || '').toString().toLowerCase().trim();
    }

    function initMobileMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-mobile-nav]');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initHero() {
        var slider = document.querySelector('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var prev = slider.querySelector('[data-hero-prev]');
        var next = slider.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                start();
            });
        });
        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initCategoryFilter() {
        var panel = document.querySelector('[data-filter-form]');
        var list = document.querySelector('[data-filter-list]');
        if (!panel || !list) {
            return;
        }
        var keywordInput = panel.querySelector('[data-filter-keyword]');
        var genreSelect = panel.querySelector('[data-filter-genre]');
        var yearSelect = panel.querySelector('[data-filter-year]');
        var empty = document.querySelector('[data-empty-state]');
        var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));

        function matchYear(cardYear, selected) {
            if (!selected) {
                return true;
            }
            if (selected === 'older') {
                var numeric = parseInt(cardYear, 10);
                return Number.isFinite(numeric) && numeric < 2020;
            }
            return cardYear.indexOf(selected) !== -1;
        }

        function applyFilter() {
            var keyword = getText(keywordInput && keywordInput.value);
            var genre = getText(genreSelect && genreSelect.value);
            var year = getText(yearSelect && yearSelect.value);
            var visible = 0;
            cards.forEach(function (card) {
                var title = getText(card.getAttribute('data-title'));
                var cardGenre = getText(card.getAttribute('data-genre'));
                var cardYear = getText(card.getAttribute('data-year'));
                var region = getText(card.getAttribute('data-region'));
                var tags = getText(card.getAttribute('data-tags'));
                var haystack = [title, cardGenre, cardYear, region, tags].join(' ');
                var ok = (!keyword || haystack.indexOf(keyword) !== -1) &&
                    (!genre || cardGenre.indexOf(genre) !== -1 || tags.indexOf(genre) !== -1) &&
                    matchYear(cardYear, year);
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [keywordInput, genreSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });
    }

    function movieCardHtml(movie) {
        return [
            '<article class="movie-card">',
            '<a href="./' + movie.file + '" aria-label="观看 ' + escapeHtml(movie.title) + '">',
            '<div class="card-cover">',
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="card-badge">' + escapeHtml(movie.type) + '</span>',
            '<span class="card-score">' + movie.score + '</span>',
            '</div>',
            '<div class="card-body">',
            '<h3>' + escapeHtml(movie.title) + '</h3>',
            '<p>' + escapeHtml(movie.description) + '</p>',
            '<div class="card-meta">',
            '<span>' + escapeHtml(movie.year) + '</span>',
            '<span>' + escapeHtml(movie.region) + '</span>',
            '<span>' + escapeHtml(movie.genre) + '</span>',
            '</div>',
            '</div>',
            '</a>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return (value || '').toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function initSearchPage() {
        var results = document.querySelector('[data-search-results]');
        var status = document.querySelector('[data-search-status]');
        var input = document.querySelector('[data-search-input]');
        if (!results || !status || !window.MOVIE_SEARCH_INDEX) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (input) {
            input.value = query;
        }
        var keyword = getText(query);
        if (!keyword) {
            status.textContent = '请输入关键词搜索影片';
            return;
        }
        var matches = window.MOVIE_SEARCH_INDEX.filter(function (movie) {
            var haystack = getText([movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.description].join(' '));
            return haystack.indexOf(keyword) !== -1;
        }).slice(0, 120);
        if (!matches.length) {
            status.textContent = '没有找到匹配的影片';
            return;
        }
        status.textContent = '搜索结果';
        results.innerHTML = matches.map(movieCardHtml).join('');
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initHero();
        initCategoryFilter();
        initSearchPage();
    });
}());
