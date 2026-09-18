(function () {
  document.documentElement.classList.add("js");

  var year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");
  var linksGrid = document.querySelector(".links-grid");

  function markIn() {
    reveals.forEach(function (el) {
      el.classList.add("is-in");
    });
    if (linksGrid) {
      linksGrid.classList.add("is-in");
    }
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
        if (entry.target.id === "links" && linksGrid) {
          linksGrid.classList.add("is-in");
        }
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();
