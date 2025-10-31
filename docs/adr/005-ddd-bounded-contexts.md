# ADR 005: Définition des Bounded Contexts DDD

## Status
Accepted

## Context
Nous devons définir les bounded contexts pour notre domaine e-commerce de librairie selon les principes DDD.

## Decision
Définir les bounded contexts suivants :
- Books : Gestion du catalogue de livres
- Users : Gestion des utilisateurs et profils
- Orders : Gestion des commandes et paiements
- Reviews : Gestion des avis et notations
- Categories : Gestion des catégories de livres
- Cart : Gestion du panier d'achat

## Rationale
- Séparation claire des responsabilités métier
- Évolution indépendante des contextes
- Ubiquitous Language spécifique à chaque contexte
- Réduction de la complexité cognitive
- Support des microservices futurs si nécessaire
- Alignement avec les entités métier identifiées

## Consequences
- Interfaces de communication entre contextes nécessaires
- Gestion des transactions distribuées
- Synchronisation des données entre contextes
- Complexité accrue pour les requêtes cross-contextes