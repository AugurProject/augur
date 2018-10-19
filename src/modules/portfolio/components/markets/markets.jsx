import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import makePath from "modules/routes/helpers/make-path";
import MarketsList from "modules/markets-list/components/markets-list";
import Styles from "modules/portfolio/components/markets/markets.styles";
import PortfolioStyles from "modules/portfolio/components/portfolio-view/portfolio-view.styles";
import {
  TYPE_TRADE,
  TYPE_REPORT,
  TYPE_FINALIZE_MARKET
} from "modules/markets/constants/link-types";
import { constants } from "services/augurjs";
import { CREATE_MARKET } from "modules/routes/constants/views";
import MarketsHeaderLabel from "modules/markets-list/components/markets-header-label/markets-header-label";

const DISPUTING_ORDER = {
  [constants.REPORTING_STATE.CROWDSOURCING_DISPUTE]: 1,
  [constants.REPORTING_STATE.AWAITING_NEXT_WINDOW]: 2
};

class MyMarkets extends Component {
  static propTypes = {
    collectMarketCreatorFees: PropTypes.func.isRequired,
    loadMarketsInfoIfNotLoaded: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    myMarkets: PropTypes.array.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    pendingLiquidityOrders: PropTypes.object.isRequired,
    outcomes: PropTypes.object.isRequired,
    loadDisputingMarkets: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    // NOTE: from here to this.state was added to sort markets, this might need to be more robust in the future.
    const openMarkets = [];
    const reportingMarkets = [];
    const disputingMarkets = [];
    const finalMarkets = [];
    const filteredMarketsOpen = [];
    const filteredMarketsReporting = [];
    const filteredMarketsFinal = [];
    this.reportingStates = constants.REPORTING_STATE;

    this.props.myMarkets.forEach((market, index) => {
      if (market.reportingState === this.reportingStates.PRE_REPORTING) {
        openMarkets.push(market);
        filteredMarketsOpen.push(market.id);
      } else if (
        market.reportingState === this.reportingStates.FINALIZED ||
        market.reportingState === this.reportingStates.AWAITING_FINALIZATION
      ) {
        finalMarkets.push(market);
        filteredMarketsFinal.push(market.id);
      } else if (
        market.reportingState === this.reportingStates.CROWDSOURCING_DISPUTE ||
        market.reportingState === this.reportingStates.AWAITING_NEXT_WINDOW
      ) {
        disputingMarkets.push(market);
      } else {
        reportingMarkets.push(market);
        filteredMarketsReporting.push(market.id);
      }
    });

    this.state = {
      openMarkets,
      reportingMarkets,
      disputingMarkets,
      finalMarkets,
      filteredMarketsOpen,
      filteredMarketsReporting,
      filteredMarketsFinal
    };
  }

  componentWillMount() {
    const { loadMarkets, loadDisputingMarkets } = this.props;
    // Load all markets incase they haven't been loaded already
    // Eventually replace this with a 1 to 1 call to augurnode for example what we need.
    loadMarkets();
    loadDisputingMarkets();
  }

  componentWillReceiveProps(nextProps) {
    const openMarkets = [];
    const reportingMarkets = [];
    const disputingMarkets = [];
    const finalMarkets = [];
    const filteredMarketsOpen = [];
    const filteredMarketsReporting = [];
    const filteredMarketsFinal = [];

    nextProps.myMarkets.forEach((market, index) => {
      if (market.reportingState === this.reportingStates.PRE_REPORTING) {
        openMarkets.push(market);
        filteredMarketsOpen.push(market.id);
      } else if (
        market.reportingState === this.reportingStates.FINALIZED ||
        market.reportingState === this.reportingStates.AWAITING_FINALIZATION
      ) {
        finalMarkets.push(market);
        filteredMarketsFinal.push(market.id);
      } else if (
        market.reportingState === this.reportingStates.CROWDSOURCING_DISPUTE ||
        market.reportingState === this.reportingStates.AWAITING_NEXT_WINDOW
      ) {
        disputingMarkets.push(market);
      } else {
        reportingMarkets.push(market);
        filteredMarketsReporting.push(market.id);
      }
    });

    this.setState({
      openMarkets,
      reportingMarkets,
      disputingMarkets,
      finalMarkets,
      filteredMarketsOpen,
      filteredMarketsReporting,
      filteredMarketsFinal
    });
  }

