(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      mobileNav.hidden = expanded;
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var currentSlide = 0;
  var heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }

    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(function () {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  var nextButton = document.querySelector('.hero-next');
  var prevButton = document.querySelector('.hero-prev');

  if (nextButton) {
    nextButton.addEventListener('click', function () {
      showSlide(currentSlide + 1);
      startHero();
    });
  }

  if (prevButton) {
    prevButton.addEventListener('click', function () {
      showSlide(currentSlide - 1);
      startHero();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      startHero();
    });
  });

  startHero();

  var heroForm = document.getElementById('hero-search-form');
  var heroInput = document.getElementById('hero-search-input');

  if (heroForm && heroInput) {
    heroForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var target = heroForm.getAttribute('data-target') || './search.html';
      var query = heroInput.value.trim();
      window.location.href = query ? target + '?q=' + encodeURIComponent(query) : target;
    });
  }

  var filterInput = document.querySelector('.filter-input');
  var filterScope = document.querySelector('.filter-scope');
  var emptyResult = document.querySelector('.empty-result');

  function filterCards(value) {
    if (!filterScope) {
      return;
    }

    var query = value.trim().toLowerCase();
    var cards = Array.prototype.slice.call(filterScope.querySelectorAll('.movie-card, .horizontal-card'));
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = (card.getAttribute('data-filter') || card.textContent || '').toLowerCase();
      var matched = !query || haystack.indexOf(query) !== -1;
      card.classList.toggle('is-hidden', !matched);
      if (matched) {
        visible += 1;
      }
    });

    if (emptyResult) {
      emptyResult.hidden = visible !== 0;
    }
  }

  if (filterInput) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    if (initialQuery) {
      filterInput.value = initialQuery;
    }
    filterCards(filterInput.value);
    filterInput.addEventListener('input', function () {
      filterCards(filterInput.value);
    });
  }
})();
