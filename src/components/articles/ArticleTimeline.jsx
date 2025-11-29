import "./ArticleTimeline.scss"
import "/src/styles/innovative-animations.scss"
import React, { useEffect, useState } from 'react'
import Article from "/src/components/articles/base/Article.jsx"
import AvatarView from "/src/components/generic/AvatarView.jsx"
import { ArticleItemInfoForTimelines, ArticleItemInfoForTimelinesHeader, ArticleItemInfoForTimelinesTagsFooter, ArticleItemInfoForTimelinesBody } from "/src/components/articles/partials/ArticleItemInfoForTimelines.jsx"

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleTimeline({ dataWrapper, id }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)

    return (
        <Article id={dataWrapper.uniqueId}
            type={Article.Types.SPACING_DEFAULT}
            dataWrapper={dataWrapper}
            className={`article-timeline`}
            selectedItemCategoryId={selectedItemCategoryId}
            setSelectedItemCategoryId={setSelectedItemCategoryId}>

            {/* Innovative Animation: Parallax Floating Icons */}
            <div className="parallax-icons-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                <i className="fa-solid fa-graduation-cap" style={{ position: 'absolute', top: '10%', left: '5%', fontSize: '3rem', opacity: 0.1, animation: 'floatIcon 6s ease-in-out infinite' }}></i>
                <i className="fa-solid fa-book" style={{ position: 'absolute', top: '40%', right: '10%', fontSize: '2.5rem', opacity: 0.1, animation: 'floatIcon 8s ease-in-out infinite', animationDelay: '1s' }}></i>
                <i className="fa-solid fa-code" style={{ position: 'absolute', bottom: '20%', left: '15%', fontSize: '2rem', opacity: 0.1, animation: 'floatIcon 7s ease-in-out infinite', animationDelay: '2s' }}></i>
                <i className="fa-solid fa-lightbulb" style={{ position: 'absolute', bottom: '50%', right: '20%', fontSize: '2.2rem', opacity: 0.1, animation: 'floatIcon 9s ease-in-out infinite', animationDelay: '0.5s' }}></i>
            </div>

            <ArticleTimelineItems dataWrapper={dataWrapper}
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
function ArticleTimelineItems({ dataWrapper, selectedItemCategoryId }) {
    const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)

    return (
        <ul className={`article-timeline-items`}>
            {filteredItems.map((itemWrapper, key) => (
                <ArticleTimelineItem itemWrapper={itemWrapper}
                    key={key} />
            ))}

            <ArticleTimelineTrailingItem itemWrapper={null} />
        </ul>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticleTimelineItem({ itemWrapper }) {
    return (
        <li className={`article-timeline-item`}>
            <AvatarView src={itemWrapper?.img}
                faIcon={itemWrapper?.faIcon}
                style={itemWrapper?.faIconStyle}
                alt={itemWrapper?.imageAlt}
                className={`article-timeline-item-avatar`} />

            <ArticleItemInfoForTimelines className={`article-timeline-item-content`}>
                <ArticleItemInfoForTimelinesHeader itemWrapper={itemWrapper}
                    dateInterval={true} />

                <ArticleItemInfoForTimelinesBody itemWrapper={itemWrapper} />

                <ArticleItemInfoForTimelinesTagsFooter itemWrapper={itemWrapper} />
            </ArticleItemInfoForTimelines>
        </li>
    )
}

/**
 * @return {JSX.Element}
 * @constructor
 */
function ArticleTimelineTrailingItem() {
    return (
        <li className={`article-timeline-item article-timeline-item-trailing`}>
            <AvatarView className={`article-timeline-item-avatar`} />
        </li>
    )
}

export default ArticleTimeline
