'use client'
import { API_URL } from '@/lib/api'

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, MessageSquare, UploadCloud, Users, Lock, ShieldAlert, CheckCircle2, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import CollegeForm from "@/components/admin/college-form"
import ReviewModerator from "@/components/admin/review-moderator"
import BulkImporter from "@/components/admin/bulk-importer"
import LeadTracker from "@/components/admin/lead-tracker"
import CounsellingTracker from "@/components/admin/counselling-tracker"
import StudyAppTracker from "@/components/admin/study-app-tracker"
import AnalyticsDashboard from "@/components/admin/analytics-dashboard"
import CollegeManager from "@/components/admin/college-manager"

function TeamAccess() {
    const { token } = useAuth()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('')
    
    // ...

    const authorize = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("Authorizing...")
        try {
            const res = await fetch(`${API_URL}/admin/team`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ email })
            })
            const data = await res.json()
            if (data.success) {
                setStatus(`Success! ${email} is now an Admin.`)
                setEmail('')
            } else {
                setStatus("Failed to authorize: " + (data.detail || data.error))
            }
        } catch {
            setStatus("Internal Error")
        }
    }
    
    return (
        <div className="max-w-xl bg-card border shadow-lg rounded-xl p-8 space-y-6">
            <div className="flex items-center gap-4 text-emerald-500 mb-6">
                <div className="bg-emerald-500/10 p-4 rounded-full"><Lock size={32} /></div>
                <div>
                    <h2 className="text-2xl font-black text-secondary">Supreme Authority</h2>
                    <p className="text-muted-foreground text-sm">Delegate admin control to specific personnel in the admin directory.</p>
                </div>
            </div>
            <form onSubmit={authorize} className="space-y-4">
                <input required type="email" placeholder="Employee Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-background" />
                <button type="submit" className="w-full bg-secondary text-white font-bold py-4 rounded-xl hover:bg-secondary/90 transition-all flex items-center justify-center gap-2">
                    <ShieldAlert size={20} /> Grant Admin Rights
                </button>
            </form>
            {status && <p className="text-center font-semibold text-emerald-600 mt-4">{status}</p>}
        </div>
    )
}

