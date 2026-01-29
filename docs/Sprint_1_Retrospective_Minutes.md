# Sprint 1 Retrospective Meeting Minutes

**Sprint:** Sprint 1 – Initial Setup & Core Architecture  
**Retrospective Date:** January 22, 2026  
**Duration:** 1 hour  
**Facilitator:** Product Owner / FYP Supervisor  
**Attendees:** Bilal Tahir, Hafiz Muhammad Tayyab, Abdul Rehman, Mahmood-ul-hassan

---

## 1. Sprint Overview
**Goal:** Establish the foundational architecture of the Order Automation platform and implement the user authentication module.  
**Sprint Duration:** December 1, 2025 – January 21, 2026 (4 weeks working time)

---

## 2. What Went Well (Strengths)

*   **Supabase Authentication:** The implementation of JWT Auth with Supabase was smooth and secure. The decision to use existing libraries saved significant backend dev time.
*   **CI/CD Stability:** Setting up the GitHub Actions pipeline early (by Hafiz Tayyab) prevented "it works on my machine" issues during the review.
*   **Collaboration:** Daily standups were effective. The crossover between Frontend (Abdul/Mahmood) and Backend (Bilal) was handled well via clear API contracts.
*   **Database Schema:** The core schema for Users/Orders is clean, normalized, and ready for extension in Sprint 2.

---

## 3. What Didn't Go Well (Weaknesses)

*   **UI Inconsistencies:** There were slight styling differences between the Login page (Abdul Rehman) and the Dashboard shell (Mahmood) due to lack of a strict style guide.
*   **Test Coverage:** Backend API test coverage is minimal. We prioritized feature delivery over writing comprehensive integration tests due to time constraints.
*   **Acceptance Criteria Ambiguity:** Some stories (like Profile Update) lacked specific details about image file size limits, causing rework during QA.

---

## 4. Suggestions for Improvement

*   **Standardize UI Components:** Create a shared `packages/ui` style guide or export more strict ShadCN components to ensure visual consistency.
*   **Shift-Left Testing:** Include test case planning in the Story Grooming sessions so QA (Abdul Rehman) knows exactly what to test before dev starts.
*   **Clearer Story Definitions:** Improve Jira/Backlog item descriptions with specific validation rules (e.g., "Max file size 2MB").
*   **Pair Programming:** Utilize pair programming for complex logic like the upcoming "Order Assignment Algorithm" to reduce bugs.

---

## 5. Action Items

| Action Item | Owner | Due Date |
| :--- | :--- | :--- |
| **Draft UI Component Style Guide** (Standardize colors/spacing) | Mahmood-ul-hassan | Jan 30, 2026 |
| **Add Test Planning Checklist** to Story Grooming process | Abdul Rehman | Jan 30, 2026 |
| **Refine User Story Templates** with "Definition of Ready" | Bilal Tahir | Jan 30, 2026 |

---

## 6. Next Goal (Sprint 2)
**Focus:** Order Management & Intelligent Driver Assignment.  
We aim to have a fully functional Order flow (Create -> Assign -> Deliver) by the end of Sprint 2.
