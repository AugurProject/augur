import React from "react";
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
  buttons: ButtonObject[];
}

const ModalActions: React.FC<ModalActionsProps> = ({ buttons }) => (
  <div className={Styles.ActionButtons}>
    {buttons.map((button) => (
      <ModalButton key={JSON.stringify(button)} {...button} />
    ))}
  </div>
);

export default ModalActions;
