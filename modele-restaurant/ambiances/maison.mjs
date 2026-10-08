// Ambiance « Maison » — enseigne à plusieurs boutiques (La Pâtisserie par Lucas Castello).
// Tirée de leurs boutiques : murs chocolat, poutres jaune moutarde en diagonale au plafond, grain doré,
// comptoirs blancs, menu sur fond marbre. Élément fort : la bande moutarde en diagonale.
import { UI, t, tr, echapper, lienTel, lienInsta, autreLangue, tete, bandeau, telInternational } from "../gabarits.mjs";
import { icones } from "../icones.mjs";

const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const TXT = {
  fr: {
    nav: [["maison", "La Maison"], ["creations", "Créations"], ["enseignes", "L'Encas & Sō Sundae"], ["boutiques", "Boutiques"], ["commandes", "Commandes"]],
    trouver: "Trouver une boutique", creations: "Nos créations", voirCreations: "Voir nos créations",
    maison: "La Maison", enseignes: "Sous le même toit", boutiques: "Nos boutiques",
    boutiquesIntro: (n) => `${n} adresses à Alger, pour la plupart ouvertes dès 6 heures du matin.`,
    appeler: "Appeler", itineraire: "Itinéraire", galerie: "Dans nos boutiques",
    commandes: "Une commande, un événement ?",
    commandesTexte: "Pour une commande ou un événement, appelez la boutique la plus proche de chez vous.",
    instagram: "Suivre sur Instagram", horairesInconnus: "Horaires à confirmer",
    tous: "Tous les jours", sem: "Dim. – mer.", we: "Jeu. – sam.", minuit: "minuit",
    espaces: { patisserie: "Pâtisserie", encas: "L'Encas", sosundae: "Sō Sundae" },
    ouvert: "Ouvert", ferme: "Fermé", jusqua: "jusqu'à", ouvreA: "ouvre à",
    voirSite: "← Retour au site"
  },
  ar: {
    nav: [["maison", "الدار"], ["creations", "إبداعاتنا"], ["enseignes", "L'Encas و Sō Sundae"], ["boutiques", "محلاتنا"], ["commandes", "الطلبيات"]],
    trouver: "اعثر على محل", creations: "إبداعاتنا", voirCreations: "شاهد إبداعاتنا",
    maison: "الدار", enseignes: "تحت سقف واحد", boutiques: "محلاتنا",
    boutiquesIntro: (n) => `${n} عناوين بالعاصمة، معظمها مفتوح من السادسة صباحاً.`,
    appeler: "اتصل", itineraire: "الاتجاهات", galerie: "في محلاتنا",
    commandes: "طلبية أو مناسبة؟",
    commandesTexte: "لطلبية أو مناسبة، اتصلوا بأقرب محل إليكم.",
    instagram: "تابعونا على إنستغرام", horairesInconnus: "الأوقات قيد التأكيد",
    tous: "كل يوم", sem: "الأحد – الأربعاء", we: "الخميس – السبت", minuit: "منتصف الليل",
    espaces: { patisserie: "حلويات", encas: "L'Encas", sosundae: "Sō Sundae" },
    ouvert: "مفتوح", ferme: "مغلق", jusqua: "حتى", ouvreA: "يفتح على",
    voirSite: "→ العودة إلى الموقع"
  }
};

// Le grain doré (reprise de leur emblème) et le nom en capitales, comme sur l'enseigne
const GRAIN = `<svg class="m-grain" viewBox="-20 -32 40 64" aria-hidden="true"><path d="M0-30C17-21 17 21 0 30-17 21-17-21 0-30Z" fill="currentColor"/><path d="M3-25C-9-9 11 7-3 25" fill="none" stroke="var(--grain-fente)" stroke-width="3.2" stroke-linecap="round"/></svg>`;
const marque = (classe = "") => `<span class="m-marque ${classe}">${GRAIN}<span class="m-mots"><span class="m-l1">La Pâtisserie</span><span class="m-l2">par Lucas Castello</span></span></span>`;

