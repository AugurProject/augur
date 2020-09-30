import React, { useState } from 'react';

import {
  YOUR_OVERVIEW_TITLE,
  TIMEFRAME_OPTIONS,
} from 'modules/common/constants';
import { v2AugurLogo } from 'modules/common/icons';
import { PropertyLabel } from 'modules/common/labels';
import Funds from 'modules/account/components/funds';
import Stats from 'modules/account/components/stats';
import OverviewChart from 'modules/account/components/overview-chart';
import Styles from 'modules/account/components/overview.styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { selectReportingBalances } from 'modules/account/helpers/common';
import { formatRep } from 'utils/format-number';
import QuadBox from 'modules/portfolio/components/common/quad-box';

export interface OverviewProps {
  hideHeader?: boolean;
}

const Overview = ({ hideHeader }: OverviewProps) => {
  const [selected, setSelected] = useState(TIMEFRAME_OPTIONS[2].id);
  const {
    loginAccount: { balances, reporting },
  } = useAppStatusStore();
  const {
    repTotalAmountStakedFormatted,
    repBalanceFormatted,
  } = selectReportingBalances(reporting, balances);
  const repBalance = formatRep(repBalanceFormatted.fullPrecision, {
    removeComma: true,
  });
  const repTotalAmountStaked = formatRep(
    repTotalAmountStakedFormatted.fullPrecision,
    { removeComma: true }
  );
  return (
    <QuadBox
      title={YOUR_OVERVIEW_TITLE}
      customClass={hideHeader && Styles.HideHeader}
      content={
        <div className={Styles.AccountOverview}>
          <Funds />
          <div className={Styles.RepBalances}>
            <PropertyLabel label="REPv2 Balance" value={repBalance.formatted} />
            {v2AugurLogo}
            <PropertyLabel
              label="REPv2 Staked"
              value={repTotalAmountStaked.formatted}
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
