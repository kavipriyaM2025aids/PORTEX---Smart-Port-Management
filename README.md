# PORTEX - Smart Port Management System

A full-stack, enterprise-grade Smart Port Management System built with **Spring Boot 4**, **Java 17**, and **React 19 (Vite + Tailwind CSS)**.

---

## 🌟 Key Features

- **Container Management:** Track container locations, shipping lines, ISO codes, weights, and status lifecycle.
- **Gate Entry & Weighbridge:** Automated gate passes, truck entry/exit logging, and gross/tare weighbridge readings.
- **Berth & Vessel Operations:** Real-time berth assignments, vessel berthing schedules, and vessel turnaround metrics.
- **Financial & Accounting Suite:**
  - Sales Orders, Customer Invoicing, and Payment recording
  - Purchase Orders, Vendor Bills, and Vendor Payments
  - Analytic Accounts, Budgets, and Journal Entries
  - Automated Balance Sheet & Profit & Loss generation
- **Role-Based Access Control (RBAC):**
  - **Port Logistics Director (Admin):** Complete control across port operations, terminal management, and logistics.
  - **Terminal Accountant:** Dedicated access to billing, invoicing, payments, and financial auditing.

---

## 🛠️ Technology Stack

- **Backend:** Spring Boot 4.x, Java 17, Spring Data JPA, Hibernate, Tomcat
- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide Icons, Axios
- **Database:** MySQL 8.x
- **Build Tools:** Apache Maven (mvnw), Node.js & npm

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+ & npm
- MySQL 8.0 running locally on port 3306 with database smart_port_management

### 1. Backend Setup
1. Configure database credentials in src/main/resources/application.properties.
2. Start the Spring Boot backend:
   `ash
   ./mvnw spring-boot:run
   `
   Backend will start at: http://localhost:8080

### 2. Frontend Setup
1. Navigate to the rontend directory:
   `ash
   cd frontend
   npm install
   npm run dev
   `
   Frontend will start at: http://localhost:5173

---

## 🔑 Default Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Port Director (Admin)** | dmin | dmin123 |
| **Terminal Accountant** | ccountant | ccountant123 |
