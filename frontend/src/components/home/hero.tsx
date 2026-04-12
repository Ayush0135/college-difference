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

export default function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [])
    return (
        <div className="relative">
            {/* Main Hero Section */}
            <section className="relative h-[65vh] min-h-[500px] flex flex-col items-center justify-center pt-32 overflow-hidden">
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
                            transition={{ duration: 0.8 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="container mx-auto px-4 z-10 text-center space-y-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        Find Over 11000+ Courses in India
                    </h1>

                    {/* Industrial Search Bar */}
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="flex bg-white rounded overflow-hidden shadow-2xl p-1">
                            <div className="flex-1 flex items-center px-6 py-2">
                                <Search className="text-slate-300 mr-3" size={24} />
                                <input 
                                    type="text" 
                                    placeholder="Search for colleges, exams, courses and more.." 
                                    className="w-full outline-none text-lg text-secondary placeholder:text-slate-400"
                                />
                            </div>
                            <button className="bg-primary hover:bg-primary/90 text-white font-bold text-xl px-12 py-4 transition-all uppercase tracking-wider">
                                Search
                            </button>
                        </div>
                        
                        {/* Counselling Button directly below search */}
                        <div className="flex justify-end mt-4">
                            <button className="bg-primary text-white font-bold px-8 py-3 rounded text-sm hover:bg-primary/90 transition-all shadow-lg">
                                Need Counselling
                            </button>
                        </div>
                    </div>
                </div>

                {/* Location Label */}
                <div className="absolute bottom-4 right-8 z-10 text-white/80 text-xs font-bold flex items-center gap-4">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={currentSlide}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                        >
                            {slides[currentSlide].location}
                        </motion.span>
                    </AnimatePresence>
                    <span className="bg-black/50 px-2 py-1 rounded">{currentSlide + 1} / {slides.length}</span>
                </div>
            </section>

            {/* Study Goal Navigator */}
            <section className="bg-white py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-black text-secondary mb-8">Select Your Study Goal</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {StudyGoals.map((goal) => (
                            <div 
                                key={goal.name}
                                className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between min-h-[220px]"
                            >
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                        <goal.icon size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-secondary">{goal.name}</h3>
                                        <p className="text-slate-400 text-sm">{goal.count}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-slate-500 font-medium">
                                    <span className="text-sm">{goal.sub}</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
