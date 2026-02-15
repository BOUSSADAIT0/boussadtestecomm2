# 🔧 Configuration Vercel - Guide Complet

## ⚠️ Le problème actuel

Vercel retourne des erreurs 404 car il ne trouve pas les fichiers. C'est parce que **Vercel ne sait pas que le projet est dans le dossier `client/`**.

## ✅ Solution : Configurer le Root Directory

### Méthode 1 : Via l'interface Vercel (RECOMMANDÉ)

1. **Allez sur [vercel.com](https://vercel.com)**
2. **Sélectionnez votre projet** `boussadtestecomm2`
3. **Cliquez sur "Settings"** (en haut à droite)
4. **Dans le menu de gauche, cliquez sur "General"**
5. **Faites défiler jusqu'à la section "Root Directory"**
   - Si vous ne voyez pas cette section, elle peut être dans **"Build & Development Settings"**
6. **Cliquez sur "Edit"** à côté de "Root Directory"
7. **Entrez : `client`**
8. **Cliquez sur "Save"**
9. **Allez dans l'onglet "Deployments"**
10. **Cliquez sur les "..." à côté du dernier déploiement**
11. **Sélectionnez "Redeploy"**

### Méthode 2 : Via Vercel CLI

Si vous avez Vercel CLI installé :

```bash
vercel --cwd client
```

### Méthode 3 : Supprimer et recréer le projet

Si vous ne trouvez toujours pas l'option Root Directory :

1. **Supprimez le projet actuel sur Vercel**
2. **Recréez-le en important depuis GitHub**
3. **Lors de la configuration, Vercel vous demandera le Root Directory**
4. **Entrez : `client`**

## 📋 Vérification

Après avoir configuré le Root Directory, vérifiez que :

- ✅ **Root Directory** = `client`
- ✅ **Framework Preset** = `Vite` (ou détecté automatiquement)
- ✅ **Build Command** = `npm run build`
- ✅ **Output Directory** = `dist`
- ✅ **Install Command** = `npm install`

## 🚀 Après configuration

Vercel devrait maintenant :
1. Aller dans le dossier `client/`
2. Installer les dépendances (`npm install`)
3. Builder le projet (`npm run build`)
4. Servir les fichiers depuis `client/dist/`

## 📝 Fichiers de configuration

- `client/vercel.json` - Configuration pour le déploiement (déjà présent)
- `vercel.json` (racine) - Tentative de configuration, mais moins fiable

**Recommandation :** Utilisez la **Méthode 1** (interface Vercel) pour configurer le Root Directory. C'est la solution la plus fiable.

