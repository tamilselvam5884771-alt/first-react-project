import "./ArticleText.scss"
import "/src/styles/innovative-animations.scss"
import React, { useEffect, useState } from 'react'
import Article from "/src/components/articles/base/Article.jsx"
import AvatarView from "/src/components/generic/AvatarView.jsx"
import { useTheme } from "/src/providers/ThemeProvider.jsx"

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleText({ dataWrapper, id }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)
    const theme = useTheme()
    const isDark = theme.getSelectedTheme()?.dark

    return (
        <Article id={dataWrapper.uniqueId}
            type={Article.Types.SPACING_DEFAULT}
            dataWrapper={dataWrapper}
            className={`article-text`}
            selectedItemCategoryId={selectedItemCategoryId}
            setSelectedItemCategoryId={setSelectedItemCategoryId}>

            {/* Innovative Animation: Floating Background Keywords */}
            <div className="floating-background-text">
                <span className={`floating-word ${!isDark ? 'theme-light' : ''}`} style={{ top: '10%', left: '5%', animationDelay: '0s' }}>DEVELOPER</span>
                <span className={`floating-word ${!isDark ? 'theme-light' : ''}`} style={{ top: '30%', right: '10%', animationDelay: '5s' }}>CREATOR</span>
                <span className={`floating-word ${!isDark ? 'theme-light' : ''}`} style={{ bottom: '20%', left: '15%', animationDelay: '10s' }}>DESIGN</span>
                <span className={`floating-word ${!isDark ? 'theme-light' : ''}`} style={{ bottom: '40%', right: '20%', animationDelay: '15s' }}>CODE</span>
            </div>

            <ArticleTextItems dataWrapper={dataWrapper}
                selectedItemCategoryId={selectedItemCategoryId} />
        </Article>
    )
}

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {String} selectedItemCategoryId
 * @return {JSX.Element}
 * @constructor
 */
function ArticleTextItems({ dataWrapper, selectedItemCategoryId }) {
    const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)

    return (
        <div className={`article-text-items`}>
            {filteredItems.map((itemWrapper, key) => (
                <ArticleTextItem itemWrapper={itemWrapper}
                    key={key} />
            ))}
        </div>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticleTextItem({ itemWrapper }) {
    const positioningClass = itemWrapper.id % 2 === 0 ?
        `article-text-item-reverse` :
        ``

    return (
        <div className={`article-text-item ${positioningClass}`}>
            <div className={`article-text-avatar-view-wrapper`}>
                <AvatarView className={`article-text-avatar-view`}
                    src={itemWrapper.img}
                    faIcon={itemWrapper.faIconWithFallback}
                    style={itemWrapper.faIconStyle}
                    alt={itemWrapper.imageAlt} />
            </div>

            <div className={`article-text-excerpt last-p-no-margin text-3`}
                dangerouslySetInnerHTML={{ __html: itemWrapper.locales.text || itemWrapper.placeholder }} />
        </div>
    )
}

export default ArticleText
