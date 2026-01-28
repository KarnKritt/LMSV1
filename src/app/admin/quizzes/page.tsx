'use strict';
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search, FileQuestion } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Quiz } from '@/types'

export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchQuizzes()
    }, [])

    async function fetchQuizzes() {
        try {
            const { data, error } = await supabase
                .from('quizzes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setQuizzes(data || [])
        } catch (error) {
            console.error('Error fetching quizzes:', error)
        } finally {
            setLoading(false)
        }
    }

    async function deleteQuiz(id: string) {
        if (!confirm('Are you sure you want to delete this quiz?')) return

        try {
            const { error } = await supabase
                .from('quizzes')
                .delete()
                .eq('id', id)

            if (error) throw error
            setQuizzes(quizzes.filter(q => q.id !== id))
        } catch (error) {
            console.error('Error deleting quiz:', error)
            alert('Failed to delete quiz')
        }
    }

    function getBadgeColor(type: string) {
        switch (type) {
            case 'PRE_TEST': return 'bg-purple-100 text-purple-700 ring-purple-700/10'
            case 'POST_TEST': return 'bg-green-100 text-green-700 ring-green-700/10'
            case 'LESSON_QUIZ': return 'bg-blue-100 text-blue-700 ring-blue-700/10'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quizzes</h2>
                    <p className="text-gray-500">Manage assessments and intelligence logic.</p>
                </div>
                <Link
                    href="/admin/quizzes/new"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Quiz
                </Link>
            </div>

            <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 font-medium">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Created</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        Loading quizzes...
                                    </td>
                                </tr>
                            ) : quizzes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No quizzes found.
                                    </td>
                                </tr>
                            ) : (
                                quizzes.map((quiz) => (
                                    <tr key={quiz.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                            <FileQuestion className="h-4 w-4 text-gray-400" />
                                            {quiz.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getBadgeColor(quiz.type)}`}>
                                                {quiz.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(quiz.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                href={`/admin/quizzes/${quiz.id}`}
                                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => deleteQuiz(quiz.id)}
                                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
