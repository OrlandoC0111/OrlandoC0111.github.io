/* Photography page: country filters plus a click-to-enlarge viewer
   (arrow keys browse the visible photos, Esc closes, #photo-id in the URL opens that photo). */
(function () {
  var box = document.getElementById("life-lightbox");
  var items = Array.prototype.slice.call(document.querySelectorAll(".life-gallery__item"));
  if (!box || !items.length) return;
  /* The page body is its own stacking context, so move the viewer out of it to sit above the masthead. */
  document.body.appendChild(box);
  var img = box.querySelector("img"), cap = box.querySelector("figcaption"), cur = 0;

  function visible() { return items.filter(function (it) { return !it.hidden; }); }
  function show(i) {
    var vis = visible();
    cur = (i + vis.length) % vis.length;
    var a = vis[cur].querySelector("a");
    img.src = a.href;
    img.alt = a.querySelector("img").alt;
    cap.textContent = a.getAttribute("data-caption") || "";
  }
  function open(item) { box.hidden = false; document.body.style.overflow = "hidden"; show(visible().indexOf(item)); }
  function close() { box.hidden = true; img.src = ""; document.body.style.overflow = ""; }

  items.forEach(function (it) {
    it.querySelector("a").addEventListener("click", function (e) { e.preventDefault(); open(it); });
  });
  box.querySelector(".life-lightbox__close").addEventListener("click", close);
  box.querySelector(".life-lightbox__prev").addEventListener("click", function () { show(cur - 1); });
  box.querySelector(".life-lightbox__next").addEventListener("click", function () { show(cur + 1); });
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(cur - 1);
    else if (e.key === "ArrowRight") show(cur + 1);
  });

  var buttons = Array.prototype.slice.call(document.querySelectorAll(".life-filter"));
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter");
      buttons.forEach(function (x) { x.classList.toggle("is-active", x === b); });
      items.forEach(function (it) { it.hidden = f !== "all" && it.getAttribute("data-country") !== f; });
    });
  });

  /* Links from the travel map pop-ups point at #<photo-id>. */
  if (location.hash) {
    var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target && items.indexOf(target) >= 0) open(target);
  }
})();
