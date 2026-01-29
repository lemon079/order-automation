# System Container Diagram (C4 Level 2)

The System Container Diagram zooms into the **Order Automation System** to show the high-level technical building blocks (containers).

```mermaid
graph TD
    %% Person Nodes
    Customer[Customer]
    Driver[Delivery Rider]
    Admin[Admin/Dispatcher]

    %% System Boundary
    subgraph "Order Automation System"
        WebApp[Web Dashboard<br/>(Next.js / React)]
        MobileApp[Driver App<br/>(React Native / Expo)]
        API[API Gateway<br/>(Next.js API Routes)]
        DB[(Supabase Database<br/>PostgreSQL)]
        Worker[AI Worker Service<br/>(Background Jobs)]
    end

    %% External Systems
    Twilio[Twilio API]
    Gemini[Google Gemini API]
    Maps[Google Maps API]

    %% Relationships
    Customer -- " WhatsApp/Voice" --> Twilio
    Twilio -- "Webhook (HTTPS)" --> API
    
    Admin -- "Uses (HTTPS)" --> WebApp
    Driver -- "Uses (HTTPS)" --> MobileApp

    WebApp -- "JSON/HTTPS" --> API
    MobileApp -- "JSON/HTTPS" --> API
    
    API -- "Read/Write" --> DB
    API -- "Prompt (HTTPS)" --> Gemini
    API -- "Geocode (HTTPS)" --> Maps
    
    Worker -- "Polls/Triggers" --> DB
    Worker -- "Process Tasks" --> Gemini

    %% Styles
    style WebApp fill:#74b9ff,stroke:#000
    style MobileApp fill:#74b9ff,stroke:#000
    style API fill:#a29bfe,stroke:#000
    style DB fill:#55efc4,stroke:#000
    style Worker fill:#a29bfe,stroke:#000
```
