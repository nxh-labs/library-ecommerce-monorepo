# ADR 002: Choix de l'ORM

## Status
Accepted

## Context
Nous devons choisir un ORM pour interagir avec PostgreSQL dans notre architecture Clean Architecture + DDD.

## Decision
Utiliser Prisma comme ORM principal.

## Rationale
- Type-safety complète avec génération automatique de types TypeScript
- Migration system robuste et versionné
- Support des relations complexes et des transactions
- Performance optimisée avec query batching
- Intégration parfaite avec Clean Architecture (séparation claire des couches)
- Schema-first approach qui s'aligne avec DDD

## Consequences
- Courbe d'apprentissage pour l'équipe
- Dépendance à un outil spécifique
- Nécessite la maintenance du schéma Prisma