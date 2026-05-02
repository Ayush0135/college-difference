'use client'

import Link from 'next/link'
import { GraduationCap, MapPin, Phone, Mail, Globe, MessageSquare, Share2, ArrowRight } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white pt-16 pb-8 overflow-hidden relative">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <GraduationCap size={28} className="text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter italic">Degree <span className="text-primary">Difference</span></span>
                        </div>
                        <p className="text-white/60 font-medium leading-relaxed">
                            India's leading institutional intelligence platform, designed to bridge the gap between student aspirations and top-tier academic excellence. We provide data-dense insights to help you make informed decisions about your professional future.
                        </p>
                        <div className="flex gap-4">
                            {[Globe, Share2, MessageSquare, Mail].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all group">
                                    <Icon size={18} className="text-white group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Discovery */}
                    <div>
                        <h4 className="text-lg font-black mb-8 italic uppercase tracking-widest text-primary">Discovery Hub</h4>
                        <ul className="space-y-4">
                            {['Top 100 Engineering', 'Best Management Hubs', 'Medical Excellence', 'Commerce & Finance', 'Integrated Law'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-white/60 hover:text-white hover:translate-x-2 transition-all inline-block font-bold">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Regional Centers */}
                    <div>
                        <h4 className="text-lg font-black mb-8 italic uppercase tracking-widest text-primary">Priority Cities</h4>
                        <ul className="space-y-4">
                            {['Delhi NCR Hub', 'Bengaluru Tech', 'Mumbai Financial', 'Pune Oxford East', 'Hyderabad Innovation'].map(item => (
                                <li key={item}>
                                    <Link href="#" className="text-white/60 hover:text-white hover:translate-x-2 transition-all inline-block font-bold">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Intelligence */}
                    <div>
                        <h4 className="text-lg font-black mb-8 italic uppercase tracking-widest text-primary">Global Connect</h4>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <MapPin size={20} className="text-primary" />
                                </div>
                                <span className="text-white/60 font-bold text-sm leading-relaxed">
                                    Institutional Plaza, Sector 62,<br />Noida, Uttar Pradesh 201301
                                </span>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <Phone size={20} className="text-primary" />
                                </div>
                                <span className="text-white/60 font-bold text-sm leading-loose">
                                    +91 9334089523
                                </span>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <Mail size={20} className="text-primary" />
                                </div>
                                <span className="text-white/60 font-bold text-sm">
                                    support@degreedifference.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Terms and Conditions Section */}
                <div className="border-t border-white/5 pt-12 mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-white/40 text-xs font-medium leading-relaxed">
                        <div className="space-y-4">
                            <h5 className="text-white/60 font-black uppercase tracking-widest text-[10px]">Terms of Service & Usage</h5>
                            <p>
                                By accessing the Degree Difference platform, you agree to be bound by these institutional terms and conditions. The information provided on this platform, including university rankings, placement statistics, and residential fees, is curated from verified institutional records and official disclosures. We make every effort to ensure factual accuracy; however, total accuracy is not guaranteed due to third-party reporting variations.
                            </p>
                            <p>
                                The platform acts as a discovery intelligence service and does not guarantee admission to any affiliated institution. All applications are subject to the specific eligibility criteria and internal selection processes of the respective universities. Degree Difference is not responsible for any selection outcomes or data discrepancies in external university portals.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-white/60 font-black uppercase tracking-widest text-[10px]">Privacy & Data Intelligence</h5>
                            <p>
                                We value your professional data integrity. Information submitted through our inquiry or application forms is shared exclusively with certified academic counselors and our partner institutional departments for the sole purpose of admission facilitation. We do not sell student contact intelligence to unspecified third-party marketing entities.
                            </p>
                            <p>
                                All intellectual property, including layout designs, data visualizations, and proprietary counseling algorithms, remains the sole property of Degree Difference. Unauthorized scraping or replication of the institutional registry is strictly prohibited under digital commerce regulations.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/30 text-xs font-bold">
                        &copy; {new Date().getFullYear()} Degree Difference Institutional Intelligence. All Rights Reserved.
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/30">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/cookies" className="hover:text-primary transition-colors">Digital Cookies</Link>
                        <Link href="/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</Link>
                        <Link href="/admin" className="hover:text-primary transition-colors">Admin Sign-in</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
