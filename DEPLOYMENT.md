# 🚀 Guide de déploiement sur Vercel

## ⚠️ Important : Architecture du projet

Ce projet contient **deux parties séparées** :
1. **Client** (React) - Front-end
2. **Server** (Express) - Back-end API

## 📋 Déploiement sur Vercel

### Option 1 : Déployer uniquement le Client (Front-end)

Si vous voulez déployer uniquement le front-end sur Vercel :

1. **Dans Vercel, configurez le projet ainsi :**
   - **Root Directory** : `client`
   - **Framework Preset** : Vite
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`
   - **Install Command** : `npm install`

2. **Variables d'environnement à ajouter dans Vercel :**
   ```
   VITE_API_URL=https://votre-api-backend.herokuapp.com
   ```
   (Remplacez par l'URL de votre backend déployé)

3. **Mettre à jour le code pour utiliser l'URL de l'API :**
   - Modifier les appels API pour utiliser `import.meta.env.VITE_API_URL`

### Option 2 : Déployer Client + Server (Recommandé)

**Pour le Client (Vercel) :**
- Root Directory : `client`
- Framework : Vite
- Build Command : `npm run build`
- Output Directory : `dist`

**Pour le Server (Heroku, Railway, ou Render) :**
- Déployez le dossier `server` séparément
- Configurez les variables d'environnement (DATABASE_URL, JWT_SECRET, etc.)

---

## 🔧 Configuration actuelle

Le fichier `client/vercel.json` est configuré pour :
- Builder l'application React
- Rediriger toutes les routes vers `index.html` (pour React Router)
- Servir les fichiers statiques depuis `dist`

---

## ⚠️ Résolution de l'erreur 404: DEPLOYMENT_NOT_FOUND

Si vous voyez l'erreur **"404: NOT_FOUND"** avec le code **"DEPLOYMENT_NOT_FOUND"**, voici comment la résoudre :

### Solution étape par étape :

1. **Connectez-vous à votre dashboard Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Sélectionnez votre projet

2. **Configurez le Root Directory** :
   - Allez dans **Settings** → **General**
   - Trouvez la section **"Root Directory"**
   - Cliquez sur **"Edit"**
   - Entrez : `client`
   - Cliquez sur **"Save"**

3. **Vérifiez les paramètres de Build** :
   - Allez dans **Settings** → **General** → **Build & Development Settings**
   - Vérifiez que :
     - **Framework Preset** : `Vite` (ou laissez vide, Vercel le détectera)
     - **Build Command** : `npm run build`
     - **Output Directory** : `dist`
     - **Install Command** : `npm install`

4. **Redéployez le projet** :
   - Allez dans l'onglet **"Deployments"**
   - Cliquez sur les **"..."** à côté du dernier déploiement
   - Sélectionnez **"Redeploy"**
   - OU poussez un nouveau commit vers votre repository

5. **Si le problème persiste** :
   - Vérifiez que le fichier `client/vercel.json` existe et contient la bonne configuration
   - Vérifiez que `client/package.json` contient le script `build`
   - Vérifiez les logs de build dans Vercel pour voir s'il y a des erreurs

### Causes courantes de l'erreur 404 :

- ❌ Root Directory non configuré ou configuré sur `.` au lieu de `client`
- ❌ Le dossier `client` n'existe pas dans le repository
- ❌ Le build échoue silencieusement
- ❌ Le déploiement a été supprimé ou a expiré

