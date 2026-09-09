# RiderJob

**Ride. Track. Improve.**

RiderJob is a personal rider job tracking and analytics web application built to record delivery sessions, calculate riding performance, and compare earnings across multiple delivery platforms.

The project is designed around a real rider workflow and is intended for daily use on both mobile and desktop.

Supported platforms:

* ShopeeFood
* GrabFood
* Lalamove

---

## Project Purpose

RiderJob replaces manual rider session recording with a simple digital workflow.

Before starting a delivery session, the rider records the starting motorcycle mileage and selects the delivery platform.

At the end of the session, the rider records the ending mileage, completed orders, earnings, fuel cost, and other expenses.

The system automatically calculates useful performance metrics such as:

* Distance travelled
* Session duration
* Gross earnings
* Net earnings
* Earnings per hour
* Earnings per kilometre
* Earnings per order
* Platform performance
* Weekly and monthly riding performance

The goal is not only to store rider records, but also to turn those records into useful data for making better decisions.

---

## Core Concept

Typical RiderJob workflow:

```text
Login
  ↓
Dashboard
  ↓
Select Delivery Platform
  ↓
Enter Starting Mileage
  ↓
Start Session
  ↓
Complete Deliveries
  ↓
End Session
  ↓
Enter:
- Ending Mileage
- Total Orders
- Gross Income
- Fuel Cost
- Other Expenses
  ↓
System Calculates Performance
  ↓
Session Stored in History
  ↓
Dashboard and Analytics Updated
```

---

# System Architecture

RiderJob uses a separated frontend, backend API, and database architecture.

```text
┌─────────────────────────────┐
│        React + Vite         │
│          Frontend           │
│                             │
│  GitHub Pages               │
└──────────────┬──────────────┘
               │
               │ HTTPS / REST API
               ▼
┌─────────────────────────────┐
│           FastAPI           │
│          Backend API        │
│                             │
│  Authentication            │
│  Business Logic            │
│  Validation                │
│  Analytics                 │
└──────────────┬──────────────┘
               │
               │ PostgreSQL
               ▼
┌─────────────────────────────┐
│            Neon             │
│         PostgreSQL DB       │
│                             │
│  Users                     │
│  Rider Sessions            │
│  Application Data          │
└─────────────────────────────┘
```

The React frontend must not connect directly to the Neon database.

All database access and business logic should pass through the FastAPI backend.

---

# Technology Stack

## Frontend

* React
* Vite
* JavaScript
* CSS
* React Router

## Backend

* Python
* FastAPI
* REST API
* Pydantic
* SQLAlchemy

## Database

* Neon
* PostgreSQL

## Authentication

Authentication will be handled through the FastAPI backend.

Initial authentication:

* Email
* Password
* Password hashing
* Token-based authentication
* Protected API endpoints

Possible future authentication:

* Google Sign-In

## Deployment

### Frontend

* GitHub
* GitHub Actions
* GitHub Pages

Planned frontend URL:

```text
https://agien99.github.io/riderjob/
```

### Backend

Planned deployment:

* Render

The production API URL will be configured through frontend environment variables.

### Database

* Neon PostgreSQL

Database credentials must only be available to the backend.

They must never be exposed through the React frontend.

---

# Design Direction

RiderJob uses a dark, technology-focused interface inspired by engineering dashboards and developer tools.

Main design characteristics:

* Dark navy / black background
* Blue primary system accent
* Compact information cards
* Data-focused dashboard
* Responsive mobile-first interface
* Desktop sidebar navigation
* Mobile bottom navigation
* Minimal animations
* Platform-specific colors used only where useful

Platform colors:

```text
ShopeeFood → Orange
GrabFood   → Green
Lalamove   → Red
```

Primary application branding:

```text
RiderJob

Ride. Track. Improve.
```

Additional project identity:

```text
Built by a Developer, for Real Life.
```

---

# MVP Features

## Authentication

Users must authenticate before accessing rider records.

Initial authentication will support:

* User registration
* Email/password login
* Password hashing
* Authentication token
* Protected frontend routes
* Protected API endpoints
* Logout
* Persistent login session

