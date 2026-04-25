'use client'
import { API_URL } from '@/lib/api'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, MapPin, Target, ChevronRight, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LocationModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (city: string, goal: string) => void
}

export default function LocationModal({ isOpen, onClose, onSelect }: LocationModalProps) {
    const [cities, setCities] = useState<any[]>([])
    const [goals, setGoals] = useState<any[]>([])
    const [selectedCity, setSelectedCity] = useState('')
    const [selectedGoal, setSelectedGoal] = useState('')
    const [searchCity, setSearchCity] = useState('')
    const [loadingLocation, setLoadingLocation] = useState(false)

    useEffect(() => {
        if (isOpen) {
            const fetchLocations = async () => {
                const fallbackCities = [{ id: 1, name: 'Mumbai' }, { id: 2, name: 'Bengaluru' }, { id: 3, name: 'Delhi' }, { id: 4, name: 'Pune' }]
                const fallbackGoals = [{ id: 1, name: 'Engineering' }, { id: 2, name: 'Management' }, { id: 3, name: 'Medical' }, { id: 4, name: 'Science' }]
                
                try {
                    const [citiesRes, goalsRes] = await Promise.all([
                        fetch(`${API_URL}/locations/cities`),
                        fetch(`${API_URL}/locations/goals`)
                    ])
                    
                    if (citiesRes.ok) {
                        setCities(await citiesRes.json())
                    } else {
                        setCities(fallbackCities)
                    }
                    
                    if (goalsRes.ok) {
                        setGoals(await goalsRes.json())
                    } else {
                        setGoals(fallbackGoals)
                    }
                } catch (error) {
                    console.error('Failed to fetch location data:', error)
                    setCities(fallbackCities)
                    setGoals(fallbackGoals)
                }
            }
            fetchLocations()
        }
    }, [isOpen])

    const handleApply = () => {
        if (selectedCity && selectedGoal) {
            onSelect(selectedCity, selectedGoal)
            onClose()
        }
    }

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser')
            return
        }

        setLoadingLocation(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
                    const data = await res.json()
                    const city = data.city || data.locality || data.principalSubdivision
                    if (city) {
                        setSelectedCity(city)
                    } else {
                        alert('Could not determine city from your location')
                    }
                } catch (error) {
                    console.error('Error detecting location', error)
                    alert('Error connecting to location service')
                } finally {
                    setLoadingLocation(false)
                }
            },
            (error) => {
                console.error('Error getting location', error)
                setLoadingLocation(false)
                alert('Permission denied or unable to retrieve your location')
            }
        )
    }

    const filteredCities = cities.filter(c => 
        c.name.toLowerCase().includes(searchCity.toLowerCase())
    )

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
                    >
                        {/* Left: Goals */}
                        <div className="w-full md:w-1/3 bg-slate-50 p-8 border-r border-slate-100">
                            <div className="flex items-center gap-2 mb-8 text-secondary">
                                <Target className="text-primary" size={24} />
                                <h2 className="text-xl font-black italic">Select Study Goal</h2>
                            </div>
                            
                            <div className="space-y-2">
                                {goals.map(goal => (
                                    <button
                                        key={goal.name}
                                        onClick={() => setSelectedGoal(goal.name)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl transition-all font-bold text-sm",
                                            selectedGoal === goal.name 
                                                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                                : "bg-white text-slate-500 hover:bg-slate-100"
                                        )}
                                    >
                                        {goal.name}
                                        <ChevronRight size={16} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Cities */}
                        <div className="flex-1 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2 text-secondary">
                                    <MapPin className="text-primary" size={24} />
                                    <h2 className="text-xl font-black italic">Select City</h2>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="relative mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text"
                                    placeholder="Search your city..."
                                    value={searchCity}
                                    onChange={(e) => setSearchCity(e.target.value)}
                                    className="w-full bg-slate-50 rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                                />
                            </div>
                            
                            <button 
                                onClick={handleDetectLocation}
                                disabled={loadingLocation}
                                className="w-full flex items-center justify-center gap-2 mb-6 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-100 border border-emerald-100 transition-colors disabled:opacity-50"
                            >
                                <Compass size={16} className={loadingLocation ? "animate-spin" : ""} />
                                {loadingLocation ? 'Detecting Location...' : 'Auto Detect My Location'}
                            </button>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredCities.map(city => (
                                    <button
                                        key={city.name}
                                        onClick={() => setSelectedCity(city.name)}
                                        className={cn(
                                            "p-3 rounded-lg text-xs font-bold transition-all border text-center",
                                            selectedCity === city.name
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-slate-100 text-slate-500 hover:border-primary/30"
                                        )}
                                    >
                                        {city.name}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleApply}
                                    disabled={!selectedCity || !selectedGoal}
                                    className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black px-12 py-4 rounded-xl transition-all uppercase tracking-tighter shadow-xl shadow-primary/10"
                                >
                                    Explore Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
