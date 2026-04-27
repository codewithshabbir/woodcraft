# Extracted: Design Document Doc.docx

Woodcraft

Design Document

# Version 1.0

# Group Id: F25PROJECTEB2A1

# Supervisor Name: Abdul Majid Khokhar

Revision History

| Date (dd/mm/yyyy) | Version | Description | Author |
| --- | --- | --- | --- |
| 12/04/2026 | 1.0 | A complete and structured version of the design document including:
System Architecture, ERD, Sequence Diagrams, Class Diagram, Database Design, Interface Design, and Test Cases. | Bc210202812 |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

Table of Contents

Introduction of Design Document 4

Entity Relationship Diagram (ERD) 6

Sequence Diagrams 7

3. UC03 — Track Order Status 9

4. UC04 — Manage Raw Materials 10

5. UC05 — Assign Worker to Job 11

6. UC06 — Generate Invoice 12

7. UC07 — Record Payment 13

8. UC08 — Track Employee Performance 13

9. UC09 — Generate Reports & Analytics 14

10. UC10 — Update Task Progress 14

11. UC11 — Track Work Hours & Wages 15

12. UC12 — Auto-Decrease Stock 16

13. UC13 — Low-Stock Alert 16

14. UC14 — Generate Cost Estimation 17

Architecture Design Diagram 17

Class Diagram 22

Database Design 24

Interface Design 25

Test Cases 29

# Introduction of Design Document

This Design Document presents the technical design of the Woodcraft Management System, developed in accordance with the approved Software Requirements Specification (SRS). While the SRS defines what the system should do, this document describes how the system is designed to fulfill those requirements.

The Woodcraft Management System is implemented as a full-stack web application using modern technologies:

Next.js (App Router) for full-stack development, handling both frontend user interface and backend API logic

MongoDB as the NoSQL database for efficient data storage and management

This document provides detailed technical representations of the system, including:

Entity Relationship Diagram (ERD) to define database entities and relationships

Architecture Design Diagram illustrating the overall system structure and component interaction

Sequence Diagrams showing interactions between users, application layers, and the database

Class Diagram representing core system entities and their relationships

Database Design describing collections and data organization

Interface Design outlining key system screens and user interaction flow

Test Cases to validate system functionality

The purpose of the design phase is to transform system requirements into a clear and structured technical solution. It acts as a bridge between analysis and development, ensuring that the system is properly organized before implementation begins.

This phase provides several benefits:

Clearly defines system architecture and module responsibilities

Ensures the database structure supports all functional requirements

Identifies potential technical risks before development

Improves maintainability through modular design

Supports scalability as the system grows

Reduces rework by eliminating ambiguity before implementation

By preparing this design document, the project ensures that development follows a clear technical blueprint, resulting in a reliable, scalable, and maintainable Woodcraft Management System.

# Entity Relationship Diagram (ERD)

# Sequence Diagrams

# UC01 — Register Employee

# UC02 — Register Customer

# UC03 — Create Order

# UC04 — Track Order Status

# UC05 — Manage Raw Materials

# UC06 — Assign Worker to Job

# UC07 — Generate Invoice

# UC08 — Record Payment

# UC09 — Track Employee Performance

# UC10 — Generate Reports

# UC11 — Update Task Progress

# UC12 — Track Work Hours & Wages

# UC13 — Auto Decrease Stock

# UC14 — Low Stock Alert

# UC15 — Generate Cost Estimation

# Architecture Design Diagram

The Woodcraft Management System follows a layered architecture consisting of the Presentation Layer, Application Layer, and Data Layer. This architectural approach ensures clear separation of concerns, making the system more maintainable, scalable, and secure.

# 1. Presentation Layer (Frontend)

The Presentation Layer represents the user interface of the system and handles all user interactions.

Implemented using Next.js (React-based frontend framework)

Provides interactive interfaces for managing system operations

Key interfaces include:

