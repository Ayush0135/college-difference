import Link from 'next/link'
import { Shield, Lock, Eye, Trash2, ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:gap-3 transition-all">
                    <ArrowLeft size={20} /> Back to Platform
                </Link>
                
                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <h1 className="text-5xl md:text-6xl font-black text-secondary tracking-tighter italic mb-8">
                        Privacy <span className="text-primary">Policy</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-12 border-b border-slate-100 pb-8">
                        Last Updated: April 2024 • Institutional Version 1.2
                    </p>

                    <div className="space-y-12 text-slate-600 font-medium leading-relaxed">
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-secondary">
                                <Shield className="text-primary" size={24} />
                                <h2 className="text-2xl font-black tracking-tight uppercase">Data Intelligence Commitment</h2>
                            </div>
                            <p>
                                At Degree Difference, we treat your academic and personal information with the highest degree of institutional integrity. This policy outlines how we collect, process, and secure your data when you use our discovery platform.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-secondary">
                                <Eye className="text-primary" size={24} />
                                <h2 className="text-2xl font-black tracking-tight uppercase">Information We Collect</h2>
                            </div>
                            <p>
                                We collect information that facilitates your academic journey, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Identity Data:</strong> Name, email address, and phone number provided via inquiry forms.</li>
                                <li><strong>Academic Intent:</strong> Your preferred study goals, interesting colleges, and target cities.</li>
                                <li><strong>Technical Intelligence:</strong> IP address, browser type, and location data (if permitted) to personalize your experience.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-secondary">
                                <Lock className="text-primary" size={24} />
                                <h2 className="text-2xl font-black tracking-tight uppercase">How We Use Your Data</h2>
                            </div>
                            <p>
                                Your information is used strictly for:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Connecting you with certified academic counselors.</li>
                                <li>Facilitating direct communication with partner universities.</li>
                                <li>Improving our discovery algorithms to show you more relevant institutions.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-secondary">
                                <Trash2 className="text-primary" size={24} />
                                <h2 className="text-2xl font-black tracking-tight uppercase">Your Data Rights</h2>
                            </div>
                            <p>
                                You retain full ownership of your digital footprint. You have the right to request a copy of your stored data or ask for the permanent deletion of your inquiry records at any time by contacting our support intelligence team.
                            </p>
                        </section>

                        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row gap-8 justify-between items-center">
                            <p className="text-sm font-bold text-slate-400">
                                Questions? <span className="text-secondary">privacy@degreedifference.com</span>
                            </p>
                            <img src="/api/placeholder/100/40" alt="Certified Secure" className="grayscale opacity-50" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
