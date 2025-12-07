import "./SkillConstellation.scss"
import React, { useState, useEffect, useRef } from 'react'
import { useData } from "/src/providers/DataProvider.jsx"
import { useUtils } from "/src/hooks/utils.js"

/**
 * 3D Skill Constellation Component
 * Interactive 3D visualization of skills as connected nodes
 */
function SkillConstellation() {
    const [skills, setSkills] = useState([])
    const [hoveredSkill, setHoveredSkill] = useState(null)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const [isAutoRotating, setIsAutoRotating] = useState(true)
    const containerRef = useRef(null)
    const data = useData()
    const utils = useUtils()

    useEffect(() => {
        // Load skills from data
        if (data) {
            utils.file.loadJSON("/data/sections/skills.json").then(skillsData => {
                if (skillsData && skillsData.articles) {
                    const allSkills = []
                    skillsData.articles.forEach(article => {
                        if (article.items) {
                            article.items.forEach(item => {
                                allSkills.push({
                                    id: `${article.id}-${item.id}`,
                                    title: item.locales.en.title,
                                    percentage: item.percentage || 50,
                                    icon: item.faIcon,
                                    color: item.faIconColors?.fill || '#00ff41',
                                    category: article.locales.en.title
                                })
                            })
                        }
                    })
                    setSkills(allSkills)
                }
            })
        }
    }, [data])

    useEffect(() => {
        if (!isAutoRotating) return

        const interval = setInterval(() => {
            setRotation(prev => ({
                x: prev.x + 0.2,
                y: prev.y + 0.3
            }))
        }, 50)

        return () => clearInterval(interval)
    }, [isAutoRotating])

    const handleMouseMove = (e) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = (e.clientX - centerX) / rect.width
        const deltaY = (e.clientY - centerY) / rect.height

        setRotation({
            x: deltaY * 30,
            y: deltaX * 30
        })
        setIsAutoRotating(false)
    }

    const handleMouseLeave = () => {
        setIsAutoRotating(true)
    }

    // Calculate 3D positions for skills (sphere distribution)
    const getSkillPosition = (index, total) => {
        const phi = Math.acos(-1 + (2 * index) / total)
        const theta = Math.sqrt(total * Math.PI) * phi

        return {
            x: Math.cos(theta) * Math.sin(phi),
            y: Math.sin(theta) * Math.sin(phi),
            z: Math.cos(phi)
        }
    }

    return (
        <div className="skill-constellation-wrapper">
            <div
                ref={containerRef}
                className="skill-constellation"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className="constellation-scene"
                    style={{
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                    }}
                >
                    {/* Connection Lines */}
                    <svg className="constellation-connections">
                        {skills.map((skill, i) => {
                            const pos1 = getSkillPosition(i, skills.length)
                            return skills.slice(i + 1).map((otherSkill, j) => {
                                const pos2 = getSkillPosition(i + j + 1, skills.length)
                                const distance = Math.sqrt(
                                    Math.pow(pos1.x - pos2.x, 2) +
                                    Math.pow(pos1.y - pos2.y, 2) +
                                    Math.pow(pos1.z - pos2.z, 2)
                                )

                                // Only draw connections between nearby skills
                                if (distance < 0.8) {
                                    return (
                                        <line
                                            key={`${skill.id}-${otherSkill.id}`}
                                            x1={`${(pos1.x + 1) * 50}%`}
                                            y1={`${(pos1.y + 1) * 50}%`}
                                            x2={`${(pos2.x + 1) * 50}%`}
                                            y2={`${(pos2.y + 1) * 50}%`}
                                            stroke="rgba(0, 255, 65, 0.2)"
                                            strokeWidth="1"
                                        />
                                    )
                                }
                                return null
                            })
                        })}
                    </svg>

                    {/* Skill Nodes */}
                    {skills.map((skill, index) => {
                        const pos = getSkillPosition(index, skills.length)
                        const scale = (pos.z + 1) / 2 // Depth scaling
                        const size = 60 + (skill.percentage / 100) * 40

                        return (
                            <div
                                key={skill.id}
                                className={`skill-node ${hoveredSkill === skill.id ? 'hovered' : ''}`}
                                style={{
                                    left: `${(pos.x + 1) * 50}%`,
                                    top: `${(pos.y + 1) * 50}%`,
                                    transform: `translate(-50%, -50%) translateZ(${pos.z * 100}px) scale(${scale})`,
                                    width: `${size}px`,
                                    height: `${size}px`,
                                    zIndex: Math.floor(pos.z * 100)
                                }}
                                onMouseEnter={() => setHoveredSkill(skill.id)}
                                onMouseLeave={() => setHoveredSkill(null)}
                            >
                                <div className="skill-node-inner" style={{ borderColor: skill.color }}>
                                    <i className={skill.icon} style={{ color: skill.color }}></i>
                                    <div className="skill-node-glow" style={{ backgroundColor: skill.color }}></div>
                                </div>

                                {hoveredSkill === skill.id && (
                                    <div className="skill-tooltip">
                                        <div className="skill-tooltip-title">{skill.title}</div>
                                        <div className="skill-tooltip-category">{skill.category}</div>
                                        <div className="skill-tooltip-percentage">{skill.percentage}%</div>
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* Orbital Rings */}
                    <div className="orbital-ring ring-1"></div>
                    <div className="orbital-ring ring-2"></div>
                    <div className="orbital-ring ring-3"></div>
                </div>

                {/* Info Text */}
                <div className="constellation-info">
                    <h3>Interactive Skill Constellation</h3>
                    <p>Hover to explore • Move mouse to rotate</p>
                </div>
            </div>
        </div>
    )
}

export default SkillConstellation
