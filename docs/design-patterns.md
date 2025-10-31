# Patterns de Conception Appliqués

## Repository Pattern
**Objectif :** Abstraction de la persistance des données
- Interface uniforme pour l'accès aux données
- Séparation des préoccupations entre logique métier et persistance
- Testabilité améliorée des use cases
- Support du principe DIP (Dependency Inversion Principle)

**Implémentation :**
- Interfaces dans le layer Domain
- Implémentations dans le layer Infrastructure
- Injection via DI Container

## Factory Pattern
**Objectif :** Création d'entités et value objects complexes
- Encapsulation de la logique de construction
- Validation lors de la création
- Immutabilité garantie

**Exemples :**
- `BookFactory` pour créer des livres avec validation ISBN
- `UserFactory` pour créer des utilisateurs avec hash du mot de passe
- `OrderFactory` pour créer des commandes avec calcul des totaux

## Strategy Pattern
**Objectif :** Algorithmes interchangeables
- Calcul des prix avec différentes stratégies (TVA, remises, etc.)
- Méthodes de paiement (Stripe, PayPal, virement)
- Stratégies de livraison (standard, express, retrait)

**Implémentation :**
```typescript
interface IPricingStrategy {
  calculateTotal(items: OrderItem[]): Money;
}

class StandardPricingStrategy implements IPricingStrategy {
  calculateTotal(items: OrderItem[]): Money {
    // Logique standard
  }
}

class DiscountedPricingStrategy implements IPricingStrategy {
  calculateTotal(items: OrderItem[]): Money {
    // Logique avec remises
  }
}
```

## Observer Pattern
**Objectif :** Notifications et événements découplés
- Domain Events pour communication inter-contextes
- Notifications utilisateur (email, push)
- Intégrations externes (webhooks)

**Implémentation :**
- `DomainEvent` base class
- `EventPublisher` pour émission
- `EventHandler` pour traitement
- `EventBus` pour orchestration

## Dependency Injection
**Objectif :** Inversion de contrôle et testabilité
- Configuration centralisée des dépendances
- Mocking facile pour les tests
- Séparation des responsabilités

**Outils :**
- Awilix ou similaire pour DI Container
- Injection par constructeur
- Configuration par modules/contextes

## Unit of Work
**Objectif :** Gestion des transactions complexes
- Cohérence des données dans les opérations multi-tables
- Rollback automatique en cas d'erreur
- Optimisation des accès base de données

**Implémentation :**
- `IUnitOfWork` interface
- Transaction scopes
- Repository access within transaction
- Atomicité garantie

## Builder Pattern
**Objectif :** Construction d'objets complexes étape par étape
- API fluide pour la création
- Validation progressive
- Immutabilité

**Exemples :**
- `OrderBuilder` pour construire des commandes
- `BookBuilder` pour créer des livres avec métadonnées
- `QueryBuilder` pour les recherches complexes

## CQRS Léger
**Objectif :** Séparation lecture/écriture pour optimisation
- Modèles de lecture optimisés (sans logique métier)
- Cache intelligent des données de lecture
- Performance améliorée pour les requêtes fréquentes

**Implémentation :**
- Read Models séparés des Write Models
- Synchronisation via Domain Events
- Cache Redis pour les données de lecture

## Value Object Pattern
**Objectif :** Modélisation de concepts métier immuables
- Encapsulation de règles métier
- Égalité basée sur les valeurs, pas l'identité
- Immuabilité garantie

**Exemples :**
- `Email` : validation et normalisation
- `Money` : calculs monétaires précis
- `ISBN` : validation du format ISBN
- `Address` : structure d'adresse normalisée

## Specification Pattern
**Objectif :** Règles métier réutilisables pour les requêtes
- Composition de critères de recherche
- Logique métier dans les queries
- Testabilité des règles

**Exemples :**
- `InStockSpecification` : livres en stock
- `PriceRangeSpecification` : filtre par prix
- `CategorySpecification` : filtre par catégorie

## Result Pattern
**Objectif :** Gestion explicite des erreurs et succès
- Retour typé des opérations
- Élimination des exceptions pour les cas métier normaux
- Composition fonctionnelle

**Implémentation :**
```typescript
class Result<T> {
  static success<T>(value: T): Result<T>
  static failure(error: string): Result<T>

  isSuccess(): boolean
  isFailure(): boolean
  getValue(): T
  getError(): string
}
```

## Null Object Pattern
**Objectif :** Élimination des vérifications null explicites
- Objets par défaut pour les cas vides
- Réduction de la complexité conditionnelle
- Interface uniforme

**Exemples :**
- `EmptyCart` pour utilisateurs sans panier
- `GuestUser` pour utilisateurs non connectés
- `EmptyReviewList` pour livres sans avis