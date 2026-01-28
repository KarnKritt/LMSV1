'use strict';
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Search, Calendar, User, BookOpen } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Enrollment } from '@/types'
import { format } from 'date-fns'

interface EnrollmentWithDetails extends Enrollment {
    courses: { title: string }
}

export default function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEnrollments()
    }, [])

    async function fetchEnrollments() {
        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select(`
          *,
          courses ( title )
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setEnrollments(data as any)
        } catch (error) {
            console.error('Error fetching enrollments:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Enrollments</h2>
                    <p className="text-gray-500">Manage student access and subscriptions.</p>
                </div>
                {/* Enrollments are typically created via purchase, but maybe manual add is needed? skipped for now */}
            </div>

            <div className="rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 font-medium">
                            <tr>
                                <th className="px-6 py-3">User ID</th>
                                <th className="px-6 py-3">Course</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Expires At</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Loading enrollments...
                                    </td>
                                </tr>
                            ) : enrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No active enrollments found.
                                    </td>
                                </tr>
                            ) : (
                                enrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span className="font-mono text-xs text-gray-600" title={enrollment.user_id}>
                                                {enrollment.user_id.substring(0, 8)}...
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-gray-400" />
                                                {enrollment.courses?.title || 'Unknown Course'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${enrollment.status === 'active'
                                                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                                                    : 'bg-red-50 text-red-700 ring-red-600/20'
                                                }`}>
                                                {enrollment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {enrollment.expires_at ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(enrollment.expires_at), 'PPP')}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">Lifetime</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/enrollments/${enrollment.id}`}
                                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                                                title="Edit Access / Extend"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>
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
