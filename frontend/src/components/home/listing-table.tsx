'use client'

import { Star, ArrowUpRight, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const colleges = [
    { rank: 1, name: 'IIT Madras', logo: 'IITM', agency: 'NIRF', cutoff: '99.5', deadline: 'June 15', fees: '8.5L' },
    { rank: 2, name: 'IIT Delhi', logo: 'IITD', agency: 'NIRF', cutoff: '99.2', deadline: 'June 18', fees: '9.2L' },
    { rank: 3, name: 'BITS Pilani', logo: 'BITS', agency: 'THE', cutoff: '98.5', deadline: 'May 30', fees: '22L' },
    { rank: 4, name: 'VIT Vellore', logo: 'VIT', agency: 'QS', cutoff: '95.0', deadline: 'May 20', fees: '7.8L' },
]

export default function ListingTable() {
    return (
        <section className="py-24 bg-accent/20">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-black text-secondary">Top 10 Engineering <span className="text-primary italic">Colleges</span></h2>
                        <p className="text-muted-foreground mt-2">Verified rankings and real-time admission deadlines.</p>
                    </div>
                    <button className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        View All <ArrowUpRight size={20} />
                    </button>
                </div>

                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-secondary text-white">
                                    <th className="px-8 py-6 text-left font-bold uppercase tracking-wider text-sm">Rank</th>
                                    <th className="px-8 py-6 text-left font-bold uppercase tracking-wider text-sm">College</th>
                                    <th className="px-8 py-6 text-left font-bold uppercase tracking-wider text-sm">Agency</th>
                                    <th className="px-8 py-6 text-left font-bold uppercase tracking-wider text-sm">Cutoff</th>
                                    <th className="px-8 py-6 text-left font-bold uppercase tracking-wider text-sm">App Deadline</th>
                                    <th className="px-8 py-6 text-left font-bold uppercase tracking-wider text-sm">Total Fees</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {colleges.map((college, i) => (
                                    <motion.tr 
                                        key={college.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="hover:bg-accent/10 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Trophy size={18} className={cn(i < 3 ? "text-yellow-500" : "text-slate-300")} />
                                                <span className="font-black text-xl text-secondary">{college.rank}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center font-black text-primary border border-border group-hover:bg-primary group-hover:text-white transition-all">
                                                    {college.logo}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-secondary text-lg">{college.name}</div>
                                                    <div className="flex items-center gap-1 text-accent-foreground text-xs font-bold bg-accent/50 w-fit px-2 py-0.5 rounded">
                                                        <Star size={10} className="fill-accent-foreground" /> Verified
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-muted-foreground">{college.agency}</td>
                                        <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-secondary">{college.cutoff}%</td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-sm font-medium text-secondary">{college.deadline}</div>
                                            <div className="text-[10px] text-red-500 font-bold uppercase">Hurry, Ends Soon!</div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-black text-secondary text-lg">₹{college.fees}</span>
                                                <span className="text-[10px] text-muted-foreground font-bold italic">Avg Package ₹12L</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}
