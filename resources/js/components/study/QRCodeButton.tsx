import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeButtonProps {
    className?: string;
}

export default function QRCodeButton({ className = '' }: QRCodeButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        // Get the full current URL dynamically
        setCurrentUrl(window.location.href);
    }, []);

    return (
        <>
            {/* QR Code Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center gap-2 rounded-full border-2 border-[#a78bfa] bg-[#1e1e32] px-4 py-2 text-sm font-semibold text-[#a78bfa] transition-all hover:bg-[#a78bfa] hover:text-[#121220] ${className}`}
                aria-label="Show QR code for this page"
            >
                <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                </svg>
                <span className="hidden sm:inline">QR Code</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative w-full max-w-sm rounded-2xl bg-[#1e1e32] p-8 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#9494a8] transition-colors hover:bg-[#2a2a45] hover:text-[#f8f8ff]"
                            aria-label="Close"
                        >
                            ✕
                        </button>

                        <div className="text-center">
                            <h3 className="mb-2 text-lg font-bold text-[#f8f8ff]">
                                Scan to Open This Page
                            </h3>
                            <p className="mb-6 text-sm text-[#9494a8]">
                                Share this lesson with others
                            </p>

                            {/* QR Code */}
                            <div className="mx-auto mb-6 inline-block rounded-xl bg-white p-4">
                                {currentUrl && (
                                    <QRCodeSVG
                                        value={currentUrl}
                                        size={200}
                                        level="M"
                                        includeMargin={false}
                                        bgColor="#ffffff"
                                        fgColor="#121220"
                                    />
                                )}
                            </div>

                            <p className="mb-4 break-all text-xs text-[#9494a8]">
                                {currentUrl}
                            </p>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(currentUrl);
                                }}
                                className="w-full rounded-xl bg-[#a78bfa] py-3 font-semibold text-white transition-all hover:bg-[#a78bfa]/80"
                            >
                                Copy Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
