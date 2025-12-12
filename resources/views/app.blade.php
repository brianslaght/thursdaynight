<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        {{-- Reverb/Echo configuration (fallback for when VITE_REVERB_* is not set) --}}
        @php
            // These should represent the *public* connection details the browser should use.
            // In Herd, Reverb may run on 8080 internally but be served to the browser on 443 via TLS/proxy.
            $reverbKey = config('broadcasting.connections.reverb.key');
            $reverbHost = config('broadcasting.connections.reverb.options.host') ?: request()->getHost();
            $reverbPort = (int) (config('broadcasting.connections.reverb.options.port') ?? 0);
            $reverbScheme = config('broadcasting.connections.reverb.options.scheme') ?: request()->getScheme();

            // Never expose bind addresses as websocket hosts for the browser.
            // (These are valid for servers but not connectable from the client.)
            $invalidHosts = ['0.0.0.0', '127.0.0.1', '::', '::1', 'localhost'];
            if (! $reverbHost || in_array($reverbHost, $invalidHosts, true)) {
                $reverbHost = request()->getHost();
            }
        @endphp
        <meta name="reverb-app-key" content="{{ $reverbKey }}">
        <meta name="reverb-host" content="{{ $reverbHost }}">
        <meta name="reverb-port" content="{{ $reverbPort }}">
        <meta name="reverb-scheme" content="{{ $reverbScheme }}">

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
