// Ambiance « Pâtisserie » — tirée de Signature Pâtisserie : murs blancs à moulures baroques,
// panneau rétro-éclairé doré, logo en écriture manuscrite, osier et chêne.
// Élément fort : un trait de signature doré qui se dessine sous le nom au chargement.
import {
  UI, t, tr, echapper, lienTel, lienInsta, requeteMaps, lienItineraire, autreLangue, tete, bandeau, telInternational
} from "../gabarits.mjs";
import { icones } from "../icones.mjs";

const TXT = {
  fr: {
    appeler: "Appeler",
    commanderTel: "Commander par téléphone",
    instagram: "Instagram",
    voirInsta: "Voir nos créations",
    vitrines: "Nos vitrines",
    boutique: "La boutique",
    horaires: "Horaires",
    horairesNote: "Horaires des autres jours à confirmer.",
    acces: "Nous trouver",
    itineraire: "Itinéraire",
    commande: "Une commande, une fête ?",
    commandeTexte: "Appelez-nous pour réserver vos viennoiseries, gâteaux et plateaux, ou pour une commande spéciale.",
    voirSite: "← Retour au site",
    vitrinesPage: "Nos vitrines"
  },
  ar: {
    appeler: "اتصل بنا",
    commanderTel: "اطلب عبر الهاتف",
    instagram: "إنستغرام",
    voirInsta: "شاهد إبداعاتنا",
    vitrines: "واجهاتنا",
    boutique: "المحل",
    horaires: "أوقات العمل",
    horairesNote: "أوقات باقي الأيام قيد التأكيد.",
    acces: "زورونا",
    itineraire: "الاتجاهات",
    commande: "طلبية أو مناسبة؟",
    commandeTexte: "اتصلوا بنا لحجز المخبوزات والحلويات والصواني، أو لطلبية خاصة.",
    voirSite: "→ العودة إلى الموقع",
    vitrinesPage: "واجهاتنا"
  }
};

// Trait de signature (dessiné au chargement, voir patisserie.css)
const SIGNATURE = `<svg class="p-trait" viewBox="0 0 420 60" aria-hidden="true"><path d="M4 42c38-6 70-30 92-31 14 0-6 30 6 31 16 1 30-28 44-27 10 1-4 24 8 24 20 0 44-22 66-24 26-2 18 20 40 19 30-1 70-14 156-22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// En-tête : logo au centre, langue à gauche, « Commander » à droite, menu en dessous (ordinateur)
const NAV = {
  fr: [["vitrines", "Nos vitrines"], ["boutique", "La boutique"], ["acces", "Nous trouver"], ["commander", "Commander"]],
  ar: [["vitrines", "واجهاتنا"], ["boutique", "المحل"], ["acces", "زورونا"], ["commander", "اطلب"]]
};
const enTete = (c, lang, accueil, sousChemin) => {
  const d = c.d, logo = c.images.logoEntete, nom = t(d.nom_complet || d.nom, lang);
  const base = accueil === "#haut" ? "" : accueil;
  return `
<header class="p-entete">
  <div class="p-entete-haut">
    ${c.langues.length > 1 ? `<a class="p-langue" href="${autreLangue(c, lang, sousChemin)}" lang="${lang === "fr" ? "ar" : "fr"}">${lang === "fr" ? "العربية" : "FR"}</a>` : "<span></span>"}
    <a class="p-logo" href="${accueil}" aria-label="${nom}">${logo ? `<img src="${c.racine}${logo.src}" alt="${nom}" width="${logo.l}" height="${logo.h}">` : `<span class="p-marque">${nom}</span>`}</a>
    <a class="p-commander" href="${lienTel(d.telephone)}">${icones.telephone}<span>${lang === "fr" ? "Commander" : "اطلب"}</span></a>
  </div>
  <nav class="p-nav" aria-label="Navigation">${NAV[lang].map(([id, txt]) => `<a href="${base}#${id}">${txt}</a>`).join("")}</nav>
