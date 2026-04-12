'use client'

import CollegeForm from "@/components/admin/college-form"
import LeadTracker from "@/components/admin/lead-tracker"
import { useState } from "react"
import { Plus, Table } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
    const [view, setView] = useState<'leads' | 'create'>('leads')

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage your college listings and student inquiries</p>
                </div>

                <div className="flex bg-muted p-1 rounded-xl">
                    <button 
                        onClick={() => setView('leads')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-lg transition-all text-sm font-bold",
                            view === 'leads' ? "bg-white text-secondary shadow-sm" : "text-muted-foreground"
                        )}
                    >
                        <Table size={16} /> Lead Tracker
                    </button>
                    <button 
                        onClick={() => setView('create')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2 rounded-lg transition-all text-sm font-bold",
                            view === 'create' ? "bg-white text-secondary shadow-sm" : "text-muted-foreground"
                        )}
                    >
                        <Plus size={16} /> Add College
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Colleges', value: '42' },
                    { label: 'New Leads', value: '12', highlight: true },
                    { label: 'Pending Reviews', value: '5' },
                    { label: 'Verified Colleges', value: '38' },
                ].map((stat, i) => (
                    <div key={i} className="bg-card p-6 rounded-2xl border border-border">
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className={cn("text-3xl font-bold", stat.highlight ? "text-primary" : "text-secondary")}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {view === 'leads' ? <LeadTracker /> : <CollegeForm />}
        </div>
    )
}
