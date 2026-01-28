'use strict';
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Course, UserScore } from '@/types'
import { identifySkillGaps } from '@/lib/intelligence'
import { BookOpen, TrendingUp, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState<string>('Student')
    const [skillGaps, setSkillGaps] = useState<{ category: string, percentage: number }[]>([])
    const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
    const [allCourses, setAllCourses] = useState<Course[]>([])

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                // Redirect to login or handle unauth
                // router.push('/login')
                setLoading(false)
                return
            }

            setUserName(user.email?.split('@')[0] || 'Student')

            // 1. Fetch latest Pre-test score
            const { data: scores } = await supabase
                .from('user_scores')
                .select(`
          *,
          quizzes ( type )
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            // Filter for latest PRE_TEST
            // Note: Relation filtering in Supabase JS client is tricky on deeply nested, 
            // but here we select all user scores and filter in JS for prototype speed. 
            // Alternatively use .eq('quizzes.type', 'PRE_TEST') if inner join filter works (it does if !inner).

            const preTestScore = scores?.find((s: any) => s.quizzes?.type === 'PRE_TEST')

            if (!preTestScore) {
                router.push('/onboarding')
                return
            }

            // 2. Identify Gaps
            const gaps = identifySkillGaps(preTestScore.category_scores)
            setSkillGaps(gaps)

            // 3. Fetch Courses
            const { data: courses } = await supabase
                .from('courses')
                .select('*')

            if (courses) {
                setAllCourses(courses)

                // 4. Recommendation Logic
                // Find courses that have tags matching the lowest scoring categories (bottom 2)
                const weakCategories = gaps.slice(0, 2).map(g => g.category)

                const recommended = courses.filter(course => {
                    if (!course.tags) return false
                    return course.tags.some(tag => weakCategories.includes(tag))
                })

                setRecommendedCourses(recommended)
            }

            setLoading(false)
        }

        init()
    }, [router])

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <div className="text-sm text-gray-500">Welcome, {userName}</div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-8">

                {/* Skill Analysis Summary */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Your Skill Analysis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {skillGaps.map((gap, idx) => (
                            <div key={gap.category} className={`p-4 rounded-xl border ${idx < 2 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-900">{gap.category}</span>
                                    <span className={`text-sm font-bold ${idx < 2 ? 'text-red-600' : 'text-green-600'}`}>
                                        {gap.percentage}%
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${idx < 2 ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${gap.percentage}%` }}
                                    />
                                </div>
                                {idx < 2 && (
                                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> Focus needed
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommendations */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                        Recommended for You
                    </h2>
                    {recommendedCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedCourses.map(course => (
                                <CourseCard key={course.id} course={course} recommended={true} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">Great job! Your skills are balanced. Explore our advanced courses below.</p>
                        </div>
                    )}
                </section>

                {/* All Courses */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">All Courses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allCourses.filter(c => !recommendedCourses.find(r => r.id === c.id)).map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </section>

            </main>
        </div>
    )
}

function CourseCard({ course, recommended = false }: { course: Course, recommended?: boolean }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col ${recommended ? 'border-blue-200 ring-4 ring-blue-50' : 'border-gray-200'}`}>
            <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">
                Course Thumbnail
            </div>
            <div className="p-6 flex-1 flex flex-col">
                {recommended && (
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 mb-2 w-fit">
                        Recommended
                    </span>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-3">
                    {course.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags?.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="font-bold text-gray-900">
                        {course.price > 0 ? `$${course.price}` : 'Free'}
                    </span>
                    <Link
                        href={`/learn/${course.id}`} // We'll implement this viewer later
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Start Learning &rarr;
                    </Link>
                </div>
            </div>
        </div>
    )
}
