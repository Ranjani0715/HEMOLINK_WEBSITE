# HemoLink - Full Stack Smart Blood Donation System
**Technologies:** React (JavaScript), Java Spring Boot 3.2, MySQL, Maven, Spring Security.

## 🚀 Project Overview
HemoLink is an enterprise-grade medical response application. It uses a **Java Spring Boot** backend to handle complex business logic, including a smart matching algorithm for donors and recipients, with **MySQL** as the primary relational database.

## 📁 Repository Structure
- `/backend`: Maven-based Spring Boot project.
  - `src/main/java`: Controllers, Services, Entities (JPA), and Security config.
  - `pom.xml`: Dependency management (Spring Web, Security, Data JPA, MySQL Connector).
- `/src`: React (JavaScript) frontend using Vite.
- `schema.sql`: Database initialization script for MySQL.

## ⚙️ How to Run Locally

### 1. Database Setup (MySQL)
1. Install MySQL Server.
2. Create a database named `hemolink_db`.
3. Execute the contents of `schema.sql` in your MySQL workbench or terminal.

### 2. Backend Setup (Java)
1. Navigate to `/backend`.
2. Open in your favorite IDE (IntelliJ, Eclipse, or VS Code).
3. Update `src/main/resources/application.properties` with your MySQL username and password.
4. Run `mvn spring-boot:run` to start the server at `http://localhost:8080`.

### 3. Frontend Setup (React)
1. In the root directory, run `npm install`.
2. Run `npm run dev` to start the development server.
3. The frontend is configured to proxy `/api` requests to `http://localhost:8080`.

## 🧠 Smart Matching Engine (AI Proxy)
The application includes a `MatchingService.java` which implements a weighted ranking algorithm. It calculates a "Priority Score" for donors based on:
1. **Compatibility**: Strict blood type matching (O- as universal donor).
2. **Distance**: Proximity weighting (using simulated Euclidean distance).
3. **Trust Score**: Historical data points (response rate, verification status).

## 🔒 Security
- **Authentication**: JWT (JSON Web Token) based stateless authentication.
- **Role-Based Access**: Specialized views for Donors, Recipients, and Hospitals enforced via Spring Security `@PreAuthorize`.

## 🛠 Features
- **Donor Dashboard**: Availability toggles and reward points tracking.
- **Recipient Dashboard**: Emergency request creation and status monitoring.
- **Hospital Dashboard**: Inventory visualization via Recharts.
- **Admin Panel**: System log monitoring and API health tracking.
