# Data Dictionary - Order Automation System

**Project:** Order Automation System  
**Last Updated:** January 2026

This document provides a detailed description of the data entities, attributes, data types, and constraints used in the Order Automation System. It serves as the single source of truth for database schema definitions.

---

## 1. Entity: `profiles`
**Purpose:** Stores extended user information for all system actors (Admin, Driver, Dispatcher) linked to the Supabase Auth `users` table.

| Attribute Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, FK (auth.users) | Primary Key, links 1:1 with Supabase Auth User ID. |
| `email` | VARCHAR(255) | Unique, Not Null | Copy of user email for easier querying. |
| `full_name` | VARCHAR(100) | Nullable | User's display name. |
| `avatar_url` | TEXT | Nullable | Public URL to the avatar image in Storage. |
| `role` | ENUM | Default 'user' | Role-based access: `admin`, `dispatcher`, `driver`, `user`. |
| `created_at` | TIMESTAMPTZ | Default NOW() | Account creation timestamp. |

---

## 2. Entity: `orders`
**Purpose:** The central entity representing a customer's delivery request.

| Attribute Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default gen_random_uuid() | Unique identifier for the order. |
| `order_number` | TEXT | Unique, Not Null | Human-readable ID (e.g., "ORD-1001"). |
| `customer_phone` | VARCHAR(20) | Not Null | Customer's contact number (link to `customers`). |
| `status` | ENUM | Default 'pending' | `pending`, `confirmed`, `assigned`, `picked_up`, `delivered`, `cancelled`. |
| `pickup_location` | JSONB | Not Null | Structured address: `{lat, lng, address_text}`. |
| `dropoff_location` | JSONB | Not Null | Structured address: `{lat, lng, address_text}`. |
| `total_amount` | DECIMAL(10,2) | Default 0.00 | Total value of the order. |
| `driver_id` | UUID | FK (`drivers.id`), Nullable | The driver currently assigned to this order. |
| `created_at` | TIMESTAMPTZ | Default NOW() | Timestamp of order ingestion. |

---

## 3. Entity: `order_items`
**Purpose:** Stores individual line items associated with a specific order.

| Attribute Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default gen_random_uuid() | Unique identifier. |
| `order_id` | UUID | FK (`orders.id`) | Foreign key linking to the parent order. |
| `quantity` | INTEGER | Not Null, Min 1 | Number of units. |
| `item_name` | TEXT | Not Null | Description or name of the product. |
| `unit_price` | DECIMAL(10,2) | Default 0.00 | Price per single unit. |

---

## 4. Entity: `order_drafts`
**Purpose:** Temporary storage for orders extracted by AI from voice notes/text before human approval.

| Attribute Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK | Unique identifier. |
| `source` | ENUM | Default 'whatsapp' | Origin: `whatsapp`, `voice_call`, `web_manual`. |
| `raw_transcript` | TEXT | Request | The original text or speech-to-text content. |
| `extracted_data` | JSONB | Not Null | The structured JSON output from Gemini AI. |
| `confidence_score`| FLOAT | 0.0 - 1.0 | AI's self-confidence score in the extraction. |
| `status` | ENUM | Default 'needs_review' | `needs_review`, `approved`, `rejected`, `auto_approved`. |

---

## 5. Entity: `drivers`
**Purpose:** Manages the fleet of delivery personnel.

| Attribute Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, FK (`profiles.id`) | Links to the user profile. |
| `license_number` | TEXT | Unique | Driver's license for verification. |
| `vehicle_type` | ENUM | Default 'bike' | `bike`, `car`, `van`. |
| `current_status` | ENUM | Default 'offline' | `online` (ready), `busy` (on job), `offline`. |
| `last_location` | GEOGRAPHY | Point | Real-time GPS coordinates (PostGIS). |

---

## 6. Entity: `call_transcripts`
**Purpose:** Logs historical voice calls processed by Twilio.

| Attribute Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `call_sid` | TEXT | PK | Unique Call ID from Twilio. |
| `recording_url` | TEXT | Not Null | URL to the audio file. |
| `transcription_text`| TEXT | Nullable | Full text transcription of the call. |
| `duration` | INTEGER | Seconds | Length of the call. |
