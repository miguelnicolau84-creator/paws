import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  PawPrint,
  Building2,
  Heart,
  Users,
  BarChart3,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/appStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/animals', label: 'Animals', icon: PawPrint },
  { to: '/facilities', label: 'Facilities', icon: Building2 },
  { to: '/adoption', label: 'Adoption', icon: Heart },
  { to: '/volunteers', label: 'Volunteers', icon: Users },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { volunteers, currentUserId, setCurrentUser, setRole, getCurrentUser } = useAppStore()
  const currentUser = getCurrentUser()

  const handleUserChange = (userId: string) => {
    setCurrentUser(userId)
    const user = volunteers.find((v) => v.id === userId)
    if (user) setRole(user.role)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-sage-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-warm-500 flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sage-900 text-lg">PawsConnect</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl hover:bg-sage-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-sage-100 flex flex-col transition-transform duration-300 md:translate-x-0 md:static md:z-auto',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-sage-100">
          <div className="w-10 h-10 rounded-xl bg-warm-500 flex items-center justify-center shadow-sm">
            <PawPrint className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sage-900 text-xl">PawsConnect</h1>
            <p className="text-xs text-sage-500">Shelter Management</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all min-h-[48px]',
                  active
                    ? 'bg-warm-50 text-warm-700 border border-warm-200'
                    : 'text-sage-600 hover:bg-sage-50 hover:text-sage-900',
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sage-100 space-y-3">
          <label className="text-xs font-semibold text-sage-500 uppercase tracking-wide">Signed in as</label>
          <Select value={currentUserId} onValueChange={handleUserChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {volunteers.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name} ({v.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentUser && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-sage-50">
              <Avatar className="w-10 h-10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sage-900 truncate">{currentUser.name}</p>
                <Badge variant={currentUser.role === 'coordinator' ? 'default' : 'secondary'} className="mt-0.5">
                  {currentUser.role === 'coordinator' ? 'Coordinator' : 'Volunteer'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
