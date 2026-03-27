import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { Toaster } from 'react-hot-toast'

export const AppLayout = () => (
  <div className="flex min-h-screen bg-primary-950">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <TopNav />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#3b0764',
          color: '#e9d5ff',
          border: '1px solid #6b21a8',
          borderRadius: '12px',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#a855f7', secondary: '#3b0764' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#3b0764' } },
      }}
    />
  </div>
)
