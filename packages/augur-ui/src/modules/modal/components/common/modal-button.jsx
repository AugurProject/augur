import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "modules/modal/components/common/common.styles";

const ModalButton = button => {
  let styleType = `${Styles["ActionButtons__button-purple"]}`;
  switch (button.type) {
    case "gray":
    case "grey":
      styleType = `${Styles["ActionButtons__button-gray"]}`;
      break;
    case "offWhite":
      styleType = `${Styles["ActionButtons__button-offWhite"]}`;
      break;
    default:
      break;
  }
  return (
    <button
      className={classNames(Styles.ActionButtons__button, {
        [`${styleType}`]: true
      })}
      disabled={!!button.isDisabled}
      onClick={e => {
        if (!button.continueDefault) e.preventDefault();
        button.action();
      }}
    >
      {button.label}
    </button>
  );
};

ModalButton.propTypes = {
  label: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  type: PropTypes.string,
  continueDefault: PropTypes.bool,
  isDisabled: PropTypes.bool
};

ModalButton.defaultProps = {
  type: "purple",
  continueDefault: false,
  isDisabled: false
};

export default ModalButton;
