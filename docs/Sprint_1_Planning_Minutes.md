# Sprint 1 Planning Meeting Minutes

**Project Name:** Order Automation System  
**Sprint Name:** Sprint 1 – Initial Setup & Core Architecture  
**Sprint Duration:** December 1, 2025 – January 21, 2026 (4 weeks)  
**Meeting Date:** November 28, 2025  
**Facilitated by:** FYP Supervisor, Product Owner  
**Attendees:** Bilal Tahir, Hafiz Muhammad Tayyab, Abdul Rehman, Mahmood-ul-hassan

---

## 1. Selected Backlog Items (High Priority & Architectural Significance)

The following features were extracted from the Product Backlog for this sprint, focusing on the core foundation (Auth, Dashboard, Profile).

| ID | User Story | Priority | Acceptance Criteria | Story Points | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SYS-01** | As an **Admin**, I can sign in securely so that I can access the management dashboard. | High | - Admin can sign in with email/password.<br>- Session is persistent.<br>- Invalid credentials show error. | 3 | Complete |
| **SYS-02** | As an **Admin**, I can view a dashboard overview so that I can navigate to different sections (Orders, Drivers). | High | - Sidebar navigation functional.<br>- Responsive layout (mobile/desktop).<br>- Protected routes implementation. | 5 | Complete |
| **SYS-03** | As a **User**, I can manage my profile settings so that my information is up to date. | Medium | - User can update name/password.<br>- Profile data persists in DB. | 3 | Pending |
| **SYS-04** | As a **System**, I have a scalable database schema so that users and orders can be stored efficiently. | High | - Users, Orders, Drivers tables created.<br>- RLS policies configured. | 5 | Complete |
| **SYS-05** | As a **System**, I can ingest order data from external sources (simulated) so that the system works end-to-end. | Medium | - Basic API endpoints for orders.<br>- Data validation schemas. | 5 | Complete |

---

## 2. Team Capacity (Sprint 1)

| Member | Role | Days Available | Hours/Day | Total Hours |
| :--- | :--- | :--- | :--- | :--- |
| **Bilal Tahir** | Agent & Authentication | 10 | 6 | 60 |
| **Hafiz Muhammad Tayyab** | Supabase Integration | 10 | 6 | 60 |
| **Abdul Rehman** | Frontend (Dashboard) | 9 | 5 | 45 |
| **Mahmood-ul-hassan** | Frontend (UI Components) | 8 | 6 | 48 |

---

## 3. Action Items (Pre-Sprint)

*   [x] Confirm GitHub Monorepo setup (Turborepo) – **Bilal Tahir**
*   [x] Share UI/UX adjustments – **Abdul Rehman**
*   [x] Create and Assign Jira/GitHub tasks – **Hafiz Muhammad Tayyab**
*   [x] Setup Supabase Project & Credentials – **Hafiz Muhammad Tayyab**

---

## 4. Sprint 1 Task Breakdown

The following tasks are derived from the selected product backlog features.

| SP-ID | Task Name | Related PB-ID | Assigned To | Status | Est. Effort (Hrs) | Actual Effort (Hrs) | Comments |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S1-1** | Design Login Page UI | SYS-01 | Abdul Rehman | Complete | 5 | 4 | Implemented using shadcn/ui components |
| **S1-2** | Implement Login/Auth API | SYS-01 | Bilal Tahir | Complete | 8 | 6 | Integrated Supabase Auth & Middleware |
| **S1-3** | Develop Dashboard Shell (Sidebar/Header) | SYS-02 | Mahmood-ul-hassan | Complete | 10 | 8 | Creating Layout.tsx and Navigation |
| **S1-4** | Integrate Backend with Dashboard | SYS-02 | Bilal Tahir | Complete | 8 | 7 | Connected Auth state to UI |
| **S1-5** | Develop Profile Update Feature | SYS-03 | Mahmood-ul-hassan | Pending | 6 | 2 | UI draft ready, awaiting backend |
| **S1-6** | Database Schema Design (Users/Orders) | SYS-04 | Hafiz Muhammad Tayyab | Complete | 8 | 6 | Tables created in Supabase |
| **S1-7** | Set up Development Environment (Monorepo) | N/A | Bilal Tahir | Complete | 4 | 4 | Turborepo initialized |
| **S1-8** | Implement File Upload (for avatars/docs) | SYS-03 | Hafiz Muhammad Tayyab | Pending | 8 | 3 | Storage buckets created |
| **S1-9** | Create Static Landing Page | SYS-01 | Abdul Rehman | Complete | 4 | 4 | Simple welcome screen |
| **S1-10** | Setup CI/CD Pipeline | SYS-05 | Hafiz Muhammad Tayyab | In Progress | 8 | 5 | GitHub Actions workflow setup |
| **S1-11** | Draft Course Creation UI (Adjusted to Order Creation) | SYS-02 | Mahmood-ul-hassan | Complete | 4 | 3 | Order Entry Form UI created |
| **S1-12** | Test Profile Management | SYS-03 | Abdul Rehman | Pending | 4 | 0 | Blocked by S1-5 |

---

**Note:** "Course" related items from the initial template were adjusted to "Order" or "Profile" related tasks to match the domain.
