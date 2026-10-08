# Inspirations : dépôts GitHub et sites de référence

Objectif : **ne pas refaire toujours les mêmes sites**. Pour chaque nouveau client, Claude choisit dans ce catalogue
(et cherche 1 ou 2 références neuves), montre les pistes au propriétaire avec captures, puis **adapte** à l'univers
réel du commerce. Le code n'est repris que si la licence le permet (MIT, Apache 2.0), en gardant la mention de l'auteur
en commentaire dans le fichier repris.

Tous les dépôts ci-dessous ont été **téléchargés, ouverts et leur licence vérifiée** (octobre 2026).

## Méthode (pour Claude)
1. Lire la section « Recettes par métier » et la table « Déjà utilisé » : ne pas reprendre l'effet principal d'un client précédent.
2. Télécharger les dépôts utiles pour les étudier :
   `node outils/references.mjs <scratchpad>/refs <mot-clé>` (ex. `galerie`, `texte`, `coiffeur` ; sans mot-clé = tout).
3. Les ouvrir dans Chromium (`python3 -m http.server` dans le dossier) et faire des captures.
4. Proposer 2-3 directions avec captures (planches dans `docs/inspirations/`).
5. Construire en **adaptant** : couleurs, matières et photos du client ; une seule animation marquante.
6. Ajouter une ligne dans « Déjà utilisé ». Chercher aussi 1-2 références neuves en ligne et les ajouter ici si elles sont bonnes.

