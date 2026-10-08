// Ambiance « Capitonné » — salons de barbier haut de gamme, version sombre.
// Idée directrice : le fauteuil de barbier vu du dessus. Fond cuir bleu-noir capitonné (losanges et boutons),
// filets chromés comme le poteau, moulures blanches des murs pour encadrer la citation, parquet chêne en touche.
// Effet marquant (un seul) : la présentation sort du flou mot à mot au défilement,
// adapté de codrops/ScrollBlurTypography (MIT, © Codrops) — réécrit sans GSAP (voir script.js, « flou-mots »).
import {
  UI, t, tr, echapper, lienTel, lienInsta, requeteMaps, lienItineraire, autreLangue, tete, bandeau, telInternational
} from "../gabarits.mjs";
import { icones } from "../icones.mjs";

const TXT = {
  fr: {
    appeler: "Appeler",
    ecrire: "Écrire sur Instagram",
    ecrireCourt: "Instagram",
    rdv: "Réserver son passage",
    rdvTexte: "Un appel ou un message sur Instagram suffit pour réserver votre fauteuil.",
    salon: "Le salon",
    tarifs: "Tarifs",
    tarifsVides: "Vos prestations et vos tarifs s'afficheront ici : coupe, dégradé, barbe, soins…",
    horaires: "Horaires",
    horairesNote: "Horaires des autres jours à confirmer.",
    acces: "Nous trouver",
    itineraire: "Itinéraire",
    note: (n) => `${String(n).replace(".", ",")} / 5 sur Google`,
    voirSite: "← Retour au site",
    voirPhoto: (l) => `Agrandir la photo : ${l}`
  },
  ar: {
    appeler: "اتصل بنا",
    ecrire: "راسلنا على إنستغرام",
    ecrireCourt: "إنستغرام",
    rdv: "احجز كرسيّك",
    rdvTexte: "مكالمة أو رسالة على إنستغرام تكفي لحجز موعدكم.",
    salon: "الصالون",
    tarifs: "الأسعار",
    tarifsVides: "ستظهر هنا خدماتكم وأسعاركم: قصّ، تدريج، لحية، عناية…",
    horaires: "أوقات العمل",
    horairesNote: "أوقات باقي الأيام قيد التأكيد.",
    acces: "زورونا",
    itineraire: "الاتجاهات",
    note: (n) => `${n} / 5 على غوغل`,
    voirSite: "→ العودة إلى الموقع",
    voirPhoto: (l) => `تكبير الصورة: ${l}`
  }
};

const lienDM = (compte) => `https://ig.me/m/${String(compte).replace(/^@/, "")}`;
const prix = (n, lang) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${UI[lang].devise}`;
const classesCorps = (c) => `capitonne${c.d.variante ? " " + echapper(c.d.variante) : ""}`;

// Mots enveloppés un par un pour l'effet « sort du flou »
const motsFlous = (texte) => echapper(texte).split(/(\s+)/).map((m) => (/^\s+$/.test(m) || !m ? m : `<span class="mot">${m}</span>`)).join("");

// En-tête : enseigne au centre (comme une plaque), langue d'un côté, appel de l'autre
const enTete = (c, lang, accueil) => `
<header class="k-entete">
  ${c.langues.length > 1 ? `<a class="k-langue" href="${autreLangue(c, lang, accueil === "#haut" ? "" : "menu/")}" lang="${lang === "fr" ? "ar" : "fr"}">${lang === "fr" ? "العربية" : "Français"}</a>` : "<span></span>"}
  <a class="k-marque" href="${accueil}"><span class="k-h" aria-hidden="true">H</span><span>${t(c.d.nom, lang)}</span></a>
  <a class="k-appel" href="${lienTel(c.d.telephone)}" aria-label="${TXT[lang].appeler}">${icones.telephone}</a>
