
import Link from 'next/link'
import { ArrowRight, Shield, BookOpen, Brain, TrendingUp } from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-900 selection:text-white flex flex-col font-sans">

            {/* Navbar / minimal header */}
            <header className="px-6 py-6 flex justify-between items-center max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="h-6 w-6 bg-gray-900 rounded-sm flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                    LMS AI
                </div>
                <nav className="flex gap-6 text-sm font-medium text-gray-500">
                    <Link href="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
                    <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
                <div className="space-y-6 max-w-2xl">
                    <div className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600 mb-4">
                        <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                        v1.0 Public Beta
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter text-gray-900">
                        Learn smarter,<br /> not harder.
                    </h1>

                    <p className="text-xl text-gray-500 max-w-lg mx-auto leading-relaxed">
                        An adaptive intelligence platform that identifies your skill gaps and tailors a curriculum just for you.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/onboarding"
                            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Start Analysis <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-8 py-3 bg-white border border-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                            Student Portal
                        </Link>
                    </div>
                </div>

                {/* Feature Grid - Minimal */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-4">
                    <FeatureCard
                        icon={<Brain className="h-6 w-6" />}
                        title="Skill Gap Analysis"
                        desc="Our AI evaluates your pre-test performance to pinpoint exactly what you need to learn."
                    />
                    <FeatureCard
                        icon={<TrendingUp className="h-6 w-6" />}
                        title="Adaptive Curriculum"
                        desc="No wasted time. Get recommended courses that directly address your weaknesses."
                    />
                    <FeatureCard
                        icon={<Shield className="h-6 w-6" />}
                        title="Verified Progression"
                        desc="Unlock new levels only when you've mastered the content through video & quiz checks."
                    />
                </div>
            </main>

            {/* Admin Link Footer */}
            <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100 mt-20">
                <p>&copy; 2026 LMS Adaptive Intelligence.</p>
                <Link href="/admin" className="mt-2 text-xs hover:text-gray-600 transition-colors inline-flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Admin Access
                </Link>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-left hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-300">
            <div className="h-10 w-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-gray-900 mb-4 shadow-sm">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    )
}
