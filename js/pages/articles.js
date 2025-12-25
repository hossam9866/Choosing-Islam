(function(){
  const { t, safeText, ensureData, state } = window.CI;

  async function render(){
    await ensureData();
    const items = state.cache.articles || [];

    const list = items.length ? items.map(a => `
      <div class="col-12">
        <div class="card-soft p-3">
          <div class="d-flex justify-content-between flex-wrap gap-2">
            <div>
              <div class="fw-bold">${safeText(a.title[state.lang])}</div>
              <div class="muted mt-1" style="font-size:14px;">${safeText(a.excerpt[state.lang])}</div>
            </div>
            <div class="d-flex gap-2 flex-wrap align-items-start">
              <a class="btn btn-sm btn-ghost" href="article.html?id=${encodeURIComponent(a.id)}">
                <i class="fa-regular fa-folder-open me-1"></i>${safeText(t("read_more"))}
              </a>
              <a class="btn btn-sm btn-ghost" href="${a.files.pdf}" target="_blank" download>
                <i class="fa-regular fa-file-pdf me-1"></i>${safeText(t("download_pdf"))}
              </a>
              <a class="btn btn-sm btn-ghost" href="${a.files.word}" target="_blank" download>
                <i class="fa-regular fa-file-word me-1"></i>${safeText(t("download_word"))}
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join("") : `<div class="muted">${safeText(t("not_found"))}</div>`;

    const html = `
      <div class="section-head">
        <h4><i class="fa-regular fa-newspaper me-2"></i>${safeText(t("section_articles"))}</h4>
        <div class="badge-soft">${items.length} ${safeText(t("items"))}</div>
      </div>
      <div class="row g-3">${list}</div>
    `;

    $("#mainContent").html(html);
  }

  $(render);
})();
