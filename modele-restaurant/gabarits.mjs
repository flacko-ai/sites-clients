// Modèle « Restaurant » — gabarits HTML.
// Chaque fonction reçoit le contexte préparé par outils/generer.mjs et renvoie une page HTML complète.
import { icones } from "./icones.mjs";

// ---------- Textes fixes de l'interface ----------
const UI = {
  fr: {
    nav: { menu: "Menu", galerie: "Galerie", horaires: "Horaires", acces: "Accès" },
    appeler: "Appeler",
    reserverWa: "Réserver sur WhatsApp",
    reserverCourt: "Réserver",
    voirMenu: "Voir le menu",
    bienvenue: "Bienvenue",
    notreCarte: "Notre carte",
    menu: "Le menu",
    prixNote: "Prix en dinars algériens (DA), service compris.",
    galerie: "Galerie",
    enImages: "En images",
    infos: "Nous trouver",
    infosPratiques: "Infos pratiques",
    horaires: "Horaires",
    acces: "Adresse & accès",
    itineraire: "Itinéraire",
    ferme: "Fermé",
    reservation: "Réservation",
    reserverTitre: "Réservez votre table",
    reserverTexte: "Un message WhatsApp suffit : indiquez le jour, l'heure et le nombre de personnes, nous vous confirmons rapidement.",
    suivre: "Suivez-nous",
    retourSite: "← Voir tout le site",
    carteMenu: "Notre menu",
    scanner: "Scannez avec l'appareil photo de votre téléphone",
    imprimer: "Imprimer",
    conseilImpression: "Conseil : imprimez sur papier épais (250 g), puis découpez les 4 cartes.",
    fermer: "Fermer",
    jours: { dimanche: "Dimanche", lundi: "Lundi", mardi: "Mardi", mercredi: "Mercredi", jeudi: "Jeudi", vendredi: "Vendredi", samedi: "Samedi" },
    badges: { maison: "Fait maison", signature: "Spécialité", vegetarien: "Végétarien", nouveau: "Nouveau", epice: "Épicé" },
    devise: "DA",
    bandeau: (d) => d.exemple_fictif
      ? "<strong>Proposition</strong> · Site de démonstration — restaurant fictif"
      : `<strong>Proposition</strong> · Maquette préparée pour ${d.nomTexte} — non publiée`,
    messageWa: (nom) => `Bonjour ${nom}, je souhaite réserver une table pour ___ personnes, le ___ à ___. Merci !`,
    credit: "Site réalisé par",
    commande: {
      reserverWa: "Commander sur WhatsApp",
      reserverCourt: "Commander",
      reservation: "Commande",
      reserverTitre: "Commandez en un message",
      reserverTexte: "Envoyez-nous votre commande sur WhatsApp ou appelez-nous : sur place, à emporter ou en livraison.",
      messageWa: (nom) => `Bonjour ${nom}, je voudrais commander : ___. Sur place / à emporter / livraison à : ___. Merci !`
    },
    livraison: "Livraison",
    livraisonTitre: "Tarifs de livraison",
    livraisonNote: "Les frais de livraison varient selon votre quartier.",
    zone: "Quartiers"
  },
  ar: {
    nav: { menu: "القائمة", galerie: "الصور", horaires: "أوقات العمل", acces: "العنوان" },
    appeler: "اتصل بنا",
    reserverWa: "احجز عبر واتساب",
    reserverCourt: "احجز",
    voirMenu: "اطّلع على القائمة",
    bienvenue: "مرحباً بكم",
    notreCarte: "قائمتنا",
    menu: "قائمة الطعام",
    prixNote: "الأسعار بالدينار الجزائري (دج)، الخدمة مشمولة.",
    galerie: "معرض الصور",
    enImages: "بالصور",
    infos: "زورونا",
    infosPratiques: "معلومات عملية",
    horaires: "أوقات العمل",
    acces: "العنوان والوصول",
    itineraire: "الاتجاهات",
    ferme: "مغلق",
    reservation: "الحجز",
    reserverTitre: "احجزوا طاولتكم",
    reserverTexte: "تكفي رسالة واتساب: حدّدوا اليوم والساعة وعدد الأشخاص، وسنؤكّد لكم بسرعة.",
    suivre: "تابعونا",
    retourSite: "→ تصفّح الموقع كاملاً",
    carteMenu: "قائمة الطعام",
    scanner: "امسح الرمز بكاميرا هاتفك",
    imprimer: "طباعة",
    conseilImpression: "",
    fermer: "إغلاق",
    jours: { dimanche: "الأحد", lundi: "الاثنين", mardi: "الثلاثاء", mercredi: "الأربعاء", jeudi: "الخميس", vendredi: "الجمعة", samedi: "السبت" },
    badges: { maison: "صنع منزلي", signature: "تخصّص البيت", vegetarien: "نباتي", nouveau: "جديد", epice: "حار" },
    devise: "دج",
    bandeau: (d) => d.exemple_fictif
      ? "<strong>اقتراح</strong> · موقع تجريبي — مطعم وهمي"
      : `<strong>اقتراح</strong> · نموذج موقع مُعدّ لـ ${d.nomTexte} — غير منشور`,
    messageWa: (nom) => `السلام عليكم ${nom}، أرغب في حجز طاولة لـ ___ أشخاص، يوم ___ على الساعة ___. شكراً!`,
    credit: "تصميم الموقع:",
    commande: {
      reserverWa: "اطلب عبر واتساب",
      reserverCourt: "اطلب",
      reservation: "الطلبات",
      reserverTitre: "اطلبوا برسالة واحدة",
      reserverTexte: "أرسلوا طلبكم عبر واتساب أو اتصلوا بنا: في المحل، للأخذ أو بالتوصيل.",
      messageWa: (nom) => `السلام عليكم ${nom}، أريد أن أطلب: ___. في المحل / للأخذ / توصيل إلى: ___. شكراً!`
    },
    livraison: "التوصيل",
    livraisonTitre: "أسعار التوصيل",
    livraisonNote: "تختلف أسعار التوصيل حسب الحي.",
    zone: "الأحياء"
  }
};
// Textes de l'interface, adaptés au mode du restaurant ("reservation" par défaut, ou "commande" pour la restauration rapide)
const textes = (c, lang) => (c.d.mode === "commande" ? { ...UI[lang], ...UI[lang].commande } : UI[lang]);
const ORDRE_JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

