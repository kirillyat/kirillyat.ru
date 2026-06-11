/**
 * Весь контент сайта живёт здесь — правь этот файл, остальное трогать не нужно.
 * Записи, помеченные TODO, — заглушки: замени на свои реальные данные.
 */
const CONTENT = {
  ru: {
    nav: [
      { href: "#about", label: "обо мне" },
      { href: "#experience", label: "опыт" },
      { href: "#skills", label: "стек" },
      { href: "#talks", label: "лекции" },
      { href: "#contact", label: "контакт" },
    ],
    hero: {
      hello: "// привет, я",
      name: "Кирилл\nЯценко",
      roles: ["software engineer", "backend developer", "лектор и ментор", "строю инфраструктуру"],
      tagline:
        "Проектирую и запускаю бэкенд-системы: от API и баз данных до Kubernetes и пайплайнов деплоя. Читаю лекции и менторю разработчиков.",
      ctaContact: "Связаться",
      ctaCv: "Смотреть CV",
      scroll: "скролль вниз",
    },
    about: {
      title: "Обо мне",
      bento: [
        {
          size: "wide",
          title: "Кто я",
          body:
            "Инженер, которому интересно всё: от чистоты доменной модели до того, почему под не шедулится. Люблю системы, которые легко читать, деплоить и чинить.",
        },
        { size: "stat", value: "5+", label: "лет в разработке" }, // TODO: проверь цифру
        { size: "stat", value: "∞", label: "выпитого кофе" },
        {
          size: "tall",
          title: "Сейчас",
          body: "Software Engineer в Twelve — финтех для Африки. Бэкенд, Kubernetes, Kafka, PostgreSQL.",
          status: "открыт к интересным проектам",
        },
        {
          size: "normal",
          title: "Преподаю",
          body: "Читаю лекции по REST API, архитектуре и инфраструктуре. Менторю джунов и мидлов.",
        },
        {
          size: "normal",
          title: "База",
          body: "Москва · UTC+3", // TODO: проверь город
        },
      ],
    },
    experience: {
      title: "Опыт",
      jobs: [
        {
          period: "2024 — сейчас", // TODO: проверь даты
          company: "Twelve",
          role: "Software Engineer",
          desc:
            "Финтех-платформа для африканского рынка. Бэкенд-сервисы, деплой в Kubernetes (Servercore), интеграции через Kafka, PostgreSQL, Redis.",
          tags: ["Python", "Kubernetes", "Kafka", "PostgreSQL"],
        },
        {
          period: "2022 — 2024", // TODO: заполни реальным опытом
          company: "Компания N",
          role: "Backend Developer",
          desc: "TODO: опиши, что делал — продукт, команда, твоя зона ответственности и результаты.",
          tags: ["Python", "Django", "Docker"],
        },
        {
          period: "2020 — 2022", // TODO: заполни реальным опытом
          company: "Компания M",
          role: "Junior Developer",
          desc: "TODO: опиши первый опыт — с чего начинал и чему научился.",
          tags: ["Python", "SQL"],
        },
      ],
    },
    skills: {
      title: "Стек",
      groups: [
        { name: "Языки", items: ["Python", "SQL", "Bash", "JavaScript", "Go"] },
        { name: "Бэкенд", items: ["Django", "FastAPI", "REST API", "gRPC", "Celery"] },
        { name: "Данные", items: ["PostgreSQL", "Redis", "Kafka", "SQLite"] },
        { name: "Инфраструктура", items: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "Nginx"] },
      ],
    },
    talks: {
      title: "Лекции и менторство",
      items: [
        {
          title: "REST API: от глаголов HTTP до версионирования",
          desc: "Лекция о проектировании REST API: ресурсы, статус-коды, пагинация, обратная совместимость.",
          tag: "лекция",
        },
        {
          title: "Менторство 1:1",
          desc: "Помогаю расти джунам и мидлам: разбор кода, архитектура, подготовка к собеседованиям.",
          tag: "менторство",
        },
      ],
    },
    contact: {
      title: "Контакт",
      lead: "Хочешь обсудить проект, лекцию или просто поговорить про инженерное — пиши.",
      email: "kirill.yatsenko@twelve.africa", // TODO: замени на личную почту, если нужно
      copyHint: "клик — скопировать",
      copied: "скопировано ✓",
      socials: [
        { label: "GitHub", url: "https://github.com/kirillyat" },
        { label: "Telegram", url: "https://t.me/kirillyat" }, // TODO: проверь ник
        { label: "LinkedIn", url: "https://linkedin.com/in/kirillyat" }, // TODO: проверь ссылку
      ],
    },
    footer: {
      left: "© 2026 Кирилл Яценко",
      hint: "нажми ` — там терминал",
    },
    terminal: {
      welcome: "Добро пожаловать. Набери `help`, чтобы посмотреть команды.",
      help: "доступные команды: whoami · stack · cv · contact · clear · exit",
      whoami: "Кирилл Яценко — software engineer. Бэкенд, инфраструктура, лекции.",
      stack: "Python · Kubernetes · Kafka · PostgreSQL · Redis · Terraform",
      cv: "листай страницу выше — там всё CV. или пиши на почту за PDF.",
      contact: "kirill.yatsenko@twelve.africa · github.com/kirillyat",
      unknown: "команда не найдена. набери `help`.",
    },
  },

  en: {
    nav: [
      { href: "#about", label: "about" },
      { href: "#experience", label: "experience" },
      { href: "#skills", label: "stack" },
      { href: "#talks", label: "talks" },
      { href: "#contact", label: "contact" },
    ],
    hero: {
      hello: "// hi, i'm",
      name: "Kirill\nYatsenko",
      roles: ["software engineer", "backend developer", "lecturer & mentor", "building infrastructure"],
      tagline:
        "I design and ship backend systems: from APIs and databases to Kubernetes and deploy pipelines. I also lecture and mentor developers.",
      ctaContact: "Get in touch",
      ctaCv: "View CV",
      scroll: "scroll down",
    },
    about: {
      title: "About",
      bento: [
        {
          size: "wide",
          title: "Who I am",
          body:
            "An engineer curious about everything: from clean domain models to why a pod won't schedule. I love systems that are easy to read, deploy and fix.",
        },
        { size: "stat", value: "5+", label: "years in software" },
        { size: "stat", value: "∞", label: "coffee consumed" },
        {
          size: "tall",
          title: "Currently",
          body: "Software Engineer at Twelve — fintech for Africa. Backend, Kubernetes, Kafka, PostgreSQL.",
          status: "open to interesting projects",
        },
        {
          size: "normal",
          title: "Teaching",
          body: "I lecture on REST APIs, architecture and infrastructure. Mentoring juniors and mid-level devs.",
        },
        {
          size: "normal",
          title: "Based in",
          body: "Moscow · UTC+3",
        },
      ],
    },
    experience: {
      title: "Experience",
      jobs: [
        {
          period: "2024 — now",
          company: "Twelve",
          role: "Software Engineer",
          desc:
            "Fintech platform for the African market. Backend services, Kubernetes deployments (Servercore), Kafka integrations, PostgreSQL, Redis.",
          tags: ["Python", "Kubernetes", "Kafka", "PostgreSQL"],
        },
        {
          period: "2022 — 2024",
          company: "Company N",
          role: "Backend Developer",
          desc: "TODO: describe what you built — product, team, your scope and impact.",
          tags: ["Python", "Django", "Docker"],
        },
        {
          period: "2020 — 2022",
          company: "Company M",
          role: "Junior Developer",
          desc: "TODO: describe your first role — where you started and what you learned.",
          tags: ["Python", "SQL"],
        },
      ],
    },
    skills: {
      title: "Stack",
      groups: [
        { name: "Languages", items: ["Python", "SQL", "Bash", "JavaScript", "Go"] },
        { name: "Backend", items: ["Django", "FastAPI", "REST API", "gRPC", "Celery"] },
        { name: "Data", items: ["PostgreSQL", "Redis", "Kafka", "SQLite"] },
        { name: "Infrastructure", items: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "Nginx"] },
      ],
    },
    talks: {
      title: "Talks & mentoring",
      items: [
        {
          title: "REST API: from HTTP verbs to versioning",
          desc: "A lecture on REST API design: resources, status codes, pagination, backwards compatibility.",
          tag: "lecture",
        },
        {
          title: "1:1 Mentoring",
          desc: "Helping juniors and mid-level devs grow: code reviews, architecture, interview prep.",
          tag: "mentoring",
        },
      ],
    },
    contact: {
      title: "Contact",
      lead: "Want to discuss a project, a lecture, or just talk engineering — drop me a line.",
      email: "kirill.yatsenko@twelve.africa",
      copyHint: "click to copy",
      copied: "copied ✓",
      socials: [
        { label: "GitHub", url: "https://github.com/kirillyat" },
        { label: "Telegram", url: "https://t.me/kirillyat" },
        { label: "LinkedIn", url: "https://linkedin.com/in/kirillyat" },
      ],
    },
    footer: {
      left: "© 2026 Kirill Yatsenko",
      hint: "press ` — there's a terminal",
    },
    terminal: {
      welcome: "Welcome. Type `help` to see available commands.",
      help: "available commands: whoami · stack · cv · contact · clear · exit",
      whoami: "Kirill Yatsenko — software engineer. Backend, infrastructure, lectures.",
      stack: "Python · Kubernetes · Kafka · PostgreSQL · Redis · Terraform",
      cv: "scroll the page above — that's the CV. or email me for a PDF.",
      contact: "kirill.yatsenko@twelve.africa · github.com/kirillyat",
      unknown: "command not found. type `help`.",
    },
  },
};
