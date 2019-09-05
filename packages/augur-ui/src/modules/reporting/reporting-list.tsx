import React, { Component } from 'react';
import classNames from 'classnames';
import ReportingCardContainer from 'modules/reporting/containers/reporting-card';

import Styles from 'modules/reporting/common.styles.less';

export interface ReportingListProps {
  markets: Array<MarketData>;
  title: string;
  showLoggedOut?: boolean;
  loggedOutMessage?: string;
  emptyHeadeer: string;
  emptySubheader: string;
}

export const ReportingList = (props: ReportingListProps) => {
  return (
    <div className={Styles.ReportingList}>
      <span>{props.title}</span>
      <div>
        {props.markets.map(market => 
          <ReportingCardContainer marketId={market.id} />
        )}
        {props.showLoggedOut &&
          <span>{props.loggedOutMessage}</span>
        }
        {props.markets.length === 0 && !props.showLoggedOut &&
          <>
            <span>{props.emptyHeader}</span>
            <span>{props.emptySubheader}</span>
          </>
        }
      </div>
    </div>
  );
}