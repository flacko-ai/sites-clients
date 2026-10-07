#!/usr/bin/env node
// Prépare le dossier d'un nouveau client à partir du modèle « Restaurant ».
//
//   npm run nouveau -- le-nom-du-client
//
// Crée clients/<dossier>/ avec contenu.json (à remplir), photos/ et netlify.toml.
import { readFile, writeFile, mkdir, copyFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dossier = process.argv[2];
if (!dossier || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(dossier)) {
  console.error("Usage : npm run nouveau -- nom-du-client   (minuscules, chiffres et tirets uniquement)");
  process.exit(1);
}
const base = path.join(RACINE, "clients", dossier);
if (await access(base).then(() => true, () => false)) {
  console.error(`Le dossier clients/${dossier} existe déjà.`);
  process.exit(1);
}

const modele = JSON.parse(await readFile(path.join(RACINE, "modele-restaurant", "contenu-modele.json"), "utf8"));
modele.statut = "proposition";
modele.url = `https://${dossier}.netlify.app`;

await mkdir(path.join(base, "photos"), { recursive: true });
await writeFile(path.join(base, "contenu.json"), JSON.stringify(modele, null, 2) + "\n");
await copyFile(path.join(RACINE, "modele-restaurant", "netlify.toml"), path.join(base, "netlify.toml"));
console.log(`✔ clients/${dossier}/ créé. Remplissez contenu.json, ajoutez les photos, puis : npm run generer -- ${dossier}`);
