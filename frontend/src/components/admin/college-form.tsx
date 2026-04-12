'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronRight, ChevronLeft, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export default function CollegeForm() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        location: '',
        nirf_rank: '',
        images: [] as string[],
        courses: [{ name: '', duration: '', seats: '', eligibility: '', total_year_1: '' }]
    })

    const handleNext = () => setStep(s => s + 1)
    const handleBack = () => setStep(s => s - 1)

    const addCourse = () => {
        setFormData({
            ...formData,
            courses: [...formData.courses, { name: '', duration: '', seats: '', eligibility: '', total_year_1: '' }]
        })
    }

    const removeCourse = (index: number) => {
        const newCourses = [...formData.courses]
        newCourses.splice(index, 1)
        setFormData({ ...formData, courses: newCourses })
    }

    const updateCourse = (index: number, field: string, value: string) => {
        const newCourses = [...formData.courses]
        newCourses[index] = { ...newCourses[index], [field]: value }
        setFormData({ ...formData, courses: newCourses })
    }

    return (
        <div className="max-w-4xl mx-auto bg-card p-8 rounded-xl shadow-xl border border-border">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-12">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                            step >= s ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                            {s}
                        </div>
                        {s < 3 && <div className={cn(
                            "h-1 flex-1 mx-4 transition-all",
                            step > s ? "bg-primary" : "bg-muted"
                        )} />}
                    </div>
                ))}
            </div>

            <form className="space-y-6">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl font-bold text-secondary">Basic Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">College Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none" 
                                        placeholder="e.g. IIT Madras"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Slug</label>
                                    <input 
                                        type="text" 
                                        value={formData.slug}
                                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                        className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="iit-madras"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location</label>
                                    <input 
                                        type="text" 
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">NIRF Rank</label>
                                    <input 
                                        type="number" 
                                        value={formData.nirf_rank}
                                        onChange={(e) => setFormData({...formData, nirf_rank: e.target.value})}
                                        className="w-full p-2 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div className="border-2 border-dashed border-input rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer group">
                                <Upload className="mx-auto mb-2 text-muted-foreground group-hover:text-primary" />
                                <p className="text-sm text-muted-foreground">Click to upload college logo or images</p>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-secondary">Course Details</h2>
                                <button 
                                    type="button"
                                    onClick={addCourse}
                                    className="flex items-center gap-2 text-primary hover:bg-primary/10 px-4 py-2 rounded-md transition-colors"
                                >
                                    <Plus size={18} /> Add Course
                                </button>
                            </div>

                            {formData.courses.map((course, index) => (
                                <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border relative group">
                                    <button 
                                        type="button"
                                        onClick={() => removeCourse(index)}
                                        className="absolute -top-2 -right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            placeholder="Course Name (e.g. B.Tech CSE)" 
                                            value={course.name}
                                            onChange={(e) => updateCourse(index, 'name', e.target.value)}
                                            className="p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <input 
                                            placeholder="Duration (e.g. 4 Years)" 
                                            value={course.duration}
                                            onChange={(e) => updateCourse(index, 'duration', e.target.value)}
                                            className="p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <input 
                                            placeholder="Total Seats" 
                                            value={course.seats}
                                            onChange={(e) => updateCourse(index, 'seats', e.target.value)}
                                            className="p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary"
                                        />
                                        <input 
                                            placeholder="Eligibility" 
                                            value={course.eligibility}
                                            onChange={(e) => updateCourse(index, 'eligibility', e.target.value)}
                                            className="p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-secondary">Fee Mapping (Year 1)</h2>
                            <div className="space-y-4">
                                {formData.courses.map((course, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-muted/30">
                                        <span className="font-semibold flex-1">{course.name || `Course ${index + 1}`}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">₹</span>
                                            <input 
                                                type="number"
                                                placeholder="Total Fees"
                                                value={course.total_year_1}
                                                onChange={(e) => updateCourse(index, 'total_year_1', e.target.value)}
                                                className="w-32 p-2 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary text-right"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-between pt-8 border-t border-border">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={step === 1}
                        className="flex items-center gap-2 px-6 py-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
                    >
                        <ChevronLeft size={18} /> Back
                    </button>
                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-all font-semibold"
                        >
                            Next <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="px-8 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20"
                        >
                            Submit College
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
