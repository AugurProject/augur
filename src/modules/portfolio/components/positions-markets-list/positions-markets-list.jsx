import React, { Component } from "react";
import PropTypes from "prop-types";
import MarketPortfolioCard from "modules/portfolio/containers/market-portfolio-card";
import NullStateMessage from "modules/common/components/null-state-message/null-state-message";
import Paginator from "modules/common/components/paginator/paginator";
import MarketsHeaderLabel from "modules/markets-list/components/markets-header-label/markets-header-label";
import isEqual from "lodash/isEqual";

export default class PositionsMarketsList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    markets: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    transactionsStatus: PropTypes.object.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
    paginationName: PropTypes.string.isRequired,
    positionsDefault: PropTypes.bool,
    claimTradingProceeds: PropTypes.func,
    isMobile: PropTypes.bool.isRequired,
    noTopPadding: PropTypes.bool,
    addNullPadding: PropTypes.bool
  };

  static defaultProps = {
    noTopPadding: false,
    addNullPadding: false,
    positionsDefault: true,
    claimTradingProceeds: null
  };

  constructor(props) {
    super(props);

    const paginationCount = 10;

    this.state = {
      lowerBound: 1,
      boundedLength: paginationCount,
      paginationCount,
      filteredMarkets: []
    };

    this.setSegment = this.setSegment.bind(this);
    this.setFilteredMarkets = this.setFilteredMarkets.bind(this);
  }

  componentWillMount() {
    const { lowerBound, boundedLength } = this.state;
    this.setFilteredMarkets(this.props.markets, lowerBound, boundedLength);
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.lowerBound !== nextState.lowerBound ||
      this.state.boundedLength !== nextState.boundedLength ||
      !isEqual(this.props.markets, nextProps.markets)
    ) {
      this.setFilteredMarkets(
        nextProps.markets,
        nextState.lowerBound,
        nextState.boundedLength
      );
    }
  }

  setFilteredMarkets(markets, lowerBound, boundedLength) {
    const itemLength = boundedLength + (lowerBound - 1);
    const filteredMarkets =
      markets && markets.length > 0
        ? markets.slice(lowerBound - 1, itemLength)
        : [];
    this.setState({ filteredMarkets });
  }

  setSegment(lowerBound, upperBound, boundedLength) {
    this.setState({ lowerBound, boundedLength });
  }

  render() {
    const {
      markets,
      location,
      history,
      positionsDefault,
      claimTradingProceeds,
      isMobile,
      currentTimestamp,
      title,
      paginationName,
      noTopPadding,
      addNullPadding,
      transactionsStatus
    } = this.props;
    const { paginationCount, filteredMarkets } = this.state;

    return (
      <div>
        <MarketsHeaderLabel title={title} noTopPadding={noTopPadding} />
        {markets &&
          markets.length > 0 &&
          filteredMarkets.map(market => (
            <MarketPortfolioCard
              key={market.id}
              market={market}
              transactionsStatus={transactionsStatus}
              location={location}
              history={history}
              positionsDefault={positionsDefault}
              claimTradingProceeds={claimTradingProceeds}
              isMobile={isMobile}
              currentTimestamp={currentTimestamp}
            />
          ))}
        {markets.length > paginationCount && (
          <Paginator
            itemsLength={markets.length}
            itemsPerPage={paginationCount}
            location={location}
            history={history}
            setSegment={this.setSegment}
            pageParam={paginationName}
          />
        )}
        {markets.length === 0 && (
          <NullStateMessage
            addNullPadding={addNullPadding}
            message="No Markets Available"
          />
        )}
      </div>
    );
  }
}
