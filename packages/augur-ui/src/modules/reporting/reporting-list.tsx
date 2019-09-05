import React, { Component } from 'react';
import classNames from 'classnames';
import ReportingCardContainer from 'modules/reporting/containers/reporting-card';

import Styles from 'modules/reporting/common.styles.less';

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
          <ReportingCardContainer marketId={market.id} />
        )}
      </div>
    </div>
  );
}