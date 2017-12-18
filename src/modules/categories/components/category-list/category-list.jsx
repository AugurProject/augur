import React from 'react'
import PropTypes from 'prop-types'

import Category from 'modules/categories/components/category/category'

import Styles from 'modules/categories/components/category-list/category-list.styles'

const CategoryList = p => (
  <div>
    {[...Array(p.boundedLength)].map((_, i) => {
      const categoryIndex = (p.lowerBound - 1) + i
      const category = (p.categories && p.categories[categoryIndex]) ? p.categories[categoryIndex] : null

      return (
        <div
          className={Styles.CategoryList__categorywrap}
          key={category !== null ? JSON.stringify(category) : `${JSON.stringify(category)}${categoryIndex}`}
        >
          <Category
            category={category !== null ? category.category : 'null-category'}
            popularity={category !== null ? category.popularity : 0}
          />
        </div>
      )
    })}
  </div>
)

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
  lowerBound: PropTypes.number,
  boundedLength: PropTypes.number
}

export default CategoryList
