// Ambiance « Barbier » — salons de coiffure pour hommes.
// Idée directrice : le salon lui-même. Murs blancs à moulures (les photos sont encadrées comme ses panneaux),
// légendes en italique comme sous les gravures anciennes, et une bande « poteau de barbier » qui tourne doucement.
import {
  UI, t, tr, echapper, lienTel, lienInsta, requeteMaps, lienItineraire, autreLangue, tete, bandeau, telInternational
} from "../gabarits.mjs";
import { icones } from "../icones.mjs";

const TXT = {
  fr: {
    appeler: "Appeler",
    ecrire: "Écrire sur Instagram",
    ecrireCourt: "Instagram",
    rdv: "Prendre rendez-vous",
    rdvTexte: "Appelez le salon ou envoyez un message sur Instagram pour réserver votre passage.",
    salon: "Le salon",
    tarifs: "Tarifs",
    tarifsVides: "Vos prestations et vos tarifs s'afficheront ici : coupe, dégradé, barbe, soins…",
    horaires: "Horaires",
    horairesNote: "Horaires des autres jours à confirmer.",
    acces: "Nous trouver",
    itineraire: "Itinéraire",
    note: (n) => `${String(n).replace(".", ",")} / 5 sur Google`,
    voirSite: "← Retour au site"
  },
  ar: {
    appeler: "اتصل بنا",
    ecrire: "راسلنا على إنستغرام",
    ecrireCourt: "إنستغرام",
    rdv: "احجز موعدك",
    rdvTexte: "اتصلوا بالصالون أو راسلونا على إنستغرام لحجز موعدكم.",
    salon: "الصالون",
    tarifs: "الأسعار",
    tarifsVides: "ستظهر هنا خدماتكم وأسعاركم: قصّ، تدريج، لحية، عناية…",
    horaires: "أوقات العمل",
    horairesNote: "أوقات باقي الأيام قيد التأكيد.",
    acces: "زورونا",
    itineraire: "الاتجاهات",
    note: (n) => `${n} / 5 على غوغل`,
    voirSite: "→ العودة إلى الموقع"
  }
};

const lienDM = (compte) => `https://ig.me/m/${String(compte).replace(/^@/, "")}`;
const prix = (n, lang) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${UI[lang].devise}`;

const enTete = (c, lang, accueil) => `
<header class="b-entete">
  <a class="b-marque" href="${accueil}">${t(c.d.nom, lang)}</a>
  ${c.langues.length > 1 ? `<a class="b-langue" href="${autreLangue(c, lang, accueil === "#haut" ? "" : "menu/")}" lang="${lang === "fr" ? "ar" : "fr"}">${lang === "fr" ? "العربية" : "Français"}</a>` : ""}
</header>`;

// Boutons de contact : WhatsApp seulement si un numéro portable est fourni
function actions(c, lang, classe = "b-actions") {
  const d = c.d, x = TXT[lang];
  return `<div class="${classe}">
    <a class="b-btn b-btn-noir" href="${lienTel(d.telephone)}">${icones.telephone}${x.appeler}</a>
    ${d.whatsapp ? `<a class="b-btn b-btn-wa" href="https://wa.me/${telInternational(d.whatsapp)}" target="_blank" rel="noopener">${icones.whatsapp}WhatsApp</a>` : ""}
    ${d.instagram ? `<a class="b-btn b-btn-contour" href="${lienDM(d.instagram)}" target="_blank" rel="noopener">${icones.instagram}${classe === "b-barre" ? x.ecrireCourt : x.ecrire}</a>` : ""}
  </div>`;
}

function tarifs(c, lang) {
  const d = c.d, x = TXT[lang];
  const liste = d.prestations || [];
  if (!liste.length) {
    return d.statut !== "en-ligne" ? `<div class="b-panneau b-vide"><p>${x.tarifsVides}</p></div>` : "";
  }
  return `<div class="b-panneau"><ul class="b-tarifs">${liste.map((p) => `
    <li>
      <span class="nom">${t(p.nom, lang)}</span>
      ${tr(p.description, lang) ? `<span class="desc">${t(p.description, lang)}</span>` : ""}
      <span class="prix">${p.prix != null ? prix(p.prix, lang) : ""}</span>
    </li>`).join("")}
  </ul></div>`;
}

const pied = (c, lang) => {
  const d = c.d;
  const credit = c.credit && c.credit.nom
    ? `<p>${UI[lang].credit} ${c.credit.lien ? `<a href="${echapper(c.credit.lien)}" target="_blank" rel="noopener">${echapper(c.credit.nom)}</a>` : echapper(c.credit.nom)}</p>` : "";
  return `
<footer class="b-pied">
  <p class="b-marque">${t(d.nom, lang)}</p>
  <p>${t(d.adresse, lang)}</p>
  <p>© ${new Date().getFullYear()}</p>
  ${credit}
