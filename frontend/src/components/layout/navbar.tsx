'use client'

import { Search, MapPin, ChevronDown, Edit3, Grid, Bell, User } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
    return (
        <header className="absolute top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-sm border-b border-white/10">
            {/* Top Bar */}
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-black text-white flex items-center gap-1">
                        collegedunia <span className="text-[10px] bg-primary px-1 rounded">.</span>
                    </Link>
                    
                    <div className="hidden lg:flex items-center gap-4 text-white/80 text-sm font-medium">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-white">
                            <MapPin size={16} className="text-primary" />
                            <span>Select Goal & City</span>
                            <ChevronDown size={14} />
                        </div>
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
                    <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                        <Edit3 size={18} />
                        <div className="flex flex-col">
                            <span>Write a Review</span>
                            <span className="text-[10px] bg-primary/20 text-primary px-1 rounded">Get Upto ₹300*</span>
                        </div>
                    </div>
                    
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

            {/* Nav Bar */}
            <div className="bg-black/20 text-white/90 text-xs font-bold py-2">
                <div className="container mx-auto px-4 flex items-center gap-6">
                    {['All Courses', 'B.Tech', 'MBA', 'M.Tech', 'MBBS', 'B.Com', 'B.Sc', 'B.Sc (Nursing)', 'BA', 'BBA', 'BCA'].map(nav => (
                        <Link key={nav} href="#" className="hover:text-primary transition-colors whitespace-nowrap">
                            {nav}
                        </Link>
                    ))}
                    <div className="ml-auto flex items-center gap-4">
                        <Link href="#" className="flex items-center gap-1">Study Abroad</Link>
                        <Link href="#" className="flex items-center gap-1 text-blue-400">Course Finder</Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
