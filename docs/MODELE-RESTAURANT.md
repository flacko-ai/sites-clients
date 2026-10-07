# Modèle « Restaurant » : les champs de `contenu.json`

Tous les textes peuvent être bilingues : `{ "fr": "…", "ar": "…" }`.
Si la traduction arabe manque, le texte français est utilisé.

| Champ | Exemple | Remarques |
|---|---|---|
| `statut` | `"proposition"` ou `"en-ligne"` | `proposition` = bandeau + non indexé par Google |
| `exemple_fictif` | `true` / `false` | `true` uniquement pour la démo (le bandeau dit « restaurant fictif ») |
| `url` | `"https://dar-nouara.netlify.app"` | adresse **réelle** du site : le QR code pointe vers `url/menu/` |
| `langues` | `["fr", "ar"]` | `["fr"]` pour un site en français seulement |
| `nom`, `type_cuisine`, `quartier`, `slogan`, `presentation` | textes | affichés en haut de la page |
| `points_forts` | liste de 3 éléments | icônes possibles : `chef`, `famille`, `parking`, `terrasse`, `livraison`, `wifi`, `coeur`, `etoile` |
| `telephone` | `"0550 12 34 56"` | bouton **Appeler** (format algérien accepté, converti en +213) |
| `whatsapp` | `"0550 12 34 56"` | bouton **Réserver sur WhatsApp** avec un message pré-rempli |
| `instagram` | `"nom.du.compte"` | sans le @ |
| `adresse` | texte | affichée sur le site |
| `recherche_google_maps` | `"Nom du resto, Hydra, Alger"` | ce qui est cherché pour afficher le plan |
| `lien_google_maps` | lien `https://maps.app.goo.gl/…` | facultatif : lien « Partager » de la fiche Google Maps du restaurant, plus précis pour le bouton « Itinéraire » |
| `horaires` | `"lundi": ["12:00-15:30", "19:00-23:00"]` | `[]` = fermé ; un créneau après minuit s'écrit `"19:00-01:00"` |
| `couleurs` | `principale`, `accent`, `fond` | codes couleur, à adapter à l'identité du restaurant |
| `photos.accueil` | `"accueil.jpg"` | grande photo du haut (de préférence horizontale) |
| `photos.galerie` | `[{ "fichier": "…", "fr": "légende", "ar": "…" }]` | 6 photos, c'est l'idéal |
| `menu` | catégories → plats | `prix` en DA (nombre entier) ; `badges` : `maison`, `signature`, `vegetarien`, `nouveau`, `epice` |
| `ambiance` | `"classique"` (défaut) ou `"urbain"` | `urbain` : street food (menu en ticket de caisse, titres larges, livraison sur fond noir) |
| `mode` | `"reservation"` (défaut) ou `"commande"` | `commande` : boutons « Commander sur WhatsApp » (restauration rapide, livraison) |
| `horaires` vide `{}` | — | si les horaires sont inconnus, la carte des horaires et le statut « Ouvert/Fermé » sont masqués |
| `photos.logo` | `"logo.png"` | facultatif : logo foncé sur fond clair, affiché en blanc à la place du nom sur la photo d'accueil |
| `police_titre` | `"Kaushan Script"` | facultatif : police Google Fonts pour les titres (version française) |
| `position_photo_accueil` | `"50% 20%"` | facultatif : quelle partie de la photo d'accueil garder visible (horizontal, vertical) |
| `livraison` | `{ "note": {…}, "zones": [{ "quartiers": {…}, "prix": 300 }] }` | facultatif : section « Tarifs de livraison » par quartier |
| `note_menu` | texte | facultatif, remplace « Prix en dinars algériens (DA), service compris. » |

## Photos

- Les mettre dans `clients/<dossier>/photos/`, dans n'importe quelle taille (photos de téléphone acceptées).
- Elles sont automatiquement redimensionnées, compressées (format WebP) et **nettoyées de leurs
  données GPS** à la génération.
- Ne jamais utiliser de lien direct vers les images d'Instagram : elles cessent de fonctionner.
  Il faut enregistrer les fichiers.
