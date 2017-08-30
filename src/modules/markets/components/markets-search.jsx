import React from 'react'
import PropTypes from 'prop-types'
import Input from 'modules/common/components/input'

const MarketsSearch = p => (
  <article className={`search-input ${p.className}`} >
    <Input
      isSearch
      isClearable
      placeholder="Search Markets"
      value={p.keywords}
      onChange={p.onChangeKeywords}
    />
  </article>
)

MarketsSearch.propTypes = {
  className: PropTypes.string,
  keywords: PropTypes.string,
  onChangeKeywords: PropTypes.func
}

export default MarketsSearch
