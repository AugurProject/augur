import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";
import { createBigNumber } from "utils/create-big-number";
import { formatEther, formatGasCostToEther } from "utils/format-number";
import MarketLiquidityTable from "modules/market/components/market-liquidity-table/market-liquidity-table";

import Styles from "modules/market/components/market-liquidity/market-liquidity.styles";

const NEW_ORDER_GAS_ESTIMATE = createBigNumber(700000);

export default class MarketLiquidity extends Component {
  static propTypes = {
    marketId: PropTypes.string.isRequired,
    market: PropTypes.object.isRequired,
    pendingLiquidityOrders: PropTypes.object,
    removeLiquidityOrder: PropTypes.func.isRequired,
    submitLiquidityOrders: PropTypes.func.isRequired,
    clearMarketLiquidityOrders: PropTypes.func.isRequired,
    updateModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    gasPrice: PropTypes.number.isRequired
  };

  static defaultProps = {
    pendingLiquidityOrders: null
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      showAllOrders: false,
      estimatedGas: createBigNumber("0"),
      totalCost: createBigNumber("0")
    };

    this.handleCancelOrder = this.handleCancelOrder.bind(this);
    this.handleSubmitOrders = this.handleSubmitOrders.bind(this);
    this.handleClearAllMarketOrders = this.handleClearAllMarketOrders.bind(
      this
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { pendingLiquidityOrders, marketId } = this.props;
    if (pendingLiquidityOrders && pendingLiquidityOrders[marketId]) {
      const newMarketOrderBook = pendingLiquidityOrders[marketId];
      const oldMarketOrderBook =
        (prevProps.pendingLiquidityOrders &&
          prevProps.pendingLiquidityOrders[marketId]) ||
        {};
      this.calculateOverallStats(newMarketOrderBook, oldMarketOrderBook);
    }
  }

  calculateOverallStats = (marketOrderBook, oldMarketOrderBook) => {
    const newStats = this.calculateStats(marketOrderBook);
    // old book empty? just update
    if (
      !oldMarketOrderBook ||
      this.state.totalCost.toFixed() !== newStats.totalCost.toFixed()
    ) {
      return this.setState({
        totalCost: newStats.totalCost,
        estimatedGas: newStats.estimatedGas
      });
    }
    const oldStats = this.calculateStats(oldMarketOrderBook);
    // is there a change? update if so
    if (newStats.totalOrders !== oldStats.totalOrders) {
      return this.setState({
        totalCost: newStats.totalCost,
        estimatedGas: newStats.estimatedGas
      });
    }
  };

  calculateStats = marketOrderBook => {
    const outcomes = Object.keys(marketOrderBook);
    let totalCost = createBigNumber(0);
    let estimatedGas = createBigNumber(0);
    let totalOrders = 0;
    outcomes.forEach(outcome => {
      marketOrderBook[outcome].forEach(order => {
        if (!order.sent) {
          totalCost = totalCost.plus(order.orderEstimate);
          estimatedGas = estimatedGas.plus(NEW_ORDER_GAS_ESTIMATE);
          totalOrders += 1;
        }
      });
    });
    return { totalCost, estimatedGas, totalOrders };
  };

  handleCancelOrder(orderDetails) {
    const { marketId, removeLiquidityOrder } = this.props;
    const { outcome: outcomeId, orderId } = orderDetails;
    removeLiquidityOrder({ marketId, outcomeId, orderId });
  }

  handleSubmitOrders(e) {
    const { marketId, submitLiquidityOrders } = this.props;
    submitLiquidityOrders({ marketId });
  }

  handleClearAllMarketOrders(e) {
    const { marketId, clearMarketLiquidityOrders, closeModal } = this.props;
    clearMarketLiquidityOrders(marketId);
    closeModal();
  }