// ---------- Petits utilitaires ----------
export const echapper = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Texte bilingue : { fr, ar } ou simple chaîne. Repli sur le français si l'arabe manque.
export const tr = (v, lang) => (v == null ? "" : typeof v === "string" ? v : v[lang] ?? v.fr ?? "");
const t = (v, lang) => echapper(tr(v, lang));

const prix = (n, lang) =>
  `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ${UI[lang].devise}`;

export const telInternational = (tel) => {
  const chiffres = String(tel).replace(/\D/g, "");
  if (chiffres.startsWith("213")) return chiffres;
  if (chiffres.startsWith("0")) return "213" + chiffres.slice(1);
  return chiffres;
};
const lienTel = (tel) => `tel:+${telInternational(tel)}`;
const lienWa = (c, lang) =>
  `https://wa.me/${telInternational(c.d.whatsapp || c.d.telephone)}?text=${encodeURIComponent(textes(c, lang).messageWa(tr(c.d.nom, lang)))}`;
const lienInsta = (compte) => `https://www.instagram.com/${String(compte).replace(/^@/, "")}/`;
const requeteMaps = (d) => encodeURIComponent(d.recherche_google_maps || tr(d.adresse, "fr"));
const lienItineraire = (d) => d.lien_google_maps || `https://www.google.com/maps/dir/?api=1&destination=${requeteMaps(d)}`;

// Chemin vers la même page dans l'autre langue
const autreLangue = (c, lang, sousChemin) =>
  `${c.racine}${lang === "fr" ? "ar/" : ""}${sousChemin}` || "./";

