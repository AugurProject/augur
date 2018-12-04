import React from "react";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";

import Styles from "modules/modal/components/common/common.styles";

const ModalDescription = ({ text }) => (
  <p className={Styles.Description}>{ReactHtmlParser(text)}</p>
);

ModalDescription.propTypes = {
  text: PropTypes.string.isRequired
};

export default ModalDescription;
