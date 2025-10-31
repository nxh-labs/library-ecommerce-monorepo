# C4 Model - Container Diagram

```mermaid
C4Container
    title Diagramme de Conteneurs - API Librairie E-commerce

    Person(customer, "Client", "Utilisateur final")
    Person(admin, "Administrateur", "Gestionnaire")

    Container(webClient, "Application Web React", "React, TypeScript", "Interface utilisateur pour clients et admins")
    Container(mobileClient, "Application Mobile", "React Native", "Application mobile (optionnel)")

    Container(apiGateway, "API Gateway", "Node.js, Express", "Routage des requêtes, authentification")

    Container(booksService, "Books Service", "Node.js, TypeScript, Clean Architecture", "Gestion du catalogue de livres")
    Container(usersService, "Users Service", "Node.js, TypeScript, Clean Architecture", "Gestion des utilisateurs et authentification")
    Container(ordersService, "Orders Service", "Node.js, TypeScript, Clean Architecture", "Gestion des commandes")
    Container(reviewsService, "Reviews Service", "Node.js, TypeScript, Clean Architecture", "Gestion des avis")
    Container(categoriesService, "Categories Service", "Node.js, TypeScript, Clean Architecture", "Gestion des catégories")
    Container(cartService, "Cart Service", "Node.js, TypeScript, Clean Architecture", "Gestion du panier")

    ContainerDb(postgresDb, "PostgreSQL", "Base de données principale", "Stockage des données métier")
    ContainerDb(redisCache, "Redis", "Cache et sessions", "Cache, sessions utilisateur")

    System_Ext(paymentGateway, "Passerelle de Paiement", "Stripe, PayPal")
    System_Ext(emailService, "Service Email", "SendGrid, SES")
    System_Ext(storageService, "Service de Stockage", "AWS S3")

    Rel(customer, webClient, "Utilise")
    Rel(admin, webClient, "Utilise")

    Rel(webClient, apiGateway, "API calls", "HTTPS/JSON")
    Rel(mobileClient, apiGateway, "API calls", "HTTPS/JSON")

    Rel(apiGateway, booksService, "Route requests")
    Rel(apiGateway, usersService, "Route requests")
    Rel(apiGateway, ordersService, "Route requests")
    Rel(apiGateway, reviewsService, "Route requests")
    Rel(apiGateway, categoriesService, "Route requests")
    Rel(apiGateway, cartService, "Route requests")

    Rel(booksService, postgresDb, "CRUD operations", "Prisma ORM")
    Rel(usersService, postgresDb, "CRUD operations", "Prisma ORM")
    Rel(ordersService, postgresDb, "CRUD operations", "Prisma ORM")
    Rel(reviewsService, postgresDb, "CRUD operations", "Prisma ORM")
    Rel(categoriesService, postgresDb, "CRUD operations", "Prisma ORM")
    Rel(cartService, postgresDb, "CRUD operations", "Prisma ORM")

    Rel(booksService, redisCache, "Cache queries")
    Rel(usersService, redisCache, "Store sessions")
    Rel(cartService, redisCache, "Cache cart data")

    Rel(ordersService, paymentGateway, "Process payments")
    Rel(usersService, emailService, "Send emails")
    Rel(booksService, storageService, "Store images")