</footer>`;
};

export function pageAccueil(c, lang) {
  const d = c.d, x = TXT[lang], u = UI[lang];
  const nom = tr(d.nom, lang);
  const img = c.images.accueil;
  const chemin = lang === "ar" ? "ar/" : "";
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BarberShop", name: nom,
    telephone: `+${telInternational(d.telephone)}`,
    address: { "@type": "PostalAddress", streetAddress: tr(d.adresse, lang), addressLocality: "Alger", addressCountry: "DZ" },
    ...(d.url ? { url: d.url } : {}),
    ...(d.instagram ? { sameAs: [lienInsta(d.instagram)] } : {})
  };
  const galerie = (c.images.galerie || []).map((g) => `
    <figure class="b-cadre">
      <button type="button" data-grande="${c.racine}${g.grand}" data-legende="${t(g.legende, lang)}" aria-label="${t(g.legende, lang)}">
        <img src="${c.racine}${g.petit}" alt="${t(g.legende, lang)}" width="${g.l}" height="${g.h}" loading="lazy" decoding="async">
      </button>
      ${tr(g.legende, lang) ? `<figcaption>${t(g.legende, lang)}</figcaption>` : ""}
    </figure>`).join("");
  const horaires = d.horaires_connus || [];

  return `${tete(c, lang, { titre: `${nom} — ${tr(d.type_cuisine, lang)}, ${tr(d.quartier, lang)}`, description: tr(d.presentation, lang).slice(0, 155), chemin, prechargerAccueil: true })}
<body class="barbier">
${bandeau(c, lang)}
${enTete(c, lang, "#haut")}
<main id="haut">
<section class="b-hero">
  <div class="b-poteau" aria-hidden="true"></div>
  ${img ? `<figure class="b-cadre b-cadre-hero"><img src="${c.racine}${img.grand}" srcset="${c.racine}${img.petit} 900w, ${c.racine}${img.grand} 1800w" sizes="(min-width: 900px) 46vw, 92vw" alt="${echapper(tr(d.type_cuisine, lang))} — ${echapper(nom)}" fetchpriority="high"></figure>` : ""}
  <div class="b-intro">
    <h1>${echapper(nom)}</h1>
    <p class="b-sous-titre">${t(d.type_cuisine, lang)}, ${t(d.quartier, lang).replace(/, Alger$|، الجزائر العاصمة$/, "")}</p>
    ${d.note_google ? `<p class="b-note"><span aria-hidden="true">★</span> ${x.note(d.note_google)}</p>` : ""}
    ${tr(d.presentation, lang) ? `<p class="b-texte">${t(d.presentation, lang)}</p>` : ""}
    ${actions(c, lang)}
  </div>
</section>

${galerie ? `
<section class="b-section" aria-labelledby="titre-salon">
  <h2 id="titre-salon">${x.salon}</h2>
  <div class="b-galerie" data-n="${c.images.galerie.length}">${galerie}
  </div>
</section>
<dialog class="visionneuse" aria-label="${x.salon}"><form method="dialog"><button aria-label="${u.fermer}">×</button></form><img alt=""><p></p></dialog>` : ""}

${d.citation ? `
<section class="b-citation">
  <blockquote>
    <p class="ar" lang="ar" dir="rtl">${echapper(d.citation.ar)}</p>
    ${lang === "fr" && d.citation.fr ? `<p class="fr">${echapper(d.citation.fr)}</p>` : ""}
  </blockquote>
</section>` : ""}

<section class="b-section" id="tarifs" aria-labelledby="titre-tarifs">
  <h2 id="titre-tarifs">${x.tarifs}</h2>
  ${tarifs(c, lang)}
</section>

<section class="b-section b-infos" id="acces" aria-labelledby="titre-acces">
  <h2 id="titre-acces">${x.acces}</h2>
  <div class="b-infos-grille">
    <div class="b-panneau">
      <p class="b-adresse">${t(d.adresse, lang)}</p>
      ${horaires.length ? `<h3>${x.horaires}</h3>
      <dl class="b-horaires">${horaires.map((h) => `<div><dt>${t(h.jour, lang)}</dt><dd dir="ltr">${echapper(h.heures)}</dd></div>`).join("")}</dl>
      ${d.statut !== "en-ligne" ? `<p class="b-petit">${x.horairesNote}</p>` : ""}` : ""}
      <div class="b-actions">
        <a class="b-btn b-btn-noir" href="${lienItineraire(d)}" target="_blank" rel="noopener">${icones.itineraire}${x.itineraire}</a>
        <a class="b-btn b-btn-contour" href="${lienTel(d.telephone)}">${icones.telephone}<span dir="ltr">${echapper(d.telephone)}</span></a>
      </div>
    </div>
    <div class="b-cadre b-plan"><iframe src="https://maps.google.com/maps?q=${requeteMaps(d)}&hl=${lang}&z=16&output=embed" title="Google Maps — ${t(d.adresse, lang)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  </div>
</section>

<section class="b-section b-rdv">
  <h2>${x.rdv}</h2>
  <p class="b-texte">${x.rdvTexte}</p>
  ${actions(c, lang)}
</section>
</main>
${pied(c, lang)}
<nav class="b-barre-fixe" aria-label="${x.rdv}">${actions(c, lang, "b-barre")}</nav>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}

// Page « tarifs seuls » (cible du QR code affiché au salon)
export function pageMenu(c, lang) {
  const d = c.d, x = TXT[lang];
  const nom = tr(d.nom, lang);
  return `${tete(c, lang, { titre: `${x.tarifs} — ${nom}`, description: `${x.tarifs} · ${nom}`, chemin: (lang === "ar" ? "ar/" : "") + "menu/" })}
<body class="barbier">
${bandeau(c, lang)}
${enTete(c, lang, "../")}
<main>
<section class="b-section">
  <h1 class="b-titre-page">${x.tarifs}</h1>
  ${tarifs(c, lang)}
  <p><a class="b-lien" href="../">${x.voirSite}</a></p>
</section>
</main>
${pied(c, lang)}
<nav class="b-barre-fixe" aria-label="${x.rdv}">${actions(c, lang, "b-barre")}</nav>
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}
