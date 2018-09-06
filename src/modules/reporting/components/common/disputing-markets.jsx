import React, { Component } from "react";
import PropTypes from "prop-types";

import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import DisputeMarketCard from "modules/reporting/components/dispute-market-card/dispute-market-card";
import MarketsHeaderStyles from "modules/markets/components/markets-header/markets-header.styles";
import Paginator from "modules/common/components/paginator/paginator";
import isEqual from "lodash/isEqual";

export default class DisputingMarkets extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    upcomingMarkets: PropTypes.array.isRequired,
    upcomingMarketsCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool,
    isConnected: PropTypes.bool.isRequired,
    outcomes: PropTypes.object.isRequired,
    isForking: PropTypes.bool.isRequired,
    forkingMarketId: PropTypes.string.isRequired,
    pageinationCount: PropTypes.number.isRequired,
    disputableMarketsLength: PropTypes.number,
    showPagination: PropTypes.bool,
    showUpcomingPagination: PropTypes.bool,
    loadMarkets: PropTypes.func,
    nullDisputeMessage: PropTypes.string,
    nullUpcomingMessage: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      lowerBound: 1,
      boundedLength: this.props.pageinationCount,
      lowerBoundUpcoming: 1,
      boundedLengthUpcoming: this.props.pageinationCount,
      loadedMarkets: [],
      filteredMarkets: [],
      loadedUpcomingMarkets: [],
      filteredUpcomingMarkets: []
    };

    this.setSegment = this.setSegment.bind(this);
    this.setSegmentUpcoming = this.setSegmentUpcoming.bind(this);
  }

  componentWillMount() {
    const { loadMarkets } = this.props;
    if (loadMarkets) loadMarkets();
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.lowerBound !== nextState.lowerBound ||
      this.state.boundedLength !== nextState.boundedLength ||
      !isEqual(this.state.loadedMarkets, nextProps.markets)
    ) {
      this.setLoadedMarkets(
        nextProps.markets,
        nextState.lowerBound,
        nextState.boundedLength,
        nextProps.showPagination
      );
    }
    if (
      this.state.lowerBoundUpcoming !== nextState.lowerBoundUpcoming ||
      this.state.boundedLengthUpcoming !== nextState.boundedLengthUpcoming ||
      !isEqual(this.state.loadedUpcomingMarkets, nextProps.upcomingMarkets)
    ) {
      this.setLoadedMarketsUpcoming(
        nextProps.upcomingMarkets,
        nextState.lowerBoundUpcoming,
        nextState.boundedLengthUpcoming,
        nextProps.showUpcomingPagination
      );
    }
  }

  setLoadedMarkets(markets, lowerBound, boundedLength, showPagination) {
    const filteredMarkets =
      this.filterMarkets(markets, lowerBound, boundedLength, showPagination) ||
      [];
    this.setState({ filteredMarkets, loadedMarkets: markets });
  }

  setLoadedMarketsUpcoming(markets, lowerBound, boundedLength, showPagination) {
    const filteredUpcomingMarkets =
      this.filterMarkets(markets, lowerBound, boundedLength, showPagination) ||
      [];
    this.setState({ filteredUpcomingMarkets, loadedUpcomingMarkets: markets });
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength });
  }

  setSegmentUpcoming(lowerBoundUpcoming, upperBound, boundedLengthUpcoming) {
    this.setState({ lowerBoundUpcoming, boundedLengthUpcoming });
  }

  filterMarkets(markets, lowerBound, boundedLength, showPagination) {
    const { isConnected } = this.props;
    if (isConnected) {
      const marketIdLength = boundedLength + (lowerBound - 1);
      const marketIds = markets.map(m => m.id);
      const newMarketIdArray = marketIds.slice(lowerBound - 1, marketIdLength);

      return showPagination
        ? markets.filter(m => newMarketIdArray.indexOf(m.id) !== -1)
        : markets;
    }
  }

  render() {
    const {
      history,
      isForking,
      isMobile,
      location,
      markets,
      outcomes,
      upcomingMarketsCount,
      forkingMarketId,
      pageinationCount,
      disputableMarketsLength,
      showPagination,
      showUpcomingPagination,
      nullDisputeMessage,
      nullUpcomingMessage
    } = this.props;
    const { filteredMarkets, filteredUpcomingMarkets } = this.state;

    let forkingMarket = null;
    let nonForkingMarkets = filteredMarkets;
    if (isForking) {
      forkingMarket = markets.find(market => market.id === forkingMarketId);
      nonForkingMarkets = filteredMarkets.filter(
        market => market.id !== forkingMarketId
      );
    }
    const nonForkingMarketsCount = filteredMarkets.length;

    return (
      <section>
        {isForking && (
          <DisputeMarketCard
            key={forkingMarketId}
            market={forkingMarket}
            isMobile={isMobile}
            location={location}
            history={history}
            outcomes={outcomes}
            isForkingMarket
          />
        )}
        {nonForkingMarketsCount > 0 &&
          !isForking &&
          nonForkingMarkets.map(market => (
            <DisputeMarketCard
              key={market.id}
              market={market}
              isMobile={isMobile}
              location={location}
              history={history}
              outcomes={outcomes}
              isForkingMarket={false}
            />
          ))}
        {nonForkingMarketsCount > 0 &&
          !isForking &&
          showPagination && (
            <Paginator
              itemsLength={disputableMarketsLength}
              itemsPerPage={pageinationCount}
              location={location}
              history={history}
              setSegment={this.setSegment}
              pageParam={"disputing" || null}
            />
          )}
        {nonForkingMarketsCount === 0 &&
          !isForking && (
            <NullStateMessage
              message={
                nullDisputeMessage ||
                "There are currently no markets available for dispute."
              }
            />
          )}
        <article className={MarketsHeaderStyles.MarketsHeader}>
          <h4 className={MarketsHeaderStyles.MarketsHeader__subheading}>
            {isForking ? "Dispute Paused" : "Upcoming Dispute Window"}
          </h4>
        </article>
        {nonForkingMarketsCount > 0 &&
          isForking &&
          nonForkingMarkets.map(market => (
            <DisputeMarketCard
              key={market.id}
              market={market}
              isMobile={isMobile}
              location={location}
              history={history}
              outcomes={outcomes}
              isForkingMarket={false}
            />
          ))}
        {upcomingMarketsCount > 0 &&
          filteredUpcomingMarkets.map(market => (
            <DisputeMarketCard
              key={market.id}
              market={market}
              isMobile={isMobile}
              location={location}
              history={history}
              outcomes={outcomes}
            />
          ))}
        {upcomingMarketsCount > 0 &&
          showUpcomingPagination && (
            <Paginator
              itemsLength={upcomingMarketsCount}
              itemsPerPage={pageinationCount}
              location={location}
              history={history}
              setSegment={this.setSegmentUpcoming}
              pageParam={"upcoming" || null}
            />
          )}
        {(upcomingMarketsCount === 0 ||
          (nonForkingMarketsCount === 0 &&
            upcomingMarketsCount === 0 &&
            isForking)) && (
          <NullStateMessage
            message={
              nullUpcomingMessage ||
              "There are currently no markets slated for the upcoming dispute window."
            }
          />
        )}
      </section>
    );
  }
}
