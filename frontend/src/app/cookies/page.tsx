import Link from 'next/link'

export default function CookiePolicy() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8 transition-all">
                    ← Back to Platform
                </Link>
                
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl border border-slate-100">
                    <h1 className="text-5xl md:text-6xl font-black text-secondary tracking-tighter italic mb-8">
                        Cookie <span className="text-primary">Intelligence</span>
                    </h1>
                    
                    <div className="space-y-12 text-slate-600 font-medium leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-secondary uppercase">Cookie Usage</h2>
                            <p>Cookies help us recognize you and remember your preferences like city and study goals.</p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    )
}
