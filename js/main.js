/* ============================================================
   kirillyat.ru — рендер контента и интерактив
   ============================================================ */
(() => {
  const $ = (id) => document.getElementById(id);
  const LANGS = ["ru", "en", "fr"];
  let lang = localStorage.getItem("lang");
  if (!LANGS.includes(lang)) lang = "ru";
  let typeTimer = null;
  const lerp = (a, b, t) => a + (b - a) * t;
  const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)));

  /* ---------- рендер контента из CONTENT[lang] ---------- */
  function render() {
    const t = CONTENT[lang];
    document.documentElement.lang = lang;

    $("navLinks").innerHTML =
      `<span class="nav__blob" id="navBlob"></span>` +
      t.nav.map((l) => `<a href="${l.href}">${l.label}</a>`).join("");
    updateLangSwitch();
    navBlobInit();

    // оверлайны секций — из подписей навигации
    [["aboutOver", 0], ["expOver", 1], ["skillsOver", 2], ["matOver", 3], ["menOver", 4], ["contactOver", 5]]
      .forEach(([id, i]) => { $(id).textContent = `${String(i + 1).padStart(2, "0")} — ${t.nav[i].label}`; });

    $("heroHello").textContent = t.hero.hello;
    $("heroName").textContent = t.hero.name;
    $("heroTagline").textContent = t.hero.tagline;
    $("ctaMentor").textContent = t.hero.ctaMentor;
    $("ctaContact").textContent = t.hero.ctaContact;
    $("scrollLabel").textContent = t.hero.scroll;

    $("sunTitle").textContent = t.sun.title;
    $("sunHint").textContent = t.sun.hint;
    updateSunCaption();

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
    const interactive = e.target.closest("a, button, .tilt, input, select, textarea, .sun-card");
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

  /* ---------- nav: прогресс с бегуном + active link + liquid blob ---------- */
  const nav = $("nav");
  const sections = ["about", "experience", "skills", "materials", "mentoring", "contact"];
  let activeSection = "";
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    $("progressBar").style.width = `${pct}%`;
    $("progressRunner").style.left = `${pct}%`;
    nav.classList.toggle("scrolled", h.scrollTop > 24);

    let current = "";
    for (const id of sections) {
      const el = $(id);
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
    }
    if (current !== activeSection) {
      activeSection = current;
      document.querySelectorAll(".nav__links a").forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${current}`)
      );
      navBlobTo(document.querySelector(".nav__links a.active"));
    }
  }, { passive: true });

  /* ---------- liquid blob в навигации: пружинная физика ---------- */
  const blobState = { x: 0, w: 60, vx: 0, vw: 0, tx: 0, tw: 60, on: false };
  function navBlobTo(link) {
    const blob = $("navBlob");
    if (!link) { blob.style.opacity = "0"; blobState.on = false; return; }
    blobState.tx = link.offsetLeft;
    blobState.tw = link.offsetWidth;
    if (!blobState.on) { blobState.x = blobState.tx; blobState.w = blobState.tw; blobState.on = true; }
    blob.style.opacity = "1";
  }
  function navBlobInit() {
    const links = document.querySelectorAll(".nav__links a");
    links.forEach((a) => {
      a.addEventListener("pointerenter", () => navBlobTo(a));
    });
    $("navLinks").addEventListener("pointerleave", () =>
      navBlobTo(document.querySelector(".nav__links a.active"))
    );
  }
  function blobLoop() {
    const blob = $("navBlob");
    if (blob && blobState.on) {
      // пружина: бегунок перетекает с лёгким перехлёстом, как жидкость
      const k = 0.16, d = 0.72;
      blobState.vx = (blobState.vx + (blobState.tx - blobState.x) * k) * d;
      blobState.vw = (blobState.vw + (blobState.tw - blobState.w) * k) * d;
      blobState.x += blobState.vx;
      blobState.w += blobState.vw;
      // от скорости — лёгкое «растяжение» капли
      const squish = Math.min(Math.abs(blobState.vx) * 0.012, 0.18);
      blob.style.transform = `translateX(${blobState.x}px) scaleY(${1 - squish})`;
      blob.style.width = `${blobState.w}px`;
    }
    requestAnimationFrame(blobLoop);
  }

  /* ---------- солнечный слайдер: тяни — меняется свет ---------- */
  // t: 0 = рассвет (5:00), 1 = полдень (12:00)
  let dayT = parseFloat(localStorage.getItem("dayT"));
  if (isNaN(dayT)) dayT = 0.35;
  const DAWN = { sky: [255, 190, 140], sun: [255, 150, 70], glow: 0.7 };
  const NOON = { sky: [120, 180, 250], sun: [255, 226, 150], glow: 0.95 };

  function updateSunScene() {
    const t = dayT;
    const sky = mix(DAWN.sky, NOON.sky, t);
    const sun = mix(DAWN.sun, NOON.sun, t);
    const glow = lerp(DAWN.glow, NOON.glow, t);
    $("skyBlob").style.background =
      `radial-gradient(ellipse, rgba(${sky.join(",")}, 0.5), transparent 65%)`;
    $("sunBlob").style.background =
      `radial-gradient(circle, rgba(${sun.join(",")}, ${glow * 0.6}), rgba(${sun.join(",")}, 0.14) 38%, transparent 62%)`;
    $("sunBlob").style.left = `${lerp(-4, 34, t)}vmax`;
    $("sunBlob").style.top = `${lerp(6, -22, t)}vmax`;

    // солнце в карточке: по дуге от горизонта слева (рассвет) к зениту (полдень)
    const a = ((170 - t * 80) * Math.PI) / 180;
    $("sunDot").style.left = `${50 + 41 * Math.cos(a)}%`;
    $("sunDot").style.bottom = `${-10 + 80 * Math.sin(a)}%`;

    // время 5:00 → 12:00
    const mins = Math.round(300 + t * 420);
    $("sunTime").textContent =
      `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
    updateSunCaption();
  }
  function updateSunCaption() {
    const caps = CONTENT[lang].sun.captions;
    const idx = dayT < 0.18 ? 0 : dayT < 0.45 ? 1 : dayT < 0.75 ? 2 : 3;
    $("sunCaption").textContent = caps[idx];
  }

  const sunSky = $("sunSky");
  let sunDrag = false;
  function sunFromEvent(e) {
    const r = sunSky.getBoundingClientRect();
    dayT = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    localStorage.setItem("dayT", dayT.toFixed(3));
    updateSunScene();
  }
  $("sunCard").addEventListener("pointerdown", (e) => { sunDrag = true; sunFromEvent(e); });
  window.addEventListener("pointermove", (e) => { if (sunDrag) sunFromEvent(e); });
  window.addEventListener("pointerup", () => { sunDrag = false; });

  /* ---------- canvas: пыльца в утреннем свете ---------- */
  const canvas = $("heroCanvas");
  const ctx = canvas.getContext("2d");
  let pollen = [];
  const mouse = { x: -9999, y: -9999 };

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    const count = Math.min(40, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 38000));
    pollen = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vy: -(0.08 + Math.random() * 0.2),
      r: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.6,
      gold: Math.random() < 0.4,
    }));
  }

  function drawPollen(now) {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    const t = now / 1000;
    for (const p of pollen) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d = Math.hypot(dx, dy);
      if (d < 90 && d > 0) {
        p.x += (dx / d) * 0.3;
        p.y += (dy / d) * 0.3;
      }
      p.x += Math.sin(t * p.speed + p.phase) * 0.2;
      p.y += p.vy;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;

      const tw = 0.35 + 0.3 * (0.5 + 0.5 * Math.sin(t * p.speed * 1.4 + p.phase));
      const color = p.gold ? "255, 200, 110" : "255, 255, 255";
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
      grad.addColorStop(0, `rgba(${color}, ${tw})`);
      grad.addColorStop(1, `rgba(${color}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(drawPollen);
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
    $("langThumb").style.transform = `translateX(${idx * 44}px)`;
    $("langSwitch").querySelectorAll("button").forEach((b) =>
      b.classList.toggle("active", b.dataset.lang === lang)
    );
  }
  function setLang(l) {
    if (!LANGS.includes(l) || l === lang) return;
    lang = l;
    localStorage.setItem("lang", lang);
    render();
  }
  $("langSwitch").querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => setLang(b.dataset.lang))
  );

  /* ---------- init ---------- */
  render();
  updateSunScene();
  resizeCanvas();
  requestAnimationFrame(drawPollen);
  requestAnimationFrame(blobLoop);
  if (!reducedMotion) {
    requestAnimationFrame(plxLoop);
    if (matchMedia("(pointer: fine)").matches) requestAnimationFrame(lensLoop);
  }
})();
