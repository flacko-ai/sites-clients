#!/usr/bin/env node
// Met en ligne un ou plusieurs clients sur Netlify via l'API (utilisé par GitHub Actions).
// Crée le projet Netlify s'il n'existe pas encore, puis publie clients/<dossier>/public.
//
//   NETLIFY_AUTH_TOKEN=… node outils/deployer-netlify.mjs dar-nouara autre-client
//   NETLIFY_AUTH_TOKEN=… node outils/deployer-netlify.mjs --tous
//
// Le nom du projet Netlify est lu dans contenu.json → "url" (https://<nom>.netlify.app).
// La clé NETLIFY_AUTH_TOKEN n'est jamais écrite dans le dépôt : c'est un secret GitHub.
import { readFile, readdir, access, mkdtemp } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLIENTS = path.join(RACINE, "clients");
const API = "https://api.netlify.com/api/v1";
const JETON = process.env.NETLIFY_AUTH_TOKEN;
if (!JETON) { console.error("✘ Secret NETLIFY_AUTH_TOKEN absent (GitHub → Settings → Secrets and variables → Actions)."); process.exit(1); }

const existe = (p) => access(p).then(() => true, () => false);
async function api(methode, chemin, corps, type = "application/json") {
  const r = await fetch(API + chemin, {
    method: methode,
    headers: { Authorization: `Bearer ${JETON}`, ...(corps ? { "Content-Type": type } : {}) },
    body: corps && type === "application/json" ? JSON.stringify(corps) : corps
  });
  const texte = await r.text();
  if (!r.ok) throw new Error(`Netlify ${methode} ${chemin} → ${r.status} ${texte.slice(0, 300)}`);
  return texte ? JSON.parse(texte) : null;
}

async function deployer(dossier) {
  const base = path.join(CLIENTS, dossier);
  const d = JSON.parse(await readFile(path.join(base, "contenu.json"), "utf8"));
  if (d.publier !== true) { console.log(`- ${dossier} : maquette seulement ("publier" n'est pas true), non publié sur Netlify.`); return; }
  const m = /^https:\/\/([a-z0-9-]+)\.netlify\.app/.exec(d.url || "");
  if (!m) { console.log(`- ${dossier} : "url" n'est pas une adresse *.netlify.app, ignoré.`); return; }
  const nom = m[1];
  const publicDir = path.join(base, "public");
  if (!(await existe(path.join(publicDir, "index.html")))) throw new Error(`${dossier} : public/index.html absent, lancer d'abord npm run generer -- ${dossier}`);

  // Trouver ou créer le projet Netlify
  let site = (await api("GET", `/sites?name=${encodeURIComponent(nom)}&filter=all&per_page=100`)).find((s) => s.name === nom);
  if (!site) {
    try {
      site = await api("POST", "/sites", { name: nom });
      console.log(`+ Projet Netlify créé : ${nom}`);
    } catch (e) {
      if (/422/.test(e.message)) throw new Error(`${dossier} : le nom "${nom}" est déjà pris sur Netlify par quelqu'un d'autre. Choisir une autre "url" dans contenu.json.`);
      throw e;
    }
  }

  // Envoyer le site (archive zip du dossier public/)
  const zip = path.join(await mkdtemp(path.join(tmpdir(), "deploy-")), "site.zip");
  execFileSync("zip", ["-r", "-q", zip, "."], { cwd: publicDir });
  let deploy = await api("POST", `/sites/${site.id}/deploys`, await readFile(zip), "application/zip");
  for (let i = 0; i < 60 && !["ready", "error"].includes(deploy.state); i++) {
    await new Promise((r) => setTimeout(r, 2000));
    deploy = await api("GET", `/deploys/${deploy.id}`);
  }
  if (deploy.state !== "ready") throw new Error(`${dossier} : publication en état "${deploy.state}" ${deploy.error_message || ""}`);
  console.log(`✔ ${dossier} en ligne : ${site.ssl_url || `https://${nom}.netlify.app`}`);
}

const args = process.argv.slice(2);
const dossiers = args.includes("--tous")
  ? (await readdir(CLIENTS, { withFileTypes: true })).filter((e) => e.isDirectory()).map((e) => e.name)
  : args;
if (!dossiers.length) { console.log("Aucun client à publier."); process.exit(0); }
let echec = false;
for (const dossier of dossiers) {
  try { await deployer(dossier); } catch (e) { echec = true; console.error("✘ " + e.message); }
}
process.exit(echec ? 1 : 0);
