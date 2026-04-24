import Link from 'next/link'
import { Cookie, Settings, BarChart3, Target, ArrowLeft } from 'lucide-react'

export default function CookiePolicy() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:gap-3 transition-all">
                    <ArrowLeft size={20} /> Back to Platform
                </Link>
                
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <h1 className="text-5xl md:text-6xl font-black text-secondary tracking-tighter italic mb-8">
                        Cookie <span className="text-primary">Intelligence</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-12 border-b border-slate-100 pb-8">
                        Cookie Policy • Digital Experience Management
                    </p>

                    <div className="space-y-12 text-slate-600 font-medium leading-relaxed">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-secondary">
                                <Cookie className="text-primary" size={24} />
                                <h2 className="text-2xl font-black tracking-tight uppercase">What are Cookies?</h2>
                            </div>
                            <p>
                                Cookies are small data files stored on your device that help us recognize you and remember your preferences. They are the "digital memory" of our platform, ensuring you don't have to re-select your city or goal every time you visit.
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 bg-slate-50 rounded-3xl space-y-4">
                                <Settings className="text-primary" size={28} />
                                <h3 className="text-xl font-black text-secondary">Essential Cookies</h3>
                                <p className="text-sm">Necessary for the platform to function. These allow you to log in, filter colleges, and securely submit applications.</p>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-3xl space-y-4">
                                <BarChart3 className="text-primary" size={28} />
                                <h3 className="text-xl font-black text-secondary">Analytics Intelligence</h3>
                                <p className="text-sm">Help us understand which colleges are most popular so we can refine our data-dense insights.</p>
                            </div>
                        </div>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-secondary">
                                <Target className="text-primary" size={24} />
                                <h2 className="text-2xl font-black tracking-tight uppercase">How to Manage Choices</h2>
                            </div>
                            <p>
                                Most web browsers allow you to control cookies through their settings. However, please note that disabling essential cookies may impact your ability to use high-interaction features like "Easy Apply" or "Location Detection."
                            </p>
                        </section>

                        <div className="pt-12 border-t border-slate-100">
                            <p className="text-sm italic text-slate-400 text-center">
                                By continuing to use Degree Difference, you consent to our use of these digital tools to enhance your institutional discovery experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
