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
    renderSunPresets();
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
    lensPos.ts = interactive ? 2.3 : 1;
  });
  document.addEventListener("pointerleave", () => { lens.style.opacity = "0"; lensSeen = false; });
  function lensLoop() {
    lensPos.x += (lensPos.tx - lensPos.x) * 0.16;
    lensPos.y += (lensPos.ty - lensPos.y) * 0.16;
    lensPos.s += (lensPos.ts - lensPos.s) * 0.12;
    lens.style.transform = `translate(${lensPos.x - 18}px, ${lensPos.y - 18}px) scale(${lensPos.s.toFixed(3)})`;
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
    $("progressHead").style.left = `${pct}%`;
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

  /* ---------- солнечный слайдер: полный цикл дня ----------
     t: 0 = рассвет (5:00) → 0.55 = день → 0.78 = закат → 1 = ночь (23:00).
     Все цвета темы интерполируются между опорными точками и
     записываются в CSS-переменные — страница «живёт» при перетаскивании. */
  // t из реального локального времени посетителя: 5:00 → 23:00; ночь вне диапазона
  function tFromNow() {
    const d = new Date();
    const mins = d.getHours() * 60 + d.getMinutes();
    if (mins < 300 || mins > 1380) return 1;
    return Math.min(1, (mins - 300) / 1080);
  }
  // по умолчанию свет соответствует времени суток посетителя,
  // пока он сам не подвинет солнце
  let dayAuto = localStorage.getItem("dayAuto") !== "0";
  let dayT = parseFloat(localStorage.getItem("dayT"));
  if (dayAuto || isNaN(dayT)) dayT = tFromNow();

  let sunTweenId = null;
  function tweenDay(target) {
    cancelAnimationFrame(sunTweenId);
    const from = dayT;
    const t0 = performance.now();
    (function step(now) {
      const p = Math.min((now - t0) / 700, 1);
      dayT = from + (target - from) * (1 - Math.pow(1 - p, 3));
      updateSunScene();
      if (p < 1) sunTweenId = requestAnimationFrame(step);
      else localStorage.setItem("dayT", dayT.toFixed(3));
    })(t0);
  }

  const SUN_PRESETS = { dawn: 0.02, day: 0.5, sunset: 0.78, night: 1 };
  function renderSunPresets() {
    const p = CONTENT[lang].sun.presets;
    $("sunPresets").innerHTML = [...Object.keys(SUN_PRESETS), "now"]
      .map((k) => `<button class="sun-card__preset" data-preset="${k}">${p[k]}</button>`)
      .join("");
    $("sunPresets").querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const k = b.dataset.preset;
        dayAuto = k === "now";
        localStorage.setItem("dayAuto", dayAuto ? "1" : "0");
        tweenDay(k === "now" ? tFromNow() : SUN_PRESETS[k]);
      })
    );
    updateSunPresets();
  }
  function updateSunPresets() {
    $("sunPresets").querySelectorAll("button").forEach((b) => {
      const k = b.dataset.preset;
      const active = k === "now" ? dayAuto : !dayAuto && Math.abs(dayT - SUN_PRESETS[k]) < 0.05;
      b.classList.toggle("active", active);
    });
  }

  // опорные точки палитры: [t, значения]
  const STOPS = [
    { t: 0.00, bg: [247, 238, 228], text: [33, 38, 54], dim: [110, 108, 118],
      accent: [226, 125, 70], accentDeep: [191, 95, 44], grass: [110, 160, 95],
      glassK: 1, borderA: 0.85, edgeA: 0.9, shadow: [120, 70, 40, 0.16],
      chipA: 0.45, inputA: 0.6, hair: [60, 45, 40, 0.1],
      ghostF: [60, 45, 40, 0.03], ghostS: [60, 45, 40, 0.08], spec: 0.45,
      dayTop: [255, 208, 166], dayMid: [250, 235, 219], dayBot: [236, 238, 224],
      sky: [255, 178, 118, 0.5], sun: [255, 140, 60, 0.42],
      cardTop: [255, 196, 150, 0.45], cardBot: [255, 236, 200, 0.35] },
    { t: 0.30, bg: [238, 244, 250], text: [22, 36, 58], dim: [93, 111, 134],
      accent: [61, 142, 240], accentDeep: [34, 113, 212], grass: [58, 165, 100],
      glassK: 1, borderA: 0.9, edgeA: 0.95, shadow: [35, 80, 140, 0.14],
      chipA: 0.5, inputA: 0.65, hair: [22, 36, 58, 0.08],
      ghostF: [22, 36, 58, 0.025], ghostS: [22, 36, 58, 0.07], spec: 0.4,
      dayTop: [220, 236, 253], dayMid: [234, 243, 252], dayBot: [238, 246, 238],
      sky: [120, 180, 250, 0.5], sun: [255, 205, 120, 0.33],
      cardTop: [150, 200, 250, 0.35], cardBot: [255, 240, 210, 0.3] },
    { t: 0.55, bg: [235, 245, 253], text: [18, 36, 62], dim: [88, 110, 136],
      accent: [44, 132, 240], accentDeep: [26, 105, 205], grass: [52, 162, 96],
      glassK: 1, borderA: 0.92, edgeA: 0.95, shadow: [30, 80, 145, 0.13],
      chipA: 0.5, inputA: 0.65, hair: [18, 36, 62, 0.08],
      ghostF: [18, 36, 62, 0.025], ghostS: [18, 36, 62, 0.07], spec: 0.42,
      dayTop: [178, 217, 252], dayMid: [224, 240, 252], dayBot: [234, 247, 239],
      sky: [80, 162, 250, 0.55], sun: [255, 236, 168, 0.3],
      cardTop: [120, 185, 250, 0.4], cardBot: [220, 242, 225, 0.35] },
    { t: 0.78, bg: [244, 233, 228], text: [44, 35, 56], dim: [122, 104, 116],
      accent: [232, 116, 88], accentDeep: [198, 84, 60], grass: [96, 148, 92],
      glassK: 0.85, borderA: 0.8, edgeA: 0.85, shadow: [110, 55, 60, 0.18],
      chipA: 0.42, inputA: 0.58, hair: [70, 45, 55, 0.1],
      ghostF: [70, 45, 55, 0.03], ghostS: [70, 45, 55, 0.08], spec: 0.4,
      dayTop: [255, 184, 144], dayMid: [248, 222, 211], dayBot: [228, 226, 224],
      sky: [255, 146, 104, 0.5], sun: [255, 116, 64, 0.45],
      cardTop: [255, 160, 120, 0.5], cardBot: [120, 110, 160, 0.3] },
    { t: 1.00, bg: [13, 19, 34], text: [232, 237, 246], dim: [144, 158, 180],
      accent: [127, 183, 255], accentDeep: [158, 203, 255], grass: [98, 158, 118],
      glassK: 0.16, borderA: 0.18, edgeA: 0.22, shadow: [0, 0, 0, 0.5],
      chipA: 0.06, inputA: 0.07, hair: [255, 255, 255, 0.1],
      ghostF: [255, 255, 255, 0.02], ghostS: [255, 255, 255, 0.06], spec: 0.14,
      dayTop: [9, 14, 28], dayMid: [13, 19, 34], dayBot: [11, 20, 27],
      sky: [62, 92, 178, 0.32], sun: [198, 218, 255, 0.2],
      cardTop: [16, 24, 46, 0.85], cardBot: [22, 36, 52, 0.7] },
  ];

  function sampleStops(t) {
    let a = STOPS[0], b = STOPS[STOPS.length - 1];
    for (let i = 0; i < STOPS.length - 1; i++) {
      if (t >= STOPS[i].t && t <= STOPS[i + 1].t) { a = STOPS[i]; b = STOPS[i + 1]; break; }
    }
    const u = b.t === a.t ? 0 : (t - a.t) / (b.t - a.t);
    const out = {};
    for (const k of Object.keys(a)) {
      out[k] = Array.isArray(a[k]) ? a[k].map((v, i) => lerp(v, b[k][i], u)) : lerp(a[k], b[k], u);
    }
    return out;
  }
  const rgb = (c) => `rgb(${c.slice(0, 3).map(Math.round).join(",")})`;
  const rgba = (c, aOverride) =>
    `rgba(${c.slice(0, 3).map(Math.round).join(",")}, ${(aOverride ?? c[3]).toFixed(3)})`;

  function updateSunScene() {
    const t = dayT;
    const s = sampleStops(t);
    const R = document.documentElement.style;

    R.setProperty("--bg", rgb(s.bg));
    R.setProperty("--text", rgb(s.text));
    R.setProperty("--text-dim", rgb(s.dim));
    R.setProperty("--accent", rgb(s.accent));
    R.setProperty("--accent-deep", rgb(s.accentDeep));
    R.setProperty("--accent-dim", rgba([...s.accent, 0.13]));
    R.setProperty("--grass", rgb(s.grass));
    const g = s.glassK;
    R.setProperty("--glass",
      `linear-gradient(160deg, rgba(255,255,255,${(0.34 * g).toFixed(3)}), rgba(255,255,255,${(0.13 * g).toFixed(3)}) 45%, rgba(255,255,255,${(0.06 * g).toFixed(3)}) 80%, rgba(255,255,255,${(0.18 * g).toFixed(3)}))`);
    R.setProperty("--glass-border", `rgba(255,255,255,${(s.borderA * 0.85).toFixed(3)})`);
    const e = s.edgeA;
    R.setProperty("--ring",
      `linear-gradient(160deg, rgba(255,255,255,${(e * 0.95).toFixed(3)}), rgba(255,255,255,${(e * 0.15).toFixed(3)}) 40%, rgba(255,255,255,${(e * 0.6).toFixed(3)}) 70%, rgba(255,255,255,${(e * 0.25).toFixed(3)}))`);
    R.setProperty("--glass-edge",
      `inset 0 1px 0 rgba(255,255,255,${e.toFixed(3)}), inset 1px 0 0 rgba(255,255,255,${(e * 0.42).toFixed(3)}), inset 0 -1px 0 rgba(255,255,255,${(e * 0.26).toFixed(3)}), 0 0 0 0.5px rgba(255,255,255,${(e * 0.5).toFixed(3)})`);
    R.setProperty("--glass-shadow",
      `0 20px 50px ${rgba(s.shadow)}, 0 3px 10px ${rgba(s.shadow, s.shadow[3] * 0.5)}`);
    R.setProperty("--chip-bg", `rgba(255,255,255,${s.chipA.toFixed(3)})`);
    R.setProperty("--chip-border", `rgba(255,255,255,${Math.min(s.borderA, 0.9).toFixed(3)})`);
    R.setProperty("--input-bg", `rgba(255,255,255,${s.inputA.toFixed(3)})`);
    R.setProperty("--input-border", `rgba(255,255,255,${s.borderA.toFixed(3)})`);
    R.setProperty("--hairline", rgba(s.hair));
    R.setProperty("--ghost-fill", rgba(s.ghostF));
    R.setProperty("--ghost-stroke", rgba(s.ghostS));
    R.setProperty("--blob-bg",
      `linear-gradient(160deg, rgba(255,255,255,${Math.min(0.95, 0.95 * (g + 0.25)).toFixed(3)}), rgba(255,255,255,${(0.55 * (g + 0.25)).toFixed(3)}))`);
    R.setProperty("--spec", `rgba(255,255,255,${s.spec.toFixed(3)})`);
    R.setProperty("--pop-bg", rgba([...s.bg, 0.92]));

    // сцена на фоне
    document.querySelector(".day").style.background =
      `linear-gradient(180deg, ${rgb(s.dayTop)} 0%, ${rgb(s.dayMid)} 45%, ${rgb(s.dayBot)} 100%)`;
    $("skyBlob").style.background =
      `radial-gradient(ellipse, ${rgba(s.sky)}, transparent 65%)`;
    $("sunBlob").style.background =
      `radial-gradient(circle, ${rgba(s.sun)}, ${rgba(s.sun, s.sun[3] * 0.3)} 38%, transparent 62%)`;
    $("sunBlob").style.left = `${lerp(-4, 38, t)}vmax`;
    $("sunBlob").style.top = `${t < 0.55 ? lerp(6, -22, t / 0.55) : lerp(-22, 10, (t - 0.55) / 0.45)}vmax`;

    // солнце в карточке: полная дуга — восход слева, зенит, закат справа
    const a = ((170 - t * 160) * Math.PI) / 180;
    $("sunDot").style.left = `${50 + 41 * Math.cos(a)}%`;
    $("sunDot").style.bottom = `${-10 + 80 * Math.sin(a)}%`;
    $("sunDot").classList.toggle("moon", t > 0.85);
    $("sunNavIcon").classList.toggle("moon", t > 0.85);

    // небо в карточке, звёзды, трава тускнеет к ночи
    $("sunSky").style.background =
      `linear-gradient(180deg, ${rgba(s.cardTop)}, ${rgba(s.cardBot)} 75%, rgba(120,185,130,${(0.35 * (1 - Math.max(0, (t - 0.78) / 0.22) * 0.7)).toFixed(3)}))`;
    const nightK = Math.max(0, Math.min(1, (t - 0.78) / 0.22));
    $("sunStars").style.opacity = nightK.toFixed(2);
    $("sunHorizon").style.opacity = (1 - nightK * 0.6).toFixed(2);
    $("grassBlob").style.opacity = (1 - nightK * 0.7).toFixed(2);
    document.querySelector(".day__river").style.opacity = (1 - nightK * 0.6).toFixed(2);

    // время 5:00 → 23:00
    const mins = Math.round(300 + t * 1080);
    $("sunTime").textContent =
      `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
    updateSunCaption();
    updateSunPresets();
  }
  function updateSunCaption() {
    const caps = CONTENT[lang].sun.captions;
    const idx = dayT < 0.15 ? 0 : dayT < 0.45 ? 1 : dayT < 0.68 ? 2 : dayT < 0.88 ? 3 : 4;
    $("sunCaption").textContent = caps[idx];
  }

  /* ---------- попапы в навигации: открытие по hover,
     закрытие с льготной задержкой, чтобы курсор успел дойти ---------- */
  function bindNavPop(root, btn, keepOpen) {
    let closeTimer;
    root.addEventListener("pointerenter", () => {
      clearTimeout(closeTimer);
      root.classList.add("open");
    });
    root.addEventListener("pointerleave", () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        if (!keepOpen || !keepOpen()) root.classList.remove("open");
      }, 260);
    });
    // клик/тап по кнопке только открывает (hover уже мог открыть —
    // toggle закрывал бы прямо под пальцем); закрытие — уход курсора
    // или тап в любом месте вне попапа
    btn.addEventListener("click", () => {
      clearTimeout(closeTimer);
      root.classList.add("open");
    });
    document.addEventListener("pointerdown", (e) => {
      if (!root.contains(e.target)) root.classList.remove("open");
    });
  }

  const sunNav = $("sunNav");
  bindNavPop(sunNav, $("sunNavBtn"), () => sunDrag);

  const sunSky = $("sunSky");
  let sunDrag = false;
  function sunFromEvent(e) {
    cancelAnimationFrame(sunTweenId);
    dayAuto = false;
    localStorage.setItem("dayAuto", "0");
    const r = sunSky.getBoundingClientRect();
    dayT = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    localStorage.setItem("dayT", dayT.toFixed(3));
    updateSunScene();
  }
  $("sunCard").addEventListener("pointerdown", (e) => {
    if (e.target.closest(".sun-card__preset")) return;
    sunDrag = true;
    sunFromEvent(e);
  });
  window.addEventListener("pointermove", (e) => { if (sunDrag) sunFromEvent(e); });
  window.addEventListener("pointerup", () => {
    if (sunDrag && !sunNav.matches(":hover")) sunNav.classList.remove("open");
    sunDrag = false;
  });

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
      // днём — золотая пыльца, к ночи частицы становятся холодными «звёздами»
      const nightK = Math.max(0, Math.min(1, (dayT - 0.78) / 0.22));
      const color = p.gold
        ? mix([255, 200, 110], [200, 220, 255], nightK).join(", ")
        : mix([255, 255, 255], [220, 235, 255], nightK).join(", ");
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

  /* ---------- переключатель языков: кнопка-флаг + попап ---------- */
  const FLAGS = { ru: "🇷🇺", en: "🇬🇧", fr: "🇫🇷" };
  const LANG_NAMES = { ru: "Русский", en: "English", fr: "Français" };
  function updateLangSwitch() {
    $("langNavBtn").textContent = FLAGS[lang];
    $("langPop").innerHTML = LANGS.map(
      (l) =>
        `<button class="lang-pop__item${l === lang ? " active" : ""}" data-lang="${l}">
          <span>${FLAGS[l]}</span>${LANG_NAMES[l]}
        </button>`
    ).join("");
    $("langPop").querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        setLang(b.dataset.lang);
        $("langNav").classList.remove("open");
      })
    );
  }
  function setLang(l) {
    if (!LANGS.includes(l) || l === lang) return;
    lang = l;
    localStorage.setItem("lang", lang);
    render();
  }
  const langNav = $("langNav");
  bindNavPop(langNav, $("langNavBtn"));

  /* ---------- init ---------- */
  // настоящее преломление стекла — только там, где движок его умеет (Chromium)
  if (window.chrome && CSS.supports("backdrop-filter", "url(#lg-refract)")) {
    document.documentElement.classList.add("refract");
  }
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