## 1. Briques prêtes à l'emploi (licence MIT ou Apache, vérifiée)
| Dépôt | Ce que ça fait | Bon pour |
|---|---|---|
| [dimsemenov/PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe) | galerie plein écran, glisser / zoomer au doigt | tous (galerie photos) |
| [sneas/img-comparison-slider](https://github.com/sneas/img-comparison-slider) | curseur avant / après | coiffeur, institut, rénovation |
| [Splidejs/splide](https://github.com/Splidejs/splide) | carrousel léger, accessible | vitrines produits, avis |
| [davidjerleke/embla-carousel](https://github.com/davidjerleke/embla-carousel) | carrousel fluide au doigt | menus en cartes, plats |
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | défilement doux « haut de gamme » | sites sombres et luxe |
| [shshaw/Splitting](https://github.com/shshaw/Splitting) | découpe un titre en lettres pour l'animer | enseigne, nom du commerce |
| [michalsnik/aos](https://github.com/michalsnik/aos) | apparition des blocs au défilement | simple, partout |
| [swup/swup](https://github.com/swup/swup) | transitions entre pages | sites multi-pages |
| [argyleink/open-props](https://github.com/argyleink/open-props) | courbes d'animation, ombres, dégradés prêts | tous (finitions) |
| [io23 scroll-driven codelab](https://github.com/googlechromelabs/io23-scroll-driven-animations-codelab) (Apache) | animations au défilement **sans JavaScript** | sites très légers |

## 2. Effets Codrops (licence MIT, basés sur GSAP, gratuit même en commercial)
Planches de captures : [`inspirations/planche-1.jpg`](inspirations/planche-1.jpg) (haut de page) et
[`inspirations/planche-2.jpg`](inspirations/planche-2.jpg) (après défilement). Les numéros renvoient aux planches.

| N° | Dépôt | Effet | Idée d'adaptation |
|---|---|---|---|
| 3 | [ContextAwareLogoAnimationScroll](https://github.com/codrops/ContextAwareLogoAnimationScroll) | le logo en en-tête se cache / réapparaît selon la section | logo centré façon Kayser, pâtisserie, maison de luxe |
| 4 | [ElasticGridScroll](https://github.com/codrops/ElasticGridScroll) | colonnes de photos qui glissent à des vitesses différentes | galerie de plats, coupes du barbier, gâteaux |
| 5 | [IntroGridMotionTransition](https://github.com/codrops/IntroGridMotionTransition) | grille de photos inclinée qui bouge avec la souris | accueil d'un restaurant avec beaucoup de photos |
| 6 | [OnScrollLayoutFormations](https://github.com/codrops/OnScrollLayoutFormations) | nom géant qui se forme au défilement | enseigne forte (street food, barbier) |
| 7 | [OnScrollTextHighlight](https://github.com/codrops/OnScrollTextHighlight) | le texte s'allume mot par mot | histoire de la maison, citation du chef |
| 8 | [RepeatingImageTransition](https://github.com/codrops/RepeatingImageTransition) | photo qui s'ouvre en grand avec effet de répétition | carte des plats, vitrine |
| 9 | [ScrollBlurTypography](https://github.com/codrops/ScrollBlurTypography) | texte qui sort du flou | sites sombres (barbier, lounge) |
| 10 | [ScrollTextMotion](https://github.com/codrops/ScrollTextMotion) | mots qui s'éparpillent / se rassemblent | café branché, concept store |
| 11 | [SlideshowAnimations](https://github.com/codrops/SlideshowAnimations) | 16 transitions de diaporama | grand visuel d'accueil, produit vedette |
| — | [isle-thorne-collective](https://github.com/codrops/isle-thorne-collective) | modèle complet de boutique (Astro) | commerces avec catalogue (déco, mode) |

Plus de 300 autres démos : [github.com/orgs/codrops/repositories](https://github.com/orgs/codrops/repositories)
et [tympanus.net/codrops/demos](https://tympanus.net/codrops/demos/).

## 3. Modèles complets (surtout pour la structure, pas le style)
| N° | Dépôt | Licence | Avis |
|---|---|---|---|
| 2 | [codewithsadee/grilli](https://github.com/codewithsadee/grilli) | MIT | restaurant sombre et doré : **très copié**, à éviter tel quel |
| 1 | [codewithsadee/barber](https://github.com/codewithsadee/barber) | **aucune** | idée seulement, ne rien reprendre |
| — | [TemplateMo Frost Bakery](https://templatemo.com/tm-613-frost-bakery) | gratuit (licence TemplateMo) | boulangerie claire, sans dépendances |

Les modèles gratuits de GitHub sont souvent basiques : ils servent pour l'organisation des rubriques, pas pour le style.

## 4. Vrais sites et galeries (pour le style)
- Galeries de sites primés : [godly.website](https://godly.website), [siteinspire.com](https://www.siteinspire.com),
  [onepagelove.com](https://onepagelove.com) (rubrique Restaurant), [awwwards.com](https://www.awwwards.com/websites/food-drink/).
- Restaurants : Gramercy Tavern, Restaurant Daniel ([sélection UpMenu](https://www.upmenu.com/blog/best-restaurant-websites-design/)).
- Pâtisseries / boulangeries : Beaucoup Bakery, Tori's Bakeshop ([sélection Zarla](https://www.zarla.com/guides/bakery-website-examples)).
- Barbiers : Gould Barbers, Long & Short Barber Co. ([sélection Zarla](https://www.zarla.com/guides/barbershop-website-examples)).
- Donnés par le propriétaire : blackboxparis.com (barbier sombre), maison-kayser.com (logo centré, menu en capitales).

## 5. Recettes par métier (point de départ, à varier)
| Métier | Effet marquant possible | Briques |
|---|---|---|
| Restaurant traditionnel | grille de photos inclinée (n° 5) ou texte qui s'allume (n° 7) pour l'histoire | PhotoSwipe, Embla pour la carte |
| Street food / fast-food | nom géant qui se forme (n° 6) | Splitting |
| Café / salon de thé | mots qui s'assemblent (n° 10) | Splide pour les boissons |
| Pâtisserie / boulangerie | logo qui se cache / réapparaît (n° 3), galerie élastique (n° 4) | PhotoSwipe |
| Barbier / coiffeur | texte qui sort du flou (n° 9), curseur avant / après | img-comparison-slider, Lenis |
| Institut / spa | diaporama doux (n° 11), avant / après | img-comparison-slider |
| Boutique | modèle isle-thorne, transition d'images (n° 8) | Swup |

## Déjà utilisé
| Client | Références | Effet marquant |
|---|---|---|
| Bun & Fun | (ambiance `urbain`) | menu en ticket de caisse |
| H Barber Company (v1) | blackboxparis.com | accueil plein écran, menu flottant |
| H Barber Company (v2, ambiance `capitonne`) | codrops/ScrollBlurTypography (n° 9), io23 scroll-driven | présentation qui sort du flou mot à mot ; fond cuir capitonné |
| Signature Pâtisserie | maison-kayser.com | trait de signature doré qui se dessine |
| La Pâtisserie Lucas Castello | maison-kayser.com | bande moutarde en diagonale |
