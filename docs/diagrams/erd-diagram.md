# Diagramme ERD - Entités et Relations

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o{ Review : writes
    User ||--o{ Cart : has
    User {
        uuid id PK
        string email UK
        string password
        string firstName
        string lastName
        string role
        datetime createdAt
        datetime updatedAt
    }

    Book ||--o{ OrderItem : contains
    Book ||--o{ Review : has
    Book ||--o{ CartItem : contains
    Book }o--|| Category : belongs_to
    Book {
        uuid id PK
        string title
        string isbn UK
        string author
        text description
        decimal price
        int stockQuantity
        string publisher
        date publicationDate
        string language
        int pageCount
        string coverImageUrl
        datetime createdAt
        datetime updatedAt
    }

    Category ||--o{ Book : contains
    Category ||--o{ Category : parent
    Category {
        uuid id PK
        string name UK
        text description
        uuid parentId FK
        datetime createdAt
        datetime updatedAt
    }

    Order ||--|{ OrderItem : contains
    Order }o--|| User : belongs_to
    Order {
        uuid id PK
        uuid userId FK
        string status
        decimal totalAmount
        string shippingAddress
        string billingAddress
        datetime orderDate
        datetime updatedAt
    }

    OrderItem }o--|| Order : belongs_to
    OrderItem }o--|| Book : references
    OrderItem {
        uuid id PK
        uuid orderId FK
        uuid bookId FK
        int quantity
        decimal unitPrice
        decimal totalPrice
    }

    Review }o--|| User : written_by
    Review }o--|| Book : about
    Review {
        uuid id PK
        uuid userId FK
        uuid bookId FK
        int rating
        text comment
        datetime createdAt
        datetime updatedAt
    }

    Cart ||--|{ CartItem : contains
    Cart }o--|| User : belongs_to
    Cart {
        uuid id PK
        uuid userId FK
        datetime createdAt
        datetime updatedAt
    }

    CartItem }o--|| Cart : belongs_to
    CartItem }o--|| Book : references
    CartItem {
        uuid id PK
        uuid cartId FK
        uuid bookId FK
        int quantity
        datetime addedAt
    }