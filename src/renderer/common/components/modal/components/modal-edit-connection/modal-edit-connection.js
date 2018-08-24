import React from "react";
import PropTypes from "prop-types";

import Styles from "./modal-edit-connection.styles.less";

const ModalEditConnection = p => (
  <section className={Styles.ModalEditCOnnection}>
    Edit connection modal
  </section>
);

ModalEditConnection.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ModalEditConnection;
