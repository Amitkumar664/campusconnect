# CampusConnect – College Booking Management & Business Analytics Platform

> **A centralized, multi-tenant academic operations and resource orchestration platform built on the MERN stack.** Designed for university institutions to digitize faculty doubt-clearing sessions, manage college event ticketing with duplicate prevention, reserve campus classrooms and laboratory assets with smart conflict detection, and deliver real-time administrative business intelligence through MongoDB aggregation pipelines.

---

## 🌟 Key Functional Pillars

### 1. 🎓 Faculty Doubt-Clearing Session Booking
- **Professor Profiles**: Browse faculty directory filtered by academic department, research specializations, and cabin locations.
- **Dynamic Slot Generation**: Automatically splits professor weekly office hours into discrete, bookable time windows (15, 30, 45, or 60 minutes).
- **Faculty Availability Planner**: Professors configure weekly working days, block personal leaves or exam dates, and accept/reject requests with mandatory explanation reasons.

### 2. 🏛️ Classroom & Laboratory Resource Allocation
- **Facility Directory**: Browse computer labs (GPU workstations, LAN), lecture amphitheaters, smart classrooms, and auditoriums with live capacity filters.
- **Smart Conflict Detection Engine**: Prevents double bookings mathematically on both client and backend layers (`RequestedStart < ExistingEnd AND RequestedEnd > ExistingStart`).
- **Administrative Approval Workflow**: Resource requests start in `pending` review and can be approved or rejected with automated notifications dispatched to creators.

### 3. 🎟️ College Event Registration & Digital Pass System
- **Event Publishing**: Administrators publish hackathons, workshops, and technical symposiums with custom banner media, venues, dates, and strict seating caps.
- **Concurrency-Safe Registrations**: Atomic MongoDB `$inc` with `$lt` capacity conditions guarantees that events never overbook.
- **Unique Digital Ticket Generation**: Issues tamper-evident admission codes (e.g., `CC-HACK-7721`) upon registration.
- **Duplicate Prevention**: Compound database unique index (`{ event: 1, user: 1 }`) blocks multiple simultaneous registrations by the same student.

### 4. 📊 Executive Business Analytics Engine (Section 9 Compliance)
- **100% Real-Time Aggregation**: All KPIs and visualizations are calculated dynamically from operational MongoDB records without mock data.
- **7 Master Institutional KPIs**:
  1. *Total Bookings*
  2. *Total Event Registrations*
  3. *Total Faculty Doubt Sessions*
  4. *Total Resource Bookings*
  5. *Total Active Students*
  6. *Booking Approval Rate (%)*
  7. *Campus Resource Utilization Rate (%)*
- **Interactive Recharts Visualizations**:
  - Daily/Weekly/Monthly booking volume trajectory (AreaChart).
  - Status allocation breakdown (DonutChart).
  - Most frequently booked facilities ranked by hours occupied (BarChart).
  - Event capacity fill rates vs. confirmed turnouts (BarChart).
  - Faculty mentorship demand and fulfillment rate table.
- **CSV Data Export**: 1-click streaming export of raw booking and event registries for administrative accreditation audits.

### 5. 🔔 In-App Notification Center
- Real-time notification badge with unread counters.
- Dispatched automatically upon booking approval, rejection, cancellation, or event ticket issuance.

---

## 🎨 UI/UX Design System (Obsidian Emerald Theme)

Directly inspired by modern SaaS product design:
- **Palette**: Deep forest obsidian background (`#080D0C`), elevated card surfaces (`#131F1C`), glowing emerald accents (`#10B981` / `#34D399`), warm amber action buttons (`#F59E0B`), and crystal glassmorphism borders (`rgba(255, 255, 255, 0.08)`).
- **Collapsible Navigation**: Responsive drawer sidebar tailored to the authenticated role.
- **Presentation 1-Click Fast Login**: Fast-fill credentials for examiners to test Admin, Faculty, and Student workflows instantly.

---

## 🔑 Demo Institutional Credentials

