'use client'

import { Search, Grid, Bell, User, GraduationCap, LogOut } from 'lucide-react'
import Link from 'next/link'
import GoalCitySelector from './goal-city-selector'
import { useAuth } from '@/contexts/AuthContext'
import { Suspense } from 'react'

export default function Navbar() {
    const { user, openAuthModal, logout } = useAuth()

    return (
        <header className="absolute top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-sm border-b border-white/10">
            {/* Top Bar */}
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg shadow-blue-500/20">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <span className="flex items-center">
                            Degree<span className="text-emerald-400">Difference</span>
                        </span>
                    </Link>
                    
                    <div className="hidden lg:flex items-center gap-4 text-white/80 text-sm font-medium">
                        <Suspense fallback={<div className="h-4 w-24 bg-white/10 rounded animate-pulse" />}>
                            <GoalCitySelector />
                        </Suspense>
                    </div>
                </div>

                <div className="flex-1 max-w-2xl mx-12 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search for Colleges, Exams, Courses and More.." 
                            className="w-full bg-white rounded-md py-2.5 pl-12 pr-4 text-sm outline-none text-secondary"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6 text-white text-sm font-bold">
                    <div className="flex items-center gap-1 cursor-pointer">
                        <Grid size={18} />
                        <span>Explore</span>
                    </div>

                    <Bell size={20} className="cursor-pointer" />
                    
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                                <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-xs">
                                    {user.email.charAt(0).toUpperCase()}
                                </span>
                                <span className="font-medium text-xs truncate max-w-[100px]">{user.email.split('@')[0]}</span>
                            </div>
                            <button onClick={logout} className="text-white/60 hover:text-red-400 transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={openAuthModal}
                            className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-full transition-colors flex items-center gap-2 text-white shadow-lg shadow-emerald-500/20"
                        >
                            <User size={16} />
                            <span>Sign In</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}
