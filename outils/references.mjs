// Télécharge (lecture seule) les dépôts du catalogue docs/INSPIRATIONS.md pour les étudier.
// Usage : node outils/references.mjs <dossier-de-travail> [mot-clé]
//   ex.   node outils/references.mjs /tmp/refs galerie
// Rien n'est copié dans le dépôt : on lit, on s'inspire, et on ne reprend du code que si la licence le permet.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

export const CATALOGUE = [
  // Briques prêtes à l'emploi (MIT)
  { depot: "dimsemenov/PhotoSwipe", tags: "galerie plein-ecran" },
  { depot: "sneas/img-comparison-slider", tags: "avant-apres coiffeur institut" },
  { depot: "Splidejs/splide", tags: "carrousel diaporama" },
  { depot: "davidjerleke/embla-carousel", tags: "carrousel diaporama" },
  { depot: "darkroomengineering/lenis", tags: "defilement-doux" },
  { depot: "shshaw/Splitting", tags: "texte lettres animation" },
  { depot: "michalsnik/aos", tags: "apparition defilement" },
  { depot: "swup/swup", tags: "transition pages" },
  { depot: "argyleink/open-props", tags: "courbes ombres couleurs" },
  { depot: "googlechromelabs/io23-scroll-driven-animations-codelab", tags: "apparition defilement css" },
  // Effets Codrops (MIT, utilisent GSAP)
  { depot: "codrops/ContextAwareLogoAnimationScroll", tags: "logo entete defilement" },
  { depot: "codrops/ElasticGridScroll", tags: "galerie grille defilement" },
  { depot: "codrops/IntroGridMotionTransition", tags: "galerie grille accueil" },
  { depot: "codrops/OnScrollLayoutFormations", tags: "titre geant defilement" },
  { depot: "codrops/OnScrollTextHighlight", tags: "texte citation defilement" },
  { depot: "codrops/RepeatingImageTransition", tags: "galerie transition" },
  { depot: "codrops/ScrollBlurTypography", tags: "texte flou defilement" },
  { depot: "codrops/ScrollTextMotion", tags: "texte defilement" },
  { depot: "codrops/SlideshowAnimations", tags: "diaporama accueil" },
  { depot: "codrops/isle-thorne-collective", tags: "boutique modele-complet" },
  // Modèles complets (contre-exemples ou idées de structure)
  { depot: "codewithsadee/grilli", tags: "restaurant modele-complet" },
  { depot: "codewithsadee/barber", tags: "coiffeur modele-complet sans-licence" },
];

const [dossier, motCle] = process.argv.slice(2);
if (!dossier) { console.error("Usage : node outils/references.mjs <dossier-de-travail> [mot-clé]"); process.exit(1); }
mkdirSync(dossier, { recursive: true });
for (const { depot, tags } of CATALOGUE) {
  if (motCle && !`${depot} ${tags}`.toLowerCase().includes(motCle.toLowerCase())) continue;
  const cible = path.join(dossier, depot.replace("/", "__"));
  if (existsSync(cible)) { console.log(`= ${depot} (déjà là)`); continue; }
  try {
    execFileSync("git", ["clone", "-q", "--depth", "1", `https://github.com/${depot}`, cible], { stdio: "inherit", timeout: 120000 });
    console.log(`✔ ${depot}`);
  } catch { console.log(`✘ ${depot}`); }
}
