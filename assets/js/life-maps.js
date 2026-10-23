/* Maps for the travel page (lived/visited countries, states and provinces + pins; shapes only, no basemap)
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

  /* Map colours and pin sizes for each status in _data/travel.yml ("born" is drawn like "lived"). */
  var STATUS_VAR = { lived: "--life-lived", born: "--life-lived", visited: "--life-visited", favorite: "--life-favorite" };
  var PIN_RADIUS = { lived: 7, born: 7, favorite: 7, visited: 5 };
  var PIN_ORDER = { visited: 0, favorite: 1, lived: 2, born: 2 };
  var BADGE = { born: "born here", lived: "lived", favorite: "♥ favorite" };
  function statusColor(status) { return cssVar(STATUS_VAR[status] || "--life-visited"); }
  /* Pins use darker colours than the shading so they stand out on a shaded state. */
  function pinStyle(status) {
    var v = { lived: "--life-pin-lived", born: "--life-pin-lived", favorite: "--life-pin-favorite" }[status] || "--life-pin-visited";
    return { radius: PIN_RADIUS[status] || 5, color: "#fff", weight: 2, fillColor: cssVar(v), fillOpacity: 1 };
  }

  /* Other spellings of state/province names, mapped to the names in regions-usa-can-chn.json. */
  var REGION_ALIASES = { "quebec": "québec", "xizang": "tibet", "inner mongolia": "inner mongol", "washington dc": "district of columbia",
                         "washington, dc": "district of columbia", "dc": "district of columbia" };
  function normRegion(name) { var n = String(name).trim().toLowerCase(); return REGION_ALIASES[n] || n; }

  function initTravel() {
    var travel = readJSON("travel-data");
    if (!travel || !document.getElementById("travel-map")) return;
    var map = baseMap("travel-map", { minZoom: 1, maxZoom: 8, zoomSnap: 0.25, worldCopyJump: true });
    map.fitBounds([[-50, -165], [72, 155]]);
    map.attributionControl.addAttribution('Borders: <a href="https://www.naturalearthdata.com/">Natural Earth</a>');
    map.createPane("countries").style.zIndex = 350;
    map.createPane("regions").style.zIndex = 360;

    /* Whole countries / regions, and states / provinces, keyed by lower-case name. */
    var countryStatus = {}, regionStatus = {}, countrySet = {}, nStates = 0;
    (travel.countries || []).forEach(function (c) {
      countryStatus[norm(c.name)] = { name: c.name, status: c.status || "visited" };
      countrySet[c.part_of || c.name] = true;
    });
    Object.keys(travel.states || {}).forEach(function (country) {
      countrySet[country] = true;
      var byStatus = travel.states[country] || {};
      Object.keys(byStatus).forEach(function (status) {
        (byStatus[status] || []).forEach(function (r) {
          regionStatus[country.toLowerCase() + "|" + normRegion(r)] = { name: r, status: status };
          nStates++;
        });
      });
    });
    var setStat = function (k, v) { var el = document.querySelector('[data-stat="' + k + '"]'); if (el) el.textContent = v; };
    setStat("countries", Object.keys(countrySet).length);
    setStat("states", nStates);

    function shapeStyle(status) {
      return { color: cssVar("--life-map-border"), weight: 0.6, fillOpacity: status ? 0.9 : 1,
               fillColor: status ? statusColor(status) : cssVar("--life-land") };
    }
    function tip(name, status) { return esc(name) + (status ? " · " + (status === "favorite" ? "♥ favorite" : status) : ""); }

    Promise.all([
      fetch(BASE + "/assets/data/countries-50m.json").then(function (r) { return r.json(); }),
      fetch(BASE + "/assets/data/regions-usa-can-chn.json").then(function (r) { return r.json(); })
    ]).then(function (res) {
      var geo = topojson.feature(res[0], res[0].objects.countries);
      geo.features = geo.features.filter(function (f) { return f.properties.name !== "Antarctica"; });
      geo.features.forEach(function (f) {
        unwrap(f.geometry);
        var c = countryStatus[(f.properties.name || "").toLowerCase()];
        f.properties.status = c ? c.status : null;
        if (c) c.found = true;
      });
      Object.keys(countryStatus).forEach(function (k) {
        if (!countryStatus[k].found) console.warn("Travel map: no country named '" + countryStatus[k].name + "'. See assets/data/country-names.txt.");
      });
      var countries = L.geoJSON(geo, {
        pane: "countries",
        style: function (f) { return shapeStyle(f.properties.status); },
        onEachFeature: function (f, l) { l.bindTooltip(tip(f.properties.name, f.properties.status), { sticky: true }); }
      }).addTo(map);

      var regionsGeo = res[1];
      regionsGeo.features.forEach(function (f) {
        var r = regionStatus[f.properties.country.toLowerCase() + "|" + f.properties.name.toLowerCase()];
        f.properties.status = r ? r.status : null;
        if (r) r.found = true;
      });
      Object.keys(regionStatus).forEach(function (k) {
        if (!regionStatus[k].found) console.warn("Travel map: no state/province named '" + regionStatus[k].name + "'. See assets/data/regions-usa-can-chn.json.");
      });
      var regions = L.geoJSON(regionsGeo, {
        pane: "regions",
        style: function (f) { return shapeStyle(f.properties.status); },
        onEachFeature: function (f, l) { l.bindTooltip(tip(f.properties.name, f.properties.status), { sticky: true }); }
      }).addTo(map);

      themed.push(function () {
        countries.setStyle(function (f) { return shapeStyle(f.properties.status); });
        regions.setStyle(function (f) { return shapeStyle(f.properties.status); });
      });
    }).catch(function (e) { console.error("Travel map: could not load map shapes", e); });

    /* Pins, with the photos taken there (photos.yml "at" = pin name) in the pop-up. */
    var photosAt = {};
    (readJSON("photo-data") || []).forEach(function (ph) { if (ph.at) (photosAt[ph.at] = photosAt[ph.at] || []).push(ph); });
    var pins = [];
    (travel.places || []).slice().sort(function (a, b) { return (PIN_ORDER[a.status] || 0) - (PIN_ORDER[b.status] || 0); })
      .forEach(function (p) {
        if (p.lat == null || p.lon == null) return;
        var status = p.status || "visited";
        var html = '<div class="life-pop"><strong>' + esc(p.name) + "</strong>" + (p.region && p.region !== p.name ? '<span class="life-muted">, ' + esc(p.region) + "</span>" : "");
        if (BADGE[status]) html += ' <span class="life-badge life-badge--' + (status === "favorite" ? "favorite" : "lived") + '">' + BADGE[status] + (p.when && status !== "born" ? " " + esc(p.when) : "") + "</span>";
        if (p.note) html += "<br>" + esc(p.note);
        var phs = photosAt[p.name] || [];
        if (phs.length) {
          html += '<div class="life-pop__photos">' + phs.slice(0, 3).map(function (ph) {
            var id = ph.file.replace(/\.[^.]+$/, "");
            return '<a href="' + BASE + "/photography/#" + encodeURIComponent(id) + '" title="' + esc(ph.title) + '"><img src="' + BASE + "/images/photography/thumbs/" + encodeURI(ph.file) + '" alt="' + esc(ph.title) + '" loading="lazy"></a>';
          }).join("") + "</div>";
        }
        html += "</div>";
        var m = L.circleMarker([p.lat, p.lon], pinStyle(status)).bindPopup(html, { maxWidth: 340 }).bindTooltip(esc(p.name), { direction: "top", offset: [0, -6] }).addTo(map);
        pins.push([m, status]);
      });
    themed.push(function () { pins.forEach(function (p) { p[0].setStyle(pinStyle(p[1])); }); });
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
