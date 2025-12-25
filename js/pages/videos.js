(function(){
  const { t, safeText, ensureData, state } = window.CI;

  function getYouTubeId(url){
    try{
      const u = new URL(url);
      if(u.hostname.includes("youtu.be")){
        return u.pathname.replace("/","").trim();
      }
      if(u.searchParams.get("v")) return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if(embedIdx>=0 && parts[embedIdx+1]) return parts[embedIdx+1];
    }catch(e){}
    return null;
  }

  function ytThumb(id){
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  async function render(){
    await ensureData();
    const items = state.cache.videos || [];

    const cards = items.length ? items.map((v,idx) => {
      const title = v.title?.[state.lang] || v.title?.en || `${safeText(state.lang==="ar" ? "فيديو" : "Video")} #${idx+1}`;
      const id = getYouTubeId(v.url);
      const thumb = id ? ytThumb(id) : null;

      return `
        <div class="col-12 col-md-6">
          <button class="card-soft p-0 w-100 text-start hover-rise video-card" type="button" data-yt="${safeText(id||"")}" data-url="${safeText(v.url||"#")}">
            <div class="position-relative" style="aspect-ratio:16/9; overflow:hidden; border-radius:18px 18px 0 0; background: rgba(16,24,40,.04);">
              ${thumb ? `<img src="${safeText(thumb)}" alt="" style="width:100%;height:100%;object-fit:cover; display:block;">` : `
                <div class="d-flex align-items-center justify-content-center h-100">
                  <i class="fa-solid fa-circle-play" style="font-size:42px; color: rgba(29,78,216,.75);"></i>
                </div>
              `}
              <div class="video-play"><i class="fa-solid fa-play"></i></div>
            </div>
            <div class="p-3">
              <div class="fw-bold">${safeText(title)}</div>
              <div class="muted" style="font-size:13px;">YouTube</div>
            </div>
          </button>
        </div>
      `;
    }).join("") : `<div class="muted">${safeText(state.lang==="ar" ? "لا توجد فيديوهات." : "No videos.")}</div>`;

    const html = `
      <div class="section-head" style="border-bottom:1px solid var(--mainLine);">
        <h4 class="mb-0"><i class="fa-solid fa-video me-2"></i>${safeText(t("section_videos"))}</h4>
        <div class="badge-soft">${safeText(state.lang==="ar" ? "اضغط على أي فيديو للتشغيل" : "Tap any video to play")}</div>
      </div>

      <div class="row g-3 mt-2">
        ${cards}
      </div>

      <div class="modal fade" id="ytModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h6 class="modal-title">${safeText(state.lang==="ar" ? "تشغيل الفيديو" : "Play video")}</h6>
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

    const modalEl = document.getElementById("ytModal");
    const modal = new bootstrap.Modal(modalEl, { backdrop:true, keyboard:true });

    $(".video-card").on("click", function(){
      const id = $(this).data("yt");
      if(!id) return;
      $("#ytFrame").attr("src", `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`);
      modal.show();
    });

    modalEl.addEventListener("hidden.bs.modal", function(){
      $("#ytFrame").attr("src", "");
    });
  }

  $(render);
})();