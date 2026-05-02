import { Metadata } from 'next'
import CollegeDetailView from '@/components/college/CollegeDetailView'
import Link from 'next/link'
import { API_URL } from '@/lib/api'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

// Validate slug before ever hitting the API
function isValidSlug(slug: string): boolean {
    if (!slug) return false
    if (slug === 'undefined') return false
    if (slug === 'null') return false
    if (slug.startsWith('http')) return false
    if (slug.startsWith('www')) return false
    if (slug.length > 200) return false
    return true
}

async function getCollege(slug: string) {
    // Guard: never call the API with a bad slug
    if (!isValidSlug(slug)) {
        return null
    }
    try {
        const url = `${API_URL}/colleges/${encodeURIComponent(slug)}`
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    if (!isValidSlug(params.slug)) {
        return { title: "College Not Found | Degree Difference" }
    }

    const college = await getCollege(params.slug)
    if (!college) {
        return { title: "College Not Found | Degree Difference" }
    }

    const title = `${college.name} 2024: Fees, Placement, Ranking & Reviews`
    const description = college.description?.substring(0, 160) || `Get detailed information about ${college.name} fee structure, placement records, ranking and student reviews on Degree Difference.`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [college.image || "https://degreedifference.com/og-image.jpg"],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    }
}

export default async function CollegeDetailPage({ params }: { params: { slug: string } }) {
    // Redirect invalid slugs back to home instead of showing 404
    if (!isValidSlug(params.slug)) {
        redirect('/')
    }

    const college = await getCollege(params.slug)

    if (!college) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 p-4 text-center">
                <div className="text-6xl">🎓</div>
                <h1 className="text-3xl font-black text-slate-800">College Not Found</h1>
                <p className="text-slate-500 max-w-md">
                    We couldn&apos;t find a college matching <code className="bg-slate-100 px-2 py-1 rounded text-sm">{params.slug}</code>. 
                    It may have been removed or the link may be incorrect.
                </p>
                <Link href="/" className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Browse All Colleges
                </Link>
            </div>
        )
    }

    return <CollegeDetailView college={college} />
}
