import React from "react";

import { LinearPropertyLabel } from "modules/common-elements/labels";
import { formatNumber } from "utils/format-number";

import Styles from "modules/account/components/overview-stats/overview-stats.styles";

export interface OverviewStatsProps {
  properties: Array<any>;
}

const OverviewStats = (props: OverviewStatsProps) => (
  <div className={Styles.OverviewStats}>
    {props.properties.map(property => (
      <LinearPropertyLabel
        highlight
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

export default OverviewStats;
