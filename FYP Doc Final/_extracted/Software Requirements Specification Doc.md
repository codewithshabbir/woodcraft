# Extracted: Software Requirements Specification Doc.docx

# Woodcraft

Software Requirements Specification

# Version 2.0

Group Id: F25PROJECTEB2A1

Supervisor Name: Syed Aun Ali Bukhari

Revision History

| Date | Version | Description | Author |
| --- | --- | --- | --- |
| 1/12/2025 | 1.0 | A complete and structured version including:
Scope of the Project,
Functional and Non-Functional Requirements,
Use Case Diagram,
Usage Scenarios,
Adopted Methodology,
and Work Plan. | Bc210202812 |
| 24/04/2026 | 2.0 | Updated version with refined Scope, improved Functional Requirements, updated Use Case Diagram, corrected and enhanced Use Cases (UC01–UC15), and overall system consistency improvements. | Bc210202812 |

Table of Contents

Contents

Scope of Project: 5

Functional and Non-Functional Requirements: 5

Functional Requirements: 6

1. Customer & Order Management 6

2. Inventory & Material Management 6

3. Employee & Labor Management 6

4. Billing & Payment Management 7

5. Reports & Analytics 7

Non-Functional Requirements 7

1. Performance 7

2. Reliability 7

3. Usability 8

4. Security 8

5. Maintainability 8

6. Scalability 8

Use Case Diagram(s): 8

Usage Scenarios: 9

UC01 — Register Employee 9

UC02 — Register Customer 10

UC03 — Create Order 10

UC04 — Track Order Status 11

UC05 — Manage Raw Materials 11

UC06 — Assign Worker to Job 12

UC07 — Generate Invoice 12

UC08 — Record Payment 13

UC09 — Track Employee Performance 13

UC10 — Generate Reports & Analytics 14

UC11 — Update Task Progress 14

UC12 — Track Work Hours & Wages 15

UC13 — Auto-Decrease Stock 16

UC14 — Low-Stock Alert 16

UC15 — Generate Cost Estimation 17

Adopted Methodology 17

Why This Model? 17

Phases of the VU Process Model 18

1. Requirements Phase 18

2. Planning Phase 18

3. Risk Analysis Phase 18

4. Design Phase 18

5. Development Phase 18

6. Testing Phase 18

7. Client Evaluation Phase 18

8. Acceptance Phase 18

Reasons for Selecting the VU Process Model 19

Work Plan (Use MS Project to create Schedule/Work Plan) 20

SRS Document

# Scope of Project:

The Woodcraft Management System is a web-based application developed to automate and streamline the internal operations of woodcraft workshops and small to medium furniture manufacturing businesses. The system replaces manual record-keeping with a centralized digital platform, enabling accurate tracking of orders, materials, employees, and financial activities. The system is implemented as a full-stack web application using Next.js with integrated frontend and backend capabilities, and MongoDB as the database.

The scope of the project includes:

Digital registration and management of customers and their orders

Tracking of order progress through defined stages (Pending → In Progress → Completed → Delivered)

Inventory and raw material management with controlled stock deduction and low stock alerts

Assignment of workers to jobs, monitoring of work hours, and calculation of labor cost

Automated invoice generation and recording of partial or full payments

Reporting on income, expenses, material usage, employee performance, and order timelines

A unified administrative dashboard providing real-time insights into orders, inventory, and financial data

Management of employees along with their skill types to support efficient task allocation and workforce management.

This system will serve as an internal management tool for system administrators and employees (workers/craftsmen). It focuses on ensuring accurate data management, real-time tracking, and streamlined business operations.

# Functional and Non-Functional Requirements:

## Functional Requirements:

### 1. Customer & Order Management

The system shall allow the registration and management of customer records with their contact details.

The system shall allow the admin to create new orders (furniture, repairs, custom designs).

The system shall maintain a complete history of all customer orders.

The system shall allow the admin to update order details until the order reaches the “Completed” status.

The system shall track order status through the following stages: Pending → In Progress → Completed → Delivered.

### 2. Inventory & Material Management

The system shall store details of all raw materials (wood, polish, paint, tools, etc.).

The system shall deduct material quantity from stock only when the order is confirmed or materials are officially allocated.

