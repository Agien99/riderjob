# RiderJob

**Ride. Track. Improve.**

RiderJob is a personal rider job tracking and analytics web application
built for recording delivery sessions, monitoring earnings and expenses,
and analysing riding performance across multiple delivery platforms.

The application was designed around a real part-time rider workflow,
with a strong focus on fast mobile usage, practical data recording, and
useful performance insights.

> Built by a Developer, for Real Life.

------------------------------------------------------------------------

## Overview

Delivery riders often rely on notes, spreadsheets, or memory to keep
track of their working sessions. RiderJob provides a dedicated workflow
for recording each riding session and automatically converting the
recorded information into useful performance metrics.

A rider can start a session by selecting a delivery platform and
recording the motorcycle's starting mileage. When the session is
completed, the rider records the ending mileage, number of completed
orders, gross earnings, fuel expenses, and other expenses.

RiderJob then calculates the session's distance, duration, net earnings,
and efficiency metrics automatically.

Supported delivery platforms:

-   ShopeeFood
-   GrabFood
-   Lalamove

------------------------------------------------------------------------

## Features

### Rider Session Tracking

RiderJob provides a complete session lifecycle for delivery work.

A rider can:

-   Select a delivery platform
-   Record starting motorcycle mileage
-   Start a rider session
-   View the currently active session
-   Track session duration
-   End a session
-   Record ending mileage
-   Record completed orders
-   Record gross income
-   Record fuel costs
-   Record other expenses
-   Add session notes

Only one active rider session is allowed per user at a time.

### Dashboard

The dashboard provides a quick overview of rider activity and
performance.

Available information includes:

-   Net earnings
-   Gross earnings
-   Total orders
-   Total distance
-   Total riding hours
-   Earnings per hour
-   Earnings per order
-   Earnings per kilometre
-   Platform performance
-   Recent completed sessions

Dashboard statistics can be viewed across different periods such as
today, the current week, and the current month.

### Session History

Completed rider sessions are stored in session history.

Users can:

-   View previous sessions
-   View complete session details
-   Search session records
-   Filter by delivery platform
-   Filter by date
-   Edit existing sessions
-   Delete incorrect sessions

Each authenticated user can only access their own rider records.

### Analytics

RiderJob converts recorded sessions into performance analytics that help
evaluate how efficiently rider work is performing.

Analytics include:

-   Gross and net earnings
-   Earnings trends
-   Orders completed
-   Distance travelled
-   Riding duration
-   Earnings per hour
-   Earnings per order
-   Earnings per kilometre
-   Fuel and other expenses
-   Platform comparison
-   Day-of-week performance
-   Platform efficiency
-   Performance highlights

Analytics can be viewed across multiple time periods.

### User Authentication

RiderJob includes its own authentication system.

Features include:

-   User registration
-   Email and password login
-   Secure password hashing
-   JWT-based authentication
-   Persistent authentication
-   Protected frontend routes
-   Protected API endpoints
-   User-specific data isolation
-   Logout

Passwords are never stored as plain text.

### Responsive Interface

RiderJob is designed for both desktop and mobile use.

The interface includes:

-   Desktop sidebar navigation
-   Mobile bottom navigation
-   Responsive dashboards
-   Responsive analytics
-   Mobile-friendly session forms
-   Loading states
-   Empty states
-   Error feedback
-   Consistent form validation
-   Dark technology-focused interface

The mobile experience is especially important because rider sessions are
normally started and ended while away from a desktop computer.

------------------------------------------------------------------------

## Rider Workflow

``` text
Login
  │
  ▼
Dashboard
  │
  ▼
Select Delivery Platform
  │
  ▼
Enter Starting Mileage
  │
  ▼
Start Session
  │
  ▼
Complete Deliveries
  │
  ▼
End Session
  │
  ▼
Enter Session Results
  │
  ├── Ending Mileage
  ├── Total Orders
  ├── Gross Income
  ├── Fuel Cost
  ├── Other Expenses
  └── Notes
  │
  ▼
Performance Calculated
  │
  ▼
Session History
  │
  ▼
Dashboard & Analytics
```

------------------------------------------------------------------------

## Performance Metrics

RiderJob derives performance metrics from the underlying rider session
data.

### Distance Travelled

``` text
Distance = Ending Mileage - Starting Mileage
```

### Session Duration

``` text
Duration = End Time - Start Time
```

### Net Earnings

``` text
Net Earnings = Gross Income - Fuel Cost - Other Expenses
```

### Earnings Per Hour

``` text
RM / Hour = Net Earnings / Session Duration
```

### Earnings Per Order

``` text
RM / Order = Net Earnings / Total Orders
```

### Earnings Per Kilometre

``` text
RM / KM = Net Earnings / Distance Travelled
```

The application safely handles incomplete sessions and values such as
zero orders or zero distance.

------------------------------------------------------------------------

## System Architecture

RiderJob uses a separated frontend, backend API, and database
architecture.

