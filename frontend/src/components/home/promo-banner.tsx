'use client'

import { Mail, ArrowRight, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PromoBannerProps {
    type: 'fair' | 'alert' | 'utility'
    title: string
    subtitle: string
    ctaText: string
    bgImage?: string
    className?: string
}

export default function PromoBanner({ type, title, subtitle, ctaText, bgImage, className }: PromoBannerProps) {
    const configs = {
        fair: {
            bg: 'bg-orange-600',
            icon: Target,
            decoration: 'bg-white/10'
        },
        alert: {
            bg: 'bg-secondary',
            icon: Mail,
            decoration: 'bg-white/5'
        },
        utility: {
            bg: 'bg-accent-foreground',
            icon: Zap,
            decoration: 'bg-white/10'
        }
    }

    const config = configs[type]
    const Icon = config.icon

    return (
        <div className={cn("container mx-auto px-4 my-20 block relative z-10", className)}>
            <div 
                className={cn(
                    "relative rounded-[2.5rem] p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-black/10 shadow-2xl",
                    config.bg
                )}
            >
                {/* Background Image Overlay */}
                {bgImage && (
                    <div className="absolute inset-0 z-0">
                        <img src={bgImage} alt="Background" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                    </div>
                )}
                {/* Decoration Circles */}
                <div className={cn("absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl", config.decoration)} />
                <div className={cn("absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl", config.decoration)} />

                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                        <Icon size={32} />
                    </div>
                    <div className="text-white">
                        <h2 className="text-3xl font-black tracking-tight">{title}</h2>
                        <p className="text-white/80 font-medium text-lg mt-1">{subtitle}</p>
                    </div>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 relative z-10">
                    {type === 'alert' && (
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="w-full md:w-64 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 outline-none focus:bg-white/20"
                        />
                    )}
                    <button className={cn(
                        "w-full sm:w-auto px-10 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all hover:gap-4 active:scale-95",
                        type === 'fair' ? "bg-white text-primary" : "bg-primary text-white"
                    )}>
                        {ctaText} <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}
