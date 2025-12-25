/* Choosing Islam (multi-page) - shared utilities + layout
   - jQuery + Bootstrap only (no build step)
*/

const i18n = {
  en: {
    dir: "ltr",
    nav_home: "Home",
    nav_quran: "Quran",
    nav_books: "Books",
    nav_articles: "Articles",
    nav_videos: "Videos",
    nav_audios: "Audios",
    featured_articles: "Important Articles",
    contact_label: "Contact",
    home_title: "Choosing Islam",
    home_desc: "Choosing Islam is a platform dedicated to providing authentic Islamic knowledge through books, articles, Quran resources, videos, and audio content in multiple languages.",
    section_books: "Books",
    section_articles: "Articles",
    section_quran: "Quran",
    section_videos: "Videos",
    section_audios: "Audios",
    download_pdf: "Download PDF",
    download_word: "Download Word",
    read_more: "Read more",
    back: "Back",
    pdf_preview: "PDF Preview",
    languages: "Languages",
    available_in: "Available in",
    items: "items",
    not_found: "No items found.",
    watch: "Watch",
    listen: "Listen",
    related_books: "Related books",
    related_videos: "Related videos"
  },
  ar: {
    dir: "rtl",
    nav_home: "الرئيسية",
    nav_quran: "قرآن",
    nav_books: "كتب",
    nav_articles: "مقالات",
    nav_videos: "فيديوهات",
    nav_audios: "صوتيات",
    featured_articles: "مقالات مهمة",
    contact_label: "تواصل",
    home_title: "اختيار الإسلام",
    home_desc: "اختيار الإسلام منصة تهدف إلى تقديم المعرفة الإسلامية الموثوقة عبر الكتب والمقالات وموارد القرآن والفيديوهات والمحتوى الصوتي بعدة لغات.",
    section_books: "الكتب",
    section_articles: "المقالات",
    section_quran: "القرآن",
    section_videos: "الفيديوهات",
    section_audios: "الصوتيات",
    download_pdf: "تحميل PDF",
    download_word: "تحميل Word",
    read_more: "اقرأ المزيد",
    back: "رجوع",
    pdf_preview: "معاينة PDF",
    languages: "اللغات",
    available_in: "متاح بـ",
    items: "عنصر",
    not_found: "لا توجد عناصر.",
    watch: "شاهد",
    listen: "استمع",
    related_books: "كتب مرتبطة",
    related_videos: "فيديوهات مرتبطة"
  }
};

const state = {
  lang: localStorage.getItem("ci_lang") || "en",
  cache: {
    books: null,
    articles: null,
    videos: null,
    audios: null,
    quran: null,
    settings: null
  }
};

function t(key){
  return (i18n[state.lang] && i18n[state.lang][key]) ? i18n[state.lang][key] : key;
}

function safeText(s){
  return String(s || "").replace(/[<>&"']/g, m => ({
    "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;", "'":"&#039;"
  }[m]));
}

function applyDirection(){
  const dir = i18n[state.lang].dir || "ltr";
  $("html").attr("dir", dir).attr("lang", state.lang);
}

const api = {
  getBooks: () => $.getJSON("data/books.json"),
  getArticles: () => $.getJSON("data/articles.json"),
  getVideos: () => $.getJSON("data/videos.json"),
  getAudios: () => $.getJSON("data/audios.json"),
  getQuran: () => $.getJSON("data/quran.json"),
  getSettings: () => $.getJSON("data/settings.json")
};

async function ensureData(){
  if(!state.cache.settings) state.cache.settings = await api.getSettings();
  if(!state.cache.books) state.cache.books = await api.getBooks();
  if(!state.cache.articles) state.cache.articles = await api.getArticles();
  if(!state.cache.videos) state.cache.videos = await api.getVideos();
  if(!state.cache.audios) state.cache.audios = await api.getAudios();
  if(!state.cache.quran) state.cache.quran = await api.getQuran();
}

