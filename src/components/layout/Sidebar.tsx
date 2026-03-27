import { NavLink } from 'react-router-dom'
import { CalendarDays, LayoutDashboard, Users, Settings, Sparkles, FolderKanban } from 'lucide-react'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/',            icon: CalendarDays,    label: 'Takvim' },
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',    icon: FolderKanban,    label: 'Projeler' },
  { to: '/consultants', icon: Users,           label: 'Danışmanlar' },
]

export const Sidebar = () => (
  <aside className="w-64 min-h-screen bg-primary-950 border-r border-primary-800/50 flex flex-col">
    {/* Logo */}
    <div className="px-6 py-5 border-b border-primary-800/50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/50">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">Consultant</p>
          <p className="text-xs text-primary-400 leading-tight">Management</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-primary-600/30 text-primary-200 border border-primary-600/40'
                : 'text-primary-400 hover:text-primary-200 hover:bg-primary-800/40'
            )
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>

    {/* Footer */}
    <div className="px-3 py-4 border-t border-primary-800/50">
      <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-400 hover:text-primary-200 hover:bg-primary-800/40 w-full transition-all duration-150">
        <Settings size={18} />
        Ayarlar
      </button>
    </div>
  </aside>
)
