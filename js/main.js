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

  // === Sign-up form -> mailto ===
  const signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("reg-name").value.trim();
      const email = document.getElementById("reg-email").value.trim();
      const event = document.getElementById("reg-event").value;
      const message = document.getElementById("reg-message").value.trim();

      if (!name || !email || !event) {
        alert("Please fill in your name, email, and select an event.");
        return;
      }

      const subject = encodeURIComponent(`Event Registration: ${event}`);
      const body = encodeURIComponent(
        `New Registration\n` +
          `================\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Event: ${event}\n` +
          (message ? `Message: ${message}\n` : "")
      );

      window.location.href = `mailto:Register@UppsalaAzure.tech?subject=${subject}&body=${body}`;

      // Show confirmation
      const confirmation = document.getElementById("signup-confirmation");
      if (confirmation) {
        confirmation.style.display = "block";
        signupForm.reset();
      }
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
