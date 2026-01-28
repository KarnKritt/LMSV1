'use strict';
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Course } from '@/types'

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCourses()
    }, [])

    async function fetchCourses() {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setCourses(data || [])
        } catch (error) {
            console.error('Error fetching courses:', error)
        } finally {
            setLoading(false)
        }
    }

    async function deleteCourse(id: string) {
        if (!confirm('Are you sure you want to delete this course?')) return

        try {
            const { error } = await supabase
                .from('courses')
                .delete()
                .eq('id', id)

            if (error) throw error
            setCourses(courses.filter(c => c.id !== id))
        } catch (error) {
            console.error('Error deleting course:', error)
            alert('Failed to delete course')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
                    <p className="text-gray-500">Manage your diverse curriculum here.</p>
                </div>
                <Link
                    href="/admin/courses/new"
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Course
                </Link>
            </div>

            {/* Filter/Search Bar Placeholder */}
            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="w-full rounded-md border border-gray-300 bg-white pl-9 py-2 text-sm outline-none focus:border-blue-500 hover:border-gray-400 transition-colors"
                    />
                </div>
            </div>

            <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 font-medium">
                            <tr>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Tags</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        Loading courses...
                                    </td>
                                </tr>
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No courses found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {course.title}
                                            <div className="text-xs text-gray-400 font-normal truncate max-w-[200px]">
                                                {course.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {course.price > 0 ? `$${course.price}` : 'Free'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {course.tags?.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Link
                                                href={`/admin/courses/${course.id}`} // We'll implement edit page later
                                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => deleteCourse(course.id)}
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
