(function(){
  const { t, safeText, ensureData, state } = window.CI;

  const paging = { limit: 6, offset: 0 };

  function languageCount(book){
    const langs = Object.keys(book?.title || {});
    return langs.length;
  }

  async function render(){
    await ensureData();
    const all = state.cache.books || [];
    const total = all.length;
    const pageItems = all.slice(paging.offset, paging.offset + paging.limit);

    const start = total ? paging.offset + 1 : 0;
    const end = Math.min(paging.offset + paging.limit, total);

    const cards = pageItems.length ? pageItems.map(book => {
      const langs = languageCount(book);
      return `
        <div class="col-12 col-md-6 col-xl-4">
          <a class="card-soft h-100 d-block" href="book.html?id=${encodeURIComponent(book.id)}">
            <img class="book-cover" src="${book.cover}" alt="${safeText(book.title[state.lang])}">
            <div class="p-3">
              <div class="d-flex align-items-start justify-content-between gap-2">
                <div class="fw-bold mb-1">${safeText(book.title[state.lang])}</div>
                <span class="badge-soft" title="${safeText(t("languages"))}">
                  <i class="fa-solid fa-language me-1"></i>${langs}
                </span>
              </div>
              <div class="muted mb-2" style="font-size:14px;">${safeText(book.desc[state.lang])}</div>
              <div class="muted" style="font-size:12px;">${safeText(state.lang === "ar" ? `متاح بـ ${langs} لغات` : `Available in ${langs} languages`)}</div>
            </div>
          </a>
        </div>
      `;
    }).join("") : `<div class="col-12"><div class="muted">${safeText(t("not_found"))}</div></div>`;

    const canPrev = paging.offset > 0;
    const canNext = (paging.offset + paging.limit) < total;

    const html = `
      <div class="section-head">
        <h4><i class="fa-solid fa-book me-2"></i>${safeText(t("section_books"))}</h4>
        <div class="badge-soft">${safeText(state.lang==="ar" ? `عرض ${start}-${end} من ${total}` : `Showing ${start}-${end} of ${total}`)}</div>
      </div>

      <div class="row g-3">${cards}</div>

      <div class="d-flex justify-content-between align-items-center mt-4">
        <button class="btn btn-ghost btn-sm" ${canPrev ? "" : "disabled"} id="booksPrev">
          <i class="fa-solid fa-chevron-left me-1"></i>${safeText(state.lang==="ar" ? "السابق" : "Previous")}
        </button>
        <button class="btn btn-ghost btn-sm" ${canNext ? "" : "disabled"} id="booksNext">
          ${safeText(state.lang==="ar" ? "التالي" : "Next")}<i class="fa-solid fa-chevron-right ms-1"></i>
        </button>
      </div>
    `;

    $("#mainContent").html(html);

    $("#booksPrev").off("click").on("click", () => {
      paging.offset = Math.max(0, paging.offset - paging.limit);
      render();
    });
    $("#booksNext").off("click").on("click", () => {
      paging.offset = paging.offset + paging.limit;
      render();
    });
  }

  $(render);
})();