The system shall notify the admin when material stock falls below a defined threshold.

The system shall maintain supplier information for material restocking.

### 3. Employee & Labor Management

The system shall allow assigning employees (workers/craftsmen) to specific orders.

The system shall categorize employees based on their skill type (e.g., carpenter, painter, polisher) to support efficient task assignment and performance tracking.

The system shall track employee working hours for each assigned task.

The system shall calculate labor cost automatically based on recorded work hours and predefined rates.

The system shall generate reports on employee performance and workload.

### 4. Billing & Payment Management

The system shall generate invoices upon order completion when initiated by the admin.

The system shall record partial and full payments received from customers.

The system shall display outstanding balances for any unpaid orders.

### 5. Reports & Analytics

The system shall generate monthly financial reports showing income and expenses.

The system shall generate material usage and stock consumption reports.

The system shall generate employee productivity reports.

The system shall generate order timeline reports showing start date, end date, and total time taken.

## Non-Functional Requirements

### 1. Performance

Standard system operations shall respond within 1–2 seconds under normal conditions.

System updates (inventory, status changes) shall reflect without noticeable delay after successful operations.

### 2. Reliability

The system shall ensure data consistency and integrity during normal operations.

The system shall allow the admin to create manual backups of the database.

### 3. Usability

The system shall provide a user-friendly interface suitable for non-technical staff.

The system shall be responsive and functional on desktop, tablet, and mobile browsers.

### 4. Security

Only authenticated users shall access the system through secure login.

Authentication and session management shall be implemented using secure mechanisms.

Admin-only actions (delete, modify critical data) shall be restricted.

Sensitive data shall be stored in encrypted or hashed form.

### 5. Maintainability

The system shall follow a modular, component-based architecture to support easy maintenance and updates.

New features shall be integrable without major restructuring.

### 6. Scalability

The system shall support increasing orders, inventory items, and employee records without significant performance degradation.

# Use Case Diagram(s):

# Usage Scenarios:

## UC01 — Register Employee

| Field | Details |
| --- | --- |
| Use Case ID | UC01 |
| Title | Register Employee |
| Description | Admin registers a new employee in the system by providing required details and login credentials. |
| Actor(s) | Admin |
| Pre-Condition | Admin is logged into the system. |
| Post-Condition | Employee account is created and stored in the system with login credentials. |
| Main Flow | 1. Admin opens employee registration form.
2. Admin enters employee details (name, email, role, employee type, hourly rate).
3. Admin sets or system generates a password.
4. Admin submits the form.
5. System validates input data.
6. System checks for duplicate email.
7. System saves employee record. |
| Alternative Flow | A1: Missing or invalid fields → System displays validation error.
A2: Duplicate email → System shows warning and prevents saving. |
| Exceptions | E1: Database failure → System displays error message. |
| Author | BC210202812 |

## UC02 — Register Customer

| Field | Details |
| --- | --- |
| Use Case ID | UC02 |
| Title | Register Customer |
| Description | Admin registers a new customer with contact details. |
| Actor(s) | Admin |
| Pre-Condition | Admin is logged into the system. |
| Post-Condition | Customer details are successfully stored in the system. |
| Main Flow | 1. Admin opens customer registration form.
2. Admin enters customer details (name, phone, email, address).
3. Admin submits the form.
4. System validates input data.
5. System checks for duplicate customer (phone/email).
6. System saves customer record. |
| Alternative Flow | A1: Missing or invalid fields → System displays validation error.
A2: Duplicate customer detected → System shows warning and prevents saving. |
| Exceptions | E1: Database failure → System displays error message. |
| Author | BC210202812 |

## UC03 — Create Order

| Field | Details |
| --- | --- |
| Use Case ID | UC03 |
| Title | Create Order |
| Description | Admin creates new order for furniture/custom work. |
| Actor(s) | Admin |
| Pre-Condition | Customer exists in the system. |
| Post-Condition | Order is saved with “Pending” status. |
| Main Flow | 1. Admin selects customer.
2. Admin enters order details (type, description, quantity).
3. Admin selects required materials.
4. System triggers UC15 (Cost Estimation).
5. System displays estimated cost.
6. Admin reviews and confirms the order.
7. System creates the order with “Pending” status. |
| Alternative Flow | A1: Required materials unavailable → System shows warning and prevents order creation. |
| Exceptions | E1: Stock data missing → System displays error and stops process. |
| Author | BC210202812 |

