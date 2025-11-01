# Spécification API OpenAPI

## Vue d'ensemble

Cette documentation présente la spécification complète de l'API REST de la librairie e-commerce, générée automatiquement à partir des annotations Swagger dans le code source.

## Accès à la documentation interactive

La documentation interactive Swagger UI est disponible à l'adresse :
- **URL** : `http://localhost:3000/api-docs`
- **Format** : OpenAPI 3.0
- **Authentification** : Support du Bearer Token JWT

## Schéma OpenAPI 3.0

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Library E-commerce API",
    "version": "1.0.0",
    "description": "API pour une plateforme de commerce électronique de bibliothèque avec gestion des livres, utilisateurs, commandes et paniers."
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Serveur de développement"
    }
  ],
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "example": "uuid" },
          "email": { "type": "string", "format": "email", "example": "user@example.com" },
          "firstName": { "type": "string", "example": "John" },
          "lastName": { "type": "string", "example": "Doe" },
          "role": { "type": "string", "enum": ["CUSTOMER", "MANAGER", "ADMIN"], "example": "CUSTOMER" },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" },
          "lastLoginAt": { "type": "string", "format": "date-time" }
        }
      },
      "Book": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "example": "uuid" },
          "title": { "type": "string", "example": "Le Petit Prince" },
          "isbn": { "type": "string", "example": "978-2-07-040850-4" },
          "author": { "type": "string", "example": "Antoine de Saint-Exupéry" },
          "description": { "type": "string", "example": "Un conte philosophique..." },
          "price": { "type": "number", "format": "float", "example": 15.99 },
          "stockQuantity": { "type": "integer", "example": 100 },
          "publisher": { "type": "string", "example": "Gallimard" },
          "publicationDate": { "type": "string", "format": "date", "example": "1943-04-06" },
          "language": { "type": "string", "example": "fr" },
          "pageCount": { "type": "integer", "example": 96 },
          "coverImageUrl": { "type": "string", "format": "uri", "example": "https://example.com/cover.jpg" },
          "categoryId": { "type": "string", "example": "uuid" },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        }
      },
      "Category": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "example": "uuid" },
          "name": { "type": "string", "example": "Fiction" },
          "description": { "type": "string", "example": "Livres de fiction" },
          "parentId": { "type": "string", "example": "uuid" },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        }
      },
      "Order": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "example": "uuid" },
          "userId": { "type": "string", "example": "uuid" },
          "status": { "type": "string", "enum": ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"], "example": "PENDING" },
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "bookId": { "type": "string", "example": "uuid" },
                "quantity": { "type": "integer", "example": 2 },
                "unitPrice": { "type": "number", "format": "float", "example": 15.99 },
                "totalPrice": { "type": "number", "format": "float", "example": 31.98 }
              }
            }
          },
          "shippingAddress": { "type": "string", "example": "123 Rue de la Paix, Paris" },
          "billingAddress": { "type": "string", "example": "123 Rue de la Paix, Paris" },
          "totalAmount": { "type": "number", "format": "float", "example": 31.98 },
          "orderDate": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        }
      },
      "Cart": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "example": "uuid" },
          "userId": { "type": "string", "example": "uuid" },
          "items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": { "type": "string", "example": "uuid" },
                "bookId": { "type": "string", "example": "uuid" },
                "quantity": { "type": "integer", "example": 2 },
                "addedAt": { "type": "string", "format": "date-time" }
              }
            }
          },
          "totalItems": { "type": "integer", "example": 3 },
          "estimatedTotalPrice": { "type": "number", "format": "float", "example": 47.97 },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        }
      },
      "Review": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "example": "uuid" },
          "userId": { "type": "string", "example": "uuid" },
          "bookId": { "type": "string", "example": "uuid" },
          "rating": { "type": "integer", "minimum": 1, "maximum": 5, "example": 4 },
          "comment": { "type": "string", "example": "Excellent livre !" },
          "createdAt": { "type": "string", "format": "date-time" },
          "updatedAt": { "type": "string", "format": "date-time" }
        }
      },
      "Error": {
        "type": "object",
        "properties": {
          "error": { "type": "string", "example": "Validation Error" },
          "message": { "type": "string", "example": "Détails de l'erreur" }
        }
      }
    }
  },
  "security": [
    {
      "bearerAuth": []
    }
  ]
}
```

## Endpoints principaux

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/refresh` - Rafraîchir le token
- `POST /api/auth/validate` - Valider le token
- `POST /api/auth/logout` - Déconnexion

