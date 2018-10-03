import React from "react";
import PropTypes from "prop-types";

import Styles from "modules/modal/components/common/common.styles";

const ModalDescription = p => <p className={Styles.Description}>{p.text}</p>;

ModalDescription.propTypes = {
  text: PropTypes.string.isRequired
};

export default ModalDescription;
