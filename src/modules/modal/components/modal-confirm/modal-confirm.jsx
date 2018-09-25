import React from "react";
import PropTypes from "prop-types";
import noop from "utils/noop";

import Styles from "modules/modal/components/modal-confirm/modal-confirm.styles";

const ModalConfirm = p => (
  <section className={Styles.ModalConfirm}>
    <h1>{p.title}</h1>
    <p>{p.description}</p>
    <div className={Styles.ModalConfirm__ActionButtons}>
      <button
        className={Styles.ModalConfirm__cancel}
        onClick={e => {
          e.preventDefault();
          p.cancelAction();
          p.closeModal();
        }}
      >
        {p.cancelButtonText}
      </button>
      <button
        className={Styles.ModalConfirm__submit}
        onClick={e => {
          e.preventDefault();
          p.submitAction();
          p.closeModal();
        }}
      >
        {p.submitButtonText}
      </button>
    </div>
  </section>
);

ModalConfirm.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  submitAction: PropTypes.func.isRequired,
  cancelButtonText: PropTypes.string,
  submitButtonText: PropTypes.string,
  cancelAction: PropTypes.func
};

ModalConfirm.defaultProps = {
  cancelButtonText: "cancel",
  submitButtonText: "submit",
  cancelAction: noop
};

export default ModalConfirm;
