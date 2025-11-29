import React, { useState, useEffect } from 'react';

const CartoonCharacter = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [isSmiling, setIsSmiling] = useState(false);
    const [position, setPosition] = useState(0); // -1 = left, 0 = center, 1 = right
    const [walkDirection, setWalkDirection] = useState(1); // 1 = right, -1 = left

    // Periodic smile every 5 seconds
    useEffect(() => {
        const smileInterval = setInterval(() => {
            setIsSmiling(true);
            setTimeout(() => setIsSmiling(false), 2000); // Smile for 2 seconds
        }, 5000);

        return () => clearInterval(smileInterval);
    }, []);

    // Walking animation - 2 steps left and right
    useEffect(() => {
        const walkInterval = setInterval(() => {
            setPosition(prev => {
                const newPos = prev + walkDirection;

                // If reached end (2 steps), reverse direction
                if (newPos >= 2) {
                    setWalkDirection(-1);
                    return 2;
                } else if (newPos <= -2) {
                    setWalkDirection(1);
                    return -2;
                }

                return newPos;
            });
        }, 800); // Change position every 800ms

        return () => clearInterval(walkInterval);
    }, [walkDirection]);

    // Handle click to show message
    const handleClick = () => {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000); // Hide after 3 seconds
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: `${20 + (position * 30)}px`, // Walk left and right
            zIndex: 1000,
            transition: 'right 0.8s ease-in-out',
            cursor: 'pointer',
        }}>
            {/* Speech bubble - shows on click */}
            {showMessage && (
                <div style={{
                    position: 'absolute',
                    bottom: '140px',
                    right: '0',
                    background: 'white',
                    padding: '12px 20px',
                    borderRadius: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    animation: 'popIn 0.3s ease-out, float 2s ease-in-out infinite',
                    whiteSpace: 'nowrap'
                }}>
                    <span style={{
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        color: '#333',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        Hii! 👋
                    </span>
                    {/* Speech bubble tail */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        right: '30px',
                        width: '0',
                        height: '0',
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: '12px solid white'
                    }}></div>
                </div>
            )}

            {/* Cartoon Character Container */}
            <div
                onClick={handleClick}
                style={{
                    position: 'relative',
                    width: '120px',
                    height: '120px',
                    pointerEvents: 'auto',
                    animation: 'gentleBounce 3s infinite ease-in-out'
                }}
            >
                {/* Character Image */}
                <img
                    src="cartoon-character.png"
                    alt="Hari Character"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))',
                        transform: position < 0 ? 'scaleX(-1)' : 'scaleX(1)', // Flip when walking left
                        transition: 'transform 0.3s ease'
                    }}
                />

                {/* Blush effect when smiling */}
                {isSmiling && (
                    <>
                        <div className="blush blush-left"></div>
                        <div className="blush blush-right"></div>

                        {/* Sparkles/Hearts when smiling */}
                        <div className="sparkle sparkle-1">✨</div>
                        <div className="sparkle sparkle-2">💖</div>
                        <div className="sparkle sparkle-3">✨</div>
                    </>
                )}


            </div>

            {/* Animations */}
            <style>{`
                @keyframes popIn {
                    0% {
                        transform: scale(0) translateY(10px);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1) translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes float {
                    0%, 100% { 
                        transform: translateY(0); 
                    }
                    50% { 
                        transform: translateY(-8px); 
                    }
                }

                @keyframes gentleBounce {
                    0%, 100% { 
                        transform: translateY(0); 
                    }
                    50% { 
                        transform: translateY(-10px); 
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                @keyframes scaleIn {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                    }
                }

                .blush {
                    position: absolute;
                    width: 20px;
                    height: 15px;
                    background: rgba(255, 150, 150, 0.6);
                    border-radius: 50%;
                    animation: blushFade 2s ease-in-out;
                }

                .blush-left {
                    top: 45%;
                    left: 15%;
                }

                .blush-right {
                    top: 45%;
                    right: 15%;
                }

                @keyframes blushFade {
                    0%, 100% {
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                }

                .sparkle {
                    position: absolute;
                    font-size: 1.5rem;
                    animation: sparkleFloat 2s ease-out;
                    pointer-events: none;
                }

                .sparkle-1 {
                    top: -10px;
                    left: -10px;
                }

                .sparkle-2 {
                    top: -15px;
                    right: -10px;
                    animation-delay: 0.2s;
                }

                .sparkle-3 {
                    top: 20px;
                    right: -15px;
                    animation-delay: 0.4s;
                }

                @keyframes sparkleFloat {
                    0% {
                        transform: translateY(0) scale(0);
                        opacity: 0;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-30px) scale(1);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default CartoonCharacter;