The authentication implementation must ensure that passwords are never stored as plain text.

---

## Dashboard

The dashboard provides a quick overview of rider activity.

Planned statistics:

* Today's earnings
* Weekly earnings
* Monthly earnings
* Total earnings
* Total orders
* Total distance
* Total riding hours
* Average RM / hour
* Average RM / order
* Average RM / kilometre
* Recent sessions

The dashboard also provides quick access to start a new rider session.

---

## Start Session

The rider selects one platform:

* ShopeeFood
* GrabFood
* Lalamove

Required information:

```text
Platform
Starting Mileage
```

The system automatically records:

```text
Session Date
Start Time
```

An optional note may also be recorded.

The backend validates the request before creating the active session.

---

## Active Session

While a rider session is running, the application displays:

* Platform
* Session start time
* Starting mileage
* Current session duration
* Session status

The rider can end the session at any time.

A user should normally have only one active rider session.

The backend must prevent accidental creation of multiple active sessions for the same user.

---

## End Session

When ending a session, the rider enters:

```text
Ending Mileage
Total Orders
Gross Income
Fuel Cost
Other Expenses
Notes
```

The application automatically records the ending time.

The backend validates the submitted information and updates the session status to:

```text
completed
```

The completed session becomes available in session history and analytics.

---

## Session History

The history module provides access to previous rider sessions.

Planned capabilities:

* View sessions
* View session details
* Filter by platform
* Filter by date
* Edit session
* Delete incorrect session
* Search records

Users must only be able to access their own rider sessions.

---

## Analytics

The analytics module converts recorded sessions into useful performance information.

Planned analytics include:

* Earnings by platform
* Orders by platform
* Earnings trend
* Total distance
* Total riding hours
* Gross vs net earnings
* Average earnings per hour
* Average earnings per order
* Average earnings per kilometre
* Fuel spending
* Platform comparison

Later versions may include:

* Day-of-week performance
* Time-of-day performance
* Monthly comparison
* Weekly targets
* Platform efficiency scoring
* Motorcycle running cost
* Maintenance tracking

---

# Database Design

The database will use Neon PostgreSQL.

## `users`

Stores RiderJob user accounts.

| Column          | Type        | Description         |
| --------------- | ----------- | ------------------- |
| `id`            | UUID        | Primary key         |
| `email`         | VARCHAR     | Unique user email   |
| `password_hash` | VARCHAR     | Hashed password     |
| `display_name`  | VARCHAR     | User display name   |
| `is_active`     | BOOLEAN     | Account status      |
| `created_at`    | TIMESTAMPTZ | Account creation    |
| `updated_at`    | TIMESTAMPTZ | Last account update |

Passwords must never be stored directly.

Only securely generated password hashes should be stored.

---

## `rider_sessions`

Stores rider work sessions.

| Column           | Type        | Description                       |
| ---------------- | ----------- | --------------------------------- |
| `id`             | UUID        | Primary key                       |
| `user_id`        | UUID        | Foreign key to `users.id`         |
| `platform`       | VARCHAR     | Rider platform                    |
| `session_date`   | DATE        | Session date                      |
| `start_time`     | TIMESTAMPTZ | Session start                     |
| `end_time`       | TIMESTAMPTZ | Session end                       |
| `start_mileage`  | NUMERIC     | Motorcycle mileage before session |
| `end_mileage`    | NUMERIC     | Motorcycle mileage after session  |
| `total_orders`   | INTEGER     | Completed deliveries              |
| `gross_income`   | NUMERIC     | Total rider earnings              |
| `fuel_cost`      | NUMERIC     | Fuel expense                      |
| `other_expenses` | NUMERIC     | Other rider expenses              |
| `notes`          | TEXT        | Optional notes                    |
| `status`         | VARCHAR     | `active` or `completed`           |
| `created_at`     | TIMESTAMPTZ | Record creation timestamp         |
| `updated_at`     | TIMESTAMPTZ | Record update timestamp           |

Relationship:

```text
users
  │
  │ 1
  │
  └────────────── *
             rider_sessions
```