</header>`;
};

function actions(c, lang, classe = "p-actions") {
  const d = c.d, x = TXT[lang];
  const barre = classe === "p-barre";
  return `<div class="${classe}">
    <a class="p-btn p-btn-or" href="${lienTel(d.telephone)}">${icones.telephone}${barre ? x.appeler : x.commanderTel}</a>
    ${d.whatsapp ? `<a class="p-btn p-btn-wa" href="https://wa.me/${telInternational(d.whatsapp)}" target="_blank" rel="noopener">${icones.whatsapp}WhatsApp</a>` : ""}
    ${d.instagram ? `<a class="p-btn p-btn-contour" href="${lienInsta(d.instagram)}" target="_blank" rel="noopener">${icones.instagram}${barre ? x.instagram : x.voirInsta}</a>` : ""}
  </div>`;
}

const pied = (c, lang) => {
  const d = c.d;
  const credit = c.credit && c.credit.nom
    ? `<p>${UI[lang].credit} ${c.credit.lien ? `<a href="${echapper(c.credit.lien)}" target="_blank" rel="noopener">${echapper(c.credit.nom)}</a>` : echapper(c.credit.nom)}</p>` : "";
  return `
<footer class="p-pied">
  <p class="p-pied-nom">${t(d.nom_complet || d.nom, lang)}</p>
  <p>${t(d.adresse, lang)}</p>
  <p>© ${new Date().getFullYear()}</p>
  ${credit}
</footer>`;
};

const vitrines = (c, lang) => (c.images.vitrines || []).map((v) => `
    <article class="p-vitrine">
      <img src="${c.racine}${v.petit}" alt="${t(v.legende, lang)}" width="${v.l}" height="${v.h}" loading="lazy" decoding="async">
      <div class="p-vitrine-texte">
        <h3>${t(v.legende, lang)}</h3>
        ${tr(v.detail, lang) ? `<p>${t(v.detail, lang)}</p>` : ""}
      </div>
    </article>`).join("");

export function pageAccueil(c, lang) {
  const d = c.d, x = TXT[lang], u = UI[lang];
  const nom = tr(d.nom_complet || d.nom, lang);
  const img = c.images.accueil;
  const chemin = lang === "ar" ? "ar/" : "";
  const horaires = d.horaires_connus || [];
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Bakery", name: nom,
    telephone: `+${telInternational(d.telephone)}`,
    address: { "@type": "PostalAddress", streetAddress: tr(d.adresse, lang), addressLocality: "Alger", addressCountry: "DZ" },
    ...(d.url ? { url: d.url } : {}),
    ...(d.instagram ? { sameAs: [lienInsta(d.instagram)] } : {})
  };
  const galerie = (c.images.galerie || []).map((g) => `
    <figure>
      <button type="button" data-grande="${c.racine}${g.grand}" data-legende="${t(g.legende, lang)}" aria-label="${t(g.legende, lang)}">
        <img src="${c.racine}${g.petit}" alt="${t(g.legende, lang)}" width="${g.l}" height="${g.h}" loading="lazy" decoding="async">
      </button>
      ${tr(g.legende, lang) ? `<figcaption>${t(g.legende, lang)}</figcaption>` : ""}
    </figure>`).join("");

  return `${tete(c, lang, { titre: `${nom} — ${tr(d.type_cuisine, lang)}, ${tr(d.quartier, lang)}`, description: tr(d.presentation, lang).slice(0, 155), chemin, prechargerAccueil: true })}
<body class="patisserie">
${bandeau(c, lang)}
${enTete(c, lang, "#haut", "")}
<main id="haut">
<section class="p-hero">
  ${img ? `<div class="p-panneau-lumiere p-hero-photo"><img src="${c.racine}${img.grand}" srcset="${c.racine}${img.petit} 900w, ${c.racine}${img.grand} 1800w" sizes="(min-width: 900px) 50vw, 100vw" alt="${echapper(nom)}" fetchpriority="high"></div>` : ""}
  <div class="p-intro">
    <p class="p-genre">${t(d.type_cuisine, lang)}</p>
    <h1><span>${t(d.nom, lang)}</span></h1>
    ${SIGNATURE}
    <p class="p-lieu">${t(d.quartier, lang)}</p>
    ${tr(d.presentation, lang) ? `<p class="p-texte">${t(d.presentation, lang)}</p>` : ""}
    ${actions(c, lang)}
  </div>
