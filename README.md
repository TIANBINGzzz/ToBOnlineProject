# Bridge Project

Bridge is a microservices-based project using Spring Cloud for the backend and React for the frontend. It employs JWT for authentication and utilizes MongoDB, MySQL, and Redis for data storage.
The purpose of this project is to create a platform for browsing and accepting projects. It allows companies to post tasks and professionals to accept projects, connecting professionals with companies and serving as a bridge between users.

---

## **Tech Stack**

- **Backend**: Spring Cloud microservices architecture  
- **Frontend**: React  
- **Authentication**: JWT (JSON Web Token)  
- **Databases**:  
  - **MySQL**: For relational data storage  
  - **MongoDB**: For non-relational data storage  
  - **Redis**: For caching  
- **Messaging**:  
  - **RabbitMQ**: For asynchronous communication between services  
- **Service Discovery**:  
  - **Nacos**: For service registration and configuration management  

---

## **Microservices**

The project includes the following microservices:

1. **bridge-common**: Provides shared utilities and modules.  
2. **project-service**: Handles business logic related to projects.  
3. **user-service**: Manages user-related business logic.  
4. **bridge-gateway**: API gateway for request routing and load balancing.  
5. **application-service**: Manages application-related business logic.  
6. **bridge-api**: Unified API interface for external calls.  
7. **notification-service**: Handles sending and managing notifications, including RabbitMQ message processing.  

---

## **Running the Project**

### **Frontend**

1. Switch to the `frontend` branch and download the code.  
2. Navigate to the frontend directory and install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend service:

   ```bash
   npm start
   ```

### **Backend**

1. Switch to the `backend` branch and download the code.  
2. Ensure you are using **JDK 17**.  
3. Set up the databases (MySQL, MongoDB, Redis) and RabbitMQ, then start all the backend services(application-service, notification-service, user-service, bridge-gateway, project-service).  


**Quick Start Option**:  
Use the provided `Dockerfile` and `docker-compose.yml` to start the databases, RabbitMQ, and backend services.

---

### **Using Docker**

1. Open a terminal and run the following command:

   ```bash
   docker compose up
   ```

2. Open your browser and navigate to `http://localhost:3000` (or the configured frontend port) to access the application.

---

## **Notes**

1. Ensure MySQL, MongoDB, Redis, nacos and RabbitMQ are configured, or use Docker for quick setup.  
2. Default ports:  
   - **Frontend**: `3000`  
   - **Backend**: `8080`  
   - **RabbitMQ**: `25672` (or your configured port)  
   (Customizable as needed).  

3. The backend requires JDK 17; ensure your local environment is correctly configured.

---
