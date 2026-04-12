'use client'

import { motion } from 'framer-motion'
import { Award, Target, Users, Zap, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const JourneySteps = [
    { name: 'Register', status: 'completed' },
    { name: 'Select Course', status: 'active' },
    { name: 'Apply', status: 'pending' },
    { name: 'Upload', status: 'pending' },
    { name: 'Payment', status: 'pending' },
    { name: 'Confirmed', status: 'pending' },
]

export default function OutcomeSection() {
    return (
        <section className="py-24 space-y-24 bg-gradient-to-b from-white via-[#F1F8F1] to-white">
            {/* Job-Ready Feature Banner */}
            <div className="container mx-auto px-4">
                <div className="bg-secondary rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-2xl">
                    {/* 3D Polaroid Effect Background */}
                    <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
                        <div className="grid grid-cols-2 gap-4 -rotate-12 translate-x-20">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="aspect-square bg-white rounded-lg shadow-2xl" />
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 max-w-2xl">
                        <motion.span 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-primary font-bold uppercase tracking-widest text-sm"
                        >
                            Outcome Focused
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-8">
                            Degrees that lead to <span className="text-primary">Careers</span>.
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: 'Industry Certifications', icon: Award, desc: 'Curriculum mapped to global industry standards.' },
                                { title: 'Portfolio Building', icon: Target, desc: 'Build real-world projects during your studies.' },
                                { title: 'Corporate Coaching', icon: Users, desc: 'Mentorship from professionals at Fortune 500s.' },
                                { title: 'Guaranteed Internships', icon: Zap, desc: 'Direct corporate bridge for final year students.' }
                            ].map((feature, i) => (
                                <motion.div 
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                                >
                                    <feature.icon className="text-primary mb-3 group-hover:scale-110 transition-transform" size={28} />
                                    <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                                    <p className="text-slate-400 text-sm">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Journey Stepper */}
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-2xl font-bold text-secondary mb-12">Your Journey to Success</h3>
                <div className="max-w-5xl mx-auto relative px-4">
                    {/* Connector Line */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full hidden md:block" />
                    
                    <div className="relative flex justify-between flex-wrap gap-8 md:gap-0">
                        {JourneySteps.map((step, i) => (
                            <motion.div 
                                key={step.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center gap-4 z-10 basis-[45%] md:basis-auto"
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-lg transition-all",
                                    step.status === 'completed' ? "bg-accent-foreground border-accent-foreground text-white" :
                                    step.status === 'active' ? "bg-primary border-primary text-white scale-125 ring-8 ring-primary/10" :
                                    "bg-white border-muted text-muted-foreground"
                                )}>
                                    {step.status === 'completed' ? <CheckCircle2 size={24} /> : <span className="font-bold">{i + 1}</span>}
                                </div>
                                <span className={cn(
                                    "text-sm font-bold tracking-tight",
                                    step.status === 'active' ? "text-primary" : "text-muted-foreground"
                                )}>
                                    {step.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
