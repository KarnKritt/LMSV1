'use strict';
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Lesson } from '@/types'

export default function NewQuizPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [lessons, setLessons] = useState<Lesson[]>([])

    const [formData, setFormData] = useState({
        title: '',
        type: 'PRE_TEST', // PRE_TEST, LESSON_QUIZ, POST_TEST
        related_lesson_id: ''
    })

    // Fetch lessons only if type is LESSON_QUIZ
    useEffect(() => {
        if (formData.type === 'LESSON_QUIZ') {
            fetchLessons()
        } else {
            setFormData(prev => ({ ...prev, related_lesson_id: '' }))
        }
    }, [formData.type])

    async function fetchLessons() {
        try {
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .order('created_at', { ascending: false })

            if (data) setLessons(data)
        } catch (error) {
            console.error('Error fetching lessons:', error)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const payload: any = {
                title: formData.title,
                type: formData.type,
            }

            if (formData.type === 'LESSON_QUIZ' && formData.related_lesson_id) {
                payload.related_lesson_id = formData.related_lesson_id
            } else {
                payload.related_lesson_id = null
            }

            const { error } = await supabase
                .from('quizzes')
                .insert(payload)

            if (error) throw error

            router.push('/admin/quizzes')
            router.refresh()
        } catch (error) {
            console.error('Error creating quiz:', error)
            alert('Failed to create quiz')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link
                    href="/admin/quizzes"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Create Intelligence Quiz</h2>
                    <p className="text-gray-500 text-sm">Define assessment logic.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Quiz Title</label>
                        <input
                            required
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent"
                            placeholder="e.g. English Proficiency Pre-test"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Quiz Type</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="PRE_TEST">Pre-test (Skill Analysis)</option>
                            <option value="LESSON_QUIZ">Lesson Quiz (Progression Lock)</option>
                            <option value="POST_TEST">Post-test (Readiness Check)</option>
                        </select>
                    </div>

                    {formData.type === 'LESSON_QUIZ' && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Related Lesson</label>
                            <select
                                required
                                className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent"
                                value={formData.related_lesson_id}
                                onChange={e => setFormData({ ...formData, related_lesson_id: e.target.value })}
                            >
                                <option value="">Select a lesson...</option>
                                {lessons.map(lesson => (
                                    <option key={lesson.id} value={lesson.id}>
                                        {lesson.title}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500">Which lesson does this quiz unlock?</p>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Create Quiz
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
