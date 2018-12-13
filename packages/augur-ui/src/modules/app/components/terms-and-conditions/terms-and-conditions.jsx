import React from "react";
import PropTypes from "prop-types";

import Styles from "modules/app/components/terms-and-conditions/terms-and-conditions.styles";

const TermsAndConditions = ({ versions }) => (
  <div className={Styles.TermsAndConditions}>
    <div className={Styles.TermsAndConditions__grouping}>
      <a
        href="https://raw.githubusercontent.com/AugurProject/augur-core/master/LICENSE"
        target="blank"
      >
        Augur Core License
      </a>
      <a
        href="https://raw.githubusercontent.com/AugurProject/augur/master/LICENSE"
        target="blank"
      >
        Augur UI License
      </a>
    </div>
    <div className={Styles.TermsAndConditions__grouping}>
      <span>
        AugurUI: <span>{versions.augurui}</span>
      </span>
      <span>
        AugurJS: <span>{versions.augurjs}</span>
      </span>
      <span>
        AugurNode: <span>{versions.augurNode}</span>
      </span>
    </div>
  </div>
);

TermsAndConditions.propTypes = {
  versions: PropTypes.shape({
    augurui: PropTypes.string,
    augurjs: PropTypes.string,
    augurNode: PropTypes.string
  }).isRequired
};

export default TermsAndConditions;
