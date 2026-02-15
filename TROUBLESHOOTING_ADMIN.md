# 🔧 Guide de dépannage - Dashboard Admin

## Problème : "Je ne vois rien dans l'interface administrateur"

### ✅ Vérifications étape par étape

#### 1. Vérifier que vous êtes connecté

1. Allez sur `http://localhost:5173/user`
2. Connectez-vous avec :
   - Email : `admin@example.com`
   - Mot de passe : `admin123`
3. Vérifiez que vous voyez votre profil utilisateur

#### 2. Vérifier que vous êtes bien admin

1. Ouvrez la console du navigateur (F12)
2. Allez dans l'onglet "Console"
3. Tapez : `localStorage.getItem('token')`
4. Vous devriez voir un token JWT

5. Vérifiez votre rôle :
   - Allez sur `/user`
   - Vous devriez voir "Rôle : Administrateur" ou "Rôle : ADMIN"

#### 3. Vérifier que le serveur est démarré

1. Ouvrez un terminal dans le dossier `server`
2. Vérifiez que le serveur tourne :
   ```bash
   npm run dev
   ```
3. Vous devriez voir : `🚀 Server running on http://localhost:5000`

#### 4. Tester l'API directement

Ouvrez votre navigateur et allez sur :
```
http://localhost:5000/api/admin/dashboard
```

**Si vous voyez** : `{"error":"Token manquant"}` → Vous n'êtes pas connecté
**Si vous voyez** : `{"error":"Accès refusé..."}` → Vous n'êtes pas admin
**Si vous voyez** : `Cannot GET /api/admin/dashboard` → Le serveur n'est pas démarré

#### 5. Vérifier dans la console du navigateur

1. Ouvrez la console (F12)
2. Allez sur `/admin`
3. Regardez les erreurs dans la console
4. Les erreurs courantes :
   - `Failed to fetch` → Le serveur n'est pas démarré
   - `401 Unauthorized` → Token invalide ou expiré
   - `403 Forbidden` → Vous n'êtes pas admin

---

## 🔍 Solutions aux problèmes courants

### Problème : "Accès refusé" ou page blanche

**Solution** :
1. Déconnectez-vous et reconnectez-vous
2. Vérifiez que votre compte a bien le rôle `ADMIN` dans la base de données
3. Si nécessaire, modifiez directement dans la base :
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
   ```

### Problème : "Erreur de connexion au serveur"

**Solution** :
1. Vérifiez que le serveur est démarré sur le port 5000
2. Vérifiez qu'aucun autre processus n'utilise le port 5000
3. Redémarrez le serveur :
   ```bash
   cd server
   npm run dev
   ```

### Problème : "Chargement..." qui ne se termine jamais

**Solution** :
1. Ouvrez la console (F12) et regardez les erreurs
2. Vérifiez que l'API répond :
   ```bash
   curl http://localhost:5000/api/health
   ```
3. Vérifiez que le proxy Vite est bien configuré dans `vite.config.js`

### Problème : Les données ne s'affichent pas

**Solution** :
1. Vérifiez que la base de données contient des données
2. Exécutez le seed si nécessaire :
   ```bash
   cd server
   npm run seed
   ```
3. Vérifiez que les tables existent :
   ```bash
   npx prisma studio
   ```

---

## 🧪 Test rapide

Exécutez ces commandes dans la console du navigateur (F12) :

```javascript
// 1. Vérifier le token
localStorage.getItem('token')

// 2. Tester l'API
fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log)

// 3. Tester le dashboard
fetch('/api/admin/dashboard', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log)
```

---

## 📞 Si le problème persiste

1. Vérifiez les logs du serveur dans le terminal
2. Vérifiez les erreurs dans la console du navigateur
3. Vérifiez que tous les fichiers sont bien sauvegardés
4. Redémarrez le serveur et le client

