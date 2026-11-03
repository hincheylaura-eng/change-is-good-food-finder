/* Change is Good Food Finder
   Plain JavaScript, no libraries. Reads listings.csv and zipcodes.csv from this folder.
   Zip codes and locations stay in the visitor's browser. The only thing sent anywhere is an
   anonymous "a visit happened" / "a search happened" count (see netlify/functions/count.mjs). */
(function () {
  "use strict";

  // ---- Settings ----------------------------------------------------------
  var DENVER = { lat: 39.7392, lon: -104.9903 };
  var COVERAGE_MILES = 40;   // zip codes farther than this from downtown Denver get the national options
  var EDGE_MILES = 1;        // also show places just past the distance, since a zip code is measured from its middle
  var STALE_DAYS = 30;       // "Hours may have changed" note after this many days
  var STATE_HOTLINE = "hunger-free-colorado-hotline"; // shown to Colorado zip codes with no local listings
  var DAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var WINDOWS = { any: [0, 1440], morning: [360, 720], afternoon: [720, 1020], evening: [1020, 1260] };
  var ORDINALS = { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4, "5th": 5, "last": -1 };

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
      whenLegend: "When do you need food?",
      modeAll: "Show all",
      modeNow: "Open now",
      modeAhead: "Look ahead",
      aheadDay: "Day",
      aheadTime: "Time",
      today: "Today",
      tomorrow: "Tomorrow",
      anyTime: "Any time",
      morning: "Morning (6am to noon)",
      afternoon: "Afternoon (noon to 5pm)",
      evening: "Evening (5pm to 9pm)",
      typeLabel: "Type of help",
      allTypes: "All types of help",
      "Food pantry": "Food pantry",
      "Free meal": "Free meal",
      "One-time event": "One-time event",
      "Assistance program": "Assistance program",
      searchLabel: "Search by name",
      wheelchairOnly: "Wheelchair accessible only",
      serviceStyle: "Walk-in or drive-through",
      styleAny: "Walk-in or drive-through: any",
      styleWalk: "Walk-in",
      styleDrive: "Drive-through",
      styleBoth: "Walk-in and drive-through",
      filtersOn: "Some filters are on, so you may not see every place.",
      clearFilters: "Clear filters",
      showMore: "Show more",
      outsideTitle: "Outside Denver?",
      outsideBody: "These free services can help you find food anywhere in the US.",
      footer: "A free community project by Change is Good.",
      privacy: "No personal tracking, no cookies, no ads. Your zip code and location stay on your phone.",
      privacyCount: "We only count how many visits and searches happen, never who you are.",
      langButton: "Español",
      zipInvalid: "Please enter a 5-digit zip code.",
      locating: "Finding your location...",
      locateFailed: "We couldn't get your location. You can type your zip code instead.",
      locateUnsupported: "Location isn't available on this device. You can type your zip code instead.",
      usingLocation: "Showing places near your location.",
      showingNear: "Showing places near {zip}.",
      loading: "Loading listings...",
      loadFailed: "We couldn't load the listings right now. Please try again, or call 2-1-1 for help finding food.",
      summaryAll: "Places in the Denver area: {n}. Enter your zip code to see the closest first.",
      summaryNear: "Places within {r} miles: {n}.",
      summaryNow: "Places open right now: {n}.",
      summaryNowNear: "Places open right now within {r} miles: {n}.",
      summaryAhead: "Places open {when}: {n}.",
      summaryAheadNear: "Places open {when} within {r} miles: {n}.",
      summaryPast: "Just past {r} miles: {n}.",
      closedDates: "Closed on",
      closedToday: "Closed today (special closure)",
      callDays: "Call to confirm days",
      noneOpen: "None of the places with listed hours are open then. Try another time, or call the places below.",
      noneMatch: "Nothing matches. Try \"Show all,\" a bigger distance, or clear filters.",
      noArea: "We don't have detailed listings for your area yet. These free services can help you find food near you:",
      tryWider: "Search up to 25 miles",
      milesAway: "{d} miles away",
      mileAway: "{d} mile away",
      veryClose: "Very close by",
      justPast: "Just past {r} miles",
      distHours: "Distribution hours",
      eventDate: "Date",
      bring: "What to bring",
      notes: "Notes",
      wheelchair: "Wheelchair accessible",
      yes: "Yes", no: "No", unknown: "Unknown",
      hoursNotListed: "Hours not listed, call ahead.",
      daysNoTimes: "{days} (times not listed, call ahead)",
      openUntil: "Open now, until {t}",
      opensAt: "Opens today at {t}",
      closedNow: "Closed now",
      notToday: "Not open today",
      openOn: "Open {day}: {times}",
      unknownTitle: "Hours not listed, call ahead",
      unknownBody: "These places didn't share exact hours, so we can't tell if they're open then. Call first.",
      call: "Call {p}",
      directions: "Get directions",
      website: "Website",
      lastConfirmed: "Last confirmed: {date}",
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
      suggestTitle: "Know a place we're missing?",
      suggestIntro: "Tell us about it. Every suggestion is reviewed by a person before it's added. Nothing is published automatically.",
      fName: "Name of the place",
      fAddress: "Address",
      fHours: "Days and hours (if you know them)",
      fNotes: "Anything else? (what to bring, who it serves)",
      fContact: "Your email or phone (optional, only if it's OK to contact you with questions)",
      fSubmit: "Send suggestion",
      fSending: "Sending...",
      fThanks: "Thank you! We'll review it before adding it to the list.",
      fError: "That didn't send. Please try again in a minute.",
      fRequired: "Please add the name and address of the place.",
      am: "am", pm: "pm", noon: "noon", ordinal: ["", "1st", "2nd", "3rd", "4th", "5th"], last: "last",
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
      whenLegend: "¿Cuándo necesita comida?",
      modeAll: "Ver todo",
      modeNow: "Abierto ahora",
      modeAhead: "Planear",
      aheadDay: "Día",
      aheadTime: "Hora",
      today: "Hoy",
      tomorrow: "Mañana",
      anyTime: "Cualquier hora",
      morning: "Mañana (6 a. m. a mediodía)",
      afternoon: "Tarde (mediodía a 5 p. m.)",
      evening: "Noche (5 p. m. a 9 p. m.)",
      typeLabel: "Tipo de ayuda",
      allTypes: "Todos los tipos de ayuda",
      "Food pantry": "Despensa de alimentos",
      "Free meal": "Comida gratis",
      "One-time event": "Evento especial",
      "Assistance program": "Programa de ayuda",
      searchLabel: "Buscar por nombre",
      wheelchairOnly: "Solo con acceso para silla de ruedas",
      serviceStyle: "A pie o desde el auto",
      styleAny: "A pie o desde el auto: cualquiera",
      styleWalk: "A pie",
      styleDrive: "Desde el auto",
      styleBoth: "A pie y desde el auto",
      filtersOn: "Hay filtros activos, así que quizás no vea todos los lugares.",
      clearFilters: "Quitar filtros",
      showMore: "Ver más",
      outsideTitle: "¿Fuera de Denver?",
      outsideBody: "Estos servicios gratuitos le ayudan a encontrar comida en todo EE. UU.",
      footer: "Un proyecto comunitario gratuito de Change is Good.",
      privacy: "Sin rastreo personal, sin cookies, sin anuncios. Su código postal y ubicación se quedan en su teléfono.",
      privacyCount: "Solo contamos cuántas visitas y búsquedas hay, nunca quién es usted.",
      langButton: "English",
      zipInvalid: "Escriba un código postal de 5 dígitos.",
      locating: "Buscando su ubicación...",
      locateFailed: "No pudimos obtener su ubicación. Puede escribir su código postal.",
      locateUnsupported: "La ubicación no está disponible en este aparato. Puede escribir su código postal.",
      usingLocation: "Lugares cerca de su ubicación.",
      showingNear: "Lugares cerca de {zip}.",
      loading: "Cargando lugares...",
      loadFailed: "No pudimos cargar los lugares. Intente de nuevo, o llame al 2-1-1 para encontrar comida.",
      summaryAll: "Lugares en el área de Denver: {n}. Escriba su código postal para ver los más cercanos primero.",
      summaryNear: "Lugares a {r} millas o menos: {n}.",
      summaryNow: "Lugares abiertos ahora: {n}.",
      summaryNowNear: "Lugares abiertos ahora a {r} millas o menos: {n}.",
      summaryAhead: "Lugares abiertos {when}: {n}.",
      summaryAheadNear: "Lugares abiertos {when} a {r} millas o menos: {n}.",
      summaryPast: "Un poco más de {r} millas: {n}.",
      closedDates: "Cerrado el",
      closedToday: "Cerrado hoy (cierre especial)",
      callDays: "Llame para confirmar los días",
      someEnglish: "Algunos detalles están en inglés.",
      noneOpen: "Ninguno de los lugares con horario publicado abre a esa hora. Pruebe otra hora, o llame a los lugares de abajo.",
      noneMatch: "No hay resultados. Pruebe \"Ver todo\", una distancia mayor, o quite los filtros.",
      noArea: "Todavía no tenemos lugares detallados para su área. Estos servicios gratuitos le ayudan a encontrar comida cerca de usted:",
      tryWider: "Buscar hasta 25 millas",
      milesAway: "a {d} millas",
      mileAway: "a {d} milla",
      veryClose: "Muy cerca",
      justPast: "Un poco más de {r} millas",
      distHours: "Horario de entrega de comida",
      eventDate: "Fecha",
      bring: "Qué traer",
      notes: "Notas",
      wheelchair: "Acceso para silla de ruedas",
      yes: "Sí", no: "No", unknown: "No se sabe",
      hoursNotListed: "Horario no publicado, llame antes.",
      daysNoTimes: "{days} (horas no publicadas, llame antes)",
      openUntil: "Abierto ahora, hasta {t}",
      opensAt: "Abre hoy a las {t}",
      closedNow: "Cerrado ahora",
      notToday: "No abre hoy",
      openOn: "Abierto {day}: {times}",
      unknownTitle: "Horario no publicado, llame antes",
      unknownBody: "Estos lugares no publicaron un horario exacto, así que no sabemos si estarán abiertos. Llame primero.",
      call: "Llamar {p}",
      directions: "Cómo llegar",
      website: "Sitio web",
      lastConfirmed: "Confirmado: {date}",
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
      suggestTitle: "¿Conoce un lugar que no está aquí?",
      suggestIntro: "Cuéntenos. Una persona revisa cada sugerencia antes de agregarla. Nada se publica automáticamente.",
      fName: "Nombre del lugar",
      fAddress: "Dirección",
      fHours: "Días y horario (si los sabe)",
      fNotes: "¿Algo más? (qué traer, a quién sirve)",
      fContact: "Su correo o teléfono (opcional, solo si podemos contactarle con preguntas)",
      fSubmit: "Enviar sugerencia",
      fSending: "Enviando...",
      fThanks: "¡Gracias! La revisaremos antes de agregarla a la lista.",
      fError: "No se pudo enviar. Intente de nuevo en un minuto.",
      fRequired: "Escriba el nombre y la dirección del lugar.",
      am: "a. m.", pm: "p. m.", noon: "mediodía", ordinal: ["", "1.er", "2.º", "3.er", "4.º", "5.º"], last: "último",
      dayNames: { Sun: "Dom", Mon: "Lun", Tue: "Mar", Wed: "Mié", Thu: "Jue", Fri: "Vie", Sat: "Sáb" },
      listingNote: "La información de cada lugar está en inglés."
    }
  };

  // ---- State ---------------------------------------------------------------
  var lang = /^es\b/i.test(navigator.language || "") ? "es" : "en";
  var listings = [];        // active, not-expired rows from listings.csv
  var zipTable = null;      // { "80202": {lat, lon}, ... }
  var origin = null;        // { lat, lon, zip } of the visitor, kept in memory only
  var outsideArea = false;
  var PAGE_SIZE = 15;        // cards shown before "Show more"
  var pageLimit = PAGE_SIZE, keepPage = false;
  var loadError = false;

  var $ = function (id) { return document.getElementById(id); };
  function t(key, vars) {
    var s = TEXT[lang][key];
    if (s === undefined) s = TEXT.en[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }

  // ---- Anonymous usage count -------------------------------------------------
  // Sends only the word "visit" or "search". No zip code, location, or anything about the person.
  function countUsage(event) {
    try {
      if (navigator.sendBeacon && location.protocol === "https:") navigator.sendBeacon("/api/count?e=" + event);
    } catch (e) { /* counting is optional */ }
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

  // ---- Dates and times ------------------------------------------------------
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoOf(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function todayISO() { return isoOf(new Date()); }
  function parseISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function formatDate(s) {
    var d = parseISO(s);
    if (!d) return s;
    return d.toLocaleDateString(lang === "es" ? "es-US" : "en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  function dayKey(s) {
    var d = (s || "").slice(0, 3).toLowerCase();
    d = d.charAt(0).toUpperCase() + d.slice(1);
    return DAY_KEYS.indexOf(d);
  }
  function formatTime(min) {
    var h = Math.floor(min / 60) % 24, m = min % 60;
    if (h === 12 && m === 0) return t("noon");
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + (m ? ":" + pad(m) : "") + (lang === "es" ? " " : "") + (h < 12 ? t("am") : t("pm"));
  }
  function formatRanges(ranges) {
    return ranges.map(function (r) { return formatTime(r[0]) + "–" + formatTime(r[1]); }).join(", ");
  }

  // ---- Distribution hours -------------------------------------------------------
  // Format (see LISTINGS-GUIDE.md): "Mon Wed 09:15-11:30 12:45-15:00; 1st 3rd Sat 09:00-12:00"
  function parseSchedule(s) {
    var out = [];
    (s || "").split(";").forEach(function (part) {
      var days = [], nth = [], ranges = [];
      part.trim().split(/[\s,]+/).forEach(function (tok) {
        if (!tok) return;
        var low = tok.toLowerCase(), m;
        if (ORDINALS[low] !== undefined) { nth.push(ORDINALS[low]); return; }
        if ((m = /^(\d{1,2})(?::(\d{2}))?-(\d{1,2})(?::(\d{2}))?$/.exec(tok))) {
          var a = +m[1] * 60 + +(m[2] || 0), b = +m[3] * 60 + +(m[4] || 0);
          if (b > a) ranges.push([a, b]);
          return;
        }
        if ((m = /^([a-z]{3})[a-z]*-([a-z]{3})[a-z]*$/i.exec(tok))) {
          var from = dayKey(m[1]), to = dayKey(m[2]);
          if (from >= 0 && to >= 0) for (var k = from; ; k = (k + 1) % 7) { days.push(k); if (k === to) break; }
          return;
        }
        var dk = dayKey(tok);
        if (dk >= 0 && /^[a-z]{3,}$/i.test(tok)) days.push(dk);
      });
      if (ranges.length) out.push({ days: days, nth: nth.length ? nth : null, ranges: ranges });
    });
    return out;
  }
  // Backup for listings with no Distribution hours: read plain Hours text like
  // "Mon, Wed, Thu, Fri 8:30am-5pm; Tue 8:30am-1:30pm" or "3rd Sat of the month 9-11am".
  // Returns [] unless every part with times also names its days.
  var DAY_WORD = /^(mon|mondays?|tue|tues|tuesdays?|wed|weds|wednesdays?|thu|thur|thurs|thursdays?|fri|fridays?|sat|saturdays?|sun|sundays?)$/;
  function parseFriendlyHours(s) {
    // Leave anything with exceptions or choices to a person: "closed Wed", "Thu or Fri", "listed as".
    if (/\b(closed|except|or|listed as|also as|varies)\b/i.test(s || "")) return [];
    var text = (s || "").toLowerCase().replace(/\bnoon\b/g, "12pm").replace(/\bof (?:each|the) month\b/g, " ")
      .replace(/[–—]/g, "-").replace(/\s*-\s*/g, "-");
    var out = [], days = [], nth = [], ranges = [], bad = false;
    function flush() {
      if (ranges.length) { if (days.length) out.push({ days: days, nth: nth.length ? nth : null, ranges: ranges }); else bad = true; }
      days = []; nth = []; ranges = [];
    }
    text.split(/;|\.\s/).forEach(function (part) {
      var re = /(\d{1,2})(?::(\d{2}))?(am|pm)?-(\d{1,2})(?::(\d{2}))?(am|pm)|([a-z0-9]+)(?:-([a-z]+))?/g, m;
      while ((m = re.exec(part))) {
        if (m[6]) {
          var eh = +m[4] % 12 + (m[6] === "pm" ? 12 : 0), sh = +m[1] % 12;
          if (m[3]) sh += m[3] === "pm" ? 12 : 0;
          else if (m[6] === "pm" && sh + 12 <= eh) sh += 12;   // "4-7pm" is 4pm, "11-2pm" is 11am
          var a = sh * 60 + +(m[2] || 0), b = eh * 60 + +(m[5] || 0);
          if (b > a) ranges.push([a, b]);
          continue;
        }
        var word = m[7], dk = dayKey(word), isDay = DAY_WORD.test(word);
        if (ORDINALS[word] !== undefined || isDay) {
          if (ranges.length) flush();          // "Mon 9-11, Wed 1-3": a new day starts a new entry
          if (ORDINALS[word] !== undefined) { nth.push(ORDINALS[word]); continue; }
          var to = m[8] && DAY_WORD.test(m[8]) ? dayKey(m[8]) : -1;
          if (to >= 0) for (var k = dk; ; k = (k + 1) % 7) { days.push(k); if (k === to) break; }
          else days.push(dk);
        }
      }
      flush();
    });
    return bad ? [] : out;
  }
  function entryApplies(e, date, l) {
    if (l.type === "One-time event" && l.eventDate !== isoOf(date)) return false;
    if (!e.days.length) return l.type === "One-time event";
    if (e.days.indexOf(date.getDay()) < 0) return false;
    if (!e.nth) return true;
    var week = Math.ceil(date.getDate() / 7);
    var isLast = addDays(date, 7).getMonth() !== date.getMonth();
    return e.nth.indexOf(week) >= 0 || (isLast && e.nth.indexOf(-1) >= 0);
  }
  // Closed dates: "2026-11-26 2026-12-31" or a range like "2026-11-25 to 2026-11-29".
  function parseClosed(s) {
    var out = [], re = /(\d{4}-\d{2}-\d{2})(?:\s*(?:to|-|–|—)\s*(\d{4}-\d{2}-\d{2}))?/g, m;
    while ((m = re.exec(s || ""))) out.push([m[1], m[2] || m[1]]);
    return out.sort(function (a, b) { return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0; });
  }
  function closedOn(l, date) {
    var d = isoOf(date);
    return l.closed.some(function (c) { return d >= c[0] && d <= c[1]; });
  }
  // True when the hours say which days they apply to. Times with no days ("8:30-11am") don't.
  function hasDays(l) {
    if (l.type === "One-time event") return l.schedule.length > 0;
    return l.schedule.some(function (e) { return e.days.length > 0; });
  }
  function rangesOn(l, date) {
    if (closedOn(l, date)) return [];
    var r = [];
    l.schedule.forEach(function (e) { if (entryApplies(e, date, l)) r = r.concat(e.ranges); });
    return r.sort(function (a, b) { return a[0] - b[0]; });
  }
  function scheduleText(l) {
    return l.schedule.map(function (e) {
      var ord = e.nth ? e.nth.map(function (n) { return n === -1 ? t("last") : TEXT[lang].ordinal[n]; }).join(", ") + " " : "";
      var days = e.days.map(function (d) { return TEXT[lang].dayNames[DAY_KEYS[d]]; }).join(", ");
      return (ord + days + (days ? ": " : "")) + formatRanges(e.ranges);
    }).join("; ");
  }

  // What the visitor picked under "When do you need food?"
  function whenChoice() {
    var mode = (document.querySelector('input[name="when"]:checked') || {}).value || "all";
    var now = new Date();
    if (mode === "now") return { mode: mode, date: now, from: now.getHours() * 60 + now.getMinutes(), to: null };
    if (mode === "ahead") {
      var w = WINDOWS[$("ahead-time").value] || WINDOWS.any, offset = +$("ahead-day").value || 0;
      // For today, skip the part of the time window that has already passed.
      var from = offset === 0 ? Math.max(w[0], now.getHours() * 60 + now.getMinutes()) : w[0];
      return { mode: mode, date: addDays(now, offset), from: from, to: w[1] };
    }
    return { mode: "all", date: now };
  }

  // Returns "yes", "no", or "unknown" for whether a listing fits the chosen time.
  function timeMatch(l, when) {
    if (when.mode === "all") return "yes";
    if (closedOn(l, when.date)) return "no";
    if (hasDays(l)) {
      return rangesOn(l, when.date).some(function (r) {
        return when.mode === "now" ? (when.from >= r[0] && when.from < r[1]) : (r[0] < when.to && r[1] > when.from);
      }) ? "yes" : "no";
    }
    // No exact hours. If the Days column rules the day out, skip it; otherwise we can't tell.
    if (l.type === "One-time event") return l.eventDate === isoOf(when.date) ? "unknown" : "no";
    if (l.days.length && l.days.indexOf(DAY_KEYS[when.date.getDay()]) < 0) return "no";
    return "unknown";
  }

  // Short status line on each card, e.g. "Open now, until 3pm".
  function statusOf(l, when) {
    if (when.mode !== "ahead" && closedOn(l, new Date())) return { cls: "closed", text: t("closedToday") };
    if (!l.schedule.length) return { cls: "unknown", text: t("hoursNotListed") };
    if (!hasDays(l)) return { cls: "unknown", text: t("callDays") };
    if (when.mode === "ahead") {
      var r = rangesOn(l, when.date).filter(function (x) { return x[0] < when.to && x[1] > when.from; });
      if (!r.length) return null;
      return { cls: "open", text: t("openOn", { day: aheadDayLabel(+$("ahead-day").value), times: formatRanges(r) }) };
    }
    var now = new Date(), m = now.getHours() * 60 + now.getMinutes(), today = rangesOn(l, now);
    for (var i = 0; i < today.length; i++) {
      if (m >= today[i][0] && m < today[i][1]) return { cls: "open", text: t("openUntil", { t: formatTime(today[i][1]) }) };
      if (m < today[i][0]) return { cls: "later", text: t("opensAt", { t: formatTime(today[i][0]) }) };
    }
    return { cls: "closed", text: today.length ? t("closedNow") : t("notToday") };
  }

  function aheadDayLabel(offset) {
    if (offset === 0) return t("today").toLowerCase();
    if (offset === 1) return t("tomorrow").toLowerCase();
    return addDays(new Date(), offset).toLocaleDateString(lang === "es" ? "es-US" : "en-US", { weekday: "long", month: "short", day: "numeric" });
  }
  function fillAheadDays() {
    var sel = $("ahead-day"), keep = sel.value || "0";
    sel.textContent = "";
    for (var i = 0; i < 14; i++) {
      var label = i === 0 ? t("today") : i === 1 ? t("tomorrow") :
        addDays(new Date(), i).toLocaleDateString(lang === "es" ? "es-US" : "en-US", { weekday: "long", month: "short", day: "numeric" });
      sel.appendChild(el("option", { value: String(i), text: label }));
    }
    sel.value = keep;
  }

  // One schedule drives the card status, Open now, and Look ahead alike.
  // Distribution hours wins; plain Hours text is the backup unless the notes say schedules conflict.
  function scheduleOf(o) {
    var s = parseSchedule(o["distribution hours"]);
    if (s.length || (o["distribution hours"] || "").trim()) return s;
    if (/do not agree|don't agree|disagree|conflict/i.test(o["notes"] || "")) return [];
    return parseFriendlyHours(o["hours"]);
  }
  function cleanListing(o) {
    var lat = parseFloat(o["latitude"]), lon = parseFloat(o["longitude"]);
    var days = (o["days"] || "").split(/[\s,]+/).map(function (d) { return DAY_KEYS[dayKey(d)]; })
      .filter(function (d) { return !!d; });
    var wc = (o["wheelchair accessible"] || "").toLowerCase();
    var style = (o["service style"] || "").toLowerCase();
    var walk = /walk/.test(style), drive = /drive/.test(style);
    return {
      id: o["id"], name: o["name"], type: o["type"], address: o["address"], city: o["city"],
      zip: (o["zip"] || "").slice(0, 5), lat: isNaN(lat) ? null : lat, lon: isNaN(lon) ? null : lon,
      days: days, hours: o["hours"], schedule: scheduleOf(o),
      closed: parseClosed(o["closed dates"]),
      bring: o["what to bring"], phone: o["phone"], website: o["website"],
      notes: o["notes"], eventDate: o["event date"], verified: o["last verified"], source: o["source"],
      wheelchair: /^(y|yes|true)$/.test(wc) ? "yes" : /^(n|no|false)$/.test(wc) ? "no" : "",
      style: walk && drive ? "both" : walk ? "walk" : drive ? "drive" : "",
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
        // Only offer the wheelchair and walk-in/drive-through filters when some listing has that information.
        $("wheelchair-wrap").hidden = !listings.some(function (l) { return l.wheelchair; });
        $("style-wrap").hidden = !listings.some(function (l) { return l.style; });
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

  // In Spanish, translate the parts of the Hours column that follow a pattern (days, "1st", "noon", "am").
  // Everything else stays as written. No machine translation.
  var ES_HOURS = [
    [/\bMondays\b/g, "lunes"], [/\bTuesdays\b/g, "martes"], [/\bWednesdays\b/g, "miércoles"],
    [/\bThursdays\b/g, "jueves"], [/\bFridays\b/g, "viernes"], [/\bSaturdays\b/g, "sábados"], [/\bSundays\b/g, "domingos"],
    [/\bMonday\b/g, "lunes"], [/\bTuesday\b/g, "martes"], [/\bWednesday\b/g, "miércoles"],
    [/\bThursday\b/g, "jueves"], [/\bFriday\b/g, "viernes"], [/\bSaturday\b/g, "sábado"], [/\bSunday\b/g, "domingo"],
    [/\bMon\b\.?/g, "lun"], [/\bTues?\b\.?/g, "mar"], [/\bWed\b\.?/g, "mié"], [/\bThu(?:rs?)?\b\.?/g, "jue"],
    [/\bFri\b\.?/g, "vie"], [/\bSat\b\.?/g, "sáb"], [/\bSun\b\.?/g, "dom"],
    [/\b1st\b/g, "1.er"], [/\b2nd\b/g, "2.º"], [/\b3rd\b/g, "3.er"], [/\b4th\b/g, "4.º"], [/\b5th\b/g, "5.º"], [/\blast\b/g, "último"],
    [/\bJan\b/g, "ene"], [/\bFeb\b/g, "feb"], [/\bMar\b/g, "mar"], [/\bApr\b/g, "abr"], [/\bMay\b/g, "may"],
    [/\bJun\b/g, "jun"], [/\bJul\b/g, "jul"], [/\bAug\b/g, "ago"], [/\bSep\b/g, "sep"], [/\bOct\b/g, "oct"],
    [/\bNov\b/g, "nov"], [/\bDec\b/g, "dic"],
    [/\bof (?:each|the) month\b/g, "del mes"], [/\bevery week\b/g, "cada semana"],
    [/\bCall for hours\b/g, "Llame para saber el horario"],
    [/^Listed as\b/, "Aparece como"], [/,? and also as\b/g, " y también como"],
    [/(\d)\s?am\b/g, "$1 a. m."], [/(\d)\s?pm\b/g, "$1 p. m."], [/\. m\.\./g, ". m."],
    [/\bnoon\b/g, "mediodía"],
    // "and" only between days and times, so free text like "Bread and produce" stays as written.
    [/,? and (?=(?:\d|lun|mar|mié|jue|vie|sáb|dom|lunes|martes|miércoles|jueves|viernes|sábados?|domingos?|mediodía)(?![A-Za-z]))/g, " y "]
  ];
  function localHours(s) {
    if (lang !== "es") return s;
    return ES_HOURS.reduce(function (out, p) { return out.replace(p[0], p[1]); }, s);
  }

  function hoursText(l) {
    if (l.hours) return localHours(l.hours);
    if (l.schedule.length) return scheduleText(l);
    if (l.days.length) return t("daysNoTimes", { days: l.days.map(function (d) { return TEXT[lang].dayNames[d]; }).join(", ") });
    return t("hoursNotListed");
  }

  function card(l, dist, radius, when) {
    var status = statusOf(l, when);
    var distText = null;
    if (dist !== null) {
      distText = dist < 0.1 ? t("veryClose") : t(dist === 1 ? "mileAway" : "milesAway", { d: dist });
      if (dist > radius) distText += " · " + t("justPast", { r: radius });
    }
    var meta = el("div", { class: "card-meta" }, [
      el("span", { class: "type-tag", text: t(l.type) }),
      distText ? el("span", { class: "distance", text: distText }) : null
    ]);

    var addr = [l.address, l.city, l.address || l.city ? "CO" : "", l.zip].filter(Boolean).join(", ").replace(", CO, ", ", CO ");
    var dl = el("dl");
    function row(label, value) {
      if (!value) return;
      dl.appendChild(el("dt", { text: label }));
      dl.appendChild(el("dd", { text: value }));
    }
    if (l.type === "One-time event") row(t("eventDate"), formatDate(l.eventDate));
    row(t("distHours"), hoursText(l));
    var today = todayISO();
    row(t("closedDates"), l.closed.filter(function (c) { return c[1] >= today; }).map(function (c) {
      return c[0] === c[1] ? formatDate(c[0]) : formatDate(c[0]) + " – " + formatDate(c[1]);
    }).join("; "));
    row(t("bring"), l.bring);
    row(t("notes"), l.notes);
    // Only show these two when we actually know the answer.
    if (l.address) {
      row(t("wheelchair"), l.wheelchair === "yes" ? t("yes") : l.wheelchair === "no" ? t("no") : "");
      row(t("serviceStyle"), { walk: t("styleWalk"), drive: t("styleDrive"), both: t("styleBoth") }[l.style] || "");
    }

    var actions = el("div", { class: "card-actions" });
    var tel = telHref(l.phone);
    if (tel) actions.appendChild(el("a", { class: "btn btn-primary btn-call", href: tel, text: t("call", { p: l.phone }) }));
    if (l.address) {
      var q = encodeURIComponent([l.address, l.city, "CO", l.zip].filter(Boolean).join(", "));
      // This Google Maps link opens the Maps app on phones that have it.
      actions.appendChild(el("a", { class: "btn btn-secondary", href: "https://www.google.com/maps/dir/?api=1&destination=" + q, target: "_blank", rel: "noopener", text: t("directions") }));
    }
    var web = safeUrl(l.website);
    if (web) actions.appendChild(el("a", { class: "btn btn-secondary", href: web, target: "_blank", rel: "noopener", text: t("website") }));

    var vd = parseISO(l.verified);
    var checked = el("p", { class: "checked", text: t("lastConfirmed", { date: vd ? formatDate(l.verified) : t("unknown") }) });
    var stale = (!vd || (Date.now() - vd.getTime()) / 864e5 > STALE_DAYS) ? el("p", { class: "stale", text: t("stale") }) : null;

    return el("article", { class: "card", id: "listing-" + l.id }, [
      el("h3", { text: l.name }), meta,
      status ? el("p", { class: "status status-" + status.cls, text: status.text }) : null,
      addr ? el("p", { class: "address", text: addr }) : null,
      dl, actions, checked, stale,
      lang === "es" ? el("p", { class: "checked", lang: "es", text: t("someEnglish") }) : null
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
    // Any new search, filter, or language change starts back at the first page.
    if (!keepPage) pageLimit = PAGE_SIZE;
    keepPage = false;
    var list = $("listings"), summary = $("results-summary"), none = $("no-results"),
        unknown = $("unknown-hours"), phone = $("phone-help");
    list.textContent = ""; none.textContent = ""; unknown.textContent = ""; phone.textContent = "";
    renderNationalSmall();
    $("ahead-panel").hidden = whenChoice().mode !== "ahead";

    if (loadError) { summary.textContent = t("loadFailed"); return; }

    var radius = +$("radius").value;
    var when = whenChoice();
    var type = $("type-filter").value;
    var q = $("name-search").value.trim().toLowerCase();
    var wcOnly = $("wheelchair-filter").checked && !$("wheelchair-wrap").hidden;
    var style = $("style-wrap").hidden ? "" : $("style-filter").value;
    var filtersOn = !!(type || q || wcOnly || style);
    $("filters-on").hidden = !filtersOn;

    // Filters that are not about time
    var filtered = listings.filter(function (l) {
      if (type && l.type !== type) return false;
      if (q && l.name.toLowerCase().indexOf(q) < 0) return false;
      if (wcOnly && l.wheelchair !== "yes") return false;
      if (style && l.style !== style && l.style !== "both") return false;
      return true;
    });

    // Listings with no place on the map (phone lines, statewide programs) are shown separately.
    // Phone lines with exact hours follow the time choice too, so a line that's closed then isn't shown.
    var placed = [], phoneOnly = [];
    filtered.forEach(function (l) {
      if (placeOf(l)) placed.push(l);
      else if (timeMatch(l, when) !== "no") phoneOnly.push(l);
    });

    var nearby = placed.map(function (l) { return { l: l, d: origin ? miles(origin, placeOf(l)) : null }; });
    if (origin) {
      nearby = nearby.filter(function (x) { return x.d <= radius + EDGE_MILES; })
        .sort(function (a, b) { return a.d - b.d; });
    } else {
      nearby.sort(function (a, b) { return a.l.name.localeCompare(b.l.name); });
    }

    // Outside the Denver area, or nothing nearby at all: point to the national services.
    var nothingNearby = origin && !outsideArea && nearby.length === 0 && !filtersOn;
    if (outsideArea || nothingNearby) {
      var box = el("div", { class: "no-listings" }, [el("p", { text: t("noArea") })]);
      // The Hunger Free Colorado hotline serves the whole state, so Colorado visitors see it first.
      var hotline = origin && origin.colorado && listings.filter(function (l) { return l.id === STATE_HOTLINE; })[0];
      if (hotline) box.appendChild(el("div", { class: "listings state-hotline" }, [card(hotline, null, radius, when)]));
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

    // Time choice: matching places first, then places whose hours we don't know.
    var shown = [], maybe = [];
    nearby.forEach(function (x) {
      var m = timeMatch(x.l, when);
      if (m === "yes") shown.push(x); else if (m === "unknown") maybe.push(x);
    });

    // With a zip code, count places inside the distance separately from the "just past" ones.
    var past = origin ? shown.filter(function (x) { return x.d > radius; }).length : 0;
    var vars = { n: shown.length - past, r: radius, when: aheadDayLabel(+$("ahead-day").value) };
    var countText;
    if (when.mode === "now") countText = t(origin ? "summaryNowNear" : "summaryNow", vars);
    else if (when.mode === "ahead") countText = t(origin ? "summaryAheadNear" : "summaryAhead", vars);
    else countText = origin ? t("summaryNear", vars) : t("summaryAll", vars);
    if (past) countText += " " + t("summaryPast", { n: past, r: radius });
    summary.textContent = countText + (TEXT[lang].listingNote ? " " + TEXT[lang].listingNote : "");

    if (!shown.length) none.appendChild(el("p", { class: "no-listings", text: t(maybe.length ? "noneOpen" : "noneMatch") }));

    shown.slice(0, pageLimit).forEach(function (x) {
      list.appendChild(card(x.l, x.d === null ? null : Math.round(x.d * 10) / 10, radius, when));
    });
    if (shown.length > pageLimit) {
      var more = el("button", { type: "button", class: "btn btn-secondary show-more", text: t("showMore") });
      more.addEventListener("click", function () {
        var first = shown[pageLimit].l.id;
        pageLimit += PAGE_SIZE; keepPage = true; render();
        // Move keyboard and screen reader focus to the first new card.
        var c = $("listing-" + first);
        if (c) { c.setAttribute("tabindex", "-1"); c.focus(); }
      });
      list.appendChild(more);
    }

    if (maybe.length) {
      unknown.appendChild(el("h2", { class: "section-title", text: t("unknownTitle") }));
      unknown.appendChild(el("p", { class: "section-note", text: t("unknownBody") }));
      var ul = el("div", { class: "listings" });
      maybe.forEach(function (x) { ul.appendChild(card(x.l, x.d === null ? null : Math.round(x.d * 10) / 10, radius, when)); });
      unknown.appendChild(ul);
    }

    if (phoneOnly.length) {
      phone.appendChild(el("h2", { class: "section-title", text: t("phoneHelp") }));
      var pl = el("div", { class: "listings" });
      phoneOnly.forEach(function (l) { pl.appendChild(card(l, null, radius, when)); });
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
        origin = { lat: pt.lat, lon: pt.lon, zip: zip, colorado: true };
        outsideArea = miles(origin, DENVER) > COVERAGE_MILES;
      } else {
        // Colorado zip codes run from 80001 to 81658, in case one is missing from our file.
        origin = { lat: 0, lon: 0, zip: zip, colorado: +zip >= 80001 && +zip <= 81658 };
        outsideArea = true;
      }
      countUsage("search");
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
        var near = nearestZip(pt); // null when no Colorado zip code is within 15 miles
        origin = { lat: pt.lat, lon: pt.lon, zip: near, colorado: !!near };
        outsideArea = miles(origin, DENVER) > COVERAGE_MILES;
        $("zip").value = "";
        countUsage("search");
        setMsg(t("usingLocation"));
        render();
      }).catch(function () { setMsg(t("loadFailed"), true); });
    }, function () {
      setMsg(t("locateFailed"), true);
    }, { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 });
  }

  // ---- Suggest a place (Netlify Forms) ------------------------------------------
  function setupSuggestForm() {
    var form = $("suggest-form"), msg = $("suggest-msg");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.elements.company.value) return;   // spam trap was filled in
      if (!form.elements.name.value.trim() || !form.elements.address.value.trim()) {
        msg.textContent = t("fRequired"); msg.className = "suggest-msg error"; return;
      }
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true; msg.className = "suggest-msg"; msg.textContent = t("fSending");
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.reset();
        msg.textContent = t("fThanks");
      }).catch(function () {
        msg.textContent = t("fError"); msg.className = "suggest-msg error";
      }).then(function () { btn.disabled = false; });
    });
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
    fillAheadDays();
  }

  // ---- Start ---------------------------------------------------------------
  function start() {
    applyLanguage();
    $("zip-form").addEventListener("submit", function (e) { e.preventDefault(); searchZip($("zip").value.trim()); });
    $("locate").addEventListener("click", useLocation);
    ["radius", "type-filter", "ahead-day", "ahead-time", "style-filter", "wheelchair-filter"].forEach(function (id) {
      $(id).addEventListener("change", render);
    });
    document.querySelectorAll('input[name="when"]').forEach(function (r) { r.addEventListener("change", render); });
    $("name-search").addEventListener("input", render);
    $("clear-filters").addEventListener("click", function () {
      $("type-filter").value = ""; $("name-search").value = "";
      $("wheelchair-filter").checked = false; $("style-filter").value = "";
      render();
    });
    $("lang-toggle").addEventListener("click", function () {
      lang = lang === "es" ? "en" : "es";
      applyLanguage();
      if (!$("zip-msg").classList.contains("error")) setMsg("");
      render();
    });
    setupSuggestForm();

    $("results-summary").textContent = t("loading");
    renderNationalSmall();
    countUsage("visit");
    // Zip centroids are loaded too, so listings with a blank Latitude/Longitude can still be placed.
    Promise.all([loadListings(), loadZips()]).catch(function () { loadError = true; }).then(render);
  }

  start();
})();
