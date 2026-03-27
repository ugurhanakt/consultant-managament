import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { CalendarPage } from './pages/CalendarPage'
import { DashboardPage } from './pages/DashboardPage'
import { ConsultantsPage } from './pages/ConsultantsPage'
import { ConsultantProfilePage } from './pages/ConsultantProfilePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<CalendarPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="consultants" element={<ConsultantsPage />} />
          <Route path="consultants/:id" element={<ConsultantProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
