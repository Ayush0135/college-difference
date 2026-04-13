'use client'

import { Search, Grid, Bell, User, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import GoalCitySelector from './goal-city-selector'

export default function Navbar() {
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
                        <GoalCitySelector />
                    </div>
                </div>

                <div className="flex-1 max-w-2xl mx-12 hidden md:block">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search for Colleges, Exams, Courses and More.." 
                            className="w-full bg-white rounded-md py-2.5 pl-12 pr-4 text-sm outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6 text-white text-sm font-bold">
                    <div className="flex items-center gap-1 cursor-pointer">
                        <Grid size={18} />
                        <span>Explore</span>
                    </div>

                    <Bell size={20} className="cursor-pointer" />
                    
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer">
                        <User size={18} />
                    </div>
                </div>
            </div>
        </header>
    )
}
