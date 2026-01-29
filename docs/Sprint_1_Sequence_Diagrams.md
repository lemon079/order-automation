# Sprint 1 Sequence Diagrams

This document outlines the interaction flows for the User Stories implemented in Sprint 1.

## SYS-01: Admin Sign In
**As an Admin, I can sign in securely so that I can access the management dashboard.**

```mermaid
sequenceDiagram
    actor Admin
    participant UI as Login Page
    participant Auth as Supabase Auth
    participant DB as Database
    participant Router as Next.js Router

    Admin->>UI: Enters Email & Password
    UI->>Auth: signInWithPassword(email, password)
    Auth->>DB: Verify Credentials
    DB-->>Auth: Valid / Invalid
    
    alt Credentials Valid
        Auth-->>UI: Session Token (JWT)
        UI->>Router: Redirect to /dashboard
        Router-->>Admin: Show Dashboard
    else Invalid Credentials
        Auth-->>UI: Error Message
        UI-->>Admin: Show "Invalid Login"
    end
```

## SYS-02: Dashboard Overview
**As an Admin, I can view a dashboard overview so that I can navigate to different sections.**

```mermaid
sequenceDiagram
    actor Admin
    participant Dashboard as Dashboard UI
    participant Middleware as Auth Middleware
    participant API as Dashboard Service
    participant DB as Database

    Admin->>Dashboard: Access /dashboard
    Dashboard->>Middleware: Check Session
    
    alt Session Valid
        Middleware-->>Dashboard: Allow Access
        Dashboard->>API: fetchStats()
        API->>DB: Count Orders, Drivers
        DB-->>API: { orders: 150, drivers: 12 }
        API-->>Dashboard: Return Data
        Dashboard-->>Admin: Display Stats & Charts
    else Session Invalid
        Middleware-->>Admin: Redirect to /signin
    end
```

## SYS-03: Profile Management
**As a User, I can manage my profile settings so that my information is up to date.**

```mermaid
sequenceDiagram
    actor User
    participant ProfileUI as Profile Page
    participant API as Profile API / Server Action
    participant Storage as Supabase Storage
    participant DB as Database

    User->>ProfileUI: Click "Edit Profile"
    User->>ProfileUI: Upload New Avatar
    ProfileUI->>Storage: Upload File (image)
    Storage-->>ProfileUI: Return Public URL
    
    User->>ProfileUI: Update Bio & Name
    ProfileUI->>API: updateProfile(id, data, avatarUrl)
    API->>DB: UPDATE profiles SET ...
    DB-->>API: Success
    API-->>ProfileUI: Updated Profile Object
    ProfileUI-->>User: Show "Saved Successfully" Toast
```

## SYS-05: external Order Ingestion
**As a System, I can ingest order data from external sources so that the system works end-to-end.**

```mermaid
sequenceDiagram
    participant Source as External Source (Postman/Script)
    participant API as /api/orders
    participant Validator as Zod Schema
    participant DB as Database
    participant Admin as Admin Dashboard

    Source->>API: POST /api/orders (JSON payload)
    API->>Validator: Validate Data Structure
    
    alt Data Valid
        Validator-->>API: Validated Data
        API->>DB: INSERT INTO orders
        DB-->>API: Order Created (ID: 123)
        API-->>Source: 201 Created { id: 123 }
        
        Note right of DB: Real-time Subscription triggers
        DB->>Admin: New Order Notification
    else Validation Failed
        Validator-->>API: Error (Missing Fields)
        API-->>Source: 400 Bad Request
    end
```

> **Note on SYS-04 (Database Schema):**
> User Story SYS-04 refers to the structural setup of the database (Table creation, RLS policies). This is best represented by the ERD or Class Diagram and does not have a runtime sequence flow closer than "Dev runs migration -> DB applies changes".
