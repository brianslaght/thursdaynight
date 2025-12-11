import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
    }
}

window.Pusher = Pusher;

function readMeta(name: string): string | null {
    if (typeof document === 'undefined') return null;
    return document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ?? null;
}

const defaultScheme =
    typeof window !== 'undefined' && window.location?.protocol === 'https:' ? 'https' : 'http';
const reverbScheme =
    import.meta.env.VITE_REVERB_SCHEME ?? readMeta('reverb-scheme') ?? defaultScheme;
const useTLS = reverbScheme === 'https';

const defaultHost =
    typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : 'localhost';
const wsHost = import.meta.env.VITE_REVERB_HOST ?? readMeta('reverb-host') ?? defaultHost;

const defaultPort = useTLS ? 443 : 8080;
const wsPort = Number(import.meta.env.VITE_REVERB_PORT ?? readMeta('reverb-port') ?? defaultPort);
const key = import.meta.env.VITE_REVERB_APP_KEY ?? readMeta('reverb-app-key');

if (!key) {
    // This is the #1 cause of “Echo not connecting” in Vite apps:
    // Vite only exposes env vars prefixed with VITE_.
    console.warn(
        '[Echo] Missing VITE_REVERB_APP_KEY. Realtime updates will not work until it is set.',
    );
}

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: key ?? '',
    wsHost,
    wsPort,
    wssPort: wsPort,
    forceTLS: useTLS,
    enabledTransports: useTLS ? ['wss'] : ['ws'],
});

// Helpful connection diagnostics (shows up in DevTools console).
try {
    // @ts-expect-error - connector typing differs per broadcaster
    const connection = window.Echo?.connector?.pusher?.connection;
    if (connection?.bind) {
        connection.bind('connected', () => console.log('[Echo] connected'));
        connection.bind('disconnected', () => console.log('[Echo] disconnected'));
        connection.bind('error', (err: unknown) => console.error('[Echo] connection error', err));
    }
} catch {
    // no-op
}

export default window.Echo;
