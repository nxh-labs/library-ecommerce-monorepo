# ADR 003: Choix du système d'authentification

## Status
Accepted

## Context
Nous devons implémenter un système d'authentification sécurisé pour notre API e-commerce avec gestion des utilisateurs, rôles et autorisations.

## Decision
Utiliser JWT (JSON Web Tokens) pour l'authentification avec refresh tokens.

## Rationale
- Stateless : pas de stockage côté serveur des sessions
- Sécurisé avec signature cryptographique
- Support des claims personnalisés pour rôles et permissions
- Compatible avec les architectures distribuées
- Standard largement adopté et supporté
- Refresh tokens pour sécurité accrue et gestion de l'expiration

## Consequences
- Nécessite une gestion côté client des tokens
- Vulnérable au vol de tokens (nécessite HTTPS obligatoire)
- Complexité accrue pour la révocation des tokens
- Implémentation de refresh token mechanism