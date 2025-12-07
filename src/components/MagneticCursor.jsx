import "./MagneticCursor.scss"
import React, { useState, useEffect, useRef } from 'react'

/**
 * Magnetic Cursor Effect Component
 * Creates a premium cursor with particle trails and magnetic attraction
 */
function MagneticCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)
    const [isClicking, setIsClicking] = useState(false)
    const [particles, setParticles] = useState([])
    const cursorRef = useRef(null)
    const particleIdRef = useRef(0)

    useEffect(() => {
        let animationFrameId
        let lastTime = Date.now()

        const handleMouseMove = (e) => {
            const currentTime = Date.now()
            const deltaTime = currentTime - lastTime

            // Update cursor position
            setPosition({ x: e.clientX, y: e.clientY })

            // Check if hovering over interactive elements
            const target = e.target
            const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .swiper-slide')
            setIsHovering(!!isInteractive)

            // Create particles (throttled)
            if (deltaTime > 50) {
                createParticle(e.clientX, e.clientY)
                lastTime = currentTime
            }
        }

        const handleMouseDown = () => {
            setIsClicking(true)
            // Create burst of particles on click
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    createParticle(position.x, position.y, true)
                }, i * 20)
            }
        }

        const handleMouseUp = () => {
            setIsClicking(false)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mousedown', handleMouseDown)
        document.addEventListener('mouseup', handleMouseUp)

        // Particle cleanup animation
        const particleInterval = setInterval(() => {
            setParticles(prev => prev.filter(p => Date.now() - p.createdAt < 1000))
        }, 100)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mousedown', handleMouseDown)
            document.removeEventListener('mouseup', handleMouseUp)
            clearInterval(particleInterval)
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId)
            }
        }
    }, [position])

    const createParticle = (x, y, isBurst = false) => {
        const particle = {
            id: particleIdRef.current++,
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            size: isBurst ? Math.random() * 8 + 4 : Math.random() * 4 + 2,
            createdAt: Date.now(),
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: (Math.random() - 0.5) * 2,
            isBurst
        }
        setParticles(prev => [...prev, particle])
    }

    return (
        <>
            {/* Main Cursor */}
            <div
                ref={cursorRef}
                className={`magnetic-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`
                }}
            >
                <div className="cursor-inner"></div>
            </div>

            {/* Cursor Outer Ring */}
            <div
                className={`magnetic-cursor-outer ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`
                }}
            ></div>

            {/* Particle Trail */}
            <div className="cursor-particles">
                {particles.map(particle => {
                    const age = Date.now() - particle.createdAt
                    const opacity = Math.max(0, 1 - age / 1000)
                    const scale = particle.isBurst ? 1 - age / 1000 : 1

                    return (
                        <div
                            key={particle.id}
                            className={`cursor-particle ${particle.isBurst ? 'burst' : ''}`}
                            style={{
                                left: `${particle.x + particle.velocityX * age / 100}px`,
                                top: `${particle.y + particle.velocityY * age / 100}px`,
                                width: `${particle.size}px`,
                                height: `${particle.size}px`,
                                opacity: opacity,
                                transform: `scale(${scale})`
                            }}
                        ></div>
                    )
                })}
            </div>
        </>
    )
}

export default MagneticCursor
