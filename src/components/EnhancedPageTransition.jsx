import "./EnhancedPageTransition.scss"
import React, { useEffect, useState } from 'react'
import { useNavigation } from "/src/providers/NavigationProvider.jsx"

/**
 * Enhanced Page Transition Component
 * Creates stunning visual effects when navigating between pages
 */
function EnhancedPageTransition() {
    const { transitionStatus, targetSection, previousSection } = useNavigation()
    const [isVisible, setIsVisible] = useState(false)
    const [transitionType, setTransitionType] = useState('slide')
    const [particles, setParticles] = useState([])

    useEffect(() => {
        if (transitionStatus === "transition_status_running") {
            setIsVisible(true)

            // Choose random transition type for variety
            const types = ['slide', 'curtain', 'ripple', 'morph', 'glitch']
            setTransitionType(types[Math.floor(Math.random() * types.length)])

            // Generate particles
            const particleArray = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 0.3,
                duration: Math.random() * 0.5 + 0.5,
                size: Math.random() * 4 + 2
            }))
            setParticles(particleArray)
        } else if (transitionStatus === "transition_status_finishing") {
            setTimeout(() => {
                setIsVisible(false)
                setParticles([])
            }, 600)
        }
    }, [transitionStatus])

    if (!isVisible) return null

    const isEntering = transitionStatus === "transition_status_running"
    const sectionName = targetSection?.id || 'page'

    return (
        <div className={`enhanced-page-transition ${transitionType} ${isEntering ? 'enter' : 'exit'}`}>
            {/* Slide Transition */}
            {transitionType === 'slide' && (
                <>
                    <div className="slide-panel panel-1"></div>
                    <div className="slide-panel panel-2"></div>
                    <div className="slide-panel panel-3"></div>
                </>
            )}

            {/* Curtain Transition */}
            {transitionType === 'curtain' && (
                <>
                    <div className="curtain curtain-left"></div>
                    <div className="curtain curtain-right"></div>
                </>
            )}

            {/* Ripple Transition */}
            {transitionType === 'ripple' && (
                <div className="ripple-container">
                    <div className="ripple-circle ripple-1"></div>
                    <div className="ripple-circle ripple-2"></div>
                    <div className="ripple-circle ripple-3"></div>
                    <div className="ripple-circle ripple-4"></div>
                </div>
            )}

            {/* Morph Transition */}
            {transitionType === 'morph' && (
                <svg className="morph-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path className="morph-path" d="M0,0 L100,0 L100,100 L0,100 Z" />
                </svg>
            )}

            {/* Glitch Transition */}
            {transitionType === 'glitch' && (
                <>
                    <div className="glitch-layer glitch-1"></div>
                    <div className="glitch-layer glitch-2"></div>
                    <div className="glitch-layer glitch-3"></div>
                </>
            )}

            {/* Particles */}
            <div className="transition-particles">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="transition-particle"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`
                        }}
                    />
                ))}
            </div>

            {/* Section Name Display */}
            <div className="transition-text">
                <h2 className="section-name">{sectionName}</h2>
                <div className="loading-bar">
                    <div className="loading-bar-fill"></div>
                </div>
            </div>

            {/* Geometric Shapes */}
            <div className="geometric-shapes">
                <div className="shape shape-circle"></div>
                <div className="shape shape-square"></div>
                <div className="shape shape-triangle"></div>
            </div>
        </div>
    )
}

export default EnhancedPageTransition
