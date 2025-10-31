# C4 Model - Component Diagram

```mermaid
C4Component
    title Diagramme de Composants - Books Service

    Container_Boundary(booksService, "Books Service") {
        Component(booksController, "Books Controller", "Express Route Handler", "Gestion des routes REST pour les livres")
        Component(booksUseCases, "Books Use Cases", "Application Services", "Logique métier des livres")
        Component(booksRepository, "Books Repository", "Repository Interface", "Interface d'accès aux données")
        Component(booksDomain, "Books Domain", "Entities & Value Objects", "Modèle de domaine des livres")
    }

    Container_Boundary(infrastructure, "Infrastructure Layer") {
        Component(prismaRepository, "Prisma Books Repository", "Prisma Implementation", "Implémentation Prisma du repository")
        Component(cacheService, "Cache Service", "Redis Client", "Service de cache")
        Component(storageService, "Storage Service", "AWS S3 Client", "Service de stockage des images")
    }

    Rel(booksController, booksUseCases, "Exécute use cases")
    Rel(booksUseCases, booksRepository, "Accède aux données")
    Rel(booksUseCases, booksDomain, "Utilise le modèle domaine")

    Rel(booksRepository, prismaRepository, "Implémenté par")
    Rel(booksUseCases, cacheService, "Utilise pour le cache")
    Rel(booksUseCases, storageService, "Utilise pour les images")