'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Phone, Zap } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import ApplyModal from '../college/ApplyModal'

const steps = [
    {
        title: "STEP 1: Explore & Choose",
        desc: "Explore degree programs that excite you, aligning with your interests and career aspirations",
        color: "text-rose-600"
    },
    {
        title: "STEP 2: Check Requirements",
        desc: "Ensure you're on track by reviewing eligibility criteria. Meet academic prerequisites and any standardized tests",
        color: "text-orange-500"
    },
    {
        title: "STEP 3: Apply Online",
        desc: "Complete the user-friendly online application & Hit \"Submit\"",
        color: "text-purple-700"
    },
    {
        title: "STEP 4: Financial Game Plan",
        desc: "Explore scholarships, understand fees, and plan finances. Apply for aid or loans if needed",
        color: "text-rose-700"
    }
]
export default function StepBanner() {
    const [isApplyOpen, setIsApplyOpen] = useState(false)

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center md:text-left mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-secondary leading-tight tracking-tighter">
                            Unlock your future in <span className="text-primary italic">simple steps!</span>
                        </h2>
                        <p className="text-slate-500 max-w-3xl text-lg font-medium leading-relaxed">
                            From choosing the right course to securing industry-led certifications, we guide you through the journey of turning your aspirations into achievements.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Visual Left */}
                        <div className="lg:col-span-5 relative">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="relative rounded-md overflow-hidden bg-slate-200 aspect-[4/5] shadow-md border border-slate-200"
                            >
                                <Image 
                                    src="/assets/banners/step_banner_student.png" 
                                    alt="Student Future"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent mix-blend-multiply" />
                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="bg-white/90 backdrop-blur-sm border border-white/20 p-4 rounded-md shadow-sm">
                                        <div className="text-secondary font-bold text-xl leading-tight">Your Degree of Awesomeness.</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Steps Right */}
                        <div className="lg:col-span-7 space-y-4">
                            {steps.map((step, i) => (
                                <motion.div 
                                    key={step.title}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex gap-4 p-5 bg-white rounded-md border border-slate-200 hover:shadow-md hover:border-primary/30 transition-all cursor-default"
                                >
                                    <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center text-primary shrink-0 self-start group-hover:bg-primary/10 transition-colors">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className={`text-lg font-bold text-slate-800 tracking-tight`}>{step.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-12 flex flex-col md:flex-row items-center justify-center gap-4"
                    >
                        <a href="tel:7090778035" className="flex items-center gap-3 bg-white border border-slate-200 px-6 py-3 rounded-md hover:border-primary/50 transition-all text-slate-700">
                            <Phone size={18} className="text-primary" />
                            <span className="text-lg font-bold">7090778035</span>
                        </a>
                        <button 
                            onClick={() => setIsApplyOpen(true)}
                            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-3 rounded-md flex items-center gap-2 transition-all shadow-sm"
                        >
                            <Zap size={18} /> Apply Now
                        </button>
                    </motion.div>

                    <ApplyModal 
                        isOpen={isApplyOpen}
                        onClose={() => setIsApplyOpen(false)}
                        collegeId="general-counseling"
                        collegeName="General Counseling"
                    />
                </div>
            </div>
        </section>
    )
}