## UC04 — Track Order Status

| Field | Details |
| --- | --- |
| Use Case ID | UC04 |
| Title | Track Order Status |
| Description | Admin and employee view the current status and progress of an order. |
| Actor(s) | Admin, Employee |
| Pre-Condition | Order exists in the system. |
| Post-Condition | Order status and progress details are displayed. |
| Main Flow | 1. User selects an order.
2. System retrieves order details.
3. System displays current status (Pending → In Progress → Completed → Delivered).
4. System displays progress history (if available). |
| Alternative Flow | A1: No progress updates available → System displays current status only. |
| Exceptions | E1: Order not found → System displays error message. |
| Author | BC210202812 |

## UC05 — Manage Raw Materials

| Field | Details |
| --- | --- |
| Use Case ID | UC05 |
| Title | Manage Raw Materials |
| Description | Admin manages inventory items including adding, updating, and deleting raw materials along with their associated details. |
| Actor(s) | Admin |
| Pre-Condition | Admin is logged into the system. |
| Post-Condition | Material data is successfully updated and stored in the system. |
| Main Flow | 1. Admin opens inventory management module.
2. System displays list of available materials.
3. Admin adds a new material or selects an existing material.
4. Admin enters or updates material details (name, quantity, unit price, supplier, threshold level).
5. Admin confirms the operation (add/update/delete).
6. System validates input data.
7. System saves changes to the database. |
| Alternative Flow | A1: Invalid input (e.g., negative quantity, missing required fields) → System displays validation error and prevents saving.
A2: Duplicate material entry → System shows warning and prevents duplication. |
| Exceptions | E1: Material record not found → System displays error message.
E2: Database error → System displays error and stops operation. |
| Author | BC210202812 |

## UC06 — Assign Worker to Job

| Field | Details |
| --- | --- |
| Use Case ID | UC06 |
| Title | Assign Worker to Job |
| Description | Admin assigns one or more employees (workers/craftsmen) to a specific order. |
| Actor(s) | Admin |
| Pre-Condition | Worker exists and is available; order exists in the system. |
| Post-Condition | Worker(s) successfully assigned to the order. |
| Main Flow | 1. Admin opens order details.
2. System displays list of available workers.
3. Admin selects one or more workers.
4. Admin confirms assignment.
5. System validates worker availability.
6. System assigns worker(s) to the order and saves changes. |
| Alternative Flow | A1: Worker already assigned → System displays warning.
A2: Selected worker unavailable → System prevents assignment and shows message. |
| Exceptions | E1: Worker record not found → System displays error message. |
| Author | BC210202812 |

## UC07 — Generate Invoice

| Field | Details |
| --- | --- |
| Use Case ID | UC07 |
| Title | Generate Invoice |
| Description | Admin generates an invoice for a completed order. |
| Actor(s) | Admin |
| Pre-Condition | Order is marked as "Completed". |
| Post-Condition | Invoice is successfully created and stored in the system. |
| Main Flow | 1. Admin opens completed order.
2. Admin requests invoice generation.
3. System retrieves final cost (materials + labor).
4. System displays invoice details.
5. Admin reviews and confirms.
6. System generates and saves the invoice. |
| Alternative Flow | A1: Invoice already generated → System displays warning and prevents duplication. |
| Exceptions | E1: Cost data missing → System displays error message and stops process. |
| Author | BC210202812 |

## UC08 — Record Payment

| Field | Details |
| --- | --- |
| Use Case ID | UC08 |
| Title | Record Payment |
| Description | Admin records partial or full payment for a customer invoice. |
| Actor(s) | Admin |
| Pre-Condition | Invoice exists in the system. |
| Post-Condition | Payment is recorded and invoice balance is updated. |
| Main Flow | 1. Admin opens invoice details.
2. System displays invoice amount and remaining balance.
3. Admin clicks “Add Payment”.
4. Admin enters payment amount.
5. System validates payment amount.
6. System records payment and updates remaining balance.
7. System displays updated payment status. |
| Alternative Flow | A1: Payment amount exceeds due → System displays error and prevents saving.
A2: Invalid amount (≤ 0) → System displays validation error. |
| Exceptions | E1: Database failure → System displays error message. |
| Author | BC210202812 |

