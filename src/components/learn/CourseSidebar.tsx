'use strict';
'use client'

import Link from 'next/link'
import { CheckCircle, Lock, PlayCircle } from 'lucide-react'
import { Lesson } from '@/types'
import { usePathname } from 'next/navigation'

interface CourseSidebarProps {
    courseId: string
    lessons: Lesson[]
    accquiredProgress: Record<string, boolean> // lessonId -> isCompleted
}

export default function CourseSidebar({ courseId, lessons, accquiredProgress }: CourseSidebarProps) {
    const pathname = usePathname()

    return (
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-900">Course Content</h2>
                <p className="text-sm text-gray-500">{lessons.length} Lessons</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {lessons.map((lesson, index) => {
                    const isCompleted = accquiredProgress[lesson.id]
                    const isCurrent = pathname?.includes(lesson.id)

                    // Lock logic: Locked if not first, and previous not completed
                    const prevLesson = lessons[index - 1]
                    // If first lesson, never locked.
                    // If previous lesson completed, unlock this.
                    const isLocked = index > 0 && !accquiredProgress[prevLesson.id]

                    return (
                        <div key={lesson.id}>
                            {isLocked ? (
                                <div className="flex items-center p-3 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed">
                                    <Lock className="h-4 w-4 mr-3 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {index + 1}. {lesson.title}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    href={`/learn/${courseId}/lesson/${lesson.id}`}
                                    className={`flex items-center p-3 rounded-lg transition-colors ${isCurrent
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="h-4 w-4 mr-3 text-green-500 shrink-0" />
                                    ) : (
                                        <PlayCircle className={`h-4 w-4 mr-3 shrink-0 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {index + 1}. {lesson.title}
                                        </p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-gray-100">
                <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2">
                    &larr; Back to Dashboard
                </Link>
            </div>
        </aside>
    )
}
