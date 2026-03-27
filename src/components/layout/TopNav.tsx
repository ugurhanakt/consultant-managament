import { Bell, Search } from 'lucide-react'
import { Avatar } from '../ui/Avatar'

export const TopNav = () => (
  <header className="h-14 bg-primary-950/80 backdrop-blur border-b border-primary-800/50 flex items-center justify-between px-6 sticky top-0 z-10">
    <div className="relative">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500" />
      <input
        type="text"
        placeholder="Danışman veya proje ara..."
        className="bg-primary-900/60 border border-primary-700/40 text-primary-200 placeholder-primary-500 rounded-lg pl-9 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:border-primary-500 transition-colors"
      />
    </div>
    <div className="flex items-center gap-3">
      <button className="relative p-2 rounded-lg hover:bg-primary-800/40 text-primary-400 hover:text-primary-200 transition-colors">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-400 rounded-full" />
      </button>
      <Avatar initials="ZA" color="#6b21a8" size="sm" />
    </div>
  </header>
)