  render() {
    const {
      pendingLiquidityOrders,
      marketId,
      market,
      updateModal,
      closeModal,
      gasPrice
    } = this.props;
    const { isOpen, estimatedGas, totalCost, showAllOrders } = this.state;
    const isNullState = !(
      pendingLiquidityOrders && pendingLiquidityOrders[marketId]
    );
    const marketOrders = isNullState ? {} : pendingLiquidityOrders[marketId];
    const marketOutcomes = Object.keys(marketOrders);
    let headerPadding = "0px";
    if (
      this.tableScroll &&
      this.tableScroll.scrollWidth &&
      this.tableScrollHeader &&
      this.tableScrollHeader.scrollWidth
    ) {
      headerPadding = `${this.tableScrollHeader.scrollWidth -
        this.tableScroll.scrollWidth}px`;
    }
    let runningTotal = 0;
    let tenOrLess = true;
    marketOutcomes.forEach(outcome => {
      runningTotal += marketOrders[outcome].length;
      tenOrLess = runningTotal <= 10;
    });

    return (
      <div
        className={classNames(Styles.MarketLiquidity__container, {
          [Styles.MarketLiquidity__hidden]: isNullState
        })}
      >
        <button
          className={Styles.MarketLiquidity__heading}
          onClick={() => {
            this.setState({ isOpen: !isOpen });
          }}
        >
          <h1>
            You have unsigned orders pending for this Market&apos;s Initial
            Liquidity. Please submit or cancel these orders.
          </h1>
          <div>
            <ChevronFlip big stroke="#fff" pointDown={!isOpen} />
          </div>
        </button>
        {isOpen &&
          pendingLiquidityOrders && (
            <div className={Styles.MarketLiquidity__ExtendedContainer}>
              <h1>Initial Liquidity Orders</h1>
              <div
                ref={tableScrollHeader => {
                  this.tableScrollHeader = tableScrollHeader;
                }}
                className={Styles.MarketLiquidity__TableWrapper}
                style={{ paddingRight: headerPadding }}
              >
                <ul className={Styles.MarketLiquidity__TableHeader}>
                  <li>Type</li>
                  <li>Outcome</li>
                  <li>Quantity</li>
                  <li>Limit Price</li>
                  <li>Cost</li>
                  <li />
                </ul>
              </div>
              <div
                ref={tableScroll => {
                  this.tableScroll = tableScroll;
                }}
                className={classNames(Styles.MarketLiquidity__TableScroll, {
                  [Styles.extended]: showAllOrders
                })}
              >
                <div className={Styles.MarketLiquidity__TableWrapper}>
                  {marketOutcomes &&
                    marketOutcomes.map(outcome => (
                      <MarketLiquidityTable
                        key={`${outcome}-${marketId}-${market.marketType}`}
                        marketType={market.marketType}
                        outcomeOrders={marketOrders[outcome]}
                        removeOrderFromNewMarket={this.handleCancelOrder}
                        selectedOutcome={outcome}
                      />
                    ))}
                </div>
              </div>
              <button
                className={classNames(Styles.MarketLiquidity__showMore, {
                  [Styles.MarketLiquidity__hidden]: tenOrLess
                })}
                onClick={() => {
                  this.setState({ showAllOrders: !showAllOrders });
                }}
              >
                <h1>{showAllOrders ? "Show Less" : "Show All"}</h1>
                <ChevronFlip stroke="#fff" pointDown={!showAllOrders} />
              </button>
              <div className={Styles.MarketLiquidity__costs}>
                <div className={Styles["MarketLiquidity__costs-labels"]}>
                  <h4>Estimasted Gas</h4>
                  <h3>Total Cost</h3>
                </div>
                <div className={Styles["MarketLiquidity__costs-values"]}>
                  <h4>
                    {
                      formatEther(
                        formatGasCostToEther(
                          estimatedGas,
                          { decimalsRounded: 4 },
                          gasPrice
                        )
                      ).full
                    }
                  </h4>
                  <h3>{formatEther(totalCost).full}</h3>
                </div>
              </div>
              <div className={Styles["MarketLiquidity__submit-container"]}>
                <button
                  className={Styles.MarketLiquidity__submit}
                  onClick={this.handleSubmitOrders}
                >
                  Submit Orders
                </button>
                <button
                  className={Styles.MarketLiquidity__clearAll}
                  onClick={e => {
                    e.preventDefault();
                    updateModal({
                      title: "Cancel all unsigned orders?",
                      description: [
                        "Cancelling will permenantly remove them from your initial liquidity list"
                      ],
                      cancelAction: closeModal,
                      cancelButtonText: "keep orders",
                      submitAction: this.handleClearAllMarketOrders,
                      submitButtonText: "cancel orders"
                    });
                  }}
                >
                  Cancel All
                </button>
              </div>
            </div>
          )}
      </div>
    );
  }
}
