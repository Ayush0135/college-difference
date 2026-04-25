import { useState, useEffect } from 'react'
import { Search, ChevronRight, BookOpen, Briefcase, Landmark, Palette, GraduationCap, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { API_URL } from '@/lib/api'

const slides = [
    { url: '/assets/hero/vit_vellore_building_1776026058352.png', location: 'VIT University, Vellore' },
    { url: '/assets/hero/bits_pilani_building_1776026113928.png', location: 'BITS Pilani, Rajasthan' },
    { url: '/assets/hero/srm_university_building_1776026148647.png', location: 'SRM University, Chennai' },
]

const StudyGoals = [
    { name: 'Engineering', icon: BookOpen, count: '6367 Colleges', sub: 'BE/B.Tech' },
    { name: 'Management', icon: Briefcase, count: '8060 Colleges', sub: 'MBA/PGDM' },
    { name: 'Commerce', icon: Landmark, count: '5092 Colleges', sub: 'B.Com' },
    { name: 'Arts', icon: Palette, count: '5723 Colleges', sub: 'BA' },
]

const PopularCities = [
    { name: 'Delhi NCR', count: '850+ Colleges', sub: 'HUB OF EDUCATION' },
    { name: 'Bengaluru', count: '600+ Colleges', sub: 'TECH & INNOVATION' },
    { name: 'Mumbai', count: '500+ Colleges', sub: 'FINANCIAL CAPITAL' },
    { name: 'Pune', count: '450+ Colleges', sub: 'OXFORD OF EAST' },
]

const TrendingExams = [
    { name: 'JEE Main', count: '2500+ Colleges', sub: 'Engineering' },
    { name: 'NEET', count: '1800+ Colleges', sub: 'Medical' },
    { name: 'CAT', count: '1200+ Colleges', sub: 'Management' },
    { name: 'CLAT', count: '800+ Colleges', sub: 'Law' },
]

import { useRouter } from 'next/navigation'

export default function Hero({ 
    onGoalSelect, 
    onCitySelect,
    onSearchChange,
    hideNavigator = false,
    hideHubs = false
}: { 
    onGoalSelect: (goal: string) => void, 
    onCitySelect: (city: string) => void,
    onSearchChange: (search: string) => void,
    hideNavigator?: boolean,
    hideHubs?: boolean
}) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [searchQuery, setSearchQuery] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (searchQuery.length > 2) {
            fetch(`${API_URL}/colleges?search=${searchQuery}`)
                .then(res => res.json())
                .then(data => setSuggestions(data.slice(0, 5)))
                .catch(err => console.error('Search error:', err))
        } else {
            setSuggestions([])
        }
    }, [searchQuery])

    const handleSearchInput = (val: string) => {
        setSearchQuery(val)
        onSearchChange(val)
    }

    const handleSuggestionClick = (slug: string) => {
        router.push(`/colleges/${slug}`)
    }

    return (
        <div className="relative">
            {/* Main Hero Section */}
            <section className="relative h-[75vh] min-h-[600px] flex flex-col items-center justify-center pt-32 overflow-hidden">
                {/* Background Image Slider */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        <motion.img 
                            key={currentSlide}
                            src={slides[currentSlide].url}
                            alt="Campus" 
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
                </div>

                <div className="container mx-auto px-4 z-10 text-center space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 flex flex-col items-center"
                    >
                        <div className="flex items-center justify-center mb-2">
                            <span className="inline-block text-emerald-400 font-bold tracking-[0.3em] uppercase text-xs bg-emerald-400/10 px-5 py-2.5 rounded-full border border-emerald-400/20 backdrop-blur-md">
                                Academic Excellence & Discovery
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none px-4">
                            Find Your Future <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Education</span> in India
                        </h1>
                    </motion.div>

                     {/* Trending Discovery Chips */}
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-2 mb-6 relative z-30 px-2"
                     >
                        <span className="hidden sm:inline text-white/40 text-[9px] font-black uppercase tracking-[0.2em] italic mr-1">Trending Discovery:</span>
                        {[
                            { label: 'MBA', goal: 'Management' },
                            { label: 'B.Tech', goal: 'Engineering' },
                            { label: 'Nursing', goal: 'Medical' },
                            { label: 'Bengaluru', city: 'Bengaluru' }
                        ].map((chip) => (
                            <button 
                                key={chip.label}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    chip.goal ? onGoalSelect(chip.goal) : onCitySelect(chip.city!);
                                }}
                                className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-black hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95 backdrop-blur-md cursor-pointer pointer-events-auto"
                            >
                                {chip.label}
                            </button>
                        ))}
                     </motion.div>

                    {/* Industrial Search Bar */}
                    <div className="max-w-4xl mx-auto w-full relative z-40 px-4">
                        <div className="flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-1.5 focus-within:ring-4 focus-within:ring-primary/20 transition-all">
                            <div className="flex-1 flex items-center px-4 md:px-6 py-3">
                                <Search className="text-slate-400 mr-3 md:mr-4 shrink-0" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search for colleges, exams.." 
                                    value={searchQuery}
                                    onChange={(e) => handleSearchInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && suggestions.length > 0) {
                                            handleSuggestionClick(suggestions[0].slug)
                                        }
                                    }}
                                    className="w-full outline-none text-base md:text-lg text-secondary placeholder:text-slate-400 font-medium"
                                />
                            </div>
                            <button 
                                onClick={() => suggestions.length > 0 && handleSuggestionClick(suggestions[0].slug)}
                                className="bg-primary hover:bg-primary/90 text-white font-black text-base md:text-lg px-8 md:px-12 py-4 md:py-5 rounded-xl sm:rounded-r-xl transition-all uppercase tracking-wider shadow-lg shadow-primary/30 active:scale-95"
                            >
                                Search
                            </button>
                        </div>

                        {/* Suggestions Dropdown */}
                        <AnimatePresence>
                            {suggestions.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-2"
                                >
                                    {suggestions.map((item) => (
                                        <div 
                                            key={item.id}
                                            onClick={() => handleSuggestionClick(item.slug)}
                                            className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-white font-black text-xs shrink-0">
                                                {item.logo || item.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="font-black text-secondary group-hover:text-primary transition-colors">{item.name}</div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                                                    <MapPin size={12} className="text-primary" /> {item.location}
                                                </div>
                                            </div>
                                            <div className="text-primary font-bold text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                View Profile <ChevronRight size={14} />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <div className="flex flex-wrap items-center justify-center gap-8 mt-10">
                            {[
                                { label: 'Verified Colleges', value: '11,000+' },
                                { label: 'Student Reviews', value: '85,000+' },
                                { label: 'Expert Counsellors', value: '500+' }
                            ].map((stat, i) => (
                                <div key={stat.label} className="flex flex-col items-center">
                                    <span className="text-2xl font-black text-white">{stat.value}</span>
                                    <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Instant Search Results Section */}
            <AnimatePresence>
                {searchQuery.length > 2 && suggestions.length > 0 && (
                    <motion.section 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-50 border-y border-slate-200 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-12">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-secondary">
                                    Top Results for <span className="text-primary">"{searchQuery}"</span>
                                </h3>
                                <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                                    {suggestions.length} Institutions Found
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {suggestions.map((item) => (
                                    <motion.div 
                                        key={item.id}
                                        onClick={() => handleSuggestionClick(item.slug)}
                                        whileHover={{ y: -5 }}
                                        className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 cursor-pointer hover:shadow-xl transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-white font-black text-xs shrink-0 group-hover:scale-110 transition-transform">
                                            {item.logo || item.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-black text-secondary group-hover:text-primary transition-colors line-clamp-1">{item.name}</div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400 font-bold mt-1">
                                                <MapPin size={12} className="text-primary" /> {item.location}
                                            </div>
                                            <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
                                                <GraduationCap size={14} /> View Degrees
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Study Goal Navigator */}
            <section className="bg-white py-24 relative z-20 rounded-t-[3rem] shadow-2xl">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-secondary">Select Your <span className="text-primary italic">Study Goal</span></h2>
                            <p className="text-muted-foreground mt-2 font-medium">Streamlined discovery for the most competitive degrees.</p>
                        </div>
                        <button className="text-primary font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                            View All Goals <ChevronRight size={20} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {StudyGoals.map((goal, i) => (
                            <motion.div 
                                key={goal.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => onGoalSelect(goal.name)}
                                className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:bg-white hover:-translate-y-2 transition-all cursor-pointer group flex flex-col justify-between min-h-[260px]"
                            >
                                <div className="space-y-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:shadow-lg group-hover:shadow-primary/10 transition-all border border-slate-100">
                                        <goal.icon size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-secondary">{goal.name}</h3>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-tighter mt-1">{goal.count}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-slate-200/50 flex items-center justify-between text-slate-500 font-black">
                                    <span className="text-xs tracking-wider">{goal.sub}</span>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-24">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-4xl font-black text-secondary uppercase tracking-tighter italic">Top <span className="text-emerald-500">Education Hubs</span></h2>
                                <p className="text-muted-foreground mt-2 font-medium">Explore institutions in India's most vibrant academic cities.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {PopularCities.map((city, i) => (
                                <motion.div 
                                    key={city.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => onCitySelect(city.name)}
                                    className="p-6 bg-slate-900 rounded-[2rem] text-white hover:bg-emerald-600 transition-all cursor-pointer group relative overflow-hidden"
                                >
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-black italic">{city.name}</h4>
                                        <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">{city.sub}</p>
                                        <div className="mt-4 text-emerald-400 group-hover:text-white font-black text-sm transition-colors">{city.count}</div>
                                    </div>
                                    <MapPin size={64} className="absolute -bottom-4 -right-4 text-white/5 group-hover:text-white/10 transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
