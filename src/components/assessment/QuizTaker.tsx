'use strict';
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Question } from '@/types'
import { calculateQuizScore } from '@/lib/intelligence'
import { supabase } from '@/lib/supabase/client'

interface QuizTakerProps {
    quizId: string
    questions: Question[]
    userId: string // passed from parent or context
}

export default function QuizTaker({ quizId, questions, userId }: QuizTakerProps) {
    const router = useRouter()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)

    const currentQuestion = questions[currentQuestionIndex]
    const isLastQuestion = currentQuestionIndex === questions.length - 1

    function handleSelectOption(optionLabel: string) {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionLabel
        }))
    }

    function handleNext() {
        if (isLastQuestion) {
            handleSubmit()
        } else {
            setCurrentQuestionIndex(prev => prev + 1)
        }
    }

    async function handleSubmit() {
        setSubmitting(true)

        try {
            // 1. Calculate Score locally (for immediate UX) or server-side. 
            // We do it client-side here for prototype speed, but secure would be server-side.
            const result = calculateQuizScore(questions, answers)

            // 2. Save to DB
            const { error } = await supabase
                .from('user_scores')
                .insert({
                    user_id: userId,
                    quiz_id: quizId,
                    score: result.percentage,
                    category_scores: result.categoryScores
                })

            if (error) throw error

            // 3. Redirect to results/dashboard
            router.push('/dashboard')
        } catch (error) {
            console.error('Error submitting quiz:', error)
            alert('Failed to submit quiz results')
        } finally {
            setSubmitting(false)
        }
    }

    if (!currentQuestion) return <div>No questions in this quiz.</div>

    const selectedAnswer = answers[currentQuestion.id]
    const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100)

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span>{progress}% Completed</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold tracking-wide mb-4">
                    {currentQuestion.category}
                </span>

                <h3 className="text-xl font-medium text-gray-900 mb-8">
                    {currentQuestion.text}
                </h3>

                <div className="space-y-3">
                    {(Array.isArray(currentQuestion.options) ? currentQuestion.options : []).map((option: any, idx: number) => {
                        // Handle both string array (from mock) and object array (from admin)
                        const label = typeof option === 'string' ? option : option.label
                        const text = typeof option === 'string' ? option : option.text
                        // const value = typeof option === 'string' ? option : option.label // We use label as value for checking correctness

                        return (
                            <button
                                key={idx} // Use index as key since string options might duplicate across questions (though unlikely within same question)
                                onClick={() => handleSelectOption(label)} // Answer with the text content if string
                                className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${selectedAnswer === label
                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-600'
                                    }`}
                            >
                                <div className={`flex items-center justify-center h-8 w-8 rounded-full border-2 mr-4 ${selectedAnswer === label
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-200 text-gray-400'
                                    }`}>
                                    {/* For string options, maybe just show A, B, C... or checkmark */}
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="font-medium text-left">{text}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleNext}
                    disabled={!selectedAnswer || submitting}
                    className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Analyzing...' : isLastQuestion ? 'Finish Analysis' : 'Next Question'}
                    {!submitting && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
            </div>
        </div>
    )
}
