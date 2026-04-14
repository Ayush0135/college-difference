'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronRight, ChevronLeft, Upload, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function CollegeForm() {
    const router = useRouter()
    const { token } = useAuth()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [createdSlug, setCreatedSlug] = useState('')
    
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        location: '',
        nirf_rank: '',
        accreditation: '',
        stream: 'Engineering',
        cutoff: '',
        deadline: '',
        description: '',
        courses: [{ name: '', duration: '', seats: '', eligibility: '', total_year_1: '' }],
        reviews: [{ rating: '5', comment: '', pros: '', cons: '' }]
    })

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name)
        })
    }

    const handleNext = () => setStep(s => s + 1)
    const handleBack = () => setStep(s => s - 1)

    const addCourse = () => setFormData({ ...formData, courses: [...formData.courses, { name: '', duration: '', seats: '', eligibility: '', total_year_1: '' }] })
    const removeCourse = (index: number) => setFormData({ ...formData, courses: formData.courses.filter((_, i) => i !== index) })
    const updateCourse = (index: number, field: string, value: string) => {
        const newCourses = [...formData.courses]; newCourses[index] = { ...newCourses[index], [field]: value };
        setFormData({ ...formData, courses: newCourses })
    }

    const addReview = () => setFormData({ ...formData, reviews: [...formData.reviews, { rating: '5', comment: '', pros: '', cons: '' }] })
    const removeReview = (index: number) => setFormData({ ...formData, reviews: formData.reviews.filter((_, i) => i !== index) })
    const updateReview = (index: number, field: string, value: string) => {
        const newReviews = [...formData.reviews]; newReviews[index] = { ...newReviews[index], [field]: value };
        setFormData({ ...formData, reviews: newReviews })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('http://localhost:8000/admin/colleges', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    ...formData,
                    reviews: formData.reviews.map(r => ({ ...r, rating: Number(r.rating) }))
                })
            })
            const data = await res.json()
            if (data.success) {
                setSuccess(true)
                setCreatedSlug(data.slug)
            } else if (!res.ok) {
                alert(`Server Error: ${data.detail || 'Failed to process database block.'}`)
            } else {
                alert('Error creating college')
            }
        } catch (error) {
            console.error(error)
            alert('Failed to connect to backend')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto bg-card p-12 rounded-xl border border-border text-center space-y-6">
                <CheckCircle2 size={64} className="mx-auto text-emerald-500" />
                <h2 className="text-3xl font-black text-secondary">College Published!</h2>
                <p className="text-muted-foreground">The institution has been successfully added to the database and is now live.</p>
                <button onClick={() => router.push(`/colleges/${createdSlug}`)} className="bg-primary text-white font-bold px-8 py-3 rounded-lg shadow-lg">
                    View Live Page
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-xl shadow-xl border border-border">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-12">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all", step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>{s}</div>
                        {s < 3 && <div className={cn("h-1 flex-1 mx-4 transition-all", step > s ? "bg-primary" : "bg-muted")} />}
                    </div>
                ))}
            </div>

            <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext() }} className="space-y-6">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <h2 className="text-2xl font-bold text-secondary">Institution Profile</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">College Name</label><input required value={formData.name} onChange={e => handleNameChange(e.target.value)} className="w-full p-2 rounded-md border border-input outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. IIT Delhi" /></div>
                                <div><label className="block text-sm font-medium mb-1">URL Slug</label><input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 rounded-md border border-input outline-none focus:ring-2 focus:ring-primary" placeholder="iit-delhi" /></div>
                                <div><label className="block text-sm font-medium mb-1">Location</label><input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 rounded-md border border-input outline-none focus:ring-2 focus:ring-primary" placeholder="New Delhi" /></div>
                                <div><label className="block text-sm font-medium mb-1">NIRF Rating</label><input required type="number" value={formData.nirf_rank} onChange={e => setFormData({...formData, nirf_rank: e.target.value})} className="w-full p-2 rounded-md border border-input outline-none focus:ring-2 focus:ring-primary" placeholder="1" /></div>
                                <div><label className="block text-sm font-medium mb-1">Cutoff %</label><input required value={formData.cutoff} onChange={e => setFormData({...formData, cutoff: e.target.value})} className="w-full p-2 rounded-md border border-input outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. 85" /></div>
                                <div><label className="block text-sm font-medium mb-1">Deadline</label><input required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full p-2 rounded-md border border-input outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Aug 15, 2026" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Stream / Category</label>
                                    <select value={formData.stream} onChange={e => setFormData({...formData, stream: e.target.value})} className="w-full p-2.5 rounded-md border border-input outline-none focus:ring-2 focus:ring-primary bg-background">
                                        <option value="Engineering">Engineering</option>
                                        <option value="Management">Management</option>
                                        <option value="Medical">Medical</option>
                                        <option value="Law">Law</option>
                                        <option value="Commerce">Commerce</option>
                                        <option value="Arts">Arts</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Accreditation</label>
                                    <input required value={formData.accreditation} onChange={e => setFormData({...formData, accreditation: e.target.value})} className="w-full p-2 rounded-md border border-input outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. NAAC A++ / AICTE" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">University Bio (Description)</label>
                                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full p-2 rounded-md border border-input outline-none focus:ring-2 focus:ring-primary" placeholder="Detailed description of the university's legacy, campus, and academics." />
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-secondary">Course & Fee Structure</h2>
                                <button type="button" onClick={addCourse} className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-md font-bold transition-colors border border-primary/20"><Plus size={18} /> Add Course</button>
                            </div>
                            {formData.courses.map((course, index) => (
                                <div key={index} className="p-5 rounded-lg bg-muted/50 border border-border relative group">
                                    <button type="button" onClick={() => removeCourse(index)} className="absolute -top-2 -right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required placeholder="Course Name (e.g. B.Tech CSE)" value={course.name} onChange={e => updateCourse(index, 'name', e.target.value)} className="p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary" />
                                        <input placeholder="Duration (e.g. 4 Years)" value={course.duration} onChange={e => updateCourse(index, 'duration', e.target.value)} className="p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary" />
                                        <input placeholder="Total Seats" value={course.seats} onChange={e => updateCourse(index, 'seats', e.target.value)} className="p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary" />
                                        <input required placeholder="Total Year 1 Fees (e.g. 2.5L)" value={course.total_year_1} onChange={e => updateCourse(index, 'total_year_1', e.target.value)} className="p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                    <input placeholder="Eligibility Criteria (e.g. 75% in 12th + JEE Main)" value={course.eligibility} onChange={e => updateCourse(index, 'eligibility', e.target.value)} className="w-full mt-4 p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary" />
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-secondary">Initial Reviews</h2>
                                <button type="button" onClick={addReview} className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-md font-bold transition-colors border border-primary/20"><Plus size={18} /> Add Review</button>
                            </div>
                            {formData.reviews.map((review, index) => (
                                <div key={index} className="p-5 rounded-lg bg-muted/50 border border-border relative group">
                                    <button type="button" onClick={() => removeReview(index)} className="absolute -top-2 -right-2 p-1.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <input required type="number" min="1" max="5" placeholder="Rating (1-5)" value={review.rating} onChange={e => updateReview(index, 'rating', e.target.value)} className="w-1/4 p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary" />
                                            <input required placeholder="Student Comment" value={review.comment} onChange={e => updateReview(index, 'comment', e.target.value)} className="flex-1 p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                        <input placeholder="Pros (comma separated)" value={review.pros} onChange={e => updateReview(index, 'pros', e.target.value)} className="w-full p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary" />
                                        <input placeholder="Cons (comma separated)" value={review.cons} onChange={e => updateReview(index, 'cons', e.target.value)} className="w-full p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-between pt-8 border-t border-border mt-12">
                    <button type="button" onClick={handleBack} disabled={step === 1} className="flex items-center gap-2 px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"><ChevronLeft size={18} /> Back</button>
                    {step < 3 ? (
                        <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-all font-semibold">Next <ChevronRight size={18} /></button>
                    ) : (
                        <button type="submit" disabled={loading} className="px-8 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20">
                            {loading ? 'Publishing...' : 'Submit College Database'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
