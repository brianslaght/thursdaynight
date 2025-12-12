import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
        __ECHO_DEBUG__?: Record<string, unknown>;
    }
}

window.Pusher = Pusher;
// Turn on verbose transport logs in dev so connection failures are obvious.
// (This is the fastest way to see the exact ws/wss URL + close codes.)
if (import.meta.env.DEV) {
    // @ts-expect-error - pusher-js exposes this at runtime
    Pusher.logToConsole = true;
}

function readMeta(name: string): string | null {
    if (typeof document === 'undefined') return null;
    return document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') ?? null;
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

// IMPORTANT: prefer the actual page hostname. This matters when the app is accessed via a tunnel
// (e.g. *.sharedwithexpose.com) where `thursdaynight.test` won't resolve on remote devices.
const pageHost =
    typeof window !== 'undefined' && window.location?.hostname ? window.location.hostname : 'localhost';
// Prefer meta host (set from the actual request host) so tunnels / non-.test hosts work.
// VITE_REVERB_HOST can accidentally point at a local-only hostname (like *.test) when accessed remotely.
const metaHost = readMeta('reverb-host');
const envHost = import.meta.env.VITE_REVERB_HOST;
const wsHost = metaHost ?? envHost ?? pageHost;

const metaPort = readMeta('reverb-port');
const hasExplicitPort = Boolean(metaPort ?? import.meta.env.VITE_REVERB_PORT);
const defaultPort = useTLS ? 443 : 8080;
const wsPort = Number(metaPort ?? import.meta.env.VITE_REVERB_PORT ?? defaultPort);
const key = import.meta.env.VITE_REVERB_APP_KEY ?? readMeta('reverb-app-key');

if (!key) {
    // This is the #1 cause of “Echo not connecting” in Vite apps:
    // Vite only exposes env vars prefixed with VITE_.
    console.warn(
        '[Echo] Missing VITE_REVERB_APP_KEY. Realtime updates will not work until it is set.',
    );
}

try {
    type Candidate = { host: string; port: number };

    const makeEcho = (host: string, port: number) => {
        const urlPreview =
            key ? `${useTLS ? 'wss' : 'ws'}://${host}:${port}/app/${String(key)}` : null;
        window.__ECHO_DEBUG__ = {
            pageIsSecure,
            configuredScheme,
            reverbScheme,
            useTLS,
            wsHost: host,
            wsPort: port,
            keyPresent: Boolean(key),
            keyPreview: key ? `${String(key).slice(0, 4)}…` : null,
            urlPreview,
        };
        console.log('[Echo] init', window.__ECHO_DEBUG__);

        return new Echo({
            broadcaster: 'reverb',
            key: key ?? '',
            wsHost: host,
            wsPort: port,
            wssPort: port,
            forceTLS: useTLS,
            enabledTransports: useTLS ? ['wss'] : ['ws'],
        });
    };

    const unique = <T,>(arr: T[]) => Array.from(new Set(arr));
    const sanitizeHost = (h: string | undefined | null) => (h ? h.trim() : '');

    const alternatePort = wsPort === 443 ? 8080 : 443;
    const hosts = unique([sanitizeHost(wsHost), sanitizeHost(pageHost)]).filter(Boolean);
    const ports = unique(
        hasExplicitPort ? [wsPort, alternatePort] : [wsPort, alternatePort, 443, 8080],
    );

    // Priority order: (configured host, configured port) -> (page host, configured port)
    // -> (configured host, alternate port) -> (page host, alternate port) -> remaining combos.
    const candidates: Candidate[] = [];
    for (const port of [wsPort, alternatePort]) {
        for (const host of hosts) candidates.push({ host, port });
    }
    for (const port of ports) {
        for (const host of hosts) candidates.push({ host, port });
    }
    // De-dupe
    const seen = new Set<string>();
    const ordered = candidates.filter((c) => {
        const k = `${c.host}:${c.port}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });

    let attemptIdx = 0;
    let connected = false;
    let attemptTimer: number | null = null;

    const connectNext = (reason: string) => {
        if (connected) return;
        if (attemptTimer) {
            window.clearTimeout(attemptTimer);
            attemptTimer = null;
        }
        const next = ordered[attemptIdx++];
        if (!next) {
            console.error('[Echo] all connection attempts failed', { tried: ordered });
            return;
        }

        console.warn('[Echo] connect attempt', { ...next, reason });
        try {
            window.Echo?.disconnect?.();
        } catch {
            // no-op
        }
        window.Echo = makeEcho(next.host, next.port);

        // @ts-expect-error - connector typing differs per broadcaster
        const pusher = window.Echo?.connector?.pusher;
        const connection = pusher?.connection;
        if (connection?.bind) {
            connection.bind('state_change', (states: unknown) => console.log('[Echo] state_change', states));
            connection.bind('connected', () => {
                connected = true;
                console.log('[Echo] connected');
            });
            connection.bind('disconnected', () => console.log('[Echo] disconnected'));
            connection.bind('unavailable', () => console.warn('[Echo] unavailable'));
            connection.bind('error', (err: unknown) => {
                console.error('[Echo] connection error', err);
                connectNext('error');
            });
            connection.bind('failed', (err: unknown) => {
                console.error('[Echo] failed', err);
                connectNext('failed');
            });
        } else {
            console.warn('[Echo] No pusher connection object found', { pusher });
        }

        // Timeout safety: if it neither connects nor fails quickly, move on.
        attemptTimer = window.setTimeout(() => {
            try {
                const state = connection?.state;
                console.log('[Echo] connection state (2s)', state);
                if (!connected && state !== 'connected') {
                    connectNext('timeout');
                }
            } catch {
                connectNext('timeout');
            }
        }, 2000);
    };

    connectNext('initial');
} catch (err) {
    console.error('[Echo] init failed', err);
}

export default window.Echo;
