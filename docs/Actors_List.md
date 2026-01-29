# System Boundary and List of Actors

## System Boundary
The **Order Automation System** encompasses the following components:
1.  **Web Dashboard**: For Dispatchers and Business Owners to manage orders and view analytics.
2.  **Driver Mobile Application**: For Delivery Riders to receive assignments and navigate.
3.  **AI Orchestration Engine**: The backend logic (hosted on Cloud) that processes natural language, manages the database, and communicates with external APIs (Twilio, Google Maps).

**External to the boundary** are the physical users (Customers, Riders, Managers) and third-party services (WhatsApp servers, Google Maps API, Twilio Gateway) which interact with the system but are not part of its internal logic.

---

## List of Actors

Below is the list of primary actors who interact with the system. Each actor corresponds to a key stakeholder identified in the project documentation.

| Actor | Description | Primary User Story |
| :--- | :--- | :--- |
| **1. Customer**<br>*(External Stakeholder)* | A person or business entity (e.g., patient, builder, diner) who places an order for delivery. They interact with the system primarily through WhatsApp or Voice calls. | *"As a Customer, I want to send a voice note with my delivery details so that I can place an order instantly without typing or waiting on hold."* |
| **2. Dispatcher**<br>*(Internal User)* | The operational staff member responsible for monitoring the automated system. They intervene only when the AI's confidence score is low or when complex exceptions arise. | *"As a Dispatcher, I want to view a prioritized list of 'Needs Review' orders so that I can quickly fix AI errors and keep the delivery flow moving."* |
| **3. Delivery Rider**<br>*(Internal User)* | The field agent who physically executes the delivery. They use the mobile app to receive "gigs" (assignments) and update the system on their progress. | *"As a Rider, I want to receive clear, optimized route instructions on my phone so that I can complete deliveries faster and earn more."* |
| **4. SME Business Owner**<br>*(Internal User)* | The strategic decision-maker who owns the logistics company (e.g., Pharmacy owner). They use reports to monitor efficiency and costs. | *"As a Business Owner, I want to see a daily dashboard of completed orders and missed opportunities so that I can optimize my fleet size and pricing."* |
| **5. System Administrator**<br>*(Maintenance)* | The technical user (or developer) responsible for configuring the system, managing API keys, and ensuring uptime. | *"As an Admin, I want to monitor API usage logs (Twilio/Gemini) so that I can detect errors early and manage operational costs."* |