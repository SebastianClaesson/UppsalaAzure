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

  // === Highlight active nav link ===
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
});
