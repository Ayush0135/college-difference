'use client'

import { LayoutDashboard, GraduationCap, Users, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { logout } = useAuth()

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 text-foreground">
            {/* Top Header */}
            <header className="bg-secondary border-b border-white/5 py-4 px-8 flex items-center justify-between sticky top-0 z-[100]">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white italic tracking-tighter">
                        Degree<span className="text-primary italic">Difference</span> <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-1 rounded ml-2 font-black text-primary">ADMIN</span>
                    </h1>
                </div>
                
                <div className="flex items-center gap-6">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
