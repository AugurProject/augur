import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { CheckMark } from "modules/common-elements/icons";
import Styles from "modules/common/components/checkbox/checkbox.styles";

const Checkbox = ({ id, small, isChecked, value, onClick, disabled }) => (
  <div
    className={classNames(Styles.Checkbox, { [Styles.Checkbox__small]: small })}
  >
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
      className={classNames(Styles.Checkbox__checkmark, {
        [Styles.Checkbox__checkmark__small]: small
      })}
    >
      {CheckMark}
    </span>
  </div>
);

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  isChecked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  value: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  small: PropTypes.bool
};

Checkbox.defaultProps = {
  disabled: false,
  small: false
};

export default Checkbox;
