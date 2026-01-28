'use strict';
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function NewQuestionPage() {
    const router = useRouter()
    const params = useParams()
    const quizId = params.id as string

    const [loading, setLoading] = useState(false)
    const [text, setText] = useState('')
    const [category, setCategory] = useState('General')
    const [options, setOptions] = useState([
        { label: 'A', text: '' },
        { label: 'B', text: '' },
        { label: 'C', text: '' },
        { label: 'D', text: '' }
    ])
    const [correctAnswer, setCorrectAnswer] = useState('A')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            // Validate options
            if (options.some(o => !o.text.trim())) {
                alert('Please fill in all option texts.')
                setLoading(false)
                return
            }

            const { error } = await supabase
                .from('questions')
                .insert({
                    quiz_id: quizId,
                    text,
                    options, // Stored as JSONB
                    correct_answer: correctAnswer,
                    category
                })

            if (error) throw error

            router.push(`/admin/quizzes/${quizId}`)
            router.refresh()
        } catch (error) {
            console.error('Error creating question:', error)
            alert('Failed to create question')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link
                    href={`/admin/quizzes/${quizId}`}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Add Question</h2>
                    <p className="text-gray-500 text-sm">Define the challenge and skill category.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Question Text */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Question Text</label>
                        <textarea
                            required
                            rows={3}
                            className="flex w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent resize-none"
                            placeholder="e.g. Which of the following is a noun?"
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Skill Category</label>
                        <input
                            required
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent"
                            placeholder="e.g. Grammar, Vocabulary, Listening"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Crucial for calculating the Skill Gap.</p>
                    </div>

                    {/* Options */}
                    <div className="space-y-4">
                        <label className="text-sm font-medium">Options</label>
                        <div className="space-y-3">
                            {options.map((option, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500 shrink-0">
                                        {option.label}
                                    </div>
                                    <input
                                        required
                                        className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-transparent"
                                        placeholder={`Option ${option.label} text`}
                                        value={option.text}
                                        onChange={e => {
                                            const newOptions = [...options]
                                            newOptions[idx].text = e.target.value
                                            setOptions(newOptions)
                                        }}
                                    />
                                    <input
                                        type="radio"
                                        name="correctAnswer"
                                        checked={correctAnswer === option.label}
                                        onChange={() => setCorrectAnswer(option.label)}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        title="Mark as correct answer"
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-right text-gray-500">Select the radio button next to the correct answer.</p>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-8 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Question
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
