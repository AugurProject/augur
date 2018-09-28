import React from "react";
import PropTypes from "prop-types";

import Styles from "modules/modal/components/modal-gas-price/modal-gas-price.styles";

const ModalConfirm = p => (
  <section className={Styles.ModalConfirm}>
    <h1>Gas Price (gwei)</h1>
    <div className={Styles.ModalConfirm__ActionButtons}>
      <button className={Styles.ModalConfirm__cancel} onClick={p.closeModal}>
        Cancel
      </button>
    </div>
  </section>
);

ModalConfirm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ModalConfirm;
