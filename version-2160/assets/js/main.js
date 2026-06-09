(function () {
    var menuButton = document.querySelector(".mobile-menu-toggle");
    var mobileMenu = document.querySelector(".mobile-menu");

    if (menuButton && mobileMenu) {
        menuButton.addEventListener("click", function () {
            var isOpen = !mobileMenu.hidden;
            mobileMenu.hidden = isOpen;
            menuButton.setAttribute("aria-expanded", String(!isOpen));
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var prev = document.querySelector("[data-hero-prev]");
    var next = document.querySelector("[data-hero-next]");
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, currentIndex) {
            slide.classList.toggle("is-active", currentIndex === activeIndex);
        });

        dots.forEach(function (dot, currentIndex) {
            dot.classList.toggle("is-active", currentIndex === activeIndex);
        });
    }

    function startSlider() {
        if (slides.length < 2) {
            return;
        }

        clearInterval(timer);
        timer = setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5600);
    }

    if (prev) {
        prev.addEventListener("click", function () {
            showSlide(activeIndex - 1);
            startSlider();
        });
    }

    if (next) {
        next.addEventListener("click", function () {
            showSlide(activeIndex + 1);
            startSlider();
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
            startSlider();
        });
    });

    startSlider();

    Array.prototype.slice.call(document.querySelectorAll("[data-search-form]")).forEach(function (form) {
        form.addEventListener("submit", function (event) {
            var input = form.querySelector("input[name='q']");
            var value = input ? input.value.trim() : "";

            if (value) {
                event.preventDefault();
                window.location.href = "./search.html?q=" + encodeURIComponent(value);
            }
        });
    });

    var globalSearch = document.querySelector("[data-global-search]");
    var pageFilter = document.querySelector("[data-page-filter]");
    var categoryFilter = document.querySelector("[data-category-filter]");
    var yearFilter = document.querySelector("[data-year-filter]");
    var scope = document.querySelector("[data-filter-scope]");

    function filterCards() {
        if (!scope) {
            return;
        }

        var query = pageFilter ? pageFilter.value.trim().toLowerCase() : "";
        var category = categoryFilter ? categoryFilter.value : "";
        var year = yearFilter ? yearFilter.value : "";
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

        cards.forEach(function (card) {
            var text = card.getAttribute("data-search") || "";
            var cardCategory = card.getAttribute("data-category") || "";
            var cardYear = card.getAttribute("data-year") || "";
            var visible = true;

            if (query && text.indexOf(query) === -1) {
                visible = false;
            }

            if (category && cardCategory !== category) {
                visible = false;
            }

            if (year && cardYear !== year) {
                visible = false;
            }

            card.hidden = !visible;
        });
    }

    if (globalSearch) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q");

        if (initialQuery) {
            globalSearch.value = initialQuery;
        }
    }

    [pageFilter, categoryFilter, yearFilter].forEach(function (control) {
        if (control) {
            control.addEventListener("input", filterCards);
            control.addEventListener("change", filterCards);
        }
    });

    filterCards();
})();
