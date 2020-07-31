import React, { useState } from 'react';

import {
  YOUR_OVERVIEW_TITLE,
  TIMEFRAME_OPTIONS,
} from 'modules/common/constants';
import { AugurLogo } from 'modules/common/icons';
import { PropertyLabel } from 'modules/common/labels';
import QuadBox from 'modules/portfolio/components/common/quad-box';
import Funds from 'modules/account/containers/funds';
import Stats from 'modules/account/containers/stats';
import OverviewChart from 'modules/account/containers/overview-chart';
import Styles from 'modules/account/components/overview.styles.less';
import { FormattedNumber } from 'modules/types';

export interface OverviewProps {
  repTotalAmountStakedFormatted: FormattedNumber;
  repBalanceFormatted: FormattedNumber;
}

const Overview = ({
  repTotalAmountStakedFormatted,
  repBalanceFormatted,
}: OverviewProps) => {
  const [selected, setSelected] = useState(TIMEFRAME_OPTIONS[2].id);

  return (
    <QuadBox
      title={YOUR_OVERVIEW_TITLE}
      hideHeader
      content={
        <div className={Styles.AccountOverview}>
          <Funds />
          <div className={Styles.RepBalances}>
            <PropertyLabel
              label="REPv2 Balance"
              value={repBalanceFormatted.formatted}
            />
            {AugurLogo}
            <PropertyLabel
              label="REPv2 Staked"
              value={repTotalAmountStakedFormatted.formatted}
            />
          </div>
          <Stats
            timeframe={selected}
            updateSelected={selected => setSelected(selected)}
          />
          <OverviewChart timeframe={selected} />
        </div>
      }
    />
  );
};

export default Overview;
