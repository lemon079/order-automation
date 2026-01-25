# System Design Architecture

## High-Level Overview

This system is a **Voice-First Logistics Platform** designed to automate order intake via phone calls and WhatsApp, manage orders via a web dashboard, and coordinate deliveries via a driver mobile app.

```mermaid
graph TD
    subgraph "Clients"
        Web["Web Dashboard<br/>(Next.js)"]
        Mobile["Driver App<br/>(React Native)"]
        Phone[Customer Phone]
    end

    subgraph "Communication Layer"
        Twilio["Twilio<br/>(Voice & WhatsApp)"]
        Ngrok["Ngrok Tunnel<br/>(Dev Only)"]
    end

    subgraph "Backend Services"
        NextAPI["Next.js API Routes<br/>(Webhooks & CRUD)"]
        LangGraph["AI Agent<br/>(LangGraph + Gemini)"]
    end

    subgraph "Data & Auth"
        Supabase[(Supabase)]
        Auth[Supabase Auth]
        DB[PostgreSQL]
        Realtime[Realtime Events]
    end

    Phone -->|Voice/Text| Twilio
    Twilio -->|Webhook| Ngrok
    Ngrok -->|Forward| NextAPI
    
    Web -->|HTTPS| NextAPI
    Web -->|SDK| Supabase
    Mobile -->|SDK| Supabase

    NextAPI -->|Process| LangGraph
    LangGraph -->|Extract| Gemini[Google Gemini AI]
    
    NextAPI -->|Read/Write| DB
    LangGraph -->|Persist| DB
    
    Auth -->|Protect| DB
    Realtime -->|Sync| Web
    Realtime -->|Sync| Mobile
```

---

## Order Ingestion Pipeline

The core automated feature is the AI-driven order intake pipeline.

```mermaid
sequenceDiagram
    participant C as Customer
    participant T as Twilio
    participant W as Webhook (Next.js)
    participant A as AI Agent (LangGraph)
    participant D as Database

    Note over C, T: Voice Call or WhatsApp
    C->>T: "I need pickup from..."
    
    par Async Processing
        T->>W: POST /api/twilio/voice
        W->>T: TwiML (Record & Transcribe)
        C->>T: Speaks Message
        T->>W: POST /api/twilio/transcription
    and Process Message
        T->>W: POST /api/twilio/whatsapp
    end

    W->>D: Save Raw Transcript (call_transcripts)
    W->>A: Invoke Process Calls Workflow
    
    rect rgb(240, 248, 255)
        Note right of A: AI Extraction
        A->>A: Parse Text with Gemini
        A->>A: Extract: Name, Source, Dest, Items
    end
    
    A->>D: Insert Draft Order (order_drafts)
    D-->>W: Success
    
    opt Confirmation
        W->>T: Send WhatsApp Confirmation
        T->>C: "Order Received: Pickup at..."
    end
```

---

## Database Schema (Core Tables)

```mermaid
erDiagram
    users ||--o{ orders : "creates"
    drivers ||--o{ assignments : "receives"
    orders ||--o{ order_items : "contains"
    
    call_transcripts ||--o| order_drafts : "generates"
    order_drafts ||--o| orders : "promoted_to"

    orders {
        uuid id PK
        string status
        jsonb pickup_location
        jsonb dropoff_location
        string customer_name
        string customer_phone
        timestamp created_at
    }

    drivers {
        uuid id PK
        uuid user_id FK
        string name
        string vehicle_type
        boolean is_active
        jsonb current_location
    }

    call_transcripts {
        uuid id PK
        string call_sid
        text transcript
        string audio_url
        boolean processed
    }

    order_drafts {
        uuid id PK
        uuid call_transcript_id FK
        jsonb extracted_data
        float confidence_score
        string status
    }
```

---

## Monorepo Structure (Turborepo)

The project is organized as a monorepo for shared code and type safety.

- **`apps/`**
    - **`web`**: Main Next.js application (Admin Dashboard + API Webhooks).
    - **`driver`**: React Native (Expo) app for drivers.
- **`packages/`**
    - **`ui`**: Shared UI library (shadcn/ui based components).
    - **`shared`**: Shared logic, Supabase client authentication, Zod schemas, TypeScript types.
    - **`langgraph`**: AI Agent logic, separate from UI for modularity.

## Key Technologies

- **Frontend**: Next.js 15 (App Router), React, TailwindCSS, Lucide Icons.
- **Mobile**: React Native, Expo.
- **Backend**: Next.js API Routes, LangGraph, Google Gemini Pro.
- **Database**: Supabase (PostgreSQL), Supabase Auth, Row Level Security (RLS).
- **Infrastucture**: Vercel (Web deployment), Ngrok (Local development tunneling).