export default function AdminDashboard() {
    const { user, token, login } = useAuth()
    const [view, setView] = useState<'create' | 'reviews' | 'bulk' | 'team' | 'leads' | 'colleges' | 'analytics' | 'counselling' | 'study-apps'>('study-apps')
    const [editingCollege, setEditingCollege] = useState<any>(null)
    const [stats, setStats] = useState({
        total_colleges: 0,
        pending_reviews: 0,
        verified_colleges: 0
    })

    // Custom Isolated Admin Login State
    const [authStep, setAuthStep] = useState<'email' | 'otp'>('email')
    const [authEmail, setAuthEmail] = useState('')
    const [authOtp, setAuthOtp] = useState('')
    const [authError, setAuthError] = useState('')
    const [authLoading, setAuthLoading] = useState(false)

    const refreshStats = () => {
        if (!token || user?.role !== 'admin') return
        fetch(`${API_URL}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (!data.error && !data.detail) setStats(data)
            })
            .catch(console.error)
    }

    useEffect(() => {
        refreshStats()
        const interval = setInterval(refreshStats, 30000) // Real-time pulse every 30s
        return () => clearInterval(interval)
    }, [view, token, user])

    const handleAdminSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthLoading(true); setAuthError('')
        try {
            const res = await fetch(`${API_URL}/auth/admin/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: authEmail })
            })
            const data = await res.json()
            if (res.ok) setAuthStep('otp')
            else setAuthError(data.detail || data.error || "Access Denied")
        } catch {
            setAuthError("Server Connection Failed")
        }
        setAuthLoading(false)
    }

    const handleAdminVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthLoading(true); setAuthError('')
        try {
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: authEmail, code: authOtp })
            })
            const data = await res.json()
            if (res.ok && data.token) {
                // Pipe verification seamlessly to global AuthContext, enforcing admin role for this portal
                login({ ...data.user, role: 'admin' }, data.token)
            } else setAuthError(data.error || data.detail || "Invalid OTP")
        } catch {
            setAuthError("Server Connection Failed")
        }
        setAuthLoading(false)
    }

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
                <ShieldAlert size={64} className="text-secondary" />
                <h1 className="text-4xl font-black text-secondary">Secure Administration</h1>
                <p className="text-lg text-muted-foreground w-full max-w-md">The administrative portal is strictly locked. Only registered admin personnel may request an access OTP.</p>
                
                <div className="bg-card border w-full max-w-md rounded-2xl shadow-xl p-8 mt-6">
                    {authError && <div className="p-3 mb-6 bg-red-100 text-red-700 text-sm font-bold rounded-lg">{authError}</div>}
                    
                    {authStep === 'email' ? (
                        <form onSubmit={handleAdminSendOtp} className="space-y-4">
                            <input type="email" required placeholder="Admin Directory Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-primary text-center font-semibold" />
                            <button type="submit" disabled={authLoading} className="w-full bg-secondary text-white font-black py-4 rounded-xl disabled:opacity-50">
                                {authLoading ? "Verifying Directory..." : "Request Admin OTP"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleAdminVerifyOtp} className="space-y-4">
                            <p className="font-bold text-slate-700">Code securely dispatched to your inbox.</p>
                            <input type="text" required placeholder="6-Digit OTP" value={authOtp} onChange={e => setAuthOtp(e.target.value)} className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-primary text-center font-black tracking-[0.5em] text-xl" />
                            <button type="submit" disabled={authLoading} className="w-full bg-primary text-white font-black py-4 rounded-xl disabled:opacity-50">
                                {authLoading ? "Authorizing..." : "Initialize Session"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12 max-w-7xl mx-auto py-8 px-4">
            {/* Status & Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-emerald-500"><CheckCircle2 size={64} /></div>
                    <p className="text-secondary/60 text-xs font-black uppercase tracking-widest mb-2">Resolved Requests</p>
                    <h3 className="text-4xl font-black text-secondary tracking-tighter italic">{(stats as any).resolved_requests || 0}+</h3>
                    <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1 uppercase tracking-tighter">
                        Success Rate Optimized
                    </p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-orange-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-orange-500"><Users size={64} /></div>
                    <p className="text-secondary/60 text-xs font-black uppercase tracking-widest mb-2">Pending Actions</p>
                    <h3 className="text-4xl font-black text-secondary tracking-tighter italic">
                        {((stats as any).new_leads || 0) + ((stats as any).new_counselling || 0) + ((stats as any).new_study_apps || 0)}
                    </h3>
                    <p className="text-[10px] text-orange-500 font-bold mt-2 flex items-center gap-1 uppercase tracking-tighter">
                        Requires Immediate Response
                    </p>
                </div>
                <div className="bg-secondary p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform text-primary"><GraduationCap size={64} /></div>
                    <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-2">Institutional Registry</p>
                    <h3 className="text-4xl font-black text-white tracking-tighter italic">{stats.total_colleges}</h3>
                    <p className="text-[10px] text-primary font-bold mt-2 flex items-center gap-1 uppercase tracking-tighter">
                        Verified Partners Live
                    </p>
                </div>
            </div>

            {/* Integrated Command Center */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-secondary tracking-tighter italic">Applicant Command Center</h2>
                        <p className="text-slate-400 text-sm font-medium">Manage and resolve all incoming student inquiries in real-time.</p>
                    </div>
                    
                    <div className="flex bg-slate-50 p-1 rounded-xl w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {[
                            { id: 'study-apps', label: 'Applications' },
                            { id: 'leads', label: 'Inquiries' },
                            { id: 'counselling', label: 'Counselling' },
                            { id: 'colleges', label: 'Registry' },
                            { id: 'analytics', label: 'Analysis' },
                            { id: 'create', label: 'Add College' },
                            { id: 'bulk', label: 'Import' },
                            { id: 'team', label: 'Team' }
                        ].map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => { setView(tab.id as any); setEditingCollege(null); }}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-black transition-all uppercase tracking-widest",
                                    view === tab.id ? "bg-white text-secondary shadow-sm" : "text-slate-400 hover:text-secondary"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                        >
                            { view === 'leads' && <LeadTracker /> }
                            { view === 'counselling' && <CounsellingTracker /> }
                            { view === 'study-apps' && <StudyAppTracker /> }
                            { view === 'colleges' && <CollegeManager onEdit={(c: any) => { setEditingCollege(c); setView('create'); }} /> }
                            { view === 'analytics' && <AnalyticsDashboard /> }
                            { view === 'create' && <CollegeForm onSuccess={() => { refreshStats(); setEditingCollege(null); }} initialData={editingCollege} /> }
                            { view === 'bulk' && <BulkImporter /> }
                            { view === 'team' && <TeamAccess /> }
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