## UC09 — Track Employee Performance

| Field | Details |
| --- | --- |
| Use Case ID | UC09 |
| Title | Track Employee Performance |
| Description | Admin reviews performance metrics of employees based on completed tasks and work records. |
| Actor(s) | Admin |
| Pre-Condition | Employee records and completed task data exist in the system. |
| Post-Condition | Employee performance data is displayed. |
| Main Flow | 1. Admin selects an employee.
2. Admin selects a time range (e.g., monthly or custom).
3. System retrieves employee task and work history.
4. System calculates performance metrics (tasks completed, hours worked, efficiency).
5. System displays performance report. |
| Alternative Flow | A1: No records found → System displays “No performance data available”. |
| Exceptions | E1: Error in fetching data → System displays error message. |
| Author | BC210202812 |

## UC10 — Generate Reports & Analytics

| Field | Details |
| --- | --- |
| Use Case ID | UC10 |
| Title | Generate Reports & Analytics |
| Description | Admin generates financial and operational reports based on system data. |
| Actor(s) | Admin |
| Pre-Condition | Relevant data exists in the system. |
| Post-Condition | Report is displayed and optionally exported. |
| Main Flow | 1. Admin opens Reports module.
2. Admin selects report type (financial, material usage, employee performance, order timeline).
3. Admin selects date range or filters.
4. System retrieves relevant data.
5. System generates report.
6. System displays report and provides export option (e.g., PDF/CSV). |
| Alternative Flow | A1: Invalid date range → System displays validation error and prevents report generation. |
| Exceptions | E1: System timeout or data retrieval error → System displays error message. |
| Author | BC210202812 |

## UC11 — Update Task Progress

| Field | Details |
| --- | --- |
| Use Case ID | UC11 |
| Title | Update Task Progress |
| Description | Employee updates the progress status of assigned tasks within an order. |
| Actor(s) | Employee |
| Pre-Condition | Employee is assigned to the order. |
| Post-Condition | Order progress is updated and recorded in the system. |
| Main Flow | 1. Employee opens assigned order.
2. System displays current order status.
3. Employee selects next progress stage.
4. Employee submits update.
5. System validates allowed status transition.
6. System updates order status and logs progress change.
7. System displays confirmation of successful update. |
| Alternative Flow | A1: Invalid status transition → System rejects update and displays error.
A2: Employee selects same status → System shows warning and prevents update. |
| Exceptions | E1: Order not assigned to employee → System denies access and displays error message. |
| Author | BC210202812 |

## UC12 — Track Work Hours & Wages

| Field | Details |
| --- | --- |
| Use Case ID | UC12 |
| Title | Track Work Hours & Wages |
| Description | Employee records work hours for assigned tasks, and the system calculates wages based on approved hours. |
| Actor(s) | Employee, Admin |
| Pre-Condition | Employee is assigned to a job. |
| Post-Condition | Work hours are recorded and wages are calculated and updated. |
| Main Flow | 1. Employee opens assigned task.
2. Employee enters work hours.
3. System validates entered hours.
4. Admin reviews submitted hours.
5. Admin approves or modifies hours.
6. System calculates wages using predefined rates.
7. System updates wage record and displays confirmation. |
| Alternative Flow | A1: Employee does not enter hours → No update performed.
A2: Admin rejects hours → System notifies employee and does not update wages. |
| Exceptions | E1: Invalid hours (negative, zero, or excessively large) → System displays validation error. |
| Author | BC210202812 |

## UC13 — Auto-Decrease Stock

| Field | Details |
| --- | --- |
| Use Case ID | UC13 |
| Title | Auto-Decrease Stock |
| Description | System automatically deducts material quantity when materials are assigned during order creation. |
| Actor(s) | Admin |
| Pre-Condition | Materials are selected and assigned to an order. |
| Post-Condition | Inventory stock levels are updated. |
| Main Flow | 1. System receives material assignment from order creation.
2. System checks availability of required materials.
3. System validates sufficient stock quantity.
4. System deducts allocated quantity from inventory.
5. System updates stock levels in the database. |
| Alternative Flow | A1: Insufficient stock → System displays warning and prevents order confirmation. |
| Exceptions | E1: Database error → System displays error message and stops operation. |
| Author | BC210202812 |

