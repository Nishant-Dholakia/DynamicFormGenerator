# Dynamic Form Generator

<p align="center">
  <img src="https://socialify.git.ci/Nishant-Dholakia/DynamicFormGenerator/image?language=1&name=1&owner=1&pattern=Circuit+Board&stargazers=1&theme=Light" alt="Dynamic Form Generator" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-17+-blue.svg" alt="Java Version" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.0+-green.svg" alt="Spring Boot Version" />
  <img src="https://img.shields.io/badge/React-18+-61DAFB.svg" alt="React Version" />
  <img src="https://img.shields.io/badge/MySQL-8.0+-4479A1.svg" alt="MySQL Version" />
</p>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)

## 📖 About

The **Dynamic Form Generator** is a Java Spring Boot-based application that creates customizable, data-driven forms on the fly from configuration files or database schemas. This eliminates the need for hardcoded UI components and enables rapid form deployment for various business requirements.

Perfect for applications that require flexible form creation without constant development cycles, this tool empowers non-technical users to create complex forms through simple configurations.

## ✨ Features

- **🔄 Dynamic Form Creation** – Generates forms at runtime based on configurations or database schema
- **⚙️ Configurable Fields** – Supports text, number, date, dropdowns, checkboxes, radio buttons, and more
- **💾 Database Integration** – Stores form definitions and submissions directly in a database
- **🔌 REST API Support** – Exposes endpoints to create, fetch, and submit forms programmatically
- **📋 Multi-Form Support** – Handles multiple forms with unique structures in a single application
- **🔐 Role-Based Access** – Restricts form creation or submission based on user roles
- **🔧 Extensibility** – Easily add new field types or custom validation rules
- **📱 Responsive Design** – Works seamlessly across desktop and mobile devices
- **✅ Built-in Validation** – Comprehensive client and server-side validation
- **📊 Form Analytics** – Track form submissions and user interactions

## 🛠️ Tech Stack

**Backend:**
- Java 17+
- Spring Boot 3.0+
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate ORM
- MySQL
- Lombok

**Frontend:**
- React 18+
- HTML5/CSS3
- JavaScript ES6+

**Tools & Testing:**
- Maven
- Postman
- JUnit

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK) 17 or higher**
- **Maven 3.6 or higher**
- **MySQL 8.0 or higher**
- **Node.js 16+ and npm** (for React frontend)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Nishant-Dholakia/DynamicFormGenerator.git
cd DynamicFormGenerator
```

### 2. Verify System Requirements

```bash
# Check Java version
java --version

# Check Maven version
mvn --version

# Check Node.js version (if using React frontend)
node --version
npm --version
```

### 3. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE dynamic_forms;
CREATE USER 'form_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON dynamic_forms.* TO 'form_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Maven dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

### 5. Frontend Setup (if applicable)

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start the development server
npm start
```

## ⚙️ Configuration

### Application Properties

Update `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/dynamic_forms
spring.datasource.username=form_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server Configuration
server.port=8080

# Security Configuration
app.jwt.secret=your-jwt-secret
app.jwt.expiration=86400000
```

### Environment Variables

For production deployment, set these environment variables:

```bash
export DB_HOST=your-database-host
export DB_PORT=3306
export DB_NAME=dynamic_forms
export DB_USERNAME=your-username
export DB_PASSWORD=your-password
export JWT_SECRET=your-jwt-secret
```

## 📚 API Documentation

### Form Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/forms` | Get all forms |
| `GET` | `/api/forms/{id}` | Get form by ID |
| `POST` | `/api/forms` | Create new form |
| `PUT` | `/api/forms/{id}` | Update existing form |
| `DELETE` | `/api/forms/{id}` | Delete form |

### Form Submission Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/forms/{id}/submit` | Submit form data |
| `GET` | `/api/forms/{id}/submissions` | Get all submissions for a form |
| `GET` | `/api/submissions/{id}` | Get specific submission |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/refresh` | Refresh JWT token |

For detailed API documentation, visit `http://localhost:8080/swagger-ui.html` after starting the application.

## 🧪 Testing

### Run Unit Tests

```bash
mvn test
```

### Run Integration Tests

```bash
mvn verify
```

### API Testing with Postman

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- React team for the frontend framework
---

<p align="center">
  Made with ❤️ by <a href="https://github.com/Nishant-Dholakia">Nishant Dholakia</a>
</p>
