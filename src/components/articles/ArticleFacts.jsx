import "./ArticleFacts.scss"
import React, { useEffect, useState } from 'react'
import Article from "/src/components/articles/base/Article.jsx"
import Swipeable from "/src/components/capabilities/Swipeable.jsx"
import { useConstants } from "/src/hooks/constants.js"
import AvatarView from "/src/components/generic/AvatarView.jsx"

/**
 * @param {ArticleDataWrapper} dataWrapper
 * @param {Number} id
 * @return {JSX.Element}
 * @constructor
 */
function ArticleFacts({ dataWrapper, id }) {
    const [selectedItemCategoryId, setSelectedItemCategoryId] = useState(null)

    return (
        <Article id={dataWrapper.uniqueId}
            type={Article.Types.SPACING_DEFAULT}
            dataWrapper={dataWrapper}
            className={`article-facts`}
            selectedItemCategoryId={selectedItemCategoryId}
            setSelectedItemCategoryId={setSelectedItemCategoryId}>
            <ArticleFactsItems dataWrapper={dataWrapper}
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
function ArticleFactsItems({ dataWrapper, selectedItemCategoryId }) {
    const constants = useConstants()

    const filteredItems = dataWrapper.getOrderedItemsFilteredBy(selectedItemCategoryId)

    return (
        <Swipeable className={`article-facts-items`}
            slidesPerView={4}
            loop={true}
            breakpoints={constants.SWIPER_BREAKPOINTS_FOR_FOUR_SLIDES}>
            {filteredItems.map((itemWrapper, key) => (
                <ArticleFactsItem itemWrapper={itemWrapper}
                    key={key} />
            ))}
        </Swipeable>
    )
}

/**
 * @param {ArticleItemDataWrapper} itemWrapper
 * @return {JSX.Element}
 * @constructor
 */
function ArticleFactsItem({ itemWrapper }) {
    return (
        <div className={`article-facts-item`}>
            <div className="article-facts-item-card" style={{ backgroundImage: `url(${itemWrapper.img})` }}>
                <div className="article-facts-item-content">
                    <h6 className={`article-facts-item-title`}
                        dangerouslySetInnerHTML={{ __html: itemWrapper.locales.title || itemWrapper.placeholder }} />

                    <div className={`article-facts-item-description text-3`}
                        dangerouslySetInnerHTML={{ __html: itemWrapper.locales.text }} />
                </div>
            </div>
        </div>
    )
}

export default ArticleFacts
