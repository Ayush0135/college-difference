import { Metadata } from 'next'
import CollegeDetailView from '@/components/college/CollegeDetailView'
import Link from 'next/link'
import { API_URL } from '@/lib/api'

async function getCollege(slug: string) {
    try {
        const res = await fetch(`${API_URL}/colleges/${slug}`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        })
        if (!res.ok) return null
        return res.json()
    } catch (err) {
        console.error("SEO Fetch Error:", err)
        return null
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const college = await getCollege(params.slug)
    
    if (!college) {
        return {
            title: "College Not Found | Degree Difference",
        }
    }

    const title = `${college.name} 2024: Fees, Placement, Ranking & Reviews`
    const description = college.description?.substring(0, 160) || `Get detailed information about ${college.name} fee structure, placement records, ranking and student reviews on Degree Difference.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [college.image || college.bg_image || "https://degreedifference.com/og-image.jpg"],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [college.image || college.bg_image || "https://degreedifference.com/og-image.jpg"],
        },
    }
}

export default async function CollegeDetailPage({ params }: { params: { slug: string } }) {
    const college = await getCollege(params.slug)

    if (!college) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50">
                <h2 className="text-4xl font-black text-secondary uppercase tracking-tighter italic">404 - College Not Found</h2>
                <Link href="/" className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Back to Discovery
                </Link>
            </div>
        )
    }

    return <CollegeDetailView college={college} />
}
