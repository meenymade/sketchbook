/* ============================================================
   SKETCHBOOK — 동작
   작업물을 추가하실 때 이 파일은 건드리지 않으셔도 됩니다.
   ============================================================ */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── HUD : 시각 · 세션 코드 · 스크롤 진행률 ───────────────── */

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function startClock() {
    var el = document.getElementById("hud-time");
    if (!el) return;
    function tick() {
      var d = new Date();
      el.textContent = pad(d.getUTCHours()) + ":" + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds()) + " UTC";
    }
    tick();
    setInterval(tick, 1000);
  }

  function setSession() {
    var el = document.getElementById("hud-session");
    if (!el) return;
    var code = sessionStorage.getItem("skb-session");
    if (!code) {
      code = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase();
      while (code.length < 6) code = "0" + code;
      try { sessionStorage.setItem("skb-session", code); } catch (e) {}
    }
    el.textContent = "SESSION " + code;
  }

  function startScrollMeter() {
    var el = document.getElementById("hud-scroll");
    if (!el) return;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
      el.textContent = (pct < 100 ? (pct < 10 ? "00" : "0") : "") + pct + "%";
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  /* ── 십자선 커서 ─────────────────────────────────────────── */

  function startCursor() {
    var root = document.getElementById("cursor");
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var x = root.querySelector(".cursor__x");
    var y = root.querySelector(".cursor__y");
    var dot = root.querySelector(".cursor__dot");
    var label = root.querySelector(".cursor__label");
    document.body.classList.add("cursor-on");

    document.addEventListener("mousemove", function (e) {
      root.classList.add("is-on");
      x.style.transform = "translateY(" + e.clientY + "px)";
      y.style.transform = "translateX(" + e.clientX + "px)";
      dot.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
      label.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";

      var hot = e.target && e.target.closest ? e.target.closest("[data-cursor]") : null;
      if (hot) {
        root.classList.add("is-hot");
        label.textContent = hot.getAttribute("data-cursor");
      } else {
        root.classList.remove("is-hot");
      }
    });

    document.addEventListener("mouseleave", function () { root.classList.remove("is-on"); });
  }

  /* ── 부팅 시퀀스 ─────────────────────────────────────────── */

  function boot(done) {
    var el = document.getElementById("boot");
    if (!el) { done(); return; }

    var lines = el.querySelectorAll("p");
    var step = reduced ? 60 : 230;

    lines.forEach(function (line, i) {
      setTimeout(function () { line.classList.add("is-in"); }, step * i);
    });

    setTimeout(function () {
      el.classList.add("is-done");
      done();
      setTimeout(function () { el.remove(); }, 800);
    }, step * lines.length + (reduced ? 80 : 380));
  }

  /* ── 스크롤 등장 · 미세 패럴랙스 ─────────────────────────── */

  function startReveal(items) {
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add("is-in"); }, (Number(el.dataset.delay) || 0) * 70);
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px" });

    items.forEach(function (el) { io.observe(el); });
  }

  function startParallax(items) {
    if (reduced || !items.length) return;
    var ticking = false;

    function frame() {
      var vh = window.innerHeight;
      items.forEach(function (el) {
        var amp = Number(el.dataset.amp) || 0;
        if (!amp) return;
        var rect = el.getBoundingClientRect();
        var delta = (rect.top + rect.height / 2 - vh / 2) / vh;
        el.style.setProperty("--shift", (delta * amp).toFixed(1) + "px");
      });
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    frame();
  }


  /* ── 작업물 경로 규칙 ────────────────────────────────────── */

  // file 을 적지 않으면 works/번호.html 로 봅니다
  function resolveFile(w) {
    return w.file || "works/" + w.id + ".html";
  }

  /* ── 실시간 축소 미리보기 ────────────────────────────────── */

  var SHOT_WIDTH = 1440;   // 데스크톱 화면 폭 기준으로 띄운 뒤 카드 크기로 줄입니다

  function startPreviews(scope) {
    var shots = Array.prototype.slice.call(scope.querySelectorAll(".card__shot"));
    if (!shots.length) return;

    function fit(shot) {
      var w = shot.clientWidth;
      if (w) shot.style.setProperty("--s", (w / SHOT_WIDTH).toFixed(4));
    }

    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function (entries) {
        entries.forEach(function (e) { fit(e.target); });
      });
      shots.forEach(function (shot) { ro.observe(shot); });
    } else {
      window.addEventListener("resize", function () { shots.forEach(fit); });
    }
    shots.forEach(fit);

    function load(shot) {
      if (shot.firstChild) return;
      var frame = document.createElement("iframe");
      frame.setAttribute("scrolling", "no");
      frame.setAttribute("tabindex", "-1");
      frame.setAttribute("aria-hidden", "true");
      frame.addEventListener("load", function () { shot.classList.add("is-ready"); });
      frame.src = shot.dataset.src;
      shot.appendChild(frame);
    }

    function unload(shot) {
      shot.classList.remove("is-ready");
      shot.innerHTML = "";
    }

    // 화면 가까이 온 카드만 실행하고, 멀어지면 정지시킵니다
    if (!("IntersectionObserver" in window)) {
      shots.forEach(load);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { load(e.target); } else { unload(e.target); }
      });
    }, { rootMargin: "600px 0px" });

    shots.forEach(function (shot) { io.observe(shot); });
  }

  /* ── 갤러리 그리기 ───────────────────────────────────────── */

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function buildGrid() {
    var grid = document.getElementById("grid");
    if (!grid) return;

    var list = typeof WORKS !== "undefined" && Array.isArray(WORKS) ? WORKS : [];
    var count = document.getElementById("count");
    if (count) count.textContent = list.length < 10 ? "00" + list.length : (list.length < 100 ? "0" + list.length : list.length);

    if (!list.length) {
      grid.innerHTML = '<p class="grid__empty">NO ENTRIES — works.js 에 작업물을 추가해 주세요.</p>';
      return;
    }

    function shotMarkup(w) {
      // thumb 을 적었으면 그 이미지를, 아니면 작업물 화면을 그대로 축소해 보여 줍니다
      return w.thumb
        ? '<img class="card__img" src="' + escapeHtml(w.thumb) + '" alt="" loading="lazy">'
        : '<div class="card__shot" data-src="' + escapeHtml(resolveFile(w)) + '"></div>';
    }

    var amps = [0, 24];  // 열마다 다른 패럴랙스 세기 (2열 기준)

    grid.innerHTML = list.map(function (w, i) {
      return [
        '<a class="card" href="work.html?id=' + encodeURIComponent(w.id) + '"',
        '   data-cursor="OPEN" data-delay="' + (i % 2) + '" data-amp="' + amps[i % 2] + '">',
        '  <div class="card__frame">',
        '    ' + shotMarkup(w),
        '    <div class="card__title">' + escapeHtml(w.title) + '</div>',
        '  </div>',
        '  <div class="card__meta"><span>SKB&mdash;' + escapeHtml(w.id) + '</span><span>' + escapeHtml(w.year) + '</span></div>',
        '</a>'
      ].join("");
    }).join("");

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
    startReveal(cards);
    startParallax(cards);
    startPreviews(grid);
  }

  /* ── 상세 화면 그리기 ────────────────────────────────────── */

  function buildDetail() {
    var stage = document.getElementById("stage");
    if (!stage) return;

    var id = new URLSearchParams(window.location.search).get("id");
    var list = typeof WORKS !== "undefined" && Array.isArray(WORKS) ? WORKS : [];
    var work = list.filter(function (w) { return w.id === id; })[0] || list[0];

    var box = document.getElementById("stage-box");

    if (!work) {
      box.innerHTML = '<div class="stage__loading">NOT FOUND</div>';
      return;
    }

    document.title = work.title + " — SKETCHBOOK";
    document.getElementById("caption-id").textContent = "SKB—" + work.id + " / " + work.year;
    document.getElementById("caption-title").textContent = work.title;
    document.getElementById("caption-desc").textContent = work.desc || "";

    var src = resolveFile(work);
    var open = document.getElementById("caption-open");
    open.setAttribute("href", src);

    var frame = document.createElement("iframe");
    frame.setAttribute("title", work.title);
    frame.setAttribute("loading", "lazy");
    frame.addEventListener("load", function () { box.classList.add("is-ready"); });
    frame.src = src;
    box.appendChild(frame);

    setTimeout(function () { box.classList.add("is-ready"); }, 6000);
  }

  /* ── 시작 ────────────────────────────────────────────────── */

  startClock();
  setSession();
  startScrollMeter();
  startCursor();
  buildGrid();
  buildDetail();

  boot(function () {
    var page = document.querySelector(".page");
    if (page) page.classList.add("is-in");
  });
})();
