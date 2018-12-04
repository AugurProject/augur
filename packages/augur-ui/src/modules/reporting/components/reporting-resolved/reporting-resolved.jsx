import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import ReportingHeader from "modules/reporting/containers/reporting-header";
import MarketsList from "modules/markets-list/components/markets-list";
import {
  TYPE_VIEW,
  TYPE_FINALIZE_MARKET
} from "modules/markets/constants/link-types";
import DisputeMarketCard from "modules/reporting/components/dispute-market-card/dispute-market-card";
import Styles from "modules/reporting/components/reporting-resolved/reporting-resolved.styles";
import MarketsHeaderLabel from "modules/markets-list/components/markets-header-label/markets-header-label";

function getMarketIds(markets) {
  const filteredMarkets = [];
  markets.forEach(market => {
    filteredMarkets.push(market.id);
  });
  // Reverse order of filteredMarkets so markets resolved most recently are first
  filteredMarkets.reverse();
  return filteredMarkets;
}

export default class ReportingResolved extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    nullMessage: PropTypes.string,
    isLogged: PropTypes.bool.isRequired,
    loadMarketsInfoIfNotLoaded: PropTypes.func.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    isForkingMarketFinalized: PropTypes.bool,
    noShowHeader: PropTypes.bool,
    forkingMarket: PropTypes.object,
    loadReporting: PropTypes.func,
    isMobile: PropTypes.bool.isRequired,
    showOutstandingReturns: PropTypes.bool
  };

  static defaultProps = {
    nullMessage: null,
    isForkingMarketFinalized: false,
    noShowHeader: false,
    forkingMarket: null,
    loadReporting: null,
    showOutstandingReturns: false
  };

  constructor(props) {
    super(props);

    this.state = {
      filteredMarkets: []
    };
  }

  componentWillMount() {
    const { loadReporting } = this.props;
    if (loadReporting) loadReporting();
  }

  componentWillReceiveProps(nextProps) {
    const { markets } = this.props;
    if (nextProps.markets.length > 0 && nextProps.markets !== markets) {
      const filteredMarkets = getMarketIds(nextProps.markets);
      this.setState({ filteredMarkets });
    }
  }

  render() {
    const {
      isLogged,
      isMobile,
      loadMarketsInfoIfNotLoaded,
      markets,
      toggleFavorite,
      isForkingMarketFinalized,
      forkingMarket,
      noShowHeader,
      nullMessage,
      location,
      history,
      showOutstandingReturns
    } = this.props;
    const s = this.state;

    return (
      <section>
        <Helmet>
          <title>Resolved</title>
        </Helmet>
        {!noShowHeader && <ReportingHeader heading="Resolved" />}
        {isForkingMarketFinalized && (
          <div className={Styles["ReportingResolved__forked-market-card"]}>
            <h2 className={Styles.ReportingResolved__heading}>Forked Market</h2>
            <DisputeMarketCard
              market={forkingMarket}
              location={location}
              history={history}
              linkType={TYPE_VIEW}
              isForkingMarket
              outcomes={[]}
            />
          </div>
        )}
        <MarketsHeaderLabel title="Resolved" />
        <MarketsList
          isLogged={isLogged}
          isMobile={isMobile}
          markets={markets}
          filteredMarkets={s.filteredMarkets}
          location={location}
          history={history}
          linkType={TYPE_FINALIZE_MARKET}
          toggleFavorite={toggleFavorite}
          loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
          paginationPageParam="reporting-resolved-page"
          nullMessage={nullMessage}
          addNullPadding
          showOutstandingReturns={showOutstandingReturns}
        />
      </section>
    );
  }
}
