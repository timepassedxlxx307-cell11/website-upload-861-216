(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (navButton && mobileNav) {
    navButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });

      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot, current) {
      dot.addEventListener('click', function () {
        showSlide(current);
        restart();
      });
    });

    showSlide(0);
    restart();
  }

  var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));

  searchInputs.forEach(function (input) {
    var scope = document.querySelector(input.getAttribute('data-search')) || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var empty = scope.querySelector('[data-empty]');

    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-title') || card.textContent || '').toLowerCase();
        var match = !value || haystack.indexOf(value) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    });
  });
})();
