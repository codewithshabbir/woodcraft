# Woodcraft Management System (FYP) - Complete Documentation Analysis

Source set analyzed (fully read):
- `FYP Doc Final/Project Doc.docx` (priority)
- `FYP Doc Final/Software Requirements Specification Doc.docx` (SRS v2.0)
- `FYP Doc Final/Design Document Doc.docx` (Design v1.0)
- All diagrams in `FYP Doc Final/Images/`:
  - Architecture Design Diagram
  - Class Diagram
  - Database Design
  - Entity Relationship Diagram (ERD)
  - Use Case Diagram
  - UC01 -> UC15 (sequence diagrams)

Terminology used below:
- "API Route" = Next.js API Route layer shown in the diagrams.
- "Validation" = input validation/business rule checks shown as a distinct layer in diagrams.
- "DB" = MongoDB collections shown in Database Design/ERD/Architecture.

---

# 1. Project Overview

## What the system does (based on Project Doc + SRS)
Woodcraft Management System is a full-stack web application (Next.js + MongoDB) intended to digitize internal operations of a woodwork workshop / small furniture manufacturing business. It centralizes:
- Customer registration and order lifecycle tracking
- Inventory (raw materials) tracking with auto-deduction and low-stock alerts
- Employee management + task/work logging (hours, progress, wages)
- Invoicing and payments (including partial payments)
- Reporting/analytics (revenue vs expenses, productivity, material usage, timelines)

## Core purpose
Replace manual registers/spreadsheets with a centralized system that reduces errors/delays and provides "real-time" operational insight for decision making (stock, expenses, work progress, revenue).

## Actors
From SRS + diagrams:
- **Admin**: manages master data and operational control (customers, orders, inventory, employees, invoices/payments, reports).
- **Employee (worker/craftsman)**: updates assigned task progress; submits work hours (later approved by Admin).

## System scope (explicitly stated in SRS scope + Project Doc)
In scope:
- Customer and order CRUD (at least create + track; SRS also states order updates until "Completed")
- Order status lifecycle: **Pending -> In Progress -> Completed -> Delivered**
- Materials inventory with thresholds, supplier info, and stock deduction at order confirmation/material allocation
- Employee assignment to orders/tasks, work hours logging, wage calculation, performance/workload tracking
- Invoice generation + payment recording + outstanding balance tracking
- Reports/analytics (monthly income/expenses, usage, productivity, timelines)

Out of scope (not explicitly defined, but important absence in docs/diagrams):
- External customer portal (customers are not modeled as system actors)
- Purchasing workflow (purchase orders, supplier invoices, stock-in transactions) beyond "supplier details"
- Authentication specifics (session model, RBAC granularity) beyond generic login/role mention

## Methodology and work plan evidence (from SRS)
- Methodology: SRS includes a "VU Process Model" (hybrid Waterfall + Spiral) diagram and describes its phases (Requirements, Planning, Risk Analysis, Design, Development, Testing, Client Evaluation, Acceptance).
- Work plan: SRS includes a Gantt chart covering Nov 5, 2025 through Apr 28, 2026 with phases for SRS, Design Document, Prototype Phase, and Final Deliverable (system development/testing/submission).

---

# 2. Complete Feature Breakdown (ALL features from ALL documents)

This section merges:
- Project Doc "Functional Requirements"
- SRS "Functional Requirements" + "Non-Functional Requirements"
- Design/Architecture diagram decomposition (UI modules, API modules, collections)

## A. Identity, Access, Roles
Documented:
- Secure login for authenticated users (SRS security NFR; Class Diagram shows `login()`/`logout()` on User)
- Role: **Admin / Employee** (ERD explicitly models role)

Missing/under-specified:
- Session mechanism (JWT/cookies), password policy, password reset, account disable/lockout
- Role-based authorization rules per route/use case (diagrams show roles but do not enforce in sequence flows)

## B. Employee Management (Admin)
Documented:
- Register employee with name/email/role/employee type/hourly rate + credentials (SRS UC01)
- Duplicate email prevention and input validation (SRS UC01 alt flows)
- Track employee performance/workload via work history (SRS FR + UC09)

Design coverage:
- UC01 sequence includes password hashing and "save employee" write to DB.

## C. Customer Management (Admin)
Documented:
- Register customer with contact details (name/phone/email/address) (Project Doc + SRS UC02)
- Prevent duplicates by phone/email (SRS UC02 alt flow)

## D. Order Management (Admin + Employee visibility)
Documented:
- Create order for furniture/repairs/custom work (Project Doc + SRS UC03)
- Track order status and progress (Project Doc + SRS UC04)
- Maintain order history (SRS FR)
- Update order details until "Completed" (SRS FR)
- Order timeline reporting (start/end/total time) (SRS FR)

Design coverage:
- UC03 includes cost estimation reference (UC15), confirmation, stock deduction reference (UC13), low-stock warning (UC14), and saving order.
- UC04 sequence only shows fetching order by id and returning status.

## E. Cost Estimation (Admin)
Documented:
- Cost estimation should include **materials + labor** (Project Doc)
- SRS models a dedicated UC15 referenced by UC03.

Design coverage:
- UC15 sequence calculates cost using material prices; labor is not shown in computation.

## F. Inventory & Material Management (Admin)
Documented:
- Track raw materials (wood types, nails, polish, paint, tools, etc.) (Project Doc + SRS FR)
- Maintain supplier information (Project Doc + SRS FR)
- Deduct stock when order confirmed/material allocated (SRS FR, UC13)
- Low-stock alerts when stock < threshold (Project Doc + SRS FR, UC14)