const heure = (h, lang) => (h === "00:00" ? TXT[lang].minuit : lang === "ar" ? h : h.replace(/^0/, "").replace(":00", "h").replace(":", "h"));
const plage = (c, lang) => { const [a, b] = c.split("-"); return `${heure(a, lang)} – ${heure(b, lang)}`; };
function resumeHoraires(h, lang) {
  const x = TXT[lang];
  if (!h) return x.horairesInconnus;
  const v = JOURS.map((j) => (h[j] || []).join(","));
  if (v.every((s) => s === v[0])) return `${x.tous} · ${plage(h.dimanche[0], lang)}`;
  return `${x.sem} · ${plage(h.dimanche[0], lang)}<br>${x.we} · ${plage(h.jeudi[0], lang)}`;
}

const enTete = (c, lang, accueil, sousChemin) => {
  const x = TXT[lang], base = accueil === "#haut" ? "" : accueil;
  return `
<header class="m-entete">
  <div class="m-entete-in">
    <a class="m-logo" href="${accueil}" aria-label="${t(c.d.nom, lang)}">${marque()}</a>
    <nav class="m-nav" aria-label="Navigation">${x.nav.map(([id, l]) => `<a href="${base}#${id}">${l}</a>`).join("")}</nav>
    ${c.langues.length > 1 ? `<a class="m-langue" href="${autreLangue(c, lang, sousChemin)}" lang="${lang === "fr" ? "ar" : "fr"}">${lang === "fr" ? "العربية" : "FR"}</a>` : ""}
  </div>
</header>`;
};

const pied = (c, lang) => {
  const credit = c.credit && c.credit.nom ? `<p>${UI[lang].credit} ${echapper(c.credit.nom)}</p>` : "";
  return `
<footer class="m-pied">
  ${marque("m-marque-pied")}
  <p>${t(c.d.adresse, lang)} · © ${new Date().getFullYear()}</p>
  ${credit}
</footer>`;
};

const barre = (c, lang, ancre) => `
<nav class="m-barre" aria-label="${TXT[lang].boutiques}">
  <a class="m-btn m-btn-plein" href="${ancre}">${icones.lieu}${TXT[lang].boutiques}</a>
  ${c.d.instagram ? `<a class="m-btn m-btn-trait" href="${lienInsta(c.d.instagram)}" target="_blank" rel="noopener">${icones.instagram}Instagram</a>` : ""}
</nav>`;

const vitrines = (c, lang) => (c.images.vitrines || []).map((v) => `
    <article class="m-carte">
      <img src="${c.racine}${v.petit}" alt="${t(v.legende, lang)}" width="${v.l}" height="${v.h}" loading="lazy" decoding="async">
      <h3>${t(v.legende, lang)}</h3>
      ${tr(v.detail, lang) ? `<p>${t(v.detail, lang)}</p>` : ""}
    </article>`).join("");

// Statut « ouvert / fermé » de chaque boutique, à l'heure d'Alger
const SCRIPT_STATUT = (lang) => `<script>(function(){var T=${JSON.stringify({ o: TXT[lang].ouvert, f: TXT[lang].ferme, j: TXT[lang].jusqua, a: TXT[lang].ouvreA, m: TXT[lang].minuit })};
var J=${JSON.stringify(JOURS)};function n(){try{var p=new Intl.DateTimeFormat("en-GB",{timeZone:"Africa/Algiers",weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date()),o={};p.forEach(function(x){o[x.type]=x.value});return{d:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(o.weekday),m:+o.hour*60+ +o.minute}}catch(e){var d=new Date();return{d:d.getDay(),m:d.getHours()*60+d.getMinutes()}}}
function mn(h){var x=h.split(":");return +x[0]*60+ +x[1]}function f(h){return h==="00:00"?T.m:${lang === "ar" ? "h" : 'h.replace(/^0/,"").replace(":00","h").replace(":","h")'}}
var t=n();document.querySelectorAll("[data-horaires]").forEach(function(el){var h=JSON.parse(el.getAttribute("data-horaires"));var s=el.querySelector(".m-statut");if(!h||!s)return;var ouvert=null;
[[t.d,0],[(t.d+6)%7,1440]].forEach(function(q){(h[J[q[0]]]||[]).forEach(function(c){var a=mn(c.split("-")[0]),b=mn(c.split("-")[1]);if(b<=a)b+=1440;var m=t.m+q[1];if(m>=a&&m<b)ouvert=c.split("-")[1]})});
if(ouvert){s.textContent=T.o+" · "+T.j+" "+f(ouvert);s.classList.add("ouvert")}else{var c=(h[J[t.d]]||[])[0];s.textContent=T.f+(c&&mn(c.split("-")[0])>t.m?" · "+T.a+" "+f(c.split("-")[0]):"");s.classList.add("ferme")}})})();</script>`;

