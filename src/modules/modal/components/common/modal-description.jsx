import React from "react";
import PropTypes from "prop-types";

import Styles from "modules/modal/components/common/common.styles";

const ModalDescription = ({ text }) => (
  <p className={Styles.Description}>{text}</p>
);

ModalDescription.propTypes = {
  text: PropTypes.string.isRequired
};

export default ModalDescription;
