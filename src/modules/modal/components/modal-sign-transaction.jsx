import React from "react";
import PropTypes from "prop-types";
import ModalDescription from "modules/modal/components/common/modal-description";
import ModalActions from "modules/modal/components/common/modal-actions";

import Styles from "modules/modal/components/common/common.styles";

const ModalSignTransaction = p => (
  <section className={Styles.ModalContainer}>
    <h1>{p.title}</h1>
    {p.description.map(text => (
      <ModalDescription text={text} key={text} />
    ))}
    {p.buttons && p.buttons.length && <ModalActions buttons={p.buttons} />}
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
