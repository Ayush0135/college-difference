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
                            <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-3xl" />
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-primary to-orange-400 aspect-[4/5] shadow-2xl"
                            >
                                <Image 
                                    src="/assets/banners/step_banner_student.png" 
                                    alt="Student Future"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-10 left-10 right-10">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                                        <div className="text-white font-black text-2xl tracking-tighter italic">Your Degree of Awesomeness.</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Steps Right */}
                        <div className="lg:col-span-7 space-y-6">
                            {steps.map((step, i) => (
                                <motion.div 
                                    key={step.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex gap-6 p-6 md:p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all cursor-default"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 shrink-0 self-start group-hover:scale-110 transition-transform">
                                        <CheckCircle2 size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className={`text-xl font-black ${step.color} tracking-tight`}>{step.title}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="mt-20 flex flex-col md:flex-row items-center justify-center gap-4"
                    >
                        <a href="tel:7090778035" className="flex items-center gap-4 bg-white border-2 border-slate-100 px-8 py-5 rounded-2xl shadow-lg hover:border-primary/20 transition-all">
                            <Phone className="text-primary" />
                            <span className="text-xl font-black text-secondary">7090778035</span>
                        </a>
                        <button 
                            onClick={() => setIsApplyOpen(true)}
                            className="bg-primary hover:bg-primary/90 text-white font-black px-12 py-5 rounded-2xl text-xl shadow-xl shadow-primary/30 flex items-center gap-3 active:scale-95 transition-all"
                        >
                            <span className="flex items-center gap-3">
                                <Zap size={24} className="fill-white" /> Apply Now
                            </span>
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
