import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://degreedifference.com'

  // Fetch all colleges to generate dynamic links for search engines
  let collegeUrls: any[] = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/colleges`)
    const colleges = await res.json()
    if (Array.isArray(colleges)) {
        collegeUrls = colleges.map((c: any) => ({
            url: `${baseUrl}/colleges/${c.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        }))
    }
  } catch (err) {
    console.error("Sitemap generation error:", err)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...collegeUrls,
  ]
}
