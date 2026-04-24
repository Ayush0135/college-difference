'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, ExternalLink, ShieldCheck, Clock, TrendingUp, X, CheckCircle2, Zap, ArrowRight, Loader2, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import ApplyModal from '../college/ApplyModal'

const categories = ['Engineering', 'Management', 'Medical', 'Law', 'Commerce']

export default function ListingTable({ 
    initialCategory = 'Engineering', 
    externalSearch = '' 
}: { 
    initialCategory?: string, 
    externalSearch?: string 
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    // Sync with URL
    const urlGoal = searchParams.get('goal') || initialCategory
    const urlCity = searchParams.get('city') || ''

    const [colleges, setColleges] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState(urlGoal)
    const [search, setSearch] = useState(externalSearch)
    const [selectedCollege, setSelectedCollege] = useState<any>(null)
    const [applyModal, setApplyModal] = useState<{ isOpen: boolean, college: any }>({ isOpen: false, college: null })

    // Fetch colleges
    useEffect(() => {
        setLoading(true)
        const cityParam = urlCity ? `&city=${urlCity}` : ''
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/colleges?goal=${activeCategory}&search=${search}${cityParam}`)
            .then(res => res.json())
            .then(data => {
                setColleges(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Fetch error:', err)
                setLoading(false)
            })
    }, [activeCategory, search, urlCity])

    // Sync from external props
    useEffect(() => {
        setActiveCategory(initialCategory)
    }, [initialCategory])

    useEffect(() => {
        setSearch(externalSearch)
    }, [externalSearch])

    const filteredColleges = useMemo(() => {
        // If searching, show all matches for better discovery
        if (search.trim() || externalSearch.trim()) return colleges;
        // Otherwise limit to top 10 as requested
        return colleges.slice(0, 10);
    }, [colleges, search, externalSearch])

    return (
        <section className={cn(
            "relative overflow-hidden transition-all duration-700 bg-slate-50",
            (search.trim() || externalSearch.trim()) ? "py-12" : "py-24"
        )}>
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

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative min-h-[400px]">
                    {loading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-primary" size={40} />
                            <p className="text-secondary font-black italic">Cataloging institutions...</p>
                        </div>
                    )}
                    
                    {/* Mobile Card View (Visible on small screens) */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {filteredColleges.map((college) => (
                            <div 
                                key={college.id} 
                                className="p-6 bg-white hover:bg-slate-50 transition-colors"
                                onClick={() => router.push(`/colleges/${college.slug}`)}
                            >
                                <div className="flex gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-xs shadow-lg shrink-0">
                                        {college.logo || college.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-primary font-black text-[10px] uppercase tracking-widest mb-1">NIRF Rank #{college.rank || 'N/A'}</div>
                                        <h3 className="font-black text-secondary leading-tight line-clamp-2">{college.name}</h3>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold mt-1">
                                            <MapPin size={12} className="text-primary" /> {college.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Total Fees</div>
                                        <div className="font-black text-secondary">₹{college.fees}</div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Avg Placement</div>
                                        <div className="font-black text-emerald-500">{college.avg_package ? `₹${college.avg_package}L` : 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setApplyModal({ isOpen: true, college })
                                        }}
                                        className="flex-1 bg-primary text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        <Zap size={14} className="fill-white" /> Easy Apply
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/colleges/${college.slug}`)
                                        }}
                                        className="px-4 bg-slate-100 text-secondary py-3 rounded-xl text-xs font-black flex items-center justify-center"
                                    >
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View (Hidden on small screens) */}
                    <div className="hidden md:block overflow-x-auto">
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
                                        key={college.id}
                                        className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                                        onClick={() => router.push(`/colleges/${college.slug}`)}
                                    >
                                        <td className="px-8 py-8">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-secondary group-hover:bg-primary group-hover:text-white transition-all">
                                                {college.rank}
                                            </div>
                                        </td>
                                        <td className="px-4 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white text-xs shadow-xl">
                                                    {college.logo || college.name.charAt(0)}
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
                                                    <span className="text-xs font-black text-emerald-600">{college.agency || 'NAAC'} Verified</span>
                                                </div>
                                                <div className="text-sm font-black text-secondary">{college.cutoff || '85'}% Percentile</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-secondary">{college.deadline || 'Closing Soon'}</span>
                                                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter">Hurry, Ends Soon!</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-secondary">₹{college.fees}</span>
                                                <div className="flex flex-col gap-1 mt-1">
                                                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                                                        <TrendingUp size={10} /> Avg Placement {college.avg_package ? `₹${college.avg_package}L` : 'N/A'}
                                                    </span>
                                                    {college.hostels?.length > 0 && (
                                                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                                                            <Building2 size={10} /> Hostel Available (₹{college.hostels[0].fee})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-8 text-right">
                                            <div className="flex flex-col gap-2 ml-auto w-fit">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setApplyModal({ isOpen: true, college })
                                                    }}
                                                    className="bg-primary text-white hover:bg-primary/90 px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                                                >
                                                    <Zap size={14} className="fill-white" /> Easy Apply
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/colleges/${college.slug}`)
                                                    }}
                                                    className="bg-slate-100 text-secondary hover:bg-slate-200 px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                                                >
                                                    View Details <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredColleges.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Search size={48} className="text-slate-200" />
                                                <p className="text-slate-400 font-bold italic text-xl">No institutions matching "{search}" found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
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

            <ApplyModal 
                isOpen={applyModal.isOpen} 
                onClose={() => setApplyModal({ ...applyModal, isOpen: false })}
                collegeId={applyModal.college?.id}
                collegeName={applyModal.college?.name}
            />
        </section>
    )
}
