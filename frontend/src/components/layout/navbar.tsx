'use client'

import { Search, Grid, Bell, User, GraduationCap, LogOut, X } from 'lucide-react'
import Link from 'next/link'
import GoalCitySelector from './goal-city-selector'
import { useAuth } from '@/contexts/AuthContext'
import { Suspense, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
export default function Navbar() {
    const { user, openAuthModal, logout } = useAuth()
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

    return (
        <>
            <header className="absolute top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-sm border-b border-white/10">
                {/* Top Bar */}
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link href="/" className="text-lg md:text-xl font-black tracking-tight text-white flex items-center gap-2">
                            <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 shadow-lg shadow-blue-500/20">
                                <GraduationCap size={18} className="text-white" />
                            </div>
                            <span className="flex items-center">
                                Degree<span className="hidden sm:inline text-emerald-400">Difference</span>
                                <span className="sm:hidden text-emerald-400">D.</span>
                            </span>
                        </Link>
                        
                        <div className="hidden lg:flex items-center gap-4 text-white/80 text-sm font-medium">
                            <Suspense fallback={<div className="h-4 w-24 bg-white/10 rounded animate-pulse" />}>
                                <GoalCitySelector />
                            </Suspense>
                        </div>
                    </div>

                    <div className="flex-1 max-w-2xl mx-6 lg:mx-12 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search for Colleges, Exams.." 
                                className="w-full bg-white rounded-md py-2.5 pl-12 pr-4 text-sm outline-none text-secondary"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 text-white text-sm font-bold">
                        <button 
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="md:hidden text-white/80 hover:text-white"
                        >
                            <Search size={22} />
                        </button>

                        <div className="hidden sm:flex items-center gap-1 cursor-pointer">
                            <Grid size={18} />
                            <span>Explore</span>
                        </div>

                        <Bell size={20} className="hidden sm:block cursor-pointer" />
                        
                        {user ? (
                            <div className="flex items-center gap-2 md:gap-4">
                                <div className="flex items-center gap-2 bg-white/10 px-2 md:px-3 py-1.5 rounded-full border border-white/10">
                                    <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] md:text-xs">
                                        {user.email.charAt(0).toUpperCase()}
                                    </span>
                                    <span className="font-medium text-[10px] md:text-xs truncate max-w-[60px] md:max-w-[100px]">{user.email.split('@')[0]}</span>
                                </div>
                                <button onClick={logout} className="text-white/60 hover:text-red-400 transition-colors">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={openAuthModal}
                                className="bg-emerald-500 hover:bg-emerald-600 px-4 md:px-5 py-2 rounded-full transition-colors flex items-center gap-2 text-white shadow-lg shadow-emerald-500/20 text-xs md:text-sm"
                            >
                                <User size={16} />
                                <span className="hidden xs:inline">Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Search Overlay */}
            <AnimatePresence>
                {isMobileSearchOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[100] bg-secondary p-6"
                    >
                        <div className="flex flex-col h-full gap-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white font-black text-xl italic">Search Discovery</h3>
                                <button onClick={() => setIsMobileSearchOpen(false)} className="text-white/60 hover:text-white p-2">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input 
                                    autoFocus
                                    type="text" 
                                    placeholder="Search Colleges, Courses.." 
                                    className="w-full bg-white border-2 border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none text-secondary font-bold"
                                />
                            </div>
                            <div className="space-y-4">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Popular Hubs</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Delhi', 'Mumbai', 'Pune', 'Bengaluru'].map(h => (
                                        <button key={h} className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold">{h}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

