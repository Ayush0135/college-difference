'use client'

import { useState } from 'react'
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
    ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import ApplyModal from '@/components/college/ApplyModal'

interface CollegeDetailViewProps {
    college: any
}

export default function CollegeDetailView({ college }: CollegeDetailViewProps) {
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

    return (
        <main className="min-h-screen bg-slate-50 pb-24 mt-16">
            {/* Header Section */}
            <div className="relative min-h-[250px] md:h-[250px] w-full bg-secondary overflow-hidden">
                <Image 
                    src={college.bg_image || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000"} 
                    alt={college.name}
                    fill
                    className="object-cover opacity-30"
                />
                
                <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-8 pt-12 md:pt-0">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded flex items-center justify-center text-3xl font-bold text-secondary border border-slate-200 shadow-sm relative overflow-hidden shrink-0">
                            {college.logo || college.name.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-2 pb-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                {college.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm">
                                <span className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {college.location}</span>
                                {college.agency && <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-400" /> {college.agency} Approved</span>}
                                {college.rank && <span className="flex items-center gap-1"><Trophy size={14} className="text-amber-400" /> NIRF #{college.rank}</span>}
                            </div>
                        </div>
                        <div className="hidden lg:flex gap-3 pb-2">
                            <button 
                                className="bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2.5 rounded shadow-sm transition-colors flex items-center gap-2 text-sm"
                                onClick={() => setIsApplyModalOpen(true)}
                            >
                                Apply Now
                            </button>
                            <button className="bg-white hover:bg-slate-50 text-secondary font-bold px-6 py-2.5 rounded shadow-sm transition-colors flex items-center justify-center gap-2 text-sm">
                                Download Brochure
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex gap-1 overflow-x-auto no-scrollbar">
                        {['Info', 'Courses & Fees', 'Reviews', 'Placements', 'Gallery'].map((tab, i) => (
                            <button key={tab} className={cn(
                                "px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap border-b-2",
                                i === 0 ? "border-primary text-primary" : "border-transparent text-slate-600 hover:text-primary"
                            )}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 mt-6 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Areas */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Quick Stats Grid */}
                        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6 flex gap-6 overflow-x-auto no-scrollbar">
                            <div className="flex flex-col gap-1 pr-6 border-r border-slate-100 min-w-max">
                                <div className="text-xs text-slate-500 font-semibold">Average Fee</div>
                                <div className="text-lg font-bold text-secondary">₹{college.fees || 'Varies'}</div>
                            </div>
                            <div className="flex flex-col gap-1 pr-6 border-r border-slate-100 min-w-max">
                                <div className="text-xs text-slate-500 font-semibold">Student Rating</div>
                                <div className="text-lg font-bold text-amber-500">{(college.reviews?.length > 0 ? (college.reviews.reduce((acc: any, r: any) => acc + r.rating, 0) / college.reviews.length).toFixed(1) : '4.8')}/5</div>
                            </div>
                            <div className="flex flex-col gap-1 pr-6 border-r border-slate-100 min-w-max">
                                <div className="text-xs text-slate-500 font-semibold">Average Package</div>
                                <div className="text-lg font-bold text-emerald-600">{college.avg_package ? `₹${college.avg_package}L` : 'N/A'}</div>
                            </div>
                        </div>

                        {/* Overview Card */}
                        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6 space-y-4">
                            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">About {college.name}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {college.description || "Information about this prestigious institution is currently being updated. It remains one of the top choices for ambitious students across India."}
                            </p>
                        </div>

                        {/* Top Courses Section */}
                        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6 space-y-4">
                           <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Courses & Fees</h3>
                           <div className="grid grid-cols-1 gap-3">
                                {college.courses?.length > 0 ? college.courses.map((course: any) => (
                                    <div key={course.name} className="p-4 bg-white border border-slate-200 rounded-md hover:shadow-md transition-shadow flex justify-between items-center">
                                        <div>
                                            <h4 className="text-base font-bold text-secondary hover:text-primary cursor-pointer transition-colors">{course.name}</h4>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                                                <span>{course.duration || '4 Years'}</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span>{course.seats || '60'} Seats</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-primary font-bold">Apply Now</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-8 text-center text-slate-500 text-sm">Course list is currently being updated.</div>
                                )}
                           </div>
                        </div>

                        {/* Hostel Infrastructure */}
                        {college.hostels?.length > 0 && (
                            <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6 space-y-4">
                                <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Hostel & Accommodation</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {college.hostels.map((hostel: any, i: number) => (
                                        <div key={i} className="p-4 bg-white border border-slate-200 rounded-md">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-base font-bold text-slate-800">{hostel.room_type}</h4>
                                                <div className={cn("px-2 py-0.5 rounded text-[10px] font-bold", hostel.is_ac ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-600")}>
                                                    {hostel.is_ac ? 'AC' : 'Non-AC'}
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-secondary mb-2">₹{hostel.fee}<span className="text-xs text-slate-500 font-normal"> / year</span></div>
                                            <p className="text-xs text-slate-600 leading-relaxed">{hostel.description || 'Modern amenities with high-speed internet.'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Action Card */}
                        <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm space-y-4">
                            <h4 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Interested in this College?</h4>
                            <div className="text-sm text-slate-600 mb-4">Get complete details about admission, fees, and placements.</div>
                            <button 
                                onClick={() => setIsApplyModalOpen(true)}
                                className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-primary/90 transition-colors"
                            >
                                Apply Now
                            </button>
                            <button 
                                onClick={() => {
                                    if (college.brochure_url) {
                                        window.open(college.brochure_url, '_blank')
                                    } else {
                                        alert('Brochure is currently being updated for the 2024 academic session.')
                                    }
                                }}
                                className="w-full border border-primary text-primary font-bold py-3 rounded hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                            >
                                Download Brochure
                            </button>
                        </div>

                        {/* Quick Facts Card */}
                        <div className="bg-white rounded-md shadow-sm border border-slate-200 p-6 space-y-4">
                            <h4 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Key Highlights</h4>
                            <div className="space-y-4">
                                {[
                                    { label: 'Avg Placement', val: college.avg_package ? `₹${college.avg_package} LPA` : 'N/A' },
                                    { label: 'Highest Package', val: college.highest_package ? `₹${college.highest_package} LPA` : '₹48 LPA' },
                                    { label: 'Median Package', val: college.median_package ? `₹${college.median_package} LPA` : 'N/A' },
                                    { label: 'NIRF Ranking', val: college.rank ? `#${college.rank}` : 'Unranked' },
                                    { label: 'Institution Type', val: college.stream || 'Technical' },
                                ].map(fact => (
                                    <div key={fact.label} className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">{fact.label}</span>
                                        <span className="text-sm font-bold text-slate-800">{fact.val}</span>
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
