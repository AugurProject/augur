import React from "react";
import PropTypes from "prop-types";

import Styles from "modules/common/components/checkbox/checkbox.styles";

const Checkbox = ({ id, isChecked, value, onClick, disabled }) => (
  <div className={Styles.Checkbox}>
    <input
      id={id}
      type="checkbox"
      checked={isChecked}
      value={value}
      disabled={disabled}
      onChange={onClick}
    />
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={Styles.Checkbox__checkmark}
    />
  </div>
);

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

Checkbox.defaultProps = {
  disabled: false
};

export default Checkbox;
