import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import debounce from 'utils/debounce'
import Styles from 'modules/common/components/checkbox/checkbox.styles'

class Checkbox extends Component {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    label: PropTypes.string,
    isChecked: PropTypes.bool,
    value: PropTypes.bool,
    onClick: PropTypes.func,
  }

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
      label,
    } = this.props
    return (
      <div className={Styles.Checkbox}>
        <input
          id={id}
          type="checkbox"
          checked={isChecked}
          value={isChecked}
          onChange={onClick}
        />
        <span onClick={onClick} className={Styles.Checkbox__checkmark} />
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
