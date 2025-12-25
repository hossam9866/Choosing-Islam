(function () {
  const { t, safeText, ensureData, state } = window.CI;

  function quickCard(icon, title, href) {
    return `
      <div class="col-12 col-md-6 col-xl-4">
        <a class="card-soft p-3 h-100 d-block hover-rise" href="${href}">
          <div class="d-flex align-items-center gap-3">
            <div class="navicon" style="width:48px;height:48px;border-radius:16px;">
              <i class="fa-solid ${icon}"></i>
            </div>
            <div>
              <div class="fw-bold">${safeText(title)}</div>
              <div class="muted" style="font-size:13px;">${safeText(
                state.lang === "ar" ? "اضغط للاستكشاف" : "Tap to explore"
              )}</div>
            </div>
          </div>
        </a>
      </div>
    `;
  }

  function featuredBookCard(b) {
    const title = b?.title?.[state.lang] || b?.title?.en || "";
    const desc = b?.desc?.[state.lang] || b?.desc?.en || "";
    const langs = Object.keys(b?.filesByLang || b?.title || {}).length;

    return `
      <div class="col-12 col-xl-6">
        <a class="card-soft h-100 d-block hover-rise" href="book.html?id=${
          b.id
        }">
          <div class="p-3">
            <div class="d-flex gap-3">
              <img src="${safeText(
                b.cover
              )}" alt="" style="width:64px;height:86px;object-fit:cover;border-radius:12px;border:1px solid rgba(15,23,42,.10)">
              <div class="flex-grow-1">
                <div class="fw-bold">${safeText(title)}</div>
                <div class="muted mt-1" style="font-size:13px; line-height:1.4">${safeText(
                  desc
                )}</div>
                <div class="mt-2 d-flex align-items-center gap-2">
                  <span class="badge-soft"><i class="fa-solid fa-language me-1"></i>${langs} ${safeText(
      state.lang === "ar" ? "لغات" : "langs"
    )}</span>
                  <span class="badge-soft"><i class="fa-solid fa-file-pdf me-1"></i>PDF</span>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    `;
  }

  $(async function () {
    await ensureData();

    const books = (state.cache.books || []).slice(0, 3);
    const featured = books.map(featuredBookCard).join("");

    const html = `
      <div class="section-head">
        <h4 class="mb-1">${safeText(t("home_title"))}</h4>
        <div class="muted">${safeText(t("home_subtitle"))}</div>
      </div>

      <div class="mt-4">
        <div class="row g-3">
          ${quickCard("fa-book-quran", t("section_quran"), "quran.html")}
          ${quickCard("fa-book", t("section_books"), "books.html")}
          ${quickCard("fa-newspaper", t("section_articles"), "articles.html")}
          ${quickCard("fa-video", t("section_videos"), "videos.html")}
          ${quickCard("fa-headphones", t("section_audios"), "audios.html")}
        </div>
      </div>

      <div class="mt-4">
        <div class="section-head" style="border-bottom:1px solid var(--mainLine);">
          <h5 class="mb-0">${safeText(
            state.lang === "ar" ? "كتب مختارة" : "Featured Books"
          )}</h5>
          <a class="muted" href="books.html" style="text-decoration:none;">${safeText(
            state.lang === "ar" ? "عرض الكل" : "View all"
          )}</a>
        </div>
        <div class="row g-3 mt-1">
          ${
            featured ||
            `<div class="muted">${safeText(
              state.lang === "ar" ? "لا توجد كتب بعد." : "No books yet."
            )}</div>`
          }
        </div>
      </div>
    `;

    $("#mainContent").html(html);
  });
})();
