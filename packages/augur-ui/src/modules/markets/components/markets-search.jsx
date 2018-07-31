import React from 'react'
import PropTypes from 'prop-types'
import Input from 'modules/common/components/input/input'

const MarketsSearch = p => (
  <article className={`search-input ${p.className}`} >
    <Input
      isSearch
      isClearable
      placeholder="Search Markets"
      value={p.tags}
      onChange={p.onChangeTags}
    />
  </article>
)

MarketsSearch.propTypes = {
  className: PropTypes.string,
  tags: PropTypes.string,
  onChangeTags: PropTypes.func,
}

export default MarketsSearch
