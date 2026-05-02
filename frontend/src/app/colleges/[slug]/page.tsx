import { Metadata } from 'next'
import CollegeDetailView from '@/components/college/CollegeDetailView'
import Link from 'next/link'
import { API_URL } from '@/lib/api'

export const dynamic = 'force-dynamic'

async function getCollege(slug: string) {
    try {
        const url = `${API_URL}/colleges/${slug}`;
        const res = await fetch(url, {
            cache: 'no-store'
        })
        if (!res.ok) {
            return { _error: true, status: res.status, url: url, text: await res.text() }
        }
        return res.json()
    } catch (err: any) {
        return { _error: true, status: 500, url: `${API_URL}/colleges/${slug}`, text: err.message }
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const college = await getCollege(params.slug)
    
    if (!college || college._error) {
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

    if (!college || college._error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 p-4 text-center">
                <h2 className="text-4xl font-black text-secondary uppercase tracking-tighter italic">404 - College Not Found</h2>
                {college?._error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm max-w-2xl break-all">
                        <strong>Debug Info (Admin Only):</strong><br/>
                        Status: {college.status}<br/>
                        URL: {college.url}<br/>
                        Response: {college.text}
                    </div>
                )}
                <Link href="/" className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Back to Discovery
                </Link>
            </div>
        )
    }

    return <CollegeDetailView college={college} />
}