Design coverage:
- UC05 sequence only demonstrates adding a material.
- UC13 updates material quantities; UC14 shows alert generation (but trigger mechanism differs from SRS; see UC14).

## G. Supplier Management (Admin)
Documented:
- Supplier details are part of materials management scope (Project Doc + SRS FR)

Gap:
- No explicit use case (UC) or sequence diagram for Supplier CRUD or supplier association workflow.

## H. Task / Work Logging (Employee + Admin approval)
Documented:
- Assign worker to job/order (Project Doc + SRS UC06)
- Update task progress (SRS UC11)
- Track work hours & wages; admin reviews/approves/rejects hours (Project Doc + SRS UC12)

Design coverage:
- UC11 updates progress and then updates order status.
- UC12 introduces a pending->approved/rejected workflow and wage calculation.

## I. Billing & Payments (Admin)
Documented:
- Generate invoice upon completion when initiated by admin (SRS FR + UC07)
- Record partial/full payments; show outstanding balance (Project Doc + SRS FR + UC08)

Design coverage:
- UC07 fetches order cost then saves invoice.
- UC08 saves payment then updates invoice balance.

## J. Reports & Analytics (Admin)
Documented (Project Doc + SRS FR):
- Monthly income & expenses
- Revenue vs expenses
- Material usage / consumption (most used materials)
- Employee productivity/performance
- Order completion times / timeline

Design coverage:
- UC10 is a generic "fetch report data" flow; details per report type are not modeled.

## K. Non-Functional Requirements (SRS)
Documented:
- Performance: typical operations respond ~1-2 seconds; updates reflect quickly
- Reliability: data integrity; manual backups
- Usability: non-technical friendly; responsive UI
- Security: authentication, admin-only actions restrictions, hashed/encrypted sensitive data
- Maintainability: modular component architecture; easy integration of new features
- Scalability: handles growth in orders/materials/employees without major degradation

Traceability gaps:
- Diagrams do not show backup mechanism, monitoring, audit logs, or security enforcement points.

---

# 3. Use Case Analysis (UC01-UC15)

For each UC:
- "Documented flow" is taken from SRS UC tables.
- "Implemented/Designed flow" is taken from the sequence diagram in `FYP Doc Final/Images/`.
- Backend logic is interpreted strictly from the diagrams and DB schemas (no assumptions about code).

## UC01 - Register Employee
**Actor:** Admin

**Flow (step-by-step):**
1. Admin opens employee registration form.
2. Admin enters employee details (name, email, role, employee type, hourly rate) and sets/generated password.
3. System validates inputs and checks for duplicate email.
4. System saves employee and confirms creation.

**Backend logic interpretation (from sequence diagram):**
- UI -> API Route: `submitEmployeeData()`
- API Route -> Validation: `validateEmployeeData()`
- If valid: API Route performs `hashPassword()` then `saveEmployee()` to DB.

**Data involved (DB/ERD/Class alignment):**
- Collection/entity: `Users` / `User`
- Required fields per diagrams: `name`, `email`, `password`, `role`, `hourlyRate`
- SRS additionally requires: `employeeType` (and later skill type in FR)

**Validation logic (documented + diagram):**
- Required fields present; email format; hourly rate numeric and positive
- Must prevent duplicate email (SRS explicitly) - but sequence diagram does not show DB "duplicate check" query

**Observations:**
- **Mismatch:** SRS requires duplicate email check; sequence only shows validation step (no DB lookup).
- **Mismatch:** ERD models `employeeType`, but Database Design + Class Diagram do **not** include it.
- **Strength:** password hashing is explicitly included in the sequence diagram (security-aligned).

## UC02 - Register Customer
**Actor:** Admin

**Flow:**
1. Admin opens customer form and enters details (name, phone, email, address).
2. System validates input, checks duplicates (phone/email), then saves customer.

**Backend logic (sequence diagram):**
- UI -> API: `submitCustomerData()`
- API -> Validation: `validateCustomerData()`
- If valid: API -> DB: `saveCustomer()`

**Data involved:**
- `Customers` / `Customer`: `name`, `phone`, `email`, `address`, (ERD also shows `createdAt`)

**Validation logic:**
- Required fields and format checks
- Duplicate detection by phone/email is required by SRS, but the sequence diagram does not show the DB lookup.

**Observations:**
- **Gap:** Duplicate customer detection is stated but not modeled in sequence flow (should be a DB query before insert).

## UC03 - Create Order
**Actor:** Admin

**Flow:**
1. Admin selects customer and enters order details (type/description/quantity).
2. Admin selects required materials.
3. System triggers cost estimation (UC15) and displays estimate.
4. Admin confirms order; system creates order with "Pending" status.

**Backend logic (sequence diagram):**
- Order UI -> API: `submitOrderData()` -> Validation `validateOrderData()`
- Ref UC15: API invokes Pricing Logic `calculateCost()` -> DB `fetchMaterialPrices()` -> returns estimate to UI
- On confirmation: UI -> API `submitOrder()`
- Ref UC13: API triggers Inventory Logic `decreaseStock()` -> DB `updateMaterialQuantity()` (stock deducted)
- Optional low-stock warning (alt path): if `stock < threshold` return `lowStockWarning` to UI
- Finally: API -> DB `saveOrder()`

