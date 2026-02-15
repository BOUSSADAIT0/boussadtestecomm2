# 🛍️ E-Commerce Glassmorphism

Application e-commerce moderne avec design glassmorphism et intégration Stripe pour les paiements en euros.

## 🚀 Technologies

- **Front-end**: React + Vite
- **Style**: CSS pur avec glassmorphism (backdrop-filter, transparence, blur)
- **Back-end**: Node.js + Express
- **Base de données**: PostgreSQL + Prisma
- **Paiement**: Stripe Checkout (EUR)

## 📁 Structure du projet

```
.
├── client/          # Application React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── ...
│   └── package.json
├── server/          # API Express
│   ├── routes/
│   ├── prisma/
│   └── package.json
└── README.md
```

## 🛠️ Installation

### Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL
- Compte Stripe (clés de test)

### 1. Configuration de la base de données

Créez une base de données PostgreSQL :

```sql
CREATE DATABASE ecommerce_db;
```

### 2. Configuration du serveur

```bash
cd server
npm install
```

Créez un fichier `.env` dans le dossier `server/` :

```env
PORT=5000
BASE_URL=http://localhost:5000
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db?schema=public"
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
FRONTEND_URL=http://localhost:5173
STRIPE_SUCCESS_URL=http://localhost:5173/success
STRIPE_CANCEL_URL=http://localhost:5173/cancel
```

### 3. Initialisation de la base de données

```bash
# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run prisma:migrate

# Remplir la base avec des données exemple
node seed.js
```

### 4. Configuration du client

```bash
cd ../client
npm install
```

## 🎯 Démarrage

### Terminal 1 - Serveur

```bash
cd server
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Terminal 2 - Client

```bash
cd client
npm run dev
```

L'application démarre sur `http://localhost:5173`

## 📝 Fonctionnalités

### Front-end

- ✅ Page d'accueil avec produits (cartes glassmorphism)
- ✅ Ajout au panier
- ✅ Page panier (modifier quantité, supprimer)
- ✅ Bouton "Payer" connecté à Stripe
- ✅ Pages Success / Cancel
- ✅ Design responsive (desktop + mobile)
- ✅ Animations légères (hover, transitions)

### Back-end

- ✅ API produits (GET /api/products, GET /api/products/:id)
- ✅ API panier (GET, POST, PUT, DELETE)
- ✅ Endpoint création session Stripe
- ✅ Gestion des montants en euros
- ✅ Sécurité (variables d'environnement)

### Paiement Stripe

- ✅ Stripe Checkout
- ✅ Devise : EUR
- ✅ Carte bancaire
- ✅ Montant dynamique selon panier
- ✅ URLs success et cancel configurées

## 🎨 Design Glassmorphism

Le design utilise les propriétés CSS suivantes :

- `backdrop-filter: blur(10px)` - Effet de flou
- `background: rgba(255, 255, 255, 0.1)` - Transparence
- `border: 1px solid rgba(255, 255, 255, 0.2)` - Bordures subtiles
- `box-shadow` - Ombres douces
- Animations et transitions fluides

## 🔐 Sécurité

- Les clés Stripe sont stockées côté serveur uniquement
- Variables d'environnement pour les configurations sensibles
- CORS configuré pour le front-end
- Validation des données côté serveur

## 📦 Données exemple

Le script `seed.js` crée 6 produits exemple :
- Smartphone Premium (899.99 €)
- Écouteurs Sans Fil (249.99 €)
- Montre Connectée (399.99 €)
- Tablette Pro (1299.99 €)
- Casque Gaming (179.99 €)
- Clavier Mécanique (149.99 €)

## 🧪 Test Stripe

Utilisez les cartes de test Stripe :

- **Succès**: `4242 4242 4242 4242`
- **Échec**: `4000 0000 0000 0002`
- Date d'expiration: n'importe quelle date future
- CVC: n'importe quel 3 chiffres

## 📚 API Endpoints

### Produits

- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit

### Panier

- `GET /api/cart/:sessionId` - Récupère le panier
- `POST /api/cart` - Ajoute un produit au panier
- `PUT /api/cart/:id` - Met à jour la quantité
- `DELETE /api/cart/:id` - Supprime un item
- `DELETE /api/cart/clear/:sessionId` - Vide le panier

### Stripe

- `POST /api/stripe/create-checkout-session` - Crée une session de paiement

## 🚀 Déploiement

### Variables d'environnement à configurer

- `DATABASE_URL` - URL de connexion PostgreSQL
- `STRIPE_SECRET_KEY` - Clé secrète Stripe (production)
- `FRONTEND_URL` - URL du front-end en production
- `STRIPE_SUCCESS_URL` - URL de succès en production
- `STRIPE_CANCEL_URL` - URL d'annulation en production

## 📄 Licence

ISC

## 👨‍💻 Développement

Pour contribuer au projet :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

Développé avec ❤️ en utilisant React, Express, Prisma et Stripe

