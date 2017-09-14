import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from 'modules/common/components/dropdown/dropdown.styles'

const Dropdown = p => (
  <div className={Styles.Dropdown}>
    <span className={Styles.Dropdown__label}>{p.options[0].label}</span>
    <ul className={Styles.Dropdown__list}>
      {p.options.map(option => (
        <li
          key={option.value}
          value={option.value}
        >
          {option.label}
        </li>
      ))}
    </ul>
    <i className={classNames(Styles['Dropdown__angle-down'], Styles.fa, Styles['fa-angle-down'])} />
  </div>
)

Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  default: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
}

export default Dropdown
