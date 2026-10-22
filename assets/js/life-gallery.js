/* Click-to-enlarge viewer for the Photography page (arrow keys browse, Esc closes). */
(function () {
  var box = document.getElementById("life-lightbox");
  var links = Array.prototype.slice.call(document.querySelectorAll(".life-gallery__item a"));
  if (!box || !links.length) return;
  /* The page body is its own stacking context, so move the viewer out of it to sit above the masthead. */
  document.body.appendChild(box);
  var img = box.querySelector("img"), cap = box.querySelector("figcaption"), cur = 0;

  function show(i) {
    cur = (i + links.length) % links.length;
    img.src = links[cur].href;
    img.alt = links[cur].querySelector("img").alt;
    cap.textContent = links[cur].getAttribute("data-caption") || "";
  }
  function open(i) { show(i); box.hidden = false; document.body.style.overflow = "hidden"; }
  function close() { box.hidden = true; img.src = ""; document.body.style.overflow = ""; }

  links.forEach(function (a, i) { a.addEventListener("click", function (e) { e.preventDefault(); open(i); }); });
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
})();
