# Emergency Incident Reporting System - Frontend Microservice

A modern, high-performance React SPA frontend microservice for the **Emergency Incident Reporting System**, designed for real-time dispatch monitoring, incident creation, status updates, and audit timeline tracking.

Connected to backend API base URL: `http://52.63.212.154`
GitHub Repository: [https://github.com/Anubhavsaxena2004/incident_frontend](https://github.com/Anubhavsaxena2004/incident_frontend)

---

## 🚀 Key Features

- **Emergency Command Center UI**: Built with a sleek dark command center aesthetic, high-contrast badges, status indicators, and glassmorphism styling.
- **Full Authentication Suite**: Login & Registration for Citizens and Operators with JWT storage, auto Bearer header injection, and 401 token refresh queue.
- **Incident Dashboard**: Live statistics counters for Total, Pending/Reported, Active Response, and Critical/High emergencies.
- **Multi-Param Filtering & Search**: Instant client & server side filtering by category (`ACCIDENT`, `FIRE`, `CRIME`, `MEDICAL`, `NATURAL_DISASTER`, `OTHER`), status, and priority.
- **Incident Dispatch & Reporting**: Interactive modal to submit new incidents with automatic GPS geolocation or manual coordinate input.
- **Audit Timeline & Assignment Logs**: Modal tab views for tracking step-by-step status transitions and operator reassignments.
- **Dockerized Microservice**: Containerized multi-stage Docker build ready for Nginx deployment.

---

## 🛠️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://52.63.212.154
```

---

## 💻 Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🐳 Running with Docker

1. **Build & Start Container**:
   ```bash
   docker-compose up -d --build
   ```

2. **Access Service**:
   Open browser at `http://localhost:3000`.

---

## 🔗 Integrated Backend Endpoints

| Endpoint | Method | Purpose | Auth |
| :--- | :--- | :--- | :--- |
| `/api/users/register/` | POST | User Registration | Not Required |
| `/api/users/login/` | POST | User Login & Tokens | Not Required |
| `/api/users/token/refresh/` | POST | Refresh Access Token | Not Required |
| `/api/users/logout/` | POST | Logout & Blacklist Token | Bearer Token |
| `/api/users/me/` | GET | Current User Profile | Bearer Token |
| `/api/incidents/` | POST | Create New Incident | Bearer Token |
| `/api/incidents/` | GET | List All Incidents | Bearer Token |
| `/api/incidents/{id}/` | GET | Get Incident by ID | Bearer Token |
| `/api/incidents/{id}/` | PATCH | Update Status / Assignment | Bearer Token |
| `/api/incidents/{id}/` | DELETE | Delete Incident | Bearer Token |
| `/api/incidents/{id}/timeline/` | GET | Status Transition Timeline | Bearer Token |
| `/api/incidents/{id}/assignments/` | GET | Assignment History Log | Bearer Token |

---

## 📖 API Documentation Links

- **Swagger UI**: [http://52.63.212.154/api/schema/swagger-ui/](http://52.63.212.154/api/schema/swagger-ui/)
- **ReDoc**: [http://52.63.212.154/api/schema/redoc/](http://52.63.212.154/api/schema/redoc/)
