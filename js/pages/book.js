(function(){
  const { t, safeText, ensureData, state, langLabel } = window.CI;

  function getParams(){
    const sp = new URLSearchParams(location.search);
    return {
      id: Number(sp.get("id")),
      bookLang: sp.get("bookLang") || null
    };
  }

  function bookAvailableLangs(book){
    const langs = Object.keys(book?.filesByLang || {});
    if(langs.length) return langs;
    return Object.keys(book?.title || {});
  }

  function getBookFile(book, lang, kind){
    const by = book?.filesByLang || {};
    const entry = by?.[lang] || null;
    if(entry && entry[kind]) return entry[kind];
    // fallback
    return book?.files?.[kind] || "#";
  }

  function niceBookLangName(code){
    // book language list (can be more than UI languages)
    const map = {
      en: "English",
      ar: "العربية",
      fr: "Français",
      ur: "اردو",
      id: "Bahasa Indonesia"
    };
    return map[code] || code.toUpperCase();
  }

  function setUrlBookLang(bookLang){
    const sp = new URLSearchParams(location.search);
    if(bookLang) sp.set("bookLang", bookLang);
    history.replaceState({}, "", `${location.pathname}?${sp.toString()}`);
  }

  async function render(){
    await ensureData();

    const { id, bookLang } = getParams();
    const book = (state.cache.books || []).find(b => b.id === id);
    if(!book){
      $("#mainContent").html(`<div class="muted">${safeText(state.lang==="ar" ? "الكتاب غير موجود." : "Book not found.")}</div>`);
      return;
    }

    const available = bookAvailableLangs(book);

    const stored = sessionStorage.getItem(`ci_bookLang_${id}`);
    let activeBookLang = bookLang || stored || (available.includes(state.lang) ? state.lang : available[0]) || "en";
    if(!available.includes(activeBookLang)) activeBookLang = available[0] || "en";

    sessionStorage.setItem(`ci_bookLang_${id}`, activeBookLang);
    setUrlBookLang(activeBookLang);

    const title = book?.title?.[state.lang] || book?.title?.en || "";
    const desc  = book?.desc?.[state.lang]  || book?.desc?.en  || "";

    const pdfUrl  = getBookFile(book, activeBookLang, "pdf");
    const wordUrl = getBookFile(book, activeBookLang, "word");

    const langsList = available.map(code => {
      const active = code === activeBookLang ? "active" : "";
      return `
        <button class="lang-pill ${active}" type="button" data-book-lang="${code}">
          <span>${safeText(niceBookLangName(code))}</span>
          ${code===activeBookLang ? `<i class="fa-solid fa-check"></i>` : ``}
        </button>
      `;
    }).join("");

    const html = `
      <div class="section-head" style="border-bottom:1px solid var(--mainLine);">
        <div>
          <h4 class="mb-1"><i class="fa-solid fa-book me-2"></i>${safeText(title)}</h4>
          <div class="muted">${safeText(desc)}</div>
        </div>
        <a class="btn btn-sm btn-soft" href="books.html"><i class="fa-solid fa-arrow-left me-2"></i>${safeText(state.lang==="ar" ? "العودة" : "Back")}</a>
      </div>

      <div class="row g-3 mt-2 align-items-stretch">
        <div class="col-12 col-lg-4">
          <div class="card-soft p-3 h-100">
            <div class="d-flex gap-3">
              <img src="${safeText(book.cover)}" alt="" style="width:76px;height:104px;object-fit:cover;border-radius:14px;border:1px solid rgba(15,23,42,.10)">
              <div class="flex-grow-1">
                <div class="fw-bold">${safeText(title)}</div>
                <div class="muted mt-1" style="font-size:13px">${safeText(state.lang==="ar" ? "اختر لغة الكتاب لعرض ملف PDF وتحميله." : "Pick a book language to preview and download.")}</div>
                <div class="mt-2 d-flex flex-wrap gap-2">
                  <a class="btn btn-sm btn-soft" id="downloadPdf" href="${safeText(pdfUrl)}" target="_blank" download>
                    <i class="fa-solid fa-file-pdf me-2"></i>${safeText(state.lang==="ar" ? "تحميل PDF" : "Download PDF")}
                  </a>
                  <a class="btn btn-sm btn-soft" id="downloadWord" href="${safeText(wordUrl)}" target="_blank" download>
                    <i class="fa-solid fa-file-word me-2"></i>${safeText(state.lang==="ar" ? "تحميل Word" : "Download Word")}
                  </a>
                </div>
              </div>
            </div>

            <div class="mt-3">
              <div class="d-flex align-items-center justify-content-between">
                <div class="fw-bold">${safeText(state.lang==="ar" ? "لغات الكتاب" : "Book languages")}</div>
                <span class="badge-soft"><i class="fa-solid fa-language me-1"></i>${available.length}</span>
              </div>

              <div class="mt-2">
                <input id="langSearch" class="form-control form-control-sm" placeholder="${safeText(state.lang==="ar" ? "ابحث داخل اللغات..." : "Search languages...")}" />
              </div>

              <div class="lang-list mt-2" id="langsList">
                ${langsList}
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-8">
          <div class="card-soft p-0 h-100 overflow-hidden">
            <div class="d-flex align-items-center justify-content-between p-3" style="border-bottom:1px solid var(--mainLine);">
              <div class="fw-bold">
                <i class="fa-solid fa-eye me-2"></i>${safeText(state.lang==="ar" ? "معاينة PDF" : "PDF Preview")}
              </div>
              <div class="badge-soft">${safeText(niceBookLangName(activeBookLang))}</div>
            </div>

            <div class="pdf-wrap">
              <iframe id="pdfFrame" title="PDF Preview" src="${safeText(pdfUrl)}" style="width:100%; height:72vh; border:0; background:white;"></iframe>
            </div>
          </div>
        </div>
      </div>
    `;

    $("#mainContent").html(html);

    // language search
    $("#langSearch").on("input", function(){
      const q = ($(this).val() || "").toString().toLowerCase().trim();
      $("#langsList [data-book-lang]").each(function(){
        const code = $(this).data("book-lang");
        const label = niceBookLangName(code).toLowerCase();
        $(this).toggle(!q || label.includes(q) || String(code).toLowerCase().includes(q));
      });
    });

    // click language
    $("[data-book-lang]").off("click").on("click", function(){
      const code = $(this).data("book-lang");
      sessionStorage.setItem(`ci_bookLang_${id}`, code);
      setUrlBookLang(code);

      const newPdf = getBookFile(book, code, "pdf");
      const newWord = getBookFile(book, code, "word");

      $("#pdfFrame").attr("src", newPdf);
      $("#downloadPdf").attr("href", newPdf);
      $("#downloadWord").attr("href", newWord);

      // active state
      $("[data-book-lang]").removeClass("active").find("i.fa-check").remove();
      $(this).addClass("active").append(`<i class="fa-solid fa-check"></i>`);
    });
  }

  $(render);
})();