(function(){
  const { t, safeText, ensureData, state } = window.CI;

  async function render(){
    await ensureData();
    const items = state.cache.audios || [];

    const list = items.length ? items.map(a => {
      const mp3 = a?.files?.mp3 || a?.url || "#";
      return `
        <div class="col-12">
          <div class="card-soft p-3 hover-rise">
            <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
              <div>
                <div class="fw-bold">${safeText(a.title?.[state.lang] || a.title?.en || "")}</div>
                <div class="muted mt-1" style="font-size:14px;">${safeText(a.desc?.[state.lang] || a.desc?.en || "")}</div>
              </div>
              <div class="d-flex gap-2">
                <a class="btn btn-sm btn-soft" href="${safeText(mp3)}" target="_blank">
                  <i class="fa-solid fa-play me-2"></i>${safeText(state.lang==="ar" ? "استماع" : "Listen")}
                </a>
                <a class="btn btn-sm btn-soft" href="${safeText(mp3)}" download>
                  <i class="fa-solid fa-download me-2"></i>${safeText(state.lang==="ar" ? "تحميل" : "Download")}
                </a>
              </div>
            </div>

            <div class="mt-3">
              <audio controls style="width:100%;">
                <source src="${safeText(mp3)}" type="audio/mpeg" />
              </audio>
            </div>
          </div>
        </div>
      `;
    }).join("") : `<div class="muted">${safeText(state.lang==="ar" ? "لا توجد ملفات صوتية." : "No audios.")}</div>`;

    const html = `
      <div class="section-head" style="border-bottom:1px solid var(--mainLine);">
        <h4 class="mb-0"><i class="fa-solid fa-headphones me-2"></i>${safeText(t("section_audios"))}</h4>
        <div class="badge-soft">${items.length} ${safeText(t("items"))}</div>
      </div>
      <div class="row g-3 mt-2">${list}</div>
    `;

    $("#mainContent").html(html);
  }

  $(render);
})();