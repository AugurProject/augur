import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { BigNumber, createBigNumber } from "utils/create-big-number";

import MarketTradingForm from "modules/trading/components/trading--form/trading--form";
import MarketTradingConfirm from "modules/trading/components/trading--confirm/trading--confirm";
import { Close } from "modules/common/components/icons";

import makePath from "modules/routes/helpers/make-path";
import ValueDenomination from "modules/common/components/value-denomination/value-denomination";

import getValue from "utils/get-value";
import { isEqual } from "lodash";

import { BUY, SELL, LIMIT } from "modules/transactions/constants/types";
import { ACCOUNT_DEPOSIT } from "modules/routes/constants/views";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";
import Styles from "modules/trading/components/trading--wrapper/trading--wrapper.styles";

class MarketTradingWrapper extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    isLogged: PropTypes.bool.isRequired,
    selectedOrderProperties: PropTypes.object.isRequired,
    initialMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
      .isRequired,
    availableFunds: PropTypes.instanceOf(BigNumber).isRequired,
    isMobile: PropTypes.bool.isRequired,
    toggleForm: PropTypes.func.isRequired,
    showOrderPlaced: PropTypes.func.isRequired,
    clearTradeInProgress: PropTypes.func.isRequired,
    selectedOutcome: PropTypes.object,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    gasPrice: PropTypes.number.isRequired
  };

  static defaultProps = {
    selectedOutcome: null
  };

  constructor(props) {
    super(props);

    this.state = {
      orderType: LIMIT,
      orderPrice: props.selectedOrderProperties.price || "",
      orderQuantity: props.selectedOrderProperties.quantity || "",
      orderEthEstimate: "0",
      orderShareEstimate: "0",
      marketOrderTotal: "",
      marketQuantity: "",
      selectedNav: props.selectedOrderProperties.selectedNav || BUY,
      currentPage: 0,
      doNotCreateOrders:
        props.selectedOrderProperties.doNotCreateOrders || false
    };

    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.updateState = this.updateState.bind(this);
    this.clearOrderForm = this.clearOrderForm.bind(this);
    this.updateOrderEthEstimate = this.updateOrderEthEstimate.bind(this);
    this.updateOrderShareEstimate = this.updateOrderShareEstimate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedOrderProperties } = this.props;

    if (!nextProps.selectedOutcome || !nextProps.selectedOutcome.trade) {
      this.setState({ currentPage: 0 });
      return;
    }
    if (this.props.selectedOutcome === null) return this.clearOrderForm();
    if (
      this.props.selectedOutcome &&
      this.props.selectedOutcome.name !== nextProps.selectedOutcome.name
    ) {
      this.setState({ currentPage: 0 });
    }
    const nextTotalCost = createBigNumber(
      nextProps.selectedOutcome.trade.totalCost.formattedValue,
      10
    );
    const nextShareCost = createBigNumber(
      nextProps.selectedOutcome.trade.shareCost.formattedValue,
      10
    );
    // console.log('ests', nextTotalCost.toString(), nextShareCost.toString());
    if (nextTotalCost.abs().toString() !== this.state.orderEthEstimate) {
      this.setState({
        orderEthEstimate: nextTotalCost.abs().toString()
      });
    }

    if (nextShareCost !== this.state.orderShareEstimate) {
      this.setState({
        orderShareEstimate: nextShareCost.abs().toString()
      });
    }

    // Updates from chart clicks
    if (!isEqual(selectedOrderProperties, nextProps.selectedOrderProperties)) {
      this.setState({ ...nextProps.selectedOrderProperties });
    }
  }

  prevPage(e, orderSent = false) {
    const newPage =
      this.state.currentPage <= 0 ? 0 : this.state.currentPage - 1;
    if (orderSent) {
      this.setState({
        currentPage: newPage,
        orderPrice: "",
        orderQuantity: "",
        orderEthEstimate: "0",
        orderShareEstimate: "0",
        marketOrderTotal: "",
        marketQuantity: "",
        doNotCreateOrders: false
      });
      this.props.updateSelectedOrderProperties({
        orderPrice: "",
        orderQuantity: "",
        doNotCreateOrders: false
      });
    } else {
      this.setState({ currentPage: newPage });
    }
  }

  nextPage() {
    const newPage =
      this.state.currentPage >= 1 ? 1 : this.state.currentPage + 1;
    this.setState({ currentPage: newPage });
  }

  updateState(property, value) {
    this.setState({ [property]: value }, () => {
      this.props.updateSelectedOrderProperties({
        orderPrice: this.state.orderPrice,
        orderQuantity: this.state.orderQuantity,
        doNotCreateOrders: this.state.doNotCreateOrders,
        selectedNav: this.state.selectedNav
      });
    });
  }

  clearOrderForm() {
    const { clearTradeInProgress, market } = this.props;
    if (market.id) clearTradeInProgress(market.id);
    this.setState({
      orderPrice: "",
      orderQuantity: "",
      orderEthEstimate: "0",
      orderShareEstimate: "0",
      marketOrderTotal: "",
      marketQuantity: "",
      currentPage: 0,
      doNotCreateOrders: false
    });
  }

  updateOrderEthEstimate(orderEthEstimate) {
    this.setState({
      orderEthEstimate
    });
  }

  updateOrderShareEstimate(orderShareEstimate) {
    this.setState({
      orderShareEstimate
    });
  }

  render() {
    const {
      availableFunds,
      initialMessage,
      isLogged,
      isMobile,
      market,
      selectedOutcome,
      toggleForm,
      showOrderPlaced,
      gasPrice
    } = this.props;
    const s = this.state;

    const lastPrice = getValue(
      this.props,
      "selectedOutcome.lastPrice.formatted"
    );

    return (
      <section className={Styles.TradingWrapper}>
        {isMobile && (
          <div className={Styles["TradingWrapper__mobile-header"]}>
            <button
              className={Styles["TradingWrapper__mobile-header-close"]}
              onClick={toggleForm}
            >
              {Close}
            </button>
            <span className={Styles["TradingWrapper__mobile-header-outcome"]}>
              {selectedOutcome.name}
            </span>
            <span className={Styles["TradingWrapper__mobile-header-last"]}>
              <ValueDenomination formatted={lastPrice} />
              <MarketOutcomeTradingIndicator
                isMobile={isMobile}
                outcome={selectedOutcome}
                location="modileTradingForm"
              />
            </span>
          </div>
        )}
        {s.currentPage === 0 && (
          <div>
            <ul
              className={
                s.selectedNav === BUY
                  ? Styles.TradingWrapper__header_buy
                  : Styles.TradingWrapper__header_sell
              }
            >
              <li
                className={classNames({
                  [`${Styles.active_buy}`]: s.selectedNav === BUY
                })}
              >
                <button onClick={() => this.setState({ selectedNav: BUY })}>
                  Buy
                </button>
              </li>
              <li
                className={classNames({
                  [`${Styles.active_sell}`]: s.selectedNav === SELL
                })}
              >
                <button onClick={() => this.setState({ selectedNav: SELL })}>
                  Sell
                </button>
              </li>
            </ul>
            {initialMessage && (
              <p className={Styles["TradingWrapper__initial-message"]}>
                {!isLogged ? <span>Log in to trade.</span> : initialMessage}
              </p>
            )}
            {initialMessage &&
              isLogged &&
              availableFunds &&
              availableFunds.lte(0) && (
                <Link
                  className={Styles["TradingWrapper__button--add-funds"]}
                  to={makePath(ACCOUNT_DEPOSIT)}
                >
                  Add Funds
                </Link>
              )}
            {!initialMessage && (
              <MarketTradingForm
                market={market}
                marketType={getValue(this.props, "market.marketType")}
                maxPrice={getValue(this.props, "market.maxPrice")}
                minPrice={getValue(this.props, "market.minPrice")}
                availableFunds={availableFunds}
                selectedNav={s.selectedNav}
                orderType={s.orderType}
                orderPrice={s.orderPrice}
                orderQuantity={s.orderQuantity}
                orderEthEstimate={s.orderEthEstimate}
                orderShareEstimate={s.orderShareEstimate}
                marketOrderTotal={s.marketOrderTotal}
                marketQuantity={s.marketQuantity}
                doNotCreateOrders={s.doNotCreateOrders}
                selectedOutcome={selectedOutcome}
                nextPage={this.nextPage}
                updateState={this.updateState}
                isMobile={isMobile}
                gasPrice={gasPrice}
              />
            )}
          </div>
        )}
        {s.currentPage === 1 &&
          selectedOutcome && (
            <MarketTradingConfirm
              market={market}
              selectedNav={s.selectedNav}
              orderType={s.orderType}
              orderPrice={s.orderPrice}
              orderQuantity={s.orderQuantity}
              orderEthEstimate={s.orderEthEstimate}
              marketOrderTotal={s.marketOrderTotal}
              marketQuantity={s.marketQuantity}
              doNotCreateOrders={s.doNotCreateOrders}
              selectedOutcome={selectedOutcome}
              prevPage={this.prevPage}
              trade={selectedOutcome.trade}
              isMobile={isMobile}
              clearOrderForm={this.clearOrderForm}
              showOrderPlaced={showOrderPlaced}
            />
          )}
      </section>
    );
  }
}

export default MarketTradingWrapper;
