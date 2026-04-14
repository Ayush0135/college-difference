'use client'

import { useState, useEffect } from "react"
import { Plus, MessageSquare, UploadCloud, Users, Lock, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import CollegeForm from "@/components/admin/college-form"
import ReviewModerator from "@/components/admin/review-moderator"
import BulkImporter from "@/components/admin/bulk-importer"

function TeamAccess() {
    const { token } = useAuth()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('')
    
    // ...

    const authorize = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus("Authorizing...")
        try {
            const res = await fetch('http://localhost:8000/admin/team', {
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
    const [view, setView] = useState<'create' | 'reviews' | 'bulk' | 'team'>('create')
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

    useEffect(() => {
        if (!token || user?.role !== 'admin') return
        fetch('http://localhost:8000/admin/stats', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (!data.error && !data.detail) setStats(data)
            })
            .catch(console.error)
    }, [view, token, user])

    const handleAdminSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setAuthLoading(true); setAuthError('')
        try {
            const res = await fetch('http://localhost:8000/admin/auth/send-otp', {
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
            const res = await fetch('http://localhost:8000/admin/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: authEmail, code: authOtp })
            })
            const data = await res.json()
            if (res.ok && data.token) {
                // Pipe verification seamlessly to global AuthContext
                login(data.user, data.token)
            } else setAuthError(data.detail || "Invalid OTP")
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
        <div className="space-y-8 max-w-7xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-secondary flex items-center gap-3">
                        Admin Dashboard
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-3 mb-2">
                        <span className="text-emerald-500 font-bold tracking-widest uppercase text-[10px] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            From IITs to IIMs
                        </span>
                        <span className="text-blue-500 font-bold tracking-widest uppercase text-[10px] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                            NIRF Ranked Institutions
                        </span>
                        <span className="text-orange-500 font-bold tracking-widest uppercase text-[10px] bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                            Direct Admissions
                        </span>
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Discover India's Elite Universities & Colleges. Manage verified reviews, historical cutoffs, and transparent fee structures.
                    </p>
                </div>

                <div className="flex bg-muted p-1 rounded-xl w-fit overflow-x-auto">
                    {[
                        { id: 'create', icon: Plus, label: 'Add College' },
                        { id: 'reviews', icon: MessageSquare, label: 'Moderation' },
                        { id: 'bulk', icon: UploadCloud, label: 'Bulk CSV' },
                        { id: 'team', icon: Users, label: 'Team Access' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setView(tab.id as any)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2 rounded-lg transition-all text-sm font-bold whitespace-nowrap",
                                view === tab.id ? "bg-white text-secondary shadow-sm" : "text-muted-foreground hover:bg-muted-foreground/10"
                            )}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Colleges', value: stats.total_colleges },
                    { label: 'Pending Reviews', value: stats.pending_reviews },
                    { label: 'Verified Listing', value: stats.verified_colleges },
                ].map((stat, i) => (
                    <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center">
                        <p className="text-sm text-muted-foreground mb-1 font-medium">{stat.label}</p>
                        <p className="text-4xl font-black text-secondary">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="pt-4">
                {view === 'create' && <CollegeForm />}
                {view === 'reviews' && <ReviewModerator />}
                {view === 'bulk' && <BulkImporter />}
                {view === 'team' && <TeamAccess />}
            </div>
        </div>
    )
}
