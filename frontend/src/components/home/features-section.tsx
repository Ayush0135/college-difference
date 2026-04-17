'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
    MousePointer2, 
    ClipboardList, 
    LayoutDashboard, 
    Headphones, 
    Timer, 
    Medal,
    ArrowRight,
    MonitorPlay,
    ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import StudyApplicationModal from './StudyApplicationModal'

const features = [
    {
        title: "Get Your Career Match",
        desc: "Take our free career compass personality quiz and get top career options for you.",
        icon: MousePointer2
    },
    {
        title: "Apply With One Form",
        desc: "One platform to apply to 2000+ esteemed colleges.",
        icon: ClipboardList
    },
    {
        title: "Track applications in one place",
        desc: "Apply to and manage all college applications through My Profile.",
        icon: LayoutDashboard
    },
    {
        title: "Talk to Admission Experts",
        desc: "Get free personalised expert guidance on colleges & courses.",
        icon: Headphones
    },
    {
        title: "Easy Apply in 5 mins",
        desc: "Fill your college applications in 5 minutes or less.",
        icon: Timer
    },
    {
        title: "Get Exciting Rewards",
        desc: "Win amazing rewards and cash-backs while applying.",
        icon: Medal
    }
]

export default function FeaturesSection() {
    const [isAppModalOpen, setIsAppModalOpen] = useState(false)
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#3D52D5] rounded-xl p-8 text-white relative group overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/20 transition-all cursor-pointer"
                        >
                            <div className="relative z-10 flex gap-6">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-3 leading-tight">{f.title}</h3>
                                    <p className="text-white/80 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                    <f.icon className="text-[#3D52D5]" size={32} />
                                </div>
                            </div>
                            
                            {/* Subtle background highlight */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                        </motion.div>
                    ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-24">
                    <button 
                        onClick={() => setIsAppModalOpen(true)}
                        className="bg-[#FFA756] hover:bg-[#FF9436] text-white font-black px-12 py-5 rounded-lg text-lg transition-all shadow-xl shadow-orange-500/20 active:scale-95"
                    >
                        Let's start your application
                    </button>
                    <a 
                        href="tel:9334089523"
                        className="border-2 border-[#FFA756] text-[#FFA756] font-black px-12 py-5 rounded-lg text-lg hover:bg-orange-50 transition-all active:scale-95 flex items-center gap-3"
                    >
                        Talk to a college expert: <span className="underline italic">9334089523</span>
                    </a>
                </div>

                <StudyApplicationModal 
                    isOpen={isAppModalOpen} 
                    onClose={() => setIsAppModalOpen(false)} 
                />

                {/* Bottom Banner */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-[#FFB75E] to-[#ED8F03] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12"
                >
                    {/* Decorative Circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/10 rounded-full translate-y-1/2" />

                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black text-secondary leading-none">
                            Unlock Your <span className="text-white">Future</span> with <br />
                            Online Degrees <br />
                            <span className="text-lg md:text-2xl font-bold opacity-80 mt-4 block">from Top Universities!</span>
                        </h2>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-secondary font-bold">
                                <MonitorPlay className="text-white" size={20} />
                                <span>100% Online | Flexible Learning Schedules</span>
                            </div>
                            <div className="flex items-center gap-3 text-secondary font-bold">
                                <ShieldCheck className="text-white" size={20} />
                                <span>Govt. & UGC Approved Programs</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 w-full md:w-auto">
                        <button className="w-full md:w-auto bg-white text-secondary font-black px-12 py-6 rounded-2xl text-xl shadow-xl hover:shadow-white/20 hover:-translate-y-1 transition-all active:scale-95">
                            Get Free Counselling
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