function langLabel(code){
  const map = { en: "English", ar: "العربية", fr: "Français", ur: "اردو" };
  return map[code] || code.toUpperCase();
}

function currentPage(){
  return document.body.getAttribute("data-page") || "home";
}

function setActiveNav(){
  const page = currentPage();
  $("[data-nav]").removeClass("active");
  $(`[data-nav="${page}"]`).addClass("active");
}

function buildNav(){
  const items = [
    { page:"home", href:"home.html", icon:"fa-house", label:t("nav_home") },
    { page:"quran", href:"quran.html", icon:"fa-book-quran", label:t("nav_quran") },
    { page:"books", href:"books.html", icon:"fa-book", label:t("nav_books") },
    { page:"articles", href:"articles.html", icon:"fa-newspaper", label:t("nav_articles") },
    { page:"videos", href:"videos.html", icon:"fa-video", label:t("nav_videos") },
    { page:"audios", href:"audios.html", icon:"fa-headphones", label:t("nav_audios") }
  ];

  return `
    <div class="navlist">
      ${items.map(x => `
        <a class="navitem" data-nav="${x.page}" href="${x.href}">
          <div class="navicon"><i class="fa-solid ${x.icon}"></i></div>
          <div class="navlabel">${safeText(x.label)}</div>
        </a>
      `).join("")}
    </div>
  `;
}

function buildLeftSidebar(){
  return `
    <aside class="leftbar" aria-label="Navigation">
      <div class="brand-mini">
        <div class="brand-logo"><img src="assets/logo.svg" alt="Choosing Islam logo"></div>
        <div class="brand-text">
          <h6 class="mb-0">Choosing Islam</h6>
          <small>Islamic Educational Library</small>
        </div>
      </div>
      ${buildNav()}
    </aside>
  `;
}

function buildRightSidebar(){
  return `
    <aside class="rightbar" aria-label="Important articles">
      <div class="d-flex align-items-center justify-content-between">
        <h6 class="mb-0">${safeText(t("featured_articles"))}</h6>
        <span class="badge-soft"><i class="fa-solid fa-star me-1"></i>${safeText(state.lang === "ar" ? "مميز" : "Featured")}</span>
      </div>

      <div class="mt-3">
        <div id="importantArticles" class="featured-list"></div>
      </div>

      <div class="mt-4 pt-3" style="border-top:1px solid rgba(255,255,255,.10); color:#a9b6d3; font-size:14px;">
        <div><i class="fa-solid fa-envelope me-2"></i>${safeText(t("contact_label"))}: <strong id="contactEmail"></strong></div>
        <div class="mt-2">© <span id="year"></span> Choosing Islam</div>
      </div>
    </aside>
  `;
}

