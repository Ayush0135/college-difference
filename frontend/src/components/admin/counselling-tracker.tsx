'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { User, Mail, Phone, Calendar, CheckCircle2, Clock, Loader2, GraduationCap } from "lucide-react"

export default function CounsellingTracker() {
    const { token } = useAuth()
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchRequests = async () => {
        setLoading(true)
        try {
            const res = await fetch('http://localhost:8000/admin/counselling', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setRequests(data)
        } catch (err) {
            console.error("Failed to fetch counselling requests:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchRequests()
    }, [token])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-secondary font-black italic">Synchronizing expert guidance data...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-black text-secondary tracking-tight">Expert Counselling Requests</h2>
                    <p className="text-slate-500 text-sm font-medium">Resolution queue for students seeking personalized academic guidance.</p>
                </div>
                <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400">Resolution Needed</span>
                    <span className="text-xl font-black text-secondary">{requests.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Intelligence</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intended Stream</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Request Date</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {requests.map((req) => (
                                <motion.tr 
                                    layout 
                                    key={req.id}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-black text-secondary text-base">{req.name}</span>
                                            <div className="flex flex-col gap-0.5 mt-1">
                                                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                                    <Mail size={12} className="text-primary" /> {req.email}
                                                </span>
                                                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                                    <Phone size={12} className="text-primary" /> +91 {req.phone}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary w-fit rounded-lg">
                                            <GraduationCap size={14} className="fill-primary" />
                                            <span className="text-xs font-black uppercase tracking-tighter">{req.stream}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 underline decoration-slate-200 underline-offset-4 decoration-2">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                            <Calendar size={14} className="text-slate-300" />
                                            {new Date(req.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                            <CheckCircle2 size={12} /> Active Inquiry
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <User size={64} />
                                            <p className="text-xl font-black italic">No guidance requests currently in the queue.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
