# 🔐 Guide d'accès à la page Admin

## 📋 Étapes pour accéder au dashboard admin

### 1️⃣ Créer l'utilisateur admin

Exécutez le script de seed qui crée automatiquement un utilisateur admin :

```bash
cd server
npm run seed
```

Cela créera un utilisateur admin avec :
- **Email** : `admin@example.com`
- **Mot de passe** : `admin123`
- **Rôle** : `ADMIN`

### 2️⃣ Se connecter avec le compte admin

1. Allez sur votre site (par exemple `http://localhost:5173`)
2. Cliquez sur l'icône utilisateur (👤) dans la navbar
3. Connectez-vous avec :
   - Email : `admin@example.com`
   - Mot de passe : `admin123`

### 3️⃣ Accéder au dashboard admin

Une fois connecté en tant qu'admin, vous pouvez accéder au dashboard de deux façons :

**Option 1 : Via l'URL directe**
```
http://localhost:5173/admin
```

**Option 2 : Via le code**
- Le dashboard est automatiquement accessible si vous êtes connecté en tant qu'admin
- Si vous n'êtes pas admin, vous serez redirigé vers la page d'accueil

---

## 🛠️ Créer un autre utilisateur admin

### Méthode 1 : Via le script seed (modifier seed.js)

Modifiez le fichier `server/seed.js` pour changer l'email et le mot de passe de l'admin par défaut.

### Méthode 2 : Via un autre admin

1. Connectez-vous en tant qu'admin
2. Allez sur `/admin`
3. Cliquez sur l'onglet "Utilisateurs"
4. Trouvez l'utilisateur que vous voulez promouvoir
5. Changez son rôle de "Utilisateur" à "Admin"

### Méthode 3 : Directement dans la base de données

```sql
-- Via Prisma Studio
npm run prisma:studio

-- Ou via SQL direct
UPDATE users SET role = 'ADMIN' WHERE email = 'votre@email.com';
```

---

## ⚠️ Important

- **Changez le mot de passe par défaut** en production !
- L'utilisateur admin a accès à toutes les fonctionnalités de gestion
- Seuls les utilisateurs avec le rôle `ADMIN` peuvent accéder à `/admin`

---

## 🔒 Sécurité

Pour la production, assurez-vous de :
1. Changer le mot de passe admin par défaut
2. Utiliser un email sécurisé
3. Configurer `JWT_SECRET` dans les variables d'environnement
4. Ne pas exposer les identifiants admin dans le code

