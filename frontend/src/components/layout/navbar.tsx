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
            <header className="fixed top-0 left-0 w-full z-50 shadow-md">
                {/* Top Bar - Solid Blue */}
                <div className="bg-secondary text-white border-b border-white/10">
                    <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                                    <GraduationCap size={20} className="text-secondary" />
                                </div>
                                <span>
                                    Degree<span className="text-primary">Difference</span>
                                </span>
                            </Link>
                        </div>

                        {/* Search Bar - Center */}
                        <div className="flex-1 max-w-2xl mx-6 hidden lg:block">
                            <div className="relative flex items-center">
                                <input 
                                    type="text" 
                                    placeholder="Search for Colleges, Exams, Courses & more" 
                                    className="w-full bg-white rounded-sm py-2 pl-4 pr-12 text-sm outline-none text-slate-800 h-[40px]"
                                />
                                <button className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-sm hover:bg-primary/90 transition-colors flex items-center justify-center">
                                    <Search size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Right side icons */}
                        <div className="flex items-center gap-4 text-white text-sm font-medium">
                            <button onClick={() => setIsMobileSearchOpen(true)} className="lg:hidden p-2">
                                <Search size={22} />
                            </button>

                            <div className="hidden sm:flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                                <Bell size={20} />
                            </div>
                            
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded border border-white/10">
                                        <User size={16} />
                                        <span className="truncate max-w-[100px]">{user.email.split('@')[0]}</span>
                                    </div>
                                    <button onClick={() => logout()} className="text-white/80 hover:text-red-400 transition-colors p-2">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={openAuthModal}
                                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded transition-colors flex items-center gap-2 text-white"
                                >
                                    <User size={16} />
                                    <span className="hidden xs:inline">Login / Sign Up</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Navigation - White Background */}
                <div className="bg-white border-b border-slate-200 hidden md:block shadow-sm">
                    <div className="container mx-auto px-4">
                        <ul className="flex items-center gap-6 overflow-x-auto py-3 text-sm font-bold text-slate-700 whitespace-nowrap">
                            <li className="cursor-pointer hover:text-primary transition-colors">All Courses</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">B.Tech</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">MBA</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">M.Tech</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">MBBS</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">B.Com</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">B.Sc</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">BA</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">BBA</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">Design</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">Law</li>
                            <li className="cursor-pointer hover:text-primary transition-colors">Study Abroad</li>
                        </ul>
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

