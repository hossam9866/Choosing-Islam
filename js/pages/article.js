(function () {
  const { t, safeText, ensureData, state } = window.CI;

  function getId() {
    const sp = new URLSearchParams(location.search);
    return Number(sp.get("id"));
  }

  function getYouTubeId(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "").trim();
      }
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      // /embed/ID
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
    } catch (e) {}
    return null;
  }

  function ytThumb(id) {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  function buildPoints(text) {
    const raw = (text || "").toString().trim();
    if (!raw) return "";
    // split by lines; if single line, split by period-ish
    let lines = raw
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    if (lines.length <= 1) {
      lines = raw
        .split(/[\.\؟\?]\s+/)
        .map((x) => x.trim())
        .filter((x) => x.length > 6);
    }
    const lis = lines.map((x) => `<li>${safeText(x)}</li>`).join("");
    return `<ul class="points">${lis}</ul>`;
  }

  async function render() {
    await ensureData();
    const id = getId();
    const a = (state.cache.articles || []).find((x) => x.id === id);
    if (!a) {
      $("#mainContent").html(
        `<div class="muted">${safeText(t("not_found"))}</div>`
      );
      return;
    }

    const books = state.cache.books || [];
    const videos = state.cache.videos || [];

    const relatedBookIds = a.relatedBookIds || [];
    const relatedBooks = books.filter((b) => relatedBookIds.includes(b.id));

    const youtubeLinks =
      a.youtube && a.youtube.length ? a.youtube : a.relatedVideoUrls || [];
    // fallback: if no youtube links on article, attach first video
    const ytList =
      youtubeLinks && youtubeLinks.length
        ? youtubeLinks
        : videos[0]?.url
        ? [videos[0].url]
        : [];

    const relatedBooksHtml = relatedBooks.length
      ? `
      <div class="row g-3">
        ${relatedBooks
          .map((b) => {
            const title = b.title?.[state.lang] || b.title?.en || "";
            const desc = b.desc?.[state.lang] || b.desc?.en || "";
            const langs = Object.keys(b.filesByLang || b.title || {}).length;
            return `
            <div class="col-12 col-xl-4">
              <a class="card-soft h-100 d-block hover-rise" href="book.html?id=${
                b.id
              }">
                <div class="p-3 d-flex gap-3">
                  <img src="${safeText(
                    b.cover
                  )}" alt="" style="width:56px;height:76px;object-fit:cover;border-radius:12px;border:1px solid rgba(15,23,42,.10)">
                  <div class="flex-grow-1">
                    <div class="fw-bold">${safeText(title)}</div>
                    <div class="muted mt-1" style="font-size:13px; line-height:1.4">${safeText(
                      desc
                    )}</div>
                    <div class="mt-2">
                      <span class="badge-soft"><i class="fa-solid fa-language me-1"></i>${langs}</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          `;
          })
          .join("")}
      </div>
    `
      : `<div class="muted">${safeText(
          state.lang === "ar" ? "لا توجد كتب مرتبطة." : "No related books."
        )}</div>`;

    const videosHtml = ytList.length
      ? `
      <div class="row g-3">
        ${ytList
          .map((url, idx) => {
            const id = getYouTubeId(url);
            if (!id) return "";
            return `
            <div class="col-12 col-lg-4">
              <button class="card-soft p-0 w-100 text-start hover-rise video-card" type="button" data-yt="${safeText(
                id
              )}" data-url="${safeText(url)}">
                <div class="position-relative" style="aspect-ratio:16/9; overflow:hidden; border-radius:18px 18px 0 0;">
                  <img src="${safeText(
                    ytThumb(id)
                  )}" alt="" style="width:100%;height:100%;object-fit:cover; display:block;">
                  <div class="video-play">
                    <i class="fa-solid fa-play"></i>
                  </div>
                </div>
                <div class="p-3">
                  <div class="fw-bold">${safeText(
                    state.lang === "ar" ? "فيديو مرتبط" : "Related Video"
                  )} #${idx + 1}</div>
                  <div class="muted" style="font-size:13px;">YouTube</div>
                </div>
              </button>
            </div>
          `;
          })
          .join("")}
      </div>
    `
      : `<div class="muted">${safeText(
          state.lang === "ar"
            ? "لا توجد فيديوهات مرتبطة."
            : "No related videos."
        )}</div>`;

    const downloadsHtml = a.files
      ? `
  <div class="d-flex gap-2 flex-wrap mt-3">
    ${
      a.files.pdf
        ? `<a href="${safeText(
            a.files.pdf
          )}" target="_blank" class="btn btn-sm btn-outline-danger">
             <i class="fa-solid fa-file-pdf me-1"></i> PDF
           </a>`
        : ""
    }
    ${
      a.files.word
        ? `<a href="${safeText(
            a.files.word
          )}" target="_blank" class="btn btn-sm btn-outline-primary">
             <i class="fa-solid fa-file-word me-1"></i> Word
           </a>`
        : ""
    }
  </div>
  `
      : "";

    const html = `
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div class="d-flex align-items-center gap-2">
          <a class="btn btn-sm btn-soft" href="articles.html"><i class="fa-solid fa-arrow-left me-2"></i>${safeText(
            state.lang === "ar" ? "العودة" : "Back"
          )}</a>
          <span class="badge-soft"><i class="fa-regular fa-newspaper me-1"></i>${safeText(
            t("section_articles")
          )}</span>
        </div>
      </div>

      <div class="card-soft p-4 mt-3">
        <h2 class="m-0" style="font-weight:900;">${safeText(
          a.title[state.lang] || a.title.en
        )}</h2>
        ${downloadsHtml}
        <div class="muted mt-2" style="font-size:13px;">
          <i class="fa-regular fa-clock me-1"></i>${safeText(a.date || "—")}
        </div>

        <div class="mt-3">
          ${buildPoints(a.body[state.lang] || a.body.en)}
        </div>
      </div>

      <div class="mt-4">
        <div class="section-head" style="border-bottom:1px solid var(--mainLine);">
          <h4 class="mb-0"><i class="fa-solid fa-book me-2"></i>${safeText(
            t("related_books")
          )}</h4>
        </div>
        <div class="mt-2">${relatedBooksHtml}</div>
      </div>

      <div class="mt-4">
        <div class="section-head" style="border-bottom:1px solid var(--mainLine);">
          <h4 class="mb-0"><i class="fa-brands fa-youtube me-2"></i>${safeText(
            t("related_videos")
          )}</h4>
        </div>
        <div class="mt-2">${videosHtml}</div>
      </div>

      <!-- Video Modal -->
      <div class="modal fade" id="ytModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h6 class="modal-title">${safeText(
                state.lang === "ar" ? "تشغيل الفيديو" : "Play video"
              )}</h6>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-0" style="background:#000;">
              <div style="aspect-ratio:16/9;">
                <iframe id="ytFrame" title="YouTube" style="width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    $("#mainContent").html(html);

    // open videos in modal
    const modalEl = document.getElementById("ytModal");
    const modal = new bootstrap.Modal(modalEl, {
      backdrop: true,
      keyboard: true,
    });

    $(".video-card").on("click", function () {
      const id = $(this).data("yt");
      const src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      $("#ytFrame").attr("src", src);
      modal.show();
    });

    // FIX: ensure close works + stop audio
    modalEl.addEventListener("hidden.bs.modal", function () {
      $("#ytFrame").attr("src", "");
    });
  }

  $(render);
})();
