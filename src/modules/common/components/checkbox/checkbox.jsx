import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/common/components/checkbox/checkbox.styles'

const Checkbox = p => (
  <div className={Styles.Checkbox}>
    <input
      id={p.id}
      type="checkbox"
      checked={p.isChecked}
      value={p.value}
      onChange={p.onClick}
    />
    <span role="checkbox" onClick={p.onClick} className={Styles.Checkbox__checkmark} />
  </div>
)

Checkbox.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  isChecked: PropTypes.bool,
  value: PropTypes.bool,
  onClick: PropTypes.func,
}

export default Checkbox
