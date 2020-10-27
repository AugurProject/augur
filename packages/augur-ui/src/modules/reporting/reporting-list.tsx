import React, { useState, useEffect } from 'react';
import { ReportingCard } from 'modules/reporting/common';

import Styles from 'modules/reporting/common.styles.less';
import { Pagination } from 'modules/common/pagination';
import PaginationStyles from 'modules/common/pagination.styles.less';
import { LoadingMarketCard } from 'modules/market-cards/common';
import { MarketReportingState, MarketList } from '@augurproject/sdk-lite';
import { useMarketsStore } from 'modules/markets/store/markets';
import { selectMarket } from 'modules/markets/selectors/market';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { REPORTING_STATE } from 'modules/common/constants';
import { loadUpcomingDesignatedReportingMarkets, loadDesignatedReportingMarkets, loadOpenReportingMarkets } from 'modules/markets/actions/load-markets';

const ITEMS_PER_SECTION = 5;
const NUM_LOADING_CARDS = 2;

export interface ReportingListProps {
  title: string;
  showLoggedOut?: boolean;
  loggedOutMessage?: string;
  emptyHeader: string;
  emptySubheader: string;
  reportingType: string;
  isLoadingMarkets: boolean;
  markets: string[];
}

export const ReportingList = (props: ReportingListProps) => {
  const content = [];

  if (!props.isLoadingMarkets) {
    content.push(
      props.markets.map(market => (
        <ReportingCard market={market} key={market.id} />
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
      {props.reportingType === MarketReportingState.OpenReporting ? (
        <h1>{props.title}</h1>
      ) : (
        <span>{props.title}</span>
      )}
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
  reportingType: string;
  showLoggedOut: boolean;
  title: string;
  loggedOutMessage?: string;
  emptyHeader: string;
  emptySubheader: string;
}
export const Paginator = ({
  reportingType,
  showLoggedOut,
  title,
  loggedOutMessage,
  emptyHeader,
  emptySubheader,
}: PaginatorProps) => {
  const { isLogged, isConnected } = useAppStatusStore();

  const [state, setState] = useState({
    limit: ITEMS_PER_SECTION,
    showPagination: false,
    marketCount: 0,
  });
  const [offset, setOffset] = useState(1);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(true);
  const { limit, showPagination, marketCount } = state;

  useEffect(() => {
    if (isConnected) {
      setIsLoadingMarkets(true);
      loadMarkets(offset, limit, reportingType, processMarkets);
    }
  }, [isConnected, isLogged]);

  function loadingMarkets(offset, limit, reportingType) {
    setIsLoadingMarkets(true);
    loadMarkets(offset, limit, reportingType, processMarkets);
  }

  function processMarkets(err, marketResults: MarketList) {
    setIsLoadingMarkets(false);
    if (err) return console.log('error', err);
    if (!marketResults || !marketResults.markets || !marketResults.meta) return;
    const showPagination = marketResults.meta.marketCount > limit;
    setState({
      ...state,
      showPagination,
      marketCount: marketResults.meta.marketCount,
    });
  }

  function setOffsetFnc(offset) {
    setOffset(offset);
    loadingMarkets(offset, limit, reportingType);
  }

  function loadMarkets(offset, limit, type, cb) {
    switch (type) {
      case REPORTING_STATE.DESIGNATED_REPORTING:
        loadDesignatedReportingMarkets({ offset, limit }, cb);
        break;
      case REPORTING_STATE.PRE_REPORTING:
        loadUpcomingDesignatedReportingMarkets({ offset, limit }, cb);
        break;
      default:
        loadOpenReportingMarkets({ offset, limit }, cb);
    }
  }
  const { reportingListState } = useMarketsStore();
  const markets = (
    (reportingListState[reportingType] || {}).marketIds || []
  ).map(id => selectMarket(id) || []);

  return (
    <>
      <ReportingList
        markets={markets}
        title={title}
        showLoggedOut={showLoggedOut}
        reportingType={reportingType}
        isLoadingMarkets={isLoadingMarkets}
        loggedOutMessage={loggedOutMessage}
        emptyHeader={emptyHeader}
        emptySubheader={emptySubheader}
      />
      {showPagination && (
        <div className={PaginationStyles.PaginationContainer}>
          <Pagination
            page={offset}
            itemCount={marketCount}
            itemsPerPage={limit}
            action={setOffsetFnc}
            updateLimit={null}
          />
        </div>
      )}
    </>
  );
};
