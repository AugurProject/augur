import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import PortfolioReportsForkedMarketCard from "modules/portfolio/components/portfolio-reports/portfolio-reports-forked-market-card";
import {
  TYPE_CLAIM_PROCEEDS,
  MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET
} from "modules/common-elements/constants";
import Styles from "modules/portfolio/components/portfolio-reports/portfolio-reports.styles";
import DisputingMarkets from "modules/reporting/components/common/disputing-markets";
import ReportingResolved from "modules/reporting/components/reporting-resolved/reporting-resolved";
import MarketsHeaderLabel from "modules/markets-list/components/markets-header-label/markets-header-label";

import { formatRep } from "utils/format-number";
import { RepBalance } from "modules/common-elements/labels";

export default class PortfolioReports extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    availableRep: PropTypes.string,
    upcomingMarkets: PropTypes.array.isRequired,
    upcomingMarketsCount: PropTypes.number.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    outcomes: PropTypes.object.isRequired,
    isForking: PropTypes.bool.isRequired,
    forkingMarketId: PropTypes.string.isRequired,
    paginationCount: PropTypes.number.isRequired,
    disputableMarketsLength: PropTypes.number,
    showPagination: PropTypes.bool.isRequired,
    showUpcomingPagination: PropTypes.bool.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
    getReportingFees: PropTypes.func.isRequired,
    finalizeMarket: PropTypes.func.isRequired,
    forkedMarket: PropTypes.object,
    updateModal: PropTypes.func.isRequired,
    reportingFees: PropTypes.object.isRequired,
    resolvedMarkets: PropTypes.array.isRequired,
    resolvedMarketIds: PropTypes.array.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfoIfNotLoaded: PropTypes.func.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    disputableMarketIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    upcomingDisputableMarketIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    loadDisputingDetails: PropTypes.func.isRequired
  };

  static defaultProps = {
    forkedMarket: null,
    disputableMarketsLength: 0,
    availableRep: "0"
  };

  constructor(props) {
    super(props);

    this.handleClaimReportingFeesForkedMarket = this.handleClaimReportingFeesForkedMarket.bind(
      this
    );
    this.modalCallback = this.modalCallback.bind(this);
  }

  componentWillMount() {
    this.props.getReportingFees();
  }

  handleClaimReportingFeesForkedMarket = () => {
    const {
      unclaimedForkEth,
      unclaimedForkRepStaked,
      forkedMarket
    } = this.props.reportingFees;
    this.props.updateModal({
      type: MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET,
      unclaimedEth: unclaimedForkEth,
      unclaimedRep: unclaimedForkRepStaked,
      forkedMarket,
      modalCallback: this.modalCallback
    });
  };

  modalCallback = results => {
    this.props.getReportingFees();
  };

  render() {
    const {
      currentTimestamp,
      finalizeMarket,
      forkedMarket,
      reportingFees,
      history,
      availableRep,
      isForking,
      isMobile,
      location,
      markets,
      upcomingMarkets,
      isConnected,
      loadMarkets,
      outcomes,
      upcomingMarketsCount,
      forkingMarketId,
      paginationCount,
      disputableMarketsLength,
      showPagination,
      showUpcomingPagination,
      loadMarketsInfoIfNotLoaded,
      resolvedMarkets,
      resolvedMarketIds,
      toggleFavorite,
      disputableMarketIds,
      upcomingDisputableMarketIds,
      loadDisputingDetails
    } = this.props;
    const userHasClaimableForkFees =
      reportingFees.forkedMarket &&
      (reportingFees.unclaimedForkEth.value > 0 ||
        reportingFees.unclaimedForkRepStaked.value > 0);

    return (
      <div>
        <section className={Styles.PortfolioReports}>
          <Helmet>
            <title>Reporting</title>
          </Helmet>
        </section>
        <div style={{ padding: "2rem 2rem 0" }}>
          <RepBalance rep={formatRep(availableRep).formattedValue} />
        </div>
        {userHasClaimableForkFees && (
          <section className={Styles.PortfolioReports}>
            <h4>Forked Market</h4>
            <h5>
              REP staked on an outcome of the forking market will be available
              in the outcome&#39;s corresponding universe once claimed.
            </h5>
            <PortfolioReportsForkedMarketCard
              buttonAction={this.handleClaimReportingFeesForkedMarket}
              currentTimestamp={currentTimestamp}
              finalizeMarket={finalizeMarket}
              linkType={TYPE_CLAIM_PROCEEDS}
              market={forkedMarket}
              unclaimedForkEth={reportingFees.unclaimedForkEth}
              unclaimedForkRepStaked={reportingFees.unclaimedForkRepStaked}
            />
          </section>
        )}
        <div>
          <MarketsHeaderLabel title="Available for dispute" />
          <DisputingMarkets
            location={location}
            history={history}
            markets={markets}
            upcomingMarkets={upcomingMarkets}
            upcomingMarketsCount={upcomingMarketsCount}
            disputableMarketIds={disputableMarketIds}
            upcomingDisputableMarketIds={upcomingDisputableMarketIds}
            loadDisputingDetails={loadDisputingDetails}
            isMobile={isMobile}
            isConnected={isConnected}
            loadMarkets={loadMarkets}
            outcomes={outcomes}
            isForking={isForking}
            forkingMarketId={forkingMarketId}
            paginationCount={paginationCount}
            disputableMarketsLength={disputableMarketsLength}
            showPagination={showPagination}
            showUpcomingPagination={showUpcomingPagination}
            nullDisputeMessage="Markets you have staked on will be listed here when available for dispute."
            nullUpcomingMessage="Markets you have staked on previously will be listed here when waiting for dispute."
          />
        </div>
        <div>
          <ReportingResolved
            location={location}
            isConnected={isConnected}
            history={history}
            isLogged={isConnected}
            isMobile={isMobile}
            loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
            resolvedMarkets={resolvedMarkets}
            resolvedMarketIds={resolvedMarketIds}
            noShowHeader
            toggleFavorite={toggleFavorite}
            nullMessage="Markets you have staked on will be listed here when resolved."
          />
        </div>
      </div>
    );
  }
}
