# C4 Model - Context Diagram

```mermaid
C4Context
    title Diagramme de Contexte - API Librairie E-commerce

    Person(customer, "Client", "Utilisateur final achetant des livres")
    Person(admin, "Administrateur", "Gestionnaire du système")

    System(libraryApi, "API Librairie E-commerce", "API REST pour gestion de librairie en ligne")

    System_Ext(paymentGateway, "Passerelle de Paiement", "Système de paiement externe (Stripe, PayPal)")
    System_Ext(emailService, "Service Email", "Service d'envoi d'emails (SendGrid, SES)")
    System_Ext(storageService, "Service de Stockage", "Stockage des images de couverture (AWS S3, Cloudinary)")

    Rel(customer, libraryApi, "Parcourt le catalogue, gère son panier, passe des commandes, laisse des avis")
    Rel(admin, libraryApi, "Gère le catalogue, les utilisateurs, les commandes")

    Rel(libraryApi, paymentGateway, "Traite les paiements")
    Rel(libraryApi, emailService, "Envoie confirmations et notifications")
    Rel(libraryApi, storageService, "Stocke les images des livres")