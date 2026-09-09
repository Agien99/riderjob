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

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* React Router

### Backend / Database

* Supabase
* PostgreSQL
* Supabase Authentication

### Deployment

* GitHub
* GitHub Actions
* GitHub Pages

Planned production URL:

```text
https://agien99.github.io/riderjob/
```

---

## Design Direction

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

Initial authentication:

* Email and password

Possible future authentication:

* Google Sign-In

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

The system records automatically:

```text
Session Date
Start Time
```

An optional note may also be recorded.

---

## Active Session

While a rider session is running, the application displays:

* Platform
* Session start time
* Starting mileage
* Current session duration
* Session status

The rider can end the session at any time.

Only one active session should normally exist for a user.

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

The completed session is then saved into session history.

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

The initial database will use Supabase PostgreSQL.

Primary table:

## `rider_sessions`

| Column           | Type        | Description                       |
| ---------------- | ----------- | --------------------------------- |
| `id`             | UUID        | Primary key                       |
| `user_id`        | UUID        | Supabase authenticated user       |
| `platform`       | TEXT        | Rider platform                    |
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
| `status`         | TEXT        | `active` or `completed`           |
| `created_at`     | TIMESTAMPTZ | Record creation timestamp         |
| `updated_at`     | TIMESTAMPTZ | Record update timestamp           |

---

## Calculated Values

Calculated values should generally not be stored directly in the database.

### Distance

```text
distance =
end_mileage - start_mileage
```

### Session Duration

```text
duration =
end_time - start_time
```

### Net Income

```text
net_income =
gross_income - fuel_cost - other_expenses
```

### Gross Earnings Per Hour

```text
gross_income_per_hour =
gross_income / session_duration_hours
```

### Net Earnings Per Hour

```text
net_income_per_hour =
net_income / session_duration_hours
```

### Earnings Per Kilometre

```text
income_per_km =
gross_income / distance
```

### Earnings Per Order

```text
income_per_order =
gross_income / total_orders
```

Calculated fields should handle zero values safely to prevent divide-by-zero errors.

---

# Planned Application Structure

```text
src/
│
├── components/
│   ├── AppHeader.jsx
│   ├── Sidebar.jsx
│   ├── MobileNavigation.jsx
│   ├── StatCard.jsx
│   ├── PlatformCard.jsx
│   ├── PlatformBadge.jsx
│   └── SessionCard.jsx
│
├── layouts/
│   └── AppLayout.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── StartSession.jsx
│   ├── ActiveSession.jsx
│   ├── SessionHistory.jsx
│   ├── SessionDetail.jsx
│   ├── Analytics.jsx
│   └── Profile.jsx
│
├── services/
│   ├── supabase.js
│   ├── authService.js
│   └── riderSessionService.js
│
├── utils/
│   ├── calculations.js
│   ├── formatters.js
│   └── constants.js
│
├── styles/
│   ├── variables.css
│   ├── global.css
│   └── responsive.css
│
├── App.jsx
└── main.jsx
```

This structure may change as development progresses.

---

# Development Phases

## Phase 1 — Planning and Requirements

* [x] Define project purpose
* [x] Define rider workflow
* [x] Identify supported platforms
* [x] Define MVP features
* [x] Define initial database structure
* [x] Select technology stack
* [x] Select UI design direction

---

## Phase 2 — Project Setup

* [ ] Create React + Vite project
* [ ] Configure repository structure
* [ ] Install React Router
* [ ] Configure base application layout
* [ ] Configure GitHub Pages base path
* [ ] Configure GitHub Actions deployment
* [ ] Configure ESLint
* [ ] Create initial application routes

---

## Phase 3 — Authentication

* [ ] Create Supabase project
* [ ] Configure Supabase client
* [ ] Configure authentication
* [ ] Login page
* [ ] Registration
* [ ] Protected routes
* [ ] Logout
* [ ] Persistent authentication session

---

## Phase 4 — Rider Session Engine

* [ ] Platform selection
* [ ] Start session
* [ ] Store starting mileage
* [ ] Automatically record start time
* [ ] Detect active session
* [ ] Active session page
* [ ] Session duration
* [ ] End session
* [ ] Record session results
* [ ] Automatically calculate session metrics

---

## Phase 5 — Session History

* [ ] Session listing
* [ ] Session detail
* [ ] Platform filtering
* [ ] Date filtering
* [ ] Edit session
* [ ] Delete session
* [ ] Validation

---

## Phase 6 — Dashboard

* [ ] Today's statistics
* [ ] Weekly statistics
* [ ] Monthly statistics
* [ ] Lifetime statistics
* [ ] Recent sessions
* [ ] Platform overview
* [ ] Quick start session

---

## Phase 7 — Analytics

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

---

## Phase 8 — UI / UX

* [ ] Dark technology theme
* [ ] Desktop sidebar
* [ ] Mobile navigation
* [ ] Responsive dashboard
* [ ] Responsive session pages
* [ ] Responsive analytics
* [ ] Loading states
* [ ] Empty states
* [ ] Error states
* [ ] Form feedback
* [ ] UI polish

---

## Phase 9 — Testing and Deployment

* [ ] Calculation tests
* [ ] Session workflow tests
* [ ] Authentication tests
* [ ] Responsive testing
* [ ] GitHub Actions build
* [ ] GitHub Pages deployment
* [ ] Production verification

Production target:

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

---

# Project Status

**Current Stage:** Planning / Initial Development

**Version:** Pre-Alpha

The project is currently being designed and developed.

---

## Author

Developed by **Agien99**

Software Engineer / System Developer

> Built by a Developer, for Real Life.