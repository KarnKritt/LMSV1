'use strict';
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Lesson } from '@/types'
import CourseSidebar from '@/components/learn/CourseSidebar'

// Layout usually wraps children. In Next.js App Router, we can fetch here.
// But since we need params.courseId, we can use a client component wrapper or fetch in server component.
// We'll use a Client Component Wrapper for simplicity as "Layout" file in nested route.

export default function LearnLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const params = useParams()
    const courseId = params.courseId as string

    const [lessons, setLessons] = useState<Lesson[]>([])
    const [progress, setProgress] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // 1. Check Enrollment & Expiry
            const { data: enrollment } = await supabase
                .from('enrollments')
                .select('expires_at, status')
                .eq('user_id', user.id)
                .eq('course_id', courseId)
                .single()

            if (!enrollment || enrollment.status !== 'active') {
                // Redirect if no active enrollment
                // alert('Access Denied: No active enrollment')
                // In real app: router.push('/dashboard')
                // For prototype, we just continue or show overlay
            } else if (enrollment.expires_at && new Date(enrollment.expires_at) < new Date()) {
                alert('Your access to this course has expired.')
                // In real app: router.push('/dashboard')
            }

            // 2. Fetch Lessons
            const { data: lessonsData } = await supabase
                .from('lessons')
                .select('*')
                .eq('course_id', courseId)
                .order('order_index', { ascending: true })

            if (lessonsData) setLessons(lessonsData)

            // 2. Fetch Progress (requires new table)
            // We wrap in try catch in case table doesn't exist yet
            try {
                const { data: progressData } = await supabase
                    .from('lesson_progress')
                    .select('lesson_id, is_completed')
                    .eq('user_id', user.id)

                if (progressData) {
                    const progMap: Record<string, boolean> = {}
                    progressData.forEach((p: any) => {
                        if (p.is_completed) progMap[p.lesson_id] = true
                    })
                    setProgress(progMap)
                }
            } catch (e) {
                console.warn('Lesson progress table might missing', e)
            }

            setLoading(false)
        }

        if (courseId) fetchData()
    }, [courseId])

    if (loading) return <div className="h-screen flex items-center justify-center">Loading Course...</div>

    return (
        <div className="flex h-screen bg-white">
            <CourseSidebar courseId={courseId} lessons={lessons} accquiredProgress={progress} />
            <main className="flex-1 overflow-y-auto bg-gray-50">
                {children}
            </main>
        </div>
    )
}
