import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import AppLayout from './layouts/AppLayout'

import ActiveSession from './pages/ActiveSession'
import Analytics from './pages/Analytics'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'
import SessionDetail from './pages/SessionDetail'
import SessionHistory from './pages/SessionHistory'
import StartSession from './pages/StartSession'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route element={<AppLayout />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/session/start"
          element={<StartSession />}
        />

        <Route
          path="/session/active"
          element={<ActiveSession />}
        />

        <Route
          path="/sessions"
          element={<SessionHistory />}
        />

        <Route
          path="/sessions/:id"
          element={<SessionDetail />}
        />

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  )
}

export default App