# 🚀 Accès Rapide au Dashboard Admin

## ✅ Comment accéder au dashboard admin

### Méthode 1 : Via la Navbar (RECOMMANDÉ)
1. Connectez-vous avec `admin@example.com` / `admin123`
2. Dans la navbar, vous verrez maintenant un bouton **"🛍️ Admin"** (à côté du panier)
3. Cliquez dessus → Vous accédez directement au dashboard admin

### Méthode 2 : Via la page Profil
1. Connectez-vous avec `admin@example.com` / `admin123`
2. Allez sur `/user` (cliquez sur votre nom dans la navbar)
3. Vous verrez un bouton **"🛍️ Accéder au Dashboard Admin"**
4. Cliquez dessus → Vous accédez au dashboard admin

### Méthode 3 : URL directe
1. Connectez-vous avec `admin@example.com` / `admin123`
2. Allez directement sur : `http://localhost:5173/admin`

---

## 🎯 Ce que vous devriez voir dans le dashboard admin

Une fois sur `/admin`, vous devriez voir :

### 📊 **Tableau de bord** (par défaut)
- **Sidebar à gauche** avec :
  - 📊 Tableau de bord
  - 📦 Produits
  - 🛒 Commandes
  - 👥 Utilisateurs
- **Contenu principal** avec :
  - Chiffre d'affaires (aujourd'hui, cette semaine, ce mois)
  - Nombre de commandes
  - Produits en stock faible
  - Top produits vendus

### 📦 **Produits** (cliquez sur "Produits" dans la sidebar)
- Liste de tous les produits
- Bouton "Ajouter un produit"
- Possibilité de modifier/supprimer chaque produit

### 🛒 **Commandes** (cliquez sur "Commandes" dans la sidebar)
- Liste de toutes les commandes
- Filtre par statut
- Possibilité de changer le statut d'une commande

### 👥 **Utilisateurs** (cliquez sur "Utilisateurs" dans la sidebar)
- Liste de tous les utilisateurs
- Possibilité de changer les rôles (USER/ADMIN)

---

## ⚠️ Si vous ne voyez pas le dashboard admin

### Vérification 1 : Êtes-vous bien connecté en tant qu'admin ?
1. Allez sur `/user`
2. Vérifiez que vous voyez : **"Rôle : Administrateur"** ou **"Rôle : ADMIN"**
3. Si vous voyez "Rôle : Utilisateur", vous n'êtes pas admin

### Vérification 2 : Le serveur est-il démarré ?
```bash
cd server
npm run dev
```
Vous devriez voir : `🚀 Server running on http://localhost:5000`

### Vérification 3 : Vérifiez dans la console du navigateur (F12)
- Regardez les erreurs dans l'onglet "Console"
- Les erreurs courantes :
  - `401 Unauthorized` → Token invalide, reconnectez-vous
  - `403 Forbidden` → Vous n'êtes pas admin
  - `Failed to fetch` → Le serveur n'est pas démarré

---

## 🔧 Si vous n'êtes pas reconnu comme admin

1. Vérifiez dans la base de données que votre compte a le rôle ADMIN :
   ```bash
   cd server
   npx prisma studio
   ```
2. Dans Prisma Studio, allez dans la table `users`
3. Trouvez votre utilisateur (`admin@example.com`)
4. Vérifiez que le champ `role` contient `ADMIN` (pas `USER`)

---

## 📝 Résumé

**Pour accéder au dashboard admin :**
1. ✅ Connectez-vous avec `admin@example.com` / `admin123`
2. ✅ Cliquez sur le bouton **"🛍️ Admin"** dans la navbar
3. ✅ OU allez sur `/admin` directement

**Vous devriez voir :**
- Une sidebar à gauche avec les menus
- Le tableau de bord avec les statistiques
- Les différentes sections (Produits, Commandes, Utilisateurs)

