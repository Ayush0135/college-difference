'use client'
import { API_URL } from '@/lib/api'

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
        fetch(`${API_URL}/colleges?goal=${activeCategory}&search=${search}${cityParam}`, { cache: 'no-store' })
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
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                            List of Top Colleges In India based on 2024 Ranking
                        </h2>
                        
                        {/* Categories */}
                        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 -mb-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-md text-sm font-semibold transition-all border whitespace-nowrap",
                                        activeCategory === cat 
                                            ? "bg-primary border-primary text-white" 
                                            : "bg-white border-slate-300 text-slate-600 hover:border-primary hover:text-primary"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search in this list..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md py-2 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden relative min-h-[400px]">
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
                                className="p-4 bg-white hover:bg-slate-50 transition-colors"
                                onClick={() => router.push(`/colleges/${college.slug}`)}
                            >
                                <div className="flex gap-3 mb-3">
                                    <div className="w-12 h-12 rounded border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs shrink-0">
                                        {college.logo || college.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-secondary text-sm leading-tight line-clamp-2 hover:text-primary">{college.name}</h3>
                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                                            <MapPin size={12} className="text-primary" /> {college.location}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                        <div className="text-[10px] text-slate-500">Fees</div>
                                        <div className="font-bold text-secondary text-xs">₹{college.fees}</div>
                                    </div>
                                    <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                        <div className="text-[10px] text-slate-500">Placement</div>
                                        <div className="font-bold text-emerald-600 text-xs">{college.avg_package ? `₹${college.avg_package}L` : 'N/A'}</div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setApplyModal({ isOpen: true, college })
                                        }}
                                        className="flex-1 bg-primary text-white py-2 rounded text-xs font-bold hover:bg-primary/90 transition-colors"
                                    >
                                        Apply Now
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/colleges/${college.slug}`)
                                        }}
                                        className="px-4 border border-primary text-primary hover:bg-primary/5 py-2 rounded text-xs font-bold"
                                    >
                                        Course & Fees
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View (Hidden on small screens) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100 border-b border-slate-200 text-slate-600">
                                <tr className="text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4 border-r border-slate-200 text-center w-16">Rank</th>
                                    <th className="px-6 py-4 border-r border-slate-200">College</th>
                                    <th className="px-6 py-4 border-r border-slate-200">Reviews & Rating</th>
                                    <th className="px-6 py-4 border-r border-slate-200">Important Dates</th>
                                    <th className="px-6 py-4 border-r border-slate-200">Fees & Placement</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredColleges.map((college) => (
                                    <motion.tr 
                                        layout
                                        key={college.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-6 border-r border-slate-200 text-center align-top">
                                            <div className="font-bold text-slate-800 text-lg">#{college.rank}</div>
                                            <div className="text-[10px] text-slate-500 mt-1">NIRF</div>
                                        </td>
                                        <td className="px-6 py-6 border-r border-slate-200 align-top">
                                            <div className="flex gap-4">
                                                <div className="w-12 h-12 rounded border border-slate-200 bg-white flex items-center justify-center font-bold text-slate-400 shrink-0">
                                                    {college.logo || college.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div 
                                                        className="font-bold text-secondary text-base hover:text-primary cursor-pointer transition-colors"
                                                        onClick={() => router.push(`/colleges/${college.slug}`)}
                                                    >
                                                        {college.name}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                                                        <MapPin size={12} className="text-primary" />
                                                        {college.location} | {college.agency || 'AICTE'} Approved
                                                    </div>
                                                    <div className="mt-3 flex gap-3 text-xs">
                                                        <span className="text-primary hover:underline cursor-pointer">Admission</span>
                                                        <span className="text-primary hover:underline cursor-pointer">Courses & Fees</span>
                                                        <span className="text-primary hover:underline cursor-pointer">Placement</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 border-r border-slate-200 align-top">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-bold text-amber-500">★ 4.2 / 5</span>
                                                </div>
                                                <span className="text-xs text-slate-500 mt-1">Based on 120 Reviews</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 border-r border-slate-200 align-top">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-800">{college.deadline || 'Closing Soon'}</span>
                                                <span className="text-xs text-slate-500 mt-1">Application Deadline</span>
                                                <span className="text-xs text-emerald-600 font-bold mt-2 hover:underline cursor-pointer">Apply Now &rarr;</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 border-r border-slate-200 align-top">
                                            <div className="flex flex-col gap-3">
                                                <div>
                                                    <div className="text-sm font-bold text-emerald-600">₹{college.fees}</div>
                                                    <div className="text-xs text-slate-500">Total Fees</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">{college.avg_package ? `₹${college.avg_package}L` : 'N/A'}</div>
                                                    <div className="text-xs text-slate-500">Average Placement</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center align-top">
                                            <div className="flex flex-col gap-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setApplyModal({ isOpen: true, college })
                                                    }}
                                                    className="w-full bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded text-xs font-bold transition-colors"
                                                >
                                                    Apply Now
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/colleges/${college.slug}`)
                                                    }}
                                                    className="w-full border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded text-xs font-bold transition-colors"
                                                >
                                                    Download Brochure
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredColleges.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-16 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Search size={40} className="text-slate-300" />
                                                <p className="text-slate-500 font-bold text-lg">No institutions found matching "{search}"</p>
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
