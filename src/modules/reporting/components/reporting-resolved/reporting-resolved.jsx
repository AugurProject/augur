import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import ReportingHeader from "modules/reporting/containers/reporting-header";
import MarketsList from "modules/markets-list/components/markets-list";
import {
  TYPE_VIEW,
  TYPE_FINALIZE_MARKET
} from "modules/common-elements/constants";
import DisputeMarketCard from "modules/reporting/components/dispute-market-card/dispute-market-card";
import Styles from "modules/reporting/components/reporting-resolved/reporting-resolved.styles";
import MarketsHeaderLabel from "modules/markets-list/components/markets-header-label/markets-header-label";

export default class ReportingResolved extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    resolvedMarkets: PropTypes.array.isRequired,
    resolvedMarketIds: PropTypes.array.isRequired,
    isConnected: PropTypes.bool.isRequired,
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
    nullMessage: "No Markets Available",
    isForkingMarketFinalized: false,
    noShowHeader: false,
    forkingMarket: null,
    loadReporting: null,
    showOutstandingReturns: false
  };

  componentWillMount() {
    const { loadReporting, isConnected } = this.props;
    if (loadReporting && isConnected) loadReporting(null);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.isConnected !== nextProps.isConnected) {
      this.props.loadReporting(null);
    }
  }

  render() {
    const {
      isLogged,
      isMobile,
      loadMarketsInfoIfNotLoaded,
      resolvedMarkets,
      resolvedMarketIds,
      toggleFavorite,
      isForkingMarketFinalized,
      forkingMarket,
      noShowHeader,
      nullMessage,
      location,
      history,
      showOutstandingReturns
    } = this.props;

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
          markets={resolvedMarkets}
          filteredMarkets={resolvedMarketIds}
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
