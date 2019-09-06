import React from 'react';
import ReportingCardContainer from 'modules/reporting/containers/reporting-card';

import Styles from 'modules/reporting/common.styles.less';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { convertMarketInfoToMarketData } from 'utils/convert-marketInfo-marketData';
import { Pagination } from 'modules/common/pagination';
import PaginationStyles from 'modules/common/pagination.styles.less';

const ITEMS_PER_SECTION = 5;
export interface ReportingListProps {
  markets: Array<MarketData>;
  title: string;
  showLoggedOut?: boolean;
  loggedOutMessage?: string;
  emptyHeader: string;
  emptySubheader: string;
  reportingType: string;
}

export const ReportingList = (props: ReportingListProps) => {
  return (
    <div className={Styles.ReportingList}>
      <span>{props.title}</span>
      <div>
        {props.markets.map(market => (
          <ReportingCardContainer market={market} key={market.id} />
        ))}
        {props.showLoggedOut && <span>{props.loggedOutMessage}</span>}
        {props.markets.length === 0 && !props.showLoggedOut && (
          <>
            <span>{props.emptyHeader}</span>
            <span>{props.emptySubheader}</span>
          </>
        )}
      </div>
    </div>
  );
};

interface PaginatorProps extends ReportingListProps {
  isConnected: boolean;
  isLogged: boolean;
  loadMarkets: Function;
  reportingType: string;
}

interface PaginatorState {
  offset: number;
  limit: number;
  markets: MarketData[];
  showPagination: boolean;
  marketCount: number;
}
export class Paginator extends React.Component<PaginatorProps, PaginatorState> {
  state: PaginatorState = {
    offset: 1,
    limit: ITEMS_PER_SECTION,
    markets: [],
    showPagination: false,
    marketCount: 0,
  };

  componentWillMount() {
    const { loadMarkets, reportingType, isConnected } = this.props;
    const { offset, limit } = this.state;
    if (isConnected) {
      loadMarkets(offset, limit, reportingType, this.processMarkets);
    }
  }

  componentWillUpdate(nextProps) {
    const {
      isConnected,
      loadMarkets,
      reportingType,
      isLogged,
    } = this.props;
    const { offset, limit } = this.state;
    if (
      nextProps.isConnected !== isConnected ||
      nextProps.isLogged !== isLogged
    ) {
      loadMarkets(offset, limit, reportingType, this.processMarkets);
    }
  }

  processMarkets = (err, results: Getters.Markets.MarketList) => {
    if (err) return console.log('error', err);
    const { limit } = this.state;
    const { markets: marketInfos, meta } = results;
    const markets = marketInfos.map(m => convertMarketInfoToMarketData(m));
    const showPagination = meta.marketCount > limit;
    this.setState({ markets, showPagination, marketCount: meta.marketCount });
  };

  setOffset = (offset) => {
    const { loadMarkets, reportingType } = this.props;
    const { limit } = this.state;
    this.setState({ offset }, () => {
      loadMarkets(offset, limit, reportingType, this.processMarkets);
    });
  }

  render() {
    const { markets, showPagination, offset, limit, marketCount } = this.state;
    return (
      <>
        <ReportingList markets={markets} {...this.props} />
        {showPagination && (
          <div className={PaginationStyles.PaginationContainer}>
            <Pagination
              page={offset}
              itemCount={marketCount}
              itemsPerPage={limit}
              action={this.setOffset}
            />
          </div>
        )}
      </>
    );
  }
}
