# Sprint 1 Decision Table: Authentication & Access Control

This decision table models the logic for **User Sign In (SYS-01)**, which is the primary complex logic implemented in Sprint 1. It determines whether a user is granted access to the system and which dashboard view they receive.

**Feature:** Authentication (Sign In)
**System:** Order Automation Platform

## Conditions

The following conditions influence the authentication decision:

1.  **Valid Credentials (C1):** Does the email and password match the database record?
2.  **Email Verified (C2):** Has the user clicked the verification link sent to their email?
3.  **Account Active (C3):** Is the account status 'active' (not suspended/banned)?
4.  **Is Admin Role (C4):** Does the user have the 'admin' or 'dispatcher' role?

## Actions

Based on the conditions, the system will perform one of the following actions:

*   **A1: Grant Admin Access:** Log the user in and redirect to the **Admin Dashboard**.
*   **A2: Grant User Access:** Log the user in and redirect to the **User Profile/History** page.
*   **A3: Deny (Invalid Credentials):** Show "Invalid email or password" error.
*   **A4: Deny (Unverified):** Show "Please verify your email" error.
*   **A5: Deny (Suspended):** Show "Account suspended. Contact support."

## Decision Table

| Rule ID | C1: Creds Valid? | C2: Email Verified? | C3: Account Active? | C4: Is Admin? | **Action Taken** | **Logic / Rationale** |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **R1** | No | - | - | - | **A3** (Deny - Invalid) | Security First: If password fails, nothing else matters. |
| **R2** | Yes | No | - | - | **A4** (Deny - Limit) | Users must verify email before accessing the system to prevent spam. |
| **R3** | Yes | Yes | No | - | **A5** (Deny - Suspended) | Valid credentials but banned account = No access. |
| **R4** | Yes | Yes | Yes | No | **A2** (Grant User) | Standard user login (e.g., Driver or Customer) -> Standard View. |
| **R5** | Yes | Yes | Yes | Yes | **A1** (Grant Admin) | Admin user login -> Management Dashboard. |

---

## Combinations Expansion (for Testing)

This table ensures all logical paths are covered by QA test cases.

| Test Case | Creds Match | Verified | Active | Role | Expected Result |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **TC-AUTH-01** | Yes | Yes | Yes | Admin | **Login Success (Admin Dashboard)** |
| **TC-AUTH-02** | Yes | Yes | Yes | User | **Login Success (User Profile)** |
| **TC-AUTH-03** | Yes | Yes | No | User | **Error: Account Suspended** |
| **TC-AUTH-04** | Yes | No | Yes | User | **Error: Email Not Verified** |
| **TC-AUTH-05** | No | Yes | Yes | User | **Error: Invalid Credentials** |
| **TC-AUTH-06** | No | Data is irrelevant | - | - | **Error: Invalid Credentials** |
