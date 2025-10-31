# Diagramme de Séquence - Création de Commande

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Gateway
    participant UC as CreateOrderUseCase
    participant CartRepo as CartRepository
    participant BookRepo as BookRepository
    participant OrderRepo as OrderRepository
    participant UoW as UnitOfWork
    participant Payment as PaymentService

    C->>API: POST /orders (avec cartId)
    API->>UC: createOrder(request)

    UC->>CartRepo: getCartById(cartId)
    CartRepo-->>UC: cart

    UC->>BookRepo: getBooksByIds(bookIds)
    BookRepo-->>UC: books[]

    UC->>UC: validateStock(books, quantities)
    UC->>UC: calculateTotal(books, quantities)

    UC->>UoW: beginTransaction()

    UC->>OrderRepo: create(order)
    UC->>BookRepo: updateStock(bookIds, quantities)
    UC->>CartRepo: clearCart(cartId)

    UC->>Payment: processPayment(order, paymentInfo)
    Payment-->>UC: paymentResult

    alt payment successful
        UC->>UoW: commit()
        UC-->>API: orderCreated
        API-->>C: 201 Created
    else payment failed
        UC->>UoW: rollback()
        UC-->>API: paymentFailed
        API-->>C: 400 Bad Request
    end