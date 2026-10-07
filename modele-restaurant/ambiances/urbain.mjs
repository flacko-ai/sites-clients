// Ambiance « Urbain » — street food, burgers, snacks.
// Idée directrice : la carte est un ticket de caisse (papier, police à chasse fixe, bord dentelé),
// le reste de la page reste sobre (noir, béton clair, une touche d'ambre « enseigne lumineuse »).
import {
  UI, textes, t, tr, echapper, prix, lienTel, lienWa, lienInsta, requeteMaps, lienItineraire,
  autreLangue, tete, bandeau, barreActions, tableauHoraires, ORDRE_JOURS, telInternational
} from "../gabarits.mjs";
import { icones } from "../icones.mjs";

const TXT = {
  fr: {
    intro: (d) => `${tr(d.type_cuisine, "fr")} à ${tr(d.quartier, "fr").replace(/, Alger$/, "")}.`,
    carte: "La carte",
    ticketPied: "Prix en dinars algériens.",
    photos: "En photos",
    livraison: "Livraison",
    livraisonIntro: "Le prix dépend de votre quartier.",
    trouver: "Nous trouver",
    horaires: "Horaires",
    itineraire: "Itinéraire",
    instagram: "Instagram"
  },
  ar: {
    intro: (d) => `${tr(d.type_cuisine, "ar")} في ${tr(d.quartier, "ar").replace(/، الجزائر العاصمة$/, "")}.`,
    carte: "القائمة",
    ticketPied: "الأسعار بالدينار الجزائري.",
    photos: "بالصور",
    livraison: "التوصيل",
    livraisonIntro: "يختلف السعر حسب الحي.",
    trouver: "زورونا",
    horaires: "أوقات العمل",
    itineraire: "الاتجاهات",
    instagram: "إنستغرام"
  }
};

function ticket(c, lang) {
  const d = c.d, u = UI[lang], x = TXT[lang];
  const categories = d.menu || [];
  return `
<div class="ticket" role="group" aria-label="${x.carte}">
  <div class="ticket-tete">
    <p class="ticket-nom"><bdi>${t(d.nom, lang)}.</bdi></p>
    <p dir="ltr">+${telInternational(d.telephone).replace(/^213/, "213 ")}</p>
    <p>${t(d.adresse, lang)}</p>
  </div>
  ${categories.map((cat) => `
  <div class="ticket-cat" id="cat-${echapper(tr(cat.categorie, "fr")).toLowerCase().replace(/[^a-z0-9]+/g, "-")}">
    <h3>${t(cat.categorie, lang)}</h3>
    <ul>${(cat.plats || []).map((p) => `
      <li>
        <div class="ligne"><span class="nom">${t(p.nom, lang)}</span><span class="points" aria-hidden="true"></span><span class="prix">${p.prix != null ? prix(p.prix, lang) : ""}</span></div>
        ${tr(p.description, lang) ? `<p class="desc">${t(p.description, lang)}</p>` : ""}
        ${(p.badges || []).length ? `<p class="marques">${p.badges.map((b) => `<span>${echapper(u.badges[b] || b)}</span>`).join("")}</p>` : ""}
      </li>`).join("")}
    </ul>
  </div>`).join("")}
  <div class="ticket-pied">
    <p>${tr(d.note_menu, lang) ? t(d.note_menu, lang) : x.ticketPied}</p>
    ${tr(d.slogan, lang) ? `<p class="merci">${t(d.slogan, lang)}</p>` : ""}
  </div>
</div>`;
}

const enTete = (c, lang, ancre) => `
<header class="u-entete">
  <a class="u-marque" href="${ancre}">${t(c.d.nom, lang)}</a>
  ${c.langues.length > 1 ? `<a class="u-langue" href="${autreLangue(c, lang, "")}" lang="${lang === "fr" ? "ar" : "fr"}">${lang === "fr" ? "العربية" : "Français"}</a>` : ""}
</header>`;

