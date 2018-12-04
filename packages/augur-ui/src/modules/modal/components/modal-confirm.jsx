import React from "react";
import PropTypes from "prop-types";

import ModalDescription from "modules/modal/components/common/modal-description";
import ModalActions from "modules/modal/components/common/modal-actions";

import Styles from "modules/modal/components/common/common.styles";

const ModalConfirm = ({
  closeModal,
  description,
  title,
  submitAction,
  cancelButtonText,
  submitButtonText,
  cancelAction
}) => (
  <section className={Styles.ModalContainer}>
    <h1>{title}</h1>
    {description.map(text => (
      <ModalDescription text={text} key={text} />
    ))}
    <ModalActions
      buttons={[
        {
          label: cancelButtonText,
          action: cancelAction || closeModal,
          type: "gray"
        },
        {
          label: submitButtonText,
          action: submitAction,
          type: "purple"
        }
      ]}
    />
  </section>
);

ModalConfirm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  submitAction: PropTypes.func.isRequired,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  cancelAction: PropTypes.func
};

ModalConfirm.defaultProps = {
  cancelButtonText: "cancel",
  submitButtonText: "submit",
  cancelAction: undefined
};

export default ModalConfirm;
