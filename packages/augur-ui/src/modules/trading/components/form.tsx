/* eslint jsx-a11y/label-has-for: 0 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import {
  SCALAR,
  UPPER_FIXED_PRECISION_BOUND,
  BUY,
  SELL,
  INVALID_OUTCOME_ID,
  ONE,
  SMALL_MOBILE,
  MIN_ORDER_LIFESPAN,
  MIN_QUANTITY,
  INVALID_OUTCOME_COMPARE,
  INVALID_OUTCOME_LABEL,
} from 'modules/common/constants';
import FormStyles from 'modules/common/form-styles.less';
import Styles from 'modules/trading/components/form.styles.less';
import { ExclamationCircle } from 'modules/common/icons';
import { SquareDropdown } from 'modules/common/selection';
import { TextInput } from 'modules/common/form';
import getPrecision from 'utils/get-number-precision';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { MarketData, OutcomeFormatted } from 'modules/types';
import type { Getters } from "@augurproject/sdk";
import {
  getTradeInterval,
} from '@augurproject/sdk-lite';
import {
  tickSizeToNumTickWithDisplayPrices,
  convertDisplayAmountToOnChainAmount,
  QUINTILLION,
  DEFAULT_TRADE_INTERVAL
} from '@augurproject/utils';
import {
  CancelTextButton,
  SecondaryButton,
} from 'modules/common/buttons';
import moment, { Moment } from 'moment';
import { EXPIRATION_DATE_OPTIONS, convertUnixToFormattedDate, calcOrderExpirationTime, calcOrderExpirationTimeRemaining } from 'utils/format-date';
import { SimpleTimeSelector } from 'modules/create-market/components/common';
import { calcPercentageFromPrice, calcPriceFromPercentage } from 'utils/format-number';
import Media from 'react-media';

enum ADVANCED_OPTIONS {
  EXPIRATION = '1',
  FILL = '2',
  POST = '3',
}

const advancedDropdownOptions = [
  {
    label: 'Order expiration',
    value: ADVANCED_OPTIONS.EXPIRATION,
  },
  {
    label: 'Fill only',
    value: ADVANCED_OPTIONS.FILL,
  },
  {
    label: 'Post only',
    value: ADVANCED_OPTIONS.POST,
  },
];

const liqAdvancedDropdownOptions = [
  {
    label: 'Order expiration',
    value: ADVANCED_OPTIONS.EXPIRATION,
  },
];

interface FromProps {
  market: MarketData;
  marketType: string;
  maxPrice: BigNumber;
  minPrice: BigNumber;
  orderQuantity: string;
  orderPrice: string;
  orderDaiEstimate: string;
  orderEscrowdDai: string;
  selectedNav: string;
  selectedOutcome: Getters.Markets.MarketInfoOutcome;
  updateState: Function;
  sortedOutcomes: OutcomeFormatted[];
  updateOrderProperty: Function;
  doNotCreateOrders: boolean;
  expirationDate?: Moment;
  updateSelectedOutcome: Function;
  clearOrderForm: Function;
  updateTradeTotalCost: Function;
  updateTradeNumShares: Function;
  clearOrderConfirmation: Function;
  initialLiquidity?: Boolean;
  orderBook: Getters.Markets.OutcomeOrderBook;
  availableDai: BigNumber;
  currentTimestamp: number;
  tradingTutorial?: boolean;
  gasCostEst: string;
  orderPriceEntered: Function;
  orderAmountEntered: Function;
  gasPrice: number;
  getGasConfirmEstimate: Function;
  endTime: number;
  isMobile: boolean;
}

interface TestResults {
  isOrderValid: boolean;
  errors: object;
  errorCount: number;
}

interface FormState {
  isOrderValid: boolean;
  lastInputModified: string;
  [item: string]: string;
  errors: object;
  errorCount: number;
  advancedOption: string;
  fastForwardTime: number;
  expirationDateOption: string;
  expirationDate?: Moment;
  percentage: string;
  confirmationTimeEstimation: number;
}

class Form extends Component<FromProps, FormState> {
  INPUT_TYPES: {
    MULTIPLE_QUANTITY: string;
    QUANTITY: string;
    PRICE: string;
    DO_NOT_CREATE_ORDERS: string;
    EST_DAI: string;
    SELECTED_NAV: string;
    EXPIRATION_DATE: string;
    POST_ONLY_ORDER: string;
  };

  MINIMUM_TRADE_VALUE: BigNumber;

  constructor(props) {
    super(props);

    this.INPUT_TYPES = {
      MULTIPLE_QUANTITY: 'multipleOrderQuantity',
      QUANTITY: 'orderQuantity',
      PRICE: 'orderPrice',
      DO_NOT_CREATE_ORDERS: 'doNotCreateOrders',
      POST_ONLY_ORDER: 'postOnlyOrder',
      EST_DAI: 'orderDaiEstimate',
      SELECTED_NAV: 'selectedNav',
      EXPIRATION_DATE: 'expirationDate',
    };

    this.MINIMUM_TRADE_VALUE = createBigNumber(1, 10).dividedBy(10000);
    this.orderValidation = this.orderValidation.bind(this);
    this.testQuantityAndExpiry = this.testQuantityAndExpiry.bind(this);
    this.testPrice = this.testPrice.bind(this);
    this.testTotal = this.testTotal.bind(this);

    const startState = {
      [this.INPUT_TYPES.QUANTITY]: props.orderQuantity,
      [this.INPUT_TYPES.PRICE]: props.orderPrice,
      [this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]: props.doNotCreateOrders,
      [this.INPUT_TYPES.POST_ONLY_ORDER]: false,
      [this.INPUT_TYPES.EXPIRATION_DATE]: props.expirationDate || calcOrderExpirationTime(props.endTime, props.currentTimestamp),
      [this.INPUT_TYPES.SELECTED_NAV]: props.selectedNav,
      [this.INPUT_TYPES.EST_DAI]: props.orderDaiEstimate,
      errors: {
        [this.INPUT_TYPES.MULTIPLE_QUANTITY]: [],
        [this.INPUT_TYPES.QUANTITY]: [],
        [this.INPUT_TYPES.PRICE]: [],
        [this.INPUT_TYPES.EST_DAI]: [],
        [this.INPUT_TYPES.EXPIRATION_DATE]: [],
      },
    };

    const remainingTime = calcOrderExpirationTimeRemaining(this.props.endTime, this.props.currentTimestamp);
    this.state = {
      ...startState,
      isOrderValid: this.orderValidation(startState).isOrderValid,
      lastInputModified: '',
      errorCount: 0,
      advancedOption: advancedDropdownOptions[0].value,
      fastForwardTime: remainingTime.time,
      expirationDateOption: remainingTime.unit,
      percentage: '',
      confirmationTimeEstimation: 0,
    };

    this.changeOutcomeDropdown = this.changeOutcomeDropdown.bind(this);
    this.updateTestProperty = this.updateTestProperty.bind(this);
    this.clearOrderFormProperties = this.clearOrderFormProperties.bind(this);
    this.updateAndValidate = this.updateAndValidate.bind(this);
  }

  componentDidMount() {
    this.getGasConfirmEstimate();
  }

  componentDidUpdate(prevProps) {
    this.updateTestProperty(this.INPUT_TYPES.QUANTITY, this.props);
    this.updateTestProperty(this.INPUT_TYPES.PRICE, this.props);
    this.updateTestProperty(this.INPUT_TYPES.EST_DAI, this.props);

    if (
      this.props[this.INPUT_TYPES.DO_NOT_CREATE_ORDERS] !==
      this.state[this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]
    ) {
      this.setState({
        [this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]: this.props[
          this.INPUT_TYPES.DO_NOT_CREATE_ORDERS
        ],
      });
    }
    const { maxPrice, minPrice, market, selectedOutcome } = this.props;
    if (
      !!prevProps[this.INPUT_TYPES.PRICE] &&
      !!!this.props[this.INPUT_TYPES.PRICE]
    ) {
      this.setState({ percentage: '' });
    } else if (
      market.marketType === SCALAR &&
      selectedOutcome.id === INVALID_OUTCOME_ID &&
      !prevProps[this.INPUT_TYPES.PRICE] && !this.state.percentage && this.props[this.INPUT_TYPES.PRICE]
    ) {
      const price = this.props[this.INPUT_TYPES.PRICE];
      const percentage = calcPercentageFromPrice(
        price,
        String(minPrice),
        String(maxPrice),
      );
      this.setState({ percentage: String(percentage) }, () =>
        this.updateAndValidate(this.INPUT_TYPES.PRICE, price)
      );
    }

    if (prevProps.gasPrice !== this.props.gasPrice || prevProps.expirationDate !== this.props.expirationDate) {
      this.getGasConfirmEstimate();
    }
  }

  updateTestProperty(property, nextProps) {
    const { clearOrderConfirmation } = this.props;
    if (nextProps[property] !== this.state[property]) {
      this.setState(
        {
          [property]: nextProps[property],
        },
        () => {
          const newOrderInfo = {
            ...this.state,
            [property]: nextProps[property],
          };
          const { isOrderValid, errors, errorCount } = this.orderValidation(
            newOrderInfo,
            undefined,
            nextProps,
            true
          );
          if (errorCount > 0) {
            clearOrderConfirmation();
          }
          this.setState({
            ...newOrderInfo,
            errors,
            isOrderValid,
            errorCount,
          });
        }
      );
    }
  }

  async getGasConfirmEstimate() {
    try {
      const confirmationTimeEstimation = await this.props.getGasConfirmEstimate();
      this.setState({ confirmationTimeEstimation });
      this.validateForm(this.INPUT_TYPES.EXPIRATION_DATE, this.state.expirationDate);
    } catch (error) {
      this.setState({ confirmationTimeEstimation: 0 });
    }
  }

  testTotal(value, errors, isOrderValid, price, quantity): TestResults {
    let errorCount = 0;
    let passedTest = !!isOrderValid;
    if (value === '' && price && !!!quantity) {
      return { isOrderValid: false, errors, errorCount };
    }
    if (value && createBigNumber(value).lt(0)) {
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.EST_DAI].push(
        'Total Order Value must be greater than 0'
      );
    }
    return { isOrderValid: passedTest, errors, errorCount };
  }

  findMultipleOf = () => {
    const { market } = this.props;
    let tradeInterval = DEFAULT_TRADE_INTERVAL;
    const numTicks = market.numTicks
      ? createBigNumber(market.numTicks)
      : tickSizeToNumTickWithDisplayPrices(
          createBigNumber(market.tickSize),
          createBigNumber(market.minPrice),
          createBigNumber(market.maxPrice)
        );

    if (market.marketType == SCALAR) {
      tradeInterval = getTradeInterval(
        createBigNumber(market.minPrice).times(QUINTILLION),
        createBigNumber(market.maxPrice).times(QUINTILLION),
        numTicks
      );
    }

    return tradeInterval.dividedBy(market.tickSize).dividedBy(10 ** 18);
  };

  findNearestValues = value => {
    const valueBn = createBigNumber(value);
    const multipleOf = this.findMultipleOf();

    let firstValue = valueBn.minus(valueBn.mod(multipleOf));
    let secondValue = valueBn.plus(multipleOf).minus(valueBn.mod(multipleOf));
    if (firstValue.lt(ONE)) {
      firstValue = secondValue;
      secondValue = valueBn
        .plus(multipleOf)
        .plus(multipleOf)
        .minus(valueBn.mod(multipleOf));
    }

    return [firstValue, secondValue];
  };

  testQuantityAndExpiry(
    value,
    errors: object,
    isOrderValid: boolean,
    fromExternal: boolean,
    nextProps,
    expiration?
  ): TestResults {
    const props = nextProps || this.props;
    const { market, currentTimestamp } = props;
    const isScalar: boolean = market.marketType === SCALAR;
    let errorCount = 0;
    let passedTest = !!isOrderValid;
    const precision = getPrecision(value, 0);

    if (!BigNumber.isBigNumber(value)) {
      return { isOrderValid: false, errors, errorCount };
    }

    if (value && value.lte(0)) {
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.QUANTITY].push('Quantity must be greater than 0');
    }
    if (value && value.lt(0.000000001) && !value.eq(0) && !fromExternal) {
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.QUANTITY].push(
        'Quantity must be greater than 0.000000001'
      );
    }
    if (
      !isScalar &&
      value &&
      precision > UPPER_FIXED_PRECISION_BOUND &&
      !fromExternal
    ) {
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.QUANTITY].push(
        `Precision must be ${UPPER_FIXED_PRECISION_BOUND} decimals or less`
      );
    }

    const numTicks = market.numTicks
      ? createBigNumber(market.numTicks)
      : tickSizeToNumTickWithDisplayPrices(
          createBigNumber(market.tickSize),
          createBigNumber(market.minPrice),
          createBigNumber(market.maxPrice)
        );

    let tradeInterval = DEFAULT_TRADE_INTERVAL;
    if (market.marketType == SCALAR) {
      tradeInterval = getTradeInterval(
        createBigNumber(market.minPrice).times(QUINTILLION),
        createBigNumber(market.maxPrice).times(QUINTILLION),
        numTicks
      );
    }

    if (
      !convertDisplayAmountToOnChainAmount(value, market.tickSize)
        .mod(tradeInterval)
        .isEqualTo(0)
    ) {
      errorCount += 1;
      passedTest = false;
      const multipleOf = this.findMultipleOf();
      let firstValue = value.minus(value.mod(multipleOf));
      let secondValue = value.plus(multipleOf).minus(value.mod(multipleOf));
      if (firstValue.lt(ONE)) {
        firstValue = secondValue;
        secondValue = value
          .plus(multipleOf)
          .plus(multipleOf)
          .minus(value.mod(multipleOf));
      }
      errors[this.INPUT_TYPES.MULTIPLE_QUANTITY].push(
        `Quantity needs to be a multiple of ${multipleOf}`
      );
    }

    // Check to ensure orders don't expiry within 70s
    // Also consider getGasConfirmEstimate * 1.5 seconds
    const gasConfirmEstimate = this.state
      ? this.state.confirmationTimeEstimation * 1.5
      : 0; // In Seconds
    const earliestExp = Math.ceil((MIN_ORDER_LIFESPAN + gasConfirmEstimate) / 60);
    const expiryTime = expiration - gasConfirmEstimate - currentTimestamp;
    if (expiration && expiryTime < MIN_ORDER_LIFESPAN) {
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.EXPIRATION_DATE].push(
        `Order expires to soon! Earilest expiration is ${earliestExp} minutes`
      );
    }
    return { isOrderValid: passedTest, errors, errorCount };
  }

  testPrice(
    value,
    errors: object,
    isOrderValid: boolean,
    nextProps
  ): TestResults {
    const props = nextProps || this.props;
    const {
      maxPrice,
      minPrice,
      market,
      initialLiquidity,
      selectedNav,
      orderBook,
      selectedOutcome,
    } = props;
    const isScalar: boolean = market.marketType === SCALAR;
    const usePercent =
      isScalar && selectedOutcome.id === INVALID_OUTCOME_ID;
    const tickSize = createBigNumber(market.tickSize);
    let errorCount = 0;
    let passedTest = !!isOrderValid;

    if (!BigNumber.isBigNumber(value)) {
      return { isOrderValid: false, errors, errorCount };
    }

    if (value && (value.lte(minPrice) || value.gte(maxPrice))) {
      errorCount += 1;
      passedTest = false;
      if (usePercent) {
        errors[this.INPUT_TYPES.PRICE].push(`Enter a valid percentage`);
      } else {
        errors[this.INPUT_TYPES.PRICE].push(
          `Price must be above ${minPrice} and below ${maxPrice}`
        );
      }
    }
    if (
      value &&
      value
        .minus(minPrice)
        .mod(tickSize)
        .gt('0')
    ) {
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.PRICE].push(
        `Price must be a multiple of ${tickSize}`
      );
    }
    if (
      initialLiquidity &&
      selectedNav === BUY &&
      orderBook.asks &&
      orderBook.asks.length &&
      value.gte(orderBook.asks[0].price)
    ) {
      const message = usePercent
        ? `Percent must be less than best ask of ${calcPercentageFromPrice(orderBook.asks[0].price, minPrice, maxPrice)}`
        : `Price must be less than best ask of ${orderBook.asks[0].price}`;
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.PRICE].push(
        message
      );
    } else if (
      initialLiquidity &&
      selectedNav === SELL &&
      orderBook.bids &&
      orderBook.bids.length &&
      value.lte(orderBook.bids[0].price)
    ) {
      const message = usePercent
        ? `Percent must be more than best bid of ${calcPercentageFromPrice(orderBook.bids[0].price, minPrice, maxPrice)}`
        : `Price must be more than best bid of ${orderBook.bids[0].price}`;
      errorCount += 1;
      passedTest = false;
      errors[this.INPUT_TYPES.PRICE].push(
        message
      );
    }
    return { isOrderValid: passedTest, errors, errorCount };
  }

  testPropertyCombo(
    quantity: string,
    price: string,
    estEth: string,
    changedProperty: string | undefined,
    errors: object
  ): TestResults {
    let errorCount = 0;
    if (quantity && estEth && !price) {
      errorCount += 1;
      errors[this.INPUT_TYPES.PRICE].push(
        'Price is needed with Quantity or Total Value'
      );
    }
    if (
      changedProperty === this.INPUT_TYPES.QUANTITY &&
      createBigNumber(quantity).lte(0)
    ) {
      errorCount += 1;
      errors[this.INPUT_TYPES.QUANTITY].push('Quantity must be greater than 0');
    }
    if (
      changedProperty === this.INPUT_TYPES.EST_DAI &&
      createBigNumber(estEth).lte(0)
    ) {
      errorCount += 1;
      errors[this.INPUT_TYPES.EST_DAI].push(
        'Total Order Value must be greater than 0'
      );
    }

    return { isOrderValid: errorCount === 0, errors, errorCount };
  }

  orderValidation(
    order,
    changedProperty?: string,
    nextProps?: FromProps,
    fromExternal = false
  ): TestResults {
    let errors = {
      [this.INPUT_TYPES.MULTIPLE_QUANTITY]: [],
      [this.INPUT_TYPES.QUANTITY]: [],
      [this.INPUT_TYPES.PRICE]: [],
      [this.INPUT_TYPES.EST_DAI]: [],
      [this.INPUT_TYPES.EXPIRATION_DATE]: [],
    };
    let isOrderValid = true;
    let errorCount = 0;

    const price =
      order[this.INPUT_TYPES.PRICE] &&
      createBigNumber(order[this.INPUT_TYPES.PRICE]);

    const quantity =
      order[this.INPUT_TYPES.QUANTITY] &&
      createBigNumber(order[this.INPUT_TYPES.QUANTITY]);

    const total =
      order[this.INPUT_TYPES.EST_DAI] &&
      createBigNumber(order[this.INPUT_TYPES.EST_DAI]);

    let expiration = null;
    if (order[this.INPUT_TYPES.EXPIRATION_DATE]) {
      expiration = order[this.INPUT_TYPES.EXPIRATION_DATE];
    }

    const {
      isOrderValid: priceValid,
      errors: priceErrors,
      errorCount: priceErrorCount,
    } = this.testPrice(price, errors, isOrderValid, nextProps);

    errorCount += priceErrorCount;
    errors = { ...errors, ...priceErrors };

    let quantityValid = true;

    if (changedProperty !== this.INPUT_TYPES.EST_DAI) {
      const {
        isOrderValid: isThisOrderValid,
        errors: quantityErrors,
        errorCount: quantityErrorCount,
      } = this.testQuantityAndExpiry(
        quantity,
        errors,
        isOrderValid,
        fromExternal,
        nextProps,
        expiration
      );

      quantityValid = isThisOrderValid;
      errorCount += quantityErrorCount;
      errors = { ...errors, ...quantityErrors };
    }

    const {
      isOrderValid: totalValid,
      errors: totalErrors,
      errorCount: totalErrorCount,
    } = this.testTotal(total, errors, isOrderValid, price, quantity);

    errorCount += totalErrorCount;
    errors = { ...errors, ...totalErrors };

    const {
      isOrderValid: comboValid,
      errors: comboErrors,
      errorCount: comboErrorCount,
    } = this.testPropertyCombo(
      order[this.INPUT_TYPES.QUANTITY],
      order[this.INPUT_TYPES.PRICE],
      order[this.INPUT_TYPES.EST_DAI],
      changedProperty,
      errors
    );

    errors = { ...errors, ...comboErrors };
    errorCount += comboErrorCount;

    isOrderValid = ((quantityValid && priceValid) || (priceValid && totalValid)) && comboValid;
    return { isOrderValid, errors, errorCount };
  }

  updateAndValidate(property: string, rawValue) {
    const { updateOrderProperty } = this.props;
    const newValues = { [property]: rawValue };
    this.setState(newValues);
    updateOrderProperty(newValues);
    return this.validateForm(property, rawValue);
  }

  validateForm(property: string, rawValue) {
    const {
      updateOrderProperty,
      updateTradeTotalCost,
      updateTradeNumShares,
      selectedNav,
      clearOrderForm,
    } = this.props;

    const value =
      property != 'expirationDate'
        ? convertExponentialToDecimal(rawValue)
        : rawValue;
    const updatedState = {
      ...this.state,
      [property]: value,
    };

    const validationResults = this.orderValidation(
      updatedState,
      property,
      this.props
    );

    if (validationResults.errorCount > 0) {
      clearOrderForm(false);
    }

    let orderProcessingMethod = updateTradeTotalCost;

    let orderQuantity = updatedState[this.INPUT_TYPES.QUANTITY];
    const orderPrice = updatedState[this.INPUT_TYPES.PRICE];
    let orderDaiEstimate = updatedState[this.INPUT_TYPES.EST_DAI];
    let expiration = updatedState[this.INPUT_TYPES.EXPIRATION_DATE];

    // have price and quantity was modified clear total cost
    if (orderPrice && property === this.INPUT_TYPES.QUANTITY) {
      updatedState[this.INPUT_TYPES.EST_DAI] = '';
      updateOrderProperty({ [this.INPUT_TYPES.EST_DAI]: '' })
      orderDaiEstimate = '';
    } else if (
      // have price and total cost was modified clear quantity
      orderPrice &&
      property === this.INPUT_TYPES.EST_DAI
    ) {
      updatedState[this.INPUT_TYPES.QUANTITY] = '';
      updateOrderProperty({ [this.INPUT_TYPES.QUANTITY]: '' });
      orderQuantity = '';
    }

    // have price and quantity and total order value.
    // last modified between quantity and total cost determines which order processing method
    // last was quantity then regular updateTradeTotalCost
    // last was total order cost then updateTradeNumShares
    if (
      (property == this.INPUT_TYPES.PRICE &&
      orderQuantity &&
      orderDaiEstimate &&
      this.state.lastInputModified &&
        this.state.lastInputModified === this.INPUT_TYPES.EST_DAI) || (
          orderDaiEstimate && orderPrice && orderQuantity === ''
        )
    ) {
      orderProcessingMethod = updateTradeNumShares;
    }

    if (orderPrice && orderQuantity === '' && orderDaiEstimate === '') {
      clearOrderForm(false);
    }

    if (orderPrice === '' && (orderQuantity === '' || orderDaiEstimate === '')) {
      orderProcessingMethod = null;
    }

    const order = {
      [this.INPUT_TYPES.QUANTITY]: orderQuantity
        ? createBigNumber(orderQuantity).toFixed()
        : orderQuantity,
      [this.INPUT_TYPES.PRICE]: orderPrice
        ? createBigNumber(orderPrice).toFixed()
        : orderPrice,
      [this.INPUT_TYPES.EST_DAI]: orderDaiEstimate
        ? createBigNumber(orderDaiEstimate).toFixed()
        : orderDaiEstimate,
      [this.INPUT_TYPES.EXPIRATION_DATE]: expiration,
      selectedNav,
    };

    // update the local state of this form then make call to calculate total or shares
    this.setState(
      {
        ...updatedState,
        errors: {
          ...validationResults.errors,
        },
        errorCount: validationResults.errorCount,
        isOrderValid: validationResults.isOrderValid,
      },
      () => {
        if (
          validationResults.errorCount === 0 &&
          validationResults.isOrderValid
        ) {
          if (orderProcessingMethod) {
            orderProcessingMethod(order);
          }
        }
        if (property !== this.INPUT_TYPES.PRICE) {
          this.setState({
            lastInputModified: property,
          });
        }
      }
    );
  }

  clearOrderFormProperties(forceParent = true) {
    const { selectedNav, clearOrderForm } = this.props;
    const remainingTime = calcOrderExpirationTimeRemaining(this.props.endTime, this.props.currentTimestamp);
    const startState = {
      [this.INPUT_TYPES.QUANTITY]: '',
      [this.INPUT_TYPES.PRICE]: '',
      [this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]: false,
      [this.INPUT_TYPES.POST_ONLY_ORDER]: false,
      [this.INPUT_TYPES.EXPIRATION_DATE]: calcOrderExpirationTime(this.props.endTime, this.props.currentTimestamp),
      [this.INPUT_TYPES.SELECTED_NAV]: selectedNav,
      [this.INPUT_TYPES.EST_DAI]: '',
      fastForwardTime: remainingTime.time,
      expirationDateOption: remainingTime.unit,
      advancedOption: advancedDropdownOptions[0].value,
      errors: {
        [this.INPUT_TYPES.MULTIPLE_QUANTITY]: [],
        [this.INPUT_TYPES.QUANTITY]: [],
        [this.INPUT_TYPES.PRICE]: [],
        [this.INPUT_TYPES.EST_DAI]: [],
        [this.INPUT_TYPES.EXPIRATION_DATE]: [],
      },
    };
    this.setState(
      {
        ...startState,
        isOrderValid: false,
        percentage: '',
      },
      () => forceParent && clearOrderForm()
    );
  }

  changeOutcomeDropdown(value) {
    const { updateSelectedOutcome } = this.props;
    updateSelectedOutcome(value);
  }

  updateTotalValue(percent: Number) {
    const { availableDai } = this.props;

    const value = availableDai
      .times(createBigNumber(percent))
      .integerValue(BigNumber.ROUND_DOWN);
    this.setState({ [this.INPUT_TYPES.EST_DAI]: value.toString() }, () =>
      this.validateForm(this.INPUT_TYPES.EST_DAI, value.toString())
    );
  }

  render() {
    const {
      market,
      marketType,
      selectedOutcome,
      maxPrice,
      minPrice,
      updateState,
      orderEscrowdDai,
      updateSelectedOutcome,
      sortedOutcomes,
      initialLiquidity,
      currentTimestamp,
      tradingTutorial,
      orderPriceEntered,
      orderAmountEntered,
      selectedNav,
    } = this.props;
    const s = this.state;
    const tickSize = parseFloat(market.tickSize);
    const quantityStep = getPrecision(tickSize, .001);
    const max = maxPrice && maxPrice.toString();
    const min = minPrice && minPrice.toString();
    const errors = Array.from(
      new Set([
        ...s.errors[this.INPUT_TYPES.QUANTITY],
        ...s.errors[this.INPUT_TYPES.PRICE],
        ...s.errors[this.INPUT_TYPES.EST_DAI],
        ...s.errors[this.INPUT_TYPES.EXPIRATION_DATE],
      ])
    );

    const quantityValue = convertExponentialToDecimal(
      s[this.INPUT_TYPES.QUANTITY]
    );
    const isScalar: boolean = marketType === SCALAR;
    // TODO: figure out default outcome after we figure out ordering of the outcomes
    const defaultOutcome = selectedOutcome !== null ? selectedOutcome.id : 2;
    const advancedOptions = initialLiquidity ? liqAdvancedDropdownOptions : advancedDropdownOptions;
    const showLimitPriceInput =
      (isScalar && selectedOutcome.id !== INVALID_OUTCOME_ID) || !isScalar;

    const nearestValues = this.findNearestValues(quantityValue);
    return (
      <div className={Styles.TradingForm}>
        <div className={Styles.Outcome}>
          <SquareDropdown
            defaultValue={defaultOutcome}
            onChange={value => updateSelectedOutcome(value)}
            options={sortedOutcomes
              .filter(outcome => outcome.isTradeable)
              .map(outcome => ({
                label: outcome.description === INVALID_OUTCOME_COMPARE ? INVALID_OUTCOME_LABEL : outcome.description,
                value: outcome.id,
              }))}
            large
            showColor
          />
        </div>
        <ul>
          <li>
            <label htmlFor="quantity">Quantity</label>
            {!isScalar && (
              <label>
                (must be a multiple of {this.findMultipleOf().toString()})
              </label>
            )}
            <div
              className={classNames(Styles.TradingFormInputContainer, {
                [Styles.error]: s.errors[this.INPUT_TYPES.QUANTITY].length,
              })}
            >
              <input
                className={classNames(
                  FormStyles.Form__input,
                  Styles.TradingFormInput,
                  {
                    [`${Styles.error}`]: s.errors[this.INPUT_TYPES.QUANTITY]
                      .length,
                  }
                )}
                id="quantity"
                type="number"
                inputMode="decimal"
                step={
                  quantityValue && quantityValue !== ''
                    && isScalar ? quantityStep : 10
                }
                placeholder="0.00"
                value={quantityValue}
                tabIndex={tradingTutorial ? -1 : 1}
                onTouchStart={e =>
                  e.target.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                  })
                }
                onChange={e => {
                  this.updateAndValidate(
                    this.INPUT_TYPES.QUANTITY,
                    e.target.value
                  );
                }}
                onBlur={e => {
                  if (!initialLiquidity && !tradingTutorial)
                    orderAmountEntered(selectedNav, market.id);
                }}
              />
              <span
                className={classNames({
                  [`${Styles.error}`]: s.errors[this.INPUT_TYPES.QUANTITY]
                    .length,
                })}
              >
                Shares
              </span>
            </div>
          </li>
          {showLimitPriceInput && (
            <li>
              <label htmlFor="limit-price">Limit Price</label>
              <div
                className={classNames(Styles.TradingFormInputContainer, {
                  [Styles.error]: s.errors[this.INPUT_TYPES.PRICE].length,
                })}
              >
                <input
                  className={classNames(
                    FormStyles.Form__input,
                    Styles.TradingFormInput
                  )}
                  id="limit-price"
                  type="number"
                  inputMode="decimal"
                  step={tickSize}
                  max={max}
                  min={min}
                  placeholder="0.00"
                  tabIndex={tradingTutorial ? -1 : 2}
                  value={s[this.INPUT_TYPES.PRICE]}
                  onTouchStart={e =>
                    e.target.scrollIntoView({
                      block: 'nearest',
                      behavior: 'smooth',
                    })
                  }
                  onChange={e =>
                    this.updateAndValidate(
                      this.INPUT_TYPES.PRICE,
                      e.target.value
                    )
                  }
                  onBlur={e => {
                    if (!initialLiquidity && !tradingTutorial)
                      orderPriceEntered(selectedNav, market.id);
                  }}
                />
                <span
                  className={classNames({
                    [`${Styles.isScalar_largeText}`]:
                      isScalar &&
                      (market.scalarDenomination || []).length <= 24,
                    [`${Styles.isScalar_smallText}`]:
                      isScalar && (market.scalarDenomination || []).length > 24,
                    [`${Styles.error}`]: s.errors[this.INPUT_TYPES.PRICE]
                      .length,
                  })}
                >
                  {isScalar ? market.scalarDenomination : '$'}
                </span>
              </div>
            </li>
          )}
          {!showLimitPriceInput && (
            <li>
              <label htmlFor="percentage">Percentage</label>
              <div className={classNames(Styles.TradingFormInputContainer)}>
                <input
                  className={classNames(
                    FormStyles.Form__input,
                    Styles.TradingFormInput
                  )}
                  id="percentage"
                  type="number"
                  inputMode="decimal"
                  step={0.1}
                  max={99}
                  min={1}
                  placeholder="0"
                  tabIndex={tradingTutorial ? -1 : 2}
                  value={this.state.percentage}
                  onTouchStart={e =>
                    e.target.scrollIntoView({
                      block: 'nearest',
                      behavior: 'smooth',
                    })
                  }
                  onChange={e => {
                    const percentage = e.target.value;
                    this.setState({ percentage }, () => {
                      const value = calcPriceFromPercentage(
                        percentage,
                        min,
                        max,
                        tickSize
                      );
                      this.updateAndValidate(this.INPUT_TYPES.PRICE, value);
                    });
                  }}
                />
                <span>%</span>
              </div>
            </li>
          )}
          <li>
            <label htmlFor="total-order-value">Total Order Value</label>
            <div
              className={classNames(Styles.TradingFormInputContainer, {
                [`${Styles.error}`]: s.errors[this.INPUT_TYPES.EST_DAI].length,
              })}
            >
              <input
                className={classNames(
                  FormStyles.Form__input,
                  Styles.TradingFormInput,
                  {
                    [`${Styles.error}`]: s.errors[this.INPUT_TYPES.EST_DAI]
                      .length,
                  }
                )}
                id="total-order-value"
                type="number"
                inputMode="decimal"
                disabled={!!initialLiquidity || !showLimitPriceInput}
                step={MIN_QUANTITY.toFixed()}
                min={MIN_QUANTITY.toFixed()}
                placeholder="0.00"
                tabIndex={tradingTutorial ? -1 : 2}
                value={
                  s[this.INPUT_TYPES.EST_DAI]
                    ? createBigNumber(s[this.INPUT_TYPES.EST_DAI]).toNumber()
                    : s[this.INPUT_TYPES.EST_DAI]
                }
                onTouchStart={e =>
                  e.target.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                  })
                }
                onChange={e =>
                  this.updateAndValidate(
                    this.INPUT_TYPES.EST_DAI,
                    e.target.value
                  )
                }
              />
              <span
                className={classNames({
                  [`${Styles.error}`]: s.errors[this.INPUT_TYPES.EST_DAI]
                    .length,
                })}
              >
                $
              </span>
            </div>
          </li>
          {!initialLiquidity && (
            <li>
              <CancelTextButton
                text="25%"
                action={() => this.updateTotalValue(0.25)}
              />
              <CancelTextButton
                text="50%"
                action={() => this.updateTotalValue(0.5)}
              />
              <CancelTextButton
                text="75%"
                action={() => this.updateTotalValue(0.75)}
              />
              <CancelTextButton
                text="100%"
                action={() => this.updateTotalValue(1)}
              />
              <CancelTextButton
                text="clear"
                action={() => this.clearOrderFormProperties()}
              />
            </li>
          )}
          <li>
            <label
              className={
                initialLiquidity ? Styles.Liquidity : Styles.smallLabel
              }
            >
              {ExclamationCircle}
              <span>
                {`Max cost of $${
                  orderEscrowdDai === '' ? '-' : orderEscrowdDai
                } will be escrowed`}
              </span>
            </label>
          </li>
            <li
              className={classNames(Styles.AdvancedShown, {
                [`${Styles.error}`]: s.errors[this.INPUT_TYPES.EXPIRATION_DATE]
                  .length,
              })}
            >
              <SquareDropdown
                openTop={this.props.isMobile}
                defaultValue={s.advancedOption}
                options={advancedOptions}
                onChange={value => {
                  const remainingTime = calcOrderExpirationTimeRemaining(this.props.endTime, this.props.currentTimestamp);
                  const timestamp =
                    (value === ADVANCED_OPTIONS.EXPIRATION || value === ADVANCED_OPTIONS.POST)
                      ? calcOrderExpirationTime(this.props.endTime, this.props.currentTimestamp)
                      : null;
                  this.updateAndValidate(
                    this.INPUT_TYPES.EXPIRATION_DATE,
                    timestamp
                  );
                  updateState({
                    [this.INPUT_TYPES.DO_NOT_CREATE_ORDERS]:
                      value === ADVANCED_OPTIONS.FILL,
                    [this.INPUT_TYPES.POST_ONLY_ORDER]:
                      value === ADVANCED_OPTIONS.POST,
                  });
                  this.setState({
                    advancedOption: value,
                    fastForwardTime: remainingTime.time,
                    expirationDateOption: remainingTime.unit,
                  });
                }}
              />
              {(s.advancedOption === ADVANCED_OPTIONS.EXPIRATION || s.advancedOption === ADVANCED_OPTIONS.POST) && (
                <>
                  <div>
                    {s.expirationDateOption !==
                      EXPIRATION_DATE_OPTIONS.CUSTOM && (
                      <TextInput
                        value={s.fastForwardTime.toString()}
                        placeholder={'0'}
                        onChange={value => {
                          const addedValue =
                            value === '' || isNaN(value) ? 0 : parseInt(value);
                          this.updateAndValidate(
                            this.INPUT_TYPES.EXPIRATION_DATE,
                            moment
                              .unix(currentTimestamp)
                              .add(addedValue, s.expirationDateOption)
                              .unix()
                          );
                          this.setState({ fastForwardTime: addedValue });
                        }}
                      />
                    )}
                    <SquareDropdown
                      openTop={this.props.isMobile}
                      defaultValue={s.expirationDateOption}
                      options={[
                        {
                          label: 'Days',
                          value: EXPIRATION_DATE_OPTIONS.DAYS,
                        },
                        {
                          label: 'Hours',
                          value: EXPIRATION_DATE_OPTIONS.HOURS,
                        },
                        {
                          label: 'Minutes',
                          value: EXPIRATION_DATE_OPTIONS.MINUTES,
                        },
                        {
                          label: 'Custom',
                          value: EXPIRATION_DATE_OPTIONS.CUSTOM,
                        },
                      ]}
                      onChange={value => {
                        const fastForwardTime = this.state.fastForwardTime || 1
                        this.updateAndValidate(
                          this.INPUT_TYPES.EXPIRATION_DATE,
                          moment
                            .unix(currentTimestamp)
                            .add(fastForwardTime, value)
                            .unix()
                        );
                        this.setState({ expirationDateOption: value });
                      }}
                    />
                  </div>
                  {s.expirationDateOption !==
                    EXPIRATION_DATE_OPTIONS.CUSTOM && (
                    <span>
                      {s[this.INPUT_TYPES.EXPIRATION_DATE] &&
                        convertUnixToFormattedDate(
                          Number(s[this.INPUT_TYPES.EXPIRATION_DATE])
                        ).formattedLocalShortDateTimeWithTimezone}
                    </span>
                  )}
                  {s.expirationDateOption ===
                    EXPIRATION_DATE_OPTIONS.CUSTOM && (
                    <Media query={SMALL_MOBILE}>
                      {matches => (
                        <SimpleTimeSelector
                          openTop={matches}
                          onChange={value => {
                            this.updateAndValidate(
                              this.INPUT_TYPES.EXPIRATION_DATE,
                              value.timestamp
                            );
                          }}
                          currentTime={currentTimestamp}
                        />
                      )}
                    </Media>
                  )}
                </>
              )}
              {s.advancedOption === ADVANCED_OPTIONS.FILL && (
                <span className={Styles.tipText}>
                  Fill Only will fill up to the specified amount. Can be
                  partially filled and will cancel the remaining balance.
                </span>
              )}
              <span
                className={classNames({
                  [`${Styles.error}`]: s.errors[
                    this.INPUT_TYPES.EXPIRATION_DATE
                  ].length,
                })}
              ></span>
            </li>
        </ul>
        {s.errors[this.INPUT_TYPES.MULTIPLE_QUANTITY].length > 0 && (
          <div className={Styles.ErrorContainer}>
            {s.errors[this.INPUT_TYPES.MULTIPLE_QUANTITY].map((error, key) => (
              <div key={error} className={Styles.ErrorClickable}>
                {ExclamationCircle} <span>{error}</span>
                <span>Please select from the closest quantities</span>
                <div>
                  <SecondaryButton
                    action={() =>
                      this.updateAndValidate(
                        this.INPUT_TYPES.QUANTITY,
                        nearestValues[0].toString()
                      )
                    }
                    text={nearestValues[0].toString()}
                  />
                  <SecondaryButton
                    action={() =>
                      this.updateAndValidate(
                        this.INPUT_TYPES.QUANTITY,
                        nearestValues[1].toString()
                      )
                    }
                    text={nearestValues[1].toString()}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.length > 0 && (
          <div className={Styles.ErrorContainer}>
            {errors.map(error => (
              <div key={error} className={Styles.Error}>
                {ExclamationCircle} <span>{error}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Form;
