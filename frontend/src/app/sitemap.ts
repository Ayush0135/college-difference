import { MetadataRoute } from 'next'
import { API_URL } from '@/lib/api'

// Force dynamic so it doesn't cache stale data
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://degreedifference.com'
    
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/cookies`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        }
    ]

    let dynamicRoutes: MetadataRoute.Sitemap = []

    try {
        const res = await fetch(`${API_URL}/colleges`, {
            cache: 'no-store' // Never cache this fetch
        })
        
        if (res.ok) {
            const colleges = await res.json()
            if (Array.isArray(colleges)) {
                dynamicRoutes = colleges.map((c: any) => ({
                    url: `${baseUrl}/colleges/${c.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.8,
                }))
            }
        }
    } catch (err) {
        console.error("Sitemap Fetch Error:", err)
    }

    return [...staticRoutes, ...dynamicRoutes]
}
