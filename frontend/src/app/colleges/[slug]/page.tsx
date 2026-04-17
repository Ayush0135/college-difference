'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
    MapPin, 
    ShieldCheck, 
    Calendar, 
    IndianRupee, 
    Trophy, 
    Users, 
    Star, 
    CheckCircle2, 
    Zap, 
    ExternalLink, 
    ArrowLeft,
    Loader2
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import ApplyModal from '@/components/college/ApplyModal'

export default function CollegeDetailPage() {
    const { slug } = useParams()
    const [college, setCollege] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

    useEffect(() => {
        if (slug) {
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/colleges/${slug}`)
                .then(res => res.json())
                .then(data => {
                    setCollege(data)
                    setLoading(false)
                })
                .catch(err => {
                    console.error('Fetch error:', err)
                    setLoading(false)
                })
        }
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-secondary font-black italic text-xl tracking-tighter">fetching institute intelligence...</p>
            </div>
        )
    }

    if (!college) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
                <h2 className="text-4xl font-black text-secondary uppercase tracking-tighter italic">404 - College Not Found</h2>
                <Link href="/" className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Back to Discovery
                </Link>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-50 pb-24">
            {/* Massive Hero Section */}
            <div className="relative h-[45vh] min-h-[400px] w-full bg-slate-900 overflow-hidden">
                <Image 
                    src={college.bg_image || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000"} 
                    alt={college.name}
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-12">
                    <Link href="/" className="absolute top-8 left-4 flex items-center gap-2 text-white/70 hover:text-white font-bold transition-all bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
                    </Link>

                    <div className="flex flex-col md:flex-row items-end gap-8">
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-4xl md:text-6xl font-black text-secondary border-8 border-white/10 relative overflow-hidden shrink-0">
                            {college.logo || college.name.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-primary/20">
                                    <Trophy size={10} /> NIRF #{college.rank || 'N/A'}
                                </span>
                                <span className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                    <ShieldCheck size={10} /> {college.agency || 'NAAC'} Accredited
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none italic">
                                {college.name}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-white/70 font-bold text-lg">
                                <MapPin size={20} className="text-primary" /> {college.location}
                            </div>
                        </div>
                        <div className="hidden lg:flex flex-col gap-3 shrink-0">
                            <button 
                                className="bg-primary hover:bg-primary/90 text-white font-black px-12 py-5 rounded-2xl text-xl shadow-2xl shadow-primary/40 active:scale-95 transition-all flex items-center gap-3"
                                onClick={() => setIsApplyModalOpen(true)}
                            >
                                <Zap size={24} className="fill-white" /> Easy Apply Now
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-black px-8 py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-tighter">
                                <Calendar size={16} /> Admission Open 2024
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Areas */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Navigation Tabs (Style only for now) */}
                        <div className="bg-white p-2 rounded-2xl shadow-xl flex gap-2 overflow-x-auto border border-slate-100 no-scrollbar">
                            {['Overview', 'Courses & Fees', 'Placements', 'Reviews', 'Gallery'].map((tab, i) => (
                                <button key={tab} className={cn(
                                    "px-8 py-3 rounded-xl font-black text-sm transition-all whitespace-nowrap",
                                    i === 0 ? "bg-secondary text-white" : "text-slate-400 hover:bg-slate-50"
                                )}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Overview Card */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-secondary tracking-tighter italic">About the <span className="text-primary">Institute</span></h3>
                                <p className="text-slate-600 leading-relaxed font-medium text-lg">
                                    {college.description || "Information about this prestigious institution is currently being updated. It remains one of the top choices for ambitious students across India."}
                                </p>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {[
                                    { icon: IndianRupee, label: 'Average Fee', val: college.fees || 'Varies' },
                                    { icon: Star, label: 'Student Rating', val: (college.reviews?.length > 0 ? (college.reviews.reduce((acc: any, r: any) => acc + r.rating, 0) / college.reviews.length).toFixed(1) : '4.8') + '/5' },
                                    { icon: Trophy, label: 'NIRF Rank', val: `#${college.rank || 'N/A'}` },
                                    { icon: CheckCircle2, label: 'Avg Placement', val: college.avg_package ? `₹${college.avg_package}L` : 'N/A' },
                                ].map(stat => (
                                    <div key={stat.label} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-1 group hover:border-primary/30 transition-all">
                                        <stat.icon className="text-primary mb-2 group-hover:scale-110 transition-transform" size={24} />
                                        <div className="text-2xl font-black text-secondary leading-none">{stat.val}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Courses Section */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 space-y-8">
                           <h3 className="text-3xl font-black text-secondary tracking-tighter italic">Top <span className="text-primary">Programs</span></h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {college.courses?.length > 0 ? college.courses.map((course: any) => (
                                    <div key={course.name} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 hover:border-primary/40 transition-all hover:bg-white group cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-xl font-black text-secondary leading-tight group-hover:text-primary transition-colors">{course.name}</h4>
                                            <ArrowLeft size={20} className="rotate-180 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {course.duration || '4 Years'}</span>
                                            <span className="flex items-center gap-1"><Users size={14} /> {course.seats || '60'} Seats</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 py-12 text-center text-slate-400 font-medium italic">Course list is currently under review.</div>
                                )}
                           </div>
                        </div>

                        {/* Hostel Infrastructure */}
                        {college.hostels?.length > 0 && (
                            <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 space-y-8">
                                <h3 className="text-3xl font-black text-secondary tracking-tighter italic">Residential <span className="text-primary">Intelligence</span></h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {college.hostels.map((hostel: any, i: number) => (
                                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 hover:border-primary/40 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-xl font-black text-secondary leading-tight">{hostel.room_type}</h4>
                                                <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", hostel.is_ac ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500")}>
                                                    {hostel.is_ac ? 'AC Room' : 'Non-AC'}
                                                </div>
                                            </div>
                                            <div className="text-lg font-black text-primary mb-3">₹{hostel.fee}<span className="text-xs text-slate-400 ml-1 font-bold">/ Annum</span></div>
                                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{hostel.description || 'Modern amenities with high-speed internet and security.'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Fee Structure Card */}
                        <div className="bg-secondary rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:bg-primary/40 transition-all" />
                            <div className="relative z-10 space-y-6">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">Total Package (EST)</h4>
                                    <div className="text-5xl font-black tracking-tighter flex items-center">
                                        <IndianRupee size={32} className="text-primary mt-1" strokeWidth={3} />
                                        {college.fees || '8.5L'}<span className="text-sm text-white/50 ml-2">*Approx</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-white/60">Tution Fees</span>
                                        <span>₹5.4L</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-white/60">Admission</span>
                                        <span>₹1.2L</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-3 flex justify-between font-black text-primary">
                                        <span>Apply Now For</span>
                                        <span>Discount</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {
                                        if (college.brochure_url) {
                                            window.open(college.brochure_url, '_blank')
                                        } else {
                                            alert('Brochure is currently being updated for the 2024 academic session.')
                                        }
                                    }}
                                    className="w-full bg-white text-secondary font-black py-4 rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    {college.brochure_url ? 'Download Brochure' : 'Brochure Updating'} <ExternalLink size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Quick Facts Card */}
                        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100">
                            <h4 className="text-xl font-black text-secondary mb-6 border-b border-slate-100 pb-4">Key Performance</h4>
                            <div className="space-y-6">
                                {[
                                    { label: 'Avg Placement', val: college.avg_package ? `₹${college.avg_package} LPA` : 'N/A', color: 'text-emerald-500' },
                                    { label: 'Highest Package', val: college.highest_package ? `₹${college.highest_package} LPA` : '₹48 LPA', color: 'text-primary' },
                                    { label: 'Median Package', val: college.median_package ? `₹${college.median_package} LPA` : 'N/A', color: 'text-blue-500' },
                                    { label: 'NIRF Ranking', val: college.rank ? `#${college.rank}` : 'Unranked', color: 'text-secondary' },
                                    { label: 'Institution Type', val: college.stream || 'Technical', color: 'text-secondary' },
                                ].map(fact => (
                                    <div key={fact.label} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                                        <span className="text-sm font-black text-slate-400 uppercase tracking-tighter">{fact.label}</span>
                                        <span className={cn("text-lg font-black", fact.color)}>{fact.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ApplyModal 
                isOpen={isApplyModalOpen} 
                onClose={() => setIsApplyModalOpen(false)}
                collegeId={college.id}
                collegeName={college.name}
            />
        </main>
    )
}
