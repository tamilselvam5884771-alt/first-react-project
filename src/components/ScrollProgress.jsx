import "./ScrollProgress.scss"
import React, { useState, useEffect } from 'react'

/**
 * Scroll Progress Component
 * Displays circular progress indicator and section markers
 */
function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight
            const documentHeight = document.documentElement.scrollHeight
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop

            // Calculate scroll percentage
            const totalScroll = documentHeight - windowHeight
            const progress = (scrollTop / totalScroll) * 100

            setScrollProgress(Math.min(100, Math.max(0, progress)))
            setIsVisible(scrollTop > 100)
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Initial call

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <>
            {/* Circular Progress Indicator */}
            <div className={`scroll-progress-circle ${isVisible ? 'visible' : ''}`}>
                <svg className="progress-ring" width="60" height="60">
                    <circle
                        className="progress-ring-bg"
                        cx="30"
                        cy="30"
                        r="26"
                    />
                    <circle
                        className="progress-ring-fill"
                        cx="30"
                        cy="30"
                        r="26"
                        style={{
                            strokeDasharray: `${2 * Math.PI * 26}`,
                            strokeDashoffset: `${2 * Math.PI * 26 * (1 - scrollProgress / 100)}`
                        }}
                    />
                </svg>
                <button
                    className="progress-button"
                    onClick={scrollToTop}
                    title="Scroll to top"
                >
                    <i className="fa-solid fa-arrow-up"></i>
                </button>
                <div className="progress-percentage">{Math.round(scrollProgress)}%</div>
            </div>

            {/* Linear Progress Bar */}
            <div className="scroll-progress-bar">
                <div
                    className="scroll-progress-fill"
                    style={{ width: `${scrollProgress}%` }}
                ></div>
            </div>
        </>
    )
}

export default ScrollProgress