// ---------- <head> ----------
function tete(c, lang, { titre, description, chemin, prechargerAccueil = false }) {
  const d = c.d;
  const nonIndexe = d.statut !== "en-ligne";
  const urbain = d.ambiance === "urbain";
  const policeTitre = lang === "fr" && d.police_titre && !urbain ? d.police_titre : "";
  const barbier = d.ambiance === "barbier";
  const polices = d.ambiance === "maison"
    ? "family=Marcellus&family=Outfit:wght@300;400;500;700" + (lang === "ar" ? "&family=El+Messiri:wght@400;600;700&family=Noto+Kufi+Arabic:wght@400;500" : "")
    : d.ambiance === "patisserie"
    ? (lang === "ar"
      ? "family=Aref+Ruqaa:wght@400;700&family=Noto+Kufi+Arabic:wght@400;500;600&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400"
      : "family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400&family=Jost:wght@400;500;600&family=Aref+Ruqaa:wght@700")
    : barbier
    ? (d.variante === "sombre" ? "family=Big+Shoulders+Display:wght@600;800&" : "") + (lang === "ar"
      ? "family=Noto+Kufi+Arabic:wght@400;600;700&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400"
      : "family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Instrument+Sans:wght@400;500;600")
    : urbain
    ? (lang === "ar"
      ? "family=IBM+Plex+Sans+Arabic:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&family=Archivo:wdth,wght@62..125,500..900"
      : "family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Mono:wght@400;500;600")
    : (lang === "ar"
      ? "family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700;800"
      : "family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800")
      + (policeTitre ? `&family=${encodeURIComponent(policeTitre).replace(/%20/g, "+")}` : "");
  const urlPage = d.url ? `${d.url.replace(/\/$/, "")}/${chemin}` : "";
  const image = c.images.og ? `${d.url ? d.url.replace(/\/$/, "") + "/" : c.racine}${c.images.og}` : "";
  const alternatives = d.url && c.langues.length > 1
    ? `<link rel="alternate" hreflang="fr" href="${d.url.replace(/\/$/, "")}/${chemin.replace(/^ar\//, "")}">
<link rel="alternate" hreflang="ar" href="${d.url.replace(/\/$/, "")}/ar/${chemin.replace(/^ar\//, "")}">` : "";
  return `<!doctype html>
<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${echapper(titre)}</title>
<meta name="description" content="${echapper(description)}">
${nonIndexe ? '<meta name="robots" content="noindex, nofollow">' : ""}
<meta name="theme-color" content="${echapper(c.couleurs.principale)}">
<meta property="og:type" content="restaurant">
<meta property="og:title" content="${echapper(titre)}">
<meta property="og:description" content="${echapper(description)}">
${urlPage ? `<meta property="og:url" content="${echapper(urlPage)}">` : ""}
${image ? `<meta property="og:image" content="${echapper(image)}">` : ""}
<meta property="og:locale" content="${lang === "ar" ? "ar_DZ" : "fr_DZ"}">
${urlPage ? `<link rel="canonical" href="${echapper(urlPage)}">` : ""}
${alternatives}
<link rel="icon" href="${c.racine}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${polices}&display=swap">
${prechargerAccueil && c.images.accueil ? `<link rel="preload" as="image" imagesrcset="${c.racine}${c.images.accueil.petit} 900w, ${c.racine}${c.images.accueil.grand} 1800w" imagesizes="100vw" fetchpriority="high">` : ""}
<link rel="stylesheet" href="${c.racine}assets/${d.ambiance && d.ambiance !== "classique" ? d.ambiance : "style"}.css?v=${c.version}">
<style>:root{--c-principale:${c.couleurs.principale};--c-accent:${c.couleurs.accent};--c-fond:${c.couleurs.fond}${policeTitre ? `;--f-titre:"${echapper(policeTitre)}",Georgia,serif` : ""}}${c.d.position_photo_accueil ? `.hero img.fond{object-position:${echapper(c.d.position_photo_accueil)}}` : ""}</style>
<script>document.documentElement.classList.add("js")</script>
</head>`.replace(/\n{2,}/g, "\n");
}

const bandeau = (c, lang) =>
  c.d.statut !== "en-ligne" ? `<div class="bandeau-proposition" role="note">${UI[lang].bandeau({ ...c.d, nomTexte: `<bdi>${t(c.d.nom, lang)}</bdi>` })}</div>` : "";

const barreActions = (c, lang) => `
<nav class="barre-actions" aria-label="${textes(c, lang).reservation}">
  <a class="btn btn-appel" href="${lienTel(c.d.telephone)}">${icones.telephone}${UI[lang].appeler}</a>
  <a class="btn btn-whatsapp" href="${lienWa(c, lang)}" target="_blank" rel="noopener">${icones.whatsapp}${textes(c, lang).reserverCourt}</a>
</nav>`;

