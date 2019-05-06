import React from "react";
import PropTypes from "prop-types";

const EtherscanLink = ({ baseUrl, txhash, label, showNonLink }) => (
  <span>
    {baseUrl && (
      <a href={baseUrl + txhash} target="blank">
        {label}
      </a>
    )}
    {!baseUrl && showNonLink && <span>{label}</span>}
  </span>
);

EtherscanLink.propTypes = {
  baseUrl: PropTypes.string,
  txhash: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  showNonLink: PropTypes.bool
};

EtherscanLink.defaultProps = {
  baseUrl: null,
  showNonLink: false
};

export default EtherscanLink;