Admin Dashboard UI

Employee Task UI

Order Management UI

Inventory Management UI

Invoice UI

Payment UI

Users interact with the system through these interfaces to perform daily operational tasks.

# 2. Application Layer (Backend / Business Logic)

The Application Layer contains the core backend logic of the system and is implemented using Next.js API Routes.

This layer is responsible for:

Processing requests received from the frontend

Communicating via HTTP requests and JSON responses

Validating input data and enforcing business rules

Executing core application logic

The Application Layer is divided into the following components:

API Routes:

Employee Routes – manage employee-related actions

Customer Routes – handle customer operations

Order Routes – manages order creation and updates

Inventory Routes – handle material and stock operations

Invoice Routes – generate and manage invoices

Payment Routes – processes payments

Report Routes – handle reporting features

Task Routes – manage employee tasks

Validation Layer:

This component ensures that all incoming data is properly validated before processing.

Input validation

Business rule checking

Error handling for invalid requests

Business Logic (Services):

Customer Service – manages customer-related logic

Employee Service – handles employee operations

Order Service – processes orders and status updates

Inventory Service – manages stock updates and deductions

Invoice Service – generates invoices

Payment Service – processes payments and updates balances

Task Service – manages task progress and updates

Report Service – generates reports and analytics

These components work together to ensure that all business rules are properly enforced.

# 3. Data Layer (Database)

The Data Layer is responsible for storing and managing all persistent data using MongoDB.

Key collections include:

Users

Customers

Orders

Materials

Suppliers

WorkLogs

Invoices

Payments

StockLogs

The application layer interacts with the database to perform create, read, update, and delete (CRUD) operations.

Architecture Benefits

This layered architecture provides several advantages:

Clear separation of concerns between frontend, backend, and database

Improved maintainability and scalability

Better organization of business logic

Easier debugging and testing

Flexibility for future system enhancements

Overall, this architecture enables efficient management of woodcraft workshop operations while supporting future system growth.

# Class Diagram

# The class diagram represents the structural design of the Woodcraft Management System. It illustrates the key domain entities, their attributes, and relationships, providing a clear overview of how data is organized and connected within the system.

Core Domain Models (Entities)

Order and Inventory:
Each Order stores the materials used within an embedded structure called materialsUsed, where each item contains a materialId and quantityUsed. This approach follows MongoDB’s document-based model, allowing related data to be stored within a single document for efficient data access and performance.

Employee Management:
The User class represents system users, including both admin and employees. Employee activities are tracked using the WorkLog class, where each work log records the hours worked by a user on a specific order. This information is used for wage calculation and performance tracking.

Billing and Payments:
When an order is completed, an Invoice is generated for that order. Each invoice can have multiple Payment records, enabling support for both partial and full payments.

Overall, the class diagram focuses on the core data structure of the system, ensuring a clear and organized representation of entities and their relationships.

# Database Design

The database of the Woodcraft Management System is implemented using MongoDB, a NoSQL document-based database. It consists of collections such as Users, Customers, Orders, Materials, Suppliers, Invoices, Payments, and WorkLogs.

The system follows a hybrid data modeling approach by combining embedded documents and references to achieve optimal performance and maintain data consistency.

Embedded Structure:
In the Orders collection, materials used in an order are stored as an embedded array (materialsUsed), where each item contains a materialId and quantityUsed. The materialId acts as a reference to the Material collection, allowing efficient linking while avoiding unnecessary duplication. This approach improves read performance by keeping frequently accessed related data within a single document.

Referential Structure:
Relationships between collections are maintained using ObjectId references. For example, Orders reference Customers, WorkLogs reference both Users and Orders, Payments reference Invoices, and Materials reference Suppliers. This ensures flexibility and normalization where required.

This design ensures efficient querying, reduced data duplication, and scalability, while aligning with MongoDB best practices for handling relational data in a document-oriented database.