// ---------- Blocs ----------
function blocMenu(c, lang, niveauTitre = "h2") {
  const u = UI[lang];
  const categories = c.d.menu || [];
  const onglets = categories.map((cat, i) =>
    `<a href="#cat-${i + 1}"${i === 0 ? ' class="actif"' : ""}>${t(cat.categorie, lang)}</a>`).join("");
  const blocs = categories.map((cat, i) => `
    <div class="categorie" id="cat-${i + 1}">
      <h3>${t(cat.categorie, lang)}</h3>
      <ul class="plats">${(cat.plats || []).map((p) => `
        <li class="plat">
          <div class="ligne"><span class="nom">${t(p.nom, lang)}${(p.badges || []).map((b) => `<span class="badge ${echapper(b)}">${echapper(u.badges[b] || b)}</span>`).join("")}</span><span class="pointilles"></span><span class="prix">${p.prix != null ? prix(p.prix, lang) : ""}</span></div>
          ${tr(p.description, lang) ? `<p class="desc">${t(p.description, lang)}</p>` : ""}
        </li>`).join("")}
      </ul>
    </div>`).join("");
  return `
<section class="menu" id="menu" aria-labelledby="titre-menu">
  <div class="conteneur">
    ${niveauTitre === "h2" ? `<header class="titre-section apparait"><p class="surtitre">${u.notreCarte}</p><h2 id="titre-menu">${u.menu}</h2>${icones.ornement}</header>` : `<h2 id="titre-menu" class="sr">${u.menu}</h2>`}
    <nav class="onglets" aria-label="${u.menu}">${onglets}</nav>
    ${blocs}
    <p class="note-menu">${tr(c.d.note_menu, lang) ? t(c.d.note_menu, lang) : u.prixNote}</p>
  </div>
</section>`;
}

function tableauHoraires(c, lang) {
  const u = UI[lang];
  const h = c.d.horaires || {};
  return `<table class="horaires">
${ORDRE_JOURS.map((j) => {
  const creneaux = h[j] || [];
  const texte = creneaux.length ? creneaux.map((x) => x.replace("-", " – ")).join("<br>") : u.ferme;
  return `<tr data-jour="${j}"${creneaux.length ? "" : ' class="ferme"'}><th scope="row">${u.jours[j]}</th><td dir="ltr">${texte}</td></tr>`;
}).join("\n")}
</table>`;
}

function piedDePage(c, lang) {
  const d = c.d, u = UI[lang];
  const credit = c.credit && c.credit.nom
    ? `<small>${u.credit} ${c.credit.lien ? `<a href="${echapper(c.credit.lien)}" target="_blank" rel="noopener">${echapper(c.credit.nom)}</a>` : echapper(c.credit.nom)}</small>` : "";
  return `
<footer class="pied">
  <div class="conteneur">
    <a class="logo" href="${c.racine}${lang === "ar" ? "ar/" : ""}">${t(d.nom, lang)}</a>
    <div class="liens">
      ${d.instagram ? `<a href="${lienInsta(d.instagram)}" target="_blank" rel="noopener">${icones.instagram}@${echapper(String(d.instagram).replace(/^@/, ""))}</a>` : ""}
      <a href="${lienTel(d.telephone)}" dir="ltr">${icones.telephone}${echapper(d.telephone)}</a>
    </div>
    <small>${t(d.adresse, lang)}</small>
    <small>© ${new Date().getFullYear()} ${t(d.nom, lang)}</small>
    ${credit}
  </div>
</footer>`;
}