  render() {
    const {
      collectMarketCreatorFees,
      loadMarketsInfoIfNotLoaded,
      history,
      isLogged,
      isMobile,
      loadMarketsInfo,
      location,
      myMarkets,
      toggleFavorite,
      pendingLiquidityOrders,
      outcomes
    } = this.props;
    const s = this.state;
    const haveMarkets = myMarkets && !!myMarkets.length;

    const disputingMarkets = s.disputingMarkets.sort(
      (a, b) =>
        DISPUTING_ORDER[a.reportingState] - DISPUTING_ORDER[b.reportingState]
    );
    const filteredMarketsDisputing = disputingMarkets.map(a => a.id);

    return (
      <section className={Styles.Markets}>
        <Helmet>
          <title>My Markets</title>
        </Helmet>
        {myMarkets &&
          !!myMarkets.length && (
            <MarketsHeaderLabel title="Open" noTopPadding />
          )}
        {haveMarkets && (
          <MarketsList
            testid="open"
            isLogged={isLogged}
            markets={s.openMarkets}
            filteredMarkets={s.filteredMarketsOpen}
            location={location}
            history={history}
            toggleFavorite={toggleFavorite}
            loadMarketsInfo={loadMarketsInfo}
            linkType={TYPE_TRADE}
            paginationPageParam="open"
            collectMarketCreatorFees={collectMarketCreatorFees}
            loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
            isMobile={isMobile}
            pendingLiquidityOrders={pendingLiquidityOrders}
          />
        )}
        {haveMarkets && <MarketsHeaderLabel title="In Reporting" />}
        {haveMarkets && (
          <MarketsList
            testid="inReporting"
            isLogged={isLogged}
            markets={s.reportingMarkets}
            filteredMarkets={s.filteredMarketsReporting}
            location={location}
            history={history}
            toggleFavorite={toggleFavorite}
            loadMarketsInfo={loadMarketsInfo}
            linkType={TYPE_REPORT}
            paginationPageParam="reporting"
            collectMarketCreatorFees={collectMarketCreatorFees}
            loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
            isMobile={isMobile}
          />
        )}
        {haveMarkets && <MarketsHeaderLabel title="In Dispute" />}
        {haveMarkets && (
          <MarketsList
            testid="inDispute"
            isLogged={isLogged}
            markets={disputingMarkets}
            filteredMarkets={filteredMarketsDisputing}
            location={location}
            history={history}
            toggleFavorite={toggleFavorite}
            loadMarketsInfo={loadMarketsInfo}
            linkType={TYPE_REPORT}
            paginationPageParam="dispute"
            collectMarketCreatorFees={collectMarketCreatorFees}
            loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
            isMobile={isMobile}
            showDisputingCard
            outcomes={outcomes}
          />
        )}
        {haveMarkets && <MarketsHeaderLabel title="Resolved" />}
        {haveMarkets && (
          <MarketsList
            testid="resolved"
            isLogged={isLogged}
            markets={s.finalMarkets}
            filteredMarkets={s.filteredMarketsFinal}
            location={location}
            history={history}
            toggleFavorite={toggleFavorite}
            loadMarketsInfo={loadMarketsInfo}
            linkType={TYPE_FINALIZE_MARKET}
            paginationPageParam="final"
            collectMarketCreatorFees={collectMarketCreatorFees}
            loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
            isMobile={isMobile}
            addNullPadding
          />
        )}
        {(myMarkets == null || (myMarkets && myMarkets.length === 0)) && (
          <div className={PortfolioStyles.NoMarkets__container}>
            <span>You haven&apos;t created any markets.</span>
            <Link
              className={PortfolioStyles.NoMarkets__link}
              to={makePath(CREATE_MARKET)}
            >
              <span>Click here to create a new market.</span>
            </Link>
          </div>
        )}
      </section>
    );
  }
}

export default MyMarkets;
