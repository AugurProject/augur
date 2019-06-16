import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import PortfolioReportsForkedMarketCard from "modules/portfolio/components/portfolio-reports/portfolio-reports-forked-market-card";
import {
  TYPE_CLAIM_PROCEEDS,
  MODAL_CLAIM_REPORTING_FEES_FORKED_MARKET,
} from "modules/common/constants";
import Styles from "modules/portfolio/components/portfolio-reports/portfolio-reports.styles.less";
import DisputingMarkets from "modules/reporting/components/common/disputing-markets";
import ReportingResolved from "modules/reporting/components/reporting-resolved/reporting-resolved";
import MarketsHeaderLabel from "modules/markets-list/components/markets-header-label";

import { formatRep } from "utils/format-number";
import { RepBalance } from "modules/common/labels";
import { MarketData } from "modules/types";


interface PortfolioReportsProps {
  location: Location;
  history: History;
  markets: Array<MarketData>;
  availableRep?: string;
  upcomingMarkets: Array<MarketData>;
  upcomingMarketsCount: number;
  isMobile: boolean;
  isConnected: boolean;
  outcomes: object
  isForking: boolean;
  forkingMarketId: string;
  paginationCount: number;
  disputableMarketsLength?: number;
  showPagination: boolean;
  showUpcomingPagination: boolean;
  currentTimestamp: number;
  getReportingFees: Function;
  finalizeMarket: Function;
  forkedMarket?: MarketData;
  updateModal: Function;
  reportingFees: object
  resolvedMarkets: Array<MarketData>;
  resolvedMarketIds: Array<MarketData>;
  toggleFavorite: Function;
  loadMarketsInfoIfNotLoaded: Function;
  loadMarkets: Function;
  disputableMarketIds: Array<string>;
  upcomingDisputableMarketIds: Array<string>;
  loadDisputingDetails: Function;
}

export default class PortfolioReports extends Component<PortfolioReportsProps> {
  static defaultProps = {
    forkedMarket: null,
    disputableMarketsLength: 0,
    availableRep: "0",
  };

  constructor(props) {
    super(props);

    this.handleClaimReportingFeesForkedMarket = this.handleClaimReportingFeesForkedMarket.bind(
      this,
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
      modalCallback: this.modalCallback,
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
