'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { Users, Mail, Phone, Calendar, CheckCircle2, XCircle, Clock, Loader2, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LeadTracker() {
    const { token } = useAuth()
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLeads = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/leads`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setLeads(data)
        } catch (err) {
            console.error("Failed to fetch leads:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchLeads()
    }, [token])

    const updateStatus = async (leadId: string, newStatus: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/leads/${leadId}?status=${newStatus}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) fetchLeads()
        } catch (err) {
            console.error("Failed to update lead status:", err)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-secondary font-black italic">Extracting applicant intelligence...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-black text-secondary tracking-tight">Active Applications</h2>
                    <p className="text-slate-500 text-sm font-medium">Capture and track student interest across departments.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase text-slate-400">Total Leads</span>
                        <span className="text-xl font-black text-secondary">{leads.length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Info</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Institution</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date Applied</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {leads.map((lead) => (
                                <motion.tr 
                                    layout 
                                    key={lead.id}
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-black text-secondary text-base">{lead.name}</span>
                                            <div className="flex flex-col gap-0.5 mt-1">
                                                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                                    <Mail size={12} className="text-primary" /> {lead.email}
                                                </span>
                                                <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                                                    <Phone size={12} className="text-primary" /> +91 {lead.phone}
                                                </span>
                                                {lead.course_name && (
                                                    <span className="text-[10px] mt-1 bg-primary/10 text-primary w-fit px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                                                        {lead.course_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-black text-white shrink-0">
                                                {(lead.colleges?.name || "General Counseling").charAt(0)}
                                            </div>
                                            <span className="font-bold text-secondary text-sm group-hover:text-primary transition-colors cursor-pointer flex items-center gap-1">
                                                {lead.colleges?.name || "General Counseling"} <ArrowUpRight size={12} />
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                            <Calendar size={14} className="text-slate-300" />
                                            {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                            lead.status === 'new' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                            lead.status === 'processed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            "bg-red-50 text-red-600 border-red-100"
                                        )}>
                                            {lead.status === 'new' ? <Clock size={12} /> : 
                                             lead.status === 'processed' ? <CheckCircle2 size={12} /> : 
                                             <XCircle size={12} />}
                                            {lead.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {lead.status === 'new' && (
                                                <button 
                                                    onClick={() => updateStatus(lead.id, 'processed')}
                                                    className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white p-2 rounded-lg transition-all"
                                                    title="Mark as Processed"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => updateStatus(lead.id, 'closed')}
                                                className="bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 p-2 rounded-lg transition-all"
                                                title="Close Applicant"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {leads.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <Users size={64} />
                                            <p className="text-xl font-black italic">The applicant pool is currently empty.</p>
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
