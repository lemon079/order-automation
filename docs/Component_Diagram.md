# C4 Component Diagram (Level 3)

This diagram "zooms in" to the **API Application** container. It shows the internal components that make up the backend logic, their responsibilities, and how they interact with each other and external systems.

```mermaid
graph TD
    %% Boundary: API Container
    subgraph "API Application (Next.js Serverless)"
        %% Controllers (Entry Points)
        WebhookCtrl[Webhook Controller<br/>(Next.js Route Handler)]
        OrderCtrl[Order Config Controller<br/>(TRPC Router)]
        
        %% Components (Business Logic)
        OrderService[Order Service<br/>(TypeScript Class)]
        AIService[AI Integration Service<br/>(LangChain Wrapper)]
        RiskEngine[Risk & Safety Engine<br/>(Business Logic Component)]
        DriverMatcher[Driver Matching Service<br/>(Algorithm Component)]
        
        %% Data Access
        OrderRepo[Order Repository<br/>(Prisma/Supabase Client)]
        DriverRepo[Driver Repository<br/>(Prisma/Supabase Client)]
    end

    %% External Containers/Systems
    Twilio[Twilio Platform]
    Gemini[Google Gemini AI]
    DB[(Supabase Database)]
    Maps[Google Maps API]
    WebApp[Web Dashboard]

    %% Relationships
    Twilio -- "1. Sends Webhook (JSON)" --> WebhookCtrl
    WebApp -- "2. Manages Orders (TRPC)" --> OrderCtrl

    WebhookCtrl -- "3. Parses Input" --> OrderService
    OrderCtrl -- "3. Updates Config" --> OrderService

    OrderService -- "4. Request Extraction" --> AIService
    AIService -- "5. Prompt LLM" --> Gemini
    Gemini -- "6. Return JSON" --> AIService
    
    OrderService -- "7. Validate Safety" --> RiskEngine
    OrderService -- "8. Find Driver" --> DriverMatcher
    
    DriverMatcher -- "9. Get Distance" --> Maps
    
    OrderService -- "10. Persist Data" --> OrderRepo
    DriverMatcher -- "11. Query Availability" --> DriverRepo
    
    OrderRepo -- "12. SQL Read/Write" --> DB
    DriverRepo -- "12. SQL Read/Write" --> DB

    %% Styling
    style WebhookCtrl fill:#85C1E9,stroke:#3498DB,color:#000
    style OrderCtrl fill:#85C1E9,stroke:#3498DB,color:#000
    style OrderService fill:#85C1E9,stroke:#3498DB,color:#000
    style AIService fill:#85C1E9,stroke:#3498DB,color:#000
    style RiskEngine fill:#85C1E9,stroke:#3498DB,color:#000
    style DriverMatcher fill:#85C1E9,stroke:#3498DB,color:#000
    style OrderRepo fill:#85C1E9,stroke:#3498DB,color:#000
    style DriverRepo fill:#85C1E9,stroke:#3498DB,color:#000
    
    style Twilio fill:#999999,stroke:#666666,color:#fff
    style Gemini fill:#999999,stroke:#666666,color:#fff
    style DB fill:#55efc4,stroke:#00b894,color:#000
    style Maps fill:#999999,stroke:#666666,color:#fff
    style WebApp fill:#74b9ff,stroke:#0984e3,color:#fff
```

### Component Descriptions

*   **Webhook Controller**: The entry point for incoming HTTP requests from Twilio (WhatsApp/Voice). It validates signatures and routes the raw payload.
*   **Order Service**: The central coordinator. It manages the lifecycle of an order draft, ensuring it moves from "Extraction" to "Validation" to "Assignment".
*   **AI Integration Service**: Encapsulates all interactions with the LLM (Google Gemini). It handles prompt engineering, retry logic, and JSON parsing.
*   **Risk & Safety Engine**: Specific to the pharmacy/medical niche. It checks for restricted items or high-risk locations before allowing an order to proceed.
*   **Driver Matching Service**: The logic that selects the best rider. It balances distance (via Google Maps) with fairness (driver queue position).
*   **Repositories (Order/Driver)**: The data access layer. Abstracts the database queries (SQL/Supabase) from the business logic.
