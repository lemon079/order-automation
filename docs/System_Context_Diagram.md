# C4 System Context Diagram

This diagram provides a "big picture" view of the **Order Automation System**. It centers on the software system itself and its relationships with its users and external systems. Technical details (protocols, databases) are intentionally omitted to focus on people and interactions.

```mermaid
graph TD
    %% Central System
    System[Order Automation System<br/>(Software System)]

    %% People (Actors)
    Customer((Customer))
    Driver((Delivery Rider))
    Manager((SME Manager/Dispatcher))

    %% External Systems
    Messaging[Messaging Platform<br/>(External System)]
    AI[AI Intelligence Engine<br/>(External System)]
    Maps[Mapping Service<br/>(External System)]
    Auth[Identity Provider<br/>(External System)]

    %% Relationships: People to System
    Customer -- "Places orders via Voice/Text, Tracks delivery status" --> System
    Driver -- "Receives delivery jobs, Updates status, Views routes" --> System
    Manager -- "Reviews high-risk orders, Monitors fleet performance" --> System

    %% Relationships: System to External Systems
    System -- "Sends confirmations & alerts" --> Messaging
    Messaging -- "Forwards incoming messages" --> System
    
    System -- "Sends unstructured order text/audio" --> AI
    AI -- "Returns structured order data" --> System

    System -- "Gets travel times & address validation" --> Maps
    
    System -- "Offloads user authentication" --> Auth

    %% Styling for C4 alignment
    style System fill:#1168bd,stroke:#0b4884,color:#ffffff
    style Customer fill:#08427b,stroke:#052e56,color:#ffffff
    style Driver fill:#08427b,stroke:#052e56,color:#ffffff
    style Manager fill:#08427b,stroke:#052e56,color:#ffffff
    style Messaging fill:#999999,stroke:#666666,color:#ffffff
    style AI fill:#999999,stroke:#666666,color:#ffffff
    style Maps fill:#999999,stroke:#666666,color:#ffffff
    style Auth fill:#999999,stroke:#666666,color:#ffffff
```

### Element Descriptions

*   **Order Automation System**: The custom software solution being built. It orchestrates the order lifecycle from intake to delivery.
*   **Customer**: A user (patient, restaurant diner, builder) who interacts with the system primarily through a third-party messaging app to place orders.
*   **Delivery Rider**: A field worker who uses the system's mobile interface to accept jobs and navigate to locations.
*   **SME Manager**: The business operator who oversees order flow and resolves exceptions flagged by the system.
*   **Messaging Platform**: (e.g., WhatsApp/Twilio) The channel used for all customer communication.
*   **AI Intelligence Engine**: (e.g., Google Gemini) The component responsible for understanding natural language.
*   **Mapping Service**: (e.g., Google Maps) Provides geospatial data for routing.
