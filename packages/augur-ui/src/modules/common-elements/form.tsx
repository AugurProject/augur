import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { CheckMark } from "modules/common-elements/icons";
import Styles from "modules/common-elements/form.styles";

interface CheckboxProps {
  id: string;
  isChecked: boolean;
  disabled?: boolean;
  // value: boolean;
  onClick: Function;
  small?: boolean;
  smallOnDesktop?: boolean;
}

export const Checkbox = ({
  id,
  smallOnDesktop = false,
  isChecked,
  // value,
  onClick,
  disabled
}: CheckboxProps) => (
  <div
    className={classNames(Styles.Checkbox, {
      [Styles.CheckboxSmall]: smallOnDesktop
    })}
  >
    <input
      id={id}
      type="checkbox"
      checked={isChecked}
      // value={value}
      disabled={disabled}
      onChange={e => onClick()}
    />
    <span
      role="button"
      tabIndex={0}
      onClick={e => onClick()}
      className={classNames({
        [Styles.CheckmarkSmall]: smallOnDesktop
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
  // value: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  small: PropTypes.bool,
  smallOnDesktop: PropTypes.bool
};

Checkbox.defaultProps = {
  disabled: false,
  small: false,
  smallOnDesktop: false
};
