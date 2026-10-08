// Modèle « Restaurant » — petit script commun (aucune donnée envoyée nulle part).
// - statut « Ouvert / Fermé » calculé à l'heure d'Alger
// - jour courant surligné dans les horaires
// - onglet de catégorie actif dans le menu
// - visionneuse de la galerie
// - apparition douce des sections
(function () {
  document.documentElement.classList.add("js");

  var lang = document.documentElement.lang === "ar" ? "ar" : "fr";
  var T = {
    fr: { ouvert: "Ouvert maintenant", fermeA: "ferme à", ferme: "Fermé actuellement", ouvreA: "ouvre à", demain: "demain" },
    ar: { ouvert: "مفتوح الآن", fermeA: "يغلق على", ferme: "مغلق حالياً", ouvreA: "يفتح على", demain: "غداً" }
  }[lang];

  // ---------- Heure d'Alger ----------
  var JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  function maintenantAlger() {
    try {
      var p = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Algiers", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
      var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
      var j = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday);
      return { jour: j, minutes: (+o.hour) * 60 + (+o.minute) };
    } catch (e) {
      var d = new Date(); return { jour: d.getDay(), minutes: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function enMinutes(h) { var x = h.split(":"); return (+x[0]) * 60 + (+x[1]); }

  var horairesEl = document.getElementById("donnees-horaires");
  if (horairesEl) {
    var horaires = JSON.parse(horairesEl.textContent);
    var now = maintenantAlger();

    // Surligner aujourd'hui
    var ligne = document.querySelector('.horaires tr[data-jour="' + JOURS[now.jour] + '"]');
    if (ligne) ligne.classList.add("aujourdhui");

    // Statut ouvert/fermé (gère les créneaux après minuit, ex. 19:00-01:00)
    var statut = "", classe = "";
    function creneaux(j) { return horaires[JOURS[(j + 7) % 7]] || []; }
    var ouvertJusqua = null;
    creneaux(now.jour).forEach(function (c) {
      var a = enMinutes(c.split("-")[0]), b = enMinutes(c.split("-")[1]);
      if (b <= a) b += 1440;
      if (now.minutes >= a && now.minutes < b) ouvertJusqua = c.split("-")[1];
    });
    creneaux(now.jour - 1).forEach(function (c) {
      var a = enMinutes(c.split("-")[0]), b = enMinutes(c.split("-")[1]);
      if (b <= a && now.minutes < b) ouvertJusqua = c.split("-")[1];
    });
    if (ouvertJusqua) {
      statut = T.ouvert + " · " + T.fermeA + " " + ouvertJusqua; classe = "ouvert";
    } else {
      var prochain = null;
      creneaux(now.jour).forEach(function (c) {
        var a = enMinutes(c.split("-")[0]);
        if (a > now.minutes && prochain === null) prochain = c.split("-")[0];
      });
      if (prochain) statut = T.ferme + " · " + T.ouvreA + " " + prochain;
      else {
        var dem = creneaux(now.jour + 1)[0];
        statut = T.ferme + (dem ? " · " + T.ouvreA + " " + dem.split("-")[0] + " " + T.demain : "");
      }
      classe = "ferme";
    }
    document.querySelectorAll(".statut").forEach(function (el) { el.textContent = statut; el.classList.add(classe); });
  }

  // ---------- Onglets du menu ----------
  var onglets = document.querySelectorAll(".onglets a");
  if (onglets.length && "IntersectionObserver" in window) {
    var parId = {};
    onglets.forEach(function (a) { parId[a.getAttribute("href").slice(1)] = a; });
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        onglets.forEach(function (a) { a.classList.remove("actif"); });
        var a = parId[e.target.id];
        if (a) { a.classList.add("actif"); a.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" }); }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll(".categorie").forEach(function (c) { obs.observe(c); });
  }

  // ---------- Visionneuse de la galerie ----------
  var dlg = document.querySelector("dialog.visionneuse");
  if (dlg && dlg.showModal) {
    document.querySelectorAll(".galerie button").forEach(function (b) {
      b.addEventListener("click", function () {
        dlg.querySelector("img").src = b.dataset.grande;
        dlg.querySelector("img").alt = b.dataset.legende || "";
        dlg.querySelector("p").textContent = b.dataset.legende || "";
        dlg.showModal();
      });
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  // ---------- Texte qui sort du flou, mot à mot, au défilement ----------
  // Adapté de codrops/ScrollBlurTypography (MIT, © Codrops), sans GSAP. Sans JS : texte net.
  var flous = document.querySelectorAll(".flou-mots");
  var mouvementOk = !window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (flous.length && mouvementOk) {
    var blocs = [].map.call(flous, function (el) { return { el: el, mots: el.querySelectorAll(".mot") }; });
    var enAttente = false;
    var majFlou = function () {
      enAttente = false;
      var vh = window.innerHeight;
      blocs.forEach(function (b) {
        var r = b.el.getBoundingClientRect();
        // 0 quand le haut du texte entre par le bas (85 %), 1 quand son bas atteint 60 % de l'écran
        var debut = vh * 0.85, fin = vh * 0.6;
        var p = (debut - r.top) / ((debut - fin) + r.height);
        p = Math.max(0, Math.min(1, p));
        var n = b.mots.length, largeur = 4;
        b.mots.forEach(function (m, i) {
          var l = Math.max(0, Math.min(1, (p * (n + largeur) - i) / largeur));
          m.style.setProperty("--l", l.toFixed(3));
        });
      });
    };
    var demander = function () { if (!enAttente) { enAttente = true; requestAnimationFrame(majFlou); } };
    document.documentElement.classList.add("flou-actif");
    window.addEventListener("scroll", demander, { passive: true });
    window.addEventListener("resize", demander);
    majFlou();
  }

  // ---------- Apparition douce ----------
  var aAnimer = document.querySelectorAll(".apparait");
  if ("IntersectionObserver" in window) {
    var o2 = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visible"); o2.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    aAnimer.forEach(function (el) { o2.observe(el); });
  } else {
    aAnimer.forEach(function (el) { el.classList.add("visible"); });
  }
})();
