# Sprint 1 Class Diagram

This diagram represents the classes and relationships derived from the User Stories (SYS-01 to SYS-05) and Tasks (S1-1 to S1-12) identified in the Sprint 1 Planning.

```mermaid
classDiagram
    %% Core User & Auth
    class User {
        +UUID id
        +String email
        +String password_hash
        +String role
        +DateTime created_at
        +signUp()
        +signIn()
        +signOut()
    }

    class Profile {
        +UUID id
        +UUID user_id
        +String first_name
        +String last_name
        +String avatar_url
        +String bio
        +updateProfile()
        +uploadAvatar()
    }

    %% Order Management (Core Domain)
    class Order {
        +UUID id
        +String status
        +String customer_phone
        +JSON pickup_location
        +JSON dropoff_location
        +Float total_amount
        +DateTime created_at
        +createOrder()
        +updateStatus()
        +assignDriver()
    }

    class OrderItem {
        +UUID id
        +UUID order_id
        +String item_name
        +Integer quantity
        +Float price
    }

    %% Admin/Dashboard Context
    class DashboardService {
        +getStats()
        +getRecentOrders()
        +getActiveDrivers()
    }

    %% Driver Management (Basic Structure)
    class Driver {
        +UUID id
        +UUID user_id
        +String status
        +JSON current_location
        +toggleStatus()
    }

    %% Relationships
    User "1" -- "1" Profile : has
    User "1" -- "0..1" Driver : is_a
    User "1" -- "*" Order : manages (as Admin)
    Driver "1" -- "*" Order : delivers
    Order "1" *-- "*" OrderItem : contains
    DashboardService ..> Order : fetches
    DashboardService ..> User : authenticates
```

## Key Entities Description

1.  **User**: Represents the central actor (Admin, Dispatcher, Driver). Handles authentication logic (S1-1, S1-2).
2.  **Profile**: Stores extended user information like bio and avatar, separate from the core auth credentials (S1-5, S1-6).
3.  **Order**: The core business entity. Even though full order processing is later, the schema and basic ingestion are part of Sprint 1 (SYS-05, S1-6).
4.  **Driver**: Initial structure required for the database schema setup in Sprint 1, linked to Users.
5.  **DashboardService**: Represents the collection of API logic connecting the backend to the Dashboard UI (S1-4).
