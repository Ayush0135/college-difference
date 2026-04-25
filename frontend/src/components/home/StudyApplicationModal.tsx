'use client'
import { API_URL } from '@/lib/api'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Loader2, Send, GraduationCap, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StudyApplicationModal({ 
    isOpen, 
    onClose 
}: { 
    isOpen: boolean, 
    onClose: () => void 
}) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college_choices: ['', '', '', '', '']
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/study-applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    college_choices: formData.college_choices.filter(c => c.trim() !== '')
                })
            })
            const data = await res.json()
            if (data.success) {
                setSuccess(true)
            } else {
                alert('Submission failed: ' + (data.detail || 'Internal error'))
            }
        } catch (error) {
            alert('Connection failed')
        } finally {
            setLoading(false)
        }
    }

    const updateChoice = (index: number, val: string) => {
        const newChoices = [...formData.college_choices]
        newChoices[index] = val
        setFormData({ ...formData, college_choices: newChoices })
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-secondary/80 backdrop-blur-md"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-12 mb-20"
                >
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-secondary"
                    >
                        <X size={24} />
                    </button>

                    {success ? (
                        <div className="py-12 text-center space-y-6">
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 text-white">
                                <CheckCircle2 size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-secondary tracking-tighter italic">Application <span className="text-primary">Started!</span></h3>
                                <p className="text-slate-500 font-medium">Our admission council has received your preferences. <br />Expect a call within 24 hours.</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="bg-secondary text-white font-black px-8 py-3 rounded-xl hover:scale-105 transition-all"
                            >
                                Back to Discovery
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-3xl font-black text-secondary tracking-tighter leading-none mb-2 italic">
                                    Let's Start Your <span className="text-primary">Journey</span>
                                </h3>
                                <p className="text-slate-400 font-medium">Tell us your top choices and our experts will handle the rest.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {step === 1 ? (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Full Name</label>
                                            <input 
                                                required
                                                placeholder="Enter your name"
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-primary transition-all font-medium text-secondary"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Mobile Number</label>
                                                <input 
                                                    required
                                                    type="tel"
                                                    placeholder="+91"
                                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-primary transition-all font-medium text-secondary"
                                                    value={formData.phone}
                                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Email Address</label>
                                                <input 
                                                    required
                                                    type="email"
                                                    placeholder="name@email.com"
                                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-primary transition-all font-medium text-secondary"
                                                    value={formData.email}
                                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="w-full py-5 bg-secondary text-white font-black rounded-2xl shadow-xl hover:shadow-secondary/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            Next: College Choices <GraduationCap size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Your Top 5 Preferences</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {formData.college_choices.map((choice, i) => (
                                                    <div key={i} className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xs italic opacity-50">#{i+1}</span>
                                                        <input 
                                                            placeholder={i < 1 ? "Your dream college" : "Alternative choice"}
                                                            className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all font-bold text-secondary text-sm"
                                                            value={choice}
                                                            onChange={e => updateChoice(i, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button 
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="px-6 py-5 bg-slate-100 text-secondary font-black rounded-2xl hover:bg-slate-200 transition-all"
                                            > Back </button>
                                            <button 
                                                disabled={loading}
                                                className="flex-1 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                            >
                                                {loading ? <Loader2 className="animate-spin" size={24} /> : <>Start Application <Send size={20} /></>}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed">
                                    By proceeding, you agree to share your preferences with our certified counseling experts to facilitate your admission journey.
                                </p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
