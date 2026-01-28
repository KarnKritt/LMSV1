'use strict';
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function NewLessonPage() {
    const router = useRouter()
    const params = useParams()
    const courseId = params.id as string

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        video_url: '',
        order_index: 1
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('lessons')
                .insert({
                    course_id: courseId,
                    title: formData.title,
                    video_url: formData.video_url,
                    order_index: formData.order_index
                })

            if (error) throw error

            router.push(`/admin/courses/${courseId}`)
            router.refresh()
        } catch (error) {
            console.error('Error creating lesson:', error)
            alert('Failed to create lesson')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link
                    href={`/admin/courses/${courseId}`}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Add New Lesson</h2>
                    <p className="text-gray-500 text-sm">Add content to your course.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Lesson Title</label>
                        <input
                            required
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent"
                            placeholder="e.g. Introduction to Nouns"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="video_url" className="text-sm font-medium">YouTube Video URL</label>
                        <input
                            type="url"
                            required
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={formData.video_url}
                            onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="order_index" className="text-sm font-medium">Sequence Order</label>
                        <input
                            type="number"
                            required
                            min="1"
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent"
                            value={formData.order_index}
                            onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                        />
                        <p className="text-xs text-gray-500">Determines the order of lessons in the course.</p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Add Lesson
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
