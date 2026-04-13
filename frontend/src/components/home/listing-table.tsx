'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, ExternalLink, ShieldCheck, Clock, TrendingUp, X, CheckCircle2, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = ['Engineering', 'Management', 'Medical', 'Law', 'Commerce']

const colleges = [
    { rank: 1, name: 'Parul University', stream: 'Engineering', logo: 'PU', agency: 'NAAC A++', cutoff: '85.0', deadline: 'July 15', fees: '1.5L', location: 'Vadodara, Gujarat', description: 'Ranked among top private universities with 100+ global partnerships.' },
    { rank: 2, name: 'MMU Mullana', stream: 'Engineering', logo: 'MMU', agency: 'NIRF', cutoff: '82.5', deadline: 'June 30', fees: '1.4L', location: 'Mullana, Haryana', description: 'Leading institution in North India with strong placement records.' },
    { rank: 3, name: 'JECRC University', stream: 'Engineering', logo: 'JU', agency: 'UGC', cutoff: '88.0', deadline: 'June 15', fees: '2.7L', location: 'Jaipur, Rajasthan', description: 'Known for innovation-led education and excellent industry interface.' },
    { rank: 4, name: 'Noida International University', stream: 'Management', logo: 'NIU', agency: 'NAAC', cutoff: '80.0', deadline: 'July 10', fees: '4.0L', location: 'Greater Noida, UP', description: 'Global standards of education with world-class infrastructure.' },
    { rank: 5, name: 'Marwadi University', stream: 'Management', logo: 'MU', agency: 'NAAC A+', cutoff: '84.0', deadline: 'June 25', fees: '1.3L', location: 'Rajkot, Gujarat', description: 'Emphasis on entrepreneurship and skill-based learning.' },
    { rank: 6, name: 'Jagannath University', stream: 'Law', logo: 'JN', agency: 'ICAR', cutoff: '78.5', deadline: 'July 05', fees: '1.2L', location: 'Jaipur, Rajasthan', description: 'Comprehensive legal education with focus on clinical legal training.' },
    { rank: 7, name: 'Tamilnadu College of Engineering', stream: 'Engineering', logo: 'TCE', agency: 'Anna Univ', cutoff: '85.5', deadline: 'June 20', fees: '0.6L', location: 'Coimbatore, TN', description: 'Established legacy of technical excellence in South India.' },
    { rank: 8, name: 'Desh Bhagat University', stream: 'Medical', logo: 'DBU', agency: 'NAAC', cutoff: '75.0', deadline: 'Aug 15', fees: '1.0L', location: 'Punjab', description: 'Premier medical and healthcare education center.' },
]

export default function ListingTable({ 
    initialCategory = 'Engineering', 
    externalSearch = '' 
}: { 
    initialCategory?: string, 
    externalSearch?: string 
}) {
    const [activeCategory, setActiveCategory] = useState(initialCategory)
    const [search, setSearch] = useState(externalSearch)
    const [selectedCollege, setSelectedCollege] = useState<any>(null)

    // Sync from external props
    useEffect(() => {
        setActiveCategory(initialCategory)
    }, [initialCategory])

    useEffect(() => {
        setSearch(externalSearch)
    }, [externalSearch])

    const filteredColleges = useMemo(() => {
        return colleges.filter(c => 
            c.stream === activeCategory && 
            c.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [activeCategory, search])

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-4 text-primary font-black uppercase tracking-widest text-xs">
                            <TrendingUp size={14} /> Real-time Updates
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tighter leading-none mb-6">
                            Verified <span className="italic text-primary">Partner</span> Institutions
                        </h2>
                        
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-6 py-2 rounded-full text-sm font-black transition-all border-2",
                                        activeCategory === cat 
                                            ? "bg-secondary border-secondary text-white shadow-lg" 
                                            : "bg-white border-slate-200 text-slate-500 hover:border-primary hover:text-primary shadow-sm"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search in this list..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary transition-all shadow-sm font-medium"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <th className="px-8 py-6">Rank</th>
                                    <th className="px-4 py-6">College</th>
                                    <th className="px-4 py-6">Agency & Cutoff</th>
                                    <th className="px-4 py-6">App Deadline</th>
                                    <th className="px-4 py-6">Total Fees</th>
                                    <th className="px-4 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredColleges.map((college) => (
                                    <motion.tr 
                                        layout
                                        key={college.name}
                                        className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedCollege(college)}
                                    >
                                        <td className="px-8 py-8">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-secondary group-hover:bg-primary group-hover:text-white transition-all">
                                                {college.rank}
                                            </div>
                                        </td>
                                        <td className="px-4 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-xs shadow-xl">
                                                    {college.logo}
                                                </div>
                                                <div>
                                                    <div className="font-black text-secondary text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                                                        {college.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                                                        <MapPin size={12} className="text-primary" />
                                                        {college.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-8">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5">
                                                    <ShieldCheck size={14} className="text-emerald-500" />
                                                    <span className="text-xs font-black text-emerald-600">{college.agency} Verified</span>
                                                </div>
                                                <div className="text-sm font-black text-secondary">{college.cutoff}% Percentile</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-secondary">{college.deadline}</span>
                                                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">Hurry, Ends Soon!</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-secondary">₹{college.fees}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Average Package ₹4.5L+</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-8 text-right">
                                            <button className="bg-slate-100 text-secondary hover:bg-primary hover:text-white px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 ml-auto">
                                                View Details
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedCollege && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCollege(null)}
                            className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[101] overflow-y-auto"
                        >
                            <div className="p-12">
                                <button 
                                    onClick={() => setSelectedCollege(null)}
                                    className="p-3 bg-slate-100 rounded-full hover:bg-primary hover:text-white transition-all mb-12"
                                >
                                    <X size={24} />
                                </button>

                                <div className="space-y-12">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-6">
                                            <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                                                {selectedCollege.logo}
                                            </div>
                                            <h2 className="text-5xl font-black text-secondary tracking-tighter leading-none">
                                                {selectedCollege.name}
                                            </h2>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm font-bold text-slate-600">
                                                    <MapPin size={16} className="text-primary" /> {selectedCollege.location}
                                                </div>
                                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-sm font-bold text-emerald-600">
                                                    <CheckCircle2 size={16} /> {selectedCollege.agency} Accredited
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <h4 className="text-xl font-black text-secondary mb-4">About the University</h4>
                                        <p className="text-slate-600 leading-relaxed font-medium">
                                            {selectedCollege.description} This institution provides state-of-the-art facilities and a curriculum designed for the modern job market.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 text-center">
                                        <div className="p-8 border-2 border-slate-100 rounded-[2.5rem]">
                                            <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Program Fee</div>
                                            <div className="text-3xl font-black text-secondary">₹{selectedCollege.fees}</div>
                                        </div>
                                        <div className="p-8 border-2 border-slate-100 rounded-[2.5rem]">
                                            <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Avg Placement</div>
                                            <div className="text-3xl font-black text-primary">₹6.2L PA</div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 sticky bottom-0 bg-white pt-8 pb-4">
                                        <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-black py-6 rounded-2xl text-xl shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-3">
                                            <Zap size={24} className="fill-white" /> Easy Apply Now
                                        </button>
                                        <button className="p-6 bg-slate-100 hover:bg-slate-200 text-secondary rounded-2xl transition-all">
                                            <ExternalLink size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    )
}
