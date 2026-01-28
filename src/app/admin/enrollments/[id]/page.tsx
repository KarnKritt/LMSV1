'use strict';
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Enrollment } from '@/types'
import { format } from 'date-fns'

export default function EditEnrollmentPage() {
    const router = useRouter()
    const params = useParams()
    const enrollmentId = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState('active')
    const [expiresAt, setExpiresAt] = useState('')

    useEffect(() => {
        fetchEnrollment()
    }, [])

    async function fetchEnrollment() {
        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select('*')
                .eq('id', enrollmentId)
                .single()

            if (error) throw error

            if (data) {
                setStatus(data.status)
                if (data.expires_at) {
                    // Format for datetime-local input: YYYY-MM-DDThh:mm
                    const date = new Date(data.expires_at)
                    setExpiresAt(date.toISOString().slice(0, 16))
                }
            }
        } catch (error) {
            console.error('Error fetching enrollment:', error)
            alert('Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        try {
            const { error } = await supabase
                .from('enrollments')
                .update({
                    status,
                    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null
                })
                .eq('id', enrollmentId)

            if (error) throw error
            alert('Enrollment updated successfully')
            router.push('/admin/enrollments')
        } catch (error) {
            console.error('Error updating enrollment:', error)
            alert('Failed to update enrollment')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link
                    href="/admin/enrollments"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Edit Access</h2>
                    <p className="text-gray-500 text-sm">Modify status or extend expiry.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Expiration Date</label>
                        <input
                            type="datetime-local"
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent"
                            value={expiresAt}
                            onChange={e => setExpiresAt(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Leave empty for lifetime access.</p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Update Access
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
