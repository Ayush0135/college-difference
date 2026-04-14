'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, KeyRound, Phone, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, login } = useAuth()
    
    const [step, setStep] = useState<'email' | 'otp' | 'phone'>('email')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return setError("Please enter your email")
        setError('')
        setLoading(true)
        
        try {
            const res = await fetch('http://localhost:8000/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || 'Failed to send OTP')
            
            setStep('otp')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.length !== 6) return setError("Please enter a valid 6-digit OTP")
        setError('')
        setLoading(true)
        
        try {
            const res = await fetch('http://localhost:8000/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otp })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || 'Invalid OTP')
            
            if (data.requires_phone) {
                setStep('phone')
            } else {
                login(data.user, data.token)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCompleteOnboarding = async (e: React.FormEvent) => {
        e.preventDefault()
        if (phone.length < 10) return setError("Please enter a valid phone number")
        setError('')
        setLoading(true)
        
        try {
            const res = await fetch('http://localhost:8000/auth/complete-onboarding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.detail || 'Failed to complete profile')
            
            login(data.user, data.token)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isAuthModalOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={closeAuthModal}
                    className="absolute inset-0 bg-secondary/80 backdrop-blur-md"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="bg-primary p-6 text-white text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                        <button onClick={closeAuthModal} className="absolute right-4 top-4 hover:bg-white/10 p-1 rounded-full transition-colors z-10"><X size={20} /></button>
                        <ShieldCheck size={48} className="mx-auto mb-4 text-emerald-300 relative z-10" />
                        <h2 className="text-2xl font-black relative z-10">
                            {step === 'email' ? 'Welcome Back' : step === 'otp' ? 'Verify Securely' : 'Complete Profile'}
                        </h2>
                        <p className="text-white/80 text-sm mt-2 relative z-10">
                            {step === 'email' ? 'Enter your email to receive a secure login code' : 
                             step === 'otp' ? `Code sent to ${email}` : 
                             'Add your phone number to stay updated on your applications'}
                        </p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                                {error}
                            </div>
                        )}

                        {step === 'email' && (
                            <form onSubmit={handleSendOTP} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="email" 
                                            autoFocus
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-secondary font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>
                                <button disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <>Send Secure Code <ArrowRight size={18} /></>}
                                </button>
                            </form>
                        )}

                        {step === 'otp' && (
                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">6-Digit Code</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            autoFocus
                                            maxLength={6}
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-secondary font-bold tracking-[0.5em] text-center outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            placeholder="------"
                                        />
                                    </div>
                                </div>
                                <button disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify & Login'}
                                </button>
                                <button type="button" onClick={() => setStep('email')} className="w-full text-center text-sm text-slate-400 font-medium hover:text-primary mt-2">
                                    Change Email
                                </button>
                            </form>
                        )}

                        {step === 'phone' && (
                            <form onSubmit={handleCompleteOnboarding} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Mobile Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <span className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 font-medium">+91</span>
                                        <input 
                                            type="tel" 
                                            autoFocus
                                            maxLength={10}
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-[4.5rem] pr-4 text-secondary font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            placeholder="98765 43210"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 text-center">We need this to securely process your college applications.</p>
                                </div>
                                <button disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-secondary/20 flex justify-center items-center gap-2">
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : 'Complete Profile'}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
