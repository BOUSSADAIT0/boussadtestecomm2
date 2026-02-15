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

## ⚠️ Problème actuel

L'erreur 404 vient probablement du fait que :
1. Vercel ne trouve pas le bon dossier de build
2. Ou le Root Directory n'est pas configuré sur `client`

**Solution :**
1. Allez dans les paramètres du projet sur Vercel
2. Dans "General" → "Root Directory", mettez : `client`
3. Redéployez