const pied = (c, lang) => {
  const d = c.d;
  const credit = c.credit && c.credit.nom
    ? `<p>${UI[lang].credit} ${c.credit.lien ? `<a href="${echapper(c.credit.lien)}" target="_blank" rel="noopener">${echapper(c.credit.nom)}</a>` : echapper(c.credit.nom)}</p>` : "";
  return `
<footer class="u-pied">
  <p>${t(d.adresse, lang)}</p>
  <p>© ${new Date().getFullYear()} ${t(d.nom, lang)}</p>
  ${credit}
</footer>`;
};

export function pageAccueil(c, lang) {
  const d = c.d, u = UI[lang], ut = textes(c, lang), x = TXT[lang];
  const nom = tr(d.nom, lang);
  const img = c.images.accueil;
  const aHoraires = Object.values(d.horaires || {}).some((h) => h.length);
  const chemin = lang === "ar" ? "ar/" : "";
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Restaurant", name: nom,
    servesCuisine: tr(d.type_cuisine, lang), telephone: `+${telInternational(d.telephone)}`,
    address: { "@type": "PostalAddress", streetAddress: tr(d.adresse, lang), addressLocality: "Alger", addressCountry: "DZ" },
    ...(d.url ? { url: d.url, hasMenu: `${d.url.replace(/\/$/, "")}/${chemin}menu/` } : {}),
    ...(d.instagram ? { sameAs: [lienInsta(d.instagram)] } : {}),
    openingHoursSpecification: ORDRE_JOURS.flatMap((j, i) => (d.horaires?.[j] || []).map((cr) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i],
      opens: cr.split("-")[0], closes: cr.split("-")[1]
    })))
  };
  const galerie = (c.images.galerie || []).map((g) => `
    <figure>
      <button type="button" data-grande="${c.racine}${g.grand}" data-legende="${t(g.legende, lang)}" aria-label="${t(g.legende, lang)}">
        <img src="${c.racine}${g.petit}" alt="${t(g.legende, lang)}" width="${g.l}" height="${g.h}" loading="lazy" decoding="async">
      </button>
      ${tr(g.legende, lang) ? `<figcaption>${t(g.legende, lang)}</figcaption>` : ""}
    </figure>`).join("");

  return `${tete(c, lang, { titre: `${nom} — ${tr(d.type_cuisine, lang)}, ${tr(d.quartier, lang)}`, description: tr(d.presentation, lang).slice(0, 155), chemin, prechargerAccueil: true })}
<body class="urbain">
${bandeau(c, lang)}
${enTete(c, lang, "#haut")}
<main id="haut">
<section class="u-hero">
  ${img ? `<div class="u-photo"><img src="${c.racine}${img.grand}" srcset="${c.racine}${img.petit} 900w, ${c.racine}${img.grand} 1800w" sizes="(min-width: 900px) 58vw, 100vw" alt="${t(d.photos?.accueil_legende || d.nom, lang)}" fetchpriority="high"></div>` : ""}
  <div class="u-intro">
    ${c.images.logoNoir ? `<h1><img src="${c.racine}${c.images.logoNoir.src}" alt="${echapper(nom)}" width="${c.images.logoNoir.l}" height="${c.images.logoNoir.h}"></h1>` : `<h1 class="u-h1-texte">${echapper(nom)}</h1>`}
    <p class="u-accroche">${echapper(x.intro(d))}</p>
    ${tr(d.presentation, lang) ? `<p class="u-texte">${t(d.presentation, lang)}</p>` : ""}
    ${aHoraires ? '<p class="statut" aria-live="polite"></p>' : ""}
    <div class="u-actions">
      <a class="u-btn u-btn-wa" href="${lienWa(c, lang)}" target="_blank" rel="noopener">${icones.whatsapp}${ut.reserverWa}</a>
      <a class="u-btn u-btn-contour" href="#carte">${x.carte}</a>
    </div>
  </div>
</section>

<section class="u-carte" id="carte" aria-labelledby="titre-carte">
  <h2 id="titre-carte">${x.carte}</h2>
  ${ticket(c, lang)}
</section>

${galerie ? `
<section class="u-photos" aria-labelledby="titre-photos">
  <h2 id="titre-photos">${x.photos}</h2>
  <div class="u-bande" data-n="${c.images.galerie.length}">${galerie}
  </div>
