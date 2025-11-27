import "./LayoutAnimatedBackground.scss"
import React, { useEffect, useState } from 'react'
import { useUtils } from "/src/hooks/utils.js"
import { useTheme } from "/src/providers/ThemeProvider.jsx"
import Animable from "/src/components/capabilities/Animable.jsx"

const utils = useUtils()

function LayoutAnimatedBackground() {
    const utilsHook = useUtils()
    const theme = useTheme()

    // Detect if current theme is dark
    const isDarkTheme = theme.getSelectedTheme()?.dark || false

    const [stars, setStars] = useState([])
    const [clouds, setClouds] = useState([])
    const [birds, setBirds] = useState([])
    const [moonGlow, setMoonGlow] = useState(0)
    const [sunGlow, setSunGlow] = useState(0)

    const visibilityClass = utilsHook.device.isAndroid() && !utilsHook.device.isChromeAndroid() ?
        `d-none` :
        ``

    /** @constructs **/
    useEffect(() => {
        // Initialize stars for night mode
        const starArray = []
        for (let i = 0; i < 80; i++) {
            starArray.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                twinkleDirection: Math.random() > 0.5 ? 1 : -1
            })
        }
        setStars(starArray)

        // Initialize clouds
        const cloudArray = []
        for (let i = 0; i < 5; i++) {
            cloudArray.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * (window.innerHeight * 0.4),
                width: Math.random() * 150 + 100,
                height: Math.random() * 60 + 40,
                speed: Math.random() * 0.3 + 0.1
            })
        }
        setClouds(cloudArray)

        // Initialize birds for day mode
        const birdArray = []
        for (let i = 0; i < 6; i++) {
            birdArray.push({
                x: -50 - (i * 100),
                y: Math.random() * (window.innerHeight * 0.5) + 50,
                speed: Math.random() * 1.5 + 0.5,
                wingPhase: 0
            })
        }
        setBirds(birdArray)
    }, [])

    const _step = (event) => {
        const canvas = document.getElementById(`layout-animated-background-canvas`)
        const context = canvas?.getContext("2d")

        if (!canvas || !context) return

        // Update stars twinkling
        setStars(prevStars => prevStars.map(star => {
            let newOpacity = star.opacity + (star.twinkleSpeed * star.twinkleDirection)
            let newDirection = star.twinkleDirection

            if (newOpacity >= 1) {
                newOpacity = 1
                newDirection = -1
            } else if (newOpacity <= 0.2) {
                newOpacity = 0.2
                newDirection = 1
            }

            return { ...star, opacity: newOpacity, twinkleDirection: newDirection }
        }))

        // Update clouds
        setClouds(prevClouds => prevClouds.map(cloud => {
            let newX = cloud.x + cloud.speed
            if (newX > window.innerWidth + cloud.width) {
                newX = -cloud.width
            }
            return { ...cloud, x: newX }
        }))

        // Update birds
        setBirds(prevBirds => prevBirds.map(bird => {
            let newX = bird.x + bird.speed
            let newWingPhase = bird.wingPhase + 0.2

            if (newX > window.innerWidth + 50) {
                newX = -50
            }

            return { ...bird, x: newX, wingPhase: newWingPhase }
        }))

        // Update moon/sun glow
        setMoonGlow(prev => (prev + 0.02) % (Math.PI * 2))
        setSunGlow(prev => (prev + 0.03) % (Math.PI * 2))

        _draw(canvas, context)
    }

    const _draw = (canvas, context) => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        context.clearRect(0, 0, canvas.width, canvas.height)

        // Draw background gradient
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
        if (isDarkTheme) {
            // Night sky
            gradient.addColorStop(0, '#0a0e27')
            gradient.addColorStop(0.5, '#1a1a3e')
            gradient.addColorStop(1, '#0f0f23')
        } else {
            // Day sky
            gradient.addColorStop(0, '#87CEEB')
            gradient.addColorStop(0.5, '#B0E0E6')
            gradient.addColorStop(1, '#E0F6FF')
        }
        context.fillStyle = gradient
        context.fillRect(0, 0, canvas.width, canvas.height)

        if (isDarkTheme) {
            // Draw stars
            stars.forEach(star => {
                context.beginPath()
                context.arc(star.x, star.y, star.size, 0, Math.PI * 2)
                context.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
                context.fill()

                // Add glow to bright stars
                if (star.opacity > 0.7) {
                    context.beginPath()
                    context.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
                    context.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.3})`
                    context.fill()
                }
            })

            // Draw moon
            const moonX = canvas.width * 0.8
            const moonY = canvas.height * 0.2
            const moonRadius = 50
            const glowIntensity = Math.sin(moonGlow) * 0.2 + 0.8

            // Moon glow
            const moonGlowGradient = context.createRadialGradient(
                moonX, moonY, moonRadius * 0.5,
                moonX, moonY, moonRadius * 2.5
            )
            moonGlowGradient.addColorStop(0, `rgba(255, 255, 200, ${0.4 * glowIntensity})`)
            moonGlowGradient.addColorStop(0.5, `rgba(255, 255, 200, ${0.2 * glowIntensity})`)
            moonGlowGradient.addColorStop(1, 'rgba(255, 255, 200, 0)')
            context.fillStyle = moonGlowGradient
            context.beginPath()
            context.arc(moonX, moonY, moonRadius * 2.5, 0, Math.PI * 2)
            context.fill()

            // Moon body
            context.fillStyle = '#f4f4c8'
            context.beginPath()
            context.arc(moonX, moonY, moonRadius, 0, Math.PI * 2)
            context.fill()

            // Moon craters
            context.fillStyle = 'rgba(220, 220, 180, 0.4)'
            context.beginPath()
            context.arc(moonX - 15, moonY - 10, 8, 0, Math.PI * 2)
            context.fill()
            context.beginPath()
            context.arc(moonX + 10, moonY + 15, 12, 0, Math.PI * 2)
            context.fill()
            context.beginPath()
            context.arc(moonX + 20, moonY - 20, 6, 0, Math.PI * 2)
            context.fill()
        } else {
            // Draw sun
            const sunX = canvas.width * 0.15
            const sunY = canvas.height * 0.15
            const sunRadius = 45
            const glowIntensity = Math.sin(sunGlow) * 0.3 + 0.7

            // Sun glow
            const sunGlowGradient = context.createRadialGradient(
                sunX, sunY, sunRadius * 0.3,
                sunX, sunY, sunRadius * 3
            )
            sunGlowGradient.addColorStop(0, `rgba(255, 223, 0, ${0.6 * glowIntensity})`)
            sunGlowGradient.addColorStop(0.4, `rgba(255, 200, 0, ${0.3 * glowIntensity})`)
            sunGlowGradient.addColorStop(1, 'rgba(255, 200, 0, 0)')
            context.fillStyle = sunGlowGradient
            context.beginPath()
            context.arc(sunX, sunY, sunRadius * 3, 0, Math.PI * 2)
            context.fill()

            // Sun rays (rotating)
            context.save()
            context.translate(sunX, sunY)
            context.rotate(sunGlow)
            for (let i = 0; i < 12; i++) {
                context.save()
                context.rotate((Math.PI * 2 * i) / 12)
                context.fillStyle = `rgba(255, 223, 0, ${0.4 * glowIntensity})`
                context.beginPath()
                context.moveTo(0, 0)
                context.lineTo(sunRadius + 20, -8)
                context.lineTo(sunRadius + 40, 0)
                context.lineTo(sunRadius + 20, 8)
                context.closePath()
                context.fill()
                context.restore()
            }
            context.restore()

            // Sun body
            context.fillStyle = '#FFD700'
            context.beginPath()
            context.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
            context.fill()

            // Draw birds
            birds.forEach(bird => {
                const wingOffset = Math.sin(bird.wingPhase) * 10

                context.strokeStyle = 'rgba(0, 0, 0, 0.6)'
                context.lineWidth = 2
                context.lineCap = 'round'

                // Left wing
                context.beginPath()
                context.moveTo(bird.x, bird.y)
                context.quadraticCurveTo(
                    bird.x - 10, bird.y - 5 - wingOffset,
                    bird.x - 15, bird.y - wingOffset
                )
                context.stroke()

                // Right wing
                context.beginPath()
                context.moveTo(bird.x, bird.y)
                context.quadraticCurveTo(
                    bird.x + 10, bird.y - 5 - wingOffset,
                    bird.x + 15, bird.y - wingOffset
                )
                context.stroke()
            })
        }

        // Draw clouds
        clouds.forEach(cloud => {
            context.fillStyle = isDarkTheme
                ? 'rgba(100, 100, 120, 0.15)'
                : 'rgba(255, 255, 255, 0.8)'

            // Draw fluffy cloud using circles
            for (let i = 0; i < 5; i++) {
                const offsetX = (i - 2.5) * (cloud.width / 5)
                const radius = cloud.height / 2 + Math.random() * 10
                context.beginPath()
                context.arc(
                    cloud.x + cloud.width / 2 + offsetX,
                    cloud.y + cloud.height / 2,
                    radius,
                    0, Math.PI * 2
                )
                context.fill()
            }
        })
    }

    return (
        <Animable className={`layout-animated-background ${visibilityClass}`}
            animationId={`layout-animated-background`}
            onEnterFrame={_step}>
            <canvas id={`layout-animated-background-canvas`} />
        </Animable>
    )
}

export default LayoutAnimatedBackground