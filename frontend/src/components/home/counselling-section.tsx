'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, User, Mail, GraduationCap, CheckCircle2, Loader2 } from 'lucide-react'

export default function CounsellingSection() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        stream: ''
    })
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name || !formData.phone || !formData.email || !formData.stream) {
            return setError("All fields are mandatory")
        }
        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/counselling`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    stream: formData.stream
                })
            })
            if (!res.ok) throw new Error("Failed to send request")
            setSuccess(true)
            setFormData({ name: '', phone: '', email: '', stream: '' })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-24 bg-[#f0f2ff]">
            <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto space-y-4 mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-secondary leading-tight tracking-tighter">
                        Personalized Guidance. <br />
                        <span className="text-secondary opacity-90">Trusted Experts.</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg">Get in touch with our expert counsellors</p>
                </div>

                <div className="max-w-6xl mx-auto">
                    {success ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-emerald-100 flex flex-col items-center gap-6"
                        >
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
                                <CheckCircle2 size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-secondary">Callback Requested!</h3>
                                <p className="text-slate-500 font-medium">An expert counsellor will contact you within the next 2 hours.</p>
                            </div>
                            <button onClick={() => setSuccess(false)} className="text-primary font-bold hover:underline">Request another call</button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-5 text-secondary font-bold outline-none focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                                <div className="relative group">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="tel" 
                                        placeholder="Mobile"
                                        maxLength={10}
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-5 text-secondary font-bold outline-none focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="email" 
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-5 text-secondary font-bold outline-none focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                                <div className="relative group">
                                    <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                                    <select 
                                        value={formData.stream}
                                        onChange={e => setFormData({...formData, stream: e.target.value})}
                                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-5 text-secondary font-bold outline-none focus:border-primary transition-all shadow-sm appearance-none cursor-pointer"
                                    >
                                        <option value="">Your Stream</option>
                                        <option value="Engineering">Engineering</option>
                                        <option value="Management">Management</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Medical">Medical</option>
                                        <option value="Law">Law</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <button 
                                    disabled={loading}
                                    className="bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-600 font-bold px-16 py-6 rounded-2xl text-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Request for a callback'}
                                </button>

                                {error && <p className="text-red-500 font-bold text-sm">{error}</p>}

                                <p className="text-[11px] text-slate-400 font-medium">
                                    By proceeding ahead you expressly agree to the Degree Difference terms of use and privacy policy.
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}
