import React from "react";

// components/Loader.tsx

const Loader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="flex flex-col items-center gap-6">
                {/* Logo / Text */}
                <div className="text-center">
                    <h1 className="text-3xl font-semibold tracking-[0.2em] text-white uppercase">
                        EventHive
                    </h1>
                    <p className="mt-2 text-sm text-gray-300">Loading your experience...</p>
                </div>

                {/* Orbiting loader */}
                <div className="relative h-24 w-24">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-gray-700" />
                    {/* Gradient ring */}
                    <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-t-transparent border-l-transparent border-r-purple-500 border-b-purple-400" />
                    {/* Inner pulsing circle */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 opacity-80 animate-pulse" />
                    {/* Orbiting dot */}
                    <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] animate-orbit" />
                </div>

                {/* Progress bar */}
                <div className="w-48 h-1.5 overflow-hidden rounded-full bg-gray-700">
                    <div className="h-full w-1/2 animate-loading-bar rounded-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-500" />
                </div>
            </div>

            <style jsx global>{`
                @keyframes spin-slow {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }

                @keyframes orbit {
                    0% {
                        transform: rotate(0deg) translateY(8px) translateX(-50%);
                    }
                    50% {
                        transform: rotate(180deg) translateY(8px) translateX(-50%);
                    }
                    100% {
                        transform: rotate(360deg) translateY(8px) translateX(-50%);
                    }
                }

                @keyframes loading-bar {
                    0% {
                        transform: translateX(-100%);
                    }
                    50% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }

                .animate-spin-slow {
                    animation: spin-slow 2.4s linear infinite;
                }

                .animate-orbit {
                    transform-origin: center 50px;
                    animation: orbit 1.6s linear infinite;
                }

                .animate-loading-bar {
                    animation: loading-bar 1.4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Loader;