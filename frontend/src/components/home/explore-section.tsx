'use client'

import { motion } from 'framer-motion'
import { ArrowRight, MapPin, GraduationCap, Building2 } from 'lucide-react'
import Image from 'next/image'

const collections = [
    {
        title: "Study in Delhi NCR",
        count: "850+ Colleges",
        image: "https://images.unsplash.com/photo-1587474260584-1f35a7a89781?auto=format&fit=crop&q=80&w=600",
        type: "city"
    },
    {
        title: "Top Placement MBA",
        count: "120+ Programs",
        image: "https://images.unsplash.com/photo-1507679799987-c7377ec486b6?auto=format&fit=crop&q=80&w=600",
        type: "goal"
    },
    {
        title: "Study in Bengaluru",
        count: "640+ Colleges",
        image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=600",
        type: "city"
    },
    {
        title: "Best ROI Engineering",
        count: "310+ Colleges",
        image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600",
        type: "goal"
    }
]

export default function ExploreSection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-3 text-primary font-black uppercase tracking-widest text-xs">
                            <ArrowRight size={14} /> Exploration Hub
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-secondary tracking-tighter leading-tight">
                            Explore <span className="italic text-primary">Trending</span> <br />Collections
                        </h2>
                        <p className="text-muted-foreground mt-4 text-lg font-medium">
                            Discover colleges curated by city, ROI, and placement records to help you make an informed choice.
                        </p>
                    </div>
                    <button className="text-secondary font-black flex items-center gap-3 group border-b-2 border-secondary pb-1 hover:text-primary hover:border-primary transition-all">
                        View All Collections <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {collections.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                            className="group relative h-[400px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl"
                        >
                            {/* Background Image */}
                            <img 
                                src={item.image} 
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Glass Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            
                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-center gap-2">
                                        {item.type === 'city' ? (
                                            <MapPin size={16} className="text-primary fill-primary/20" />
                                        ) : (
                                            <GraduationCap size={16} className="text-primary fill-primary/20" />
                                        )}
                                        <span className="text-white/70 text-xs font-black uppercase tracking-[0.2em]">
                                            {item.type === 'city' ? 'Location' : 'Academic Focus'}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white leading-none tracking-tight">
                                        {item.title}
                                    </h3>
                                    <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delayed-100">
                                        <span className="text-white/60 text-sm font-bold">{item.count}</span>
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/40 scale-0 group-hover:scale-100 transition-transform duration-300">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Secondary stats or mini-categories */}
                <div className="mt-20 flex flex-wrap justify-between items-center p-12 bg-slate-50 rounded-[3rem] border border-slate-100">
                    <div className="flex items-center gap-6 mb-8 lg:mb-0">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                            <Building2 size={32} />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-secondary">30,000+ Colleges</div>
                            <div className="text-sm text-muted-foreground font-bold">Verified Database In India</div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {['Exam Prep', 'Counselling', 'Fee Waiver', 'Campus View'].map((tag) => (
                            <span 
                                key={tag}
                                className="px-6 py-3 rounded-full bg-white border border-slate-200 text-secondary text-sm font-black hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer shadow-sm"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
