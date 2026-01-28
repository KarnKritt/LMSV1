'use strict';
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Lesson, Quiz } from '@/types'
import VideoPlayer from '@/components/learn/VideoPlayer'
import { FileQuestion, AlertTriangle } from 'lucide-react'

export default function LessonPage() {
    const params = useParams()
    const lessonId = params.lessonId as string
    const [lesson, setLesson] = useState<Lesson | null>(null)
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [userId, setUserId] = useState<string>('')

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) setUserId(user.id)

            // Fetch Lesson
            const { data: l } = await supabase
                .from('lessons')
                .select('*')
                .eq('id', lessonId)
                .single()

            setLesson(l)

            // Fetch Associated Quiz
            const { data: q } = await supabase
                .from('quizzes')
                .select('*')
                .eq('related_lesson_id', lessonId)
                .eq('type', 'LESSON_QUIZ')
                .single()

            setQuiz(q)
        }

        fetchData()
    }, [lessonId])

    if (!lesson) return <div className="p-12">Loading Lesson...</div>

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            </div>

            {lesson.video_url ? (
                <VideoPlayer
                    videoId={lesson.video_url}
                    lessonId={lesson.id}
                    userId={userId}
                    onComplete={() => {
                        // Can trigger refresh or celebration
                    }}
                />
            ) : (
                <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                    No Video Content
                </div>
            )}

            {/* Quiz Section */}
            {quiz && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        <FileQuestion className="h-5 w-5 text-purple-600" />
                        Lesson Quiz
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Verify your understanding of this lesson to unlock the next one.
                    </p>
                    <Link
                        href={`/learn/quiz/${quiz.id}`} // Takes user to quiz taker
                        className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
                    >
                        Take Quiz
                    </Link>
                </div>
            )}
        </div>
    )
}
