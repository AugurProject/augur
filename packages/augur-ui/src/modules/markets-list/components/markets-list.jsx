import React, { Component } from "react";
import PropTypes from "prop-types";

import MarketPreview from "modules/market/components/market-preview/market-preview";
import Paginator from "modules/common/components/paginator/paginator";
import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import { TYPE_TRADE } from "modules/markets/constants/link-types";
import isEqual from "lodash/isEqual";
import DisputeMarketCard from "modules/reporting/components/dispute-market-card/dispute-market-card";

import debounce from "utils/debounce";

const PAGINATION_COUNT = 10;

export default class MarketsList extends Component {
  static propTypes = {
    testid: PropTypes.string,
    history: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    markets: PropTypes.array.isRequired,
    filteredMarkets: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfoIfNotLoaded: PropTypes.func,
    paginationPageParam: PropTypes.string,
    linkType: PropTypes.string,
    collectMarketCreatorFees: PropTypes.func,
    isMobile: PropTypes.bool,
    pendingLiquidityOrders: PropTypes.object,
    nullMessage: PropTypes.string,
    addNullPadding: PropTypes.bool,
    style: PropTypes.object,
    showDisputingCard: PropTypes.bool,
    outcomes: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      lowerBound: 1,
      boundedLength: 10,
      marketIdsMissingInfo: [], // This is ONLY the currently displayed markets that are missing info
      showPagination: props.filteredMarkets.length > PAGINATION_COUNT
    };

    this.setSegment = this.setSegment.bind(this);
    this.setMarketIDsMissingInfo = this.setMarketIDsMissingInfo.bind(this);
    this.loadMarketsInfoIfNotLoaded = debounce(
      this.loadMarketsInfoIfNotLoaded.bind(this)
    );
  }

  componentWillMount() {
    const { filteredMarkets, loadMarketsInfoIfNotLoaded } = this.props;
    if (loadMarketsInfoIfNotLoaded) {
      this.loadMarketsInfoIfNotLoaded(filteredMarkets);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { filteredMarkets, loadMarketsInfoIfNotLoaded } = this.props;
    if (
      this.state.lowerBound !== nextState.lowerBound ||
      this.state.boundedLength !== nextState.boundedLength ||
      !isEqual(filteredMarkets, nextProps.filteredMarkets)
    ) {
      this.setMarketIDsMissingInfo(
        nextProps.filteredMarkets,
        nextState.lowerBound,
        nextState.boundedLength
      );
    }

    if (
      !isEqual(this.state.marketIdsMissingInfo, nextState.marketIdsMissingInfo)
    ) {
      if (loadMarketsInfoIfNotLoaded) {
        this.loadMarketsInfoIfNotLoaded(nextState.marketIdsMissingInfo);
      }
    }
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength });
  }

  setMarketIDsMissingInfo(filteredMarkets, lowerBound, boundedLength) {
    if (filteredMarkets.length && boundedLength) {
      const marketIdLength = boundedLength + (lowerBound - 1);
      const marketIdsMissingInfo = filteredMarkets.slice(
        lowerBound - 1,
        marketIdLength
      );
      const showPagination = filteredMarkets.length > PAGINATION_COUNT;
      this.setState({ marketIdsMissingInfo, showPagination });
    }
  }

  // debounced call
  loadMarketsInfoIfNotLoaded(marketIds) {
    const { loadMarketsInfoIfNotLoaded } = this.props;
    loadMarketsInfoIfNotLoaded(marketIds || this.state.marketIdsMissingInfo);
  }

  // NOTE -- You'll notice the odd method used for rendering the previews, this is done for optimization reasons
  render() {
    const {
      collectMarketCreatorFees,
      filteredMarkets,
      history,
      isLogged,
      isMobile,
      location,
      markets,
      paginationPageParam,
      toggleFavorite,
      testid,
      pendingLiquidityOrders,
      nullMessage,
      addNullPadding,
      style,
      showDisputingCard,
      outcomes,
      linkType
    } = this.props;
    const s = this.state;

    const marketsLength = filteredMarkets.length;

    return (
      <article className="markets-list" data-testid={testid} style={style}>
        {marketsLength && s.boundedLength ? (
          [...Array(s.boundedLength)].map((unused, i) => {
            const id = filteredMarkets[s.lowerBound - 1 + i];
            const market = markets.find(market => market.id === id);

            if (market && market.id) {
              if (showDisputingCard) {
                return (
                  <DisputeMarketCard
                    key={market.id}
                    market={market}
                    isMobile={isMobile}
                    location={location}
                    history={history}
                    outcomes={outcomes}
                    isForkingMarket={false}
                  />
                );
              }
              return (
                <MarketPreview
                  {...market}
                  key={`${market.id} - ${market.outcomes}`}
                  isLogged={isLogged}
                  toggleFavorite={toggleFavorite}
                  location={location}
                  history={history}
                  collectMarketCreatorFees={collectMarketCreatorFees}
                  isMobile={isMobile}
                  linkType={linkType || TYPE_TRADE}
                  id={market.id}
                  testid={testid}
                  pendingLiquidityOrders={pendingLiquidityOrders}
                />
              );
            }

            return null;
          })
        ) : (
          <NullStateMessage
            addNullPadding={addNullPadding}
            message={nullMessage || "No Markets Available"}
          />
        )}
        {!!marketsLength &&
          s.showPagination && (
            <Paginator
              itemsLength={marketsLength}
              itemsPerPage={PAGINATION_COUNT}
              location={location}
              history={history}
              setSegment={this.setSegment}
              pageParam={paginationPageParam || "page"}
            />
          )}
      </article>
    );
  }
}
