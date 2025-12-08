import "/src/styles/app.scss"
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useApi } from "/src/hooks/api.js"
import { useConstants } from "/src/hooks/constants.js"
import { useUtils } from "/src/hooks/utils.js"
import Preloader from "/src/components/loaders/Preloader.jsx"
import DataProvider, { useData } from "/src/providers/DataProvider.jsx"
import LanguageProvider from "/src/providers/LanguageProvider.jsx"
import ViewportProvider from "/src/providers/ViewportProvider.jsx"
import ThemeProvider from "/src/providers/ThemeProvider.jsx"
import LocationProvider from "/src/providers/LocationProvider.jsx"
import FeedbacksProvider from "/src/providers/FeedbacksProvider.jsx"
import InputProvider from "/src/providers/InputProvider.jsx"
import NavigationProvider from "/src/providers/NavigationProvider.jsx"
import Portfolio from "/src/components/Portfolio.jsx"
import AnimatedBackground from "/src/components/AnimatedBackground.jsx"
import CartoonCharacter from "/src/components/CartoonCharacter.jsx"
import PageTransition from "/src/components/PageTransition.jsx"
import ClickSpark from "/src/components/ClickSpark.jsx"
import RocketLaunch from "/src/components/RocketLaunch.jsx"
import GitHubActivityFeed from "/src/components/GitHubActivityFeed.jsx"
import ScrollProgress from "/src/components/ScrollProgress.jsx"


/**
 * This is the main app component. It wraps the content of the app with AppEssentialsWrapper and AppCapabilitiesWrapper.
 * @return {JSX.Element}
 * @constructor
 */
const App = () => {
    return (
        <>
            <AnimatedBackground />
            <CartoonCharacter />
            <ClickSpark />
            <RocketLaunch />
            <GitHubActivityFeed />
            <ScrollProgress />
            <AppEssentialsWrapper>
                <AppCapabilitiesWrapper>
                    <Portfolio />
                </AppCapabilitiesWrapper>
            </AppEssentialsWrapper>
        </>
    )
}

/**
 * @return {JSX.Element}
 * @constructor
 */
const AppEssentialsWrapper = ({ children }) => {
    const api = useApi()
    const utils = useUtils()
    const constants = useConstants()

    const [settings, setSettings] = useState()

    useEffect(() => {
        if (window.location.pathname !== utils.file.BASE_URL)
            window.history.pushState({}, '', utils.file.BASE_URL)

        utils.file.loadJSON("/data/settings.json").then(response => {
            if (!response) {
                console.error("Failed to load settings");
                setSettings({ error: "Failed to load settings.json" });
                return;
            }
            _applyDeveloperSettings(response)
            setSettings(response)

            const consoleMessageForDevelopers = response?.consoleMessageForDevelopers
            if (consoleMessageForDevelopers) {
                const primaryColor = utils.css.getRootSCSSVariable('--bs-primary')
                utils.log.info(consoleMessageForDevelopers.title, consoleMessageForDevelopers.items, primaryColor)
            }
        }).catch(err => {
            console.error("Error loading settings:", err);
            setSettings({ error: err.message });
        })

        api.analytics.reportVisit().then(() => { })
    }, [])

    const _applyDeveloperSettings = (settings) => {
        const developerSettings = settings?.developerSettings
        const debugMode = developerSettings?.debugMode
        const fakeEmailRequests = developerSettings?.fakeEmailRequests
        const stayOnThePreloaderScreen = developerSettings?.stayOnThePreloaderScreen

        if (constants.PRODUCTION_MODE)
            return settings

        if (debugMode) {
            settings.preloaderSettings.enabled = stayOnThePreloaderScreen
            settings.templateSettings.backgroundStyle = "plain"
            utils.storage.setWindowVariable("suspendAnimations", true)
            utils.log.warn("DataProvider", "Debug Mode is enabled, so transitions and animated content—such as the preloader screen, background animations, and role text typing—will be skipped. You can disable it manually on settings.json or by running the app on PROD_MODE, which disables it by default.")
        }

        if (fakeEmailRequests) {
            utils.storage.setWindowVariable("fakeEmailRequests", true)
            utils.log.warn("DataProvider", "Fake email requests are enabled. This is only for development purposes and will be disabled automatically in production.")
        }

        if (stayOnThePreloaderScreen) {
            utils.storage.setWindowVariable("stayOnThePreloaderScreen", true)
            utils.log.warn("DataProvider", "Preloader screen will be displayed indefinitely because the developer flag 'stayOnThePreloaderScreen' is on. This is only for development purposes and will be disabled automatically in production.")
        }
    }

    if (settings?.error) {
        return (
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'red',
                background: 'white',
                padding: '20px',
                zIndex: 9999
            }}>
                <h1>Error Loading Application</h1>
                <p>{settings.error}</p>
                <p>Please check the console for more details.</p>
            </div>
        )
    }

    return (
        <StrictMode>
            {settings && (
                <Preloader preloaderSettings={settings["preloaderSettings"]}>
                    <DataProvider settings={settings}>
                        {children}
                    </DataProvider>
                </Preloader>
            )}
        </StrictMode>
    )
}

/**
 * This stack will wrap the app capabilities - these will be initialized after the app has booted up and loaded its essential components.
 * @param children
 * @return {JSX.Element}
 * @constructor
 */
const AppCapabilitiesWrapper = ({ children }) => {
    const data = useData()

    const [selectedThemeId, setSelectedThemeId] = useState(null)

    const appSettings = data.getSettings()
    const appStrings = data.getStrings()
    const appSections = data.getSections()
    const appCategories = data.getCategories()

    const supportedLanguages = appSettings["supportedLanguages"]
    const supportedThemes = appSettings["supportedThemes"]
    const defaultLanguageId = appSettings["templateSettings"].defaultLanguageId
    const defaultThemeId = appSettings["templateSettings"].defaultThemeId
    const animatedCursorEnabled = appSettings["templateSettings"].animatedCursorEnabled
    const showSpinnerOnThemeChange = appSettings["templateSettings"].showSpinnerOnThemeChange

    return (
        <LanguageProvider supportedLanguages={supportedLanguages}
            defaultLanguageId={defaultLanguageId}
            appStrings={appStrings}
            selectedThemeId={selectedThemeId}>
            <ViewportProvider>
                <InputProvider>
                    <FeedbacksProvider canHaveAnimatedCursor={animatedCursorEnabled}>
                        <ThemeProvider supportedThemes={supportedThemes}
                            defaultThemeId={defaultThemeId}
                            showSpinnerOnThemeChange={showSpinnerOnThemeChange}
                            onThemeChanged={setSelectedThemeId}>
                            <LocationProvider sections={appSections}
                                categories={appCategories}>
                                <NavigationProvider sections={appSections}
                                    categories={appCategories}>
                                    <PageTransition />
                                    {children}
                                </NavigationProvider>
                            </LocationProvider>
                        </ThemeProvider>
                    </FeedbacksProvider>
                </InputProvider>
            </ViewportProvider>
        </LanguageProvider>
    )
}

/** Initialization Script... **/
createRoot(document.getElementById('root')).render(<App />)

