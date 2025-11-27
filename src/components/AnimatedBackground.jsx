import React, { useEffect, useState } from 'react';
import '/src/styles/animated-background.scss';

const AnimatedBackground = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const particleCount = 20;
        const newParticles = [];

        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                id: i,
                left: Math.random() * 100 + '%',
                size: Math.random() * 20 + 10 + 'px',
                duration: Math.random() * 20 + 10 + 's',
                delay: Math.random() * 10 + 's',
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
            });
        }

        setParticles(newParticles);
    }, []);

    return (
        <div className="animated-background">
            <div className="particles">
                {particles.map((particle, index) => (
                    <div
                        key={index}
                        className="particle"
                        style={{
                            left: particle.left,
                            top: particle.top,
                            width: particle.size,
                            height: particle.size,
                            animationDuration: particle.duration,
                            animationDelay: particle.delay,
                            background: particle.color,
                            boxShadow: `0 0 ${parseInt(particle.size) * 2}px ${particle.color}`
                        }}
                    />
                ))}
            </div>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '3rem',
                fontWeight: 'bold',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                zIndex: 0,
                pointerEvents: 'none',
                width: '100%',
                padding: '0 20px'
            }}>
                Confidence is the key to success
            </div>
        </div>
    );
};

export default AnimatedBackground;
