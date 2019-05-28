import React from "react";

import { LinearPropertyLabel } from "modules/common-elements/labels";
import { formatNumber } from "utils/format-number";

import Styles from "modules/account/components/stats.styles";

export interface StatsProps {
  properties: Array<any>;
}

const Stats = (props: StatsProps) => (
  <div className={Styles.Stats}>
    {props.properties.map((property: any) => (
      <LinearPropertyLabel
        key={property.key}
        label={property.label}
        value={
          formatNumber(property.value, {
            decimals: 2,
            decimalsRounded: 2,
            denomination: "",
            positiveSign: false,
            zeroStyled: true
          }).minimized
        }
      />
    ))}
  </div>
);

export default Stats;
