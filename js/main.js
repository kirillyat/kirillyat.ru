/* ============================================================
   kirillyat.ru — рендер контента и интерактив
   ============================================================ */
(() => {
  const $ = (id) => document.getElementById(id);
  let lang = localStorage.getItem("lang") || "ru";
  let typeTimer = null;

  /* ---------- рендер контента из CONTENT[lang] ---------- */
  function render() {
    const t = CONTENT[lang];
    document.documentElement.lang = lang;

    $("navLinks").innerHTML = t.nav
      .map((l) => `<a href="${l.href}">${l.label}</a>`)
      .join("");
    $("langToggle").textContent = lang === "ru" ? "EN" : "RU";

    $("heroHello").textContent = t.hero.hello;
    $("heroName").textContent = t.hero.name;
    $("heroTagline").textContent = t.hero.tagline;
    $("ctaContact").textContent = t.hero.ctaContact;
    $("ctaCv").textContent = t.hero.ctaCv;
    $("scrollLabel").textContent = t.hero.scroll;

    $("aboutTitle").textContent = t.about.title;
    $("bentoGrid").innerHTML = t.about.bento
      .map((c) => {
        const cls =
          c.size === "wide" ? " bento__card--wide" :
          c.size === "tall" ? " bento__card--tall" : "";
        if (c.size === "stat") {
          return `<div class="bento__card reveal"><div class="bento__value">${c.value}</div><div class="bento__label">${c.label}</div></div>`;
        }
        const status = c.status ? `<span class="bento__status">${c.status}</span>` : "";
        return `<div class="bento__card${cls} reveal"><div><div class="bento__title">${c.title}</div><div class="bento__body">${c.body}</div></div>${status}</div>`;
      })
      .join("");

    $("expTitle").textContent = t.experience.title;
    $("timeline").innerHTML = t.experience.jobs
      .map(
        (j) => `
        <div class="timeline__item reveal">
          <div class="timeline__period mono">${j.period}</div>
          <div class="timeline__head">${j.company} <em>· ${j.role}</em></div>
          <p class="timeline__desc">${j.desc}</p>
          <div class="timeline__tags">${j.tags.map((x) => `<span class="tag">${x}</span>`).join("")}</div>
        </div>`
      )
      .join("");

    $("skillsTitle").textContent = t.skills.title;
    $("skillsGrid").innerHTML = t.skills.groups
      .map(
        (g) => `
        <div class="skills__group reveal">
          <div class="skills__name">${g.name}</div>
          <div class="skills__items">${g.items.map((x) => `<span class="tag">${x}</span>`).join("")}</div>
        </div>`
      )
      .join("");

    $("talksTitle").textContent = t.talks.title;
    $("talksList").innerHTML = t.talks.items
      .map(
        (i) => `
        <div class="talks__item reveal">
          <div>
            <div class="talks__title">${i.title}</div>
            <div class="talks__desc">${i.desc}</div>
          </div>
          <span class="talks__tag">${i.tag}</span>
        </div>`
      )
      .join("");

    $("contactTitle").textContent = t.contact.title;
    $("contactLead").textContent = t.contact.lead;
    $("emailText").textContent = t.contact.email;
    $("copyHint").textContent = t.contact.copyHint;
    $("socials").innerHTML = t.contact.socials
      .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`)
      .join("");

    $("footerLeft").textContent = t.footer.left;
    $("footerHint").textContent = t.footer.hint;

    observeReveals();
    startTypewriter(t.hero.roles);
    bindCardGlow();
  }

  /* ---------- typewriter ---------- */
  function startTypewriter(words) {
    clearTimeout(typeTimer);
    const el = $("typewriter");
    let wi = 0, ci = 0, deleting = false;
    function tick() {
      const word = words[wi];
      ci += deleting ? -1 : 1;
      el.textContent = word.slice(0, ci);
      let delay = deleting ? 35 : 70;
      if (!deleting && ci === word.length) { delay = 2000; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
      typeTimer = setTimeout(tick, delay);
    }
    tick();
  }

  /* ---------- scroll reveals ---------- */
  let observer = null;
  function observeReveals() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  /* ---------- card glow follows cursor ---------- */
  function bindCardGlow() {
    document.querySelectorAll(".bento__card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- nav: progress + active link + bg ---------- */
  const nav = $("nav");
  const sections = ["about", "experience", "skills", "talks", "contact"];
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    $("progressBar").style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`;
    nav.classList.toggle("scrolled", h.scrollTop > 24);

    let current = "";
    for (const id of sections) {
      const el = $(id);
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
    }
    document.querySelectorAll(".nav__links a").forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`)
    );
  }, { passive: true });

  /* ---------- magnetic buttons ---------- */
  document.addEventListener("pointermove", (e) => {
    document.querySelectorAll(".magnetic").forEach((el) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        const pull = (120 - dist) / 120;
        el.style.transform = `translate(${dx * 0.18 * pull}px, ${dy * 0.18 * pull}px)`;
      } else {
        el.style.transform = "";
      }
    });
  });

  /* ---------- canvas: constellation particles ---------- */
  const canvas = $("heroCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const mouse = { x: -9999, y: -9999 };

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    const count = Math.min(110, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.4,
    }));
  }

  function drawParticles() {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      // лёгкое отталкивание от курсора
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 110 && d > 0) {
        p.x += (dx / d) * 0.6;
        p.y += (dy / d) * 0.6;
      }
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(214, 255, 63, 0.5)";
      ctx.fill();
    }
    // линии между близкими частицами
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(139, 124, 246, ${0.18 * (1 - d / 130)})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }

  canvas.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener("pointerleave", () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener("resize", resizeCanvas);

  /* ---------- copy email ---------- */
  $("emailBtn").addEventListener("click", async () => {
    const t = CONTENT[lang];
    try {
      await navigator.clipboard.writeText(t.contact.email);
      $("copyHint").textContent = t.contact.copied;
      setTimeout(() => ($("copyHint").textContent = t.contact.copyHint), 2000);
    } catch {
      location.href = `mailto:${t.contact.email}`;
    }
  });

  /* ---------- lang toggle ---------- */
  $("langToggle").addEventListener("click", () => {
    lang = lang === "ru" ? "en" : "ru";
    localStorage.setItem("lang", lang);
    render();
  });

  /* ---------- terminal easter egg ---------- */
  const terminal = $("terminal");
  const termBody = $("termBody");
  const termInput = $("termInput");

  function termPrint(text, isCmd = false) {
    const line = document.createElement("div");
    if (isCmd) {
      line.innerHTML = `<span class="accent">$</span> <span class="cmd"></span>`;
      line.querySelector(".cmd").textContent = text;
    } else {
      line.textContent = text;
    }
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function openTerminal() {
    terminal.hidden = false;
    termBody.innerHTML = "";
    termPrint(CONTENT[lang].terminal.welcome);
    termInput.focus();
  }
  function closeTerminal() { terminal.hidden = true; }

  termInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const cmd = termInput.value.trim().toLowerCase();
    termInput.value = "";
    if (!cmd) return;
    termPrint(cmd, true);
    const t = CONTENT[lang].terminal;
    if (cmd === "clear") { termBody.innerHTML = ""; return; }
    if (cmd === "exit") { closeTerminal(); return; }
    termPrint(t[cmd] || t.unknown);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "`" && terminal.hidden && document.activeElement !== termInput) {
      e.preventDefault();
      openTerminal();
    } else if (e.key === "Escape" && !terminal.hidden) {
      closeTerminal();
    }
  });
  $("termHint").addEventListener("click", openTerminal);
  $("termClose").addEventListener("click", closeTerminal);
  terminal.addEventListener("click", (e) => { if (e.target === terminal) closeTerminal(); });

  /* ---------- init ---------- */
  render();
  resizeCanvas();
  drawParticles();
})();
