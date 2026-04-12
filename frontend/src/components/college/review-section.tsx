'use client'

import { Star, ThumbsUp, ThumbsDown, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ReviewCardProps {
    user: string
    rating: number
    pros: string[]
    cons: string[]
    comment: string
    isVerified: boolean
}

const SentimentBar = ({ label, percentage, color }: { label: string, percentage: number, color: string }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">{label}</span>
            <span className="font-bold">{percentage}%</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${percentage}%` }}
                className={cn("h-full rounded-full", color)}
            />
        </div>
    </div>
)

export default function ReviewSection({ reviews }: { reviews: ReviewCardProps[] }) {
    return (
        <section className="py-12 px-6">
            <h2 className="text-3xl font-bold mb-8 text-secondary">Student Reviews & Sentiment</h2>
            
            <div className="grid md:grid-cols-12 gap-12">
                {/* Left: Sentiment Analysis */}
                <div className="md:col-span-4 space-y-8 bg-card p-6 rounded-2xl border border-border shadow-sm h-fit sticky top-24">
                    <div className="text-center pb-6 border-b border-border">
                        <div className="text-5xl font-bold text-secondary mb-2">4.2</div>
                        <div className="flex justify-center gap-1 mb-2">
                            {[1, 2, 3, 4].map(i => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
                            <Star size={20} className="text-muted fill-muted" />
                        </div>
                        <p className="text-sm text-muted-foreground">Based on 124 students reviews</p>
                    </div>

                    <div className="space-y-6">
                        <SentimentBar label="Infrastructure" percentage={85} color="bg-blue-500" />
                        <SentimentBar label="Placements" percentage={78} color="bg-green-500" />
                        <SentimentBar label="Faculty" percentage={92} color="bg-purple-500" />
                        <SentimentBar label="Campus Life" percentage={88} color="bg-orange-500" />
                    </div>
                </div>

                {/* Right: Individual Cards */}
                <div className="md:col-span-8 space-y-6">
                    {reviews.map((review, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 transition-all shadow-sm group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center">
                                        <User className="text-secondary" size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-secondary">{review.user}</div>
                                        <div className="text-xs text-muted-foreground">B.Tech Student • 2 days ago</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded text-yellow-700 font-bold text-sm">
                                    <Star size={14} className="fill-yellow-700" /> {review.rating}
                                </div>
                            </div>

                            <p className="text-slate-600 mb-6 italic leading-relaxed">
                                "{review.comment}"
                            </p>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm uppercase tracking-wider">
                                        <ThumbsUp size={16} /> Pros
                                    </div>
                                    <ul className="space-y-2">
                                        {review.pros.map((p, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex gap-2">
                                                <span className="text-green-500 font-bold">•</span> {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-red-600 font-bold text-sm uppercase tracking-wider">
                                        <ThumbsDown size={16} /> Cons
                                    </div>
                                    <ul className="space-y-2">
                                        {review.cons.map((c, i) => (
                                            <li key={i} className="text-sm text-slate-600 flex gap-2">
                                                <span className="text-red-500 font-bold">•</span> {c}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
