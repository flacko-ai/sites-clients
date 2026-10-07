#!/usr/bin/env node
// Crée des visuels décoratifs (motif zellige) pour les photos MANQUANTES d'un client.
// Utile pour une démonstration ou une proposition quand le client n'a pas encore envoyé ses photos.
//
//   node outils/images-demo.mjs dar-nouara
//
// Les photos déjà présentes dans clients/<dossier>/photos/ ne sont jamais écrasées.
import { readFile, access, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dossier = process.argv[2];
if (!dossier) { console.error("Usage : node outils/images-demo.mjs <dossier-client>"); process.exit(1); }
const base = path.join(RACINE, "clients", dossier);
const d = JSON.parse(await readFile(path.join(base, "contenu.json"), "utf8"));
await mkdir(path.join(base, "photos"), { recursive: true });

const couleurs = { principale: "#1f3a33", accent: "#c08a3e", ...(d.couleurs || {}) };
const ambiances = [
  ["#7a3b22", "#c0703f"], ["#2d4a3e", "#5d7f63"], ["#8a5a1e", "#d0a050"],
  ["#5b2a3a", "#a35466"], ["#24465a", "#4f8098"], ["#3f3a26", "#8c8350"]
];
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Étoile à 8 branches (motif zellige)
function etoile(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI / 8) * i, rr = i % 2 ? r * 0.62 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}"/>`;
}

function svg({ l, h, fond1, fond2, trait, legende, sousTitre }) {
  const pas = 120;
  let motif = "";
  for (let y = 0; y <= h + pas; y += pas)
    for (let x = 0; x <= l + pas; x += pas) {
      motif += etoile(x, y, 46) + etoile(x + pas / 2, y + pas / 2, 22);
    }
  const r = Math.min(l, h) * 0.3;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${l}" height="${h}" viewBox="0 0 ${l} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${fond1}"/><stop offset="1" stop-color="${fond2}"/></linearGradient>
    <radialGradient id="v" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g fill="none" stroke="${trait}" stroke-width="2" opacity=".28">${motif}</g>
  <rect width="100%" height="100%" fill="url(#v)"/>
  ${legende ? `
  <circle cx="${l / 2}" cy="${h / 2}" r="${r}" fill="#000" fill-opacity=".22" stroke="${trait}" stroke-width="3"/>
  <circle cx="${l / 2}" cy="${h / 2}" r="${r - 14}" fill="none" stroke="${trait}" stroke-opacity=".6" stroke-width="1.5"/>
  <text x="${l / 2}" y="${h / 2 + 4}" text-anchor="middle" font-family="DejaVu Serif, Georgia, serif" font-style="italic" font-size="${Math.round(r / 4.2)}" fill="#fff">${esc(legende)}</text>
  <text x="${l / 2}" y="${h / 2 + r / 3.2}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-size="${Math.round(r / 11)}" letter-spacing="3" fill="#fff" fill-opacity=".75">${esc(sousTitre)}</text>` : ""}
</svg>`;
}

async function creer(fichier, opts) {
  const dest = path.join(base, "photos", fichier);
  try { await access(dest); console.log(`= ${fichier} existe déjà, conservé`); return; } catch {}
  await sharp(Buffer.from(svg(opts))).jpeg({ quality: 88 }).toFile(dest);
  console.log(`+ ${fichier}`);
}

if (d.photos?.accueil) {
  await creer(d.photos.accueil, { l: 2000, h: 1400, fond1: couleurs.principale, fond2: "#0f1f1b", trait: couleurs.accent });
}
for (const [i, g] of (d.photos?.galerie || []).entries()) {
  const [f1, f2] = ambiances[i % ambiances.length];
  await creer(g.fichier, { l: 1600, h: 1600, fond1: f1, fond2: f2, trait: "#f3d9a4", legende: g.fr || "", sousTitre: "PHOTO À VENIR" });
}
