(function () {
  document.documentElement.classList.add("js");

  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var track = document.querySelector(".review-track");
  if (track) {
    var prevReview = track.parentElement.querySelector(".review-arrow[data-dir='-1']");
    var nextReview = track.parentElement.querySelector(".review-arrow[data-dir='1']");

    function reviewStep() {
      var card = track.querySelector(".review-card");
      if (!card) return track.clientWidth;
      var gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function updateReviewArrows() {
      var max = track.scrollWidth - track.clientWidth;
      if (prevReview) prevReview.disabled = track.scrollLeft <= 2;
      if (nextReview) nextReview.disabled = track.scrollLeft >= max - 2;
    }

    function scrollReviews(direction) {
      track.scrollBy({
        left: direction * reviewStep(),
        behavior: reduceMotion ? "auto" : "smooth"
      });
    }

    if (prevReview) {
      prevReview.addEventListener("click", function () {
        scrollReviews(-1);
      });
    }
    if (nextReview) {
      nextReview.addEventListener("click", function () {
        scrollReviews(1);
      });
    }
    track.addEventListener("scroll", updateReviewArrows, { passive: true });
    window.addEventListener("resize", updateReviewArrows);
    updateReviewArrows();
  }

  var reveals = document.querySelectorAll(".reveal");
  var staggers = document.querySelectorAll(".stagger-in");

  function markIn() {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
    staggers.forEach(function (el) {
      el.classList.add("is-in");
    });
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    markIn();
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        entry.target.querySelectorAll(".stagger-in").forEach(function (grid) {
          grid.classList.add("is-in");
        });
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();
