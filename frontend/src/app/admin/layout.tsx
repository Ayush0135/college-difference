'use client'

import { LayoutDashboard, GraduationCap, Users, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
        { icon: GraduationCap, label: 'Colleges', href: '/admin/colleges' },
        { icon: Users, label: 'Leads', href: '/admin/leads' },
        { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ]

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 bg-secondary border-r border-border flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-white italic">College<span className="text-primary font-bold">Admin</span></h1>
                </div>
                
                <nav className="flex-1 px-4 py-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                pathname === item.href 
                                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 transition-colors">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
