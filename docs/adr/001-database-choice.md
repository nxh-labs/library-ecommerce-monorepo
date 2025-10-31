# ADR 001: Choix de la base de données

## Status
Accepted

## Context
Nous devons choisir une base de données pour notre API de librairie e-commerce. Les entités incluent Books, Users, Orders, Reviews, Categories, Cart avec des relations complexes.

## Decision
Utiliser PostgreSQL comme base de données principale.

## Rationale
- Support natif des relations complexes (foreign keys, joins)
- ACID compliance pour les transactions e-commerce
- Performance optimale pour les requêtes complexes
- Écosystème mature avec Prisma ORM
- Support des types avancés (JSON, arrays, etc.)

## Consequences
- Migration depuis d'autres bases nécessiterait des adaptations
- Coût légèrement supérieur aux bases NoSQL
- Complexité accrue pour les débutants vs MongoDB