'use strict';
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, HelpCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Quiz, Question } from '@/types'

export default function QuizDetailPage() {
    const params = useParams()
    const router = useRouter()
    const quizId = params.id as string

    const [loading, setLoading] = useState(true)
    const [quiz, setQuiz] = useState<Quiz | null>(null)
    const [questions, setQuestions] = useState<Question[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const quizRes = await supabase
                .from('quizzes')
                .select('*')
                .eq('id', quizId)
                .single()

            const questionsRes = await supabase
                .from('questions')
                .select('*')
                .eq('quiz_id', quizId)
                .order('created_at', { ascending: true })

            if (quizRes.error) throw quizRes.error

            setQuiz(quizRes.data)
            if (questionsRes.data) {
                setQuestions(questionsRes.data as Question[])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            alert('Failed to load quiz data')
        } finally {
            setLoading(false)
        }
    }

    async function deleteQuestion(id: string) {
        if (!confirm('Are you sure you want to delete this question?')) return

        try {
            const { error } = await supabase
                .from('questions')
                .delete()
                .eq('id', id)

            if (error) throw error
            setQuestions(questions.filter(q => q.id !== id))
        } catch (error) {
            console.error('Error deleting question:', error)
        }
    }

    if (loading) return <div className="p-8">Loading...</div>
    if (!quiz) return <div className="p-8">Quiz not found</div>

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <Link
                    href="/admin/quizzes"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{quiz.title}</h2>
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide">
                            {quiz.type.replace('_', ' ')}
                        </span>
                        <span>•</span>
                        <span>{questions.length} Questions</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Questions</h3>
                    <Link
                        href={`/admin/quizzes/${quizId}/questions/new`}
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Question
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    {questions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No questions yet. Add questions to assess student skills.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {questions.map((q, index) => (
                                <li key={q.id} className="p-6 hover:bg-gray-50 transition-colors group">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="mt-1 h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-medium text-gray-900">{q.text}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 border border-yellow-200">
                                                        {q.category}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        Correct: {q.correct_answer}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteQuestion(q.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
