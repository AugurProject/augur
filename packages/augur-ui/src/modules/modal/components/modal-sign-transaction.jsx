import React from "react";
import PropTypes from "prop-types";
import ModalDescription from "modules/modal/components/common/modal-description";
import ModalActions from "modules/modal/components/common/modal-actions";

import Styles from "modules/modal/components/common/common.styles";

const ModalSignTransaction = ({ title, description, buttons }) => (
  <section className={Styles.ModalContainer}>
    <h1>{title}</h1>
    {description.map(text => (
      <ModalDescription text={text} key={text} />
    ))}
    {buttons.length && <ModalActions buttons={buttons} />}
  </section>
);

ModalSignTransaction.propTypes = {
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  buttons: PropTypes.array
};

ModalSignTransaction.defaultProps = {
  buttons: []
};

export default ModalSignTransaction;
