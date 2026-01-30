# Sprint 1 Extended Test Cases

This document contains detailed test cases for verifying the User Stories delivered in Sprint 1, following the standard QA template.

**Project:** Order Automation System  
**Sprint:** 1 (Initial Setup & Core Architecture)  
**Last Updated:** 25/01/2026

---

## 1. Feature: Authentication (SYS-01)

### TC-SYS01-01: Verify Successful Admin Login

| Field | Details |
| :--- | :--- |
| **Test Case ID** | TC-SYS01-01 |
| **Test Designed By** | Bilal Tahir |
| **Epic Name & ID** | Admin Access SYS-01 |
| **Test Design Date** | 10/12/2025 |
| **Test Priority** | High |
| **Test Executed By** | Abdul Rehman |
| **Test Title** | Verify Admin Sign In with Valid Credentials |
| **Test Executed Date** | 15/12/2025 |
| **Description** | Ensure an Admin user can successfully access the dashboard with correct credentials. |
| **Pre-conditions** | database contains admin user `admin@test.com`, status='active', email_verified=true |
| **Automated?** | No |

**Steps:**

| Step | Test Step | Test Data | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Navigate to Sign In Page | URL: `/signin` | Login form is displayed with Email and Password fields. | Login form displayed. | Pass |
| 2 | Enter Valid Email | Email: `admin@test.com` | Field accepts input without error. | Field accepted input. | Pass |
| 3 | Enter Valid Password | Password: `SecurePass123` | Field accepts hidden input. | Field accepted input. | Pass |
| 4 | Click "Sign In" Button | - | System authenticates and redirects to `/dashboard`. | Redirected to `/dashboard`. | Pass |
| 5 | Verify Dashboard Access | - | "Overview" text is visible. | "Overview" visible. | Pass |

**Post Condition:** Admin session is active. stored in local storage/cookie.

---

### TC-SYS01-02: Verify Login with Invalid Password

| Field | Details |
| :--- | :--- |
| **Test Case ID** | TC-SYS01-02 |
| **Test Designed By** | Bilal Tahir |
| **Epic Name & ID** | Admin Access SYS-01 |
| **Test Design Date** | 10/12/2025 |
| **Test Priority** | High |
| **Test Executed By** | Abdul Rehman |
| **Test Title** | Verify Error on Invalid Password |
| **Test Executed Date** | 15/12/2025 |
| **Description** | Ensure system rejects invalid passwords securely. |
| **Pre-conditions** | database contains admin user `admin@test.com` |
| **Automated?** | No |

**Steps:**

| Step | Test Step | Test Data | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Navigate to Sign In Page | URL: `/signin` | Login form is displayed. | Login form displayed. | Pass |
| 2 | Enter Valid Email & Wrong Password | Email: `admin@test.com`<br>Pass: `WrongPass` | Fields accept input. | Fields accepted input. | Pass |
| 3 | Click "Sign In" Button | - | System displays error message "Invalid login credentials". | Error displayed as expected. | Pass |

---

## 2. Feature: Dashboard Overview (SYS-02)

### TC-SYS02-01: Verify Sidebar Navigation

| Field | Details |
| :--- | :--- |
| **Test Case ID** | TC-SYS02-01 |
| **Test Designed By** | Mahmood-ul-hassan |
| **Epic Name & ID** | Dashboard Navigation SYS-02 |
| **Test Design Date** | 18/12/2025 |
| **Test Priority** | Medium |
| **Test Executed By** | Hafiz Muhammad Tayyab |
| **Test Title** | Verify Navigation to Orders and Drivers |
| **Test Executed Date** | 20/12/2025 |
| **Description** | Ensure the sidebar links correctly navigate to respective modules. |
| **Pre-conditions** | Admin is logged in. |
| **Automated?** | No |

**Steps:**

| Step | Test Step | Test Data | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Click "Orders" in Sidebar | - | URL changes to `/orders`. "Orders List" header visible. | URL changed. Header visible. | Pass |
| 2 | Click "Drivers" in Sidebar | - | URL changes to `/drivers`. "Fleet Management" header visible. | URL changed. Header visible. | Pass |
| 3 | Collapse Sidebar (Mobile View) | Resize to <768px | Sidebar hides behind hamburger menu. | Sidebar collapsed properly. | Pass |

---

## 3. Feature: Order Ingestion API (SYS-05)

### TC-SYS05-01: Verify Order Creation via API

| Field | Details |
| :--- | :--- |
| **Test Case ID** | TC-SYS05-01 |
| **Test Designed By** | Hafiz Muhammad Tayyab |
| **Epic Name & ID** | Order Ingestion SYS-05 |
| **Test Design Date** | 05/01/2026 |
| **Test Priority** | High |
| **Test Executed By** | Bilal Tahir |
| **Test Title** | Verify API Creates Valid Order |
| **Test Executed Date** | 08/01/2026 |
| **Description** | Ensure external systems can create orders via the REST API. |
| **Pre-conditions** | Valid API Key/Token available. |
| **Automated?** | Yes (Postman) |

**Steps:**

| Step | Test Step | Test Data | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Send POST Request to Endpoint | Endpoint: `/api/orders` | - | - | Pass |
| 2 | Include JSON Payload | Body: `{ "customer_phone": "+123", "items": [...] }` | - | - | Pass |
| 3 | Check Response | - | Status Code: **201 Created**. JSON includes `"id": "..."`. | Status 201 received. | Pass |
| 4 | Verify Database | - | New row exists in `orders` table. | Row found in DB. | Pass |

**Post Condition:** Order ID is generated and status is 'pending'.
