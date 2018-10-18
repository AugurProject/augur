import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import getValue from "utils/get-value";

import MarketPositionsListOrphanedOrder from "modules/market/components/market-positions-list--orphaned-order/market-positions-list--orphaned-order";
import MarketPositionsListPosition from "modules/market/components/market-positions-list--position/market-positions-list--position";
import MarketPositionsListOrder from "modules/market/components/market-positions-list--order/market-positions-list--order";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";
import MarketLink from "modules/market/components/market-link/market-link";
import {
  TYPE_CLAIM_PROCEEDS,
  TYPE_FINALIZE_MARKET
} from "modules/markets/constants/link-types";
import { dateHasPassed } from "utils/format-date";
import CommonStyles from "modules/market/components/common/market-common.styles";
import PositionStyles from "modules/market/components/market-positions-list/market-positions-list.styles";
import Styles from "modules/portfolio/components/market-portfolio-card/market-portfolio-card.styles";
import MarketPortfolioCardFooter from "modules/portfolio/components/market-portfolio-card/market-portfolio-card-footer";

export default class MarketPortfolioCard extends Component {
  static propTypes = {
    claimTradingProceeds: PropTypes.func.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
    isMobile: PropTypes.bool.isRequired,
    linkType: PropTypes.string,
    market: PropTypes.object.isRequired,
    positionsDefault: PropTypes.bool,
    finalizeMarket: PropTypes.func.isRequired,
    getWinningBalances: PropTypes.func.isRequired,
    orphanedOrders: PropTypes.array.isRequired,
    cancelOrphanedOrder: PropTypes.func.isRequired
  };

  static defaultProps = {
    positionsDefault: true,
    linkType: null
  };

  constructor(props) {
    super(props);
    const { positionsDefault, orphanedOrders } = props;
    this.state = {
      tableOpen: {
        myPositions: positionsDefault,
        openOrders: orphanedOrders.length > 0 // open if orphaned orders are present
      }
    };
  }

  componentWillMount() {
    const { market, getWinningBalances } = this.props;
    getWinningBalances([market.id]);
  }

  toggleTable(tableKey) {
    const { tableOpen } = this.state;
    this.setState({
      tableOpen: {
        ...tableOpen,
        [tableKey]: !tableOpen[tableKey]
      }
    });
  }

  finalizeMarket = () => {
    const { finalizeMarket, market } = this.props;
    finalizeMarket(market.id);
  };

  claimProceeds = () => {
    const { claimTradingProceeds, market } = this.props;
    claimTradingProceeds(market.id);
  };