export function pageAccueil(c, lang) {
  const d = c.d, x = TXT[lang], u = UI[lang];
  const nom = tr(d.nom, lang), img = c.images.accueil, chemin = lang === "ar" ? "ar/" : "";
  const boutiques = d.boutiques || [];
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Organization", name: nom,
    ...(d.url ? { url: d.url } : {}), ...(d.instagram ? { sameAs: [lienInsta(d.instagram)] } : {}),
    location: boutiques.map((b) => ({ "@type": "Bakery", name: `${nom} — ${tr(b.nom, "fr")}`, telephone: `+${telInternational(b.telephone)}`, address: { "@type": "PostalAddress", streetAddress: tr(b.repere, "fr"), addressLocality: tr(b.nom, "fr"), addressCountry: "DZ" } }))
  };
  const galerie = (c.images.galerie || []).map((g) => `
    <figure><button type="button" data-grande="${c.racine}${g.grand}" data-legende="${t(g.legende, lang)}" aria-label="${t(g.legende, lang)}"><img src="${c.racine}${g.petit}" alt="${t(g.legende, lang)}" width="${g.l}" height="${g.h}" loading="lazy" decoding="async"></button>
    <figcaption>${t(g.legende, lang)}</figcaption></figure>`).join("");

  return `${tete(c, lang, { titre: `${nom} — ${tr(d.type_cuisine, lang)}, ${tr(d.quartier, lang)}`, description: tr(d.accroche, lang), chemin, prechargerAccueil: true })}
<body class="maison">
${bandeau(c, lang)}
${enTete(c, lang, "#haut", "")}
<main id="haut">
<section class="m-hero">
  <div class="m-hero-texte">
    <h1>${marque("m-marque-hero")}</h1>
    <p class="m-accroche">${t(d.accroche, lang)}</p>
    <div class="m-actions">
      <a class="m-btn m-btn-moutarde" href="#boutiques">${icones.lieu}${x.trouver}</a>
      <a class="m-btn m-btn-clair" href="#creations">${x.voirCreations}</a>
    </div>
  </div>
  ${img ? `<div class="m-hero-photo"><img src="${c.racine}${img.grand}" srcset="${c.racine}${img.petit} 900w, ${c.racine}${img.grand} 1800w" sizes="(min-width: 900px) 55vw, 100vw" alt="${echapper(nom)}" fetchpriority="high"></div>` : ""}
  <span class="m-poutre" aria-hidden="true"></span>
</section>

<section class="m-section m-maison" id="maison" aria-labelledby="titre-maison">
  <h2 id="titre-maison">${x.maison}</h2>
  <div class="m-maison-textes">${(d.maison?.[lang] || d.maison?.fr || []).map((p) => `<p>${echapper(p)}</p>`).join("")}</div>
</section>

<section class="m-section" id="creations" aria-labelledby="titre-creations">
  <h2 id="titre-creations">${x.creations}</h2>
  <div class="m-cartes">${vitrines(c, lang)}</div>
</section>

${(c.images.espaces || []).length ? `
<section class="m-enseignes" id="enseignes" aria-labelledby="titre-enseignes">
  <div class="m-section">
    <h2 id="titre-enseignes">${x.enseignes}</h2>
    <div class="m-enseignes-grille">${c.images.espaces.map((e) => `
      <article class="m-enseigne">
        <img src="${c.racine}${e.petit}" alt="${t(e.legende, lang)}" width="${e.l}" height="${e.h}" loading="lazy" decoding="async">
        <div><h3>${t(e.legende, lang)}</h3><p>${t(e.detail, lang)}</p>
        <p class="m-ou">${boutiques.filter((b) => b.espaces?.includes(e.cle)).map((b) => t(b.nom, lang)).join(" · ")}</p></div>
      </article>`).join("")}
    </div>
  </div>
