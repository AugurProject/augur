import React from "react";
import PropTypes from "prop-types";
import noop from "utils/noop";

import ModalDescription from "modules/modal/components/common/modal-description";

import Styles from "modules/modal/components/modal-confirm/modal-confirm.styles";

const ModalConfirm = p => (
  <section className={Styles.ModalConfirm}>
    <h1>{p.title}</h1>
    {p.description.map(text => (
      <ModalDescription text={text} key={text} />
    ))}
    <div className={Styles.ModalConfirm__ActionButtons}>
      <button
        className={Styles.ModalConfirm__cancel}
        onClick={e => {
          if (!p.continueDefault) e.preventDefault();
          p.cancelAction();
          p.closeModal();
        }}
      >
        {p.cancelButtonText}
      </button>
      <button
        className={Styles.ModalConfirm__submit}
        onClick={e => {
          if (!p.continueDefault) e.preventDefault();
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
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
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