**Data involved:**
- `Orders`: `customerId`, `description`, `status`, `estimatedCost`, `actualCost`, `startDate`, `endDate`, `materialsUsed[]`
- `Materials`: `quantity`, `pricePerUnit`, `threshold`
- ERD additionally suggests `materialsUsed[].priceAtTime` and `StockLogs` for inventory tracking.

**Validation logic:**
- Input validation for order shape
- Must ensure selected materials exist and have sufficient stock (SRS UC03 alt flow + UC13)

**Observations:**
- **Design risk:** Sequence deducts stock **before** persisting the order (`saveOrder()` happens after stock update). If order save fails, stock is already changed (inconsistency risk).
- **Mismatch:** SRS alt flow "materials unavailable prevents order creation" is not enforced early; out-of-stock is checked during UC13 deduction (late in flow).
- **Gap:** No explicit "order type/quantity" fields exist in DB diagram (only `description` shown).

## UC04 - Track Order Status
**Actor:** Admin, Employee (SRS)

**Flow:**
1. User selects an order.
2. System retrieves order details and displays status/progress.

**Backend logic (sequence diagram):**
- Order UI -> API: `getOrderStatus()`
- API -> Validation: `validateOrderId()`
- API -> DB: `findOrderById()`

**Data involved:**
- `Orders.status` + potentially progress fields stored in `WorkLogs.progress` (ERD) or derived from tasks

**Validation logic:**
- Valid order id, order exists

**Observations:**
- **Mismatch:** Sequence diagram only shows **Admin** actor; SRS says Employee can also track status.
- **Gap:** "Progress details" are promised in SRS but sequence diagram returns only `statusResponse` (no WorkLog/task aggregation).

## UC05 - Manage Raw Materials
**Actor:** Admin

**Flow:**
1. Admin adds/updates raw materials, quantities, thresholds, and supplier details.
2. System validates and persists changes.

**Backend logic (sequence diagram provided):**
- Inventory UI -> API: `submitMaterialData()`
- API -> Validation: `validateMaterialData()`
- API -> DB: `insertMaterial()`

**Data involved:**
- `Materials`: `name`, `quantity`, `unit`, `pricePerUnit`, `threshold`, `supplierId`
- `Suppliers` is required by SRS, but no UC covers supplier CRUD.

**Validation logic:**
- Non-negative quantities; threshold numeric; supplier existence if supplierId required

**Observations:**
- **Mismatch:** UC05 is titled "Manage" but sequence only models "Add" (no update/delete, no supplier linking flow).
- **Gap:** `unit` exists in Database Design but is not present in ERD/Class Diagram (schema inconsistency across diagrams).

## UC06 - Assign Worker to Job
**Actor:** Admin

**Flow:**
1. Admin opens order and selects employee/worker.
2. System validates assignment and stores it.

**Backend logic (sequence diagram):**
- Order UI -> API: `submitWorkerAssignment()`
- API -> Validation: `validateAssignmentData()`
- API -> DB: `assignWorkerToOrder()`

**Data involved:**
- Likely `Orders` needs an assignment field (e.g., `assignedEmployees[]`), or `WorkLogs` should be created as task placeholders.
- Current Database Design + Class Diagram do **not** show where assignment is stored.

**Validation logic:**
- Order exists; employee exists; employee role is Employee; avoid duplicate assignment

**Observations:**
- **Major gap:** Data model does not define assignment representation (no assignment entity/fields shown).
- **Mismatch vs SRS FR:** SRS requires employee skill type categorization for assignment optimization, but User schema/class diagram does not include `skillType`.

## UC07 - Generate Invoice
**Actor:** Admin

**Flow:**
1. Admin requests invoice generation for an order.
2. System validates request, calculates/fetches final order cost, and creates invoice.

**Backend logic (sequence diagram):**
- Invoice UI -> API: `submitInvoiceRequest()`
- API -> Validation: `validateInvoiceRequest()`
- API -> DB: `fetchOrderCost()` then `saveInvoice()`

**Data involved:**
- `Invoices`: `orderId`, `totalAmount`, `generatedDate`, `status`
- Order cost should be derived from:
  - Materials (`materialsUsed` with price) + Labor (work logs * hourly rates)
  - But sequence diagram only fetches "order cost" from DB without modeling the computation source.

**Validation logic:**
- Order exists; invoice not already generated; order is eligible (SRS FR implies "upon completion")

**Observations:**
- **Mismatch:** No check in sequence diagram that order status is "Completed" before invoice generation.
- **Schema mismatch:** Sequence UC08 later updates invoice balance; ERD includes `totalPaid`/`remainingBalance`, but Database Design diagram does not.

## UC08 - Record Payment
**Actor:** Admin

**Flow:**
1. Admin opens invoice, enters payment amount.
2. System validates and records payment (partial/full), updates invoice balance, confirms.

**Backend logic (sequence diagram):**
- Payment UI -> API: `submitPayment()`
- API -> Validation: `validatePaymentData()`
- API -> DB: `savePayment()` then `updateInvoiceBalance()`

**Data involved:**
- `Payments`: `invoiceId`, `amount`, `paymentDate`
- `Invoices`: must track outstanding balance (ERD has `totalPaid`, `remainingBalance`)

**Validation logic:**
- Amount > 0; amount ≤ remaining balance (not shown but required for correctness)
- Invoice exists and is not closed/void; concurrency safe update

**Observations:**
- **Gap:** Overpayment/underpayment rules are not modeled.
- **Schema mismatch:** Database Design diagram lacks the balance fields that UC08 requires to update.