// ---------- Page d'accueil ----------
export function pageAccueil(c, lang) {
  const d = c.d, u = UI[lang];
  const nom = tr(d.nom, lang);
  const img = c.images.accueil;
  const ut = textes(c, lang);
  const aHoraires = Object.values(d.horaires || {}).some((x) => x.length);
  const titre = `${nom} — ${tr(d.type_cuisine, lang)} · ${tr(d.quartier, lang)}`;
  const description = tr(d.slogan, lang) || tr(d.presentation, lang).slice(0, 155);
  const chemin = lang === "ar" ? "ar/" : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: nom,
    servesCuisine: tr(d.type_cuisine, lang),
    telephone: `+${telInternational(d.telephone)}`,
    address: { "@type": "PostalAddress", streetAddress: tr(d.adresse, lang), addressLocality: "Alger", addressCountry: "DZ" },
    priceRange: "DA",
    ...(d.url ? { url: d.url, hasMenu: `${d.url.replace(/\/$/, "")}/${lang === "ar" ? "ar/" : ""}menu/` } : {}),
    ...(d.instagram ? { sameAs: [lienInsta(d.instagram)] } : {}),
    openingHoursSpecification: ORDRE_JOURS.flatMap((j, i) => (d.horaires?.[j] || []).map((cr) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i],
      opens: cr.split("-")[0], closes: cr.split("-")[1]
    })))
  };

  const galerie = (c.images.galerie || []).map((g) => `
      <button type="button" data-grande="${c.racine}${g.grand}" data-legende="${t(g.legende, lang)}" aria-label="${t(g.legende, lang)}">
        <img src="${c.racine}${g.petit}" alt="${t(g.legende, lang)}" width="${g.l}" height="${g.h}" loading="lazy" decoding="async">
        ${tr(g.legende, lang) ? `<span>${t(g.legende, lang)}</span>` : ""}
      </button>`).join("");

  return `${tete(c, lang, { titre, description, chemin, prechargerAccueil: true })}
<body>
${bandeau(c, lang)}
<header class="entete">
  <div class="conteneur">
    <a class="logo" href="#haut">${echapper(nom)}</a>
    <nav class="nav" aria-label="Navigation">
      <a href="#menu">${u.nav.menu}</a>
      ${galerie ? `<a href="#galerie">${u.nav.galerie}</a>` : ""}
      ${d.livraison ? `<a href="#livraison">${u.livraison}</a>` : ""}
      ${aHoraires ? `<a href="#horaires">${u.nav.horaires}</a>` : ""}
      <a href="#acces">${u.nav.acces}</a>
    </nav>
    ${c.langues.length > 1 ? `<a class="langue" href="${autreLangue(c, lang, "")}" hreflang="${lang === "fr" ? "ar" : "fr"}" lang="${lang === "fr" ? "ar" : "fr"}">${lang === "fr" ? "العربية" : "Français"}</a>` : ""}
  </div>
</header>

<main id="haut">
<section class="hero" aria-label="${u.bienvenue}">
  ${img ? `<img class="fond" src="${c.racine}${img.grand}" srcset="${c.racine}${img.petit} 900w, ${c.racine}${img.grand} 1800w" sizes="100vw" alt="" fetchpriority="high" decoding="async">` : ""}
  <div class="conteneur">
    <p class="surtitre">${t(d.type_cuisine, lang)} · ${t(d.quartier, lang)}</p>
    ${c.images.logo ? `<h1 class="h1-logo"><img src="${c.racine}${c.images.logo.src}" alt="${echapper(nom)}" width="${c.images.logo.l}" height="${c.images.logo.h}"></h1>` : `<h1>${echapper(nom)}</h1>`}
    ${tr(d.slogan, lang) ? `<p class="slogan">${t(d.slogan, lang)}</p>` : ""}
    ${aHoraires ? '<p class="statut" aria-live="polite"></p>' : ""}
    <div class="actions">
      <a class="btn btn-whatsapp" href="${lienWa(c, lang)}" target="_blank" rel="noopener">${icones.whatsapp}${ut.reserverWa}</a>
      <a class="btn btn-clair" href="#menu">${icones.menu}${u.voirMenu}</a>
    </div>
  </div>
</section>

${tr(d.presentation, lang) ? `
<section class="presentation">
  <div class="conteneur apparait">
    <header class="titre-section"><p class="surtitre">${u.bienvenue}</p><h2>${echapper(nom)}</h2>${icones.ornement}</header>
    <p>${t(d.presentation, lang)}</p>
    ${(d.points_forts || []).length ? `<div class="points">${d.points_forts.map((p) => `<div class="point">${icones[p.icone] || icones.etoile}<span>${t(p, lang)}</span></div>`).join("")}</div>` : ""}
  </div>
</section>` : ""}

${blocMenu(c, lang)}

${galerie ? `
<section id="galerie" aria-labelledby="titre-galerie">
  <div class="conteneur">
    <header class="titre-section apparait"><p class="surtitre">${u.enImages}</p><h2 id="titre-galerie">${u.galerie}</h2>${icones.ornement}</header>
    <div class="galerie apparait" data-n="${c.images.galerie.length}">${galerie}
    </div>
  </div>
