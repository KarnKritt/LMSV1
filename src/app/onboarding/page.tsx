'use strict';
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Quiz, Question } from '@/types'
import QuizTaker from '@/components/assessment/QuizTaker'

export default function OnboardingPage() {
    const [loading, setLoading] = useState(true)
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        // 1. Get User
        // For prototype, we might need to mock or ensure session exists.
        // If no session, we should probably redirect to login, but we'll assume auth wrapper handles it
        // or we fetch user here.
        async function init() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
            } else {
                // Mock user ID for dev if no auth set up yet
                // setUserId('mock-user-id')
                // Actually, user_scores RLS requires auth.uid().
                // So we strictly need a user logged in.
                // If not logged in, show login prompt.
            }

            // 2. Fetch Pre-test
            const { data: quizzes } = await supabase
                .from('quizzes')
                .select('*')
                .eq('type', 'PRE_TEST')
                .limit(1)

            if (quizzes && quizzes.length > 0) {
                const targetQuiz = quizzes[0]
                setQuiz(targetQuiz)

                const { data: qs } = await supabase
                    .from('questions')
                    .select('*')
                    .eq('quiz_id', targetQuiz.id)

                if (qs) setQuestions(qs as any)
            }

            setLoading(false)
        }

        init()
    }, [])

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Assessment...</div>

    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
                    <p className="text-gray-500">You need an account to save your skill analysis.</p>
                </div>
            </div>
        )
    }

    if (!quiz || questions.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-4">No Pre-test Configured</h1>
                    <p className="text-gray-500">The admin hasn't set up the initial assessment yet. Please return later.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Skill Analysis</h1>
                <p className="mt-2 text-gray-600">Let's determine your English proficiency level to personalize your learning path.</p>
            </div>

            <QuizTaker
                quizId={quiz.id}
                questions={questions}
                userId={userId}
            />
        </div>
    )
}