| Role | Email Address | Password | Profile Context |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@campusconnect.edu` | `Admin@123` | Central Registrar & Master Analytics Admin |
| **Faculty 1** | `dr.sharma@campusconnect.edu` | `Faculty@123` | Head of Computer Science & Engineering |
| **Faculty 2** | `prof.patel@campusconnect.edu` | `Faculty@123` | Associate Professor (AI & Machine Learning) |
| **Student 1** | `aarav.student@campusconnect.edu` | `Student@123` | B.Tech CSE Final Year (STU-2023-CS-042) |
| **Student 2** | `riya.student@campusconnect.edu` | `Student@123` | B.Tech IT 3rd Year (STU-2023-IT-088) |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6, Tailwind CSS, Lucide React, Recharts, React Router DOM v7, Axios.
- **Backend**: Node.js, Express.js 5, JSON Web Tokens (JWT), bcryptjs, Morgan, CORS.
- **Database**: MongoDB 8.0, Mongoose ODM 9.
- **Testing & Verification**: Postman, REST client scripts, automated DB conflict collision tests.

---

## 📐 Mathematical Model of Conflict Detection

For any requested time interval $[S_{\text{req}}, E_{\text{req}})$ on date $D$ against target entity $T$ (Faculty or Classroom):

$$\text{Conflict} \iff \exists B \in \text{Bookings}(T, D) \text{ such that } S_{\text{existing}} < E_{\text{req}} \land E_{\text{existing}} > S_{\text{req}}$$

All times are normalized into integer **Minutes Since Midnight** (e.g. `14:30` = $14 \times 60 + 30 = 870$). The MongoDB engine enforces this atomically:

```javascript
const conflict = await Booking.findOne({
  date: requestedDate,
  status: { $in: ['pending', 'approved'] },
  [targetField]: targetId,
  startMinutes: { $lt: reqEndMinutes },
  endMinutes: { $gt: reqStartMinutes }
});
```

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas URI)

### 2. Clone and Setup Backend
```bash
cd CampusConnect/server
npm install
npm run seed     # Ingests realistic demo records, facilities, events, and bookings
npm start        # Launches backend API server on http://localhost:5000
```

### 3. Setup Frontend Client
```bash
cd CampusConnect/client
npm install
npm run dev      # Launches Vite frontend on http://localhost:5173
```

### 4. Access the Platform
Navigate to **`http://localhost:5173`** in your browser. Use the 1-click demo buttons on the login screen to explore as an **Admin**, **Faculty**, or **Student**.

---

## 📡 REST API Reference

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `POST` | `/api/auth/register` | Public | Register student or faculty |
| `GET` | `/api/auth/me` | Protected | Fetch current logged in user & role profile |
| `GET` | `/api/faculty` | Public/Protected | List active faculty with departmental filters |
| `GET` | `/api/faculty/:id/slots` | Protected | Compute available intervals for date |
| `PUT` | `/api/faculty/availability` | Faculty/Admin | Update weekly recurring schedule & cabins |
| `GET` | `/api/resources` | Public/Protected | List classrooms, computer labs & capacity |
| `GET` | `/api/resources/:id/availability` | Protected | Fetch occupancy schedule for date |
| `POST` | `/api/resources` | Admin | Provision new campus classroom or lab |
| `POST` | `/api/bookings` | Protected | Submit booking with Smart Conflict validation |
| `GET` | `/api/bookings/my` | Protected | Get personal booking history & tickets |
| `GET` | `/api/bookings/faculty-sessions`| Faculty/Admin | View session requests addressed to faculty |
| `PUT` | `/api/bookings/:id/status` | Faculty/Admin | Approve or reject booking with reason |
| `PUT` | `/api/bookings/:id/cancel` | Protected | Cancel booking and release slot |
| `GET` | `/api/events` | Public/Protected | List events with ticket registration status |
| `POST` | `/api/events/:id/register` | Protected | Concurrency-safe event registration |
| `DELETE`| `/api/events/:id/register` | Protected | Cancel event registration ticket |
| `GET` | `/api/analytics/overview` | Admin | 7 Master KPIs aggregation |
| `GET` | `/api/analytics/booking-trends` | Admin | Daily/Weekly/Monthly booking trends |
| `GET` | `/api/analytics/resource-utilization` | Admin | Facilities ranked by hours occupied |
| `GET` | `/api/analytics/export/:type` | Admin | Stream raw records as CSV |
| `GET` | `/api/notifications` | Protected | User notifications with unread badge counter |

---

## 🏆 Final Year Project Demonstration Checklist

- [x] **Authentication**: Student, Faculty, and Admin roles with JWT + bcrypt password hashing.
- [x] **Presentation Fast-Login**: 1-click demo fill buttons on login page.
- [x] **Faculty Doubts**: Interactive slot selection, booking submission, approval/rejection with mandatory reasons.
- [x] **Resource Allocation**: Classrooms and labs with capacity, hardware amenities, and collision detection.
- [x] **Smart Conflict Engine**: Mathematical interval overlap verification returning HTTP 409 Conflict.
- [x] **Event Ticketing**: Automated digital tickets, capacity capping, duplicate registration prevention.
- [x] **Business Analytics**: MongoDB aggregation pipelines calculating all 7 KPIs without hardcoding.
- [x] **Data Export**: CSV generation for booking and event compliance reports.
- [x] **In-App Notifications**: Real-time read/unread status notifications.
- [x] **UI/UX Aesthetics**: Obsidian Emerald design system adhering to the master UI reference.

