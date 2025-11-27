import React, { useEffect, useState } from 'react';
import { useNavigation } from "/src/providers/NavigationProvider.jsx";
import { useTheme } from "/src/providers/ThemeProvider.jsx";

const PageTransition = () => {
    const { transitionStatus } = useNavigation();
    const theme = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const [particles, setParticles] = useState([]);

    const currentTheme = theme.getSelectedTheme();
    const isDarkTheme = currentTheme?.dark || false;

    useEffect(() => {
        if (transitionStatus === "transition_status_running") {
            setIsVisible(true);
            // Generate particles for transition
            const particleArray = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 0.5,
                duration: Math.random() * 1 + 1
            }));
            setParticles(particleArray);
        } else if (transitionStatus === "transition_status_finishing") {
            setTimeout(() => setIsVisible(false), 800);
        }
    }, [transitionStatus]);

    // Disabled to restore original state
    if (true) return null;

    if (!isVisible) return null;

    const isEntering = transitionStatus === "transition_status_running";

    return (
        <div className={`page-transition ${isEntering ? 'enter' : 'exit'} ${isDarkTheme ? 'dark' : 'light'}`}>
            {/* Wave layers */}
            <div className="wave-container">
                <svg className="wave wave-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0 C150,60 350,0 600,40 C850,80 1050,20 1200,60 L1200,120 L0,120 Z" />
                </svg>
                <svg className="wave wave-2" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,20 C200,80 400,20 600,60 C800,100 1000,40 1200,80 L1200,120 L0,120 Z" />
                </svg>
                <svg className="wave wave-3" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,40 C250,100 450,40 600,80 C750,120 950,60 1200,100 L1200,120 L0,120 Z" />
                </svg>
            </div>

            {/* Particles */}
            <div className="particles-container">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="particle"
                        style={{
                            left: `${particle.x}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`
                        }}
                    />
                ))}
            </div>

            {/* Ripple effect */}
            <div className="ripple ripple-1"></div>
            <div className="ripple ripple-2"></div>
            <div className="ripple ripple-3"></div>
        </div>
    );
};

export default PageTransition;