## UC09 - Track Employee Performance
**Actor:** Admin

**Flow:**
1. Admin selects employee.
2. System retrieves work history and presents performance/workload metrics.

**Backend logic (sequence diagram):**
- Report UI -> API: `getEmployeePerformanceReport()`
- API -> Validation: `validateEmployeeId()`
- API -> DB: `fetchWorkHistory()` -> respond with `performanceData`

**Data involved:**
- `WorkLogs` (hours, dates, orderId, userId) + optionally progress/task metadata (`progress`, `taskDescription` in ERD)

**Validation logic:**
- Employee exists; employee role is Employee; date range/report filters are valid (filters are not shown but typically needed)

**Observations:**
- **Gap:** "Performance" definition is not formalized (KPIs not specified: hours/day, tasks completed, on-time %, etc.).

## UC10 - Generate Reports & Analytics
**Actor:** Admin

**Flow:**
1. Admin selects report type and parameters (month, date range, category).
2. System validates request, aggregates data, and returns report results.

**Backend logic (sequence diagram):**
- Report UI -> API: `generateReportRequest()`
- API -> Validation: `validateReportRequest()`
- API -> DB: `fetchReportData()` -> return `reportData`

**Data involved:**
- `Orders` (timelines/status), `Materials`/`StockLogs` (usage), `Invoices`/`Payments` (income), `WorkLogs` (labor), plus derived "expenses" (not clearly modeled in DB)

**Validation logic:**
- Report type allowed; date range valid; aggregation safe for large volumes

**Observations:**
- **Gap:** "Expenses" reporting is stated in Project Doc/SRS, but DB diagrams do not define an explicit **Expense** entity (materials purchases, overhead, wages, etc.). Without this, "revenue vs expenses" is incomplete.

## UC11 - Update Task Progress
**Actor:** Employee

**Flow:**
1. Employee opens assigned task and updates progress.
2. System validates, updates progress, and updates order status if needed.

**Backend logic (sequence diagram):**
- Task UI -> API: `submitProgressUpdate()`
- API -> Validation: `validateProgressData()`
- API -> DB: `updateProgress()` then `updateOrderStatus()`

**Data involved:**
- `WorkLogs.progress` (ERD includes `progress`; Class Diagram does not)
- `Orders.status`

**Validation logic:**
- Employee is assigned to the order/task
- Progress is within allowed range (e.g., 0-100 or status enum)
- Order status transition rules enforced (Pending->In Progress->Completed->Delivered)

**Observations:**
- **Gap:** Assignment check is not shown in sequence diagram but is critical for authorization.
- **Mismatch:** Use Case Diagram includes UC11 but incorrectly uses `include` with UC12 (see Section 4).

## UC12 - Track Work Hours & Wages
**Actor:** Employee, Admin

**Flow:**
1. Employee submits work hours for assigned task.
2. System validates and stores as pending.
3. Admin reviews and approves/rejects/modifies.
4. System calculates wages from approved hours and predefined hourly rate; persists wage update.

**Backend logic (sequence diagram):**
- Employee -> Task UI -> API: `submitWorkHoursData()` -> Validation `validateWorkHours()`
- API -> DB: `storeHours(status=\"pending\")`
- Admin reviews and calls `approveWorkHours()`
  - Rejected: API -> DB `updateStatus(\"rejected\")`
  - Approved: API -> DB `updateStatus(\"approved\")` + `fetchHourlyRate()`; API computes `wage = hours * rate`; API -> DB `saveWage()`

**Data involved:**
- `WorkLogs` should contain: `orderId`, `userId`, `hoursWorked`, `workDate`, plus **approval status** and **wage** or derivable wage
- `Users.hourlyRate` is used for wage calculation

**Validation logic:**
- Hours must be > 0 and reasonable (SRS exception)
- Admin approval required before wage update

**Observations:**
- **Schema mismatch:** Database Design + Class Diagram WorkLog lacks `status` and `wage` fields, but sequence diagram requires them.
- **Process mismatch:** Use Case Diagram shows UC11 includes UC12; in practice UC12 is a separate workflow that can occur independent of progress updates.

## UC13 - Auto-Decrease Stock
**Actor:** Admin (SRS), triggered by order confirmation/material allocation

**Flow:**
1. System receives material assignment from order creation.
2. System checks availability and validates sufficient stock.
3. System deducts allocated quantity and updates DB.

**Backend logic (sequence diagram):**
- Order UI -> API: `decreaseStock()`
- API -> Validation: `validateStockRequest()`
- API -> DB: `checkCurrentStock()`
  - Out of stock: return `outOfStockResponse`
  - In stock: `updateMaterialQuantity()` -> return success

**Data involved:**
- `Materials.quantity`, `Materials.threshold`
- ERD introduces `StockLogs` to audit stock movement; Database Design does not include it.

**Validation logic:**
- Quantity requested positive; material exists; sufficient stock; concurrency-safe update

**Observations:**
- **Gap:** No stock movement audit is shown (but ERD/Architecture mention `StockLogs`).
- **Consistency risk:** Without atomic decrement and checks, concurrent confirmations can oversell stock.

## UC14 - Low-Stock Alert
**Actor:** Admin (SRS)

**Flow (SRS):**
1. Stock update occurs.
2. System compares updated stock to threshold.
3. If below threshold, system generates and displays alert.

