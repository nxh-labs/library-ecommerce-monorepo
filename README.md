# 🏛️ API Librairie E-commerce

Une API REST complète pour une plateforme de commerce électronique de livres, développée avec une architecture Clean Architecture + Domain-Driven Design (DDD).

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Documentation API](#-documentation-api)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Contribuer](#-contribuer)
- [Licence](#-licence)

## ✨ Fonctionnalités

### 🛒 Gestion du Catalogue
- Catalogue de livres complet avec métadonnées détaillées
- Recherche et filtrage avancés
- Gestion des catégories hiérarchiques
- Gestion du stock en temps réel

### 👤 Gestion des Utilisateurs
- Inscription et authentification JWT
- Système de rôles (Client, Manager, Admin)
- Gestion des profils utilisateur
- Historique des activités

### 🛍️ Panier d'Achat
- Ajout/suppression d'articles
- Calcul automatique des totaux
- Persistence du panier
- Conversion panier → commande

### 📦 Gestion des Commandes
- Création de commandes depuis le panier
- Suivi des statuts de livraison
- Historique des commandes
- Gestion des adresses de livraison/facturation

### ⭐ Système d'Avis
- Notation et commentaires sur les livres
- Calcul automatique des moyennes
- Modération des avis
- Statistiques des évaluations

### 🔐 Sécurité
- Authentification JWT avec refresh tokens
- Autorisation basée sur les rôles (RBAC)
- Protection contre les attaques courantes (XSS, CSRF, SQL injection)
- Chiffrement des données sensibles

### ⚡ Performance
- Cache multi-niveaux (Redis + in-memory)
- Optimisation des requêtes base de données
- Compression des réponses
- Pagination et limitation des résultats

## 🏗️ Architecture

Ce projet suit les principes de **Clean Architecture** et **Domain-Driven Design (DDD)** :

```
📁 packages/
├── 📁 backend/          # API REST (Node.js + TypeScript)
│   ├── 📁 src/
│   │   ├── 📁 domain/           # Cœur métier (DDD)
│   │   ├── 📁 application/      # Use cases et services
│   │   ├── 📁 infrastructure/   # Adaptateurs externes
│   │   └── 📁 presentation/     # API REST (contrôleurs, routes)
│   └── 📁 prisma/               # Schéma base de données
└── 📁 frontend/         # Interface utilisateur (React)
```

### Bounded Contexts DDD
- **Books** : Gestion du catalogue
- **Users** : Authentification et profils
- **Orders** : Commandes et paiements
- **Reviews** : Système d'avis
- **Categories** : Classification des livres
- **Cart** : Gestion du panier

## 🛠️ Technologies

### Backend
- **Runtime** : Node.js 18+
- **Language** : TypeScript 5.9+
- **Framework** : Express.js 5.1+
- **Base de données** : PostgreSQL 15+ (SQLite pour dev)
- **ORM** : Prisma 6.18+
- **Authentification** : JWT avec bcrypt
- **Cache** : Redis 7+
- **Validation** : Zod 4.1+
- **Tests** : Vitest 4+

### Frontend
- **Framework** : React 19+
- **Language** : TypeScript 5.9+
- **Build tool** : Vite 7+
- **Styling** : Tailwind CSS 4+
- **State management** : React Context + Hooks
- **Routing** : React Router 7+

### Outils de développement
- **Gestionnaire de paquets** : pnpm 8+
- **Linting** : ESLint
- **Formatage** : Prettier
- **Tests** : Vitest + Supertest
- **Documentation** : Swagger/OpenAPI

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 18.0 ou supérieur
- **pnpm** 8.0 ou supérieur
- **PostgreSQL** 15+ (ou SQLite pour le développement)
- **Redis** 7+ (optionnel, pour le cache)

### Installation des prérequis

#### macOS (avec Homebrew)
```bash
# Node.js et pnpm
brew install node pnpm

# PostgreSQL
brew install postgresql
brew services start postgresql

# Redis
brew install redis
brew services start redis
```

#### Ubuntu/Debian
```bash
# Node.js (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# pnpm
npm install -g pnpm

# PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Redis
sudo apt-get install redis-server
sudo systemctl start redis-server
```

#### Windows
```bash
# Node.js : Télécharger depuis https://nodejs.org/
# pnpm : npm install -g pnpm
# PostgreSQL : Télécharger depuis https://www.postgresql.org/
# Redis : Télécharger depuis https://redis.io/download
```

## 🚀 Installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd library-ecommerce-monorepo
   ```

2. **Installer les dépendances**
   ```bash
   pnpm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   # Éditer packages/backend/.env avec vos valeurs
   ```

4. **Initialiser la base de données**
   ```bash
   # Générer le client Prisma
   pnpm run db:generate

   # Appliquer les migrations
   pnpm run db:migrate

   # (Optionnel) Alimenter avec des données de test
   pnpm run db:seed
   ```

5. **Démarrer l'application**
   ```bash
   # Démarrer backend et frontend en parallèle
   pnpm run dev

   # Ou démarrer séparément :
   pnpm run dev:backend    # Backend sur http://localhost:3000
   pnpm run dev:frontend   # Frontend sur http://localhost:5173
   ```

## ⚙️ Configuration

### Variables d'environnement (Backend)

Créer un fichier `.env` dans `packages/backend/` :

```env
# Serveur
PORT=3000
NODE_ENV=development

# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/library_db"
# Pour SQLite (développement) :
# DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="your-refresh-token-secret"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis (optionnel)
REDIS_URL="redis://localhost:6379"

# Email (optionnel)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Stripe (paiements)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Sécurité
BCRYPT_ROUNDS=12
CORS_ORIGIN="http://localhost:5173"

# Logs
LOG_LEVEL="info"
```

### Variables d'environnement (Frontend)

Créer un fichier `.env` dans `packages/frontend/` :

```env
VITE_API_BASE_URL="http://localhost:3000"
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## 🎯 Utilisation

### Démarrage rapide

```bash
# Installation complète
pnpm install

# Configuration de la base de données
pnpm run db:migrate
pnpm run db:seed

# Démarrage
pnpm run dev
```

### Scripts disponibles

```bash
# Développement
pnpm run dev              # Backend + Frontend en parallèle
pnpm run dev:backend      # Backend uniquement
pnpm run dev:frontend     # Frontend uniquement

# Build
pnpm run build            # Build backend + frontend
pnpm run build:backend    # Build backend uniquement
pnpm run build:frontend   # Build frontend uniquement

# Tests
pnpm run test             # Tests backend + frontend
pnpm run test:backend     # Tests backend
pnpm run test:frontend    # Tests frontend

# Base de données
pnpm run db:migrate       # Appliquer les migrations
pnpm run db:push          # Push du schéma (développement)
pnpm run db:reset         # Reset complet de la DB
pnpm run db:seed          # Alimenter avec des données de test
pnpm run db:studio        # Interface graphique Prisma Studio
pnpm run db:generate      # Générer le client Prisma

# Qualité du code
pnpm run lint             # Linting
pnpm run lint:fix         # Correction automatique du linting
pnpm run typecheck        # Vérification des types TypeScript

# Production
pnpm run start:backend    # Démarrer le backend en production
```

### Endpoints API principaux

| Endpoint | Méthode | Description | Authentification |
|----------|---------|-------------|------------------|
| `/api/auth/login` | POST | Connexion utilisateur | Non |
| `/api/auth/register` | POST | Inscription | Non |
| `/api/books` | GET | Lister les livres | Non |
| `/api/books/{id}` | GET | Détails d'un livre | Non |
| `/api/books` | POST | Créer un livre | Admin |
| `/api/cart` | GET | Voir le panier | Utilisateur |
| `/api/cart/items` | POST | Ajouter au panier | Utilisateur |
| `/api/orders` | POST | Créer une commande | Utilisateur |
| `/api/orders` | GET | Historique des commandes | Utilisateur |
| `/api/reviews` | POST | Laisser un avis | Utilisateur |

## 📚 Documentation API

La documentation complète de l'API est disponible via Swagger UI :

- **URL** : `http://localhost:3000/api-docs`
- **Format** : OpenAPI 3.0
- **Authentification** : Support du Bearer Token

### Exemple d'utilisation de l'API

```bash
# 1. Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# 2. Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# 3. Lister les livres
curl -X GET "http://localhost:3000/api/books?page=1&limit=10"

# 4. Ajouter au panier (avec token)
curl -X POST http://localhost:3000/api/cart/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": "book-uuid",
    "quantity": 1
  }'
```

## 🧪 Tests

```bash
# Tests unitaires et d'intégration
pnpm run test

# Tests avec couverture
pnpm run test:coverage

# Tests en mode watch
pnpm run test:watch
```

## 🚀 Déploiement

### Préparation pour la production

1. **Build de l'application**
   ```bash
   pnpm run build
   ```

2. **Configuration production**
   ```env
   NODE_ENV=production
   DATABASE_URL="postgresql://prod-url"
   REDIS_URL="redis://prod-redis"
   ```

3. **Migration base de données**
   ```bash
   pnpm run db:migrate
   ```

### Déploiement avec Docker

```dockerfile
# Dockerfile pour le backend
FROM node:18-alpine
WORKDIR /app
COPY packages/backend/package*.json ./
RUN npm ci --only=production
COPY packages/backend/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

### Services externes requis

- **PostgreSQL** : Base de données principale
- **Redis** : Cache et sessions
- **Stripe** : Traitement des paiements
- **Service de stockage** : Images des couvertures (AWS S3, Cloudinary)

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines de contribution

- Respecter les principes Clean Architecture et DDD
- Tests unitaires pour toute nouvelle fonctionnalité
- Documentation à jour
- Code review obligatoire
- Conventional commits

## 📄 Licence

Ce projet est sous licence ISC. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrir une issue sur GitHub
- Consulter la documentation dans `/docs/`
- Contacter l'équipe de développement

---

**Développé avec ❤️ en utilisant Clean Architecture et DDD**