</section>
<dialog class="visionneuse" aria-label="${u.galerie}"><form method="dialog"><button aria-label="${u.fermer}">×</button></form><img alt=""><p></p></dialog>` : ""}

${d.livraison ? `
<section class="livraison" id="livraison" aria-labelledby="titre-livraison">
  <div class="conteneur">
    <header class="titre-section apparait"><p class="surtitre">${u.livraison}</p><h2 id="titre-livraison">${u.livraisonTitre}</h2>${icones.ornement}</header>
    <ul class="zones apparait">${(d.livraison.zones || []).map((z) => `
      <li><span class="quartiers">${t(z.quartiers, lang)}</span><span class="pointilles"></span><span class="prix">${prix(z.prix, lang)}</span></li>`).join("")}
    </ul>
    <p class="note-menu">${tr(d.livraison.note, lang) ? t(d.livraison.note, lang) : u.livraisonNote}</p>
  </div>
</section>` : ""}

<section class="infos" id="${aHoraires ? "horaires" : "infos"}" aria-labelledby="titre-infos">
  <div class="conteneur">
    <header class="titre-section apparait"><p class="surtitre">${u.infosPratiques}</p><h2 id="titre-infos">${u.infos}</h2>${icones.ornement}</header>
    <div class="infos-grille${aHoraires ? "" : " seule"}">
      ${aHoraires ? `<div class="carte apparait">
        <h3>${icones.horloge}${u.horaires}</h3>
        <p class="statut" aria-live="polite"></p>
        ${tableauHoraires(c, lang)}
      </div>` : ""}
      <div class="carte apparait" id="acces">
        <h3>${icones.lieu}${u.acces}</h3>
        <p class="adresse">${t(d.adresse, lang)}</p>
        <div class="plan"><iframe src="https://maps.google.com/maps?q=${requeteMaps(d)}&hl=${lang}&z=16&output=embed" title="Google Maps — ${t(d.adresse, lang)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
        <div class="actions">
          <a class="btn btn-appel" href="${lienItineraire(d)}" target="_blank" rel="noopener">${icones.itineraire}${u.itineraire}</a>
          <a class="btn btn-contour" href="${lienTel(d.telephone)}">${icones.telephone}<span dir="ltr">${echapper(d.telephone)}</span></a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="reservation" id="reserver">
  <div class="conteneur apparait">
    <header class="titre-section"><p class="surtitre">${ut.reservation}</p><h2>${ut.reserverTitre}</h2>${icones.ornement}</header>
    <p>${ut.reserverTexte}</p>
    <div class="actions">
      <a class="btn btn-whatsapp" href="${lienWa(c, lang)}" target="_blank" rel="noopener">${icones.whatsapp}${ut.reserverWa}</a>
      <a class="btn btn-contour" href="${lienTel(d.telephone)}">${icones.telephone}${u.appeler}</a>
    </div>
  </div>
</section>
</main>
${piedDePage(c, lang)}
${barreActions(c, lang)}
${aHoraires ? `<script type="application/json" id="donnees-horaires">${JSON.stringify(d.horaires)}</script>` : ""}
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}

// ---------- Page « menu seul » (ouverte par le QR code sur les tables) ----------
export function pageMenu(c, lang) {
  const d = c.d, u = UI[lang];
  const nom = tr(d.nom, lang);
  const chemin = (lang === "ar" ? "ar/" : "") + "menu/";
  return `${tete(c, lang, { titre: `${u.menu} — ${nom}`, description: `${u.menu} · ${nom} · ${tr(d.quartier, lang)}`, chemin })}
<body class="page-menu">
${bandeau(c, lang)}
<header class="entete-menu">
  <h1>${echapper(nom)}</h1>
  <p>${t(d.type_cuisine, lang)} · ${t(d.quartier, lang)}</p>
  ${c.langues.length > 1 ? `<a class="langue" href="${autreLangue(c, lang, "menu/")}" lang="${lang === "fr" ? "ar" : "fr"}">${lang === "fr" ? "العربية" : "Français"}</a>` : ""}
