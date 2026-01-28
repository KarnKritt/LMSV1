
import { Question } from '@/types'

export interface QuizResult {
    totalScore: number
    totalQuestions: number
    percentage: number
    categoryScores: Record<string, { score: number, total: number, percentage: number }>
}

export function calculateQuizScore(questions: Question[], answers: Record<string, string>): QuizResult {
    let correctCount = 0
    const categoryMap: Record<string, { correct: number, total: number }> = {}

    questions.forEach(q => {
        // Initialize category if not exists
        if (!categoryMap[q.category]) {
            categoryMap[q.category] = { correct: 0, total: 0 }
        }

        categoryMap[q.category].total += 1

        // Check answer
        // Assuming simple string match for now, or match option label
        if (answers[q.id] === q.correct_answer) {
            correctCount += 1
            categoryMap[q.category].correct += 1
        }
    })

    const categoryScores: Record<string, any> = {}
    Object.keys(categoryMap).forEach(cat => {
        const { correct, total } = categoryMap[cat]
        categoryScores[cat] = {
            score: correct,
            total: total,
            percentage: Math.round((correct / total) * 100)
        }
    })

    return {
        totalScore: correctCount,
        totalQuestions: questions.length,
        percentage: Math.round((correctCount / questions.length) * 100),
        categoryScores
    }
}

export function identifySkillGaps(categoryScores: Record<string, { percentage: number }>) {
    // Find categories with score < 60% (arbitrary threshold) or sort by lowest
    const entries = Object.entries(categoryScores).map(([cat, data]) => ({
        category: cat,
        percentage: data.percentage
    }))

    // Sort ascending (lowest score first)
    entries.sort((a, b) => a.percentage - b.percentage)

    return entries
}
