// === Registration count (update this number when new signups come in) ===
const REGISTERED = 11;

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
      const arrow = btn.querySelector(".arrow");
      if (btn.classList.contains("open")) {
        btn.innerHTML = '<span class="arrow">▶</span> Hide Agenda';
      } else {
        btn.innerHTML = '<span class="arrow">▶</span> View Agenda';
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

  // === Registration counters ===
  document.querySelectorAll(".reg-counter").forEach((counter) => {
    const registered = REGISTERED;
    const capacity = parseInt(counter.dataset.capacity, 10);
    const pct = Math.min((registered / capacity) * 100, 100);
    const spotsLeft = Math.max(capacity - registered, 0);

    counter.querySelector(".reg-count").textContent = registered;
    counter.querySelector(".reg-spots").textContent =
      spotsLeft > 0 ? `${spotsLeft} spots left` : "Event is full";

    const fill = counter.querySelector(".reg-counter-fill");
    fill.style.width = `${pct}%`;
    if (pct >= 100) fill.classList.add("full");
    else if (pct >= 80) fill.classList.add("almost-full");
  });

  // === Countdown timer ===
  document.querySelectorAll(".countdown[data-event-date]").forEach((el) => {
    const target = new Date(el.dataset.eventDate).getTime();

    function update() {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        // Check if event is currently happening (assume 2.5h duration)
        const endTime = target + 2.5 * 60 * 60 * 1000;
        if (now < endTime) {
          el.classList.add("event-live");
          el.innerHTML = '<div class="countdown-item" style="min-width:auto;padding:0.75rem 2rem;"><span class="countdown-number">🔴 LIVE</span><span class="countdown-label">Event is happening now!</span></div>';
        } else {
          el.classList.add("event-passed");
          el.innerHTML = '<div class="countdown-item" style="min-width:auto;padding:0.75rem 2rem;"><span class="countdown-number">✓</span><span class="countdown-label">Event has ended</span></div>';
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      el.querySelector("#cd-days, .cd-days").textContent = days;
      el.querySelector("#cd-hours, .cd-hours").textContent = hours;
      el.querySelector("#cd-mins, .cd-mins").textContent = mins;
      el.querySelector("#cd-secs, .cd-secs").textContent = secs;
    }

    update();
    setInterval(update, 1000);
  });

  // === FAQ accordion ===
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("open");
      const answer = btn.nextElementSibling;
      if (answer) {
        answer.classList.toggle("open");
      }
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
