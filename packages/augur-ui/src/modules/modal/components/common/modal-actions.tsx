import React from "react";
import PropTypes from "prop-types";

import ModalButton from "modules/modal/components/common/modal-button";

import Styles from "modules/modal/components/common/common.styles.less";

interface ButtonObject {
  label: string;
  action: Function;
  type?: string;
  continueDefault?: boolean;
  isDisabled?: boolean;
}

interface ModalActionsProps {
  buttons: Array<ButtonObject>;
}

const ModalActions = ({ buttons }: ModalActionsProps) => (
  <div className={Styles.ActionButtons}>
    {buttons.map((button) => (
      <ModalButton key={JSON.stringify(button)} {...button} />
    ))}
  </div>
);

export default ModalActions;