## UC14 — Low-Stock Alert

| Field | Details |
| --- | --- |
| Use Case ID | UC14 |
| Title | Low-Stock Alert |
| Description | System notifies the admin when material stock falls below a defined threshold. |
| Actor(s) | Admin |
| Pre-Condition | Stock update occurs in the system. |
| Post-Condition | Low-stock notification is generated and displayed to the admin. |
| Main Flow | 1. System updates inventory after stock change.
2. System compares current stock with predefined threshold.
3. If stock is below threshold, system generates alert.
4. System displays notification to admin. |
| Alternative Flow | A1: Stock level above threshold → No alert generated. |
| Exceptions | E1: Notification system failure → System logs error and displays message. |
| Author | BC210202812 |

## UC15 — Generate Cost Estimation

| Field | Details |
| --- | --- |
| Use Case ID | UC15 |
| Title | Generate Cost Estimation |
| Description | System calculates estimated cost of an order based on selected materials and labor charges. |
| Actor(s) | Admin |
| Pre-Condition | Materials and labor details are selected for the order. |
| Post-Condition | Estimated cost is calculated and displayed. |
| Main Flow | 1. Admin selects materials and labor details during order creation.
2. System fetches material prices.
3. System calculates total material cost.
4. System calculates labor cost based on predefined rates.
5. System combines both values to generate total estimated cost.
6. System displays estimated cost to the admin. |
| Alternative Flow | A1: Required data missing → System displays error and prevents estimation. |
| Exceptions | E1: Data retrieval error → System displays error message. |
| Author | BC210202812 |

# Adopted Methodology

The VU Process Model has been adopted as the development methodology for this project. It is a hybrid software development model that combines the structured, phase-based progression of the Waterfall Model with the iterative risk-handling cycle of the Spiral Model. This model is recommended in Virtual University projects because it ensures clear documentation while also allowing controlled iteration whenever refinement is required.

## Why This Model?

Waterfall provides well-defined sequential phases, complete documentation, and clear deliverables.

Spiral provides risk analysis, prototyping, and iteration, ensuring that uncertainties are handled early.

The combination ensures a structured yet flexible development process suitable for both academic and real-world projects.

## Phases of the VU Process Model

### 1. Requirements Phase

All functional and non-functional requirements are gathered, analyzed, and documented. This phase ensures complete understanding of the system goals before design begins.

### 2. Planning Phase

Work planning, activity scheduling, resource estimation, and feasibility considerations are performed. Project scope and constraints are finalized in this phase.

### 3. Risk Analysis Phase

Technical, financial, and operational risks are identified and evaluated before development begins. If a requirement or feature involves uncertainty, prototypes or alternate solutions are considered before moving forward.

### 4. Design Phase

System architecture, database structure, interfaces, workflows, and module designs are prepared. This phase determines how the system will be built.

### 5. Development Phase

Actual coding and integration of system components take place. Modules are implemented based on the approved design. Code is produced incrementally to reduce risk.

### 6. Testing Phase

Unit testing, integration testing, and system testing are performed to ensure that the software meets all documented requirements and works correctly.

### 7. Client Evaluation Phase

The completed system or incremental build is shared with the client for review. Feedback is collected regarding correctness, usability, and completeness.

If major issues arise, the model allows returning to earlier phases—following the Spiral-based iteration loop.

### 8. Acceptance Phase

Once the system passes testing and the client approves the deliverables, it moves to acceptance. The finalized system is prepared for deployment and use.

## Reasons for Selecting the VU Process Model

Provides sequential clarity, documentation, and controlled progress (Waterfall).

Allows iteration, improvement, and handling of changes when needed (Spiral).

Supports early risk detection and mitigation before full development.

Ensures better quality and reduced rework for academic-scale projects.

Suitable for systems like Woodcraft where business logic, workflow, and reporting are well-defined but may evolve during development.

# Work Plan (Use MS Project to create Schedule/Work Plan)
