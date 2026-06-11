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
      roles: ["software engineer", "backend developer", "лектор и ментор"],
      tagline:
        "Проектирую и запускаю бэкенд-системы: API, базы данных, очереди сообщений и всё, что нужно, чтобы это надёжно работало в продакшене. Читаю лекции и менторю разработчиков.",
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
            "Инженер, которому интересно всё: от чистоты доменной модели до устройства продакшена. Люблю системы, которые легко читать, деплоить и чинить.",
        },
        { size: "stat", value: "5+", label: "лет в разработке" }, // TODO: проверь цифру
        { size: "stat", value: "∞", label: "выпитого кофе" },
        {
          size: "tall",
          title: "Сейчас",
          body: "Software engineer в финтехе: бэкенд, распределённые системы, интеграции.",
          status: "открыт к интересным проектам",
        },
        {
          size: "normal",
          title: "Преподаю",
          body: "Читаю лекции по REST API и архитектуре. Менторю джунов и мидлов.",
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
          company: "Финтех", // TODO: назови компанию, если захочешь
          role: "Software Engineer",
          desc:
            "Бэкенд-сервисы платёжной платформы: проектирование API, интеграции через Kafka, PostgreSQL, Redis, CI/CD-пайплайны.",
          tags: ["Python", "Kafka", "PostgreSQL", "Redis"],
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
        { name: "Инфраструктура", items: ["Docker", "GitHub Actions", "Terraform", "Kubernetes", "Nginx"] },
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
      email: "kirillyat@gmail.com",
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
      whoami: "Кирилл Яценко — software engineer. Бэкенд, лекции, менторство.",
      stack: "Python · PostgreSQL · Kafka · Redis · Docker",
      cv: "листай страницу выше — там всё CV. или пиши на почту за PDF.",
      contact: "kirillyat@gmail.com · github.com/kirillyat",
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
      roles: ["software engineer", "backend developer", "lecturer & mentor"],
      tagline:
        "I design and ship backend systems: APIs, databases, message queues and everything it takes to run them reliably in production. I also lecture and mentor developers.",
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
            "An engineer curious about everything: from clean domain models to how production really works. I love systems that are easy to read, deploy and fix.",
        },
        { size: "stat", value: "5+", label: "years in software" },
        { size: "stat", value: "∞", label: "coffee consumed" },
        {
          size: "tall",
          title: "Currently",
          body: "Software engineer in fintech: backend, distributed systems, integrations.",
          status: "open to interesting projects",
        },
        {
          size: "normal",
          title: "Teaching",
          body: "I lecture on REST APIs and architecture. Mentoring juniors and mid-level devs.",
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
          company: "Fintech",
          role: "Software Engineer",
          desc:
            "Backend services for a payment platform: API design, Kafka integrations, PostgreSQL, Redis, CI/CD pipelines.",
          tags: ["Python", "Kafka", "PostgreSQL", "Redis"],
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
        { name: "Infrastructure", items: ["Docker", "GitHub Actions", "Terraform", "Kubernetes", "Nginx"] },
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
      email: "kirillyat@gmail.com",
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
      whoami: "Kirill Yatsenko — software engineer. Backend, lectures, mentoring.",
      stack: "Python · PostgreSQL · Kafka · Redis · Docker",
      cv: "scroll the page above — that's the CV. or email me for a PDF.",
      contact: "kirillyat@gmail.com · github.com/kirillyat",
      unknown: "command not found. type `help`.",
    },
  },

  fr: {
    nav: [
      { href: "#about", label: "à propos" },
      { href: "#experience", label: "expérience" },
      { href: "#skills", label: "stack" },
      { href: "#talks", label: "cours" },
      { href: "#contact", label: "contact" },
    ],
    hero: {
      hello: "// salut, je suis",
      name: "Kirill\nYatsenko",
      roles: ["software engineer", "développeur backend", "enseignant & mentor"],
      tagline:
        "Je conçois et déploie des systèmes backend : API, bases de données, files de messages et tout ce qu'il faut pour les faire tourner en production de manière fiable. Je donne aussi des cours et accompagne des développeurs.",
      ctaContact: "Me contacter",
      ctaCv: "Voir le CV",
      scroll: "défiler",
    },
    about: {
      title: "À propos",
      bento: [
        {
          size: "wide",
          title: "Qui je suis",
          body:
            "Un ingénieur curieux de tout : des modèles de domaine propres au fonctionnement réel de la production. J'aime les systèmes faciles à lire, à déployer et à réparer.",
        },
        { size: "stat", value: "5+", label: "ans de développement" },
        { size: "stat", value: "∞", label: "cafés consommés" },
        {
          size: "tall",
          title: "Actuellement",
          body: "Software engineer dans la fintech : backend, systèmes distribués, intégrations.",
          status: "ouvert aux projets intéressants",
        },
        {
          size: "normal",
          title: "Enseignement",
          body: "Je donne des cours sur les API REST et l'architecture. Mentorat de développeurs juniors et confirmés.",
        },
        {
          size: "normal",
          title: "Basé à",
          body: "Moscou · UTC+3",
        },
      ],
    },
    experience: {
      title: "Expérience",
      jobs: [
        {
          period: "2024 — auj.",
          company: "Fintech",
          role: "Software Engineer",
          desc:
            "Services backend d'une plateforme de paiement : conception d'API, intégrations Kafka, PostgreSQL, Redis, pipelines CI/CD.",
          tags: ["Python", "Kafka", "PostgreSQL", "Redis"],
        },
        {
          period: "2022 — 2024",
          company: "Société N",
          role: "Développeur Backend",
          desc: "TODO : décris ce que tu as construit — produit, équipe, périmètre et résultats.",
          tags: ["Python", "Django", "Docker"],
        },
        {
          period: "2020 — 2022",
          company: "Société M",
          role: "Développeur Junior",
          desc: "TODO : décris ta première expérience — tes débuts et ce que tu as appris.",
          tags: ["Python", "SQL"],
        },
      ],
    },
    skills: {
      title: "Stack",
      groups: [
        { name: "Langages", items: ["Python", "SQL", "Bash", "JavaScript", "Go"] },
        { name: "Backend", items: ["Django", "FastAPI", "REST API", "gRPC", "Celery"] },
        { name: "Données", items: ["PostgreSQL", "Redis", "Kafka", "SQLite"] },
        { name: "Infrastructure", items: ["Docker", "GitHub Actions", "Terraform", "Kubernetes", "Nginx"] },
      ],
    },
    talks: {
      title: "Cours & mentorat",
      items: [
        {
          title: "API REST : des verbes HTTP au versionnage",
          desc: "Un cours sur la conception d'API REST : ressources, codes de statut, pagination, rétrocompatibilité.",
          tag: "cours",
        },
        {
          title: "Mentorat 1:1",
          desc: "J'aide les développeurs juniors et confirmés à progresser : revue de code, architecture, préparation aux entretiens.",
          tag: "mentorat",
        },
      ],
    },
    contact: {
      title: "Contact",
      lead: "Envie de discuter d'un projet, d'un cours ou simplement de parler ingénierie — écris-moi.",
      email: "kirillyat@gmail.com",
      copyHint: "clic pour copier",
      copied: "copié ✓",
      socials: [
        { label: "GitHub", url: "https://github.com/kirillyat" },
        { label: "Telegram", url: "https://t.me/kirillyat" },
        { label: "LinkedIn", url: "https://linkedin.com/in/kirillyat" },
      ],
    },
    footer: {
      left: "© 2026 Kirill Yatsenko",
      hint: "appuie sur ` — il y a un terminal",
    },
    terminal: {
      welcome: "Bienvenue. Tape `help` pour voir les commandes.",
      help: "commandes disponibles : whoami · stack · cv · contact · clear · exit",
      whoami: "Kirill Yatsenko — software engineer. Backend, cours, mentorat.",
      stack: "Python · PostgreSQL · Kafka · Redis · Docker",
      cv: "fais défiler la page — c'est le CV. ou écris-moi pour un PDF.",
      contact: "kirillyat@gmail.com · github.com/kirillyat",
      unknown: "commande introuvable. tape `help`.",
    },
  },
};
