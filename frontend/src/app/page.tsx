'use client'

import Hero from "@/components/home/hero"
import OutcomeSection from "@/components/home/outcome-section"
import PromoBanner from "@/components/home/promo-banner"
import ListingTable from "@/components/home/listing-table"
import ExploreSection from "@/components/home/explore-section"
import ReviewSection from "@/components/college/review-section"
import { useState } from "react"
import AuthModal from "@/components/auth/auth-modal"
import { Search } from "lucide-react"

export default function Home() {
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState('Engineering')
    const [globalSearch, setGlobalSearch] = useState('')

    // Demo reviews data
    const demoReviews = [
        {
            user: "Rahul Sharma",
            rating: 4.5,
            comment: "The campus life is amazing, and the faculty for CSE is top-notch. Competitive environment but very helpful peers.",
            pros: ["Modern Labs", "Industry Connections", "Green Campus"],
            cons: ["Strict Attendance", "Canteen Food"],
            isVerified: true
        }
    ]

    return (
        <main className="flex min-h-screen flex-col bg-slate-50">
            <Hero 
                onGoalSelect={(goal) => setActiveCategory(goal)} 
                onSearchChange={(search) => setGlobalSearch(search)}
            />
            
            <OutcomeSection />

            <PromoBanner 
                type="fair"
                title="Grand Education Fair 2024"
                subtitle="Interact with 50+ Global Universities. Live at Bengaluru."
                ctaText="Register Now"
                bgImage="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=1200"
            />

            <ListingTable 
                initialCategory={activeCategory} 
                externalSearch={globalSearch}
            />

            <PromoBanner 
                type="alert"
                title="JEE Main 2024 Alerts"
                subtitle="Registration for Session 2 is now open. Don't miss the deadline!"
                ctaText="Subscribe"
                className="mt-0"
                bgImage="https://images.unsplash.com/photo-1622323098583-acc258b3833d?auto=format&fit=crop&q=80&w=1200"
            />

            <div className="container mx-auto px-4 py-24">
                <ReviewSection reviews={demoReviews} />
            </div>

            <PromoBanner 
                type="utility"
                title="Search 30k+ Courses"
                subtitle="Find your perfect fit with our advanced search filters."
                ctaText="Try Now"
                bgImage="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200"
            />

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            
            {/* Floating Need Counselling fixed in Hero but helper for auth */}
            <button 
                onClick={() => setIsAuthOpen(true)}
                className="hidden" // Handled by hero components
            >
                Login
            </button>
        </main>
    )
}
