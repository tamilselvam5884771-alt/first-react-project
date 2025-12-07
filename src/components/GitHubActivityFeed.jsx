import "./GitHubActivityFeed.scss"
import React, { useState, useEffect } from 'react'
import { useUtils } from "/src/hooks/utils.js"

/**
 * GitHub Activity Feed Component
 * Displays real-time GitHub activity and contributions
 */
function GitHubActivityFeed() {
    const [config, setConfig] = useState(null)
    const [activities, setActivities] = useState([])
    const [stats, setStats] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isMinimized, setIsMinimized] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(null)
    const utils = useUtils()

    useEffect(() => {
        // Load GitHub config
        utils.file.loadJSON("/data/github-config.json").then(data => {
            if (data) {
                setConfig(data)
                fetchGitHubData(data)
            }
        })
    }, [])

    useEffect(() => {
        if (!config) return

        // Auto-refresh
        const interval = setInterval(() => {
            fetchGitHubData(config)
        }, config.refreshInterval || 300000) // Default 5 minutes

        return () => clearInterval(interval)
    }, [config])

    const fetchGitHubData = async (cfg) => {
        try {
            setIsLoading(true)

            // Fetch user data
            const userResponse = await fetch(`https://api.github.com/users/${cfg.username}`)
            const userData = await userResponse.json()

            // Fetch recent events
            const eventsResponse = await fetch(`https://api.github.com/users/${cfg.username}/events/public`)
            const eventsData = await eventsResponse.json()

            // Process events
            const processedActivities = eventsData
                .filter(event => ['PushEvent', 'CreateEvent', 'PullRequestEvent'].includes(event.type))
                .slice(0, cfg.maxCommits || 5)
                .map(event => ({
                    id: event.id,
                    type: event.type,
                    repo: event.repo.name,
                    message: getEventMessage(event),
                    date: new Date(event.created_at),
                    url: `https://github.com/${event.repo.name}`
                }))

            setActivities(processedActivities)
            setStats({
                repos: userData.public_repos,
                followers: userData.followers,
                following: userData.following
            })
            setLastUpdate(new Date())
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching GitHub data:', error)
            // Set mock data for demo
            setActivities([
                {
                    id: 1,
                    type: 'PushEvent',
                    repo: 'first-react-project',
                    message: 'Update project with latest changes',
                    date: new Date(),
                    url: 'https://github.com/tamilselvam5884771-alt/first-react-project'
                }
            ])
            setStats({
                repos: 5,
                followers: 10,
                following: 15
            })
            setIsLoading(false)
        }
    }

    const getEventMessage = (event) => {
        switch (event.type) {
            case 'PushEvent':
                const commits = event.payload.commits || []
                return commits[0]?.message || 'Pushed commits'
            case 'CreateEvent':
                return `Created ${event.payload.ref_type}: ${event.payload.ref || ''}`
            case 'PullRequestEvent':
                return `${event.payload.action} pull request`
            default:
                return 'Activity'
        }
    }

    const getEventIcon = (type) => {
        switch (type) {
            case 'PushEvent':
                return 'fa-solid fa-code-commit'
            case 'CreateEvent':
                return 'fa-solid fa-code-branch'
            case 'PullRequestEvent':
                return 'fa-solid fa-code-pull-request'
            default:
                return 'fa-solid fa-circle'
        }
    }

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000)

        if (seconds < 60) return `${seconds}s ago`
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
        return `${Math.floor(seconds / 86400)}d ago`
    }

    if (!config) return null

    return (
        <div className={`github-activity-feed ${isMinimized ? 'minimized' : ''}`}>
            {/* Header */}
            <div className="github-feed-header">
                <div className="github-feed-title">
                    <i className="fa-brands fa-github"></i>
                    <span>GitHub Activity</span>
                    {lastUpdate && (
                        <span className="last-update" title={lastUpdate.toLocaleString()}>
                            <i className="fa-solid fa-circle-dot"></i>
                        </span>
                    )}
                </div>
                <button
                    className="github-feed-toggle"
                    onClick={() => setIsMinimized(!isMinimized)}
                    title={isMinimized ? "Expand" : "Minimize"}
                >
                    <i className={`fa-solid ${isMinimized ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>
            </div>

            {/* Body */}
            {!isMinimized && (
                <div className="github-feed-body">
                    {/* Stats */}
                    {stats && (
                        <div className="github-stats">
                            <div className="github-stat">
                                <i className="fa-solid fa-book"></i>
                                <span>{stats.repos}</span>
                                <label>Repos</label>
                            </div>
                            <div className="github-stat">
                                <i className="fa-solid fa-users"></i>
                                <span>{stats.followers}</span>
                                <label>Followers</label>
                            </div>
                            <div className="github-stat">
                                <i className="fa-solid fa-user-plus"></i>
                                <span>{stats.following}</span>
                                <label>Following</label>
                            </div>
                        </div>
                    )}

                    {/* Activities */}
                    <div className="github-activities">
                        {isLoading ? (
                            <div className="github-loading">
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                <span>Loading activities...</span>
                            </div>
                        ) : activities.length > 0 ? (
                            activities.map(activity => (
                                <a
                                    key={activity.id}
                                    href={activity.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="github-activity-card"
                                >
                                    <div className="activity-icon">
                                        <i className={getEventIcon(activity.type)}></i>
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-repo">{activity.repo}</div>
                                        <div className="activity-message">{activity.message}</div>
                                        <div className="activity-time">{formatTimeAgo(activity.date)}</div>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <div className="github-no-activity">
                                <i className="fa-solid fa-inbox"></i>
                                <span>No recent activity</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default GitHubActivityFeed
