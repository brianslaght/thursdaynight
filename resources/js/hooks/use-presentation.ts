import { useEffect, useState, useCallback, useRef } from 'react';
import type { PresentationState, PresentationEvent } from '@/types/presentation';

interface UsePresentationOptions {
    weekId: number;
    initialState: PresentationState;
    isController?: boolean;
}

export function usePresentation({ weekId, initialState, isController = false }: UsePresentationOptions) {
    const [state, setState] = useState<PresentationState>(initialState);
    const [isConnected, setIsConnected] = useState(false);
    const channelRef = useRef<ReturnType<typeof window.Echo.channel> | null>(null);

    // Subscribe to channel
    useEffect(() => {
        if (typeof window === 'undefined' || !window.Echo) return;

        const channel = window.Echo.channel(`presentation.${weekId}`);
        channelRef.current = channel;

        channel
            .listen('.state.updated', (event: PresentationEvent) => {
                console.log('Received presentation update:', event);
                setState(event.state);
            })
            .subscribed(() => {
                setIsConnected(true);
            })
            .error((error: unknown) => {
                console.error('Channel error:', error);
                setIsConnected(false);
            });

        return () => {
            window.Echo.leave(`presentation.${weekId}`);
        };
    }, [weekId]);

    // Get CSRF token
    const getCsrfToken = useCallback(() => {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }, []);

    // Controller actions
    const navigate = useCallback(async (direction: 'next' | 'previous') => {
        if (!isController) return;

        try {
            const response = await fetch(`/weeks/${weekId}/presentation/${direction}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) {
                console.error('Navigation failed:', response.status, response.statusText);
                const text = await response.text();
                console.error('Response:', text);
                return;
            }
            const data = await response.json();
            if (data.success) {
                setState(prev => ({ ...prev, ...data.state }));
            }
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }, [weekId, isController, getCsrfToken]);

    const goToItem = useCallback(async (sectionIndex: number, contentIndex: number) => {
        if (!isController) return;

        try {
            const response = await fetch(`/weeks/${weekId}/presentation/state`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    section_index: sectionIndex,
                    content_index: contentIndex,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setState(prev => ({ ...prev, ...data.state }));
            }
        } catch (error) {
            console.error('Go to item error:', error);
        }
    }, [weekId, isController, getCsrfToken]);

    const toggleScripture = useCallback(async (sectionIndex: number, contentIndex: number) => {
        if (!isController) return;

        try {
            const response = await fetch(`/weeks/${weekId}/presentation/toggle-scripture`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    section_index: sectionIndex,
                    content_index: contentIndex,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setState(prev => ({ ...prev, expandedScriptures: data.expandedScriptures }));
            }
        } catch (error) {
            console.error('Toggle scripture error:', error);
        }
    }, [weekId, isController, getCsrfToken]);

    const highlightQuestion = useCallback(async (questionIndex: number | null) => {
        if (!isController) return;

        try {
            const response = await fetch(`/weeks/${weekId}/presentation/highlight-question`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    question_index: questionIndex,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setState(prev => ({ ...prev, highlightedQuestionIndex: data.highlightedQuestionIndex }));
            }
        } catch (error) {
            console.error('Highlight question error:', error);
        }
    }, [weekId, isController, getCsrfToken]);

    return {
        state,
        isConnected,
        navigate,
        goToItem,
        toggleScripture,
        highlightQuestion,
    };
}