### Livres
- `GET /api/books` - Lister les livres
- `GET /api/books/search` - Rechercher des livres
- `GET /api/books/{id}` - Détails d'un livre
- `POST /api/books` - Créer un livre (Admin)
- `PUT /api/books/{id}` - Mettre à jour un livre (Admin)
- `DELETE /api/books/{id}` - Supprimer un livre (Admin)
- `PATCH /api/books/{id}/stock` - Mettre à jour le stock (Admin)

### Utilisateurs
- `POST /api/users/register` - Inscription
- `GET /api/users/me` - Profil utilisateur
- `PUT /api/users/me` - Mettre à jour le profil
- `PUT /api/users/me/password` - Changer le mot de passe
- `GET /api/users` - Lister les utilisateurs (Admin)
- `GET /api/users/{id}` - Détails utilisateur (Admin)
- `DELETE /api/users/{id}` - Supprimer un utilisateur (Admin)

### Catégories
- `GET /api/categories` - Lister les catégories
- `GET /api/categories/hierarchy` - Hiérarchie des catégories
- `GET /api/categories/{id}` - Détails d'une catégorie
- `POST /api/categories` - Créer une catégorie (Admin)
- `PUT /api/categories/{id}` - Mettre à jour une catégorie (Admin)
- `DELETE /api/categories/{id}` - Supprimer une catégorie (Admin)

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Historique des commandes
- `GET /api/orders/{id}` - Détails d'une commande
- `PUT /api/orders/{id}/address` - Mettre à jour l'adresse
- `PUT /api/orders/{id}/status` - Changer le statut (Admin)

### Panier
- `GET /api/cart` - Voir le panier
- `GET /api/cart/summary` - Résumé du panier
- `POST /api/cart/items` - Ajouter au panier
- `PUT /api/cart/items/{itemId}` - Modifier quantité
- `DELETE /api/cart/items/{bookId}` - Retirer du panier
- `DELETE /api/cart` - Vider le panier

### Avis
- `GET /api/reviews/book/{bookId}` - Avis d'un livre
- `GET /api/reviews/book/{bookId}/rating` - Note moyenne
- `GET /api/reviews/{id}` - Détails d'un avis
- `POST /api/reviews` - Créer un avis
- `PUT /api/reviews/{id}` - Modifier un avis
- `DELETE /api/reviews/{id}` - Supprimer un avis
- `GET /api/reviews/user/reviews` - Avis de l'utilisateur

## Authentification

Tous les endpoints nécessitant une authentification utilisent le schéma Bearer Token JWT. Incluez le header suivant dans vos requêtes :

```
Authorization: Bearer <your-jwt-token>
```

## Codes de statut HTTP

- `200` - Succès
- `201` - Créé
- `204` - Aucun contenu (suppressions)
- `400` - Requête invalide
- `401` - Non autorisé
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `409` - Conflit (ressource existante)
- `422` - Erreur de validation
- `429` - Trop de requêtes
- `500` - Erreur serveur

## Pagination

Les endpoints de listage supportent la pagination via les paramètres query :

- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10, max: 100)
- `sortBy` : Champ de tri
- `sortOrder` : Ordre de tri (`asc` ou `desc`)

## Filtres et recherche

### Livres
- `categoryId` : Filtrer par catégorie
- `minPrice` / `maxPrice` : Filtre par prix
- `inStock` : Livres en stock uniquement
- `query` : Recherche textuelle (titre, auteur, description)

### Commandes
- `status` : Filtrer par statut
- `dateFrom` / `dateTo` : Filtre par période

### Avis
- `rating` : Filtrer par note

## Limites et quotas

- **Rate limiting** : 100 requêtes/minute par IP, 1000/minute par utilisateur authentifié
- **Taille maximale** : 10MB par requête
- **Timeout** : 30 secondes par requête

## Gestion des erreurs

Toutes les erreurs suivent ce format :

```json
{
  "error": "ErrorType",
  "message": "Description détaillée de l'erreur"
}
```

## Webhooks (futur)

L'API supportera les webhooks pour :
- Notifications de commandes
- Mises à jour de stock
- Nouveaux avis
- Changements de statut

## Versionnement

L'API utilise le versionnement via l'URL :
- Version actuelle : `v1` (implicite dans `/api/`)
- Versions futures : `/api/v2/endpoint`

## Support et contact

Pour toute question concernant l'API :
- Documentation interactive : `http://localhost:3000/api-docs`
- Issues GitHub : [Créer une issue](https://github.com/username/repo/issues)
- Email : contact@library-api.com