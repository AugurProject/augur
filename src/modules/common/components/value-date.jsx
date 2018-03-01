import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ValueDate = p => (
  <span className={classNames('value-date', p.className)}>
    {p.formatted}
  </span>
)

ValueDate.propTypes = {
  className: PropTypes.string,
  value: PropTypes.object,
  formatted: PropTypes.string,
}

export default ValueDate
