'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, X, Check, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

export default function GoalCitySelector() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'Select City')
    const [selectedGoal, setSelectedGoal] = useState(searchParams.get('goal') || 'Select Goal')
    const [step, setStep] = useState<'goal' | 'city'>('goal')
    
    // DB state
    const [goals, setGoals] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gRes, cRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/locations/goals`),
                    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/locations/cities`)
                ])
                const gData = await gRes.json()
                const cData = await cRes.json()
                setGoals(gData.map((g: any) => g.name))
                setCities(cData.map((c: any) => c.name))
            } catch (err) {
                console.error('Failed to fetch selector data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const containerRef = useRef<HTMLDivElement>(null)

    const filteredCities = cities.filter(city => 
        city.toLowerCase().includes(search.toLowerCase())
    )

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const updateUrl = (goal: string, city: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (goal && goal !== 'Select Goal') params.set('goal', goal)
        if (city && city !== 'Select City') params.set('city', city)
        router.push(`/?${params.toString()}`)
    }

    const handleSelectCity = async (city: string) => {
        setSelectedCity(city)
        setIsOpen(false)
        setSearch('')
        localStorage.setItem('user_city', city)
        updateUrl(selectedGoal, city)

        // Persist to database
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/locations/save-preference`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    city, 
                    goal: selectedGoal,
                    email: 'guest@degreedifference.com' 
                })
            })
        } catch (error) {
            console.error('Failed to sync preference:', error)
        }
    }

    const handleSelectGoal = (goal: string) => {
        setSelectedGoal(goal)
        setStep('city')
        localStorage.setItem('user_goal', goal)
        updateUrl(goal, selectedCity)
    }

    return (
        <div className="relative" ref={containerRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 cursor-pointer hover:text-white group transition-colors"
            >
                <MapPin size={16} className="text-emerald-400" />
                <span className="text-sm font-medium">
                    {selectedGoal !== 'Select Goal' && selectedCity !== 'Select City' 
                        ? `${selectedGoal} in ${selectedCity}` 
                        : 'Select Goal & City'}
                </span>
                <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-12 left-0 w-[350px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] backdrop-blur-xl"
                    >
                        {/* Header Tabs */}
                        <div className="flex border-b border-white/5">
                            <button 
                                onClick={() => setStep('goal')}
                                className={cn(
                                    "flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors",
                                    step === 'goal' ? "text-emerald-400 bg-white/5" : "text-white/40 hover:text-white"
                                )}
                            >
                                1. Study Goal
                            </button>
                            <button 
                                onClick={() => setStep('city')}
                                className={cn(
                                    "flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors",
                                    step === 'city' ? "text-emerald-400 bg-white/5" : "text-white/40 hover:text-white"
                                )}
                            >
                                2. Select City
                            </button>
                        </div>

                        <div className="p-4">
                            {step === 'goal' ? (
                                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {loading ? (
                                        <div className="col-span-2 py-8 text-center text-white/20 italic text-xs">Loading goals...</div>
                                    ) : (
                                        goals.map(goal => (
                                            <button 
                                                key={goal}
                                                onClick={() => handleSelectGoal(goal)}
                                                className={cn(
                                                    "p-3 rounded-xl border text-sm font-medium transition-all text-left flex justify-between items-center group",
                                                    selectedGoal === goal 
                                                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                                                        : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/20"
                                                )}
                                            >
                                                {goal}
                                                {selectedGoal === goal && <Check size={14} />}
                                            </button>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                        <input 
                                            autoFocus
                                            type="text"
                                            placeholder="Search city..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white outline-none focus:border-emerald-500/50 transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
                                        {filteredCities.map(city => (
                                            <button 
                                                key={city}
                                                onClick={() => handleSelectCity(city)}
                                                className={cn(
                                                    "p-2.5 rounded-lg text-sm transition-all text-left hover:bg-white/5",
                                                    selectedCity === city ? "text-emerald-400" : "text-white/60"
                                                )}
                                            >
                                                {city}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-white/5 flex justify-between items-center">
                            <span className="text-[10px] text-white/30 uppercase font-black uppercase tracking-tighter">Degree Difference</span>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
