import { Outlet } from 'react-router-dom'

import AppHeader from '../components/AppHeader'
import MobileNavigation from '../components/MobileNavigation'
import Sidebar from '../components/Sidebar'

import '../styles/layout.css'

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <AppHeader />

        <div className="app-content">
          <Outlet />
        </div>
      </div>

      <MobileNavigation />
    </div>
  )
}

export default AppLayout