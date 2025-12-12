import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'> | null;
    }
}

let echoInitialized = false;

/**
 * Initialize Echo connection lazily - only call this from pages that need real-time updates.
 * This prevents unnecessary WebSocket connections on pages that don't use them.
 */
export function initializeEcho(): Echo<'reverb'> | null {
    if (echoInitialized && window.Echo) {
        return window.Echo;
    }

    window.Pusher = Pusher;

    // Turn on verbose transport logs in dev
    if (import.meta.env.DEV) {
        // @ts-expect-error - pusher-js exposes this at runtime
        Pusher.logToConsole = true;
    }

    function readMeta(name: string): string | null {
        if (typeof document === 'undefined') return null;
        return document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ?? null;
    }

    const key = import.meta.env.VITE_REVERB_APP_KEY ?? readMeta('reverb-app-key');

    if (!key) {
        console.warn('[Echo] No VITE_REVERB_APP_KEY found. Real-time updates disabled.');
        window.Echo = null;
        return null;
    }

    const pageIsSecure =
        typeof window !== 'undefined' && window.location?.protocol === 'https:';

    const configuredScheme =
        import.meta.env.VITE_REVERB_SCHEME ??
        readMeta('reverb-scheme') ??
        (pageIsSecure ? 'https' : 'http');

    // Browsers block ws:// from https pages (mixed content). If the page is https, force wss.
    const reverbScheme = pageIsSecure ? 'https' : configuredScheme;
    const useTLS = reverbScheme === 'https';

    const wsHost = import.meta.env.VITE_REVERB_HOST ?? readMeta('reverb-host') ?? 'localhost';
    const wsPort = Number(import.meta.env.VITE_REVERB_PORT ?? readMeta('reverb-port') ?? (useTLS ? 443 : 8080));

    console.log('[Echo] Initializing', { wsHost, wsPort, useTLS });

    try {
        window.Echo = new Echo({
            broadcaster: 'reverb',
            key,
            wsHost,
            wsPort,
            wssPort: wsPort,
            forceTLS: useTLS,
            enabledTransports: useTLS ? ['wss'] : ['ws'],
        });

        // Connection diagnostics
        // @ts-expect-error - connector typing differs per broadcaster
        const connection = window.Echo?.connector?.pusher?.connection;
        if (connection?.bind) {
            connection.bind('connected', () => console.log('[Echo] Connected'));
            connection.bind('disconnected', () => console.log('[Echo] Disconnected'));
            connection.bind('error', (err: unknown) => console.error('[Echo] Error', err));
        }

        echoInitialized = true;
        return window.Echo;
    } catch (err) {
        console.error('[Echo] Failed to initialize', err);
        window.Echo = null;
        return null;
    }
}

/**
 * Get the current Echo instance (may be null if not initialized or failed)
 */
export function getEcho(): Echo<'reverb'> | null {
    return window.Echo ?? null;
}

export default { initializeEcho, getEcho };
