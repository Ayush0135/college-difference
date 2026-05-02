'use client'

import { useState } from 'react'
import { MapPin, ShieldCheck, Trophy, Star, CheckCircle2, Zap, ArrowLeft, BookOpen, Home, Users, Clock, IndianRupee, GraduationCap, TrendingUp, Phone, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import ApplyModal from '@/components/college/ApplyModal'

export default function CollegeDetailView({ college }: { college: any }) {
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'courses', label: `Courses & Fees${college.courses?.length ? ` (${college.courses.length})` : ''}` },
        { id: 'hostel', label: 'Hostel' },
        { id: 'placement', label: 'Placement' },
        { id: 'reviews', label: `Reviews${college.reviews?.length ? ` (${college.reviews.length})` : ''}` },
    ]

    return (
        <main className="min-h-screen bg-slate-50 pb-24 mt-16">
            {/* Hero Banner */}
            <div className="relative h-[220px] w-full bg-gradient-to-r from-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000')] bg-cover bg-center opacity-20" />
                <div className="container mx-auto px-4 h-full flex items-end pb-6 relative z-10">
                    <Link href="/" className="absolute top-4 left-4 flex items-center gap-1 text-white/70 hover:text-white text-sm font-medium transition-colors">
                        <ArrowLeft size={16} /> Back
                    </Link>
                </div>
            </div>

            {/* College Identity Bar */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        {/* Logo */}
                        <div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center text-3xl font-black text-slate-600 shadow-sm shrink-0 -mt-10 bg-white relative z-10">
                            {college.logo_url ? (
                                <img src={college.logo_url} alt={college.name} className="w-full h-full object-contain rounded-xl" />
                            ) : (
                                college.logo || college.name?.charAt(0)
                            )}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{college.name}</h1>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-600">
                                {college.location && <span className="flex items-center gap-1"><MapPin size={13} className="text-primary" />{college.location}</span>}
                                {college.agency && <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-500" />{college.agency} Approved</span>}
                                {college.rank && <span className="flex items-center gap-1"><Trophy size={13} className="text-amber-500" />NIRF Rank #{college.rank}</span>}
                                {college.stream && <span className="flex items-center gap-1"><BookOpen size={13} className="text-blue-500" />{college.stream}</span>}
                                {college.accreditation && <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold text-xs">{college.accreditation}</span>}
                            </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => setIsApplyModalOpen(true)} className="bg-primary text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                                <Zap size={15} className="fill-white" /> Apply Now
                            </button>
                            {college.brochure_url && (
                                <a href={college.brochure_url} target="_blank" rel="noreferrer" className="border border-primary text-primary font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-primary/5 transition-colors">
                                    Brochure
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
                        <div className="text-center">
                            <div className="text-lg font-black text-primary">{college.fees ? `₹${college.fees}` : 'N/A'}</div>
                            <div className="text-xs text-slate-500 font-medium">Total Fees</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-black text-emerald-600">{college.avg_package ? `₹${college.avg_package}L` : 'N/A'}</div>
                            <div className="text-xs text-slate-500 font-medium">Avg Package</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-black text-amber-600">{college.highest_package ? `₹${college.highest_package}L` : 'N/A'}</div>
                            <div className="text-xs text-slate-500 font-medium">Highest Package</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-black text-slate-800">{college.cutoff ? `${college.cutoff}%` : 'N/A'}</div>
                            <div className="text-xs text-slate-500 font-medium">Cutoff</div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="container mx-auto px-4">
                    <div className="flex overflow-x-auto no-scrollbar gap-0 -mb-px">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors",
                                    activeTab === tab.id
                                        ? "border-primary text-primary"
                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <>
                                {/* About */}
                                {college.description && (
                                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                                        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                            <BookOpen size={18} className="text-primary" /> About {college.name}
                                        </h2>
                                        <p className="text-slate-600 leading-relaxed">{college.description}</p>
                                    </div>
                                )}

                                {/* Key Info Grid */}
                                <div className="bg-white rounded-xl border border-slate-200 p-6">
                                    <h2 className="text-lg font-bold text-slate-800 mb-4">College Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Location', value: college.location, icon: MapPin },
                                            { label: 'Stream', value: college.stream, icon: GraduationCap },
                                            { label: 'Accreditation', value: college.accreditation, icon: ShieldCheck },
                                            { label: 'Approved By', value: college.agency, icon: CheckCircle2 },
                                            { label: 'NIRF Rank', value: college.rank ? `#${college.rank}` : null, icon: Trophy },
                                            { label: 'Application Deadline', value: college.deadline, icon: Clock },
                                            { label: 'Cutoff', value: college.cutoff ? `${college.cutoff}%` : null, icon: TrendingUp },
                                            { label: 'Total Fees', value: college.fees ? `₹${college.fees}` : null, icon: IndianRupee },
                                        ].filter(i => i.value).map(item => (
                                            <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                                <item.icon size={16} className="text-primary shrink-0" />
                                                <div>
                                                    <div className="text-xs text-slate-500 font-medium">{item.label}</div>
                                                    <div className="text-sm font-semibold text-slate-800">{item.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Placement Highlights */}
                                {college.placement_highlights?.length > 0 && (
                                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                                        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <TrendingUp size={18} className="text-primary" /> Placement Highlights
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {college.placement_highlights.map((h: string, i: number) => (
                                                <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1">
                                                    <CheckCircle2 size={13} /> {h}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Courses Preview */}
                                {college.courses?.length > 0 && (
                                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <BookOpen size={18} className="text-primary" /> Top Courses
                                            </h2>
                                            <button onClick={() => setActiveTab('courses')} className="text-primary text-sm font-semibold hover:underline">
                                                View All →
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {college.courses.slice(0, 4).map((c: any) => (
                                                <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                    <div>
                                                        <div className="font-semibold text-slate-800 text-sm">{c.name}</div>
                                                        <div className="text-xs text-slate-500">{c.duration}</div>
                                                    </div>
                                                    <div className="text-sm font-bold text-primary">{c.fees ? `₹${c.fees}` : 'N/A'}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* COURSES TAB */}
                        {activeTab === 'courses' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">All Courses & Fees</h2>
                                {college.courses?.length > 0 ? (
                                    <div className="space-y-3">
                                        {college.courses.map((c: any) => (
                                            <div key={c.id} className="border border-slate-200 rounded-xl overflow-hidden">
                                                <button
                                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                                                    onClick={() => setExpandedCourse(expandedCourse === c.id ? null : c.id)}
                                                >
                                                    <div>
                                                        <div className="font-bold text-slate-800">{c.name}</div>
                                                        <div className="text-sm text-slate-500 flex gap-3 mt-1">
                                                            {c.duration && <span className="flex items-center gap-1"><Clock size={12} />{c.duration}</span>}
                                                            {c.seats && <span className="flex items-center gap-1"><Users size={12} />{c.seats} seats</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-right">
                                                            <div className="font-bold text-primary">{c.fees ? `₹${c.fees}` : 'N/A'}</div>
                                                            <div className="text-xs text-slate-500">Total Fees</div>
                                                        </div>
                                                        {expandedCourse === c.id ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                                                    </div>
                                                </button>
                                                {expandedCourse === c.id && (
                                                    <div className="px-4 pb-4 pt-0 bg-slate-50 border-t border-slate-200">
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                                                            {c.eligibility && <div><div className="text-xs text-slate-500">Eligibility</div><div className="text-sm font-semibold text-slate-800">{c.eligibility}</div></div>}
                                                            {c.duration && <div><div className="text-xs text-slate-500">Duration</div><div className="text-sm font-semibold text-slate-800">{c.duration}</div></div>}
                                                            {c.seats && <div><div className="text-xs text-slate-500">Total Seats</div><div className="text-sm font-semibold text-slate-800">{c.seats}</div></div>}
                                                            {c.total_year_1 && <div><div className="text-xs text-slate-500">1st Year Fee</div><div className="text-sm font-semibold text-slate-800">₹{c.total_year_1}</div></div>}
                                                        </div>
                                                        <button onClick={() => setIsApplyModalOpen(true)} className="mt-4 bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                                            Apply for this Course
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-400">
                                        <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
                                        <p className="font-medium">No courses listed yet</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* HOSTEL TAB */}
                        {activeTab === 'hostel' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Home size={18} className="text-primary" /> Hostel & Accommodation
                                </h2>
                                {college.hostels?.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {college.hostels.map((h: any, i: number) => (
                                            <div key={i} className="border border-slate-200 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="font-bold text-slate-800">{h.room_type}</div>
                                                    <span className={cn("text-xs font-bold px-2 py-1 rounded-full", h.is_ac ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600")}>
                                                        {h.is_ac ? '❄️ AC' : 'Non-AC'}
                                                    </span>
                                                </div>
                                                {h.fee && <div className="text-primary font-bold text-lg">₹{h.fee}<span className="text-xs text-slate-500 font-normal">/year</span></div>}
                                                {h.description && <p className="text-sm text-slate-500 mt-2">{h.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-400">
                                        <Home size={40} className="mx-auto mb-3 opacity-50" />
                                        <p className="font-medium">No hostel information available</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PLACEMENT TAB */}
                        {activeTab === 'placement' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Average Package', value: college.avg_package ? `₹${college.avg_package} LPA` : null, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                        { label: 'Highest Package', value: college.highest_package ? `₹${college.highest_package} LPA` : null, color: 'text-blue-600', bg: 'bg-blue-50' },
                                        { label: 'Median Package', value: college.median_package ? `₹${college.median_package} LPA` : null, color: 'text-purple-600', bg: 'bg-purple-50' },
                                    ].map(stat => (
                                        <div key={stat.label} className={cn("rounded-xl p-5 text-center", stat.bg)}>
                                            <div className={cn("text-2xl font-black", stat.color)}>{stat.value || 'N/A'}</div>
                                            <div className="text-xs text-slate-600 font-medium mt-1">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                                {college.placement_highlights?.length > 0 && (
                                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                                        <h2 className="text-lg font-bold text-slate-800 mb-4">Placement Highlights</h2>
                                        <div className="space-y-2">
                                            {college.placement_highlights.map((h: string, i: number) => (
                                                <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                                    <span className="text-sm font-medium text-slate-700">{h}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {!college.avg_package && !college.highest_package && !college.placement_highlights?.length && (
                                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
                                        <TrendingUp size={40} className="mx-auto mb-3 opacity-50" />
                                        <p className="font-medium">No placement data available yet</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* REVIEWS TAB */}
                        {activeTab === 'reviews' && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <Star size={18} className="text-primary" /> Student Reviews
                                </h2>
                                {college.reviews?.length > 0 ? (
                                    <div className="space-y-4">
                                        {college.reviews.map((r: any, i: number) => (
                                            <div key={i} className="border border-slate-200 rounded-xl p-5">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                                                        {r.reviewer_name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-sm">{r.reviewer_name || 'Student'}</div>
                                                        <div className="flex">
                                                            {Array.from({ length: 5 }).map((_, s) => (
                                                                <Star key={s} size={12} className={s < r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                {r.comment && <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>}
                                                {(r.pros || r.cons) && (
                                                    <div className="grid grid-cols-2 gap-3 mt-3">
                                                        {r.pros && <div className="bg-emerald-50 rounded-lg p-3"><div className="text-xs font-bold text-emerald-700 mb-1">✓ Pros</div><p className="text-xs text-slate-600">{Array.isArray(r.pros) ? r.pros.join(', ') : r.pros}</p></div>}
                                                        {r.cons && <div className="bg-red-50 rounded-lg p-3"><div className="text-xs font-bold text-red-700 mb-1">✗ Cons</div><p className="text-xs text-slate-600">{Array.isArray(r.cons) ? r.cons.join(', ') : r.cons}</p></div>}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-400">
                                        <Star size={40} className="mx-auto mb-3 opacity-50" />
                                        <p className="font-medium">No reviews yet</p>
                                        <p className="text-sm mt-1">Be the first to review this college</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Apply CTA */}
                        <div className="bg-primary rounded-xl p-5 text-white">
                            <h3 className="font-bold text-lg mb-1">Ready to Apply?</h3>
                            <p className="text-white/80 text-sm mb-4">Get expert guidance for your admission process</p>
                            <button onClick={() => setIsApplyModalOpen(true)} className="w-full bg-white text-primary font-bold py-3 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                                <Zap size={16} className="fill-primary" /> Apply Now — Free
                            </button>
                            <div className="mt-3 flex items-center justify-center gap-1.5 text-white/70 text-xs">
                                <Phone size={12} /> Expert counsellors available 24/7
                            </div>
                        </div>

                        {/* Key Details */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="font-bold text-slate-800 mb-4">Quick Details</h3>
                            <div className="space-y-3">
                                {college.deadline && (
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-xs text-slate-500">Application Deadline</span>
                                        <span className="text-xs font-bold text-red-600">{college.deadline}</span>
                                    </div>
                                )}
                                {college.cutoff && (
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-xs text-slate-500">Cutoff</span>
                                        <span className="text-xs font-bold text-slate-800">{college.cutoff}%</span>
                                    </div>
                                )}
                                {college.fees && (
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-xs text-slate-500">Total Fees</span>
                                        <span className="text-xs font-bold text-primary">₹{college.fees}</span>
                                    </div>
                                )}
                                {college.courses?.length > 0 && (
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span className="text-xs text-slate-500">Total Courses</span>
                                        <span className="text-xs font-bold text-slate-800">{college.courses.length}</span>
                                    </div>
                                )}
                                {college.accreditation && (
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-xs text-slate-500">Accreditation</span>
                                        <span className="text-xs font-bold text-emerald-600">{college.accreditation}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Brochure */}
                        {college.brochure_url && (
                            <a href={college.brochure_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full border-2 border-primary text-primary font-bold py-3 rounded-xl hover:bg-primary/5 transition-colors text-sm">
                                📄 Download Brochure
                            </a>
                        )}
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