**Backend logic (sequence diagram):**
- A **System Timer** triggers `triggerStockCheck()` to API.
- API queries DB `getMaterialQuantity()`.
- If `stock < threshold`: API sends `lowStockResponse` to Admin UI -> `showLowStockWarning()`.

**Data involved:**
- `Materials.quantity`, `Materials.threshold`
- Optional: notification history/audit (not modeled)

**Validation logic:**
- Threshold configured; avoid repeated alerts spam; include which material(s) are low

**Observations:**
- **Mismatch:** SRS defines UC14 as **event-driven after stock update**, but sequence diagram implements it as **time-driven polling**.
- **Architecture concern:** A "System Timer" is not defined anywhere else (Next.js hosting needs cron/scheduler integration); the architecture diagram does not show a scheduler component.

## UC15 - Generate Cost Estimation
**Actor:** Admin

**Flow:**
1. Admin requests cost estimation with selected materials and quantities.
2. System validates request, fetches material prices, computes total estimated cost, and displays.

**Backend logic (sequence diagram):**
- Order UI -> API: `calculateCost()`
- API -> Validation: `validateCostRequest()`
- API -> DB: `fetchMaterialPrices(materialIds)` -> API computes total `computeTotalCost()`

**Data involved:**
- `Materials.pricePerUnit`, selected quantities
- Labor component is required by Project Doc ("materials + labor") but not present in sequence computations.

**Validation logic:**
- Materials exist; quantities positive; price data present

**Observations:**
- **Mismatch:** Project Doc requires labor inclusion; UC15 diagram only covers materials pricing.
- **Gap:** If prices can change, ERD's `materialsUsed.priceAtTime` becomes important to preserve historical pricing (not present in Database Design diagram).

---

# 4. Use Case Diagram Analysis

Use Case Diagram elements present:
- Actors: Admin, Employee
- Use cases drawn: Register Customer, Create Order, Track Order Status, Manage Raw Materials, Assign Worker to Job, Generate Invoice, Generate Cost Estimation, Record Payment, Track Employee Performance, Generate Reports & Analytics, Update Task Progress, Track Work Hours & Wages, Auto-Decrease Stock, Low-Stock Alert
- Relationships:
  - `Update Task Progress` **<<include>>** `Track Work Hours & Wages`
  - `Auto-Decrease Stock` **<<extend>>** `Low-Stock Alert` (as drawn)

