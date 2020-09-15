import React from "react";
import Styles from "modules/app/components/terms-and-conditions.styles.less";

const TermsAndConditions = () => (
  <div className={Styles.TermsAndConditions}>
    <a
      href="https://raw.githubusercontent.com/AugurProject/augur-core/master/LICENSE"
      target="_blank"
      rel="noopener noreferrer"
    >
      Augur Core License
    </a>
    <a
      href="https://raw.githubusercontent.com/AugurProject/augur/master/LICENSE"
      target="_blank"
      rel="noopener noreferrer"
    >
      Augur License
    </a>
  </div>
);

export default TermsAndConditions;
