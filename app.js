/* Change is Good Food Finder
   Plain JavaScript, no libraries. Reads listings.csv and zipcodes.csv from this folder.
   Nothing is stored or sent anywhere: zip codes and locations stay in the visitor's browser. */
(function () {
  "use strict";

  // ---- Settings ----------------------------------------------------------
  var DENVER = { lat: 39.7392, lon: -104.9903 };
  var COVERAGE_MILES = 40;   // zip codes farther than this from downtown Denver get the national options
  var STALE_DAYS = 30;       // "Hours may have changed" note after this many days
  var DAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // ---- Words on the page, in English and Spanish ---------------------------
  var TEXT = {
    en: {
      skip: "Skip to main content",
      callAheadTitle: "Always call ahead.",
      callAheadBody: "Hours change, and places can close for holidays or bad weather.",
      intro: "Everyone needs help sometimes. Here's where to find it.",
      zipLabel: "Enter your zip code",
      findFood: "Find food",
      radiusLabel: "Distance:",
      miles5: "5 miles", miles10: "10 miles", miles25: "25 miles",
      useLocation: "Use my location",
      filters: "Filters",
      openToday: "Open today",
      typeLabel: "Type of help",
      allTypes: "All types of help",
      "Food pantry": "Food pantry",
      "Free meal": "Free meal",
      "One-time event": "One-time event",
      "Assistance program": "Assistance program",
      searchLabel: "Search by name",
      outsideTitle: "Outside Denver?",
      outsideBody: "These free services can help you find food anywhere in the US.",
      footer: "A free community project by Change is Good.",
      privacy: "No tracking, no cookies, no ads. Your zip code and location stay on your phone.",
      langButton: "Español",
      zipInvalid: "Please enter a 5-digit zip code.",
      locating: "Finding your location...",
      locateFailed: "We couldn't get your location. You can type your zip code instead.",
      locateUnsupported: "Location isn't available on this device. You can type your zip code instead.",
      usingLocation: "Showing places near your location.",
      showingNear: "Showing places near {zip}.",
      loading: "Loading listings...",
      loadFailed: "We couldn't load the listings right now. Please try again, or call 2-1-1 for help finding food.",
      summaryAll: "{n} places in the Denver area. Enter your zip code to see the closest first.",
      summaryNear: "{n} places within {r} miles.",
      summaryNone: "No places match these filters.",
      noneMatch: "Nothing matches these filters. Try turning off \"Open today\" or choosing \"All types of help.\"",
      noArea: "We don't have detailed listings for your area yet. These free services can help you find food near you:",
      tryWider: "Search up to 25 miles",
      milesAway: "{d} miles away",
      mileAway: "{d} mile away",
      veryClose: "Very close by",
      openTodayTag: "Open today",
      days: "Days",
      hours: "Hours",
      eventDate: "Date",
      bring: "What to bring",
      notes: "Notes",
      call: "Call {p}",
      directions: "Directions",
      website: "Website",
      lastChecked: "Last checked: {date}",
      notChecked: "Not confirmed yet.",
      stale: "Hours may have changed, please call first.",
      phoneHelp: "Help by phone",
      nat211: "Call 2-1-1",
      nat211Sub: "Local help anywhere in the US, any time.",
      nat211Web: "Visit 211.org",
      natFA: "Feeding America food bank finder",
      natFASub: "Find the food bank that serves your area.",
      natFH: "FindHelp.org",
      natFHSub: "Free search for food, housing, and more.",
      natUSDA: "USDA National Hunger Hotline",
      natUSDAEn: "English: 1-866-3-HUNGRY (1-866-348-6479)",
      natUSDAEs: "Spanish: 1-877-8-HAMBRE (1-877-842-6273)",
      dayNames: { Sun: "Sun", Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat" },
      listingNote: ""
    },
    es: {
      skip: "Ir al contenido principal",
      callAheadTitle: "Siempre llame antes de ir.",
      callAheadBody: "Los horarios cambian, y algunos lugares cierran por días festivos o mal tiempo.",
      intro: "Todos necesitamos ayuda a veces. Aquí puede encontrarla.",
      zipLabel: "Escriba su código postal",
      findFood: "Buscar comida",
      radiusLabel: "Distancia:",
      miles5: "5 millas", miles10: "10 millas", miles25: "25 millas",
      useLocation: "Usar mi ubicación",
      filters: "Filtros",
      openToday: "Abierto hoy",
      typeLabel: "Tipo de ayuda",
      allTypes: "Todos los tipos de ayuda",
      "Food pantry": "Despensa de alimentos",
      "Free meal": "Comida gratis",
      "One-time event": "Evento especial",
      "Assistance program": "Programa de ayuda",
      searchLabel: "Buscar por nombre",
      outsideTitle: "¿Fuera de Denver?",
      outsideBody: "Estos servicios gratuitos le ayudan a encontrar comida en todo EE. UU.",
      footer: "Un proyecto comunitario gratuito de Change is Good.",
      privacy: "Sin rastreo, sin cookies, sin anuncios. Su código postal y ubicación se quedan en su teléfono.",
      langButton: "English",
      zipInvalid: "Escriba un código postal de 5 dígitos.",
      locating: "Buscando su ubicación...",
      locateFailed: "No pudimos obtener su ubicación. Puede escribir su código postal.",
      locateUnsupported: "La ubicación no está disponible en este aparato. Puede escribir su código postal.",
      usingLocation: "Lugares cerca de su ubicación.",
      showingNear: "Lugares cerca de {zip}.",
      loading: "Cargando lugares...",
      loadFailed: "No pudimos cargar los lugares. Intente de nuevo, o llame al 2-1-1 para encontrar comida.",
      summaryAll: "{n} lugares en el área de Denver. Escriba su código postal para ver los más cercanos primero.",
      summaryNear: "{n} lugares a menos de {r} millas.",
      summaryNone: "Ningún lugar coincide con estos filtros.",
      noneMatch: "Nada coincide con estos filtros. Pruebe quitar \"Abierto hoy\" o elegir \"Todos los tipos de ayuda.\"",
      noArea: "Todavía no tenemos lugares detallados para su área. Estos servicios gratuitos le ayudan a encontrar comida cerca de usted:",
      tryWider: "Buscar hasta 25 millas",
      milesAway: "a {d} millas",
      mileAway: "a {d} milla",
      veryClose: "Muy cerca",
      openTodayTag: "Abierto hoy",
      days: "Días",
      hours: "Horario",
      eventDate: "Fecha",
      bring: "Qué traer",
      notes: "Notas",
      call: "Llamar {p}",
      directions: "Cómo llegar",
      website: "Sitio web",
      lastChecked: "Revisado: {date}",
      notChecked: "Aún no confirmado.",
      stale: "El horario puede haber cambiado. Llame antes de ir.",
      phoneHelp: "Ayuda por teléfono",
      nat211: "Llame al 2-1-1",
      nat211Sub: "Ayuda local en todo EE. UU., a cualquier hora.",
      nat211Web: "Visite 211.org",
      natFA: "Buscador de bancos de alimentos de Feeding America",
      natFASub: "Encuentre el banco de alimentos de su área.",
      natFH: "FindHelp.org",
      natFHSub: "Búsqueda gratis de comida, vivienda y más.",
      natUSDA: "Línea Nacional contra el Hambre (USDA)",
      natUSDAEn: "Inglés: 1-866-3-HUNGRY (1-866-348-6479)",
      natUSDAEs: "Español: 1-877-8-HAMBRE (1-877-842-6273)",
      dayNames: { Sun: "Dom", Mon: "Lun", Tue: "Mar", Wed: "Mié", Thu: "Jue", Fri: "Vie", Sat: "Sáb" },
      listingNote: "La información de cada lugar está en inglés."
    }
  };

  // ---- State ---------------------------------------------------------------
  var lang = /^es\b/i.test(navigator.language || "") ? "es" : "en";
  var listings = [];        // active, not-expired rows from listings.csv
  var zipTable = null;      // { "80202": {lat, lon}, ... } loaded on first search
  var origin = null;        // { lat, lon, zip } of the visitor, kept in memory only
  var outsideArea = false;
  var loadError = false;

  var $ = function (id) { return document.getElementById(id); };
  function t(key, vars) {
    var s = TEXT[lang][key];
    if (s === undefined) s = TEXT.en[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }

  // ---- CSV reading (handles quoted fields, commas, "" quotes, and line breaks inside quotes)
  function parseCSV(text) {
    text = text.replace(/^﻿/, "");
    var rows = [], row = [], field = "", i = 0, inQuotes = false, c;
    while (i < text.length) {
      c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += c; i++; continue;
      }
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\r") { i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (f) { return f.trim() !== ""; }); });
  }

  // Turn CSV rows into objects keyed by column name, so column order mistakes don't break the site.
  function toObjects(rows) {
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    return rows.slice(1).map(function (r) {
      var o = {};
      head.forEach(function (h, idx) { o[h] = (r[idx] || "").trim(); });
      return o;
    });
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function parseISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function formatDate(s) {
    var d = parseISO(s);
    if (!d) return s;
    return d.toLocaleDateString(lang === "es" ? "es-US" : "en-US", { month: "long", day: "numeric", year: "numeric" });
  }

  function cleanListing(o) {
    var lat = parseFloat(o["latitude"]), lon = parseFloat(o["longitude"]);
    var days = (o["days"] || "").split(/[\s,]+/).map(function (d) {
      d = d.slice(0, 3).toLowerCase();
      return d.charAt(0).toUpperCase() + d.slice(1);
    }).filter(function (d) { return DAY_KEYS.indexOf(d) >= 0; });
    return {
      id: o["id"], name: o["name"], type: o["type"], address: o["address"], city: o["city"],
      zip: (o["zip"] || "").slice(0, 5), lat: isNaN(lat) ? null : lat, lon: isNaN(lon) ? null : lon,
      days: days, hours: o["hours"], bring: o["what to bring"], phone: o["phone"], website: o["website"],
      notes: o["notes"], eventDate: o["event date"], verified: o["last verified"], source: o["source"],
      active: (o["active"] || "").toUpperCase()
    };
  }

  // ---- Loading files -----------------------------------------------------
  function loadListings() {
    // "no-cache" makes the browser check for a fresh copy of listings.csv on every visit.
    return fetch("listings.csv", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (text) {
        var today = todayISO();
        listings = toObjects(parseCSV(text)).map(cleanListing).filter(function (l) {
          if (l.active !== "Y" || !l.name) return false;
          if (l.type === "One-time event") return !!parseISO(l.eventDate) && l.eventDate >= today;
          return true;
        });
      });
  }

  function loadZips() {
    if (zipTable) return Promise.resolve(zipTable);
    return fetch("zipcodes.csv")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (text) {
        zipTable = {};
        text.split("\n").slice(1).forEach(function (line) {
          var p = line.split(",");
          if (p.length >= 3) zipTable[p[0].trim()] = { lat: parseFloat(p[1]), lon: parseFloat(p[2]) };
        });
        return zipTable;
      });
  }

  // ---- Distance ----------------------------------------------------------
  function miles(a, b) {
    var R = 3958.8, rad = Math.PI / 180;
    var dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  // Where a listing is on the map: its own coordinates, or the middle of its zip code.
  function placeOf(l) {
    if (l.lat !== null && l.lon !== null) return { lat: l.lat, lon: l.lon };
    if (l.zip && zipTable && zipTable[l.zip]) return zipTable[l.zip];
    return null;
  }
  function nearestZip(pt) {
    var best = null, bestD = Infinity;
    Object.keys(zipTable || {}).forEach(function (z) {
      var d = miles(pt, zipTable[z]);
      if (d < bestD) { bestD = d; best = z; }
    });
    return bestD < 15 ? best : null;
  }

  // ---- Filters -----------------------------------------------------------
  function isOpenToday(l) {
    if (l.type === "One-time event") return l.eventDate === todayISO();
    return l.days.indexOf(DAY_KEYS[new Date().getDay()]) >= 0;
  }

  // ---- Building the page ---------------------------------------------------
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "class") e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function safeUrl(u) { return /^https?:\/\//i.test(u || "") ? u : null; }
  function telHref(p) { var d = (p || "").replace(/[^\d+]/g, ""); return d ? "tel:" + d : null; }

  function card(l, dist) {
    var meta = el("div", { class: "card-meta" }, [
      el("span", { class: "type-tag", text: t(l.type) }),
      dist !== null ? el("span", { class: "distance", text: dist < 0.1 ? t("veryClose") : t(dist === 1 ? "mileAway" : "milesAway", { d: dist }) }) : null,
      isOpenToday(l) ? el("span", { class: "open-now", text: "● " + t("openTodayTag") }) : null
    ]);

    var addr = [l.address, l.city, l.address || l.city ? "CO" : "", l.zip].filter(Boolean).join(", ").replace(", CO, ", ", CO ");
    var dl = el("dl");
    function row(label, value) {
      if (!value) return;
      dl.appendChild(el("dt", { text: label }));
      dl.appendChild(el("dd", { text: value }));
    }
    if (l.type === "One-time event") row(t("eventDate"), formatDate(l.eventDate));
    row(t("days"), l.days.map(function (d) { return TEXT[lang].dayNames[d]; }).join(", "));
    row(t("hours"), l.hours);
    row(t("bring"), l.bring);
    row(t("notes"), l.notes);

    var actions = el("div", { class: "card-actions" });
    var tel = telHref(l.phone);
    if (tel) actions.appendChild(el("a", { class: "btn btn-primary btn-call", href: tel, text: t("call", { p: l.phone }) }));
    if (l.address) {
      var q = encodeURIComponent([l.address, l.city, "CO", l.zip].filter(Boolean).join(", "));
      actions.appendChild(el("a", { class: "btn btn-secondary", href: "https://www.google.com/maps/dir/?api=1&destination=" + q, target: "_blank", rel: "noopener", text: t("directions") }));
    }
    var web = safeUrl(l.website);
    if (web) actions.appendChild(el("a", { class: "btn btn-secondary", href: web, target: "_blank", rel: "noopener", text: t("website") }));

    var checked, stale = null, vd = parseISO(l.verified);
    if (vd) {
      checked = el("p", { class: "checked", text: t("lastChecked", { date: formatDate(l.verified) }) });
      if ((Date.now() - vd.getTime()) / 864e5 > STALE_DAYS) stale = el("p", { class: "stale", text: t("stale") });
    } else {
      checked = el("p", { class: "checked", text: t("notChecked") });
      stale = el("p", { class: "stale", text: t("stale") });
    }

    return el("article", { class: "card", id: "listing-" + l.id }, [
      el("h3", { text: l.name }), meta,
      addr ? el("p", { class: "address", text: addr }) : null,
      dl, actions, checked, stale
    ]);
  }

  // The four national services. Where a site supports it, the zip code goes into the link.
  function nationalOptions(zip) {
    var fh = zip ? "https://www.findhelp.org/search_results/" + zip : "https://www.findhelp.org";
    function opt(href, title, sub, external) {
      var a = el("a", { class: "option", href: href }, [el("strong", { text: title }), el("span", { text: sub })]);
      if (external) { a.target = "_blank"; a.rel = "noopener"; }
      return a;
    }
    var wrap = el("div");
    wrap.appendChild(el("div", { class: "phones" }, [
      opt("tel:211", t("nat211"), t("nat211Sub")),
      opt("https://www.211.org", t("nat211Web"), t("nat211Sub"), true)
    ]));
    wrap.appendChild(opt("https://www.feedingamerica.org/find-your-local-foodbank", t("natFA"), t("natFASub"), true));
    wrap.appendChild(opt(fh, t("natFH"), t("natFHSub"), true));
    wrap.appendChild(el("div", { class: "phones" }, [
      opt("tel:18663486479", t("natUSDA"), t("natUSDAEn")),
      opt("tel:18778426273", t("natUSDA"), t("natUSDAEs"))
    ]));
    return Array.prototype.slice.call(wrap.childNodes);
  }

  function renderNationalSmall() {
    var box = $("national-small");
    box.textContent = "";
    nationalOptions(origin && origin.zip).forEach(function (n) { box.appendChild(n); });
  }

  function render() {
    var list = $("listings"), summary = $("results-summary"), none = $("no-results"), phone = $("phone-help");
    list.textContent = ""; none.textContent = ""; phone.textContent = "";
    renderNationalSmall();

    if (loadError) { summary.textContent = t("loadFailed"); return; }

    var radius = +$("radius").value;
    var openOnly = $("open-today").getAttribute("aria-pressed") === "true";
    var type = $("type-filter").value;
    var q = $("name-search").value.trim().toLowerCase();

    var filtered = listings.filter(function (l) {
      if (openOnly && !isOpenToday(l)) return false;
      if (type && l.type !== type) return false;
      if (q && l.name.toLowerCase().indexOf(q) < 0) return false;
      return true;
    });

    // Listings with no place on the map (phone lines, statewide programs) are shown separately.
    var placed = [], phoneOnly = [];
    filtered.forEach(function (l) { (placeOf(l) ? placed : phoneOnly).push(l); });

    var shown;
    if (origin) {
      shown = placed.map(function (l) { return { l: l, d: miles(origin, placeOf(l)) }; })
        .filter(function (x) { return x.d <= radius; })
        .sort(function (a, b) { return a.d - b.d; });
    } else {
      shown = placed.map(function (l) { return { l: l, d: null }; })
        .sort(function (a, b) { return a.l.name.localeCompare(b.l.name); });
    }

    // Outside the Denver area, or nothing nearby at all: point to the national services.
    var nothingNearby = origin && !outsideArea && shown.length === 0 && !openOnly && !type && !q;
    if (outsideArea || nothingNearby) {
      var box = el("div", { class: "no-listings" }, [el("p", { text: t("noArea") })]);
      var opts = el("div", { class: "national" });
      nationalOptions(origin && origin.zip).forEach(function (n) { opts.appendChild(n); });
      box.appendChild(opts);
      if (nothingNearby && radius < 25) {
        var wider = el("button", { type: "button", class: "btn btn-secondary", text: t("tryWider") });
        wider.style.marginTop = "12px";
        wider.addEventListener("click", function () { $("radius").value = "25"; render(); });
        box.appendChild(wider);
      }
      none.appendChild(box);
      summary.textContent = "";
      return;
    }

    if (shown.length === 0 && phoneOnly.length === 0) {
      summary.textContent = t("summaryNone");
      none.appendChild(el("p", { class: "no-listings", text: t("noneMatch") }));
      return;
    }

    summary.textContent = (origin ? t("summaryNear", { n: shown.length, r: radius }) : t("summaryAll", { n: shown.length })) +
      (TEXT[lang].listingNote ? " " + TEXT[lang].listingNote : "");
    shown.forEach(function (x) {
      list.appendChild(card(x.l, x.d === null ? null : Math.round(x.d * 10) / 10));
    });

    if (phoneOnly.length) {
      phone.appendChild(el("h2", { class: "section-title", text: t("phoneHelp") }));
      var pl = el("div", { class: "listings" });
      phoneOnly.forEach(function (l) { pl.appendChild(card(l, null)); });
      phone.appendChild(pl);
    }
  }

  // ---- Search actions ------------------------------------------------------
  function setMsg(text, isError) {
    var m = $("zip-msg");
    m.textContent = text || "";
    m.className = "zip-msg" + (isError ? " error" : "");
  }

  function searchZip(zip) {
    if (!/^\d{5}$/.test(zip)) { setMsg(t("zipInvalid"), true); $("zip").focus(); return; }
    loadZips().then(function (zips) {
      var pt = zips[zip];
      // Zip codes not in our Colorado file are outside the coverage area.
      if (pt) {
        origin = { lat: pt.lat, lon: pt.lon, zip: zip };
        outsideArea = miles(origin, DENVER) > COVERAGE_MILES;
      } else {
        origin = { lat: 0, lon: 0, zip: zip };
        outsideArea = true;
      }
      setMsg(t("showingNear", { zip: zip }));
      render();
      $("results-summary").scrollIntoView({ behavior: "smooth", block: "start" });
    }).catch(function () { setMsg(t("loadFailed"), true); });
  }

  function useLocation() {
    if (!navigator.geolocation) { setMsg(t("locateUnsupported"), true); return; }
    setMsg(t("locating"));
    // Only asks permission now, when the button is tapped. The location is never saved or sent.
    navigator.geolocation.getCurrentPosition(function (pos) {
      var pt = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      loadZips().then(function () {
        origin = { lat: pt.lat, lon: pt.lon, zip: nearestZip(pt) };
        outsideArea = miles(origin, DENVER) > COVERAGE_MILES;
        $("zip").value = "";
        setMsg(t("usingLocation"));
        render();
      }).catch(function () { setMsg(t("loadFailed"), true); });
    }, function () {
      setMsg(t("locateFailed"), true);
    }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 });
  }

  // ---- Language ------------------------------------------------------------
  function applyLanguage() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (n) { n.textContent = t(n.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (n) { n.placeholder = t(n.getAttribute("data-i18n-placeholder")); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (n) { n.setAttribute("aria-label", t(n.getAttribute("data-i18n-aria"))); });
    var b = $("lang-toggle");
    b.textContent = t("langButton");
    b.setAttribute("lang", lang === "es" ? "en" : "es");
  }

  // ---- Start ---------------------------------------------------------------
  function start() {
    applyLanguage();
    $("zip-form").addEventListener("submit", function (e) { e.preventDefault(); searchZip($("zip").value.trim()); });
    $("locate").addEventListener("click", useLocation);
    $("radius").addEventListener("change", render);
    $("type-filter").addEventListener("change", render);
    $("name-search").addEventListener("input", render);
    $("open-today").addEventListener("click", function () {
      var on = this.getAttribute("aria-pressed") !== "true";
      this.setAttribute("aria-pressed", on ? "true" : "false");
      render();
    });
    $("lang-toggle").addEventListener("click", function () {
      lang = lang === "es" ? "en" : "es";
      applyLanguage();
      if (!$("zip-msg").classList.contains("error")) setMsg("");
      render();
    });

    $("results-summary").textContent = t("loading");
    renderNationalSmall();
    // Zip centroids are loaded too, so listings with a blank Latitude/Longitude can still be placed.
    Promise.all([loadListings(), loadZips()]).catch(function () { loadError = true; }).then(render);
  }

  start();
})();
