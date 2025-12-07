import "./InteractiveTerminal.scss"
import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from "/src/providers/NavigationProvider.jsx"
import { useUtils } from "/src/hooks/utils.js"

/**
 * Interactive Terminal Component
 * A draggable, retro-style terminal for portfolio navigation
 */
function InteractiveTerminal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [position, setPosition] = useState({ x: window.innerWidth - 620, y: window.innerHeight - 420 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [input, setInput] = useState('')
    const [history, setHistory] = useState([])
    const [commandHistory, setCommandHistory] = useState([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const [commands, setCommands] = useState(null)

    const navigation = useNavigation()
    const utils = useUtils()
    const inputRef = useRef(null)
    const terminalRef = useRef(null)
    const outputRef = useRef(null)

    // Load terminal commands
    useEffect(() => {
        utils.file.loadJSON("/data/terminal-commands.json").then(data => {
            if (data) {
                setCommands(data)
                setHistory([{ type: 'output', text: data.welcomeMessage }])
            }
        })
    }, [])

    // Auto-scroll to bottom
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight
        }
    }, [history])

    // Focus input when terminal opens
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen, isMinimized])

    // Handle dragging
    useEffect(() => {
        if (!isDragging) return

        const handleMouseMove = (e) => {
            setPosition({
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y
            })
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, dragOffset])

    const handleDragStart = (e) => {
        if (e.target.closest('.terminal-header')) {
            const rect = terminalRef.current.getBoundingClientRect()
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            })
            setIsDragging(true)
        }
    }

    const executeCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase()

        if (!trimmedCmd) return

        // Add to command history
        setCommandHistory(prev => [...prev, cmd])
        setHistoryIndex(-1)

        // Add command to output
        const newHistory = [...history, { type: 'command', text: `${commands.prompt} ${cmd}` }]

        if (!commands.commands[trimmedCmd]) {
            // Command not found
            const errorMsg = commands.errorMessages.commandNotFound.replace('{{COMMAND}}', trimmedCmd)
            setHistory([...newHistory, { type: 'error', text: errorMsg }])
            return
        }

        const command = commands.commands[trimmedCmd]
        let response = command.response

        // Handle special actions
        if (command.action === 'clear') {
            setHistory([])
            return
        }

        if (command.action === 'date') {
            response = new Date().toLocaleString()
        }

        if (command.action === 'navigate' && navigation) {
            // Navigate to section
            const sections = navigation.sectionLinks
            const targetSection = sections.find(s => s.id === command.target)
            if (targetSection) {
                navigation.navigateToSection(targetSection)
            }
        }

        setHistory([...newHistory, { type: 'output', text: response }])
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeCommand(input)
            setInput('')
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (commandHistory.length > 0) {
                const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
                setHistoryIndex(newIndex)
                setInput(commandHistory[newIndex])
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1
                if (newIndex >= commandHistory.length) {
                    setHistoryIndex(-1)
                    setInput('')
                } else {
                    setHistoryIndex(newIndex)
                    setInput(commandHistory[newIndex])
                }
            }
        }
    }

    if (!commands) return null

    return (
        <>
            {/* Terminal Toggle Button */}
            {!isOpen && (
                <button
                    className="terminal-toggle-btn"
                    onClick={() => setIsOpen(true)}
                    title="Open Terminal"
                >
                    <i className="fa-solid fa-terminal"></i>
                </button>
            )}

            {/* Terminal Window */}
            {isOpen && (
                <div
                    ref={terminalRef}
                    className={`interactive-terminal ${isMinimized ? 'minimized' : ''}`}
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`
                    }}
                >
                    {/* Terminal Header */}
                    <div
                        className="terminal-header"
                        onMouseDown={handleDragStart}
                    >
                        <div className="terminal-title">
                            <i className="fa-solid fa-terminal"></i>
                            <span>Terminal - Hari's Portfolio</span>
                        </div>
                        <div className="terminal-controls">
                            <button
                                className="terminal-btn minimize"
                                onClick={() => setIsMinimized(!isMinimized)}
                                title={isMinimized ? "Maximize" : "Minimize"}
                            >
                                <i className={`fa-solid ${isMinimized ? 'fa-window-maximize' : 'fa-window-minimize'}`}></i>
                            </button>
                            <button
                                className="terminal-btn close"
                                onClick={() => setIsOpen(false)}
                                title="Close"
                            >
                                <i className="fa-solid fa-times"></i>
                            </button>
                        </div>
                    </div>

                    {/* Terminal Body */}
                    {!isMinimized && (
                        <div className="terminal-body">
                            <div className="terminal-output" ref={outputRef}>
                                {history.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`terminal-line ${item.type}`}
                                    >
                                        <pre>{item.text}</pre>
                                    </div>
                                ))}
                            </div>
                            <div className="terminal-input-line">
                                <span className="terminal-prompt">{commands.prompt}</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="terminal-input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default InteractiveTerminal
