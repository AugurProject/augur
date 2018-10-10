import React from "react";
import PropTypes from "prop-types";
import { PulseLoader } from "react-spinners";

import Styles from "modules/modal/components/common/common.styles";

const ModalLoading = p => (
  <div className={Styles.Loading}>
    <PulseLoader {...p} />
  </div>
);

ModalLoading.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  sizeUnit: PropTypes.string,
  loading: PropTypes.bool
};

ModalLoading.defaultProps = {
  color: "#412468",
  size: 8,
  sizeUnit: "px",
  loading: true
};

export default ModalLoading;
