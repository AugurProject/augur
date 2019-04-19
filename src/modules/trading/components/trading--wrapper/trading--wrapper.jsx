import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { BigNumber, createBigNumber } from "utils/create-big-number";

import TradingForm from "modules/trading/components/trading--form/trading--form";
import TradingConfirm from "modules/trading/components/trading--confirm/trading--confirm";
import { generateTrade } from "modules/trades/helpers/generate-trade";
import getValue from "utils/get-value";
import { isEqual, keys, pick } from "lodash";
import {
  SCALAR,
  BUY,
  SELL,
  UPPER_FIXED_PRECISION_BOUND
} from "modules/common-elements/constants";
import Styles from "modules/trading/components/trading--wrapper/trading--wrapper.styles";
import { OrderButton } from "modules/common-elements/buttons";
import { formatShares } from "utils/format-number";

class TradingWrapper extends Component {
  static propTypes = {
    market: PropTypes.object.isRequired,
    marketReviewTradeSeen: PropTypes.bool.isRequired,
    marketReviewTradeModal: PropTypes.func.isRequired,
    selectedOrderProperties: PropTypes.object.isRequired,
    availableFunds: PropTypes.instanceOf(BigNumber).isRequired,
    isMobile: PropTypes.bool.isRequired,
    selectedOutcome: PropTypes.object,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    handleFilledOnly: PropTypes.func.isRequired,
    gasPrice: PropTypes.number.isRequired,
    updateSelectedOutcome: PropTypes.func.isRequired,
    updateTradeCost: PropTypes.func.isRequired,
    updateTradeShares: PropTypes.func.isRequired,
    showSelectOutcome: PropTypes.func.isRequired,
    onSubmitPlaceTrade: PropTypes.func.isRequired
  };

  static defaultProps = {
    selectedOutcome: null
  };

  static getDefaultTrade(props) {
    if (!(props.market || {}).marketType || !(props.selectedOutcome || {}).id)
      return null;
    return generateTrade(
      {
        id: props.market.id,
        settlementFee: props.market.settlementFee,
        marketType: props.market.marketType,
        maxPrice: props.market.maxPrice,
        minPrice: props.market.minPrice,
        cumulativeScale: props.market.cumulativeScale,
        makerFee: props.market.makerFee
      },
      {}
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      orderPrice: props.selectedOrderProperties.price || "",
      orderQuantity: props.selectedOrderProperties.quantity || "",
      orderEthEstimate: "",
      orderEscrowdEth: "",
      selectedNav: props.selectedOrderProperties.selectedNav || BUY,
      doNotCreateOrders:
        props.selectedOrderProperties.doNotCreateOrders || false
    };

    this.updateState = this.updateState.bind(this);
    this.clearOrderForm = this.clearOrderForm.bind(this);
    this.updateTradeTotalCost = this.updateTradeTotalCost.bind(this);
    this.updateTradeNumShares = this.updateTradeNumShares.bind(this);
    this.updateOrderProperty = this.updateOrderProperty.bind(this);
    this.updateNewOrderProperties = this.updateNewOrderProperties.bind(this);
    this.clearOrderConfirmation = this.clearOrderConfirmation.bind(this);
  }

  componentWillMount() {
    this.setState({
      ...this.state,
      trade: TradingWrapper.getDefaultTrade(this.props)
    });
  }

  componentWillUpdate(nextProps) {
    const { selectedOrderProperties } = this.props;

    if (!isEqual(selectedOrderProperties, nextProps.selectedOrderProperties)) {
      if (
        nextProps.selectedOrderProperties.orderPrice !==
          this.state.orderPrice ||
        nextProps.selectedOrderProperties.orderQuantity !==
          this.state.orderQuantity ||
        nextProps.selectedOrderProperties.selectedNav !== this.state.selectedNav
      ) {
        if (
          !nextProps.selectedOrderProperties.orderPrice &&
          !nextProps.selectedOrderProperties.orderQuantity
        ) {
          return this.clearOrderForm();
        }

        this.updateTradeTotalCost(
          { ...nextProps.selectedOrderProperties },
          true
        );
      }
    }
  }

  updateState(stateValues, cb) {
    this.setState(currentState => ({ ...currentState, ...stateValues }), cb);
  }

