# Inspirations : dépôts GitHub et sites de référence

Objectif : **ne pas refaire toujours les mêmes sites**. Pour chaque nouveau client, Claude cherche 2 ou 3 références
neuves (dépôts GitHub publics ou vrais sites de la profession), les montre au propriétaire, puis s'en inspire
**sans copier**. Le code d'un dépôt n'est réutilisé que si sa licence le permet (MIT, Apache 2.0…), en gardant la
mention de l'auteur.

## Méthode (pour Claude)
1. Recherche web : `github <type de commerce> website template`, `github topic:<type>-website`, `codrops <effet>`.
2. Cloner en lecture seule dans le scratchpad (`git clone --depth 1`), lire la licence, prendre des captures.
3. Proposer au propriétaire 2-3 directions avec captures avant de construire.
4. Noter ci-dessous ce qui a été utilisé pour quel client.

## Briques techniques réutilisables (licence MIT, vérifiée)
| Dépôt | Usage |
|---|---|
| [dimsemenov/PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe) | galerie plein écran, glisser/zoomer au doigt |
| [sneas/img-comparison-slider](https://github.com/sneas/img-comparison-slider) | curseur avant/après (coiffeur, institut, peinture) |
| [argyleink/open-props](https://github.com/argyleink/open-props) | courbes d'animation, ombres, proportions |
| [codrops](https://github.com/orgs/codrops/repositories) | démos d'effets au défilement (à adapter, souvent GSAP) |

## Pistes à explorer par métier (licence à vérifier avant usage)
- Restaurant / café : [atulcodex Restaurant-website](https://github.com/atulcodex), [codewithsadee/grilli](https://github.com/codewithsadee/grilli) (très répandu : contre-exemple).
- Barbier / salon : [codewithsadee/barber](https://github.com/codewithsadee/barber), Barberz (ThemeWagon).
- Pâtisserie / boulangerie : rechercher `bakery-website` sur GitHub.

## Sites de référence donnés par le propriétaire
- Barbier haut de gamme : blackboxparis.com (sombre, titres étroits, menu flottant).
- Pâtisserie : maison-kayser.com (logo centré dans l'en-tête, menu en capitales).

## Déjà utilisé
| Client | Références |
|---|---|
| H Barber Company | blackboxparis.com |
| Signature Pâtisserie | maison-kayser.com |