Correctness validation:
- **Missing UC01 (Register Employee)** in the diagram, despite being a core SRS use case and sequence diagram.
- **Actor associations inconsistent with SRS:**
  - `Track Order Status` should be linked to **Employee** as well (SRS: Admin, Employee).
  - `Low-Stock Alert` and `Auto-Decrease Stock` have no actor association in the diagram (in practice, Admin receives the alert; the stock deduction is system-driven but initiated by Admin's confirmation event).
- **Incorrect relationship semantics:**
  - `Auto-Decrease Stock` extending `Low-Stock Alert` is backwards for the intended domain.
    - In SRS, Low-Stock Alert happens **because** stock decreased; it is a conditional behavior following stock updates.
    - Better modeling options:
      - `Low-Stock Alert` **<<extend>>** `Auto-Decrease Stock` (alert is conditional extension after deduction), or
      - `Auto-Decrease Stock` **<<include>>** `Low-Stock Check` (internal check) and the alert is a triggered outcome.
  - `Update Task Progress` including `Track Work Hours & Wages` is not supported by SRS/sequence logic:
    - UC12 is a work-hours submission + admin approval workflow that can occur even without progress update events.

---

# 5. Sequence Diagrams Analysis (UC01-UC15)

Across all sequence diagrams, the common pattern is:
UI -> API Route -> Validation -> DB, with `alt/opt/ref` fragments.

## Per-use-case correctness checks (API route, validation, DB)

UC01/UC02:
- Good separation of validation vs persistence.
- Missing explicit "duplicate check" DB read before write (required by SRS alt flows).

UC03:
- Good modularization using `ref` to UC15 and UC13.
- **Ordering issue:** stock deduction occurs before `saveOrder()`; needs atomicity/transaction-like handling to avoid inconsistent stock.
- Missing explicit step to verify materials availability *before* confirming the order (SRS UC03 alt flow).

UC04:
- Includes not-found branch; good.
- Does not include "progress aggregation" retrieval despite SRS description.
- Missing Employee actor path (diagram only shows Admin).

UC05:
- Only insert flow shown; missing update/delete, supplier association, threshold management paths.

UC06:
- Writes "assignment" but no underlying storage model is shown anywhere (DB/Class diagrams missing assignment representation).

UC07:
- No validation of "order completed" before invoice generation (SRS FR expects invoice upon completion).
- "fetchOrderCost" is vague; should specify computation sources (materials + approved labor).

UC08:
- Correct sequence: save payment then update invoice.
- Missing critical validations: overpayment, concurrency-safe balance update.

UC09/UC10:
- Treated as generic "fetch data" calls; no modeling for report parameters, aggregation logic, caching, or performance constraints.

UC11:
- Updates progress then order status; correct high-level intent.
- Missing authorization check: employee must be assigned to task/order.
- Status transition rules not shown (e.g., can't jump from Pending->Completed).

UC12:
- Stronger workflow modeling (pending -> approve/reject) than other diagrams.
- Schema gap: WorkLog lacks fields required to store approval status and wage calculation results.

UC13:
- Correctly checks current stock before deduction; includes out-of-stock alternative.
- Missing atomic update semantics and auditing (`StockLogs`).

UC14:
- Diagram introduces "System Timer" scheduler not represented elsewhere; conflicts with SRS's event-driven description.
- Missing alert de-duplication and alert payload (which materials are low, current qty, supplier).

UC15:
- Clear material-price-based calculation path.
- Missing labor component required by Project Doc and implied by SRS labor-cost feature.

---

# 6. Database Design Analysis (MongoDB perspective)

## Collections (as per Architecture diagram + Database Design + ERD)
Documented collections:
- `Users`
- `Customers`
- `Orders`
- `Materials`
- `Suppliers`
- `WorkLogs`
- `Invoices`
- `Payments`
- `StockLogs` (present in Architecture + ERD, missing in Database Design/Class Diagram)

## Embedded vs Reference usage (and justification)
Documented hybrid approach (Design Doc "Database Design" text):
- **Embedded:** `Orders.materialsUsed[]` stores `{ materialId, quantityUsed }` (ERD extends to include `priceAtTime`).
  - Justification: frequent reads of "order + its materials" benefit from embedding a compact list.
- **References:**
  - `Orders.customerId -> Customers`
  - `Materials.supplierId -> Suppliers`
  - `WorkLogs.orderId -> Orders`, `WorkLogs.userId -> Users`
  - `Invoices.orderId -> Orders`
  - `Payments.invoiceId -> Invoices`

MongoDB alignment:
- Embedding `materialsUsed[]` is appropriate because it is bounded per order and naturally scoped to an order document.
- Referencing `Customers`, `Users`, `Materials`, `Suppliers` is appropriate to avoid duplication and enable shared updates.

## Data flow across collections (end-to-end)
1. Customer created -> `Customers`
2. Order drafted:
   - `Orders` created with status `Pending`, selected materials list, estimated cost
3. Order confirmation/material allocation:
   - `Materials.quantity` decremented (UC13)
   - Low-stock check performed (UC14)
   - (Recommended) write `StockLogs` entries for audit
4. Work execution:
   - `WorkLogs` created/updated with progress + hours submitted
   - Admin approval updates WorkLog status and wage or approved hours (UC12)
5. Billing:
   - `Invoices` created for an order, total computed (materials at time + approved labor)
6. Payments:
   - `Payments` appended per invoice
   - `Invoices.totalPaid` and `Invoices.remainingBalance` updated (ERD requirement)
7. Reporting:
   - Reports aggregate across `Orders`, `WorkLogs`, `Invoices`, `Payments`, `Materials`, `StockLogs`

## Identified design flaws / inconsistencies
1. **StockLogs inconsistency:** Architecture + ERD include `StockLogs`, Database Design and Class Diagram do not.
2. **Invoice balance inconsistency:** ERD includes `totalPaid` + `remainingBalance`, but Database Design and Class Diagram omit them; UC08 requires them.
3. **WorkLog field mismatch:** UC11/ERD require `progress` and `taskDescription`, UC12 requires approval status and wage; Database Design/Class Diagram WorkLog only has `hoursWorked` + `workDate`.
4. **Skill/employee type mismatch:** SRS requires skill type categorization; ERD includes `employeeType`; Database Design/Class Diagram omit them.
5. **Expenses entity missing:** Reports demand "expenses" but no entity models purchases/overhead/wage payouts explicitly; wages are implied but not modeled consistently.
6. **Unit field inconsistency:** Database Design includes `Materials.unit` but ERD/Class Diagram omit it.

---

# 7. ERD Analysis

## Entities and relationships (as drawn)
- Customer **1 : N** Order (`Customer has Orders`)
- Order **1 : N** WorkLog (`Order has WorkLogs`)
- User **1 : N** WorkLog (`User performs WorkLogs`)
- Order **1 : 1** Invoice (ERD implies invoice per order; exact optionality should be clarified)
- Invoice **1 : N** Payment
- Supplier **1 : N** Material
- Material **1 : N** StockLog ("tracks" stock changes)
- Order "contains" embedded `materialsUsed[]` with `materialId`, `quantityUsed`, and `priceAtTime`

## Cardinality validation
Mostly sensible, but must be clarified:
- **Order-Invoice optionality:** In real systems, Order may have **0..1** invoice until completion. Class Diagram shows `0..1`, Database Design shows `0..1`, ERD visually suggests 1:1; align all to **Order 1 -> 0..1 Invoice**.

## ERD vs Database Design mismatch highlights
- ERD includes `StockLog`, `priceAtTime`, `totalPaid`, `remainingBalance`, `taskDescription`, `progress`, `createdAt` fields - Database Design diagram lacks many of these.
- ERD User includes `employeeType` but Database Design User does not.

---

# 8. Class Diagram Analysis

## Entities and attributes (as drawn)
Classes: Customer, Order, Invoice, Payment, User, WorkLog, Material, Supplier.

Key alignment with DB:
- Mostly matches Database Design diagram for core attributes.
- Uses `customerId/userId/...` naming rather than MongoDB `_id` (acceptable in a conceptual class diagram, but must map consistently in implementation).

## Relationships
Matches Database Design diagram patterns:
- Customer-Order (1 to many)
- Order-Invoice (0..1)
- Invoice-Payment (1 to many)
- User-WorkLog (1 to many)
- Order-WorkLog (1 to many)
- Supplier-Material (1 to many)
- Order-Material via `materialsUsed`

## MongoDB alignment issues
1. **Missing StockLog class** despite ERD/Architecture referencing it.
2. **WorkLog is underspecified** for task progress and hours approval workflow.
3. **User class lacks employeeType/skillType** required by SRS for assignment and reporting.
4. Operations listed (`addCustomer()`, `generateInvoice()`, etc.) resemble service methods rather than domain entity behavior; if kept, they should be moved to "Service" classes to match the layered architecture diagram.

---

# 9. Architecture Analysis

## Layer explanation (as per Architecture Design Diagram)
1. **Presentation Layer (Frontend - Next.js)**
   - Admin Dashboard UI, Customer UI, Order UI, Inventory UI, Invoice UI, Payment UI, Reports UI
   - Employee UI, Task UI
2. **Application Layer (Backend - Next.js API Routes)**
   - Employee, Customer, Order, Inventory, Invoice, Payment, Report, Task routes
3. **Validation Layer**
   - Centralized input/rules checking (shown as a distinct layer)
4. **Business Logic (Services)**
   - Employee/Customer/Order/Inventory/Invoice/Payment/Report/Task services
5. **Data Layer (MongoDB via Mongoose)**
   - Users, Customers, Orders, Materials, Suppliers, WorkLogs, Invoices, Payments, StockLogs

## Data flow (request -> response)
Typical request path (consistent with sequence diagrams):
Frontend UI action -> API Route (HTTP JSON) -> Validation -> (Service/Logic) -> DB query -> API JSON response -> UI render/feedback

## Validation against actual diagrams
Alignment:
- Architecture's "Validation layer" is consistently represented in sequence diagrams.
- The collections listed in architecture mostly match ERD.

Gaps:
- Architecture includes "Services" layer, but most sequence diagrams jump from API Route directly to DB (except UC03 showing Pricing/Inventory logic).
- No scheduler component exists in architecture, but UC14 introduces a "System Timer".

---

# 10. Cross-Document Consistency Check (SRS vs Project Doc vs Diagrams)

## A. Project Doc vs SRS
Aligned:
- Same core modules: orders, inventory, employees, invoices/payments, reports.

Gaps/mismatches:
- Project Doc explicitly states **cost estimation = materials + labor**, but UC15/UC03 diagrams only compute from material prices.
- SRS adds **skill type** categorization for employees; Project Doc does not mention skill types, but it is in-scope via SRS.

## B. SRS vs Use Case Diagram
Mismatches:
- Missing UC01 (Register Employee) in Use Case Diagram.
- UC04 should include Employee actor association; diagram links only Admin.
- UC14 in SRS is event-driven after stock update; diagram's relationship modeling (`extend`) is reversed/incorrect.
- UC11 `include` UC12 is not justified by SRS use case descriptions.

## C. SRS vs Sequence Diagrams
Key mismatches:
- UC01/UC02: SRS requires duplicate checks; sequences omit DB check.
- UC04: SRS says Admin+Employee; sequence shows Admin only and omits progress retrieval.
- UC05: SRS implies full materials management and supplier maintenance; sequence only adds material.
- UC07: SRS implies invoice upon completion; sequence has no status check.
- UC14: SRS event-driven; sequence timer-driven polling.

## D. Diagrams internal consistency (Architecture vs ERD vs DB Design vs Class)
Mismatches:
- `StockLogs` appears in Architecture + ERD but not in Database Design + Class Diagram.
- Invoice balance fields exist in ERD and are required by UC08 but missing in DB Design + Class Diagram.
- WorkLog fields required by UC11/UC12/ERD are missing in DB Design + Class Diagram.
- `employeeType/skillType` exists in SRS/ERD but missing in DB Design + Class Diagram.
- Materials `unit` is present in DB Design but not in ERD/Class Diagram.

## E. Design Doc completeness check
Design Doc claims (TOC + intro list): Interface Design + Test Cases.
- **Finding:** The body content provided in the Design Doc ends at Database Design; Interface Design and Test Cases sections are referenced in TOC but are not actually provided as separate sections/content.

---

# 11. Identified Issues & Gaps (technical + logical)

## Requirements / use-case coverage gaps
- UC01 absent from Use Case Diagram.
- Supplier management is required (supplier info) but no UC/sequence exists for supplier CRUD.
- Order update until "Completed" (SRS FR) has no UC (no "Update Order Details" UC).
- Delivered state exists in requirements, but no UC explicitly models "Mark Delivered".
- "Revenue vs expenses" is required but expenses are not modeled as a first-class entity (risk: incomplete reporting).

## UML / diagram correctness issues
- Use Case Diagram misuses `<<extend>>` between Auto-Decrease Stock and Low-Stock Alert.
- Use Case Diagram's `<<include>>` between Update Task Progress and Track Work Hours & Wages is not supported by SRS workflow.
- Some sequence diagrams omit steps required by SRS alt flows (duplicate checks, status checks, assignment authorization).

## Data model inconsistencies
- WorkLog lacks fields for progress/taskDescription/status/wage in DB Design and Class Diagram but required elsewhere.
- Invoice lacks totalPaid/remainingBalance in DB Design/Class but required by UC08 and ERD.
- StockLogs missing from DB Design/Class but present elsewhere.
- Employee skill/employeeType mismatch across SRS/ERD vs DB/Class.

## Process/transaction risks
- Stock deduction before order persistence in UC03 can create inconsistent inventory if later steps fail.
- Concurrency/atomicity not modeled for stock decrement and invoice balance updates.

## Architecture gaps
- UC14 "System Timer" requires a scheduler/cron mechanism, absent from architecture.
- Services layer not consistently represented in sequence diagrams, reducing traceability to architecture.

---

# 12. Recommendations (exact fixes; what to change and where)

## A. Fix Use Case Diagram
1. Add missing use case:
   - Add **UC01 Register Employee** and link to **Admin**.
2. Fix actor associations:
   - Link **Employee** to **Track Order Status (UC04)**.
   - Link **Admin** to **Low-Stock Alert (UC14)** and clarify that it is system-triggered but admin-notified.
3. Correct relationships:
   - Replace `Auto-Decrease Stock <<extend>> Low-Stock Alert` with:
     - `Low-Stock Alert <<extend>> Auto-Decrease Stock` (conditional alert after deduction), OR
     - Remove extend/include and document it as a post-condition of UC13/UC05.
   - Remove `Update Task Progress <<include>> Track Work Hours & Wages` unless you explicitly define UC11 as always capturing hours (not currently true).

## B. Fix Sequence Diagrams (make them consistent with SRS + data model)
1. UC01/UC02: add explicit "duplicate lookup" step:
   - API -> DB: `findUserByEmail()` / `findCustomerByPhoneOrEmail()` before insert.
2. UC03: reorder to maintain consistency:
   - Save order as "Pending/Confirmed" first, then deduct stock, or perform both in a single safe workflow (see DB recommendations).
3. UC04: include "progress retrieval":
   - API fetch order + related `WorkLogs` / task progress summary.
4. UC07: add "order completion" guard:
   - Validate order status == Completed before invoice creation.
5. UC08: add amount/balance checks and atomic update:
   - Validate payment amount ≤ remaining balance; update balance atomically.
6. UC11: include assignment authorization check:
   - API checks employee is assigned to order/task.
7. UC14: choose one trigger and align everywhere:
   - Prefer event-driven trigger on stock update (per SRS), and remove "System Timer" unless you add a scheduler component in architecture.

## C. Fix Database Design (MongoDB schema changes)
1. Add `StockLogs` collection (to align with ERD/Architecture):
   - Fields: `materialId`, `orderId'`, `quantityChanged`, `type` (IN/OUT), `date`, `createdAt`, `performedByUserId'`
2. Strengthen `Orders.materialsUsed[]`:
   - Add `priceAtTime` (ERD) to preserve historical pricing for invoices/reports.
3. Update `Invoices` to support payments:
   - Add `totalPaid`, `remainingBalance`, and optionally `status` enum (Unpaid/Partially Paid/Paid).
4. Update `WorkLogs` to support UC11/UC12:
   - Add `taskDescription` (optional but in ERD), `progress`, `status` (pending/approved/rejected), `approvedBy`, `approvedAt`, and either `wage` or store only approved hours and compute wage on demand.
5. Add employee skill/employeeType (SRS requirement):
   - `Users.skillType` (carpenter/painter/polisher) and/or `employeeType` as defined in ERD/SRS; ensure consistent naming across diagrams.
6. Add an `Expenses` model (to make "revenue vs expenses" real):
   - Minimal: `Expenses` with `type`, `amount`, `date`, `notes`, optional `orderId`, `materialId`, `userId`.

## D. Fix Class Diagram
1. Add missing classes/fields:
   - Add `StockLog`; extend `WorkLog`; extend `Invoice` with balance fields; extend `User` with `skillType/employeeType`.
2. Move "operations" to service layer:
   - Replace entity methods like `addCustomer()` with `CustomerService.addCustomer()` etc to match architecture.

## E. Improve Architecture diagram (traceability)
1. Add scheduler component if UC14 remains timer-based:
   - E.g., "Cron/Scheduler" invoking API route.
2. Ensure every UC sequence shows the "Service" layer calls (not only DB access) to match the architecture diagram.

## F. Documentation completeness for final submission/viva
1. Add missing Design Doc sections promised by TOC:
   - Interface Design: list screens, navigation flow, and wireframes or screenshots.
   - Test Cases: at least 1-2 test cases per UC with inputs/expected outputs.
2. Add a traceability matrix:
   - Map each SRS functional requirement -> use cases -> DB entities -> UI pages -> API routes.

---

# 13. Final Verdict (submission readiness)

## Overall quality
Strong foundation: the project has a clear domain, well-scoped actors, and consistent high-level layering (Frontend -> API Routes -> Validation -> DB). The UC set (UC01-UC15) covers the operational backbone of a small woodcraft business.

## Key blockers for "perfect alignment"
The main weaknesses are **consistency and completeness**:
- Use Case Diagram is missing UC01 and contains incorrect include/extend usage.
- Data model diagrams disagree (ERD vs DB Design vs Class) on critical fields (`StockLogs`, invoice balances, WorkLog progress/approval).
- Several sequence diagrams omit business rules explicitly required by SRS (duplicate checks, completion checks, assignment authorization).
- Reports require "expenses" but the data model does not define expenses cleanly.
- Design Doc references Interface Design and Test Cases but does not actually provide them as sections/content.

## Readiness level (FYP submission perspective)
- **Functional specification readiness:** Medium-High (SRS v2.0 is structured; UC tables are clear).
- **Design consistency readiness:** Medium (diagrams are present but misaligned; needs fixes before viva).
- **Implementation readiness (as inferable from docs only):** Medium (core flows are defined, but missing constraints/transaction safety and some required entities).

Recommended next step before viva:
- Align diagrams + SRS into a single consistent model (especially WorkLog/Invoice/StockLog/User skill type), then regenerate corrected UML images and update SRS/Design to match.
