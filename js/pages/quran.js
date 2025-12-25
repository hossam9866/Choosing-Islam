(function(){
  const { t, safeText, ensureData, state } = window.CI;

  async function render(){
    await ensureData();
    const q = state.cache.quran || {};
    const resources = (q.resources || []).map(r => `
      <div class="col-12">
        <div class="card-soft p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div class="fw-bold">${safeText(r.title[state.lang])}</div>
          <div class="d-flex gap-2 flex-wrap">
            <a class="btn btn-sm btn-ghost" href="${r.files.pdf}" target="_blank" download>
              <i class="fa-regular fa-file-pdf me-1"></i>${safeText(t("download_pdf"))}
            </a>
            <a class="btn btn-sm btn-ghost" href="${r.files.word}" target="_blank" download>
              <i class="fa-regular fa-file-word me-1"></i>${safeText(t("download_word"))}
            </a>
          </div>
        </div>
      </div>
    `).join("");

    const surahs = (q.surahsSample || []).map(s => `
      <li class="list-group-item d-flex justify-content-between align-items-center" style="border-color: var(--mainLine);">
        <span class="fw-semibold">${safeText(s.name[state.lang])}</span>
        <span class="muted">${safeText(s.ayat)} ayat</span>
      </li>
    `).join("");

    const html = `
      <div class="section-head" style="border-bottom:1px solid var(--mainLine);">
        <h4><i class="fa-solid fa-book-quran me-2"></i>${safeText(t("section_quran"))}</h4>
        <div class="badge-soft">${safeText(state.lang === "ar" ? "تصفح مواد القرآن" : "Browse Quran resources")}</div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <div class="card-soft p-3 h-100">
            <div class="fw-bold mb-2">${safeText(state.lang === "ar" ? "سور (عينة)" : "Surahs (sample)")}</div>
            <div class="muted mb-3" style="font-size:14px;">${safeText(state.lang === "ar" ? "قائمة تجريبية (استبدلها لاحقًا بـ API حقيقي)." : "Sample list (replace later with a real Quran API).")}</div>
            <ul class="list-group list-group-flush" style="border-radius: 12px; overflow:hidden; border:1px solid var(--mainLine);">
              ${surahs}
            </ul>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="card-soft p-3 h-100">
            <div class="fw-bold mb-2">${safeText(state.lang === "ar" ? "موارد إضافية" : "Extra resources")}</div>
            <div class="row g-2">
              ${resources || `<div class="muted">${safeText(t("not_found"))}</div>`}
            </div>
          </div>
        </div>
      </div>
    `;

    $("#mainContent").html(html);
  }

  $(render);
})();
