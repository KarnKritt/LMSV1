
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Course {
    id: string
    created_at: string
    title: string
    description: string | null
    price: number
    tags: string[] | null
}

export interface Lesson {
    id: string
    created_at: string
    course_id: string
    title: string
    video_url: string | null
    order_index: number
}

export type QuizType = 'PRE_TEST' | 'LESSON_QUIZ' | 'POST_TEST'

export interface Quiz {
    id: string
    created_at: string
    type: QuizType
    related_lesson_id: string | null
    title: string
}

export interface Question {
    id: string
    created_at: string
    quiz_id: string
    text: string
    options: Json
    correct_answer: string
    category: string
}

export interface Enrollment {
    id: string
    created_at: string
    user_id: string
    course_id: string
    status: string
    expires_at: string | null
}

export interface UserScore {
    id: string
    created_at: string
    user_id: string
    quiz_id: string
    score: number
    category_scores: Json | null
}