</header>`;

function actions(c, lang, classe = "k-actions") {
  const d = c.d, x = TXT[lang];
  return `<div class="${classe}">
    <a class="k-btn k-btn-chrome" href="${lienTel(d.telephone)}">${icones.telephone}${x.appeler}</a>
    ${d.whatsapp ? `<a class="k-btn k-btn-wa" href="https://wa.me/${telInternational(d.whatsapp)}" target="_blank" rel="noopener">${icones.whatsapp}WhatsApp</a>` : ""}
    ${d.instagram ? `<a class="k-btn k-btn-filet" href="${lienDM(d.instagram)}" target="_blank" rel="noopener">${icones.instagram}${classe === "k-barre" ? x.ecrireCourt : x.ecrire}</a>` : ""}
  </div>`;
}

function tarifs(c, lang) {
  const d = c.d, x = TXT[lang];
  const liste = d.prestations || [];
  if (!liste.length) return d.statut !== "en-ligne" ? `<p class="k-vide">${x.tarifsVides}</p>` : "";
  return `<ul class="k-tarifs">${liste.map((p) => `
    <li>
      <span class="nom">${t(p.nom, lang)}</span>
      <span class="pointilles" aria-hidden="true"></span>
      <span class="prix">${p.prix != null ? prix(p.prix, lang) : ""}</span>
      ${tr(p.description, lang) ? `<span class="desc">${t(p.description, lang)}</span>` : ""}
    </li>`).join("")}
  </ul>`;
}

const pied = (c, lang) => {
  const d = c.d;
  const credit = c.credit && c.credit.nom
    ? `<p>${UI[lang].credit} ${c.credit.lien ? `<a href="${echapper(c.credit.lien)}" target="_blank" rel="noopener">${echapper(c.credit.nom)}</a>` : echapper(c.credit.nom)}</p>` : "";
  return `
<footer class="k-pied">
  <p class="k-pied-h" aria-hidden="true">H</p>
  <p class="k-pied-nom">${t(d.nom, lang)}</p>
  <p>${t(d.adresse, lang)}</p>
  ${d.instagram ? `<p><a href="${lienInsta(d.instagram)}" target="_blank" rel="noopener" dir="ltr">@${echapper(String(d.instagram).replace(/^@/, ""))}</a></p>` : ""}
  <p>© ${new Date().getFullYear()}</p>
  ${credit}
</footer>`;
};

export function pageAccueil(c, lang) {
  const d = c.d, x = TXT[lang], u = UI[lang];
  const nom = tr(d.nom, lang);
  const img = c.images.accueil;
  const chemin = lang === "ar" ? "ar/" : "";
  const quartier = t(d.quartier, lang).replace(/, Alger$|، الجزائر العاصمة$/, "");
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BarberShop", name: nom,
    telephone: `+${telInternational(d.telephone)}`,
    address: { "@type": "PostalAddress", streetAddress: tr(d.adresse, lang), addressLocality: "Alger", addressCountry: "DZ" },
    ...(d.url ? { url: d.url } : {}),
    ...(d.instagram ? { sameAs: [lienInsta(d.instagram)] } : {})
  };
  const galerie = (c.images.galerie || []).map((g, i) => `
    <figure class="k-photo k-photo-${i + 1}">
      <button type="button" data-grande="${c.racine}${g.grand}" data-legende="${t(g.legende, lang)}" aria-label="${x.voirPhoto(t(g.legende, lang))}">
        <img src="${c.racine}${g.petit}" alt="${t(g.legende, lang)}" width="${g.l}" height="${g.h}" loading="lazy" decoding="async">
      </button>
      ${tr(g.legende, lang) ? `<figcaption>${t(g.legende, lang)}</figcaption>` : ""}
    </figure>`).join("");
  const horaires = d.horaires_connus || [];

  return `${tete(c, lang, { titre: `${nom} — ${tr(d.type_cuisine, lang)}, ${tr(d.quartier, lang)}`, description: tr(d.presentation, lang).slice(0, 155), chemin, prechargerAccueil: true })}
