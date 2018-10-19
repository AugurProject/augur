import React from "react";
import PropTypes from "prop-types";

import ModalButton from "modules/modal/components/common/modal-button";

import Styles from "modules/modal/components/common/common.styles";

const ModalActions = ({ buttons }) => (
  <div className={Styles.ActionButtons}>
    {buttons.map(button => (
      <ModalButton key={JSON.stringify(button)} {...button} />
    ))}
  </div>
);

ModalActions.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired,
      type: PropTypes.string,
      continueDefault: PropTypes.bool,
      isDisabled: PropTypes.bool
    })
  ).isRequired
};

export default ModalActions;
