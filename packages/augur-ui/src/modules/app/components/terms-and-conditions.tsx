import React from "react";
import Styles from "modules/app/components/terms-and-conditions.styles.less";

const TermsAndConditions = () => (
  <footer className={Styles.TermsAndConditions}>
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
      Augur License
    </a>
  </footer>
);

export default TermsAndConditions;
