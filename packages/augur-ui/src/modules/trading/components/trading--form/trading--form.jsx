/* eslint jsx-a11y/label-has-for: 0 */
import { augur } from "services/augurjs";
import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { BigNumber, createBigNumber } from "utils/create-big-number";
import { MARKET, LIMIT } from "modules/transactions/constants/types";
import { ZERO } from "modules/trades/constants/numbers";
import {
  YES_NO,
  CATEGORICAL,
  SCALAR
} from "modules/markets/constants/market-types";
import { isEqual } from "lodash";
import ReactTooltip from "react-tooltip";
import TooltipStyles from "modules/common/less/tooltip";
import {
  Hint,
  ExclamationCircle as InputErrorIcon
} from "modules/common/components/icons";
import FormStyles from "modules/common/less/form";
import Styles from "modules/trading/components/trading--form/trading--form.styles";
import {
  formatEther,
  formatShares,
  formatGasCostToEther
} from "utils/format-number";
import Checkbox from "src/modules/common/components/checkbox/checkbox";

class MarketTradingForm extends Component {
  static propTypes = {
    availableFunds: PropTypes.instanceOf(BigNumber).isRequired,
    isMobile: PropTypes.bool.isRequired,
    market: PropTypes.object.isRequired,
    marketQuantity: PropTypes.string.isRequired,
    marketOrderTotal: PropTypes.string.isRequired,
    marketType: PropTypes.string.isRequired,
    maxPrice: PropTypes.instanceOf(BigNumber).isRequired,
    minPrice: PropTypes.instanceOf(BigNumber).isRequired,
    nextPage: PropTypes.func.isRequired,
    orderEthEstimate: PropTypes.string.isRequired,
    orderShareEstimate: PropTypes.string.isRequired,
    orderPrice: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object
    ]).isRequired,
    orderQuantity: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object
    ]).isRequired,
    orderType: PropTypes.string.isRequired,
    selectedNav: PropTypes.string.isRequired,
    selectedOutcome: PropTypes.object.isRequired,
    updateState: PropTypes.func.isRequired,
    doNotCreateOrders: PropTypes.bool.isRequired,
    gasPrice: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.INPUT_TYPES = {
      QUANTITY: "orderQuantity",
      PRICE: "orderPrice",
      MARKET_ORDER_SIZE: "marketOrderTotal",
      DO_NOT_CREATE_ORDERS: "doNotCreateOrders"
    };
    this.gas = {
      fillGasLimit: augur.constants.WORST_CASE_FILL[props.market.numOutcomes],
      placeOrderNoSharesGasLimit:
        augur.constants.PLACE_ORDER_NO_SHARES[props.market.numOutcomes],
      placeOrderWithSharesGasLimit:
        augur.constants.PLACE_ORDER_WITH_SHARES[props.market.numOutcomes]
    };
    this.TRADE_MAX_COST = "tradeMaxCost";
    this.MINIMUM_TRADE_VALUE = createBigNumber(1, 10).dividedBy(10000);
    this.orderValidation = this.orderValidation.bind(this);
    this.testQuantity = this.testQuantity.bind(this);
    this.testPrice = this.testPrice.bind(this);
    this.updateTrade = this.updateTrade.bind(this);
    this.state = {
      [this.INPUT_TYPES.QUANTITY]: props.orderQuantity,
      [this.INPUT_TYPES.PRICE]: props.orderPrice,
      [this.INPUT_TYPES.MARKET_ORDER_SIZE]: props.marketOrderTotal,
      [this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]: props.doNotCreateOrders,
      errors: {
        [this.INPUT_TYPES.QUANTITY]: [],
        [this.INPUT_TYPES.PRICE]: [],
        [this.INPUT_TYPES.MARKET_ORDER_SIZE]: [],
        [this.TRADE_MAX_COST]: []
      },
      isOrderValid: this.orderValidation({
        [this.INPUT_TYPES.QUANTITY]: props.orderQuantity,
        [this.INPUT_TYPES.PRICE]: props.orderPrice,
        [this.INPUT_TYPES.MARKET_ORDER_SIZE]: props.marketOrderTotal,
        errors: {
          [this.INPUT_TYPES.QUANTITY]: [],
          [this.INPUT_TYPES.PRICE]: [],
          [this.INPUT_TYPES.MARKET_ORDER_SIZE]: [],
          [this.TRADE_MAX_COST]: []
        }
      }).isOrderValid
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      orderEthEstimate,
      orderShareEstimate,
      selectedNav,
      selectedOutcome,
      updateState
    } = this.props;
    // make sure to keep Quantity and Price as bigNumbers
    const nextQuantity = nextProps[this.INPUT_TYPES.QUANTITY];
    const nextPrice = nextProps[this.INPUT_TYPES.PRICE];

    const newStateInfo = {
      [this.INPUT_TYPES.QUANTITY]: nextQuantity
        ? createBigNumber(nextQuantity, 10)
        : nextQuantity,
      [this.INPUT_TYPES.PRICE]:
        nextPrice && nextPrice !== ""
          ? createBigNumber(nextPrice, 10)
          : nextPrice,
      [this.INPUT_TYPES.MARKET_ORDER_SIZE]:
        nextProps[this.INPUT_TYPES.MARKET_ORDER_SIZE],
      [this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]:
        nextProps[this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]
    };
    const currentStateInfo = {
      [this.INPUT_TYPES.QUANTITY]: this.state[this.INPUT_TYPES.QUANTITY],
      [this.INPUT_TYPES.PRICE]: this.state[this.INPUT_TYPES.PRICE],
      [this.INPUT_TYPES.MARKET_ORDER_SIZE]: this.state[
        this.INPUT_TYPES.MARKET_ORDER_SIZE
      ],
      [this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]: this.state[
        this.INPUT_TYPES.DO_NOT_CREATE_ORDERS
      ]
    };
    const newOrderInfo = {
      orderEthEstimate: nextProps.orderEthEstimate,
      orderShareEstimate: nextProps.orderShareEstimate,
      selectedNav: nextProps.selectedNav,
      ...newStateInfo
    };
    const currentOrderInfo = {
      orderEthEstimate,
      orderShareEstimate,
      selectedNav,
      ...currentStateInfo
    };

    if (!isEqual(newOrderInfo, currentOrderInfo)) {
      // trade has changed, lets update trade.
      this.updateTrade(newStateInfo, nextProps);

      const nextTradePrice = nextProps.selectedOutcome.trade.limitPrice;
      const prevTradePrice = selectedOutcome.trade.limitPrice;
      // limitPrice is being defaulted and we had no value in the input box
      const priceChange = prevTradePrice === null && nextTradePrice !== null;
      // limitPrice is being updated in the background, but we have no limitPrice input set.
      const forcePriceUpdate =
        prevTradePrice === nextTradePrice &&
        nextTradePrice !== null &&
        isNaN(
          this.state[this.INPUT_TYPES.PRICE] &&
            createBigNumber(this.state[this.INPUT_TYPES.PRICE], 10)
        ) &&
        isNaN(
          nextProps[this.INPUT_TYPES.PRICE] &&
            createBigNumber(nextProps[this.INPUT_TYPES.PRICE], 10)
        );

      if (priceChange || forcePriceUpdate) {
        // if limitPrice input hasn't been changed and we have defaulted the limitPrice, populate the field so as to not confuse the user as to where estimates are coming from.
        updateState(
          this.INPUT_TYPES.PRICE,
          createBigNumber(nextTradePrice, 10)
        );
      }

      // orderValidation
      const { isOrderValid, errors, errorCount } = this.orderValidation(
        newStateInfo,
        nextProps
      );
      // update state
      this.setState({ ...newStateInfo, errors, isOrderValid, errorCount });
    }
  }

  testQuantity(value, errors, isOrderValid) {
    let errorCount = 0;
    let passedTest = !!isOrderValid;
    if (!BigNumber.isBigNumber(value))
      return { isOrderValid: false, errors, errorCount };
    if (value && value.lte(0)) {
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.QUANTITY].push("Quantity must be greater than 0");
    }
    return { isOrderValid: passedTest, errors, errorCount };
  }

  testPrice(value, errors, isOrderValid, nextProps = null) {
    const props = nextProps || this.props;
    const { maxPrice, minPrice, market } = props;
    const tickSize = createBigNumber(market.tickSize);
    let errorCount = 0;
    let passedTest = !!isOrderValid;
    if (!BigNumber.isBigNumber(value))
      return { isOrderValid: false, errors, errorCount };
    if (value && (value.lte(minPrice) || value.gte(maxPrice))) {
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.PRICE].push(
        `Price must be between ${minPrice} - ${maxPrice}`
      );
    }
    // removed this validation for now, let's let augur.js handle this.
    if (value && value.mod(tickSize).gt("0")) {
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.PRICE].push(
        `Price must be a multiple of ${tickSize}`
      );
    }
    return { isOrderValid: passedTest, errors, errorCount };
  }

  orderValidation(order, nextProps = null) {
    let errors = {
      [this.INPUT_TYPES.QUANTITY]: [],
      [this.INPUT_TYPES.PRICE]: [],
      [this.INPUT_TYPES.MARKET_ORDER_SIZE]: [],
      [this.TRADE_MAX_COST]: []
    };
    let isOrderValid = true;
    let errorCount = 0;

    const quantity =
      order[this.INPUT_TYPES.QUANTITY] &&
      createBigNumber(order[this.INPUT_TYPES.QUANTITY]);
    const {
      isOrderValid: quantityValid,
      errors: quantityErrors,
      errorCount: quantityErrorCount
    } = this.testQuantity(quantity, errors, isOrderValid, nextProps);
    isOrderValid = quantityValid;
    errorCount += quantityErrorCount;
    errors = { ...errors, ...quantityErrors };

    const price =
      order[this.INPUT_TYPES.PRICE] &&
      createBigNumber(order[this.INPUT_TYPES.PRICE]);
    const {
      isOrderValid: priceValid,
      errors: priceErrors,
      errorCount: priceErrorCount
    } = this.testPrice(price, errors, isOrderValid, nextProps);
    isOrderValid = priceValid;
    errorCount += priceErrorCount;
    errors = { ...errors, ...priceErrors };

    if (
      (nextProps && nextProps.selectedOutcome.trade.potentialEthLoss) ||
      this.props.selectedOutcome.trade.potentialEthLoss
    ) {
      const props = nextProps || this.props;
      const { selectedOutcome, availableFunds, gasPrice } = props;
      const { trade } = selectedOutcome;
      const { totalCost } = trade;
      if (
        totalCost &&
        createBigNumber(totalCost.formattedValue, 10).gte(
          createBigNumber(availableFunds, 10)
        )
      ) {
        isOrderValid = false;
        errors = {
          ...errors,
          [this.TRADE_MAX_COST]: ["You need more ETH to make this trade."]
        };
        errorCount += 1;
      }

      const gas =
        trade.shareCost.formattedValue > 0
          ? this.gas.placeOrderWithSharesGasLimit
          : this.gas.fillGasLimit;
      const gasCost = formatGasCostToEther(
        gas,
        { decimalsRounded: 4 },
        gasPrice
      );
      const tradeTotalCost = createBigNumber(totalCost.formattedValue, 10);
      if (
        tradeTotalCost.gt(ZERO) &&
        createBigNumber(gasCost).gt(createBigNumber(tradeTotalCost))
      ) {
        errors = {
          ...errors,
          [this.TRADE_MAX_COST]: [
            `Est. gas cost ${gasCost} ETH, higer than order cost`
          ]
        };
        errorCount += 1;
      }
    }

    return { isOrderValid, errors, errorCount };
  }

  updateTrade(updatedState, propsToUse) {
    let { props } = this;
    if (propsToUse) props = propsToUse;
    const side = props.selectedNav;
    let limitPrice = updatedState[this.INPUT_TYPES.PRICE];
    let shares = updatedState[this.INPUT_TYPES.QUANTITY];
    const oldShares = this.state[this.INPUT_TYPES.QUANTITY];
    if (shares === null || shares === undefined || shares === "") {
      shares = "0";
      limitPrice = null;
    }
    // keep auto-filling functionality
    if (
      oldShares !== "" &&
      (limitPrice === null || limitPrice === undefined || limitPrice === "")
    ) {
      shares = null;
      limitPrice = SCALAR ? "" : "0";
    }
    props.selectedOutcome.trade.updateTradeOrder(
      shares,
      limitPrice,
      side,
      null
    );
  }

  validateForm(property, rawValue) {
    const { updateState } = this.props;
    // since the order changed by user action, make sure we can place orders.
    // updateState('doNotCreateOrders', false)
    let value = rawValue;
    if (
      property === this.INPUT_TYPES.QUANTITY &&
      (value === "" || createBigNumber(value).lt(0))
    ) {
      updateState(property, "");
      return this.setState({
        [property]: ""
      });
    }
    if (
      !(property === this.INPUT_TYPES.DO_NOT_CREATE_ORDERS) &&
      !BigNumber.isBigNumber(value) &&
      value !== ""
    )
      value = createBigNumber(value, 10);
    const updatedState = {
      ...this.state,
      [property]: value
    };
    const { isOrderValid, errors, errorCount } = this.orderValidation(
      updatedState,
      this.props
    );
    // update the state of the parent component to reflect new property/value
    // only update the trade if there were no errors detected.
    updateState(property, value);

    if (errorCount === 0) {
      this.updateTrade(updatedState);
    }
    // update the local state of this form
    this.setState({
      errors: {
        ...this.state.errors,
        ...errors
      },
      [property]: value,
      isOrderValid
    });
  }
  render() {
    const {
      isMobile,
      market,
      marketQuantity,
      marketType,
      nextPage,
      orderEthEstimate,
      orderShareEstimate,
      orderType,
      selectedOutcome,
      maxPrice,
      minPrice,
      updateState
    } = this.props;
    const s = this.state;

    const tickSize = parseFloat(market.tickSize);
    const max = maxPrice.toString();
    const min = minPrice.toString();
    const errors = Array.from(
      new Set([
        ...s.errors[this.INPUT_TYPES.QUANTITY],
        ...s.errors[this.INPUT_TYPES.PRICE],
        ...s.errors[this.INPUT_TYPES.MARKET_ORDER_SIZE],
        ...s.errors[this.TRADE_MAX_COST]
      ])
    );

    if (orderType === MARKET) {
      return (
        <ul className={Styles["TradingForm__form-body"]}>
          {!isMobile &&
            market.marketType === CATEGORICAL && (
              <li>
                <label>Outcome</label>
                <div className={Styles["TradingForm__static-field"]}>
                  {selectedOutcome.name}
                </div>
              </li>
            )}
          <li>
            <label htmlFor="tr__input--total-cost">Total Cost</label>
            <input
              className={classNames(FormStyles.Form__input, {
                [`${Styles.error}`]: s.errors[
                  this.INPUT_TYPES.MARKET_ORDER_SIZE
                ].length
              })}
              id="tr__input--total-cost"
              type="number"
              step={tickSize}
              placeholder={`${marketType === SCALAR ? tickSize : "0.0001"} ETH`}
              value={
                BigNumber.isBigNumber(s[this.INPUT_TYPES.MARKET_ORDER_SIZE])
                  ? s[this.INPUT_TYPES.MARKET_ORDER_SIZE].toNumber()
                  : s[this.INPUT_TYPES.MARKET_ORDER_SIZE]
              }
              onChange={e =>
                this.validateForm(
                  this.INPUT_TYPES.MARKET_ORDER_SIZE,
                  e.target.value
                )
              }
            />
          </li>
          <li>
            <label>Quantity</label>
            <div className={Styles["TradingForm__static-field"]}>
              {marketQuantity}
            </div>
          </li>
          {errors.length > 0 && (
            <li className={Styles["TradingForm__error-message"]}>
              {InputErrorIcon}{" "}
              {errors.map(error => (
                <p key={error}>{error}</p>
              ))}
            </li>
          )}
          <li
            className={
              marketType === YES_NO
                ? Styles["TradingForm__button__yes_no--review"]
                : Styles["TradingForm__button--review"]
            }
          >
            {marketType === YES_NO && (
              <label
                className={TooltipStyles.TooltipHint}
                data-tip
                data-for="tooltip--participation-tokens"
              >
                {Hint}
              </label>
            )}
            <ReactTooltip
              id="tooltip--participation-tokens"
              className={TooltipStyles.Tooltip}
              effect="solid"
              place="left"
              type="light"
            >
              <h4>Don&apos;t think this event is going to happen?</h4>
              <p>
                Bet against this event occuring by selling shares of Yes (even
                though you don&apos;t own them). Learn more at
                docs.augur.net/#short-position
              </p>
            </ReactTooltip>
            <button
              disabled={!s.isOrderValid}
              onClick={s.isOrderValid ? nextPage : undefined}
            >
              Review
            </button>
          </li>
        </ul>
      );
    }

    if (orderType === LIMIT) {
      return (
        <div>
          <ul className={Styles["TradingForm__form-body"]}>
            {!isMobile &&
              market.marketType === CATEGORICAL && (
                <li>
                  <label>Outcome</label>
                  <div className={Styles["TradingForm__static-field"]}>
                    {selectedOutcome.name}
                  </div>
                </li>
              )}
            <li className={Styles["TradingForm__limit-quantity"]}>
              <label htmlFor="tr__input--quantity">Quantity</label>
              <input
                className={classNames(FormStyles.Form__input, {
                  [`${Styles.error}`]: s.errors[this.INPUT_TYPES.QUANTITY]
                    .length
                })}
                id="tr__input--quantity"
                type="number"
                step={tickSize}
                placeholder={`${
                  marketType === SCALAR ? tickSize : "0.0001"
                } Shares`}
                value={
                  BigNumber.isBigNumber(s[this.INPUT_TYPES.QUANTITY])
                    ? s[this.INPUT_TYPES.QUANTITY].toNumber()
                    : s[this.INPUT_TYPES.QUANTITY]
                }
                onChange={e =>
                  this.validateForm(this.INPUT_TYPES.QUANTITY, e.target.value)
                }
              />
            </li>
            <li className={Styles["TradingForm__limit-price"]}>
              <label htmlFor="tr__input--limit-price">Limit Price</label>
              <input
                className={classNames(FormStyles.Form__input, {
                  [`${Styles.error}`]: s.errors[this.INPUT_TYPES.PRICE].length
                })}
                id="tr__input--limit-price"
                type="number"
                step={tickSize}
                max={max}
                min={min}
                placeholder={`${
                  marketType === SCALAR ? tickSize : "0.0001"
                } ETH`}
                value={
                  BigNumber.isBigNumber(s[this.INPUT_TYPES.PRICE])
                    ? s[this.INPUT_TYPES.PRICE].toNumber()
                    : s[this.INPUT_TYPES.PRICE]
                }
                onChange={e =>
                  this.validateForm(this.INPUT_TYPES.PRICE, e.target.value)
                }
              />
            </li>
            <li className={Styles["TradingForm__do-no-create-orders"]}>
              <Checkbox
                id="tr__input--do-no-create-orders"
                type="checkbox"
                isChecked={s[this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]}
                value={s[this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]}
                onClick={e =>
                  updateState(
                    this.INPUT_TYPES.DO_NOT_CREATE_ORDERS,
                    !s[this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]
                  )
                }
              />
              <label htmlFor="tr__input--do-no-create-orders">
                Fill Orders Only
              </label>
            </li>
          </ul>
          <ul className={Styles["TradingForm__form-estimated-cost"]}>
            <li>
              <span>Est. Cost</span>
            </li>
            <li>
              <span>
                {orderEthEstimate &&
                  `${formatEther(orderEthEstimate).fullPrecision}${
                    formatEther(orderEthEstimate).denomination
                  }`}
              </span>
              <span>
                {orderShareEstimate &&
                  `${formatShares(orderShareEstimate).fullPrecision}${
                    formatShares(orderShareEstimate).denomination
                  }`}
              </span>
            </li>
          </ul>
          <ul className={Styles["TradingForm__form-body"]}>
            {errors.length > 0 && (
              <li className={Styles["TradingForm__error-message"]}>
                {InputErrorIcon}{" "}
                {errors.map(error => (
                  <p key={error}>{error}</p>
                ))}
              </li>
            )}
            <li
              className={
                marketType === YES_NO
                  ? Styles["TradingForm__button__yes_no--review"]
                  : Styles["TradingForm__button--review"]
              }
            >
              {marketType === YES_NO && (
                <label
                  className={TooltipStyles.TooltipHint}
                  data-tip
                  data-for="tooltip--participation-tokens"
                >
                  {Hint}
                </label>
              )}
              <ReactTooltip
                id="tooltip--participation-tokens"
                className={TooltipStyles.Tooltip}
                effect="solid"
                place="left"
                type="light"
              >
                <h4>Don&apos;t think this event is going to happen?</h4>
                <p>
                  Bet against this event occuring by selling shares of Yes (even
                  though you don&apos;t own them). Learn more at
                  docs.augur.net/#short-position
                </p>
              </ReactTooltip>
              <button
                disabled={!s.isOrderValid}
                onClick={s.isOrderValid ? nextPage : undefined}
              >
                Review
              </button>
            </li>
          </ul>
        </div>
      );
    }
  }
}

export default MarketTradingForm;
