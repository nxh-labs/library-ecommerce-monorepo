# Diagramme de Séquence - Authentification Utilisateur

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Gateway
    participant AuthCtrl as AuthController
    participant AuthUC as AuthenticateUserUseCase
    participant UserRepo as UserRepository
    participant JWT as JWTService
    participant Hash as PasswordHasher

    C->>API: POST /auth/login (email, password)
    API->>AuthCtrl: login(request)

    AuthCtrl->>AuthUC: execute(email, password)

    AuthUC->>UserRepo: findByEmail(email)
    UserRepo-->>AuthUC: user

    alt user not found
        AuthUC-->>AuthCtrl: UserNotFoundError
        AuthCtrl-->>API: 401 Unauthorized
        API-->>C: Invalid credentials
    end

    AuthUC->>Hash: verify(password, user.hashedPassword)
    Hash-->>AuthUC: isValid

    alt password invalid
        AuthUC-->>AuthCtrl: InvalidPasswordError
        AuthCtrl-->>API: 401 Unauthorized
        API-->>C: Invalid credentials
    end

    AuthUC->>JWT: generateAccessToken(user)
    AuthUC->>JWT: generateRefreshToken(user)

    AuthUC-->>AuthCtrl: {accessToken, refreshToken, user}
    AuthCtrl-->>API: 200 OK with tokens
    API-->>C: tokens + user info