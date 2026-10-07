# Consignes pour Claude — dépôt `sites-clients`

Le propriétaire est **non technique et francophone** : répondre **en français**, étape par étape, sans jargon.
Il vend des sites vitrines à des commerces d'Alger (d'abord des restaurants).

## Règles impératives
- **Statut « proposition » par défaut** : tant que le client n'a pas accepté, `contenu.json` → `"statut": "proposition"`
  (bandeau « Proposition » + `noindex` dans la page et l'en-tête HTTP). Ne passer à `"en-ligne"` que sur demande explicite.
- **Jamais de clé secrète** (API, jeton…) dans le dépôt. Maps = iframe sans clé, WhatsApp = lien `wa.me`.
- **Commit et push sur `main`** à chaque site créé ou modifié (le propriétaire l'a demandé explicitement).
  Netlify publie automatiquement `main`.
- Ne jamais inventer d'informations sur un vrai client (prix, horaires, adresse) : demander ce qui manque.

## Ajouter un client (restaurant)
1. Choisir un dossier en minuscules avec tirets (ex. `le-jardin-hydra`), puis `npm install` si besoin et `npm run nouveau -- <dossier>`.
2. Remplir `clients/<dossier>/contenu.json` (voir `docs/MODELE-RESTAURANT.md`), traduire en arabe, `url` = `https://<dossier>.netlify.app`.
3. Copier les photos dans `clients/<dossier>/photos/` ; s'il en manque : `node outils/images-demo.mjs <dossier>`.
4. `npm run generer -- <dossier>` puis vérifier le rendu (Playwright, Chromium dans `/opt/pw-browsers/chromium`, largeur 390 px) en FR et AR.
5. Commit (dossier client complet, y compris `public/`), push sur `main`.
6. La mise en ligne est **automatique** : le workflow GitHub `.github/workflows/mise-en-ligne.yml` crée le projet
   Netlify (nom tiré de `url`) et publie chaque client modifié à chaque push sur `main` (secret `NETLIFY_AUTH_TOKEN`).
   Vérifier le résultat du workflow (outils GitHub `actions_list` / `get_job_logs`) puis donner le lien au propriétaire.
   Si le nom est déjà pris sur Netlify, changer `url`, régénérer (le QR code en dépend) et repousser.

## Technique
- Générateur : `outils/generer.mjs` (Node, `sharp` pour les images, `qrcode` pour le QR). Gabarits : `modele-restaurant/gabarits.mjs`,
  style : `modele-restaurant/style.css`, script : `modele-restaurant/script.js`.
- `public/` est généré et **versionné** (Netlify ne lance aucune construction). Ne pas le modifier à la main.
- Après une modification du modèle : `npm run generer -- --tous` (attention : republie tous les clients → crédits Netlify).
- `netlify.toml` de chaque client : la commande `ignore` évite de republier les clients non modifiés (formule gratuite limitée en crédits).
- `clients/dar-nouara` est un restaurant **fictif** de démonstration (`exemple_fictif: true`).
