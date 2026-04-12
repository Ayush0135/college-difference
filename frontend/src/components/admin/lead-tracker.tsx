'use client'

import { Mail, Phone, ExternalLink, Calendar } from 'lucide-react'

const leads = [
    { id: 1, email: 'student1@gmail.com', phone: '+91 9876543210', college: 'IIT Bombay', date: '2024-04-12' },
    { id: 2, email: 'student2@yahoo.com', phone: '+91 8765432109', college: 'BITS Pilani', date: '2024-04-11' },
    { id: 3, email: 'student3@outlook.com', phone: '+91 7654321098', college: 'MIT Manipal', date: '2024-04-10' },
]

export default function LeadTracker() {
    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
                <h2 className="text-xl font-bold text-secondary">Student Inquiries (Leads)</h2>
                <p className="text-sm text-muted-foreground">Manage and track student interest in colleges</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border bg-muted/10">
                            <th className="p-4 font-semibold text-sm">Student</th>
                            <th className="p-4 font-semibold text-sm">Contact</th>
                            <th className="p-4 font-semibold text-sm">College Query</th>
                            <th className="p-4 font-semibold text-sm">Date</th>
                            <th className="p-4 font-semibold text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead.id} className="border-b border-border hover:bg-muted/5 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {lead.email[0].toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium">{lead.email}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Mail size={12} /> {lead.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Phone size={12} /> {lead.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="px-3 py-1 bg-secondary/5 text-secondary border border-secondary/10 rounded-full text-xs font-medium w-fit">
                                        {lead.college}
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} /> {lead.date}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <button className="p-2 hover:bg-muted rounded-md text-primary transition-colors">
                                        <ExternalLink size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
