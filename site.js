// site.js: shared behavior for every page
(function () {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Year in footer
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // Solid header once the page scrolls
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    };
    toggle.addEventListener("click", () => setOpen(!isOpen()));
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("click", (e) => {
      if (isOpen() && !e.target.closest(".header-inner")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Reveal on scroll. Only elements still below the fold get hidden,
  // so nothing already on screen ever blinks out.
  const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!reduceMotion && "IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-in");
          entry.target.classList.remove("reveal-pending");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const group = Array.from(el.parentElement.children).filter((c) => c.hasAttribute("data-reveal"));
      el.style.setProperty("--d", Math.min(group.indexOf(el), 5) * 90 + "ms");
      el.classList.add("reveal-pending");
      io.observe(el);
    });
  }

  // Rotating words in the hero
  const rotator = document.querySelector("[data-rotate]");
  if (rotator && !reduceMotion) {
    let words = [];
    try {
      words = JSON.parse(rotator.getAttribute("data-rotate"));
    } catch (_) {
      words = [];
    }
    let i = 0;
    if (words.length > 1) {
      setInterval(() => {
        rotator.classList.add("out");
        setTimeout(() => {
          i = (i + 1) % words.length;
          rotator.textContent = words[i];
          rotator.classList.remove("out");
        }, 380);
      }, 2800);
    }
  }

  // Copy email address (the button stays hidden where the clipboard API is unavailable)
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    if (!navigator.clipboard || !window.isSecureContext) return;
    btn.hidden = false;
    const label = btn.querySelector(".copy-label");
    const original = label ? label.textContent : "";
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.getAttribute("data-copy"));
        btn.classList.add("copied");
        if (label) label.textContent = "Copied!";
        setTimeout(() => {
          btn.classList.remove("copied");
          if (label) label.textContent = original;
        }, 1800);
      } catch (_) {
        // The address is also printed on the page, so it can still be copied by hand.
      }
    });
  });
})();
