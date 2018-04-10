import React from 'react'
import PropTypes from 'prop-types'

import Category from 'modules/categories/components/category/category'

import { NULL_CATEGORY } from 'modules/categories/constants/category-popularity-change'
import Styles from 'modules/categories/components/category-list/category-list.styles'

const CategoryList = (p) => {
  const isShortList = (p.categories.length <= 2)
  const arrayLength = isShortList ? p.categories.length : p.boundedLength
  const categoryStyling = isShortList ? Styles['CategoryList__categorywrap-short'] : Styles.CategoryList__categorywrap

  return (
    <div className={Styles.CategoryList}>
      {[...Array(arrayLength)].map((_, i) => {
        const categoryIndex = (p.lowerBound - 1) + i
        const category = (p.categories && p.categories[categoryIndex]) ? p.categories[categoryIndex] : null

        return (
          <div
            className={categoryStyling}
            key={category ? JSON.stringify(category) : `${JSON.stringify(category)}${categoryIndex}`}
          >
            <Category
              category={(category && !!category.category) ? category.category : NULL_CATEGORY}
              popularity={(category && !!category.popularity) ? category.popularity.toString() : '0'}
            />
          </div>
        )
      })}
    </div>
  )
}

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
  lowerBound: PropTypes.number,
  boundedLength: PropTypes.number,
}

export default CategoryList
