#!/usr/bin/env node
// Génère le site statique d'un client à partir de clients/<dossier>/contenu.json et de ses photos.
//
//   npm run generer -- dar-nouara      → un seul client
//   npm run generer -- --tous          → tous les clients
//
// Résultat : clients/<dossier>/public/  (c'est ce dossier que Netlify met en ligne).
import { readFile, writeFile, mkdir, rm, copyFile, readdir, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import QRCode from "qrcode";
import * as classique from "../modele-restaurant/gabarits.mjs";
import * as urbain from "../modele-restaurant/ambiances/urbain.mjs";
import * as barbier from "../modele-restaurant/ambiances/barbier.mjs";
import * as patisserie from "../modele-restaurant/ambiances/patisserie.mjs";

const { pageQR, tr } = classique;
// Ambiances disponibles (champ "ambiance" de contenu.json) ; "classique" par défaut.
const AMBIANCES = { classique, urbain, barbier, patisserie };

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODELE = path.join(RACINE, "modele-restaurant");
const CLIENTS = path.join(RACINE, "clients");

const existe = (p) => access(p).then(() => true, () => false);
const erreur = (msg) => { throw new Error(msg); };

function verifier(d, dossier) {
  const manque = ["statut", "url", "nom", "type_cuisine", "quartier", "telephone", "adresse", "horaires", "menu"]
    .filter((k) => d[k] == null || d[k] === "");
  if (manque.length) erreur(`[${dossier}] champs manquants dans contenu.json : ${manque.join(", ")}`);
  if (!["proposition", "en-ligne"].includes(d.statut))
    erreur(`[${dossier}] "statut" doit valoir "proposition" ou "en-ligne" (actuellement "${d.statut}")`);
  if (!/^https:\/\/[a-z0-9.-]+(\/|$)/.test(d.url)) erreur(`[${dossier}] "url" doit ressembler à https://nom-du-client.netlify.app`);
  for (const [jour, creneaux] of Object.entries(d.horaires)) {
    for (const c of creneaux) if (!/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(c))
      erreur(`[${dossier}] horaire invalide pour ${jour} : "${c}" (format attendu "12:00-15:30")`);
  }
}

async function traiterImage(source, dest, largeur, hauteur) {
  const img = sharp(source).rotate(); // .rotate() applique l'orientation du téléphone ; les métadonnées (GPS…) sont supprimées
  await img.resize({ width: largeur, height: hauteur, fit: "cover", withoutEnlargement: !hauteur })
    .toFormat(dest.endsWith(".jpg") ? "jpeg" : "webp", { quality: dest.endsWith(".jpg") ? 82 : 78 })
    .toFile(dest);
  const m = await sharp(dest).metadata();
  return { l: m.width, h: m.height };
}

async function generer(dossier) {
  const base = path.join(CLIENTS, dossier);
  const d = JSON.parse(await readFile(path.join(base, "contenu.json"), "utf8"));
  verifier(d, dossier);
  const config = (await existe(path.join(RACINE, "config.json")))
    ? JSON.parse(await readFile(path.join(RACINE, "config.json"), "utf8")) : {};

  const sortie = path.join(base, "public");
  await rm(sortie, { recursive: true, force: true });
  for (const sous of ["assets", "img", "menu", "qr", "ar/menu"]) await mkdir(path.join(sortie, sous), { recursive: true });

  // Feuille de style et script communs (+ version pour forcer le rafraîchissement du cache)
  const ambiance = d.ambiance || "classique";
  if (!AMBIANCES[ambiance]) erreur(`[${dossier}] ambiance inconnue "${ambiance}" (possibles : ${Object.keys(AMBIANCES).join(", ")})`);
  const fichierCss = ambiance === "classique" ? "style.css" : `${ambiance}.css`;
  const css = await readFile(path.join(MODELE, fichierCss));
  const js = await readFile(path.join(MODELE, "script.js"));
  const version = createHash("sha1").update(css).update(js).digest("hex").slice(0, 8);
  await copyFile(path.join(MODELE, fichierCss), path.join(sortie, "assets", fichierCss));
  await copyFile(path.join(MODELE, "script.js"), path.join(sortie, "assets/script.js"));

  // Photos
  const photos = path.join(base, "photos");
  const images = { galerie: [] };
  if (d.photos?.accueil) {
    const src = path.join(photos, d.photos.accueil);
    if (!(await existe(src))) erreur(`[${dossier}] photo d'accueil introuvable : photos/${d.photos.accueil}`);
    await traiterImage(src, path.join(sortie, "img/accueil-900.webp"), 900);
    await traiterImage(src, path.join(sortie, "img/accueil-1800.webp"), 1800);
    await traiterImage(src, path.join(sortie, "img/partage.jpg"), 1200, 630); // aperçu WhatsApp / Facebook
    images.accueil = { petit: "img/accueil-900.webp", grand: "img/accueil-1800.webp" };
    images.og = "img/partage.jpg";
  }
  if (d.photos?.logo) {
    // Logo foncé sur fond clair → version blanche sur fond transparent, lisible sur la photo d'accueil
    const src = path.join(photos, d.photos.logo);
    if (!(await existe(src))) erreur(`[${dossier}] logo introuvable : photos/${d.photos.logo}`);
    const { data, info } = await sharp(src).rotate().resize({ width: 900, withoutEnlargement: true })
      .flatten({ background: "#ffffff" }).greyscale().raw().toBuffer({ resolveWithObject: true });
    const rgba = Buffer.alloc(info.width * info.height * 4);
    for (let i = 0; i < info.width * info.height; i++) {
      const alpha = Math.max(0, Math.min(255, (235 - data[i]) * 1.35));
      rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 255; rgba[i * 4 + 3] = alpha;
    }
    await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().webp({ quality: 90 })
      .toFile(path.join(sortie, "img/logo.webp"));
    const m = await sharp(path.join(sortie, "img/logo.webp")).metadata();
    images.logo = { src: "img/logo.webp", l: m.width, h: m.height };
    // Version noire (pour les fonds clairs)
    for (let i = 0; i < info.width * info.height; i++) rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 0;
    await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().webp({ quality: 90 })
      .toFile(path.join(sortie, "img/logo-noir.webp"));
    images.logoNoir = { src: "img/logo-noir.webp", l: m.width, h: m.height };
  }
  for (const [i, g] of (d.photos?.galerie || []).entries()) {
    const src = path.join(photos, g.fichier);
    if (!(await existe(src))) erreur(`[${dossier}] photo de galerie introuvable : photos/${g.fichier}`);
    const n = String(i + 1).padStart(2, "0");
    const dim = await traiterImage(src, path.join(sortie, `img/galerie-${n}-700.webp`), 700);
    await traiterImage(src, path.join(sortie, `img/galerie-${n}-1600.webp`), 1600);
    images.galerie.push({ petit: `img/galerie-${n}-700.webp`, grand: `img/galerie-${n}-1600.webp`, legende: g, ...dim });
  }

  // Logo déjà détouré (fond transparent, couleurs d'origine) : utilisé tel quel
  if (d.photos?.logo_detoure) {
    const src = path.join(photos, d.photos.logo_detoure);
    if (!(await existe(src))) erreur(`[${dossier}] logo introuvable : photos/${d.photos.logo_detoure}`);
    await sharp(src).resize({ width: 600, withoutEnlargement: true }).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(sortie, "img/logo-entete.webp"));
    const m = await sharp(path.join(sortie, "img/logo-entete.webp")).metadata();
    images.logoEntete = { src: "img/logo-entete.webp", l: m.width, h: m.height };
  }

  // Vitrines (catégories de produits illustrées, ambiance pâtisserie)
  images.vitrines = [];
  for (const [i, v] of (d.photos?.vitrines || []).entries()) {
    const src = path.join(photos, v.fichier);
    if (!(await existe(src))) erreur(`[${dossier}] photo de vitrine introuvable : photos/${v.fichier}`);
    const n = String(i + 1).padStart(2, "0");
    const dim = await traiterImage(src, path.join(sortie, `img/vitrine-${n}-800.webp`), 800);
    images.vitrines.push({ petit: `img/vitrine-${n}-800.webp`, legende: v, detail: v.detail, ...dim });
  }

  const couleurs = { principale: "#1f3a33", accent: "#c08a3e", fond: "#f8f3ea", ...(d.couleurs || {}) };
  const langues = d.langues?.length ? d.langues : ["fr"];
  const urlMenu = `${d.url.replace(/\/$/, "")}/menu/`;
  const qrSvg = await QRCode.toString(urlMenu, {
    type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: couleurs.principale, light: "#ffffff00" }
  });

  const ctx = (racine) => ({ d, images, couleurs, langues, version, racine, credit: config.credit, qrSvg, urlMenu });
  const { pageAccueil, pageMenu } = AMBIANCES[ambiance];
  await writeFile(path.join(sortie, "index.html"), pageAccueil(ctx(""), "fr"));
  await writeFile(path.join(sortie, "menu/index.html"), pageMenu(ctx("../"), "fr"));
  await writeFile(path.join(sortie, "qr/index.html"), pageQR(ctx("../")));
  if (langues.includes("ar")) {
    await writeFile(path.join(sortie, "ar/index.html"), pageAccueil(ctx("../"), "ar"));
    await writeFile(path.join(sortie, "ar/menu/index.html"), pageMenu(ctx("../../"), "ar"));
  } else {
    await rm(path.join(sortie, "ar"), { recursive: true, force: true });
  }

  // Icône d'onglet : initiale du restaurant
  const initiale = tr(d.nom, "fr").trim().charAt(0).toUpperCase();
  await writeFile(path.join(sortie, "favicon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${couleurs.principale}"/><text x="32" y="44" font-family="Georgia,serif" font-size="36" font-weight="700" text-anchor="middle" fill="${couleurs.accent}">${initiale}</text></svg>\n`);

  // Indexation Google : bloquée tant que le client n'a pas accepté (statut "proposition")
  const enLigne = d.statut === "en-ligne";
  await writeFile(path.join(sortie, "_headers"), [
    "/*",
    "  X-Content-Type-Options: nosniff",
    "  Referrer-Policy: strict-origin-when-cross-origin",
    ...(enLigne ? [] : ["  X-Robots-Tag: noindex, nofollow"]),
    "/qr/*",
    "  X-Robots-Tag: noindex, nofollow",
    "/img/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    "/assets/*",
    "  Cache-Control: public, max-age=31536000, immutable",
    ""
  ].join("\n"));
  const urlBase = d.url.replace(/\/$/, "");
  await writeFile(path.join(sortie, "robots.txt"), enLigne
    ? `User-agent: *\nDisallow: /qr/\n\nSitemap: ${urlBase}/sitemap.xml\n`
    : `# Site en proposition : non indexé (voir la balise noindex).\nUser-agent: *\nDisallow:\n`);
  if (enLigne) {
    const pages = ["", "menu/", ...(langues.includes("ar") ? ["ar/", "ar/menu/"] : [])];
    await writeFile(path.join(sortie, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${urlBase}/${p}</loc></url>`).join("\n")}\n</urlset>\n`);
  }

  // Configuration Netlify du client (créée une seule fois)
  const toml = path.join(base, "netlify.toml");
  if (!(await existe(toml))) await copyFile(path.join(MODELE, "netlify.toml"), toml);

  console.log(`✔ ${dossier} → clients/${dossier}/public  (${enLigne ? "EN LIGNE, indexable" : "PROPOSITION, noindex"})`);
}

const args = process.argv.slice(2);
if (!args.length) {
  console.error("Usage : npm run generer -- <dossier-client>   ou   npm run generer -- --tous");
  process.exit(1);
}
const dossiers = args.includes("--tous")
  ? (await readdir(CLIENTS, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name)
  : args;
try {
  for (const dossier of dossiers) await generer(dossier);
} catch (e) {
  console.error("✘ " + e.message);
  process.exit(1);
}