<body class="${classesCorps(c)}">
${bandeau(c, lang)}
${enTete(c, lang, "#haut")}
<main id="haut">
<section class="k-hero">
  <div class="k-hero-texte">
    <h1>${echapper(nom)}</h1>
    <p class="k-sous-titre">${t(d.type_cuisine, lang)}${lang === "ar" ? "،" : ","} ${quartier}</p>
    ${d.note_google ? `<p class="k-note"><span aria-hidden="true">★</span> ${x.note(d.note_google)}</p>` : ""}
    ${actions(c, lang)}
  </div>
  ${img ? `<figure class="k-hero-photo"><img src="${c.racine}${img.grand}" srcset="${c.racine}${img.petit} 900w, ${c.racine}${img.grand} 1800w" sizes="(min-width: 900px) 40vw, 86vw" alt="${echapper(tr(d.type_cuisine, lang))} — ${echapper(nom)}" fetchpriority="high"></figure>` : ""}
</section>

${tr(d.presentation, lang) ? `
<section class="k-presentation" aria-label="${x.salon}">
  <p class="flou-mots">${motsFlous(tr(d.presentation, lang))}</p>
</section>` : ""}

${galerie ? `
<section class="k-section" aria-labelledby="titre-salon">
  <h2 id="titre-salon">${x.salon}</h2>
  <div class="k-galerie galerie" data-n="${c.images.galerie.length}">${galerie}
  </div>
</section>
<dialog class="visionneuse" aria-label="${x.salon}"><form method="dialog"><button aria-label="${u.fermer}">×</button></form><img alt=""><p></p></dialog>` : ""}

${d.citation ? `
<section class="k-citation">
  <blockquote>
    <p class="ar" lang="ar" dir="rtl">${echapper(d.citation.ar)}</p>
    ${lang === "fr" && d.citation.fr ? `<p class="fr">${echapper(d.citation.fr)}</p>` : ""}
  </blockquote>
</section>` : ""}

<section class="k-section" id="tarifs" aria-labelledby="titre-tarifs">
  <h2 id="titre-tarifs">${x.tarifs}</h2>
  ${tarifs(c, lang)}
</section>

<section class="k-section k-infos" id="acces" aria-labelledby="titre-acces">
  <h2 id="titre-acces">${x.acces}</h2>
  <div class="k-infos-grille">
    <div>
      <p class="k-adresse">${t(d.adresse, lang)}</p>
      ${horaires.length ? `<h3>${x.horaires}</h3>
      <dl class="k-horaires">${horaires.map((h) => `<div><dt>${t(h.jour, lang)}</dt><dd dir="ltr">${echapper(h.heures)}</dd></div>`).join("")}</dl>
      ${d.statut !== "en-ligne" ? `<p class="k-petit">${x.horairesNote}</p>` : ""}` : ""}
      <div class="k-actions">
        <a class="k-btn k-btn-chrome" href="${lienItineraire(d)}" target="_blank" rel="noopener">${icones.itineraire}${x.itineraire}</a>
        <a class="k-btn k-btn-filet" href="${lienTel(d.telephone)}">${icones.telephone}<span dir="ltr">${echapper(d.telephone)}</span></a>
      </div>
    </div>
    <div class="k-plan"><iframe src="https://maps.google.com/maps?q=${requeteMaps(d)}&hl=${lang}&z=16&output=embed" title="Google Maps — ${t(d.adresse, lang)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
  </div>
</section>

<section class="k-rdv">
  <h2>${x.rdv}</h2>
  <p>${x.rdvTexte}</p>
  ${actions(c, lang)}
</section>
</main>
${pied(c, lang)}
<nav class="k-barre-fixe" aria-label="${x.rdv}">${actions(c, lang, "k-barre")}</nav>
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
<body class="${classesCorps(c)}">
${bandeau(c, lang)}
${enTete(c, lang, "../")}
<main>
<section class="k-section">
  <h1 class="k-titre-page">${x.tarifs}</h1>
  ${tarifs(c, lang)}
  <p><a class="k-lien" href="../">${x.voirSite}</a></p>
</section>
</main>
${pied(c, lang)}
<nav class="k-barre-fixe" aria-label="${x.rdv}">${actions(c, lang, "k-barre")}</nav>
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}
