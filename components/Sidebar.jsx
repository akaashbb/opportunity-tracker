'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Briefcase, Users, UserCircle,
  LogOut, TrendingUp, PlusCircle, ChevronRight
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Opportunities', href: '/opportunities', icon: Briefcase },
  { label: 'Add Opportunity', href: '/opportunities/new', icon: PlusCircle },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Sales Managers', href: '/managers', icon: UserCircle },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const initials = user?.email?.substring(0, 2).toUpperCase() || 'US'

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <TrendingUp size={18} color="#7c3aed" />
          <h2>OpportunityPro</h2>
        </div>
        <p>Sales Pipeline Tracker</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${active ? 'active' : ''}`}
            >
              <Icon size={16} />
              {item.label}
              {active && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div style={{ overflow: 'hidden' }}>
            <div className="user-name">{user?.user_metadata?.full_name || 'User'}</div>
            <div className="user-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email || ''}
            </div>
          </div>
        </div>
        <button className="nav-link" onClick={handleLogout} style={{ color: '#ef4444', marginTop: 4 }}>
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
