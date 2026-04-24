'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { User, Mail, Phone, Calendar, CheckCircle2, XCircle, Clock, Loader2, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CounsellingTracker() {
    const { token } = useAuth()
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchRequests = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/counselling`, {
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

    const updateStatus = async (requestId: string, newStatus: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admin/counselling/${requestId}?status=${newStatus}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) fetchRequests()
        } catch (err) {
            console.error("Failed to update counselling status:", err)
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
                    <span className="text-xl font-black text-secondary">{requests.filter(r => r.status === 'new').length}</span>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Intelligence</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intended Stream</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">SLA Deadline</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {requests.filter(r => r.status === 'new').map((req) => {
                                const hoursElapsed = (new Date().getTime() - new Date(req.created_at).getTime()) / (1000 * 60 * 60);
                                const isOverdue = hoursElapsed > 48;
                                const hoursLeft = Math.max(0, Math.floor(48 - hoursElapsed));

                                return (
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
                                    <td className="px-6 py-5">
                                        <div className={cn(
                                            "flex items-center gap-2 font-bold text-sm",
                                            isOverdue ? "text-red-500" : "text-amber-500"
                                        )}>
                                            <Clock size={14} className={isOverdue ? "text-red-400" : "text-amber-400"} />
                                            {isOverdue ? "OVERDUE" : `${hoursLeft}h left`}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-1">
                                            {new Date(req.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                                            <Clock size={12} /> Active
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => updateStatus(req.id, 'processed')}
                                                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white p-2 rounded-lg transition-all"
                                                title="Mark as Processed"
                                            >
                                                <CheckCircle2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(req.id, 'closed')}
                                                className="bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 p-2 rounded-lg transition-all"
                                                title="Close Request"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )})}
                            {requests.filter(r => r.status === 'new').length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <CheckCircle2 size={64} className="text-emerald-500" />
                                            <p className="text-xl font-black italic">Hooray! No pending counselling requests.</p>
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