  clearOrderConfirmation() {
    const trade = TradingWrapper.getDefaultTrade(this.props);
    this.setState({ trade });
  }

  clearOrderForm(wholeForm = true) {
    const trade = TradingWrapper.getDefaultTrade(this.props);

    if (wholeForm) {
      this.updateState(
        {
          orderPrice: "",
          orderQuantity: "",
          orderEthEstimate: "",
          orderEscrowdEth: "",
          doNotCreateOrders: false,
          selectedNav: this.state.selectedNav,
          trade
        },
        () => {
          this.updateParentOrderValues();
        }
      );
    } else {
      this.updateState(
        {
          trade
        },
        () => {
          this.updateParentOrderValues();
        }
      );
    }
  }

  updateParentOrderValues() {
    this.props.updateSelectedOrderProperties({
      ...pick(this.state, keys(this.props.selectedOrderProperties))
    });
  }

  updateNewOrderProperties(selectedOrderProperties) {
    this.updateTradeTotalCost({ ...selectedOrderProperties }, true);
  }

  updateOrderProperty(property, callback) {
    const values = {
      ...property
    };
    this.updateState(values, () => {
      this.updateParentOrderValues();
      if (callback) callback();
    });
  }

  updateTradeTotalCost(order, fromOrderBook = false) {
    const { updateTradeCost, selectedOutcome, market } = this.props;
    let useValues = {
      ...order,
      orderEthEstimate: ""
    };
    if (!fromOrderBook) {
      useValues = {
        ...this.state,
        orderEthEstimate: ""
      };
    }
    this.updateState(
      {
        ...this.state,
        ...useValues
      },
      () => {
        updateTradeCost(
          market.id,
          selectedOutcome.id,
          {
            limitPrice: order.orderPrice,
            side: order.selectedNav,
            numShares: order.orderQuantity,
            selfTrade: order.selfTrade
          },
          (err, newOrder) => {
            if (err) {
              // just update properties for form
              return this.updateState({
                ...this.state,
                ...order,
                orderEthEstimate: "",
                orderEscrowdEth: ""
              });
            }

            const newOrderEthEstimate = formatShares(
              createBigNumber(newOrder.totalOrderValue.fullPrecision),
              {
                decimalsRounded: UPPER_FIXED_PRECISION_BOUND
              }
            ).rounded;

            this.updateState({
              ...this.state,
              ...order,
              orderEthEstimate: newOrderEthEstimate,
              orderEscrowdEth: newOrder.potentialEthLoss.formatted,
              trade: newOrder
            });
          }
        );
      }
    );
  }

  placeTrade(market, selectedOutcome, s) {
    this.props.onSubmitPlaceTrade(
      market.id,
      selectedOutcome.id,
      s.trade,
      s.doNotCreateOrders,
      (err, tradeGroupID) => {
        // onSent/onFailed CB
        if (!err) {
          this.clearOrderForm();
        }
      },
      res => {
        if (s.doNotCreateOrders && res.res !== res.sharesToFill) {
          this.props.handleFilledOnly(res.tradeInProgress);
          // onComplete CB
        }
      }
    );
  }

  updateTradeNumShares(order) {
    const { updateTradeShares, selectedOutcome, market } = this.props;
    this.updateState(
      {
        ...order,
        orderQuantity: "",
        orderEscrowdEth: ""
      },
      () =>
        updateTradeShares(
          market.id,
          selectedOutcome.id,
          {
            limitPrice: order.orderPrice,
            side: order.selectedNav,
            maxCost: order.orderEthEstimate
          },
          (err, newOrder) => {
            if (err) return console.log(err); // what to do with error here

            const numShares = formatShares(
              createBigNumber(newOrder.numShares),
              {
                decimalsRounded: UPPER_FIXED_PRECISION_BOUND
              }
            ).rounded;

            this.updateState(
              {
                ...this.state,
                ...order,
                orderQuantity: numShares,
                orderEscrowdEth: newOrder.potentialEthLoss.formatted,
                trade: newOrder
              },
              () => {
                this.updateParentOrderValues();
              }
            );
          }
        )
    );
  }

