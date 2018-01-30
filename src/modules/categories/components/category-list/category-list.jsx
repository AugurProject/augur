import React from 'react'
import PropTypes from 'prop-types'

import Category from 'modules/categories/components/category/category'

import Styles from 'modules/categories/components/category-list/category-list.styles'

const CategoryList = p => {
  const isSingle = (p.categories.length === 1)
  const isDouble = (p.categories.length === 2)

  return (<div>
    {isDouble && <div
      className={Styles['CategoryList__categorywrap-double']}
      key={`${null}"null-0"`}
    >
      <Category
        category="null-category"
        popularity={0}
      />
    </div>}
    {[...Array(p.boundedLength)].map((_, i) => {
      let categoryIndex = (p.lowerBound - 1) + i
      let categoryStyling = Styles.CategoryList__categorywrap

      if (isSingle) {
        categoryIndex--
      }

      const isLimitedCategories = ((p.categories.length <= 2) && (i <= 2))
      const category = (p.categories && p.categories[categoryIndex]) ? p.categories[categoryIndex] : null


      if (isLimitedCategories) {
        categoryStyling = isSingle ? Styles['CategoryList__categorywrap-single'] : Styles['CategoryList__categorywrap-double']
      }

      return (
        <div
          className={categoryStyling}
          key={category !== null ? JSON.stringify(category) : `${JSON.stringify(category)}${categoryIndex}`}
        >
          <Category
            category={category !== null ? category.category : 'null-category'}
            popularity={category !== null ? category.popularity : 0}
          />
        </div>
      )
    })}
  </div>)
}

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
  lowerBound: PropTypes.number,
  boundedLength: PropTypes.number
}

export default CategoryList
