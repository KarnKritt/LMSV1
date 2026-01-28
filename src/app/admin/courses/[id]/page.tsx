'use strict';
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, FileVideo, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Course, Lesson } from '@/types'

export default function CourseDetailPage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [course, setCourse] = useState<Course | null>(null)
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        tags: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const courseRes = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single()

            const lessonsRes = await supabase
                .from('lessons')
                .select('*')
                .eq('course_id', courseId)
                .order('order_index', { ascending: true })

            if (courseRes.error) throw courseRes.error

            setCourse(courseRes.data)
            setFormData({
                title: courseRes.data.title,
                description: courseRes.data.description || '',
                price: courseRes.data.price,
                tags: courseRes.data.tags?.join(', ') || ''
            })

            if (lessonsRes.data) {
                setLessons(lessonsRes.data)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            alert('Failed to load course data')
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)

            const { error } = await supabase
                .from('courses')
                .update({
                    title: formData.title,
                    description: formData.description,
                    price: formData.price,
                    tags: tagsArray
                })
                .eq('id', courseId)

            if (error) throw error
            alert('Course updated successfully')
        } catch (error) {
            console.error('Error updating course:', error)
            alert('Failed to update course')
        } finally {
            setSaving(false)
        }
    }

    async function deleteLesson(lessonId: string) {
        if (!confirm('Are you sure you want to delete this lesson?')) return

        try {
            const { error } = await supabase
                .from('lessons')
                .delete()
                .eq('id', lessonId)

            if (error) throw error
            setLessons(lessons.filter(l => l.id !== lessonId))
        } catch (error) {
            console.error('Error deleting lesson:', error)
        }
    }

    if (loading) return <div className="p-8">Loading data...</div>
    if (!course) return <div className="p-8">Course not found</div>

    return (
        <div className="space-y-8">
            <div className="flex items-center space-x-4">
                <Link
                    href="/admin/courses"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Course & Lessons</h2>
                    <p className="text-gray-500 text-sm">Update content and curriculum.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Course Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-medium mb-4">Course Details</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <input
                                    required
                                    className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm bg-transparent"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    rows={4}
                                    className="flex w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price</label>
                                <input
                                    type="number"
                                    className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm bg-transparent"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tags</label>
                                <input
                                    className="flex h-9 w-full rounded-md border border-gray-300 px-3 py-1 text-sm bg-transparent"
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-gray-800 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN: Curriculum / Lessons */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">Curriculum</h3>
                        <Link
                            href={`/admin/courses/${courseId}/lessons/new`}
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Lesson
                        </Link>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        {lessons.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No lessons yet. Add your first lesson to start building the curriculum.
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {lessons.map((lesson) => (
                                    <li key={lesson.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                                <FileVideo className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    <span className="text-gray-400 mr-2">#{lesson.order_index}</span>
                                                    {lesson.title}
                                                </div>
                                                {lesson.video_url && (
                                                    <div className="text-xs text-blue-500 truncate max-w-[300px]">
                                                        {lesson.video_url}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => deleteLesson(lesson.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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
        </div>
    )
}
