import { Metadata } from 'next'
import CollegeDetailView from '@/components/college/CollegeDetailView'
import Link from 'next/link'
import { API_URL } from '@/lib/api'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

// Validate slug before ever hitting the API
function isValidSlug(slug: string): boolean {
    if (!slug) return false
    if (slug === 'undefined' || slug === 'null') return false
    // Allow UUIDs even if they are long
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
    if (isUUID) return true
    
    if (slug.startsWith('http')) return false
    if (slug.startsWith('www')) return false
    if (slug.length > 200) return false
    return true
}

async function getCollege(slug: string) {
    // Guard: never call the API with a bad slug
    if (!isValidSlug(slug)) {
        console.error('Invalid slug blocked:', slug)
        return null
    }
    try {
        const url = `${API_URL}/colleges/${encodeURIComponent(slug)}`
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) {
            const errorText = await res.text()
            console.error('API Fetch Failed:', { url, status: res.status, errorText })
            return null
        }
        return res.json()
    } catch (err) {
        console.error('Fetch exception:', err)
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
    const rawSlug = params.slug
    const isValid = isValidSlug(rawSlug)
    const college = await getCollege(rawSlug)

    if (!college) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 p-4 text-center">
                <div className="text-6xl">🎓</div>
                <h1 className="text-3xl font-black text-slate-800">College Not Found</h1>
                
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full text-left space-y-4">
                    <p className="text-slate-600 font-medium">
                        We couldn&apos;t find a college matching this link.
                    </p>
                    
                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 font-mono text-xs border border-slate-100">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Requested Slug:</span>
                            <span className="font-bold text-red-600">&quot;{rawSlug || 'EMPTY'}&quot;</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Path:</span>
                            <span className="font-bold text-slate-800">/colleges/{rawSlug || 'EMPTY'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Validation:</span>
                            <span className={isValid ? "text-emerald-600 font-bold" : "text-red-600 font-bold"}>
                                {isValid ? "Passed" : "Blocked by Security"}
                            </span>
                        </div>
                    </div>

                    <p className="text-sm text-slate-400 italic">
                        Tip: If the requested slug looks like &quot;undefined&quot; or is empty, please clear your browser cache or hard-refresh the home page.
                    </p>
                </div>

                <Link href="/" className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Back to All Colleges
                </Link>
            </div>
        )
    }

    return <CollegeDetailView college={college} />
}

