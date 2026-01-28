'use strict';
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

export default function ReadinessCheckPage() {
    const params = useParams()
    // Assuming this page is /learn/[courseId]/readiness
    // Need to extract courseId from URL if nested, or props if component.
    // Next.js params usually bubble up if inside the folder structure.
    // But if this is a generic page, we need query param.
    // Let's assume it's /learn/[courseId]/post-test-check/page.tsx
    const courseId = params.courseId as string

    const [loading, setLoading] = useState(true)
    const [ready, setReady] = useState(false)
    const [avgScore, setAvgScore] = useState(0)
    const [weakCategories, setWeakCategories] = useState<string[]>([])

    useEffect(() => {
        async function checkReadiness() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch all quiz scores for this user related to this course?
            // Our user_scores table links to quiz_id. Quizzes link to lessons. Lessons link to course. A bit deep.
            // For prototype, we fetch all user_scores and filter.

            // 1. Get Quizzes for this Course
            const { data: lessons } = await supabase
                .from('lessons')
                .select('id')
                .eq('course_id', courseId)

            const lessonIds = lessons?.map(l => l.id) || []

            const { data: quizzes } = await supabase
                .from('quizzes')
                .select('id')
                .in('related_lesson_id', lessonIds)

            const quizIds = quizzes?.map(q => q.id) || []

            // 2. Get User Scores
            if (quizIds.length > 0) {
                const { data: scores } = await supabase
                    .from('user_scores')
                    .select('score, category_scores')
                    .eq('user_id', user.id)
                    .in('quiz_id', quizIds)

                if (scores && scores.length > 0) {
                    // Calculate Average
                    const total = scores.reduce((sum, s) => sum + s.score, 0)
                    const avg = Math.round(total / scores.length)
                    setAvgScore(avg)

                    // Analyze Categories
                    // Aggregate all category scores
                    // For simplicity, just use the global average.
                    // If Avg > 70%, Ready.
                    if (avg >= 70) {
                        setReady(true)
                    } else {
                        setWeakCategories(['General Review Needed'])
                    }
                }
            }

            setLoading(false)
        }

        checkReadiness()
    }, [courseId])

    if (loading) return <div className="p-12 text-center">Analyzing Readiness...</div>

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Post-test Readiness</h1>
                <p className="text-gray-500">Are you prepared for the final certification?</p>
            </div>

            <div className={`p-8 rounded-2xl border-2 text-center ${ready ? 'border-green-100 bg-green-50' : 'border-amber-100 bg-amber-50'}`}>
                <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full mb-4 ${ready ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                    {ready ? <CheckCircle className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
                </div>

                <h2 className="text-2xl font-bold mb-2">
                    {ready ? 'You are Ready!' : 'Review Recommended'}
                </h2>

                <p className="text-lg font-medium mb-4">
                    Readiness Score: <span className={ready ? 'text-green-600' : 'text-amber-600'}>{avgScore}%</span>
                </p>

                {!ready && (
                    <div className="text-sm text-gray-600 mb-6 bg-white p-4 rounded-lg mx-auto max-w-sm">
                        Based on your quiz performance, we recommend reviewing previous lessons to improve your score before taking the final exam.
                    </div>
                )}

                <div className="flex justify-center gap-4">
                    {ready ? (
                        <Link
                            href={`/learn/${courseId}/post-test`} // Assuming post-test route
                            className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                        >
                            Start Post-test
                        </Link>
                    ) : (
                        <Link
                            href={`/learn/${courseId}`}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                        >
                            Back to Lessons
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
