import React, { Component } from "react";
import PropTypes from "prop-types";

import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import DisputeMarketCard from "modules/reporting/components/dispute-market-card/dispute-market-card";
import Paginator from "modules/common/components/paginator/paginator";
import MarketsHeaderLabel from "modules/markets-list/components/markets-header-label/markets-header-label";
import isEqual from "lodash/isEqual";

export default class DisputingMarkets extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    upcomingMarkets: PropTypes.array.isRequired,
    upcomingMarketsCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    outcomes: PropTypes.object.isRequired,
    isForking: PropTypes.bool.isRequired,
    forkingMarketId: PropTypes.string,
    paginationCount: PropTypes.number.isRequired,
    disputableMarketsLength: PropTypes.number.isRequired,
    showPagination: PropTypes.bool.isRequired,
    showUpcomingPagination: PropTypes.bool.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    nullDisputeMessage: PropTypes.string,
    nullUpcomingMessage: PropTypes.string,
    addNullPadding: PropTypes.bool
  };

  static defaultProps = {
    nullDisputeMessage: "There are currently no markets available for dispute.",
    nullUpcomingMessage:
      "There are currently no markets slated for the upcoming dispute window.",
    addNullPadding: false,
    forkingMarketId: null
  };

  constructor(props) {
    super(props);
    const { paginationCount } = props;
    this.state = {
      lowerBound: 1,
      boundedLength: paginationCount,
      lowerBoundUpcoming: 1,
      boundedLengthUpcoming: paginationCount,
      loadedMarkets: [],
      filteredMarkets: [],
      loadedUpcomingMarkets: [],
      filteredUpcomingMarkets: []
    };

    this.setSegment = this.setSegment.bind(this);
    this.setSegmentUpcoming = this.setSegmentUpcoming.bind(this);
  }

  componentWillMount() {
    const { loadMarkets, isConnected } = this.props;
    if (loadMarkets && isConnected) loadMarkets();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.isConnected !== nextProps.isConnected)
      this.props.loadMarkets();
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
      paginationCount,
      disputableMarketsLength,
      showPagination,
      showUpcomingPagination,
      nullDisputeMessage,
      nullUpcomingMessage,
      addNullPadding
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
            />
          ))}
        {nonForkingMarketsCount > 0 &&
          !isForking &&
          showPagination && (
            <Paginator
              itemsLength={disputableMarketsLength}
              itemsPerPage={paginationCount}
              location={location}
              history={history}
              setSegment={this.setSegment}
              pageParam="disputing"
            />
          )}
        {nonForkingMarketsCount === 0 &&
          !isForking && <NullStateMessage message={nullDisputeMessage} />}
        <MarketsHeaderLabel
          title={isForking ? "Dispute Paused" : "Upcoming Dispute Window"}
        />
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
              itemsPerPage={paginationCount}
              location={location}
              history={history}
              setSegment={this.setSegmentUpcoming}
              pageParam="upcoming"
            />
          )}
        {(upcomingMarketsCount === 0 ||
          (nonForkingMarketsCount === 0 &&
            upcomingMarketsCount === 0 &&
            isForking)) && (
          <NullStateMessage
            addNullPadding={addNullPadding}
            message={nullUpcomingMessage}
          />
        )}
      </section>
    );
  }
}
