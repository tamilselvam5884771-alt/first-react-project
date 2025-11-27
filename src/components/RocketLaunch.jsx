import React, { useState } from 'react';

const RocketLaunch = () => {
    const [isLaunching, setIsLaunching] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);

    const handleRocketClick = () => {
        if (isLaunching) return;

        setIsLaunching(true);

        // Show fireworks after rocket reaches top
        setTimeout(() => {
            setShowFireworks(true);
        }, 1500);

        // Reset after animation completes
        setTimeout(() => {
            setIsLaunching(false);
            setShowFireworks(false);
        }, 4000);
    };

    return (
        <>
            {/* Rocket Button */}
            <div
                className={`rocket-button ${isLaunching ? 'launching' : ''}`}
                onClick={handleRocketClick}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    left: '20px',
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 9998,
                    boxShadow: '0 4px 15px rgba(255, 165, 0, 0.4)',
                    transition: 'transform 0.2s ease',
                    border: '3px solid #000'
                }}
            >
                <svg
                    viewBox="0 0 512 512"
                    style={{
                        width: '45px',
                        height: '45px',
                        transform: 'rotate(-45deg)'
                    }}
                >
                    <path fill="#fff" d="M156.6 384.9L125.7 354c-8.5-8.5-11.5-20.8-7.7-32.2c3-8.9 7-20.5 11.8-33.8L24 288c-8.6 0-16.6-4.6-20.9-12.1s-4.2-16.7 .2-24.1l52.5-88.5c13-21.9 36.5-35.3 61.9-35.3l82.3 0c2.4-4 4.8-7.7 7.2-11.3C289.1-4.1 411.1-8.1 483.9 5.3c11.6 2.1 20.6 11.2 22.8 22.8c13.4 72.9 9.3 194.8-111.4 276.7c-3.5 2.4-7.3 4.8-11.3 7.2v82.3c0 25.4-13.4 49-35.3 61.9l-88.5 52.5c-7.4 4.4-16.6 4.5-24.1 .2s-12.1-12.2-12.1-20.9V380.8c-14.1 4.9-26.4 8.9-35.7 11.9c-11.2 3.6-23.4 .5-31.8-7.8zM384 168a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
                    <circle cx="256" cy="256" r="30" fill="#61DAFB" />
                </svg>
            </div>

            {/* Fireworks Effect */}
            {showFireworks && (
                <div className="fireworks-container">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="firework"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 0.5}s`
                            }}
                        />
                    ))}
                </div>
            )}

            <style>{`
                .rocket-button:hover {
                    transform: scale(1.1);
                }

                .rocket-button.launching {
                    animation: rocketFlight 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes rocketFlight {
                    0% {
                        bottom: 20px;
                        left: 20px;
                        transform: scale(1) rotate(0deg);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.2) rotate(180deg);
                    }
                    100% {
                        bottom: calc(100vh + 100px);
                        left: calc(100vw + 100px);
                        transform: scale(0.5) rotate(360deg);
                        opacity: 0;
                    }
                }

                .fireworks-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9999;
                    overflow: hidden;
                }

                .firework {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: white;
                    border-radius: 50%;
                    animation: explode 2s ease-out forwards;
                    box-shadow: 
                        0 0 10px currentColor,
                        0 0 20px currentColor,
                        0 0 30px currentColor;
                }

                .firework:nth-child(5n+1) { color: #ff0080; }
                .firework:nth-child(5n+2) { color: #00ff80; }
                .firework:nth-child(5n+3) { color: #0080ff; }
                .firework:nth-child(5n+4) { color: #ff8000; }
                .firework:nth-child(5n+5) { color: #ff0; }

                @keyframes explode {
                    0% {
                        transform: translate(0, 0) scale(0);
                        opacity: 1;
                    }
                    50% {
                        transform: translate(
                            calc((var(--tx, 0) - 50) * 4px),
                            calc((var(--ty, 0) - 50) * 4px)
                        ) scale(2);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(
                            calc((var(--tx, 0) - 50) * 8px),
                            calc((var(--ty, 0) - 50) * 8px)
                        ) scale(0);
                        opacity: 0;
                    }
                }

                .firework:nth-child(1) { --tx: 10; --ty: 10; }
                .firework:nth-child(2) { --tx: 90; --ty: 10; }
                .firework:nth-child(3) { --tx: 10; --ty: 90; }
                .firework:nth-child(4) { --tx: 90; --ty: 90; }
                .firework:nth-child(5) { --tx: 50; --ty: 10; }
                .firework:nth-child(6) { --tx: 50; --ty: 90; }
                .firework:nth-child(7) { --tx: 10; --ty: 50; }
                .firework:nth-child(8) { --tx: 90; --ty: 50; }
                .firework:nth-child(9) { --tx: 30; --ty: 30; }
                .firework:nth-child(10) { --tx: 70; --ty: 30; }
                .firework:nth-child(11) { --tx: 30; --ty: 70; }
                .firework:nth-child(12) { --tx: 70; --ty: 70; }
                .firework:nth-child(13) { --tx: 50; --ty: 50; }
                .firework:nth-child(14) { --tx: 20; --ty: 60; }
                .firework:nth-child(15) { --tx: 80; --ty: 60; }
                .firework:nth-child(16) { --tx: 60; --ty: 20; }
                .firework:nth-child(17) { --tx: 60; --ty: 80; }
                .firework:nth-child(18) { --tx: 40; --ty: 40; }
                .firework:nth-child(19) { --tx: 60; --ty: 60; }
                .firework:nth-child(20) { --tx: 50; --ty: 30; }
            `}</style>
        </>
    );
};

export default RocketLaunch;
