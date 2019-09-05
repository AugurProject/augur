import React from 'react';
import ReportingCardContainer from 'modules/reporting/containers/reporting-card';

import Styles from 'modules/reporting/common.styles.less';
import { MarketData } from 'modules/types';


export interface ReportingListProps {
  markets: Array<MarketData>;
  title: string;
}

export const ReportingList = (props: ReportingListProps) => {
  return (
    <div className={Styles.ReportingList}>
      <span>{props.title}</span>
      <div>
        {props.markets.map(market =>
          <ReportingCardContainer marketId={market.id} key={market.id}/>
        )}
      </div>
    </div>
  );
}