function buildTopbar(){
  return `
    <div class="topbar">
      <div class="wrap">
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-ghost d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#drawerLeft" aria-controls="drawerLeft">
            <i class="fa-solid fa-bars"></i>
          </button>
          <a class="topbar-brand" href="home.html">
            <img src="assets/logo.svg" alt="Choosing Islam logo">
            <div>
              <div class="t">Choosing Islam</div>
              <div class="s">Islamic Educational Library</div>
            </div>
          </a>
        </div>

        <div class="topbar-actions">
          <div class="lang-switch">
            <button class="btn btn-sm btn-soft ${state.lang==="en" ? "active" : ""}" id="lang-en" type="button">
              English
            </button>
            <button class="btn btn-sm btn-soft ${state.lang==="ar" ? "active" : ""}" id="lang-ar" type="button">
              العربية
            </button>
          </div>
          <button class="btn btn-sm btn-ghost d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#drawerRight" aria-controls="drawerRight">
            <i class="fa-solid fa-star"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function buildDrawers(){
  // Reuse same content as desktop sidebars.
  return `
    <div class="offcanvas offcanvas-start text-bg-dark drawer" tabindex="-1" id="drawerLeft" aria-labelledby="drawerLeftLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="drawerLeftLabel">Menu</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body p-2">
        <div class="drawer-panel">
          <div class="brand-mini">
            <div class="brand-logo"><img src="assets/logo.svg" alt="Choosing Islam logo"></div>
            <div class="brand-text">
              <h6 class="mb-0">Choosing Islam</h6>
              <small>Islamic Educational Library</small>
            </div>
          </div>
          ${buildNav()}
        </div>
      </div>
    </div>

    <div class="offcanvas offcanvas-end text-bg-dark drawer" tabindex="-1" id="drawerRight" aria-labelledby="drawerRightLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="drawerRightLabel">${safeText(t("featured_articles"))}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body p-2">
        <div class="drawer-panel">
          <div class="d-flex align-items-center justify-content-between">
            <h6 class="mb-0">${safeText(t("featured_articles"))}</h6>
            <span class="badge-soft"><i class="fa-solid fa-star me-1"></i>${safeText(state.lang === "ar" ? "مميز" : "Featured")}</span>
          </div>
          <div class="mt-3">
            <div id="importantArticlesDrawer" class="featured-list"></div>
          </div>
          <div class="mt-4 pt-3" style="border-top:1px solid rgba(255,255,255,.10); color:#a9b6d3; font-size:14px;">
            <div><i class="fa-solid fa-envelope me-2"></i>${safeText(t("contact_label"))}: <strong id="contactEmailDrawer"></strong></div>
            <div class="mt-2">© <span id="yearDrawer"></span> Choosing Islam</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function mountLayout(){
  const html = `
    ${buildTopbar()}
    <div class="app-shell">
      ${buildLeftSidebar()}
      <main class="main page-enter" id="mainContent" role="main"></main>
      ${buildRightSidebar()}
    </div>
    ${buildDrawers()}
  `;
  $("#app").html(html);
}

function bindLanguageSwitch(){
  $(document).off("click", "#lang-en").on("click", "#lang-en", () => {
    state.lang = "en";
    localStorage.setItem("ci_lang", "en");
    location.reload();
  });
  $(document).off("click", "#lang-ar").on("click", "#lang-ar", () => {
    state.lang = "ar";
    localStorage.setItem("ci_lang", "ar");
    location.reload();
  });
}

async function renderImportantArticles(){
  await ensureData();
  const articles = (state.cache.articles || []).filter(a => a.showSideBar);
  const html = articles.length ? articles.map(a => `
    <a class="featured-item" href="article.html?id=${encodeURIComponent(a.id)}">
      <div class="fw-semibold">${safeText(a.title[state.lang])}</div>
      <small>${safeText(a.excerpt[state.lang])}</small>
    </a>
  `).join("") : `<div class="muted">${safeText(t("not_found"))}</div>`;

  $("#importantArticles").html(html);
  $("#importantArticlesDrawer").html(html);
}

async function initCommon(){
  applyDirection();
  mountLayout();
  bindLanguageSwitch();
  setActiveNav();

  await ensureData();
  $("#year").text(new Date().getFullYear());
  $("#yearDrawer").text(new Date().getFullYear());
  $("#contactEmail").text(state.cache.settings?.contactEmail || "");
  $("#contactEmailDrawer").text(state.cache.settings?.contactEmail || "");
  await renderImportantArticles();

  // Close drawers when a nav link is clicked
  $(document).on("click", ".offcanvas a.navitem", function(){
    const oc = bootstrap.Offcanvas.getInstance(document.getElementById("drawerLeft")) || bootstrap.Offcanvas.getInstance(document.getElementById("drawerRight"));
    if(oc) oc.hide();
  });
}

// Make common helpers available to page scripts
window.CI = {
  state,
  t,
  safeText,
  ensureData,
  langLabel,
  initCommon
};

// Auto-init
$(function(){
  CI.initCommon();
});
