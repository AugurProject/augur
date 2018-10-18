import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import MarketsHeader from "modules/markets-list/components/markets-header/markets-header";
import MarketsList from "modules/markets-list/components/markets-list";
import { TYPE_TRADE } from "modules/markets/constants/link-types";

export default class MarketsView extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    markets: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfoIfNotLoaded: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    loadMarketsByFilter: PropTypes.func.isRequired,
    search: PropTypes.string,
    category: PropTypes.string,
    universe: PropTypes.string,
    defaultFilter: PropTypes.string.isRequired,
    defaultSort: PropTypes.string.isRequired,
    loadDisputing: PropTypes.func.isRequired
  };

  static defaultProps = {
    search: null,
    category: null,
    universe: null
  };

  constructor(props) {
    super(props);

    this.state = {
      filter: props.defaultFilter,
      sort: props.defaultSort,
      filterSortedMarkets: []
    };

    this.updateFilter = this.updateFilter.bind(this);
    this.updateFilteredMarkets = this.updateFilteredMarkets.bind(this);
  }

  componentDidMount() {
    const { universe, loadDisputing } = this.props;
    if (universe) {
      this.updateFilteredMarkets();
      loadDisputing();
    }
  }

  componentDidUpdate(prevProps) {
    const { search, category, universe } = this.props;
    if (
      universe !== prevProps.universe ||
      (search !== prevProps.search || category !== prevProps.category)
    ) {
      this.updateFilteredMarkets();
    }
  }

  updateFilter(params) {
    const { filter, sort } = params;
    this.setState({ filter, sort }, this.updateFilteredMarkets);
  }

  updateFilteredMarkets() {
    const { search, category, loadMarketsByFilter } = this.props;
    const { filter, sort } = this.state;
    loadMarketsByFilter(
      { category, search, filter, sort },
      (err, filterSortedMarkets) => {
        if (err) return console.log("Error loadMarketsFilter:", err);
        if (this.componentWrapper) this.setState({ filterSortedMarkets });
      }
    );
  }

  render() {
    const {
      history,
      isLogged,
      isMobile,
      loadMarketsInfoIfNotLoaded,
      location,
      markets,
      toggleFavorite
    } = this.props;
    const s = this.state;

    return (
      <section
        ref={componentWrapper => {
          this.componentWrapper = componentWrapper;
        }}
      >
        <Helmet>
          <title>Markets</title>
        </Helmet>
        <MarketsHeader
          isLogged={isLogged}
          location={location}
          markets={markets}
          filter={s.filter}
          sort={s.sort}
          updateFilter={this.updateFilter}
        />
        <MarketsList
          testid="markets"
          isLogged={isLogged}
          markets={markets}
          filteredMarkets={s.filterSortedMarkets}
          location={location}
          history={history}
          toggleFavorite={toggleFavorite}
          loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
          linkType={TYPE_TRADE}
          isMobile={isMobile}
        />
      </section>
    );
  }
}
