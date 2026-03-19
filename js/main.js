// === Theme toggle ===
(function () {
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  }
})();

// === Mobile nav toggle ===
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  // === Agenda toggle ===
  document.querySelectorAll(".agenda-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("open");
      const content = btn.nextElementSibling;
      if (content) {
        content.classList.toggle("open");
      }
    });
  });

  // === Event filter tabs ===
  const filterTabs = document.querySelectorAll(".filter-tab");
  const eventCards = document.querySelectorAll(".event-card[data-status]");

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      filterTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;
      eventCards.forEach((card) => {
        if (filter === "all" || card.dataset.status === filter) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // === Theme toggle button ===
  const themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    const updateIcon = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        (!document.documentElement.getAttribute("data-theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      themeBtn.textContent = isDark ? "\u2600\uFE0F" : "\uD83C\uDF19";
      themeBtn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    };

    updateIcon();

    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      let next;
      if (current === "dark" || (!current && prefersDark)) {
        next = "light";
      } else {
        next = "dark";
      }

      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      updateIcon();
    });
  }

  // === Highlight active nav link ===
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});
