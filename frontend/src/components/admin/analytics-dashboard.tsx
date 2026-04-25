'use client'
import { API_URL } from '@/lib/api'

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, MapPin, Globe, Loader2, ArrowUpRight, GraduationCap } from "lucide-react"

export default function AnalyticsDashboard() {
    const { token } = useAuth()
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>(null)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // In a real app, you'd have a specific analytics endpoint
                // For now, we'll derive some stats from the leads we have
                const res = await fetch(`${API_URL}/admin/leads`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                const leads = await res.json()
                
                // Process leads for simple analytics
                const degreeDistribution = leads.reduce((acc: any, lead: any) => {
                    const degree = lead.course_name || 'General'
                    acc[degree] = (acc[degree] || 0) + 1
                    return acc
                }, {})

                const statusDistribution = leads.reduce((acc: any, lead: any) => {
                    acc[lead.status] = (acc[lead.status] || 0) + 1
                    return acc
                }, {})

                setData({
                    totalLeads: leads.length,
                    degreeDistribution,
                    statusDistribution,
                    recentLeads: leads.slice(0, 5)
                })
            } catch (err) {
                console.error("Failed to fetch analytics:", err)
            } finally {
                setLoading(false)
            }
        }

        if (token) fetchAnalytics()
    }, [token])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-secondary font-black italic">Synthesizing platform intelligence...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* KPI Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-primary bg-primary/5 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Users size={12} /> Audience
                    </div>
                    <div className="text-3xl font-black text-secondary">{data.totalLeads}</div>
                    <div className="text-slate-400 text-xs font-bold mt-1">Lifetime Applications</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-emerald-500 bg-emerald-50 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <TrendingUp size={12} /> Conversion
                    </div>
                    <div className="text-3xl font-black text-secondary">
                        {data.totalLeads > 0 ? Math.round((data.statusDistribution.processed || 0) / data.totalLeads * 100) : 0}%
                    </div>
                    <div className="text-slate-400 text-xs font-bold mt-1">Resolution Rate</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-blue-500 bg-blue-50 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <BarChart3 size={12} /> Velocity
                    </div>
                    <div className="text-3xl font-black text-secondary">+{Math.ceil(data.totalLeads / 7)}</div>
                    <div className="text-slate-400 text-xs font-bold mt-1">Leads per Week</div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm border-l-4 border-l-primary">
                    <div className="flex items-center gap-3 mb-4 text-secondary bg-slate-100 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Globe size={12} /> Reach
                    </div>
                    <div className="text-3xl font-black text-secondary">National</div>
                    <div className="text-slate-400 text-xs font-bold mt-1">Search Footprint</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Degree Popularity */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-secondary mb-8 flex items-center gap-3">
                            <GraduationCap className="text-primary" /> Popular Program Tracks
                        </h3>
                        <div className="space-y-6">
                            {Object.entries(data.degreeDistribution).sort((a: any, b: any) => b[1] - a[1]).map(([degree, count]: [any, any]) => (
                                <div key={degree} className="space-y-2">
                                    <div className="flex justify-between text-sm font-black text-secondary uppercase tracking-tighter">
                                        <span>{degree}</span>
                                        <span>{Math.round(count / data.totalLeads * 100)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / data.totalLeads) * 100}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute right-[-5%] top-[-5%] w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                </div>

                {/* Lead Context / Recent Activity */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl">
                    <h3 className="text-xl font-black text-secondary mb-8 flex items-center gap-3">
                        <MapPin className="text-primary" /> Active Capture stream
                    </h3>
                    <div className="space-y-4">
                        {data.recentLeads.map((lead: any, i: number) => (
                            <div key={i} className="flex items-start justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-all">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-black shrink-0">
                                        {lead.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-secondary group-hover:text-primary transition-colors">{lead.name}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{lead.course_name || 'General Inquiry'}</span>
                                    </div>
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                    {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2">
                        View Complete Audit Log <ArrowUpRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}
