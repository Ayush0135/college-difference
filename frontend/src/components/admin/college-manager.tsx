import { API_URL } from '@/lib/api'
'use client'

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { GraduationCap, Search, MapPin, ExternalLink, Trash2, Edit3, Loader2, Filter } from "lucide-react"

export default function CollegeManager({ onEdit }: { onEdit: (college: any) => void }) {
    const { token } = useAuth()
    const [colleges, setColleges] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editSyncLoading, setEditSyncLoading] = useState<string | null>(null)

    const handleEdit = async (slug: string) => {
        setEditSyncLoading(slug)
        try {
            const res = await fetch(`${API_URL}/colleges/${slug}`)
            const data = await res.json()
            onEdit(data)
        } catch (err) {
            console.error("Failed to fetch full college intelligence:", err)
        } finally {
            setEditSyncLoading(null)
        }
    }

    const handleDelete = async (slug: string) => {
        if (!confirm('Are you sure you want to permanently delete this institution from the registry?')) return;
        setEditSyncLoading(slug)
        try {
            const res = await fetch(`${API_URL}/admin/colleges/${slug}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) fetchColleges()
            else alert('Failed to successfully delete institution from database.')
        } catch (err) {
            console.error("Deletion exception:", err)
            alert('Failed to connect to active registry server to process deletion.')
        } finally {
            setEditSyncLoading(null)
        }
    }

    const fetchColleges = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/colleges`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            setColleges(data)
        } catch (err) {
            console.error("Failed to fetch colleges:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) fetchColleges()
    }, [token])

    const filtered = colleges.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.location.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-secondary font-black italic">Synchronizing institutional directory...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Real-time Counter Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-secondary tracking-tighter italic flex items-center gap-3">
                        <GraduationCap className="text-primary" /> Institutional Registry
                    </h2>
                    <p className="text-slate-400 text-sm font-medium">Currently monitoring <span className="text-secondary font-black">{colleges.length}</span> verified institutions.</p>
                </div>
                
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search registry by name or city..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 font-bold text-secondary text-sm transition-all"
                    />
                </div>
            </div>

            {/* Registry Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Institution Name</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Location</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Accreditation</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rank</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((college) => (
                                <tr key={college.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-secondary/10">
                                                {college.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-secondary text-base group-hover:text-primary transition-colors cursor-pointer">{college.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{college.stream || 'University'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                            <MapPin size={14} className="text-primary" />
                                            {college.location}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border border-emerald-100">
                                            {college.accreditation || 'Verified'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-secondary font-black italic">#{college.rank || 'N/A'}</div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(college.slug)}
                                                disabled={editSyncLoading === college.slug}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                                            >
                                                {editSyncLoading === college.slug ? <Loader2 size={18} className="animate-spin" /> : <Edit3 size={18} />}
                                            </button>
                                            <a href={`/colleges/${college.slug}`} target="_blank" className="p-2 text-slate-400 hover:text-secondary hover:bg-slate-100 rounded-lg transition-all"><ExternalLink size={18} /></a>
                                            <button 
                                                onClick={() => handleDelete(college.slug)} 
                                                disabled={editSyncLoading === college.slug}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="opacity-20 mb-4 flex justify-center"><Filter size={64} /></div>
                        <p className="text-slate-400 font-bold italic">No institutions found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
