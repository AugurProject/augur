import React from "react";
import { Versions } from "modules/types";
import Styles from "modules/app/components/terms-and-conditions.styles";

const TermsAndConditions: React.FC<{ versions: Versions }> = ({ versions: { augurui } }) => (
  <div className={Styles.TermsAndConditions}>
    <div>
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
    <div>
      <span>
        AugurUI: <span>{augurui}</span>
      </span>
    </div>
  </div>
);

export default TermsAndConditions;