  render() {
    const {
      currentTimestamp,
      isMobile,
      linkType,
      market,
      orphanedOrders,
      cancelOrphanedOrder
    } = this.props;
    const { tableOpen } = this.state;
    const myPositionsSummary = getValue(market, "myPositionsSummary");
    const myPositionOutcomes = getValue(market, "outcomes");

    let localButtonText;
    let buttonAction;
    switch (linkType) {
      case TYPE_CLAIM_PROCEEDS:
        localButtonText = "Claim Proceeds";
        buttonAction = this.claimProceeds;
        break;
      case TYPE_FINALIZE_MARKET:
        localButtonText = "Finalize Market";
        buttonAction = this.finalizeMarket;
        break;
      default:
        localButtonText = "View";
    }
    return (
      <article className={CommonStyles.MarketCommon__container}>
        <section
          className={classNames(
            CommonStyles.MarketCommon__topcontent,
            Styles.MarketCard__topcontent
          )}
        >
          <div
            className={classNames(
              CommonStyles.MarketCommon__header,
              Styles.MarketCard__header
            )}
          >
            <div className={Styles.MarketCard__headertext}>
              <span className={Styles["MarketCard__expiration--mobile"]}>
                {dateHasPassed(currentTimestamp, market.endTime.timestamp)
                  ? "Expired "
                  : "Expires "}
                {isMobile
                  ? market.endTime.formattedLocalShort
                  : market.endTime.formattedLocal}
              </span>
              <h1 className={CommonStyles.MarketCommon__description}>
                <MarketLink id={market.id}>{market.description}</MarketLink>
              </h1>
            </div>
          </div>
          <div className={Styles.MarketCard__topstats}>
            <div className={Styles.MarketCard__leftstats}>
              <div className={Styles.MarketCard__stat}>
                <span className={Styles.MarketCard__statlabel}>
                  Realized P/L
                </span>
                <span className={Styles.MarketCard__statvalue}>
                  {getValue(myPositionsSummary, "realizedNet.formatted") || "0"}
                </span>
                <span className={Styles.MarketCard__statunit}>ETH</span>
              </div>
              <div className={Styles.MarketCard__stat}>
                <span className={Styles.MarketCard__statlabel}>
                  Unrealized P/L
                </span>
                <span className={Styles.MarketCard__statvalue}>
                  {getValue(myPositionsSummary, "unrealizedNet.formatted") ||
                    "0"}
                </span>
                <span className={Styles.MarketCard__statunit}>ETH</span>
              </div>
              <div className={Styles.MarketCard__stat}>
                <span className={Styles.MarketCard__statlabel}>Total P/L</span>
                <span className={Styles.MarketCard__statvalue}>
                  {getValue(myPositionsSummary, "totalNet.formatted") || "0"}
                </span>
                <span className={Styles.MarketCard__statunit}>ETH</span>
              </div>
            </div>
            <span className={Styles.MarketCard__expiration}>
              <span className={Styles.MarketCard__expirationlabel}>
                {market.endTimeLabel}
              </span>
              <span className={Styles.MarketCard__expirationvalue}>
                {getValue(market, "endTime.formattedLocal")}
              </span>
            </span>
          </div>
        </section>
        <section className={Styles.MarketCard__tablesection}>
          {(myPositionOutcomes || []).filter(outcome => outcome.position)
            .length > 0 && (
            <button
              className={Styles.MarketCard__headingcontainer}
              onClick={() => this.toggleTable("myPositions")}
            >
              <h1 className={Styles.MarketCard__tableheading}>My Positions</h1>
              <div className={Styles.MarketCard__tabletoggle}>
                <ChevronFlip pointDown={!tableOpen.myPositions} />
              </div>
            </button>
          )}
          <div className={PositionStyles.MarketPositionsList__table}>
            {tableOpen.myPositions &&
              (myPositionOutcomes || []).filter(outcome => outcome.position)
                .length > 0 && (
                <ul
                  className={classNames(
                    PositionStyles["MarketPositionsList__table-header"],
                    Styles["MarketCard__table-header"]
                  )}
                >
                  <li>Outcome</li>
                  {isMobile ? (
                    <li>
                      <span>Net Qty</span>
                    </li>
                  ) : (
                    <li>
                      <span>Net Quantity</span>
                    </li>
                  )}
                  {isMobile ? (
                    <li>
                      <span>Qty</span>
                    </li>
                  ) : (
                    <li>
                      <span>Quantity</span>
                    </li>
                  )}
                  {isMobile ? (
                    <li>
                      <span>Avg</span>
                    </li>
                  ) : (
                    <li>
                      <span>Avg Price</span>
                    </li>
                  )}
                  {!isMobile && (
                    <li>
                      <span>Last Price</span>
                    </li>
                  )}
                  {!isMobile && (
                    <li>
                      <span>
                        Unrealized <span />
                        P/L
                      </span>
                    </li>
                  )}
                  {!isMobile && (
                    <li>
                      <span>
                        Realized <span />
                        P/L
                      </span>
                    </li>
                  )}
                  <li>
                    <span>
                      Total <span />
                      P/L
                    </span>
                  </li>
                </ul>
              )}
            <div className={PositionStyles["MarketPositionsList__table-body"]}>
              {tableOpen.myPositions &&
                (myPositionOutcomes || [])
                  .filter(outcome => outcome.position)
                  .map(outcome => (
                    <MarketPositionsListPosition
                      key={`${outcome.id}${outcome.marketId}`}
                      outcomeName={outcome.outcome || outcome.name}
                      position={outcome.position}
                      openOrders={
                        outcome.userOpenOrders
                          ? outcome.userOpenOrders.filter(
                              order =>
                                order.id === outcome.position.id &&
                                order.pending
                            )
                          : []
                      }
                      isExtendedDisplay
                      isMobile={isMobile}
                      outcome={outcome}
                    />
                  ))}
            </div>
          </div>
        </section>
        <section className={Styles.MarketCard__tablesection}>
          <div className={PositionStyles.MarketPositionsList__table}>
            {((myPositionOutcomes || []).filter(
              outcome => outcome.userOpenOrders.length > 0
            ).length > 0 ||
              orphanedOrders.length > 0) && (
              <button
                className={Styles.MarketCard__headingcontainer}
                onClick={() => this.toggleTable("openOrders")}
              >
                <h1 className={Styles.MarketCard__tableheading}>Open Orders</h1>
                <div className={Styles.MarketCard__tabletoggle}>
                  <ChevronFlip pointDown={!tableOpen.openOrders} />
                </div>
              </button>
            )}
            <div className={PositionStyles.MarketPositionsList__table}>
              {tableOpen.openOrders &&
                (myPositionOutcomes || []).filter(
                  outcome => outcome.userOpenOrders.length > 0
                ).length > 0 && (
                  <ul
                    className={classNames(
                      PositionStyles["MarketPositionsList__table-header"],
                      Styles["MarketCard__table-header"]
                    )}
                  >
                    <li>Outcome</li>
                    <li />
                    {isMobile ? (
                      <li>
                        <span>Qty</span>
                      </li>
                    ) : (
                      <li>
                        <span>Quantity</span>
                      </li>
                    )}
                    {isMobile ? (
                      <li>
                        <span>Avg</span>
                      </li>
                    ) : (
                      <li>
                        <span>Avg Price</span>
                      </li>
                    )}
                    {!isMobile && (
                      <li>
                        <span>Last Price</span>
                      </li>
                    )}
                    {!isMobile && (
                      <li>
                        <span>Escrowed ETH</span>
                      </li>
                    )}
                    {!isMobile && (
                      <li>
                        <span>Escrowed Shares</span>
                      </li>
                    )}
                    <li className={Styles.MarketCard__hide}>
                      <span>
                        Total <span />
                        P/L
                      </span>
                    </li>
                    <li>
                      <span>Action</span>
                    </li>
                  </ul>
                )}
              <div
                className={PositionStyles["MarketPositionsList__table-body"]}
              >
                {tableOpen.openOrders &&
                  (myPositionOutcomes || [])
                    .filter(outcome => outcome.userOpenOrders)
                    .map(outcome =>
                      outcome.userOpenOrders.map((order, i) => (
                        <MarketPositionsListOrder
                          key={order.id}
                          outcomeName={outcome.name}
                          order={order}
                          pending={order.pending}
                          isExtendedDisplay
                          isMobile={isMobile}
                          outcome={outcome}
                        />
                      ))
                    )}
                {tableOpen.openOrders &&
                  (orphanedOrders || []).map(order => (
                    <MarketPositionsListOrphanedOrder
                      key={order.orderId}
                      outcomeName={order.outcomeName}
                      order={order}
                      pending={false}
                      isExtendedDisplay
                      isMobile={isMobile}
                      outcome={order}
                      isOrphaned
                      cancelOrphanedOrder={cancelOrphanedOrder}
                    />
                  ))}
              </div>
            </div>
          </div>
        </section>
        {linkType &&
          (linkType === TYPE_CLAIM_PROCEEDS ||
            linkType === TYPE_FINALIZE_MARKET) &&
          market.outstandingReturns && (
            <MarketPortfolioCardFooter
              linkType={linkType}
              localButtonText={localButtonText}
              buttonAction={buttonAction}
              outstandingReturns={market.outstandingReturns}
              finalizationTime={market.finalizationTime}
              currentTimestamp={currentTimestamp}
              marketId={market.id}
            />
          )}
      </article>
    );
  }
}
