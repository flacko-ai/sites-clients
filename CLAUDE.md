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

## Façon de travailler du propriétaire (à respecter dans chaque nouvelle discussion)
- Il envoie : lien Google Maps, lien Instagram, captures d'écran (stories, profil), parfois un ZIP SnapTik de photos.
  Il dit souvent « ne crée rien, j'envoie d'autres photos » puis « c'est tout » : attendre ce signal.
- Les images envoyées **pendant** un tour de Claude ne sont pas enregistrées en fichiers : lui demander de les renvoyer
  dans un message séparé. Les images d'un message normal sont dans `/tmp/claude-0/.../images/` (copier tout de suite).
- Liens `maps.app.goo.gl` : suivre la redirection avec `curl -I` (donne nom + quartier) ; la fiche s'ouvre dans Chromium
  via `https://www.google.com/maps/search/?api=1&query=…` (téléphone, horaires, note). Instagram/TikTok sont bloqués.
- **Livrer une maquette HTML** (FR + AR) avec SendUserFile + 2 ou 3 captures d'aperçu. **Pas de Netlify sauf demande.**
- Design : charger le plugin `frontend-design`, partir de l'univers réel du commerce (couleurs, enseigne, logo, matières),
  une seule animation marquante, pas de style générique « IA ». Il aime les sites raffinés et sombres/haut de gamme
  (références : blackboxparis.com, maison-kayser.com — logo centré en en-tête).
- **Varier les inspirations** : pour chaque nouveau client, chercher 2-3 références neuves (dépôts GitHub publics,
  vrais sites du métier) dans le catalogue `docs/INSPIRATIONS.md` (dépôts vérifiés, planches de captures, recettes par métier),
  `npm run references -- <scratchpad>/refs <mot-clé>` pour les télécharger, les montrer avec captures, **adapter** à l'univers
  du client, puis noter dans « Déjà utilisé ». Ne pas reprendre l'effet marquant d'un client précédent.
- Ne rien inventer (prix, horaires, produits non visibles sur les photos) : signaler ce qui manque à la fin.
- Si le logo est illisible, le recomposer proprement (SVG/texte) et le signaler ; sinon le détourer depuis une photo.
- Réponses en français simple, étapes numérotées, sans jargon.

## Ajouter un client (restaurant)
1. Choisir un dossier en minuscules avec tirets (ex. `le-jardin-hydra`), puis `npm install` si besoin et `npm run nouveau -- <dossier>`.
2. Remplir `clients/<dossier>/contenu.json` (voir `docs/MODELE-RESTAURANT.md`), traduire en arabe, `url` = `https://<dossier>.netlify.app`.
3. Copier les photos dans `clients/<dossier>/photos/` ; s'il en manque : `node outils/images-demo.mjs <dossier>`.
4. `npm run generer -- <dossier>` puis vérifier le rendu (Playwright, Chromium dans `/opt/pw-browsers/chromium`, largeur 390 px) en FR et AR.
5. **Livrable par défaut = maquette HTML** (demande du propriétaire) : `npm run maquette -- <dossier>` crée
   `clients/<dossier>/maquette/<dossier>.html` (+ `-ar.html`), fichiers autonomes (style, script, photos intégrés),
   à envoyer au propriétaire avec SendUserFile. Commit + push sur `main`.
6. **Netlify seulement sur demande** : `"publier": false` par défaut dans contenu.json → le robot ignore le client.
   Quand le propriétaire demande la mise en ligne : `"publier": true`, régénérer, push, puis lancer le workflow
   (actions_run_trigger `mise-en-ligne.yml`, input `clients` = dossier) si `public/` n'a pas changé.
   Le robot ne se déclenche que sur les changements de `clients/*/public/`. La mise en ligne est alors **automatique** : le workflow GitHub `.github/workflows/mise-en-ligne.yml` crée le projet
   Netlify (nom tiré de `url`) et publie chaque client modifié à chaque push sur `main` (secret `NETLIFY_AUTH_TOKEN`).
   Vérifier le résultat du workflow (outils GitHub `actions_list` / `get_job_logs`) puis donner le lien au propriétaire.
   Si le nom est déjà pris sur Netlify, changer `url`, régénérer (le QR code en dépend) et repousser.

## Design
- Plugin `frontend-design` installé : le charger avant de créer une nouvelle ambiance ou de retoucher le design.
- Ambiances : `classique` (gabarits.mjs + style.css), `urbain` (ambiances/urbain.mjs + urbain.css, street food) et `barbier`
  (ambiances/barbier.mjs + barbier.css : prestations, horaires_connus, citation, note_google, contact Instagram), `patisserie`
  (ambiances/patisserie.mjs + patisserie.css : photos.vitrines, nom_complet, citation, trait de signature animé), `maison`
  (ambiances/maison.mjs + maison.css : enseigne multi-boutiques — boutiques[] avec horaires/espaces, photos.espaces, accroche, maison). Choisir selon le commerce ;
  partir de l'univers réel du client (enseigne, ticket, ardoise…) plutôt que de défauts génériques.

## Technique
- Générateur : `outils/generer.mjs` (Node, `sharp` pour les images, `qrcode` pour le QR). Gabarits : `modele-restaurant/gabarits.mjs`,
  style : `modele-restaurant/style.css`, script : `modele-restaurant/script.js`.
- `public/` est généré et **versionné** (Netlify ne lance aucune construction). Ne pas le modifier à la main.
- Après une modification du modèle : `npm run generer -- --tous` (attention : republie tous les clients → crédits Netlify).
- `netlify.toml` de chaque client : la commande `ignore` évite de republier les clients non modifiés (formule gratuite limitée en crédits).
- `clients/dar-nouara` est un restaurant **fictif** de démonstration (`exemple_fictif: true`).
