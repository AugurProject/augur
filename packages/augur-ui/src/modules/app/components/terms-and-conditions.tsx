import React from "react";
import Styles from "modules/app/components/terms-and-conditions.styles";

interface versionObject {
  augurui: string;
  augurjs: string;
}

interface TermsAndConditions {
  versions: versionObject;
}

const TermsAndConditions = ({
  augurui,
  augurjs,
}: TermsAndConditions) => (
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
