import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from 'modules/common/components/dropdown/dropdown.styles'

const Dropdown = p => (
  <div className={Styles.Dropdown}>
    <select
      className={Styles.Dropdown__select}
      onChange={(event) => { p.onChange(event.target.value) }}
      defaultValue={p.default}
    >
      {p.options.map(option => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
    <i className={classNames(Styles['Dropdown__angle-down'], Styles.fa, Styles['fa-angle-down'])} />
  </div>
)

Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  default: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
}

export default Dropdown
