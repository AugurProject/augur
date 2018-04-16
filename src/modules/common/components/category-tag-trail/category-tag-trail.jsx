import React from 'react'
import PropTypes from 'prop-types'

import { isEmpty } from 'lodash'

import Styles from 'modules/common/components/category-tag-trail/category-tag-trail.styles'
import WordTrail from 'src/modules/common/components/word-trail/word-trail'

export const CategoryTagTrail = ({ categories, tags }) => (
  <div className={Styles.CategoryTagTrail}>
    <WordTrail items={categories} label="Categories" />
    { !isEmpty(tags) && <WordTrail items={tags} label="Tags" /> }
  </div>
)

CategoryTagTrail.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
  tags: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
}