  render() {
    const {
      availableFunds,
      isMobile,
      market,
      selectedOutcome,
      gasPrice,
      updateSelectedOutcome,
      showSelectOutcome,
      marketReviewTradeSeen,
      marketReviewTradeModal
    } = this.props;
    const s = this.state;
    const {
      selectedNav,
      orderPrice,
      orderQuantity,
      orderEthEstimate,
      orderEscrowdEth,
      doNotCreateOrders
    } = s;

    return (
      <section className={Styles.TradingWrapper}>
        <div className={Styles.TradingWrapper__container}>
          <section className={Styles.TradingWrapper__darkbg}>
            <ul
              className={classNames({
                [Styles.TradingWrapper__header_buy]: selectedNav === BUY,
                [Styles.TradingWrapper__header_sell]: selectedNav === SELL
              })}
            >
              <li
                className={classNames({
                  [`${Styles.active_buy}`]: selectedNav === BUY
                })}
              >
                <button
                  onClick={() =>
                    this.updateTradeTotalCost({
                      ...s,
                      selectedNav: BUY
                    })
                  }
                >
                  <div>Buy Shares</div>
                  <span
                    className={classNames(
                      Styles.TradingWrapper__underline__buy,
                      {
                        [`${Styles.notActive}`]: selectedNav === SELL
                      }
                    )}
                  />
                </button>
              </li>
              <li
                className={classNames({
                  [`${Styles.active_sell}`]: selectedNav === SELL
                })}
              >
                <button
                  onClick={() =>
                    this.updateTradeTotalCost({
                      ...s,
                      selectedNav: SELL
                    })
                  }
                >
                  <div>Sell Shares</div>
                  <span
                    className={classNames(
                      Styles.TradingWrapper__underline__sell,
                      {
                        [`${Styles.notActive}`]: selectedNav === BUY
                      }
                    )}
                  />
                </button>
              </li>
            </ul>
          </section>
          {market.marketType === SCALAR && (
            <div className={Styles.TradingWrapper__scalar__line} />
          )}
          {market &&
            market.marketType && (
              <TradingForm
                market={market}
                marketType={getValue(this.props, "market.marketType")}
                maxPrice={getValue(this.props, "market.maxPrice")}
                minPrice={getValue(this.props, "market.minPrice")}
                selectedNav={selectedNav}
                orderPrice={orderPrice}
                orderQuantity={orderQuantity}
                orderEthEstimate={orderEthEstimate}
                orderEscrowdEth={orderEscrowdEth}
                doNotCreateOrders={doNotCreateOrders}
                selectedOutcome={selectedOutcome}
                updateState={this.updateState}
                updateOrderProperty={this.updateOrderProperty}
                isMobile={isMobile}
                clearOrderForm={this.clearOrderForm}
                updateSelectedOutcome={updateSelectedOutcome}
                updateTradeTotalCost={this.updateTradeTotalCost}
                updateTradeNumShares={this.updateTradeNumShares}
                showSelectOutcome={showSelectOutcome}
                updateNewOrderProperties={this.updateNewOrderProperties}
                clearOrderConfirmation={this.clearOrderConfirmation}
              />
            )}
        </div>
        {s.trade &&
          (s.trade.shareCost.value !== 0 || s.trade.totalCost.value !== 0) && (
            <TradingConfirm
              numOutcomes={market.numOutcomes}
              marketType={getValue(this.props, "market.marketType")}
              maxPrice={getValue(this.props, "market.maxPrice")}
              minPrice={getValue(this.props, "market.minPrice")}
              trade={s.trade.displayTrade}
              isMobile={isMobile}
              gasPrice={gasPrice}
              availableFunds={availableFunds}
              selectedOutcome={selectedOutcome}
              scalarDenomination={market.scalarDenomination}
            />
          )}
        <div
          className={classNames(Styles.TradingWrapper__actions, {
            [Styles.TradingWrapper__fullActions]:
              s.trade &&
              (s.trade.shareCost.value !== 0 || s.trade.totalCost.value !== 0)
          })}
        >
          <OrderButton
            type={selectedNav}
            action={e => {
              e.preventDefault();
              if (!marketReviewTradeSeen) {
                marketReviewTradeModal({
                  marketId: market.id,
                  cb: () => this.placeTrade(market, selectedOutcome, s)
                });
              } else {
                this.placeTrade(market, selectedOutcome, s);
              }
            }}
            disabled={!s.trade || !s.trade.limitPrice}
          />
        </div>
      </section>
    );
  }
}

export default TradingWrapper;
