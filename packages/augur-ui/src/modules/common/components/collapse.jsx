// Provides collapsible wrapper (default is div)
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Collapse = p => (
  <div className={classNames('collapse', { displayNone: !p.isOpen })} >
    {p.children}
  </div>
)

Collapse.propTypes = {
  isOpen: PropTypes.bool,
  component: PropTypes.any,
  children: PropTypes.any,
}

export default Collapse
