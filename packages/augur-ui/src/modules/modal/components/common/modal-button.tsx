import React from "react";
import classNames from "classnames";

import Styles from "modules/modal/components/common/common.styles.less";

interface ModalButtonProps {
  label: string;
  action: Function;
  type?: string;
  continueDefault?: boolean;
  isDisabled?: boolean;
}

const ModalButton = ({ type = "purple", label, action, isDisabled = false, continueDefault = false }: ModalButtonProps) => {
  let styleType = `${Styles["ActionButtons__button-purple"]}`;
  switch (type) {
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
        [`${styleType}`]: true,
      })}
      disabled={!!isDisabled}
      onClick={(e) => {
        if (!continueDefault) e.preventDefault();
        action(e);
      }}
    >
      {label}
    </button>
  );
};

export default ModalButton;