One user can have many rider sessions.

---

# Calculated Values

Calculated values should generally not be stored directly in the database.

They should be derived from the underlying session data.

## Distance

```text
distance =
end_mileage - start_mileage
```

## Session Duration

```text
duration =
end_time - start_time
```

## Net Income

```text
net_income =
gross_income - fuel_cost - other_expenses
```

## Gross Earnings Per Hour

```text
gross_income_per_hour =
gross_income / session_duration_hours
```

## Net Earnings Per Hour

```text
net_income_per_hour =
net_income / session_duration_hours
```

## Earnings Per Kilometre

```text
income_per_km =
gross_income / distance
```

## Earnings Per Order

```text
income_per_order =
gross_income / total_orders
```

Calculated fields must safely handle:

* Zero orders
* Zero distance
* Zero duration
* Incomplete active sessions

---

# Planned API

Initial REST API structure:

```text
/api/health

/api/auth/register
/api/auth/login
/api/auth/me

/api/sessions
/api/sessions/active
/api/sessions/start
/api/sessions/{id}
/api/sessions/{id}/end

/api/dashboard
/api/analytics
```

Expected HTTP methods may include:

```text
GET
POST
PUT
PATCH
DELETE
```

All protected endpoints must verify the authenticated user.

---

# Planned Repository Structure

RiderJob will contain separate frontend and backend applications.

```text
riderjob/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppHeader.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── MobileNavigation.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── PlatformCard.jsx
│   │   │   ├── PlatformBadge.jsx
│   │   │   └── SessionCard.jsx
│   │   │
│   │   ├── layouts/
│   │   │   └── AppLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StartSession.jsx
│   │   │   ├── ActiveSession.jsx
│   │   │   ├── SessionHistory.jsx
│   │   │   ├── SessionDetail.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── riderSessionService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── calculations.js
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   │
│   │   ├── styles/
│   │   │   ├── variables.css
│   │   │   ├── global.css
│   │   │   └── responsive.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   └── routers/
│   │   │       ├── auth.py
│   │   │       ├── sessions.py
│   │   │       ├── dashboard.py
│   │   │       └── analytics.py
│   │   │
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── rider_session.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   └── rider_session.py
│   │   │
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── session_service.py
│   │   │   └── analytics_service.py
│   │   │
│   │   ├── database.py
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── tests/
│   └── requirements.txt
│
├── .github/
│   └── workflows/
│
├── .gitignore
└── README.md
```

The structure may evolve as development progresses.

---

# Development Phases

## Phase 1 — Planning and Requirements

* [x] Define project purpose
* [x] Define rider workflow
* [x] Identify supported platforms
* [x] Define MVP features
* [x] Define initial database structure
* [x] Select technology stack
* [x] Select system architecture
* [x] Select UI design direction

---

## Phase 2 — Project Foundation

### Frontend

* [ ] Create React + Vite application
* [ ] Install React Router
* [ ] Configure frontend folder structure
* [ ] Configure GitHub Pages base path
* [ ] Configure ESLint
* [ ] Create initial routes

### Backend

* [ ] Create Python virtual environment
* [ ] Create FastAPI application
* [ ] Configure backend folder structure
* [ ] Configure environment variables
* [ ] Create health endpoint
* [ ] Configure CORS

### Database

* [ ] Create Neon PostgreSQL database
* [ ] Configure backend database connection
* [ ] Verify database connectivity

---

## Phase 3 — Database and Authentication

* [ ] Create `users` table
* [ ] Create `rider_sessions` table
* [ ] Configure database models
* [ ] Configure migrations
* [ ] User registration
* [ ] Password hashing
* [ ] User login
* [ ] Token authentication
* [ ] Protected API endpoints
* [ ] Protected frontend routes
* [ ] Logout
* [ ] Persistent authentication
* [ ] Authentication tests

---

## Phase 4 — Rider Session Engine

* [ ] Platform selection
* [ ] Start session endpoint
* [ ] Store starting mileage
* [ ] Automatically record start time
* [ ] Prevent duplicate active sessions
* [ ] Retrieve active session
* [ ] Active session page
* [ ] Session duration
* [ ] End session endpoint
* [ ] Record session results
* [ ] Validate ending mileage
* [ ] Automatically calculate session metrics
* [ ] Session engine tests

