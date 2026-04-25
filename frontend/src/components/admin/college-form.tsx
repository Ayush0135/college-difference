'use client'
import { API_URL } from '@/lib/api'

import { useState } from 'react'
import { Plus, Trash2, ChevronRight, ChevronLeft, Upload, CheckCircle2, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function CollegeForm({ onSuccess, initialData }: { onSuccess?: () => void, initialData?: any }) {
    const router = useRouter()
    const { token } = useAuth()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [createdSlug, setCreatedSlug] = useState('')
    
    const [formData, setFormData] = useState({
        id: initialData?.id || '',
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        location: initialData?.location || '',
        nirf_rank: initialData?.rank || '',
        accreditation: initialData?.accreditation || '',
        stream: initialData?.stream || 'Engineering',
        cutoff: initialData?.cutoff || '',
        deadline: initialData?.deadline || '',
        description: initialData?.description || '',
        brochure_url: initialData?.brochure_url || '',
        avg_package: initialData?.avg_package || '',
        highest_package: initialData?.highest_package || '',
        median_package: initialData?.median_package || '',
        placement_highlights: (initialData?.placement_highlights?.length > 0) ? initialData.placement_highlights.join(',') : '',
        courses: (initialData?.courses?.length > 0) ? initialData.courses.map((c: any) => ({
            name: c.name || '',
            duration: c.duration || '',
            seats: c.seats || '',
            eligibility: c.eligibility || '',
            total_year_1: c.fees || c.total_year_1 || ''
        })) : [{ name: '', duration: '', seats: '', eligibility: '', total_year_1: '' }],
        reviews: (initialData?.reviews?.length > 0) ? initialData.reviews.map((r: any) => ({
            rating: r.rating?.toString() || '5',
            comment: r.comment || '',
            pros: Array.isArray(r.pros) ? r.pros.join(',') : (r.pros || ''),
            cons: Array.isArray(r.cons) ? r.cons.join(',') : (r.cons || '')
        })) : [{ rating: '5', comment: '', pros: '', cons: '' }],
        hostels: (initialData?.hostels?.length > 0) ? initialData.hostels.map((h: any) => ({
            room_type: h.room_type || '',
            fee: h.fee || '',
            description: h.description || '',
            is_ac: h.is_ac || false
        })) : [{ room_type: '', fee: '', description: '', is_ac: false }]
    })

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    const handleNameChange = (name: string) => {
        if (initialData) {
             setFormData({ ...formData, name })
             return
        }
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name)
        })
    }

    const handleNext = () => setStep(s => s + 1)
    const handleBack = () => setStep(s => s - 1)

    // Courses Logic
    const addCourse = () => setFormData({ ...formData, courses: [...formData.courses, { name: '', duration: '', seats: '', eligibility: '', total_year_1: '' }] })
    const removeCourse = (index: number) => setFormData({ ...formData, courses: formData.courses.filter((_course: any, i: number) => i !== index) })
    const updateCourse = (index: number, field: string, value: any) => {
        const newCourses = [...formData.courses]; newCourses[index] = { ...newCourses[index], [field]: value };
        setFormData({ ...formData, courses: newCourses })
    }

    // Hostels Logic
    const addHostel = () => setFormData({ ...formData, hostels: [...formData.hostels, { room_type: '', fee: '', description: '', is_ac: false }] })
    const removeHostel = (index: number) => setFormData({ ...formData, hostels: formData.hostels.filter((_hostel: any, i: number) => i !== index) })
    const updateHostel = (index: number, field: string, value: any) => {
        const newHostels = [...formData.hostels]; newHostels[index] = { ...newHostels[index], [field]: value };
        setFormData({ ...formData, hostels: newHostels })
    }

    const addReview = () => setFormData({ ...formData, reviews: [...formData.reviews, { rating: '5', comment: '', pros: '', cons: '' }] })
    const removeReview = (index: number) => setFormData({ ...formData, reviews: formData.reviews.filter((_review: any, i: number) => i !== index) })
    const updateReview = (index: number, field: string, value: any) => {
        const newReviews = [...formData.reviews]; newReviews[index] = { ...newReviews[index], [field]: value };
        setFormData({ ...formData, reviews: newReviews })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const url = initialData 
                ? `${API_URL}/admin/colleges/${initialData.id}`
                : `${API_URL}/admin/colleges`
            
            const method = initialData ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    ...formData,
                    placement_highlights: formData.placement_highlights ? formData.placement_highlights.split(',') : [],
                    reviews: formData.reviews.map((r: any) => ({ ...r, rating: Number(r.rating) }))
                })
            })
            let data;
            try {
                data = await res.json()
            } catch (jsonErr) {
                console.error("Failed to parse JSON string. Cloudflare likely returned an HTML error page:", jsonErr)
                alert("Server Connection Error: The platform backend failed to process this request or returned an invalid format. Details have been logged.")
                setLoading(false)
                return
            }

            if (res.ok && data.success) {
                setSuccess(true)
                setCreatedSlug(initialData?.slug || data.slug)
                if (onSuccess) onSuccess()
            } else {
                let errorMsg = 'Action failed'
                if (data.detail) {
                    if (Array.isArray(data.detail)) {
                        errorMsg = data.detail.map((err: any) => 
                            `${err.loc?.join(' -> ') || 'Error'}: ${err.msg || JSON.stringify(err)}`
                        ).join('\n')
                    } else {
                        errorMsg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
                    }
                }
                alert(`Publication Error:\n${errorMsg}`)
            }
        } catch (error: any) {
            console.error("Publication Exception:", error)
            alert(`Execution Error: ${error.message || 'Check terminal logs'}`)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto bg-card p-12 rounded-xl border border-border text-center space-y-6">
                <CheckCircle2 size={64} className="mx-auto text-emerald-500" />
                <h2 className="text-3xl font-black text-secondary">{initialData ? 'Intelligence Updated!' : 'College Published!'}</h2>
                <p className="text-muted-foreground">{initialData ? 'Changes have been synchronized across the platform.' : 'The institution has been successfully added to the database and is now live.'}</p>
                <button onClick={() => router.push(`/colleges/${formData.slug}`)} className="bg-primary text-white font-bold px-8 py-3 rounded-lg shadow-lg">
                    View Live Page
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-xl shadow-xl border border-border relative">
            {initialData && (
                <div className="absolute top-8 right-8 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Edit Mode: {initialData.name}
                </div>
            )}
            
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-12">
                {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all", step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground shadow-inner")}>
                            {step > s ? <CheckCircle2 size={16} /> : s}
                        </div>
                        {s < 5 && <div className={cn("h-1 flex-1 mx-4 transition-all rounded-full", step > s ? "bg-primary" : "bg-muted")} />}
                    </div>
                ))}
            </div>

            <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); handleNext() }} className="space-y-6">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <h2 className="text-2xl font-bold text-secondary italic">Step 1: Institutional DNA</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-black uppercase text-slate-400 mb-1">College Name</label><input required value={formData.name || ''} onChange={e => handleNameChange(e.target.value)} className="w-full p-3 rounded-xl border border-input outline-none focus:ring-2 focus:ring-primary bg-slate-50 font-bold" /></div>
                                <div><label className="block text-xs font-black uppercase text-slate-400 mb-1">Slug (Link ID)</label><input required disabled={!!initialData} value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-3 rounded-xl border border-input outline-none focus:ring-2 focus:ring-primary bg-slate-50 font-bold disabled:opacity-50" /></div>
                                <div><label className="block text-xs font-black uppercase text-slate-400 mb-1">Location</label><input required value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3 rounded-xl border border-input outline-none focus:ring-2 focus:ring-primary bg-slate-50 font-bold" /></div>
                                <div><label className="block text-xs font-black uppercase text-slate-400 mb-1">NIRF Rank</label><input required type="number" value={formData.nirf_rank || ''} onChange={e => setFormData({...formData, nirf_rank: e.target.value})} className="w-full p-3 rounded-xl border border-input outline-none focus:ring-2 focus:ring-primary bg-slate-50 font-bold" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 mb-1">Primary Stream</label>
                                    <select value={formData.stream} onChange={e => setFormData({...formData, stream: e.target.value})} className="w-full p-3 rounded-xl border border-input outline-none focus:ring-2 focus:ring-primary bg-slate-50 font-bold">
                                        <option value="Engineering">Engineering</option>
                                        <option value="Management">Management</option>
                                        <option value="Medical">Medical</option>
                                        <option value="Law">Law</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                </div>
                                <div><label className="block text-xs font-black uppercase text-slate-400 mb-1">Accreditation</label><input required value={formData.accreditation} onChange={e => setFormData({...formData, accreditation: e.target.value})} className="w-full p-3 rounded-xl border border-input outline-none focus:ring-2 focus:ring-primary bg-slate-50 font-bold" /></div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-1">Description & Legacy</label>
                                <textarea required value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full p-4 rounded-xl border border-input outline-none focus:ring-2 focus:ring-primary bg-slate-50 font-medium" />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-secondary italic">Step 2: Course Catalog</h2>
                                <button type="button" onClick={addCourse} className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-xl font-black text-xs uppercase transition-all border border-primary/20"><Plus size={16} /> Add Course</button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                                {formData.courses.map((course: any, index: number) => (
                                    <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 relative group">
                                        <button type="button" onClick={() => removeCourse(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input required placeholder="Course Name" value={course.name || ''} onChange={e => updateCourse(index, 'name', e.target.value)} className="p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary font-bold text-sm" />
                                            <input placeholder="Duration (e.g. 4 Years)" value={course.duration || ''} onChange={e => updateCourse(index, 'duration', e.target.value)} className="p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary font-bold text-sm" />
                                            <input placeholder="Seats Available" value={course.seats || ''} onChange={e => updateCourse(index, 'seats', e.target.value)} className="p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary font-bold text-sm" />
                                            <input required placeholder="Fees (Tuiton + Total Yr 1)" value={course.total_year_1 || ''} onChange={e => updateCourse(index, 'total_year_1', e.target.value)} className="p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary font-bold text-sm text-primary" />
                                        </div>
                                        <input placeholder="Eligibility Criteria" value={course.eligibility || ''} onChange={e => updateCourse(index, 'eligibility', e.target.value)} className="w-full mt-4 p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary font-medium text-sm" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <h2 className="text-2xl font-bold text-secondary italic">Step 3: Placement Velocity</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="block text-xs font-black uppercase text-slate-400 mb-1">Average Pack (LPA)</label><input type="text" value={formData.avg_package || ''} onChange={e => setFormData({...formData, avg_package: e.target.value})} className="w-full p-4 rounded-xl border border-input bg-slate-50 font-black text-xl text-primary" placeholder="8.5" /></div>
                                <div><label className="block text-xs font-black uppercase text-slate-400 mb-1">Highest Pack (LPA)</label><input type="text" value={formData.highest_package || ''} onChange={e => setFormData({...formData, highest_package: e.target.value})} className="w-full p-4 rounded-xl border border-input bg-slate-50 font-black text-xl text-emerald-500" placeholder="52" /></div>
                                <div><label className="block text-xs font-black uppercase text-slate-400 mb-1">Median Pack (LPA)</label><input type="text" value={formData.median_package || ''} onChange={e => setFormData({...formData, median_package: e.target.value})} className="w-full p-4 rounded-xl border border-input bg-slate-50 font-black text-xl text-blue-500" placeholder="7.2" /></div>
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase text-slate-400 mb-1">Placement Highlights (Comma Separated)</label>
                                <textarea value={formData.placement_highlights || ''} onChange={e => setFormData({...formData, placement_highlights: e.target.value})} rows={3} className="w-full p-4 rounded-xl border border-input bg-slate-50 font-bold" placeholder="Google, Microsoft, Amazon, 100% Placement Record" />
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-secondary italic">Step 4: Accommodation Intelligence</h2>
                                <button type="button" onClick={addHostel} className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-xl font-black text-xs uppercase transition-all border border-primary/20"><Plus size={16} /> Add Room Type</button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                                {formData.hostels.map((hostel: any, index: number) => (
                                    <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 relative group">
                                        <button type="button" onClick={() => removeHostel(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input required placeholder="Room Type (e.g. 2 Seater AC)" value={hostel.room_type || ''} onChange={e => updateHostel(index, 'room_type', e.target.value)} className="p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary font-bold text-sm" />
                                            <div className="flex items-center gap-4">
                                                <input required placeholder="Total Annual Fee" value={hostel.fee || ''} onChange={e => updateHostel(index, 'fee', e.target.value)} className="flex-1 p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary font-bold text-sm text-secondary" />
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" checked={hostel.is_ac || false} onChange={e => updateHostel(index, 'is_ac', e.target.checked)} className="w-4 h-4 rounded text-primary" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">AC</span>
                                                </div>
                                            </div>
                                        </div>
                                        <input placeholder="Hostel Provisions & Amenities" value={hostel.description || ''} onChange={e => updateHostel(index, 'description', e.target.value)} className="w-full mt-4 p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary font-medium text-sm" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-secondary italic">Step 5: Verified Sentiment</h2>
                                <button type="button" onClick={addReview} className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-xl font-black text-xs uppercase transition-all border border-primary/20"><Plus size={16} /> Add Review</button>
                            </div>
                            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2">
                                {formData.reviews.map((review: any, index: number) => (
                                    <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 relative group">
                                        <button type="button" onClick={() => removeReview(index)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                         <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <input required type="number" min="1" max="5" placeholder="Rating" value={review.rating || '5'} onChange={e => updateReview(index, 'rating', e.target.value)} className="w-24 p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary font-black text-center" />
                                                <input required placeholder="Student Intelligence / Review Segment" value={review.comment || ''} onChange={e => updateReview(index, 'comment', e.target.value)} className="flex-1 p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-primary font-bold text-sm" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input placeholder="Key Strength Points (Pros)" value={review.pros || ''} onChange={e => updateReview(index, 'pros', e.target.value)} className="p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-xs" />
                                                <input placeholder="Areas of Improvement (Cons)" value={review.cons || ''} onChange={e => updateReview(index, 'cons', e.target.value)} className="p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-red-500 font-bold text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-between pt-8 border-t border-slate-100 mt-12 bg-white sticky bottom-0 z-10 py-4">
                    <button type="button" onClick={handleBack} disabled={step === 1} className="flex items-center gap-2 px-8 py-3 rounded-xl border border-slate-200 text-slate-400 font-black text-xs uppercase hover:bg-slate-50 transition-all disabled:opacity-50 tracking-widest"><ChevronLeft size={18} /> Back</button>
                    {step < 5 ? (
                        <button type="submit" className="flex items-center gap-2 px-10 py-3 rounded-xl bg-secondary text-white hover:bg-secondary/90 transition-all font-black text-xs uppercase tracking-widest">Proceed to Step {step + 1} <ChevronRight size={18} /></button>
                    ) : (
                        <button type="submit" disabled={loading} className="px-12 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all font-black text-sm uppercase tracking-[0.1em] shadow-xl shadow-primary/30 flex items-center gap-3">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : initialData ? 'Sync Intelligence' : 'Publish Institutional Profile'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
