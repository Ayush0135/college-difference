import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = 'https://degreedifference.com'
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://degree-difference-api.pathakayush715.workers.dev'
    
    // Fetch colleges with a timeout and fallback
    let collegeLinks = ''
    try {
        const res = await fetch(`${backendUrl}/colleges`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(5000)
        })
        
        if (res.ok) {
            const colleges = await res.json()
            if (Array.isArray(colleges)) {
                collegeLinks = colleges.map((c: any) => `
    <url>
        <loc>${baseUrl}/colleges/${c.slug}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')
            }
        }
    } catch (err) {
        console.error("Manual Sitemap Error:", err)
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/cookies</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.3</priority>
    </url>${collegeLinks}
</urlset>`

    return new NextResponse(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
    })
}
