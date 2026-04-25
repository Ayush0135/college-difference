import { API_URL } from '@/lib/api'
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, Phone, ArrowRight, Zap, CheckCircle2, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface ApplyModalProps {
    isOpen: boolean
    onClose: () => void
    collegeId: string
    collegeName: string
}

export default function ApplyModal({ isOpen, onClose, collegeId, collegeName }: ApplyModalProps) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        degree: '',
        otherDegree: ''
    })
    const [error, setError] = useState('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)

    // Sync logged in user data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: (user as any).name || '',
                email: user.email || '',
                phone: user.phone || ''
            }))
        }
    }, [user, isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.phone || !formData.degree) {
            return setError("Please fill all required fields")
        }
        
        if (formData.degree === 'Other' && !formData.otherDegree) {
            return setError("Please specify your degree")
        }
        
        setLoading(true)
        setError('')
        
        try {
            const finalDegree = formData.degree === 'Other' ? formData.otherDegree : formData.degree;
            const res = await fetch(`${API_URL}/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    course_name: finalDegree,
                    college_id: collegeId === "general-counseling" ? null : collegeId
                })
            })
            
            const data = await res.json()
            if (!res.ok) {
                const detail = data.detail
                const errorMsg = typeof detail === 'object' ? 'Please check your information and try again' : (detail || 'Failed to submit application')
                throw new Error(errorMsg)
            }
            
            setSuccess(true)
            setTimeout(() => {
                onClose()
                setSuccess(false)
            }, 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-secondary/80 backdrop-blur-md"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                >
                    {success ? (
                        <div className="p-12 text-center space-y-6">
                            <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
                            >
                                <CheckCircle2 size={48} className="text-emerald-500" />
                            </motion.div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-secondary tracking-tighter italic">Application Sent!</h2>
                                <p className="text-slate-500 font-medium">Your request for {collegeName} has been recorded. Our counselors will reach out to you within 24 hours.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="bg-secondary p-6 text-white relative overflow-hidden">
                                <button onClick={onClose} className="absolute right-4 top-4 hover:bg-white/10 p-2 rounded-full transition-colors z-10"><X size={18} /></button>
                                <div className="space-y-2 relative z-10">
                                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                                        <Zap size={12} className="fill-primary" /> Instant Admission
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tighter leading-none italic">
                                        Easy Apply to <br />
                                        <span className="text-primary">{String(collegeName)}</span>
                                    </h2>
                                </div>
                                <div className="absolute right-[-10%] bottom-[-20%] w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                            </div>

                            <div className="p-6">
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
                                        <X size={16} className="shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input 
                                                    type="text" 
                                                    required
                                                    value={formData.name}
                                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3.5 pl-11 pr-4 text-secondary font-bold text-sm outline-none focus:border-primary transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input 
                                                        type="email" 
                                                        required
                                                        value={formData.email}
                                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3.5 pl-11 pr-4 text-secondary font-bold text-sm outline-none focus:border-primary transition-all"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Mobile Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input 
                                                        type="tel" 
                                                        required
                                                        maxLength={10}
                                                        value={formData.phone}
                                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3.5 pl-11 pr-4 text-secondary font-bold text-sm outline-none focus:border-primary transition-all"
                                                        placeholder="98765 43210"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Preferred Degree</label>
                                                <select 
                                                    required
                                                    value={formData.degree}
                                                    onChange={e => setFormData({...formData, degree: e.target.value})}
                                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3.5 px-4 text-secondary font-bold text-sm outline-none focus:border-primary transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Select your goal</option>
                                                    <option value="B.Tech">B.Tech (Engineering)</option>
                                                    <option value="MBA">MBA (Management)</option>
                                                    <option value="MBBS">MBBS (Medical)</option>
                                                    <option value="Law">Law (LLB/LLM)</option>
                                                    <option value="B.Com">B.Com (Commerce)</option>
                                                    <option value="Other">Other (Please specify)</option>
                                                </select>
                                            </div>

                                            <AnimatePresence>
                                                {formData.degree === 'Other' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Specify Degree</label>
                                                        <input 
                                                            type="text" 
                                                            required
                                                            value={formData.otherDegree}
                                                            onChange={e => setFormData({...formData, otherDegree: e.target.value})}
                                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3.5 px-4 text-secondary font-bold text-sm outline-none focus:border-primary transition-all"
                                                            placeholder="Enter your degree name"
                                                        />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 flex gap-3">
                                        <input 
                                            type="checkbox" 
                                            id="apply-terms"
                                            required
                                            checked={agreedToTerms}
                                            onChange={e => setAgreedToTerms(e.target.checked)}
                                            className="mt-1 w-4 h-4 rounded border-2 border-slate-200 text-primary focus:ring-primary cursor-pointer transition-all shrink-0"
                                        />
                                        <div className="space-y-2">
                                            <label htmlFor="apply-terms" className="text-[11px] leading-tight text-slate-600 font-bold block cursor-pointer">
                                                I confirm that all details provided are accurate and I agree to the platform Terms and Services.
                                            </label>
                                            <div className="text-[9px] leading-relaxed text-slate-400 font-medium">
                                                By proceeding, you acknowledge that your information will be securely shared with {String(collegeName)} and our affiliated academic counselors to facilitate your application. You expressly authorize Degree Difference to contact you via telephone, electronic mail, or mobile messaging services for counseling and informational updates regarding your pursuit of higher education. This consent is given voluntarily to ensure you receive the most relevant guidance for your professional journey.
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button 
                                            disabled={loading || !agreedToTerms}
                                            className="w-full bg-primary disabled:opacity-50 hover:bg-primary/90 text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary/30 flex justify-center items-center gap-3 active:scale-[0.98]"
                                        >
                                            {loading ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <span className="flex items-center gap-3 text-base">
                                                    Complete Application <ArrowRight size={18} />
                                                </span>
                                            )}
                                        </button>
                                        <p className="text-center text-[10px] text-slate-400 mt-4 px-4 leading-tight">
                                            Your privacy is our priority. We never sell your data to third-party advertisers. All communication is strictly for educational and career purposes.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
