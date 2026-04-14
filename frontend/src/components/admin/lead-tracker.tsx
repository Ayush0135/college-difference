'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, Download, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function LeadTracker() {
    const { token } = useAuth()
    const [leads, setLeads] = useState<any[]>([])

    useEffect(() => {
        if (!token) return;
        fetch('http://localhost:8000/admin/leads', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(res => res.json())
            .then(data => { if (!data.error && !data.detail) setLeads(data) })
            .catch(console.error)
    }, [token])

    const updateStatus = async (id: string, newStatus: string) => {
        await fetch(`http://localhost:8000/admin/leads/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status: newStatus })
        })
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l))
    }

    const exportCSV = () => {
        const headers = ["Email", "Phone", "College", "Status", "Date"]
        const csvRows = [headers.join(",")]
        leads.forEach(l => {
            const row = [l.email, l.phone, l.colleges?.name || 'N/A', l.status, new Date(l.created_at).toLocaleDateString()]
            csvRows.push(row.map(r => `"${r}"`).join(","))
        })
        const blob = new Blob([csvRows.join("\n")], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'leads_export.csv'
        a.click()
    }

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-secondary">Student Inquiries (Leads)</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage and track student interest</p>
                </div>
                <button onClick={exportCSV} className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-secondary/90 transition-colors">
                    <Download size={16} /> Export to CSV
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border bg-muted/10">
                            <th className="p-4 font-semibold text-sm">Student</th>
                            <th className="p-4 font-semibold text-sm">Target College</th>
                            <th className="p-4 font-semibold text-sm">Date</th>
                            <th className="p-4 font-semibold text-sm">Status Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.id} className="border-b border-border hover:bg-muted/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-bold">{lead.email}</span>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                            <span className="flex items-center gap-1"><Mail size={12}/> {lead.email}</span>
                                            <span className="flex items-center gap-1"><Phone size={12}/> {lead.phone}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20">
                                        {lead.colleges?.name || 'N/A'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} /> {new Date(lead.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="relative group w-fit">
                                        <select 
                                            value={lead.status}
                                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                                            className={cn(
                                                "appearance-none bg-transparent border py-1.5 pl-4 pr-8 rounded-full text-xs font-bold outline-none cursor-pointer transition-colors",
                                                lead.status === 'new' ? "border-blue-200 text-blue-700 bg-blue-50" :
                                                lead.status === 'contacted' ? "border-orange-200 text-orange-700 bg-orange-50" :
                                                "border-emerald-200 text-emerald-700 bg-emerald-50"
                                            )}
                                        >
                                            <option value="new">New Lead</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="converted">Converted</option>
                                        </select>
                                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {leads.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground font-medium">
                                    No leads generated yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
