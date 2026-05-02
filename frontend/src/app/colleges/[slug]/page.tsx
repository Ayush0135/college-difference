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
    if (params.slug === "undefined") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-red-50 p-8 text-center">
                <h2 className="text-4xl font-black text-red-600 uppercase tracking-tighter italic">Browser Cache Issue Detected</h2>
                <p className="text-xl text-red-800 font-bold max-w-2xl">
                    Your browser is using an old, cached version of the Admin Panel that contains a known routing bug. 
                </p>
                <div className="bg-white text-slate-800 p-6 rounded-xl shadow-xl border border-red-200 max-w-2xl text-left space-y-4">
                    <p><strong>To fix this immediately:</strong></p>
                    <ol className="list-decimal pl-5 space-y-2 font-medium">
                        <li>Go back to your Admin Panel tab.</li>
                        <li><strong>HARD REFRESH the page</strong> (Press <kbd className="bg-slate-100 px-2 rounded border">Cmd + Shift + R</kbd> on Mac or <kbd className="bg-slate-100 px-2 rounded border">Ctrl + F5</kbd> on Windows).</li>
                        <li>Add the college again.</li>
                    </ol>
                    <p className="text-sm text-slate-500 italic mt-4">The bug has already been fixed on the server, but your browser hasn't downloaded the new code yet.</p>
                </div>
            </div>
        )
    }

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