</section>` : ""}

<section class="m-section" id="boutiques" aria-labelledby="titre-boutiques">
  <h2 id="titre-boutiques">${x.boutiques}</h2>
  <p class="m-intro">${x.boutiquesIntro(boutiques.length)}</p>
  <ul class="m-boutiques">${boutiques.map((b) => `
    <li class="m-boutique" data-horaires='${b.horaires ? JSON.stringify(b.horaires) : "null"}'>
      <div class="m-boutique-tete"><h3>${t(b.nom, lang)}</h3><span class="m-statut" aria-live="polite"></span></div>
      <p class="m-repere">${t(b.repere, lang)}</p>
      <p class="m-heures">${resumeHoraires(b.horaires, lang)}</p>
      <p class="m-tags">${(b.espaces || []).map((e) => `<span>${x.espaces[e] || e}</span>`).join("")}</p>
      <div class="m-actions">
        <a class="m-btn m-btn-plein m-btn-petit" href="${lienTel(b.telephone)}">${icones.telephone}<span dir="ltr">${echapper(b.telephone)}</span></a>
        <a class="m-btn m-btn-trait m-btn-petit" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.recherche)}" target="_blank" rel="noopener">${icones.itineraire}${x.itineraire}</a>
      </div>
    </li>`).join("")}
  </ul>
</section>

<section class="m-commandes" id="commandes">
  <div class="m-section">
    <h2>${x.commandes}</h2>
    <p>${x.commandesTexte}</p>
    <div class="m-actions">
      <a class="m-btn m-btn-moutarde" href="#boutiques">${icones.telephone}${x.trouver}</a>
      ${d.instagram ? `<a class="m-btn m-btn-clair" href="${lienInsta(d.instagram)}" target="_blank" rel="noopener">${icones.instagram}${x.instagram}</a>` : ""}
    </div>
  </div>
</section>

${galerie ? `
<section class="m-section" aria-labelledby="titre-galerie">
  <h2 id="titre-galerie">${x.galerie}</h2>
  <div class="m-galerie">${galerie}</div>
</section>
<dialog class="visionneuse" aria-label="${x.galerie}"><form method="dialog"><button aria-label="${u.fermer}">×</button></form><img alt=""><p></p></dialog>` : ""}
</main>
${pied(c, lang)}
${barre(c, lang, "#boutiques")}
${SCRIPT_STATUT(lang)}
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}

// Page « créations » (cible du QR code)
export function pageMenu(c, lang) {
  const x = TXT[lang], nom = tr(c.d.nom, lang);
  return `${tete(c, lang, { titre: `${x.creations} — ${nom}`, description: `${x.creations} · ${nom}`, chemin: (lang === "ar" ? "ar/" : "") + "menu/" })}
<body class="maison">
${bandeau(c, lang)}
${enTete(c, lang, "../", "menu/")}
<main><section class="m-section"><h1 class="m-titre-page">${x.creations}</h1><div class="m-cartes">${vitrines(c, lang)}</div>
<p><a class="m-lien" href="../">${x.voirSite}</a></p></section></main>
${pied(c, lang)}
${barre(c, lang, "../#boutiques")}
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}
