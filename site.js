// site.js
(function () {
  // Year in footer
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  // Build cutout letters only on Home page (where #cutout exists)
  const cutout = document.getElementById("cutout");
  if (!cutout) return;

  const text = "ANANYA NAGAR";
  // Create letters with random start offsets so it feels like a scrapbook shuffle
  for (const ch of text) {
    if (ch === " ") {
      const sp = document.createElement("span");
      sp.style.width = "10px";
      sp.style.display = "inline-block";
      cutout.appendChild(sp);
      continue;
    }
    const el = document.createElement("span");
    el.className = "cut";
    el.textContent = ch;

    // random starting offsets (more noticeable)
    const sx = (Math.random() * 220 - 110).toFixed(0) + "px";
    const sy = (Math.random() * 120 - 60).toFixed(0) + "px";
    const rot = (Math.random() * 18 - 9).toFixed(2) + "deg";

    el.style.setProperty("--sx", sx);
    el.style.setProperty("--sy", sy);
    el.style.setProperty("--rot", rot);

    cutout.appendChild(el);
  }

  const letters = Array.from(cutout.querySelectorAll(".cut"));

  // 1) Fly-in assemble
  letters.forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), 140 + i * 55);
  });

  // 2) “Cliché scrapbook shuffle”: after they land, wiggle closer together
  // feels like hand-placed letters being nudged into alignment.
  setTimeout(() => {
    letters.forEach((el) => el.classList.add("shuffle"));

    let steps = 10;
    const interval = setInterval(() => {
      steps -= 1;

      letters.forEach((el) => {
        // tiny wiggles
        const r = (Math.random() * 6 - 3).toFixed(2);
        el.style.setProperty("--rot", `${r}deg`);
      });

      if (steps <= 0) {
        clearInterval(interval);
        // settle
        letters.forEach((el) => el.style.setProperty("--rot", (Math.random() * 2 - 1).toFixed(2) + "deg"));
      }
    }, 120);
  }, 1200);

  // 3) Hover: re-shuffle (noticeable but not obnoxious)
  cutout.addEventListener("mouseenter", () => {
    letters.forEach((el, i) => {
      setTimeout(() => {
        const r = (Math.random() * 10 - 5).toFixed(2) + "deg";
        el.style.setProperty("--rot", r);
      }, i * 15);
    });
  });
})();
