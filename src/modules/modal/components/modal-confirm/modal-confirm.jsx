import React from "react";
import PropTypes from "prop-types";
import noop from "utils/noop";

import ModalDescription from "modules/modal/components/common/modal-description";
import ModalActions from "modules/modal/components/common/modal-actions";

import Styles from "modules/modal/components/common/common.styles";

const ModalConfirm = p => (
  <section className={Styles.ModalContainer}>
    <h1>{p.title}</h1>
    {p.description.map(text => (
      <ModalDescription text={text} key={text} />
    ))}
    <ModalActions
      buttons={[
        {
          label: p.cancelButtonText,
          action: p.cancelAction,
          type: "gray"
        },
        {
          label: p.submitButtonText,
          action: p.submitAction,
          type: "purple"
        }
      ]}
    />
  </section>
);

ModalConfirm.propTypes = {
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  submitAction: PropTypes.func.isRequired,
  continueDefault: PropTypes.bool,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  cancelAction: PropTypes.func
};

ModalConfirm.defaultProps = {
  continueDefault: false,
  cancelButtonText: "cancel",
  submitButtonText: "submit",
  cancelAction: noop
};

export default ModalConfirm;
