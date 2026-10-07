# Mettre un site client en ligne sur Netlify (pas à pas)

L'interface de Netlify est en anglais : les libellés exacts des boutons sont indiqués **en gras**.
Netlify modifie parfois ses écrans ; si un libellé diffère un peu, cherchez le bouton le plus proche.

---

## A. Une seule fois : créer le compte et relier GitHub

1. Allez sur **https://app.netlify.com/signup**.
2. Cliquez sur **Sign up with GitHub** (S'inscrire avec GitHub) et acceptez l'autorisation.
3. Choisissez la formule gratuite (**Free**) si Netlify vous la propose.
   Aucune carte bancaire n'est nécessaire.

> **Important : la formule gratuite a une limite de crédits.**
> Les comptes Netlify récents ont environ **300 crédits par mois**, et chaque mise en ligne
> coûte environ **15 crédits**, soit à peu près **20 mises en ligne par mois** pour l'ensemble des sites.
> Le dépôt est réglé pour ne republier **que le client modifié** : une modification du menu
> d'un restaurant ne republie pas les autres. Vous pouvez suivre votre consommation dans
> **Team settings → Usage / Billing**.

---

## A bis. Recommandé : mise en ligne 100 % automatique (une seule fois)

Avec ce réglage, Claude crée et publie chaque nouveau site tout seul : la partie B devient inutile.

1. **Créer la clé Netlify** : sur Netlify, cliquez sur votre avatar (en bas à gauche) → **User settings**
   → **Applications** → **Personal access tokens** → **New access token**.
   Description : `GitHub sites-clients` ; Expiration : la plus longue proposée → **Generate token**.
   **Copiez** le code affiché (il ne sera plus montré). Ne l'envoyez à personne, pas même à Claude.
2. **La ranger dans GitHub** : ouvrez https://github.com/flacko-ai/sites-clients → **Settings** (onglet en haut)
   → **Secrets and variables** → **Actions** → **New repository secret**.
   Name : `NETLIFY_AUTH_TOKEN` ; Secret : collez le code → **Add secret**.
3. C'est tout. À chaque site envoyé par Claude, le robot (onglet **Actions** du dépôt) le met en ligne.

---

## B. Méthode manuelle, pour chaque nouveau client (environ 2 minutes)

### Écran 1 : la liste des projets
- Connectez-vous sur **https://app.netlify.com**.
- Cliquez sur **Add new project** (Ajouter un projet), puis sur **Import an existing project** (Importer un projet existant).

### Écran 2 : choisir le fournisseur Git
- Cliquez sur **GitHub**.
- **La première fois seulement**, Netlify ne voit peut-être pas le dépôt. Dans ce cas :
  - cliquez sur **Configure the Netlify app on GitHub** (en bas de la liste) ;
  - choisissez l'organisation **flacko-ai** ;
  - cochez **Only select repositories**, choisissez **sites-clients**, puis cliquez sur **Save** (ou **Install**) ;
  - si GitHub demande l'accord du propriétaire de l'organisation, faites accepter la demande.

### Écran 3 : choisir le dépôt
- Cliquez sur **sites-clients**.

### Écran 4 : réglages du projet (le plus important)
Remplissez exactement :

| Champ Netlify | Que mettre | Exemple pour le restaurant fictif |
|---|---|---|
| **Project name** | le nom du dossier du client, qui devient l'adresse du site | `dar-nouara` → `dar-nouara.netlify.app` |
| **Branch to deploy** | `main` | `main` |
| **Base directory** | `clients/` + le nom du dossier | `clients/dar-nouara` |
| **Build command** | laisser ce que Netlify propose (ou vide) | — |
| **Publish directory** | `clients/<dossier>/public` (souvent rempli tout seul) | `clients/dar-nouara/public` |

- Cliquez sur **Deploy** (en bas de la page ; le bouton peut s'appeler **Deploy dar-nouara**).

> Si Netlify indique que le nom est **déjà pris**, choisissez une variante
> (par ex. `dar-nouara-hydra`) et **envoyez-moi le nom exact** : je dois mettre à jour
> l'adresse dans le site, car le QR code imprimable pointe vers cette adresse.

### Écran 5 : la page du projet
- Attendez environ 30 secondes : la ligne de publication passe à **Published**.
- L'adresse du site apparaît en haut (par ex. `https://dar-nouara.netlify.app`). Cliquez dessus pour vérifier.
- Pour changer l'adresse plus tard : **Project configuration → General → Project details → Change project name**.

---

## C. Réglage conseillé (une fois par projet) : économiser les crédits

Dans le projet : **Project configuration → Build & deploy → Continuous deployment → Branches and deploy contexts → Configure** :
- **Branch deploys** : choisissez **Deploy only the production branch** ;
- **Deploy Previews** : choisissez **Don't deploy pull requests** ;
- cliquez sur **Save**.

---

## D. Quand le client accepte

1. Dites-moi simplement : « *<nom du client> a accepté* ».
2. J'enlève le bandeau « Proposition », j'autorise Google à référencer le site, puis je publie.
3. Si le client veut un nom de domaine à lui (par ex. `restaurant.dz` ou `.com`) :
   **Domain management → Add a domain**, puis suivez les instructions. Envoyez-moi le domaine pour que je mette l'adresse à jour dans le site.

---

## E. En cas de problème

- **« Page not found »** : vérifiez **Base directory** = `clients/<dossier>` et **Publish directory** = `clients/<dossier>/public` dans **Project configuration → Build & deploy → Build settings → Edit settings**, puis **Deploys → Trigger deploy → Deploy project without cache**.
- **Publication « Canceled »** : c'est normal quand le dossier de ce client n'a pas changé (économie de crédits).
- **Le site ne se met pas à jour** : dans **Deploys**, regardez si la dernière publication a échoué et envoyez-moi une capture d'écran.
