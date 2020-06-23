import type { Getters } from '@augurproject/sdk';
import { Pagination } from 'modules/common/pagination';
import PaginationStyles from 'modules/common/pagination.styles.less';
import { LoadingMarketCard } from 'modules/market-cards/common';
import { MarketReportingState } from '@augurproject/sdk-lite';
import Styles from 'modules/reporting/common.styles.less';
import ReportingCardContainer
  from 'modules/reporting/containers/reporting-card';
import { MarketData } from 'modules/types';
import React from 'react';

const ITEMS_PER_SECTION = 5;
const NUM_LOADING_CARDS = 2;
export interface ReportingListProps {
  markets: MarketData[];
  title: string;
  showLoggedOut?: boolean;
  loggedOutMessage?: string;
  emptyHeader: string;
  emptySubheader: string;
  reportingType: string;
  isLoadingMarkets: boolean;
}

export const ReportingList = (props: ReportingListProps) => {
  const content = [];

  if (!props.isLoadingMarkets) {
    content.push(
      props.markets.map(market => (
        <ReportingCardContainer market={market} key={market.id} />
      ))
    );
    if (props.showLoggedOut)
      content.push(<span key={'loggedOut'}>{props.loggedOutMessage}</span>);
    if (props.markets.length === 0 && !props.showLoggedOut) {
      content.push(
        <React.Fragment key={'empty'}>
          <span>{props.emptyHeader}</span>
          <span>{props.emptySubheader}</span>
        </React.Fragment>
      );
    }
  }

  return (
    <div className={Styles.ReportingList}>
      {props.reportingType === MarketReportingState.OpenReporting
        ? <h1>{props.title}</h1>
        : <span>{props.title}</span>}
      <div key={props.reportingType}>
        {props.isLoadingMarkets &&
          new Array(NUM_LOADING_CARDS)
            .fill(null)
            .map((prop, index) => (
              <LoadingMarketCard
                key={`${index}-${props.reportingType}-loading`}
              />
            ))}
        {!props.isLoadingMarkets && content}
      </div>
    </div>
  );
};

interface PaginatorProps extends ReportingListProps {
  isConnected: boolean;
  isLogged: boolean;
  loadMarkets: Function;
  reportingType: string;
  markets: MarketData[];
}

interface PaginatorState {
  offset: number;
  limit: number;
  showPagination: boolean;
  marketCount: number;
  isLoadingMarkets: boolean;
}

export class Paginator extends React.Component<PaginatorProps, PaginatorState> {
  state: PaginatorState = {
    offset: 1,
    limit: ITEMS_PER_SECTION,
    showPagination: false,
    marketCount: 0,
    isLoadingMarkets: true,
  };

  componentDidMount() {
    const { loadMarkets, reportingType, isConnected } = this.props;
    const { offset, limit } = this.state;
    if (isConnected) {
      loadMarkets(offset, limit, reportingType, this.processMarkets);
    }
  }

  componentDidUpdate(nextProps) {
    const { isConnected, reportingType, isLogged } = this.props;
    const { offset, limit } = this.state;
    if (
      nextProps.isConnected !== isConnected ||
      nextProps.isLogged !== isLogged
    ) {
      this.isLoadingMarkets(offset, limit, reportingType);
    }
  }

  isLoadingMarkets = (offset, limit, reportingType) => {
    const { loadMarkets } = this.props;
    this.setState(
      { isLoadingMarkets: true },
      loadMarkets(offset, limit, reportingType, this.processMarkets)
    );
  };

  processMarkets = (err, marketResults: Getters.Markets.MarketList) => {
    const isLoadingMarkets = false;
    this.setState({ isLoadingMarkets }, () => {
      if (err) return console.log('error', err);
      const { limit } = this.state;
      if (!marketResults || !marketResults.markets || !marketResults.meta)
        return;
      const showPagination = marketResults.meta.marketCount > limit;
      this.setState({
        showPagination,
        marketCount: marketResults.meta.marketCount,
        isLoadingMarkets,
      });
    });
  };

  setOffset = offset => {
    const { reportingType } = this.props;
    const { limit } = this.state;
    this.setState({ offset }, () => {
      this.isLoadingMarkets(offset, limit, reportingType);
    });
  };

  render() {
    const { markets } = this.props;
    const {
      isLoadingMarkets,
      showPagination,
      offset,
      limit,
      marketCount,
    } = this.state;

    return (
      <>
        <ReportingList
          markets={markets}
          {...this.props}
          isLoadingMarkets={isLoadingMarkets}
        />
        {showPagination && (
          <div className={PaginationStyles.PaginationContainer}>
            <Pagination
              page={offset}
              itemCount={marketCount}
              itemsPerPage={limit}
              action={this.setOffset}
              updateLimit={null}
            />
          </div>
        )}
      </>
    );
  }
}
