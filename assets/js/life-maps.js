/* Maps for the Travel page (visited countries + pins, drawn from country shapes only, no basemap)
   and the Cycling page (GPX routes on OpenStreetMap tiles). */
(function () {
  var BASE = window.LIFE_BASE || "";
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function readJSON(id) { var el = document.getElementById(id); return el ? JSON.parse(el.textContent || "null") : null; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* Callbacks that restyle the maps when the light/dark toggle is used. */
  var themed = [];
  new MutationObserver(function () { themed.forEach(function (f) { f(); }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  /* Scroll-wheel zoom only after a click, so the page scrolls normally past the map. */
  function baseMap(id, opts) {
    var map = L.map(id, Object.assign({ scrollWheelZoom: false }, opts));
    map.on("click", function () { map.scrollWheelZoom.enable(); });
    return map;
  }

  /* Short forms people often type, mapped to the Natural Earth names used in countries-50m.json. */
  var ALIASES = {
    "usa": "united states of america", "us": "united states of america", "united states": "united states of america",
    "uk": "united kingdom", "england": "united kingdom", "scotland": "united kingdom", "wales": "united kingdom", "great britain": "united kingdom",
    "korea": "south korea", "republic of korea": "south korea", "czech republic": "czechia", "uae": "united arab emirates",
    "macau": "macao", "hong kong sar": "hong kong", "dominican republic": "dominican rep.", "bosnia and herzegovina": "bosnia and herz.",
    "drc": "dem. rep. congo", "democratic republic of the congo": "dem. rep. congo", "north macedonia": "macedonia",
    "viet nam": "vietnam", "russian federation": "russia", "lao pdr": "laos", "the netherlands": "netherlands", "holland": "netherlands",
    "türkiye": "turkey", "turkiye": "turkey", "ivory coast": "côte d'ivoire", "cote d'ivoire": "côte d'ivoire"
  };
  function norm(name) { var n = String(name).trim().toLowerCase(); return ALIASES[n] || n; }

  /* Leaflet draws a ring that jumps across the date line (Russia, Fiji) as a stripe across the map,
     so shift longitudes by 360 to keep each ring continuous. */
  function unwrapRing(ring) {
    for (var i = 1; i < ring.length; i++) {
      while (ring[i][0] - ring[i - 1][0] > 180) ring[i][0] -= 360;
      while (ring[i][0] - ring[i - 1][0] < -180) ring[i][0] += 360;
    }
  }
  function unwrap(geom) {
    if (!geom) return;
    var polys = geom.type === "Polygon" ? [geom.coordinates] : geom.type === "MultiPolygon" ? geom.coordinates : [];
    polys.forEach(function (poly) { poly.forEach(unwrapRing); });
  }

  function pinStyle(varName, radius) {
    return { radius: radius, color: "#fff", weight: 2, fillColor: cssVar(varName), fillOpacity: 1 };
  }

  function initTravel() {
    var travel = readJSON("travel-data");
    if (!travel || !document.getElementById("travel-map")) return;
    var map = baseMap("travel-map", { minZoom: 1, maxZoom: 7, zoomSnap: 0.25, worldCopyJump: true });
    map.fitBounds([[-56, -170], [78, 190]]);
    map.attributionControl.addAttribution('Borders: <a href="https://www.naturalearthdata.com/">Natural Earth</a>');
    map.createPane("countries").style.zIndex = 350;

    var visited = {};
    (travel.countries || []).forEach(function (c) { visited[norm(c)] = c; });

    fetch(BASE + "/assets/data/countries-50m.json").then(function (r) { return r.json(); }).then(function (topo) {
      var geo = topojson.feature(topo, topo.objects.countries);
      geo.features = geo.features.filter(function (f) { return f.properties.name !== "Antarctica"; });
      geo.features.forEach(function (f) { unwrap(f.geometry); });
      var found = {};
      geo.features.forEach(function (f) {
        var k = (f.properties.name || "").toLowerCase();
        f.properties.visited = !!visited[k];
        if (visited[k]) found[k] = true;
      });
      Object.keys(visited).forEach(function (k) {
        if (!found[k]) console.warn("Travel map: no country named '" + visited[k] + "'. See assets/data/country-names.txt.");
      });
      function style(f) {
        var visitedFill = f.properties.visited;
        return { pane: "countries", color: cssVar("--life-map-border"), weight: 0.6, fillOpacity: visitedFill ? 0.85 : 1,
                 fillColor: cssVar(visitedFill ? "--life-visited" : "--life-land") };
      }
      var layer = L.geoJSON(geo, {
        style: style,
        onEachFeature: function (f, l) { l.bindTooltip(f.properties.name + (f.properties.visited ? " ✓" : ""), { sticky: true }); }
      }).addTo(map);
      themed.push(function () { layer.setStyle(style); });
    }).catch(function (e) { console.error("Travel map: could not load country shapes", e); });

    var pins = [];
    (travel.places || []).forEach(function (p) {
      if (p.lat == null || p.lon == null) return;
      var html = "<strong>" + esc(p.name) + "</strong>" + (p.when ? " · " + esc(p.when) : "") + (p.note ? "<br>" + esc(p.note) : "");
      if (p.photo) html += '<img src="' + BASE + "/images/photography/" + encodeURI(p.photo) + '" alt="">';
      pins.push([L.circleMarker([p.lat, p.lon], pinStyle("--life-pin", 6)).bindPopup(html).addTo(map), "--life-pin", 6]);
    });

    (readJSON("photo-data") || []).forEach(function (ph) {
      if (ph.lat == null || ph.lon == null) return;
      var cap = [ph.title, ph.place, ph.year].filter(Boolean).map(esc).join(" · ");
      var html = '<a href="' + BASE + '/photography/">' + (cap || "Photo") + '</a><img src="' + BASE + "/images/photography/" + encodeURI(ph.file) + '" alt="' + cap + '">';
      pins.push([L.circleMarker([ph.lat, ph.lon], pinStyle("--life-photo", 5)).bindPopup(html).addTo(map), "--life-photo", 5]);
    });
    themed.push(function () { pins.forEach(function (p) { p[0].setStyle(pinStyle(p[1], p[2])); }); });
  }

  /* Cycling: draw each ride's GPX track in its own colour and match the swatch on the ride card. */
  function initRides() {
    var rides = readJSON("ride-data");
    if (!rides || !document.getElementById("ride-map")) return;
    var COLORS = ["#2f7f93", "#e5751f", "#861f41", "#3b9b5a", "#7b5ea7", "#c9a227", "#d0457a", "#4a6fd1"];
    var rmap = baseMap("ride-map", { minZoom: 2 });
    rmap.setView([37.5, -79], 6);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18
    }).addTo(rmap);
    var all = L.latLngBounds([]);
    var jobs = rides.map(function (r, i) {
      if (!r.gpx) return null;
      var color = COLORS[i % COLORS.length];
      var sw = document.querySelector('.life-ride__swatch[data-ride="' + (i + 1) + '"]');
      if (sw) sw.style.background = color;
      return fetch(BASE + "/files/gpx/" + encodeURI(r.gpx)).then(function (res) { return res.text(); }).then(function (txt) {
        var xml = new DOMParser().parseFromString(txt, "application/xml");
        var pts = Array.prototype.map.call(xml.querySelectorAll("trkpt, rtept"), function (n) {
          return [parseFloat(n.getAttribute("lat")), parseFloat(n.getAttribute("lon"))];
        });
        if (!pts.length) { console.warn("Cycling map: no track points in " + r.gpx); return; }
        var line = L.polyline(pts, { color: color, weight: 4, opacity: 0.9 }).addTo(rmap);
        line.bindPopup('<a href="#ride-' + (i + 1) + '"><strong>' + esc(r.title) + "</strong></a>" + (r.distance_km ? "<br>" + esc(r.distance_km) + " km" : ""));
        all.extend(line.getBounds());
      }).catch(function (e) { console.error("Cycling map: could not load " + r.gpx, e); });
    });
    Promise.all(jobs).then(function () { if (all.isValid()) rmap.fitBounds(all, { padding: [20, 20] }); });
  }

  document.addEventListener("DOMContentLoaded", function () { initTravel(); initRides(); });
})();
