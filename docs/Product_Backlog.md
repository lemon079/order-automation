# Product Backlog - Order Automation System

## definitions
*   **Sprint Duration:** 2 Weeks
*   **Estimation Scale:** Fibonacci Sequence (1, 2, 3, 5, 8, 13)

---

## Epic 1: Order Intake & AI Processing
**Goal:** Automate the ingestion of unstructured orders from WhatsApp/Voice and convert them into structured data.

| ID | User Story | Priority | Acceptance Criteria | Story Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **OI-01** | As a **Customer**, I can send a voice note with my delivery details to the business WhatsApp number so that I don't have to type. | High | - System accepts audio files via Twilio.<br>- Audio is transcribed to text within 10s.<br>- Transcription is stored in DB. | 5 | Pending |
| **OI-02** | As a **System**, I extract structured data (Items, Address, Name) from the raw transcript so that a draft order is created. | High | - Gemini AI correctly identifies Pickup/Dropoff.<br>- JSON output matches database schema.<br>- Confidence score is calculated. | 8 | Pending |
| **OI-03** | As a **Dispatcher**, I can view "Low Confidence" drafts in a review queue so that I can fix AI errors before dispatch. | High | - Drafts with score < 80% are flagged.<br>- "Edit Order" form pre-filled with AI data.<br>- One-click "Approve" button. | 5 | Pending |
| **OI-04** | As a **Customer**, I receive an instant "Order Received" confirmation via WhatsApp so I know my request is being processed. | Medium | - Message sent immediately after webhook trigger.<br>- Includes a unique Reference ID. | 3 | Pending |

---

## Epic 2: Driver Management & Assessment
**Goal:** Efficiently manage the fleet and assign orders based on real-time data.

| ID | User Story | Priority | Acceptance Criteria | Story Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DM-01** | As a **Rider**, I can toggle my status to "Online" or "Offline" in the app so the system knows if I am available. | High | - Toggle switch updates DB status.<br>- "Offline" riders are excluded from auto-assignment. | 2 | Pending |
| **DM-02** | As a **System**, I can calculate the distance between a Pickup location and all available riders so I can find the nearest one. | High | - Google Maps Distance Matrix API is called.<br>- Riders sorted by proximity (ETA). | 8 | Pending |
| **DM-03** | As a **Dispatcher**, I can manually override an assignment and give an order to a specific rider. | Medium | - Dropdown list of all online riders.<br>- "Force Assign" button functionality.<br>- Log entry created for the override. | 5 | Pending |

---

## Epic 3: Hyperlocal Delivery Workflow
**Goal:** Specific features for the niche (Pharmacies, Kitchens) to handle urgency and batching.

| ID | User Story | Priority | Acceptance Criteria | Story Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HD-01** | As a **System**, I can "Batch" two orders together if they are from the same Pickup location (e.g., Pharmacy) to nearby drop-offs. | High | - Logic checks for orders created within 10 mins.<br>- Checks if Dropoff B is on route to Dropoff A.<br>- Creates a "Grouped Assignment". | 13 | Pending |
| **HD-02** | As a **Rider**, I can see "Urgent" tags on medical delivery orders so I know to prioritize them over others. | High | - UI highlights medical orders in Red.<br>- "Urgent" label prominent on Order Card. | 3 | Pending |
| **HD-03** | As a **Customer**, I receive a live tracking link via WhatsApp when the rider picks up my order. | Medium | - Message triggered on "Picked Up" status.<br>- Link opens a simplified Map view. | 8 | Pending |

---

## Epic 4: Operational Reporting
**Goal:** Provide business owners with insights into their logistics performance.

| ID | User Story | Priority | Acceptance Criteria | Story Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RP-01** | As a **Business Owner**, I can see the total "Missed Orders" (rejected drafts) for the day so I can understand lost revenue. | Medium | - Dashboard card showing count of rejected/failed orders.<br>- Daily/Weekly filter toggle. | 3 | Pending |
| **RP-02** | As a **Business Owner**, I want to export a CSV of all deliveries for the week to calculate rider payouts. | Medium | - "Export" button on Orders table.<br>- CSV includes: Rider Name, Distance, Order ID, Date. | 3 | Pending |
