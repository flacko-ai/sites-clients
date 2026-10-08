#!/usr/bin/env node
// Fabrique une maquette HTML « tout-en-un » d'un client : un seul fichier par langue, avec le style,
// le script et les photos intégrés. Idéal pour l'envoyer par WhatsApp ou l'ouvrir sur un téléphone.
//
//   npm run maquette -- nom-du-client
//
// Résultat : clients/<dossier>/maquette/<dossier>.html (+ <dossier>-ar.html si le site est bilingue).
// Le site doit d'abord avoir été généré (npm run generer -- <dossier>).
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dossier = process.argv[2];
if (!dossier) { console.error("Usage : npm run maquette -- <dossier-client>"); process.exit(1); }
const pub = path.join(RACINE, "clients", dossier, "public");
const sortie = path.join(RACINE, "clients", dossier, "maquette");
const existe = (p) => access(p).then(() => true, () => false);
const TYPES = { webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", svg: "image/svg+xml" };

async function enUnFichier(page, autreLangue) {
  const dir = path.dirname(path.join(pub, page));
  let h = await readFile(path.join(pub, page), "utf8");
  const lire = (rel) => readFile(path.resolve(dir, rel.replace(/\?.*$/, "")));

  // Style et script intégrés
  for (const m of [...h.matchAll(/<link rel="stylesheet" href="((?:\.\.\/)*assets\/[\w-]+\.css)[^"]*">/g)])
    h = h.replace(m[0], `<style>${await lire(m[1])}</style>`);
  for (const m of [...h.matchAll(/<script src="((?:\.\.\/)*assets\/script\.js)[^"]*" defer><\/script>/g)])
    h = h.replace(m[0], `<script>${await lire(m[1])}</script>`);

  // Une seule taille d'image, chargée tout de suite (fichier autonome)
  h = h.replace(/<link rel="preload"[^>]*>/g, "").replace(/ srcset="[^"]*"/g, "").replace(/ sizes="[^"]*"/g, "").replace(/ loading="lazy"/g, "");
  // Chemins relatifs uniquement (pas les adresses en ligne comme og:image)
  const IMG = /(?<=["'(])((?:\.\.\/)*(?:img\/[\w.-]+|favicon\.svg))(?=["')])/g;
  const cache = new Map();
  for (const [, rel] of h.matchAll(IMG)) {
    if (!cache.has(rel)) cache.set(rel, `data:${TYPES[rel.split(".").pop()]};base64,${(await lire(rel)).toString("base64")}`);
  }
  h = h.replace(IMG, (rel) => cache.get(rel));

  // Le bouton de langue ouvre l'autre fichier de la maquette
  if (autreLangue) h = h.replace(/class="([\w-]*langue)" href="[^"]*"/g, `class="$1" href="${autreLangue}"`);
  return h;
}

if (!(await existe(path.join(pub, "index.html")))) { console.error(`✘ Lancer d'abord : npm run generer -- ${dossier}`); process.exit(1); }
await mkdir(sortie, { recursive: true });
const bilingue = await existe(path.join(pub, "ar/index.html"));
const fr = await enUnFichier("index.html", bilingue ? `${dossier}-ar.html` : null);
await writeFile(path.join(sortie, `${dossier}.html`), fr);
console.log(`✔ clients/${dossier}/maquette/${dossier}.html (${Math.round(fr.length / 1024)} Ko)`);
if (bilingue) {
  const ar = await enUnFichier("ar/index.html", `${dossier}.html`);
  await writeFile(path.join(sortie, `${dossier}-ar.html`), ar);
  console.log(`✔ clients/${dossier}/maquette/${dossier}-ar.html (${Math.round(ar.length / 1024)} Ko)`);
}