</section>
<dialog class="visionneuse" aria-label="${x.photos}"><form method="dialog"><button aria-label="${u.fermer}">×</button></form><img alt=""><p></p></dialog>` : ""}

${d.livraison ? `
<section class="u-livraison" id="livraison" aria-labelledby="titre-livraison">
  <div class="u-col">
    <h2 id="titre-livraison">${x.livraison}</h2>
    <p class="u-texte">${x.livraisonIntro}</p>
    <ul>${(d.livraison.zones || []).map((z) => `
      <li><span>${t(z.quartiers, lang).replace(/ · /g, lang === "ar" ? "، " : ", ")}</span><span class="prix">${prix(z.prix, lang)}</span></li>`).join("")}
    </ul>
    ${tr(d.livraison.note, lang) ? `<p class="u-note">${t(d.livraison.note, lang)}</p>` : ""}
  </div>
</section>` : ""}

<section class="u-acces" id="acces" aria-labelledby="titre-acces">
  <div class="u-col">
    <h2 id="titre-acces">${x.trouver}</h2>
    <p class="u-adresse">${t(d.adresse, lang)}</p>
    <div class="u-plan"><iframe src="https://maps.google.com/maps?q=${requeteMaps(d)}&hl=${lang}&z=16&output=embed" title="Google Maps — ${t(d.adresse, lang)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    <div class="u-actions">
      <a class="u-btn u-btn-noir" href="${lienItineraire(d)}" target="_blank" rel="noopener">${icones.itineraire}${x.itineraire}</a>
      <a class="u-btn u-btn-contour" href="${lienTel(d.telephone)}">${icones.telephone}<span dir="ltr">${echapper(d.telephone)}</span></a>
      ${d.instagram ? `<a class="u-btn u-btn-contour" href="${lienInsta(d.instagram)}" target="_blank" rel="noopener">${icones.instagram}@${echapper(String(d.instagram).replace(/^@/, ""))}</a>` : ""}
    </div>
    ${aHoraires ? `<h3>${x.horaires}</h3><p class="statut" aria-live="polite"></p>${tableauHoraires(c, lang)}` : ""}
  </div>
</section>
</main>
${pied(c, lang)}
${barreActions(c, lang)}
${aHoraires ? `<script type="application/json" id="donnees-horaires">${JSON.stringify(d.horaires)}</script>` : ""}
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}

export function pageMenu(c, lang) {
  const d = c.d, x = TXT[lang];
  const nom = tr(d.nom, lang);
  return `${tete(c, lang, { titre: `${x.carte} — ${nom}`, description: `${x.carte} · ${nom}`, chemin: (lang === "ar" ? "ar/" : "") + "menu/" })}
<body class="urbain page-menu-u">
${bandeau(c, lang)}
<header class="u-entete">
  <a class="u-marque" href="../">${t(d.nom, lang)}</a>
  ${c.langues.length > 1 ? `<a class="u-langue" href="${autreLangue(c, lang, "menu/")}" lang="${lang === "fr" ? "ar" : "fr"}">${lang === "fr" ? "العربية" : "Français"}</a>` : ""}
</header>
<main>
<section class="u-carte" aria-labelledby="titre-carte">
  <h1 id="titre-carte">${x.carte}</h1>
  ${ticket(c, lang)}
</section>
</main>
${pied(c, lang)}
${barreActions(c, lang)}
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}
