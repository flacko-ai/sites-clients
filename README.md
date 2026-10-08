# Sites clients

Les sites vitrines des commerces d'Alger. **Un dossier par client**, et un site Netlify par client
(par ex. `https://dar-nouara.netlify.app`).

- Sites **statiques** : pas de base de données, pas de serveur, rien à maintenir.
- **Rapides** et pensés d'abord pour le **téléphone** (photos compressées automatiquement).
- **Français + arabe** (l'arabe s'affiche de droite à gauche).
- **Aucune clé secrète** dans le code : Google Maps, WhatsApp et Instagram sont de simples liens.

## Organisation

```
sites-clients/
├── clients/                    ← un dossier par client
│   └── dar-nouara/             ← exemple : restaurant FICTIF de démonstration
│       ├── contenu.json        ← tous les textes : nom, menu, prix, horaires, téléphone…
│       ├── photos/             ← photos d'origine envoyées par le client
│       ├── netlify.toml        ← réglages Netlify de ce client
│       └── public/             ← le site généré (c'est ce que Netlify met en ligne)
├── modele-restaurant/          ← le modèle « Restaurant » (design commun à tous)
├── outils/                     ← petits programmes qui fabriquent les sites
├── docs/
│   ├── NETLIFY.md              ← mise en ligne sur Netlify, écran par écran
│   └── MODELE-RESTAURANT.md    ← description de chaque champ de contenu.json
└── config.json                 ← réglages communs (mention « Site réalisé par… »)
```

## Ce que contient chaque site restaurant

| Page | Adresse | Rôle |
|---|---|---|
| Accueil (FR) | `/` | photo, présentation, menu, galerie, horaires, plan, réservation |
| Accueil (AR) | `/ar/` | la même page en arabe |
| Menu seul | `/menu/` et `/ar/menu/` | page légère ouverte par le QR code posé sur les tables |
| Affiche QR | `/qr/` | 4 cartes de table à imprimer (A4) et découper |

Boutons **Appeler** et **Réserver sur WhatsApp** toujours visibles en bas de l'écran du téléphone,
statut **« Ouvert maintenant / Fermé »** calculé à l'heure d'Alger.

## Le bandeau « Proposition »

Dans `contenu.json`, le champ `statut` vaut :
- `"proposition"` : bandeau « Proposition » visible en haut et site **non indexé** par Google (noindex) ;
- `"en-ligne"` : le client a accepté, le bandeau disparaît et Google peut référencer le site.

## Commandes (pour information : c'est Claude qui les lance)

```bash
npm install                               # une fois
npm run nouveau -- nom-du-client          # prépare clients/nom-du-client/
node outils/images-demo.mjs nom-du-client # visuels d'attente si des photos manquent
npm run generer -- nom-du-client          # fabrique clients/nom-du-client/public/
npm run generer -- --tous                 # refabrique tous les sites (après un changement du modèle)
npm run maquette -- nom-du-client         # maquette HTML en un seul fichier (à envoyer par WhatsApp)
```
