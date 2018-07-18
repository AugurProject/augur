import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import debounce from 'utils/debounce'

class Checkbox extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      className,
      id,
      isChecked,
      onClick,
      value,
    } = this.props
    // console.log('p -- ', p);

    return (
      <div>
        FILL ORDERS ONLY
        <input
          id={id}
          type="checkbox"
          checked={isChecked}
          value={value}
          onChange={onClick}
        />
      </div>
    )
  }

}

Checkbox.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  isChecked: PropTypes.bool,
  value: PropTypes.bool,
  onClick: PropTypes.func,
}

export default Checkbox
