import React from "react";
import PropTypes from "prop-types";

import ModalDescription from "modules/modal/components/common/modal-description";

import Styles from "modules/modal/components/common/common.styles";

const ModalMessage = ({ title, description }) => (
  <section className={Styles.ModalContainer}>
    <h1>{title}</h1>
    {description.map(text => (
      <ModalDescription text={text} key={text} />
    ))}
  </section>
);

ModalMessage.propTypes = {
  description: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired
};

export default ModalMessage;