---

## Phase 5 — Session History

* [ ] Session listing API
* [ ] Session history page
* [ ] Session detail API
* [ ] Session detail page
* [ ] Platform filtering
* [ ] Date filtering
* [ ] Edit session
* [ ] Delete session
* [ ] Validation
* [ ] History tests

---

## Phase 6 — Dashboard

* [ ] Dashboard API
* [ ] Today's statistics
* [ ] Weekly statistics
* [ ] Monthly statistics
* [ ] Lifetime statistics
* [ ] Recent sessions
* [ ] Platform overview
* [ ] Quick start session
* [ ] Dashboard tests

---

## Phase 7 — Analytics

* [ ] Analytics API
* [ ] Platform earnings comparison
* [ ] Platform order comparison
* [ ] Daily earnings trend
* [ ] Gross earnings
* [ ] Net earnings
* [ ] RM / hour
* [ ] RM / order
* [ ] RM / kilometre
* [ ] Distance statistics
* [ ] Riding time statistics
* [ ] Fuel expense statistics
* [ ] Analytics tests

---

## Phase 8 — UI / UX

* [ ] Dark technology theme
* [ ] Desktop sidebar
* [ ] Mobile navigation
* [ ] Responsive dashboard
* [ ] Responsive session pages
* [ ] Responsive history
* [ ] Responsive analytics
* [ ] Loading states
* [ ] Empty states
* [ ] Error states
* [ ] Form feedback
* [ ] UI polish

---

## Phase 9 — CI/CD and Deployment

### CI

* [ ] Frontend build workflow
* [ ] Frontend lint checks
* [ ] Backend pytest workflow
* [ ] Automated test execution

### Frontend Deployment

* [ ] GitHub Pages workflow
* [ ] Configure production API URL
* [ ] Deploy frontend
* [ ] Verify routing

### Backend Deployment

* [ ] Configure Render service
* [ ] Configure production environment variables
* [ ] Configure Neon `DB_URL`
* [ ] Configure production CORS
* [ ] Deploy FastAPI backend
* [ ] Verify API health

### Production Verification

* [ ] Registration
* [ ] Login
* [ ] Start session
* [ ] End session
* [ ] History
* [ ] Dashboard
* [ ] Analytics
* [ ] Mobile testing

Production frontend target:

```text
https://agien99.github.io/riderjob/
```

---

# Future Ideas

Possible future features are intentionally excluded from the MVP.

These may include:

* Weekly riding targets
* Monthly income targets
* Fuel efficiency analysis
* Motorcycle maintenance records
* Service reminders
* Tyre change records
* Engine oil records
* Cost per kilometre
* Profit after motorcycle running cost
* Individual delivery records
* Area / zone performance
* Peak hour analytics
* Weather correlation
* Export to CSV
* Export to PDF
* Progressive Web App support
* Offline session recording
* Push notifications
* Google authentication
* Multi-motorcycle support
* Additional rider platforms

---

# Development Principles

RiderJob should remain practical.

Features should solve real rider problems rather than exist only for demonstration purposes.

Development priorities:

```text
Useful
↓
Reliable
↓
Simple
↓
Fast
↓
Visually polished
```

The application should be especially quick to use on mobile because rider sessions are normally started and ended while away from a desktop computer.

The backend should remain responsible for:

* Authentication
* Authorization
* Validation
* Business rules
* Database access
* Sensitive configuration

The frontend should remain responsible for:

* User interface
* User interaction
* Client-side presentation
* API communication

Sensitive credentials must never be committed to the repository.

---

# Project Status

**Current Stage:** Planning / Initial Development

**Version:** Pre-Alpha

Current architecture:

```text
React + Vite
      ↓
FastAPI REST API
      ↓
Neon PostgreSQL
```

The project is currently being designed and developed.

---

## Author

Developed by **Agien99**

Software Engineer / System Developer

> Built by a Developer, for Real Life.