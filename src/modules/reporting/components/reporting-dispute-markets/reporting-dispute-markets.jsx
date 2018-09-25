import React, { Component } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

import ReportingHeader from "modules/reporting/containers/reporting-header";
import ReportDisputeNoRepState from "src/modules/reporting/components/reporting-dispute-no-rep-state/reporting-dispute-no-rep-state";
import DisputingMarkets from "modules/reporting/components/common/disputing-markets";

const Styles = require("./reporting-dispute-markets.styles");

export default class ReportingDisputeMarkets extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    doesUserHaveRep: PropTypes.bool.isRequired,
    markets: PropTypes.array.isRequired,
    upcomingMarkets: PropTypes.array.isRequired,
    upcomingMarketsCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool,
    navigateToAccountDepositHandler: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    outcomes: PropTypes.object.isRequired,
    isForking: PropTypes.bool.isRequired,
    forkingMarketId: PropTypes.string,
    pageinationCount: PropTypes.number.isRequired,
    disputableMarketsLength: PropTypes.number,
    forkEndTime: PropTypes.string,
    showPagination: PropTypes.bool,
    showUpcomingPagination: PropTypes.bool
  };

  componentWillMount() {
    const { loadMarkets, isConnected } = this.props;
    if (isConnected) loadMarkets();
  }

  render() {
    const {
      doesUserHaveRep,
      forkEndTime,
      history,
      isForking,
      isMobile,
      location,
      markets,
      navigateToAccountDepositHandler,
      upcomingMarkets,
      isConnected,
      loadMarkets,
      outcomes,
      upcomingMarketsCount,
      forkingMarketId,
      pageinationCount,
      disputableMarketsLength,
      showPagination,
      showUpcomingPagination
    } = this.props;

    return (
      <section className={Styles.ReportDisputeContainer}>
        <Helmet>
          <title>Dispute</title>
        </Helmet>
        <section className={Styles.ReportDispute}>
          <ReportingHeader
            heading="Dispute"
            isForking={isForking}
            forkEndTime={forkEndTime}
          />
          {!doesUserHaveRep &&
            !forkEndTime && (
              <ReportDisputeNoRepState
                btnText="Add Funds"
                message="You have 0 REP available. Add funds to dispute markets or purchase participation tokens."
                onClickHandler={navigateToAccountDepositHandler}
              />
            )}
        </section>
        <DisputingMarkets
          location={location}
          history={history}
          markets={markets}
          upcomingMarkets={upcomingMarkets}
          upcomingMarketsCount={upcomingMarketsCount}
          isMobile={isMobile}
          isConnected={isConnected}
          loadMarkets={loadMarkets}
          outcomes={outcomes}
          isForking={isForking}
          forkingMarketId={forkingMarketId}
          pageinationCount={pageinationCount}
          disputableMarketsLength={disputableMarketsLength}
          showPagination={showPagination}
          showUpcomingPagination={showUpcomingPagination}
          addNullPadding
        />
      </section>
    );
  }
}
