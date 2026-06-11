/* ============================================================
   kirillyat.ru — рендер контента и интерактив
   ============================================================ */
(() => {
  const $ = (id) => document.getElementById(id);
  const LANGS = ["ru", "en", "fr"];
  let lang = localStorage.getItem("lang");
  if (!LANGS.includes(lang)) lang = "ru";
  let typeTimer = null;

  /* ---------- рендер контента из CONTENT[lang] ---------- */
  function render() {
    const t = CONTENT[lang];
    document.documentElement.lang = lang;

    $("navLinks").innerHTML = t.nav.map((l) => `<a href="${l.href}">${l.label}</a>`).join("");
    updateLangSwitch();

    // оверлайны секций — из подписей навигации
    [["aboutOver", 0], ["expOver", 1], ["skillsOver", 2], ["matOver", 3], ["menOver", 4], ["contactOver", 5]]
      .forEach(([id, i]) => { $(id).textContent = `${String(i + 1).padStart(2, "0")} — ${t.nav[i].label}`; });

    $("heroHello").textContent = t.hero.hello;
    $("heroName").textContent = t.hero.name;
    $("heroTagline").textContent = t.hero.tagline;
    $("ctaMentor").textContent = t.hero.ctaMentor;
    $("ctaContact").textContent = t.hero.ctaContact;
    $("scrollLabel").textContent = t.hero.scroll;

    // marquee: стек по кругу
    const words = t.skills.groups.flatMap((g) => g.items);
    $("marqueeTrack").innerHTML = [...words, ...words]
      .map((w) => `<span>${w}<i> ❋ </i></span>`)
      .join("");

    $("aboutTitle").textContent = t.about.title;
    $("bentoGrid").innerHTML = t.about.bento
      .map((c) => {
        const cls =
          c.size === "wide" ? " bento__card--wide" :
          c.size === "tall" ? " bento__card--tall" : "";
        if (c.size === "stat") {
          return `<div class="bento__card tilt reveal"><div class="bento__value" data-count="${c.value}">${c.value}</div><div class="bento__label">${c.label}</div></div>`;
        }
        const status = c.status ? `<span class="bento__status">${c.status}</span>` : "";
        return `<div class="bento__card tilt${cls} reveal"><div><div class="bento__title">${c.title}</div><div class="bento__body">${c.body}</div></div>${status}</div>`;
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
        <div class="skills__group tilt reveal">
          <div class="skills__name">${g.name}</div>
          <div class="skills__items">${g.items.map((x) => `<span class="tag">${x}</span>`).join("")}</div>
        </div>`
      )
      .join("");

    renderMaterials(t);
    renderMentoring(t);

    $("contactTitle").textContent = t.contact.title;
    $("contactLead").textContent = t.contact.lead;
    $("emailText").textContent = t.contact.email;
    $("copyHint").textContent = t.contact.copyHint;
    $("socials").innerHTML = t.contact.socials
      .map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`)
      .join("");

    $("footerLeft").textContent = t.footer.left;
    $("footerHint").textContent = t.footer.hint;

    renderTermChips(t);
    observeReveals();
    startTypewriter(t.hero.roles);
    bindCards();
    plxInit();
  }

  /* ---------- материалы: карточки + фильтры ---------- */
  let matFilter = "all";
  function renderMaterials(t) {
    $("matTitle").textContent = t.materials.title;
    const types = Object.keys(t.materials.types);
    $("matFilters").innerHTML = ["all", ...types]
      .map(
        (f) =>
          `<button class="filters__btn mono${f === matFilter ? " active" : ""}" data-filter="${f}">
            ${f === "all" ? t.materials.filterAll : t.materials.types[f]}
          </button>`
      )
      .join("");
    $("matList").innerHTML = t.materials.items
      .map((m) => {
        const hidden = matFilter !== "all" && m.type !== matFilter;
        const badge = m.ready
          ? `<span class="mat__tag mono">${t.materials.types[m.type]}</span>`
          : `<span class="mat__tag mat__tag--soon mono">${t.materials.types[m.type]} · ${t.materials.soon}</span>`;
        return `
        <div class="mat__card tilt reveal${m.ready ? "" : " mat__card--soon"}${hidden ? " hidden" : ""}" data-type="${m.type}">
          <div>
            <div class="mat__title">${m.title}</div>
            <div class="mat__desc">${m.desc}</div>
          </div>
          ${badge}
        </div>`;
      })
      .join("");

    $("matFilters").querySelectorAll(".filters__btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        matFilter = btn.dataset.filter;
        renderMaterials(CONTENT[lang]);
        observeReveals();
        bindCards();
      })
    );
  }

  /* ---------- менторство: пойнты + форма записи ---------- */
  function renderMentoring(t) {
    $("menTitle").textContent = t.mentoring.title;
    $("menLead").textContent = t.mentoring.lead;
    $("menPoints").innerHTML = t.mentoring.points
      .map(
        (p, i) => `
        <div class="mentoring__point tilt reveal">
          <span class="mentoring__num mono">0${i + 1}</span>
          <div>
            <div class="mentoring__ptitle">${p.title}</div>
            <div class="mentoring__pdesc">${p.desc}</div>
          </div>
        </div>`
      )
      .join("");
    const f = t.mentoring.form;
    $("mfNameLabel").textContent = f.nameLabel;
    $("mfGoalLabel").textContent = f.goalLabel;
    $("mfGoal").innerHTML = f.goals.map((g) => `<option>${g}</option>`).join("");
    $("mfMsgLabel").textContent = f.msgLabel;
    $("mfMsg").placeholder = f.msgPh;
    $("mfSubmit").textContent = f.submit;
    $("mfHint").textContent = f.hint;
  }

  $("menForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const t = CONTENT[lang];
    const subject = `${t.mentoring.form.mailSubject} — ${$("mfName").value}`;
    const body = `${$("mfGoalLabel").textContent}: ${$("mfGoal").value}\n\n${$("mfMsg").value}`;
    location.href = `mailto:${t.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- typewriter ---------- */
  function startTypewriter(words) {
    clearTimeout(typeTimer);
    const el = $("typewriter");
    let wi = 0, ci = 0, deleting = false;
    function tick() {
      const word = words[wi];
      ci += deleting ? -1 : 1;
      el.textContent = word.slice(0, ci);
      let delay = deleting ? 45 : 95;
      if (!deleting && ci === word.length) { delay = 2600; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 600; }
      typeTimer = setTimeout(tick, delay);
    }
    tick();
  }

  /* ---------- scroll reveals + счётчики ---------- */
  let observer = null;
  function observeReveals() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("visible");
          const cnt = e.target.querySelector("[data-count]");
          if (cnt) animateCounter(cnt);
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  function animateCounter(el) {
    const target = el.dataset.count;
    const num = parseInt(target, 10);
    if (isNaN(num) || el.dataset.counted) return;
    el.dataset.counted = "1";
    const suffix = target.replace(String(num), "");
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / 1600, 1);
      el.textContent = Math.round(num * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- карточки: glow за курсором + мягкий наклон ---------- */
  function bindCards() {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
        const rx = ((y / r.height) - 0.5) * -3;
        const ry = ((x / r.width) - 0.5) * 3;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  /* ---------- параллакс: плавная глубина при скролле ---------- */
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let plxEls = [];
  function plxInit() {
    plxEls = [...document.querySelectorAll("[data-plx]")].map((el) => ({
      el,
      speed: parseFloat(el.dataset.plx),
      base: el.closest(".section")?.offsetTop || 0,
      cur: 0,
    }));
  }
  function plxLoop() {
    const y = window.scrollY;
    for (const p of plxEls) {
      const target = (y - p.base) * p.speed;
      p.cur += (target - p.cur) * 0.07;
      p.el.style.transform = `translate3d(0, ${p.cur.toFixed(2)}px, 0)`;
    }
    requestAnimationFrame(plxLoop);
  }
  window.addEventListener("resize", plxInit);

  /* ---------- стеклянная линза за курсором ---------- */
  const lens = $("lens");
  const lensPos = { x: -200, y: -200, tx: -200, ty: -200, s: 1, ts: 1 };
  let lensSeen = false;
  document.addEventListener("pointermove", (e) => {
    lensPos.tx = e.clientX;
    lensPos.ty = e.clientY;
    if (!lensSeen) { lensSeen = true; lensPos.x = e.clientX; lensPos.y = e.clientY; lens.style.opacity = "1"; }
    const interactive = e.target.closest("a, button, .tilt, input, select, textarea");
    lensPos.ts = interactive ? 1.45 : 1;
  });
  document.addEventListener("pointerleave", () => { lens.style.opacity = "0"; lensSeen = false; });
  function lensLoop() {
    lensPos.x += (lensPos.tx - lensPos.x) * 0.16;
    lensPos.y += (lensPos.ty - lensPos.y) * 0.16;
    lensPos.s += (lensPos.ts - lensPos.s) * 0.12;
    lens.style.transform = `translate(${lensPos.x - 46}px, ${lensPos.y - 46}px) scale(${lensPos.s.toFixed(3)})`;
    requestAnimationFrame(lensLoop);
  }

  /* ---------- nav: progress + active link + bg ---------- */
  const nav = $("nav");
  const sections = ["about", "experience", "skills", "materials", "mentoring", "contact"];
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

  /* ---------- canvas: светлячки + matrix-режим ---------- */
  const canvas = $("heroCanvas");
  const ctx = canvas.getContext("2d");
  let fireflies = [];
  let matrixUntil = 0;
  let matrixCols = [];
  const mouse = { x: -9999, y: -9999 };
  const MATRIX_GLYPHS = "アィウエオカキクケコサシスセソタチツテトナニヌネノ01<>=+*";

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    const count = Math.min(46, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 34000));
    fireflies = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      r: Math.random() * 1.8 + 0.8,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.7,
      warm: Math.random() < 0.25, // часть светлячков — сиреневые
    }));
    matrixCols = Array.from({ length: Math.ceil(canvas.offsetWidth / 18) }, () => Math.random() * -50);
  }

  function drawMatrix() {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.fillStyle = "rgba(5, 8, 15, 0.18)";
    ctx.fillRect(0, 0, w, h);
    ctx.font = "14px JetBrains Mono, monospace";
    matrixCols.forEach((y, i) => {
      const ch = MATRIX_GLYPHS[(Math.random() * MATRIX_GLYPHS.length) | 0];
      ctx.fillStyle = Math.random() > 0.95 ? "#dcefff" : "rgba(142, 197, 255, 0.7)";
      ctx.fillText(ch, i * 18, y * 18);
      matrixCols[i] = y * 18 > h && Math.random() > 0.97 ? 0 : y + 0.5;
    });
  }

  function drawFireflies(now) {
    if (Date.now() < matrixUntil) {
      drawMatrix();
      requestAnimationFrame(drawFireflies);
      return;
    }
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    const t = now / 1000;
    for (const f of fireflies) {
      // плавное блуждание + лёгкий уход от курсора
      const dx = f.x - mouse.x, dy = f.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 90 && d > 0) {
        f.x += (dx / d) * 0.25;
        f.y += (dy / d) * 0.25;
      }
      f.x += f.vx + Math.sin(t * f.speed + f.phase) * 0.12;
      f.y += f.vy + Math.cos(t * f.speed * 0.8 + f.phase) * 0.1;
      if (f.x < -10) f.x = w + 10; if (f.x > w + 10) f.x = -10;
      if (f.y < -10) f.y = h + 10; if (f.y > h + 10) f.y = -10;

      const glow = 0.25 + 0.3 * (0.5 + 0.5 * Math.sin(t * f.speed * 1.6 + f.phase));
      const color = f.warm ? "165, 180, 252" : "142, 197, 255";
      const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
      grad.addColorStop(0, `rgba(${color}, ${glow})`);
      grad.addColorStop(1, `rgba(${color}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(${color}, ${Math.min(glow + 0.35, 0.9)})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(drawFireflies);
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

  /* ---------- переключатель языков (свитч) ---------- */
  function updateLangSwitch() {
    const idx = LANGS.indexOf(lang);
    $("langThumb").style.transform = `translateX(${idx * 46}px)`;
    $("langSwitch").querySelectorAll("button").forEach((b) =>
      b.classList.toggle("active", b.dataset.lang === lang)
    );
  }
  function setLang(l) {
    if (!LANGS.includes(l) || l === lang) return;
    lang = l;
    localStorage.setItem("lang", lang);
    render();
    bootTerminal(true);
  }
  $("langSwitch").querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => setLang(b.dataset.lang))
  );

  /* ---------- терминал в hero ---------- */
  const termBody = $("termBody");
  const termInput = $("termInput");
  let bootTimers = [];

  function termPrint(text, isCmd = false) {
    const line = document.createElement("div");
    line.className = "term__line";
    if (isCmd) {
      line.innerHTML = `<span class="accent">$</span> <span class="term__cmd"></span>`;
      line.querySelector(".term__cmd").textContent = text;
    } else {
      line.textContent = text;
    }
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }

  // автонабор строки в теле терминала, как будто печатает человек
  function termTypeLine(text, isCmd, done) {
    const line = document.createElement("div");
    line.className = "term__line";
    let target = line;
    if (isCmd) {
      line.innerHTML = `<span class="accent">$</span> <span class="term__cmd"></span>`;
      target = line.querySelector(".term__cmd");
    }
    termBody.appendChild(line);
    let i = 0;
    const iv = setInterval(() => {
      target.textContent = text.slice(0, ++i);
      termBody.scrollTop = termBody.scrollHeight;
      if (i >= text.length) { clearInterval(iv); done && done(); }
    }, isCmd ? 65 : 10);
    bootTimers.push(iv);
  }

  function bootTerminal(instant = false) {
    bootTimers.forEach(clearInterval);
    bootTimers = [];
    termBody.innerHTML = "";
    const lines = CONTENT[lang].terminal.boot;
    if (instant) {
      lines.forEach((l) => termPrint(l.text, l.cmd));
      return;
    }
    let i = 0;
    (function next() {
      if (i >= lines.length) return;
      const l = lines[i++];
      termTypeLine(l.text, l.cmd, () => setTimeout(next, 420));
    })();
  }

  function renderTermChips(t) {
    $("termChips").innerHTML = t.terminal.chips
      .map((c) => `<button class="term__chip mono" data-cmd="${c}">${c}</button>`)
      .join("");
    $("termChips").querySelectorAll(".term__chip").forEach((btn) =>
      btn.addEventListener("click", () => runCommand(btn.dataset.cmd))
    );
  }

  function runCommand(raw) {
    const t = CONTENT[lang].terminal;
    const [cmd, arg] = raw.trim().toLowerCase().split(/\s+/);
    if (!cmd) return;
    termPrint(raw, true);
    switch (cmd) {
      case "clear": termBody.innerHTML = ""; break;
      case "help": termPrint(t.help); break;
      case "whoami": termPrint(t.whoami); break;
      case "stack": termPrint(t.stack); break;
      case "contact": termPrint(t.contact); break;
      case "cv": termPrint(t.cv); $("experience").scrollIntoView(); break;
      case "materials": termPrint(t.materials); $("materials").scrollIntoView(); break;
      case "mentor": termPrint(t.mentor); $("mentoring").scrollIntoView(); break;
      case "coffee": termPrint(t.coffee); break;
      case "matrix":
        termPrint(t.matrix);
        matrixUntil = Date.now() + 7000;
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "lang":
        if (LANGS.includes(arg)) { termPrint(t.langDone); setLang(arg); }
        else termPrint(t.langUsage);
        break;
      default: termPrint(t.unknown);
    }
  }

  termInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const v = termInput.value;
    termInput.value = "";
    runCommand(v);
  });

  // ` из любого места — фокус на терминал
  document.addEventListener("keydown", (e) => {
    const tag = document.activeElement.tagName;
    if (e.key === "`" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
      e.preventDefault();
      $("hero").scrollIntoView({ behavior: "smooth" });
      termInput.focus({ preventScroll: true });
    }
  });

  /* ---------- init ---------- */
  render();
  resizeCanvas();
  requestAnimationFrame(drawFireflies);
  bootTerminal();
  if (!reducedMotion) {
    requestAnimationFrame(plxLoop);
    if (matchMedia("(pointer: fine)").matches) requestAnimationFrame(lensLoop);
  }
})();
