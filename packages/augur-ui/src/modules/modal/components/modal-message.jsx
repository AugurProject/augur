import React from "react";
import PropTypes from "prop-types";

import ModalDescription from "modules/modal/components/common/modal-description";

import Styles from "modules/modal/components/common/common.styles";

const ModalMessage = p => (
  <section className={Styles.ModalContainer}>
    <h1>{p.title}</h1>
    {p.description.map(text => (
      <ModalDescription text={text} key={text} />
    ))}
  </section>
);

ModalMessage.propTypes = {
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired
};

export default ModalMessage;
