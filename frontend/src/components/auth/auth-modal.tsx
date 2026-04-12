'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, ShieldCheck } from 'lucide-react'

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [step, setStep] = useState<'email' | 'otp'>('email')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Call FastAPI Backend Wrapper
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            if (res.ok) setStep('otp')
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Call FastAPI Backend Wrapper
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otp })
            })
            if (res.ok) {
                // Success logic (e.g., set cookie and redirect)
                onClose()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" 
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-card w-full max-w-md rounded-2xl shadow-2xl p-8 border border-border overflow-hidden"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-secondary">
                        <X size={20} />
                    </button>

                    <div className="text-center space-y-2 mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            {step === 'email' ? <Mail className="text-primary" /> : <ShieldCheck className="text-primary" />}
                        </div>
                        <h2 className="text-2xl font-bold text-secondary">
                            {step === 'email' ? 'Unlock Premium Insights' : 'Check Your Inbox'}
                        </h2>
                        <p className="text-muted-foreground">
                            {step === 'email' 
                                ? 'Join 10k+ students getting verified college data' 
                                : `We've sent a 6-digit code to ${email}`}
                        </p>
                    </div>

                    <form onSubmit={step === 'email' ? handleSendOTP : handleVerifyOTP} className="space-y-4">
                        {step === 'email' ? (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <input 
                                    required
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@university.com"
                                    className="w-full p-3 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-center block">Enter Code</label>
                                <input 
                                    required
                                    type="text" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    placeholder="000000"
                                    className="w-full p-4 rounded-xl border border-input bg-background outline-none focus:ring-2 focus:ring-primary text-center text-3xl font-bold tracking-widest"
                                />
                            </div>
                        )}

                        <button 
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (step === 'email' ? 'Send Verification Code' : 'Verify & Continue')}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-muted-foreground">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
