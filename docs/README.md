# 📚 Documentation du Projet

Bienvenue dans la documentation complète du projet **API Librairie E-commerce**. Cette documentation couvre tous les aspects techniques, architecturaux et opérationnels du système.

## 📋 Table des matières

### 🏗️ Architecture & Design
- [Vue d'ensemble de l'architecture](architecture-overview.md) - Clean Architecture + DDD
- [Patterns de conception utilisés](design-patterns.md) - Repository, Factory, Strategy, etc.
- [Décisions architecturales](security-performance.md) - Sécurité et performance

### 📊 Modèles de données
- [Structure des DTOs](dtos-structure.md) - Interfaces de transfert de données
- [Interfaces des repositories](repositories-interfaces.md) - Contrats d'accès aux données
- [Interfaces des use cases](use-cases-interfaces.md) - Contrats des cas d'usage

### 🎯 API & Intégration
- [Spécification OpenAPI](api-specification.md) - Documentation complète de l'API REST
- [ADR (Architecture Decision Records)](adr/) - Décisions architecturales justifiées

### 📈 Diagrammes & Visualisations
- [Diagrammes C4](diagrams/c4-context-diagram.md) - Architecture système
- [Diagramme ERD](diagrams/erd-diagram.md) - Modèle de données
- [Diagrammes de séquence](diagrams/sequence-user-authentication.md) - Flux métier

## 🚀 Démarrage rapide

1. **Lire le README principal** : [`../README.md`](../README.md)
2. **Comprendre l'architecture** : [architecture-overview.md](architecture-overview.md)
3. **Explorer l'API** : [api-specification.md](api-specification.md)
4. **Consulter les diagrammes** : [diagrams/](diagrams/)

## 📁 Structure de la documentation

```
docs/
├── README.md                           # Cette page
├── architecture-overview.md           # Vue d'ensemble architecture
├── design-patterns.md                 # Patterns utilisés
├── security-performance.md            # Sécurité et performance
├── dtos-structure.md                  # DTOs
├── repositories-interfaces.md         # Interfaces repositories
├── use-cases-interfaces.md            # Interfaces use cases
├── api-specification.md               # Spécification API
├── adr/                               # Architecture Decision Records
│   ├── 001-database-choice.md
│   ├── 002-orm-choice.md
│   ├── 003-authentication-choice.md
│   ├── 004-clean-architecture-implementation.md
│   └── 005-ddd-bounded-contexts.md
└── diagrams/                          # Diagrammes visuels
    ├── c4-context-diagram.md
    ├── c4-container-diagram.md
    ├── c4-component-diagram.md
    ├── erd-diagram.md
    ├── sequence-order-creation.md
    └── sequence-user-authentication.md
```

## 🎯 Points d'entrée recommandés

### Pour les développeurs
1. **[README principal](../README.md)** - Installation et configuration
2. **[Architecture overview](architecture-overview.md)** - Comprendre la structure
3. **[API Specification](api-specification.md)** - Utiliser l'API
4. **[ADR](adr/)** - Comprendre les décisions

### Pour les architectes
1. **[Design patterns](design-patterns.md)** - Patterns utilisés
2. **[Security & Performance](security-performance.md)** - Aspects non-fonctionnels
3. **[C4 Diagrams](diagrams/)** - Architecture visuelle
4. **[ADR](adr/)** - Décisions architecturales

### Pour les QA/Testeurs
1. **[API Specification](api-specification.md)** - Contrats d'interface
2. **[DTOs Structure](dtos-structure.md)** - Formats de données
3. **[Use Cases](use-cases-interfaces.md)** - Scénarios métier

## 🔗 Liens importants

- **Repository GitHub** : [lien-vers-repo]
- **Documentation API interactive** : `http://localhost:3000/api-docs`
- **Interface frontend** : `http://localhost:5173`
- **Prisma Studio** : `pnpm run db:studio`

## 📞 Support et contribution

### Signaler un problème
- Issues GitHub pour les bugs
- Discussions GitHub pour les questions générales
- Email pour les demandes confidentielles

### Contribuer à la documentation
1. Fork le repository
2. Créer une branche `docs/ma-contribution`
3. Faire vos modifications
4. Ouvrir une Pull Request

### Guidelines de contribution
- Respecter la structure existante
- Maintenir la cohérence du style
- Vérifier les liens et références
- Tester les exemples de code

## 📈 Métriques et monitoring

### Métriques applicatives
- **Performance API** : Latence < 200ms (95% des requêtes)
- **Disponibilité** : SLA 99.9%
- **Taux d'erreur** : < 0.1%

### Métriques métier
- **Utilisation API** : Requêtes/minute
- **Temps de réponse** : Distribution par endpoint
- **Taux de conversion** : Commandes/utilisateurs

## 🔄 Mises à jour et versions

### Version actuelle : v1.0.0
- API REST complète
- Clean Architecture + DDD
- Authentification JWT
- Base de données PostgreSQL
- Cache Redis
- Tests unitaires et d'intégration

### Roadmap
- **v1.1.0** : GraphQL API optionnel
- **v1.2.0** : Microservices (optionnel)
- **v2.0.0** : API Gateway et service mesh

## 📋 Glossaire

### Termes techniques
- **Clean Architecture** : Architecture hexagonale avec séparation des couches
- **DDD** : Domain-Driven Design, approche centrée métier
- **Bounded Context** : Contexte métier délimité
- **Use Case** : Cas d'usage métier
- **Repository** : Pattern d'accès aux données
- **DTO** : Data Transfer Object
- **JWT** : JSON Web Token pour l'authentification

### Termes métier
- **Bounded Contexts** : Books, Users, Orders, Reviews, Categories, Cart
- **Roles** : Customer, Manager, Admin
- **Order Status** : Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Refunded

## 🎉 Remerciements

Documentation créée avec soin pour faciliter l'adoption et la maintenance du système.

---

**Dernière mise à jour** : Novembre 2025
**Version** : 1.0.0
**Auteur** : Équipe de développement