import React from "react";
import PropTypes from "prop-types";

const ModalDescription = p => <p>{p.text}</p>;

ModalDescription.propTypes = {
  text: PropTypes.string.isRequired
};

export default ModalDescription;
