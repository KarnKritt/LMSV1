'use strict';
'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { CheckCircle } from 'lucide-react'

// Note: To use YouTube IFrame API properly, we usually need the window.YT object.
// For prototype, we'll use a simple react-youtube wrapper or just an iframe and simulate "End" event if possible.
// Or just use a raw iframe and assume user clicks "Mark Complete" if API is too complex for this snippet.
// BUT requirements said: "Trigger from YouTube API".
// So we should try to load the API.

export default function VideoPlayer({
    videoId,
    lessonId,
    userId,
    onComplete
}: {
    videoId: string
    lessonId: string
    userId: string
    onComplete?: () => void
}) {
    const [completed, setCompleted] = useState(false)

    // Quick hack: Extract ID if full URL is provided
    // e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ -> dQw4w9WgXcQ
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }

    const id = getYoutubeId(videoId)

    useEffect(() => {
        // Check if already completed
        async function checkStatus() {
            const { data } = await supabase
                .from('lesson_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('lesson_id', lessonId)
                .eq('is_completed', true)
                .single()

            if (data) setCompleted(true)
        }
        checkStatus()
    }, [lessonId, userId])

    // Simple "Mark Complete" simulation via API detection would require loading script.
    // We'll implement a "Simulate Video End" for V1 robustness or load the script.
    // Loading script logic:

    useEffect(() => {
        if (!id || completed) return

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            new window.YT.Player(`youtube-player-${lessonId}`, {
                height: '100%',
                width: '100%',
                videoId: id,
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        };

        return () => {
            window.onYouTubeIframeAPIReady = undefined
        }
    }, [id, completed, lessonId])

    function onPlayerStateChange(event: any) {
        // YT.PlayerState.ENDED = 0
        if (event.data === 0) {
            markAsComplete()
        }
    }

    async function markAsComplete() {
        if (completed) return

        try {
            const { error } = await supabase.from('lesson_progress').upsert({
                user_id: userId,
                lesson_id: lessonId,
                is_completed: true,
                completed_at: new Date().toISOString()
            }, { onConflict: 'user_id,lesson_id' })

            if (error) throw error

            setCompleted(true)
            if (onComplete) onComplete()
            alert('Lesson Completed!')
        } catch (error) {
            console.error('Error marking complete:', error)
        }
    }

    return (
        <div className="space-y-4">
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg relative">
                {completed && (
                    <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur text-green-700 px-6 py-4 rounded-xl flex items-center gap-2 font-bold shadow-2xl">
                            <CheckCircle className="h-6 w-6" />
                            Lesson Completed
                        </div>
                    </div>
                )}
                <div id={`youtube-player-${lessonId}`} className="h-full w-full" />
            </div>

            {/* Fallback Manual Trigger during Dev */}
            {!completed && (
                <button
                    onClick={markAsComplete}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                    (Dev: Simulate Video Completion)
                </button>
            )}
        </div>
    )
}

declare global {
    interface Window {
        onYouTubeIframeAPIReady?: () => void;
        YT: any;
    }
}
