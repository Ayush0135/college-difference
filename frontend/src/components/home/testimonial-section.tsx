'use client'

import { motion } from 'framer-motion'
import { Quote, Star, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
    {
        name: "Ananya Iyer",
        role: "B.Tech CSE, VIT Vellore",
        image: "/assets/testimonials/student_1.png",
        content: "Degree Difference helped me navigate the complex admission process. The verified reviews gave me the confidence to choose VIT, and I couldn't be happier with the campus life and faculty here.",
        rating: 5,
        target: "Verified Success"
    },
    {
        name: "Rohan Mehra",
        role: "MBA, IIM Bangalore",
        image: "/assets/testimonials/student_2.png",
        content: "The placement data on this platform is unmatched. I was able to compare ROI across multiple top-tier management institutes before making my final decision. Highly recommended for serious aspirants.",
        rating: 5,
        target: "Industry Leader"
    },
    {
        name: "Dr. Priya Sharma",
        role: "MBBS, AIIMS Delhi",
        image: "/assets/testimonials/student_3.png",
        content: "Finding accurate fee structures and admission deadlines was always a struggle until I found Degree Difference. It's essentially the only tool you need for medical college discovery in India.",
        rating: 5,
        target: "Medical Pioneer"
    }
]

export default function TestimonialSection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-xs"
                    >
                        <Star size={14} className="fill-primary" /> Testimonials
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter leading-none">
                        What Students <span className="text-primary italic">Say</span>
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
                        Real stories from students who found their perfect academic fit through our platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all relative"
                        >
                            <Quote className="absolute top-10 right-10 text-primary/10 group-hover:text-primary/20 transition-colors" size={64} />
                            
                            <div className="space-y-8 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-black/10">
                                        <Image src={t.image} alt={t.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-secondary text-lg leading-tight">{t.name}</h4>
                                        <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">{t.role}</p>
                                    </div>
                                </div>

                                <p className="text-slate-600 font-medium leading-relaxed italic">
                                    "{t.content}"
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-200/50">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        <CheckCircle2 size={12} /> {t.target}
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            
            {/* Background Blob Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-0 pointer-events-none" />
        </section>
    )
}