</header>
<main>
${blocMenu(c, lang, "sr")}
<a class="retour" href="../">${u.retourSite}</a>
</main>
${piedDePage(c, lang)}
${barreActions(c, lang)}
<script src="${c.racine}assets/script.js?v=${c.version}" defer></script>
</body>
</html>
`;
}

// ---------- Affiche QR imprimable (4 cartes de table sur une page A4) ----------
export function pageQR(c) {
  const d = c.d;
  const fr = UI.fr, ar = UI.ar;
  const bilingue = c.langues.includes("ar");
  const carte = `
  <div class="carte-qr">
    <p class="nom">${t(d.nom, "fr")}</p>
    ${bilingue && tr(d.nom, "ar") !== tr(d.nom, "fr") ? `<p class="nom-ar" lang="ar" dir="rtl">${t(d.nom, "ar")}</p>` : ""}
    <p class="titre">${fr.carteMenu}${bilingue ? ` · <span lang="ar" dir="rtl">${ar.carteMenu}</span>` : ""}</p>
    <div class="qr">${c.qrSvg}</div>
    <p class="consigne">${fr.scanner}</p>
    ${bilingue ? `<p class="consigne" lang="ar" dir="rtl">${ar.scanner}</p>` : ""}
    <p class="url">${echapper(c.urlMenu.replace(/^https?:\/\//, ""))}</p>
  </div>`;
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>QR menu à imprimer — ${t(d.nom, "fr")}</title>
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Manrope:wght@500;700&family=Amiri:wght@700&family=Tajawal:wght@500;700&display=swap">
<style>
  :root { --p: ${c.couleurs.principale}; --a: ${c.couleurs.accent}; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Manrope, system-ui, sans-serif; background: #e9e6e0; color: #1d1b18; }
  .outils { max-width: 210mm; margin: 20px auto; padding: 0 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .outils button { font: inherit; font-weight: 700; padding: 12px 22px; border-radius: 999px; border: 0; background: var(--p); color: #fff; cursor: pointer; }
  .outils p { margin: 0; font-size: 14px; color: #555; }
  .feuille { width: 210mm; min-height: 297mm; margin: 0 auto 30px; background: #fff; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; box-shadow: 0 10px 40px rgb(0 0 0 / .15); }
  .carte-qr { border: 1px dashed #ccc; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 10mm; position: relative; }
  .carte-qr::before { content: ""; position: absolute; inset: 6mm; border: 1.5px solid var(--a); border-radius: 6mm; pointer-events: none; }
  .nom { font-family: "Cormorant Garamond", serif; font-size: 30pt; font-weight: 700; color: var(--p); margin: 0; line-height: 1; }
  .nom-ar { font-family: Amiri, serif; font-size: 20pt; color: var(--p); margin: 2mm 0 0; }
  .titre { font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-size: 10pt; color: var(--a); margin: 4mm 0 4mm; }
  .titre span { font-family: Tajawal, sans-serif; letter-spacing: 0; text-transform: none; font-size: 11pt; }
  .qr { width: 46mm; height: 46mm; }
  .qr svg { width: 100%; height: 100%; display: block; }
  .consigne { font-size: 9pt; margin: 3mm 0 0; color: #444; }
  .consigne[lang="ar"] { font-family: Tajawal, sans-serif; font-size: 10pt; margin-top: 1mm; }
  .url { font-size: 8pt; color: #888; margin: 2mm 0 0; }
  @page { size: A4; margin: 0; }
  @media print {
    body { background: #fff; }
    .outils { display: none; }
    .feuille { box-shadow: none; margin: 0; }
  }
  @media screen and (max-width: 800px) {
    .feuille { width: 100%; min-height: 0; grid-template-columns: 1fr; grid-template-rows: none; }
    .carte-qr { min-height: 120mm; }
    .carte-qr:not(:first-child) { display: none; }
  }
</style>
</head>
<body>
<div class="outils">
  <button onclick="window.print()">🖨 ${fr.imprimer}</button>
  <p>${fr.conseilImpression}</p>
</div>
<div class="feuille">${carte.repeat(4)}</div>
</body>
</html>
`;
}

// Utilitaires partagés avec les autres ambiances (modele-restaurant/ambiances/)
export { UI, textes, t, prix, lienTel, lienWa, lienInsta, requeteMaps, lienItineraire, autreLangue, tete, bandeau, barreActions, tableauHoraires, ORDRE_JOURS };
