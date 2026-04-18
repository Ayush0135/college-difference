'use client'

import Hero from "@/components/home/hero"
import FeaturesSection from "@/components/home/features-section"
import PromoBanner from "@/components/home/promo-banner"
import ListingTable from "@/components/home/listing-table"
import ExploreSection from "@/components/home/explore-section"
import StepBanner from "@/components/home/step-banner"
import TestimonialSection from "@/components/home/testimonial-section"
import CounsellingSection from "@/components/home/counselling-section"
import Footer from "@/components/layout/Footer"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function HomeContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { openAuthModal } = useAuth()
    const [activeCategory, setActiveCategory] = useState(searchParams.get('goal') || 'Engineering')
    const [globalSearch, setGlobalSearch] = useState('')
    const resultsRef = useRef<HTMLDivElement>(null)

    const updateUrl = (goal: string, city?: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (goal) params.set('goal', goal)
        if (city) params.set('city', city)
        router.push(`/?${params.toString()}`, { scroll: false })
    }

    const handleGoalSelect = (goal: string) => {
        setActiveCategory(goal)
        updateUrl(goal, searchParams.get('city') || undefined)
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleCitySelect = (city: string) => {
        updateUrl(activeCategory, city)
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSearchChange = (search: string) => {
        setGlobalSearch(search)
        // Removed scroll to results to keep user in hero area
    }



    return (
        <main className="flex min-h-screen flex-col bg-slate-50">
            <Hero 
                onGoalSelect={handleGoalSelect} 
                onCitySelect={handleCitySelect}
                onSearchChange={handleSearchChange}
            />
            
            <div ref={resultsRef}>
                <ListingTable 
                    initialCategory={activeCategory} 
                    externalSearch={globalSearch}
                />
            </div>

            <StepBanner />
            
            <FeaturesSection />

            <CounsellingSection />

            <div className="py-24">
                <TestimonialSection />
            </div>

            <Footer />
            
            {/* Floating Need Counselling fixed in Hero but helper for auth */}
            <button 
                onClick={openAuthModal}
                className="hidden" // Handled by hero components
            >
                Login
            </button>
        </main>
    )
}

export default function Home() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>}>
            <HomeContent />
        </Suspense>
    )
}
