import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import StartSession from './pages/StartSession'
import ActiveSession from './pages/ActiveSession'
import SessionHistory from './pages/SessionHistory'
import SessionDetail from './pages/SessionDetail'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
    </Routes>
  )
}

export default App