``` text
┌─────────────────────────────┐
│        React + Vite         │
│          Frontend           │
│                             │
│       GitHub Pages          │
└──────────────┬──────────────┘
               │
               │ HTTPS / REST API
               ▼
┌─────────────────────────────┐
│           FastAPI           │
│          Backend API        │
│                             │
│  Authentication             │
│  Authorization              │
│  Business Logic             │
│  Validation                 │
│  Analytics                  │
└──────────────┬──────────────┘
               │
               │ PostgreSQL
               ▼
┌─────────────────────────────┐
│            Neon             │
│         PostgreSQL          │
│                             │
│  Users                      │
│  Rider Sessions             │
└─────────────────────────────┘
```

The React application never connects directly to the PostgreSQL
database.

All database operations, authentication, authorization, validation, and
business rules are handled through the FastAPI backend.

------------------------------------------------------------------------

## Technology Stack

### Frontend

-   React
-   Vite
-   JavaScript
-   CSS
-   React Router

### Backend

-   Python
-   FastAPI
-   Pydantic
-   SQLAlchemy
-   Alembic
-   PyJWT
-   Argon2

### Database

-   PostgreSQL
-   Neon

### Infrastructure

-   GitHub
-   GitHub Actions
-   GitHub Pages
-   Render

------------------------------------------------------------------------

## Application Structure

``` text
riderjob/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── tests/
│   ├── alembic/
│   └── requirements.txt
│
├── .github/
│   └── workflows/
│
└── README.md
```

------------------------------------------------------------------------

## API

The backend exposes REST API endpoints for authentication, rider
sessions, dashboard data, and analytics.

``` text
/api/health

/api/auth/register
/api/auth/login
/api/auth/me

/api/sessions
/api/sessions/active
/api/sessions/start
/api/sessions/{session_id}
/api/sessions/{session_id}/end

/api/dashboard
/api/analytics
```

Protected endpoints require a valid authenticated user.

Session queries are scoped to the authenticated user's account so one
user cannot retrieve or modify another user's rider sessions.

------------------------------------------------------------------------

## Database

RiderJob uses PostgreSQL hosted on Neon.

The main application entities are:

``` text
users
  │
  │ 1
  │
  └────────────── *
             rider_sessions
```

A user can have multiple rider sessions, while every rider session
belongs to one user.

### Users

The `users` table stores:

-   User ID
-   Email
-   Password hash
-   Display name
-   Account status
-   Creation timestamp
-   Update timestamp

### Rider Sessions

The `rider_sessions` table stores:

-   User
-   Delivery platform
-   Session date
-   Start and end time
-   Starting and ending mileage
-   Total orders
-   Gross income
-   Fuel cost
-   Other expenses
-   Notes
-   Session status
-   Creation and update timestamps

Performance values such as distance, duration, net income, and
efficiency metrics are derived from the session data.

------------------------------------------------------------------------

## Security

RiderJob follows a backend-controlled security model.

The backend is responsible for:

-   Authentication
-   Authorization
-   Password hashing
-   JWT validation
-   Request validation
-   Business rules
-   User data isolation
-   Database access
-   Sensitive configuration

The frontend is responsible for presentation, user interaction, and
communication with the backend API.

Database credentials and other sensitive configuration are never exposed
through the React frontend or committed to the repository.

------------------------------------------------------------------------

## CI/CD

GitHub Actions is used to automatically validate the application.

The development workflow includes:

-   Frontend build verification
-   ESLint checks
-   Backend automated tests
-   Database migration verification
-   Deployment workflows

The frontend is hosted using GitHub Pages, while the FastAPI backend
runs separately on Render and communicates with a Neon PostgreSQL
database.

------------------------------------------------------------------------

## Design

RiderJob uses a dark, technology-focused interface inspired by
engineering dashboards and developer tools.

The design system uses:

-   Dark navy and black surfaces
-   Blue primary accents
-   Compact information cards
-   Data-focused layouts
-   Responsive navigation
-   Platform-specific visual indicators
-   Consistent form controls
-   Clear loading, empty, success, and error states

Platform-specific accents are used to distinguish:

``` text
ShopeeFood → Orange
GrabFood   → Green
Lalamove   → Orange / Red
```

------------------------------------------------------------------------

## Live Application

RiderJob is available at:

https://agien99.github.io/riderjob/

------------------------------------------------------------------------

## Development Principles

RiderJob was built around a simple priority:

``` text
Useful
  ↓
Reliable
  ↓
Simple
  ↓
Fast
  ↓
Visually Polished
```

The application exists to solve an actual rider workflow rather than
simply demonstrate technical features.

Its architecture keeps presentation, application logic, and persistence
separated while maintaining a workflow that remains quick enough to use
during real rider sessions.

------------------------------------------------------------------------

## Author

Developed by **Agien99**

Software Engineer / System Developer

**Ride. Track. Improve.**

> Built by a Developer, for Real Life.