import { API_URL } from '@/lib/api'
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Calendar, CheckCircle2, Loader2, GraduationCap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

export default function StudyAppTracker() {
    const { token } = useAuth()
    const [apps, setApps] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchApps = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/admin/study-applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setApps(data)
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchApps()
    }, [token])

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-secondary font-black italic">Cataloging applicant choices...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black text-secondary tracking-tighter italic">Application <span className="text-primary">Pipeline</span></h3>
                    <p className="text-slate-400 text-sm font-medium">Tracking multi-college submissions and dream preferences.</p>
                </div>
                <button 
                    onClick={fetchApps}
                    className="px-4 py-2 bg-slate-100 text-secondary text-xs font-black rounded-lg hover:bg-slate-200 transition-all uppercase tracking-widest"
                >
                    Refresh List
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {apps.map((app) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={app.id} 
                        className="bg-white border-2 border-slate-50 rounded-3xl p-8 hover:border-primary/20 transition-all group"
                    >
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-xl shadow-secondary/10 uppercase">
                                        {app.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-secondary leading-none mb-1">{app.name}</h4>
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                            <Calendar size={12} /> Applied {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-4">
                                    <a href={`mailto:${app.email}`} className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-primary hover:text-white transition-all">
                                        <Mail size={14} /> {app.email}
                                    </a>
                                    <a href={`tel:${app.phone}`} className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-emerald-500 hover:text-white transition-all">
                                        <Phone size={14} /> {app.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="lg:w-96 space-y-3">
                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center gap-2">
                                    <GraduationCap size={14} /> Ranked Preferences
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {app.college_choices.map((choice: string, i: number) => (
                                        <div key={i} className={cn(
                                            "px-4 py-2 rounded-xl text-xs font-black border-2 transition-all",
                                            i === 0 ? "bg-primary/5 border-primary text-primary" : "bg-slate-50 border-slate-100 text-secondary"
                                        )}>
                                            <span className="opacity-40 mr-2 italic">#{i+1}</span>
                                            {choice}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-end gap-2">
                                <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                    <CheckCircle2 size={12} /> {app.status}
                                </div>
                                <button className="text-[10px] font-black text-slate-300 hover:text-primary transition-colors underline uppercase tracking-tighter">Mark Processed</button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                
                {apps.length === 0 && (
                    <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                        <p className="text-slate-300 font-bold italic text-xl">No multi-college applications in pipeline.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
