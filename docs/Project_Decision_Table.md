# Decision Table: AI Order Processing & Auto-Approval

This decision table models the complex logic used to determine how the system handles incoming Voice Note orders processed by the AI Agent.

**Feature:** Order Automation (AI Extraction)  
**Scenario:** Handling a new voice note order request from WhatsApp.

## Conditions

The following four factors (conditions) influence the system's decision:

1.  **Transcript Generated (C1):** Was the voice-to-text transcription successful?
2.  **Customer Allowed (C2):** Is the customer account active and not blacklisted?
3.  **High Confidence Score (C3):** Is the AI extraction confidence score >= 85%?
4.  **Critical Data Present (C4):** Are all mandatory fields (Address, Phone, Items) extracted without errors?

## Actions

Based on the conditions, the system will perform one of the following actions:

*   **A1: Auto-Create Order:** Directly create a confirmed order in the database (Zero-touch).
*   **A2: Create Draft for Review:** Create a draft entry and flag for human dispatcher reviews.
*   **A3: Auto-Reject/Block:** Immediately reject the request and notify the user or log security alert.
*   **A4: Log Technical Error:** Log the failure for developer investigation.

## Decision Table

| Rule ID | C1: Transcript Generated? | C2: Customer Allowed? | C3: High Confidence? | C4: Critical Data Present? | **Action Taken** | **Logic / Rationale** |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **R1** | No | - | - | - | **A4** (Log Error) | If audio fails to transcribe, we cannot proceed. Logic stops. |
| **R2** | Yes | No | - | - | **A3** (Reject/Block) | Blacklisted or suspended users are blocked immediately regardless of content. |
| **R3** | Yes | Yes | No | - | **A2** (Draft Review) | Setup valid, but AI is unsure (Low score). Human review required. |
| **R4** | Yes | Yes | Yes | No | **A2** (Draft Review) | AI is confident, but required fields (e.g., location) are missing. Human must fill gaps. |
| **R5** | Yes | Yes | Yes | Yes | **A1** (Auto-Create) | **Happy Path:** Valid user, high confidence, full data. instant automation. |

---

## Combinations Expansion (for Testing)

For QA purposes, here is the full expansion of the logic for the "Transcript: Yes" & "Customer: Yes" subset to ensure coverage.

| Case ID | Transcript? | Customer OK? | High Score? | Data Complete? | Expected Outcome |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **TC-01** | Yes | Yes | Yes | Yes | **Auto-Approve** |
| **TC-02** | Yes | Yes | Yes | No | **Review (Missing Data)** |
| **TC-03** | Yes | Yes | No | Yes | **Review (Low Confidence)** |
| **TC-04** | Yes | Yes | No | No | **Review (Low Conf + Missing)** |
| **TC-05** | Yes | No | Yes | Yes | **Reject (Blacklisted)** |
| **TC-06** | No | Yes | Yes | Yes | **Technical Failure** |

*Note: Determining "High Score" or "Data Complete" is irrelevant if "Customer OK" is False (Short-circuit logic), but for complete test coverage, all combinations are listed.*
