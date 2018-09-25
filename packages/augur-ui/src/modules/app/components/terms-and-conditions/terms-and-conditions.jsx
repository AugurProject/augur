import React from "react";

import Styles from "modules/app/components/terms-and-conditions/terms-and-conditions.styles";

const TermsAndConditions = p => (
  <div className={Styles.TermsAndConditions}>
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
);

export default TermsAndConditions;
