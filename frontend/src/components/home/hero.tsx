import { useState, useEffect } from 'react'
import { Search, ChevronRight, BookOpen, Briefcase, Landmark, Palette, GraduationCap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

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
    { name: 'Delhi NCR', count: '850+ Colleges', sub: 'Hub of Education' },
    { name: 'Bengaluru', count: '600+ Colleges', sub: 'Tech & Innovation' },
    { name: 'Mumbai', count: '500+ Colleges', sub: 'Financial Capital' },
    { name: 'Pune', count: '450+ Colleges', sub: 'Oxford of East' },
]

const TrendingExams = [
    { name: 'JEE Main', count: '2500+ Colleges', sub: 'Engineering' },
    { name: 'NEET', count: '1800+ Colleges', sub: 'Medical' },
    { name: 'CAT', count: '1200+ Colleges', sub: 'Management' },
    { name: 'CLAT', count: '800+ Colleges', sub: 'Law' },
]

export default function Hero({ 
    onGoalSelect, 
    onSearchChange 
}: { 
    onGoalSelect: (goal: string) => void, 
    onSearchChange: (search: string) => void 
}) {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

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
                        className="space-y-6"
                    >
                        <span className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-xs bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20 backdrop-blur-md">
                            Academic Excellence & Discovery
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                            Find Your Future <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Education</span> in India
                        </h1>
                    </motion.div>

                    {/* Industrial Search Bar */}
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="flex bg-white rounded-2xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-1.5 focus-within:ring-4 focus-within:ring-primary/20 transition-all">
                            <div className="flex-1 flex items-center px-6 py-2">
                                <Search className="text-slate-400 mr-4" size={24} />
                                <input 
                                    type="text" 
                                    placeholder="Search for colleges, exams, courses and more.." 
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full outline-none text-lg text-secondary placeholder:text-slate-400 font-medium"
                                />
                            </div>
                            <button className="bg-primary hover:bg-primary/90 text-white font-black text-lg px-12 py-5 rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-primary/30 active:scale-95">
                                Search
                            </button>
                        </div>
                        
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
                </div>
            </section>
        </div>
    )
}
