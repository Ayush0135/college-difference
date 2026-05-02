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
            {/* Main Hero Section - Collegedunia Style */}
            <section className="relative h-[450px] md:h-[500px] flex flex-col items-center justify-center pt-24 overflow-hidden mt-[100px]">
                {/* Background Image Slider */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        <motion.img 
                            key={currentSlide}
                            src={slides[currentSlide].url}
                            alt="Campus" 
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0.8 }}
                            transition={{ duration: 1.2 }}
                            className="w-full h-full object-cover object-center"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply" />
                </div>

                <div className="container mx-auto px-4 z-10 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Find Top Colleges, Exams, Courses & More
                        </h1>
                    </motion.div>

                    {/* Search Bar - Collegedunia Style */}
                    <div className="max-w-3xl mx-auto w-full relative z-40 px-4 mt-8">
                        <div className="flex flex-col sm:flex-row bg-white rounded-md overflow-hidden shadow-2xl">
                            <div className="flex items-center bg-slate-100 px-4 py-3 md:py-4 border-r border-slate-200 hidden sm:flex">
                                <span className="text-slate-600 font-bold text-sm whitespace-nowrap">All Courses</span>
                            </div>
                            <div className="flex-1 flex items-center px-4 py-2">
                                <Search className="text-slate-400 mr-3 shrink-0" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search for colleges, exams, courses and more..." 
                                    value={searchQuery}
                                    onChange={(e) => handleSearchInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && suggestions.length > 0) {
                                            handleSuggestionClick(suggestions[0].slug)
                                        }
                                    }}
                                    className="w-full outline-none text-base text-slate-800 placeholder:text-slate-400 font-medium"
                                />
                            </div>
                            <button 
                                onClick={() => suggestions.length > 0 && handleSuggestionClick(suggestions[0].slug)}
                                className="bg-primary hover:bg-primary/90 text-white font-bold text-base px-8 py-3 sm:py-0 transition-colors uppercase tracking-wide"
                            >
                                Search
                            </button>
                        </div>

                        {/* Top Searches / Chips */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-white">
                            <span className="text-sm font-medium mr-2">Top Searches:</span>
                            {['B.Tech', 'MBA', 'B.Sc', 'M.Tech', 'B.Com'].map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => onGoalSelect(chip === 'B.Tech' || chip === 'M.Tech' ? 'Engineering' : chip === 'MBA' ? 'Management' : 'Commerce')}
                                    className="text-xs border border-white/40 bg-black/20 hover:bg-white/20 px-3 py-1 rounded transition-colors"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>

                        {/* Suggestions Dropdown */}
                        <AnimatePresence>
                            {suggestions.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-[50px] sm:top-[60px] left-0 w-full mt-2 bg-white rounded-md shadow-2xl border border-slate-100 overflow-hidden z-50 p-2 text-left"
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
            <section className="bg-slate-50 py-16 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Explore Top Colleges by <span className="text-primary">Stream</span></h2>
                        <button className="text-secondary font-bold text-sm hover:text-primary transition-colors">
                            View All Streams &rarr;
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {StudyGoals.map((goal, i) => (
                            <motion.div 
                                key={goal.name}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => onGoalSelect(goal.name)}
                                className="bg-white p-5 rounded-md border border-slate-200 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded bg-slate-50 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                    <goal.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">{goal.name}</h3>
                                    <p className="text-slate-500 text-xs mt-1">{goal.count}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-800">Top Education <span className="text-primary">Hubs</span></h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {PopularCities.map((city, i) => (
                                <motion.div 
                                    key={city.name}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => onCitySelect(city.name)}
                                    className="bg-white p-5 rounded-md border border-slate-200 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer flex items-center gap-4 group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800">{city.name}</h4>
                                        <p className="text-slate-500 text-xs mt-1">{city.count}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