</section>

${(c.images.vitrines || []).length ? `
<section class="p-section" id="vitrines" aria-labelledby="titre-vitrines">
  <h2 id="titre-vitrines">${x.vitrines}</h2>
  <div class="p-vitrines">${vitrines(c, lang)}
  </div>
</section>` : ""}

${d.citation ? `
<section class="p-citation">
  <div class="p-panneau-lumiere p-citation-panneau">
    <p class="ar" lang="ar" dir="rtl">${echapper(d.citation.ar)}</p>
    ${lang === "fr" && d.citation.fr ? `<p class="fr">${echapper(d.citation.fr)}</p>` : ""}
  </div>
</section>` : ""}

${galerie ? `
<section class="p-section" id="boutique" aria-labelledby="titre-boutique">
  <h2 id="titre-boutique">${x.boutique}</h2>
  <div class="p-galerie" data-n="${c.images.galerie.length}">${galerie}
  </div>
</section>
<dialog class="visionneuse" aria-label="${x.boutique}"><form method="dialog"><button aria-label="${u.fermer}">×</button></form><img alt=""><p></p></dialog>` : ""}

<section class="p-section" id="acces" aria-labelledby="titre-acces">
  <h2 id="titre-acces">${x.acces}</h2>
  <div class="p-infos">
    <div class="p-carte">
      <p class="p-adresse">${t(d.adresse, lang)}</p>
      ${horaires.length ? `<h3>${x.horaires}</h3>
      <dl class="p-horaires">${horaires.map((h) => `<div><dt>${t(h.jour, lang)}</dt><dd dir="ltr">${echapper(h.heures)}</dd></div>`).join("")}</dl>
      ${d.statut !== "en-ligne" ? `<p class="p-petit">${x.horairesNote}</p>` : ""}` : ""}
      <div class="p-actions">
        <a class="p-btn p-btn-or" href="${lienItineraire(d)}" target="_blank" rel="noopener">${icones.itineraire}${x.itineraire}</a>
        <a class="p-btn p-btn-contour" href="${lienTel(d.telephone)}">${icones.telephone}<span dir="ltr">${echapper(d.telephone)}</span></a>
      </div>
    </div>
    <div class="p-plan"><iframe src="https://maps.google.com/maps?q=${requeteMaps(d)}&hl=${lang}&z=16&output=embed" title="Google Maps — ${t(d.adresse, lang)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  </div>
</section>

<section class="p-section p-commande" id="commander">
  <h2>${x.commande}</h2>
  <p class="p-texte">${x.commandeTexte}</p>
  ${actions(c, lang)}
</section>
</main>
${pied(c, lang)}
<nav class="p-barre-fixe" aria-label="${x.appeler}">${actions(c, lang, "p-barre")}</nav>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}

// Page « vitrines » (cible du QR code)
export function pageMenu(c, lang) {
  const d = c.d, x = TXT[lang];
  const nom = tr(d.nom_complet || d.nom, lang);
  return `${tete(c, lang, { titre: `${x.vitrinesPage} — ${nom}`, description: `${x.vitrinesPage} · ${nom}`, chemin: (lang === "ar" ? "ar/" : "") + "menu/" })}
<body class="patisserie">
${bandeau(c, lang)}
${enTete(c, lang, "../", "menu/")}
<main>
<section class="p-section">
  <h1 class="p-titre-page">${x.vitrinesPage}</h1>
  <div class="p-vitrines">${vitrines(c, lang)}
  </div>
  <p><a class="p-lien" href="../">${x.voirSite}</a></p>
</section>
</main>
${pied(c, lang)}
<nav class="p-barre-fixe" aria-label="${x.appeler}">${actions(c, lang, "p-barre")}</nav>
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}
