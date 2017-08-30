import React from 'react'
import PropTypes from 'prop-types'

const Dropdown = p => (
  <div className="dropdown">
    <select
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
    <i className="fa fa-angle-down" />
  </div>
)

Dropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  default: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
}

export default Dropdown
