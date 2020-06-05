/* eslint jsx-a11y/label-has-for: 0 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import {
  SCALAR,
  INVALID_OUTCOME_ID,
  SMALL_MOBILE,
  MIN_QUANTITY,
} from 'modules/common/constants';
import FormStyles from 'modules/common/form-styles.less';
import Styles from 'modules/trading/components/form.styles.less';
import { ExclamationCircle } from 'modules/common/icons';
import { SquareDropdown } from 'modules/common/selection';
import { TextInput } from 'modules/common/form';
import getPrecision from 'utils/get-number-precision';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { MarketData, OutcomeFormatted } from 'modules/types';
import {
  Getters,
} from '@augurproject/sdk';
import { CancelTextButton, SecondaryButton } from 'modules/common/buttons';
import moment, { Moment } from 'moment';
import {
  EXPIRATION_DATE_OPTIONS,
  convertUnixToFormattedDate,
  calcOrderExpirationTime,
  calcOrderExpirationTimeRemaining,
} from 'utils/format-date';
import { SimpleTimeSelector } from 'modules/create-market/components/common';
import {
  calcPercentageFromPrice,
  calcPriceFromPercentage,
} from 'utils/format-number';
import Media from 'react-media';
import {
  orderPriceEntered,
  orderAmountEntered,
} from 'services/analytics/helpers';
import {
  findMultipleOf,
  findNearestValues,
  orderValidation,
} from 'modules/trading/helpers/form-helpers';
import { FORM_INPUT_TYPES as INPUT_TYPES } from 'modules/trading/store/constants';

enum ADVANCED_OPTIONS {
  GOOD_TILL = '0',
  EXPIRATION = '1',
  FILL = '2',
}

const advancedDropdownOptions = [
  {
    label: 'Order expiration',
    value: ADVANCED_OPTIONS.EXPIRATION,
  },
  {
    label: 'Good till cancelled',
    value: ADVANCED_OPTIONS.GOOD_TILL,
  },
  {
    label: 'Fill only',
    value: ADVANCED_OPTIONS.FILL,
  },
];

const liqAdvancedDropdownOptions = [
  {
    label: 'Order expiration',
    value: ADVANCED_OPTIONS.EXPIRATION,
  },
  {
    label: 'Good till cancelled',
    value: ADVANCED_OPTIONS.GOOD_TILL,
  },
];

interface FromProps {
  market: MarketData;
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
  gasPrice: number;
  getGasConfirmEstimate: Function;
  endTime: number;
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

const calculateStartState = (props) => {
  return {
    [INPUT_TYPES.QUANTITY]: props.orderQuantity,
    [INPUT_TYPES.PRICE]: props.orderPrice,
    [INPUT_TYPES.DO_NOT_CREATE_ORDERS]: props.doNotCreateOrders,
    [INPUT_TYPES.EXPIRATION_DATE]:
      props.expirationDate ||
      calcOrderExpirationTime(props.endTime, props.currentTimestamp),
    [INPUT_TYPES.SELECTED_NAV]: props.selectedNav,
    [INPUT_TYPES.EST_DAI]: props.orderDaiEstimate,
    errors: {
      [INPUT_TYPES.MULTIPLE_QUANTITY]: [],
      [INPUT_TYPES.QUANTITY]: [],
      [INPUT_TYPES.PRICE]: [],
      [INPUT_TYPES.EST_DAI]: [],
      [INPUT_TYPES.EXPIRATION_DATE]: [],
    },
  };
};

const FormPure = ({}) => {

};

class Form extends Component<FromProps, FormState> {
  constructor(props) {
    super(props);

    const startState = calculateStartState(props);

    const remainingTime = calcOrderExpirationTimeRemaining(
      props.endTime,
      props.currentTimestamp
    );
    this.state = {
      ...startState,
      isOrderValid: orderValidation(startState, undefined, props).isOrderValid,
      lastInputModified: '',
      errorCount: 0,
      advancedOption: advancedDropdownOptions[0].value,
      fastForwardTime: remainingTime.time,
      expirationDateOption: remainingTime.unit,
      percentage: '',
      confirmationTimeEstimation: 0,
    };

    this.updateTestProperty = this.updateTestProperty.bind(this);
    this.clearOrderFormProperties = this.clearOrderFormProperties.bind(this);
    this.updateAndValidate = this.updateAndValidate.bind(this);
  }

  componentDidMount() {
    this.getGasConfirmEstimate();
  }

  componentDidUpdate(prevProps) {
    this.updateTestProperty(INPUT_TYPES.QUANTITY, this.props);
    this.updateTestProperty(INPUT_TYPES.PRICE, this.props);
    this.updateTestProperty(INPUT_TYPES.EST_DAI, this.props);

    if (
      this.props[INPUT_TYPES.DO_NOT_CREATE_ORDERS] !==
      this.state[INPUT_TYPES.DO_NOT_CREATE_ORDERS]
    ) {
      this.setState({
        [INPUT_TYPES.DO_NOT_CREATE_ORDERS]: this.props[
          INPUT_TYPES.DO_NOT_CREATE_ORDERS
        ],
      });
    }
    const { maxPrice, minPrice, market, selectedOutcome } = this.props;
    if (!!prevProps[INPUT_TYPES.PRICE] && !!!this.props[INPUT_TYPES.PRICE]) {
      this.setState({ percentage: '' });
    } else if (
      market.marketType === SCALAR &&
      selectedOutcome.id === INVALID_OUTCOME_ID &&
      !prevProps[INPUT_TYPES.PRICE] &&
      !this.state.percentage &&
      this.props[INPUT_TYPES.PRICE]
    ) {
      const price = this.props[INPUT_TYPES.PRICE];
      const percentage = calcPercentageFromPrice(
        price,
        String(minPrice),
        String(maxPrice)
      );
      this.setState({ percentage: String(percentage) }, () =>
        this.updateAndValidate(INPUT_TYPES.PRICE, price)
      );
    }

    if (prevProps.gasPrice !== this.props.gasPrice) {
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
          const { isOrderValid, errors, errorCount } = orderValidation(
            newOrderInfo,
            undefined,
            nextProps,
            this.state.confirmationTimeEstimation,
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
    } catch (error) {
      this.setState({ confirmationTimeEstimation: 0 });
    }
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

    const validationResults = orderValidation(
      updatedState,
      property,
      this.props,
      this.state.confirmationTimeEstimation
    );

    if (validationResults.errorCount > 0) {
      clearOrderForm(false);
    }

    let orderProcessingMethod = updateTradeTotalCost;

    let orderQuantity = updatedState[INPUT_TYPES.QUANTITY];
    const orderPrice = updatedState[INPUT_TYPES.PRICE];
    let orderDaiEstimate = updatedState[INPUT_TYPES.EST_DAI];
    let expiration = updatedState[INPUT_TYPES.EXPIRATION_DATE];

    // have price and quantity was modified clear total cost
    if (orderPrice && property === INPUT_TYPES.QUANTITY) {
      updatedState[INPUT_TYPES.EST_DAI] = '';
      updateOrderProperty({ [INPUT_TYPES.EST_DAI]: '' });
      orderDaiEstimate = '';
    } else if (
      // have price and total cost was modified clear quantity
      orderPrice &&
      property === INPUT_TYPES.EST_DAI
    ) {
      updatedState[INPUT_TYPES.QUANTITY] = '';
      updateOrderProperty({ [INPUT_TYPES.QUANTITY]: '' });
      orderQuantity = '';
    }

    // have price and quantity and total order value.
    // last modified between quantity and total cost determines which order processing method
    // last was quantity then regular updateTradeTotalCost
    // last was total order cost then updateTradeNumShares
    if (
      (property == INPUT_TYPES.PRICE &&
        orderQuantity &&
        orderDaiEstimate &&
        this.state.lastInputModified &&
        this.state.lastInputModified === INPUT_TYPES.EST_DAI) ||
      (orderDaiEstimate && orderPrice && orderQuantity === '')
    ) {
      orderProcessingMethod = updateTradeNumShares;
    }

    if (orderPrice && orderQuantity === '' && orderDaiEstimate === '') {
      clearOrderForm(false);
    }

    if (
      orderPrice === '' &&
      (orderQuantity === '' || orderDaiEstimate === '')
    ) {
      orderProcessingMethod = null;
    }

    const order = {
      [INPUT_TYPES.QUANTITY]: orderQuantity
        ? createBigNumber(orderQuantity).toFixed()
        : orderQuantity,
      [INPUT_TYPES.PRICE]: orderPrice
        ? createBigNumber(orderPrice).toFixed()
        : orderPrice,
      [INPUT_TYPES.EST_DAI]: orderDaiEstimate
        ? createBigNumber(orderDaiEstimate).toFixed()
        : orderDaiEstimate,
      [INPUT_TYPES.EXPIRATION_DATE]: expiration,
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
        if (property !== INPUT_TYPES.PRICE) {
          this.setState({
            lastInputModified: property,
          });
        }
      }
    );
  }

  clearOrderFormProperties() {
    const {
      selectedNav,
      clearOrderForm,
      endTime,
      currentTimestamp,
    } = this.props;
    const remainingTime = calcOrderExpirationTimeRemaining(
      endTime,
      currentTimestamp
    );
    const startState = {
      [INPUT_TYPES.QUANTITY]: '',
      [INPUT_TYPES.PRICE]: '',
      [INPUT_TYPES.DO_NOT_CREATE_ORDERS]: false,
      [INPUT_TYPES.EXPIRATION_DATE]: calcOrderExpirationTime(
        endTime,
        currentTimestamp
      ),
      [INPUT_TYPES.SELECTED_NAV]: selectedNav,
      [INPUT_TYPES.EST_DAI]: '',
      fastForwardTime: remainingTime.time,
      expirationDateOption: remainingTime.unit,
      advancedOption: advancedDropdownOptions[0].value,
      errors: {
        [INPUT_TYPES.MULTIPLE_QUANTITY]: [],
        [INPUT_TYPES.QUANTITY]: [],
        [INPUT_TYPES.PRICE]: [],
        [INPUT_TYPES.EST_DAI]: [],
        [INPUT_TYPES.EXPIRATION_DATE]: [],
      },
    };
    this.setState(
      {
        ...startState,
        isOrderValid: false,
        percentage: '',
      },
      () => clearOrderForm()
    );
  }

  updateTotalValue(percent: Number) {
    const { availableDai } = this.props;

    const value = availableDai
      .times(createBigNumber(percent))
      .integerValue(BigNumber.ROUND_DOWN);
    this.setState({ [INPUT_TYPES.EST_DAI]: value.toString() }, () =>
      this.validateForm(INPUT_TYPES.EST_DAI, value.toString())
    );
  }

  render() {
    const {
      market,
      selectedOutcome,
      updateState,
      orderEscrowdDai,
      updateSelectedOutcome,
      sortedOutcomes,
      initialLiquidity,
      currentTimestamp,
      tradingTutorial,
      selectedNav,
    } = this.props;
    const s = this.state;
    // console.log('render Form:', this.state);
    const tickSize = parseFloat(market.tickSize);
    const quantityStep = getPrecision(tickSize, 0.001);
    const max = market.maxPriceBigNumber.toString();
    const min = market.minPriceBigNumber.toString();
    const errors = Array.from(
      new Set([
        ...s.errors[INPUT_TYPES.QUANTITY],
        ...s.errors[INPUT_TYPES.PRICE],
        ...s.errors[INPUT_TYPES.EST_DAI],
        ...s.errors[INPUT_TYPES.EXPIRATION_DATE],
      ])
    );

    const quantityValue = convertExponentialToDecimal(s[INPUT_TYPES.QUANTITY]);
    const isScalar: boolean = market.marketType === SCALAR;
    // TODO: figure out default outcome after we figure out ordering of the outcomes
    const defaultOutcome = selectedOutcome !== null ? selectedOutcome.id : 2;
    const advancedOptions = initialLiquidity
      ? liqAdvancedDropdownOptions
      : advancedDropdownOptions;
    const showLimitPriceInput =
      (isScalar && selectedOutcome.id !== INVALID_OUTCOME_ID) || !isScalar;

    const nearestValues = findNearestValues(quantityValue, market);
    return (
      <div className={Styles.TradingForm}>
        <div className={Styles.Outcome}>
          <SquareDropdown
            defaultValue={defaultOutcome}
            onChange={value => updateSelectedOutcome(value)}
            options={sortedOutcomes
              .filter(outcome => outcome.isTradeable)
              .map(outcome => ({
                label: outcome.description,
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
                (must be a multiple of {findMultipleOf(market).toString()})
              </label>
            )}
            <div
              className={classNames(Styles.TradingFormInputContainer, {
                [Styles.error]: s.errors[INPUT_TYPES.QUANTITY].length,
              })}
            >
              <input
                className={classNames(
                  FormStyles.Form__input,
                  Styles.TradingFormInput,
                  {
                    [`${Styles.error}`]: s.errors[INPUT_TYPES.QUANTITY].length,
                  }
                )}
                id="quantity"
                type="number"
                inputMode="decimal"
                step={
                  quantityValue && quantityValue !== '' && isScalar
                    ? quantityStep
                    : 10
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
                  this.updateAndValidate(INPUT_TYPES.QUANTITY, e.target.value);
                }}
                onBlur={e => {
                  if (!initialLiquidity && !tradingTutorial)
                    orderAmountEntered(selectedNav, market.id);
                }}
              />
              <span
                className={classNames({
                  [`${Styles.error}`]: s.errors[INPUT_TYPES.QUANTITY].length,
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
                  [Styles.error]: s.errors[INPUT_TYPES.PRICE].length,
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
                  value={s[INPUT_TYPES.PRICE]}
                  onTouchStart={e =>
                    e.target.scrollIntoView({
                      block: 'nearest',
                      behavior: 'smooth',
                    })
                  }
                  onChange={e =>
                    this.updateAndValidate(INPUT_TYPES.PRICE, e.target.value)
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
                    [`${Styles.error}`]: s.errors[INPUT_TYPES.PRICE].length,
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
                      this.updateAndValidate(INPUT_TYPES.PRICE, value);
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
                [`${Styles.error}`]: s.errors[INPUT_TYPES.EST_DAI].length,
              })}
            >
              <input
                className={classNames(
                  FormStyles.Form__input,
                  Styles.TradingFormInput,
                  {
                    [`${Styles.error}`]: s.errors[INPUT_TYPES.EST_DAI].length,
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
                  s[INPUT_TYPES.EST_DAI]
                    ? createBigNumber(s[INPUT_TYPES.EST_DAI]).toNumber()
                    : s[INPUT_TYPES.EST_DAI]
                }
                onTouchStart={e =>
                  e.target.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                  })
                }
                onChange={e =>
                  this.updateAndValidate(INPUT_TYPES.EST_DAI, e.target.value)
                }
              />
              <span
                className={classNames({
                  [`${Styles.error}`]: s.errors[INPUT_TYPES.EST_DAI].length,
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
              [`${Styles.error}`]: s.errors[INPUT_TYPES.EXPIRATION_DATE].length,
            })}
          >
            <SquareDropdown
              defaultValue={advancedOptions[0].value}
              options={advancedOptions}
              onChange={value => {
                const remainingTime = calcOrderExpirationTimeRemaining(
                  this.props.endTime,
                  this.props.currentTimestamp
                );
                const timestamp =
                  value === ADVANCED_OPTIONS.EXPIRATION
                    ? calcOrderExpirationTime(
                        this.props.endTime,
                        this.props.currentTimestamp
                      )
                    : null;
                this.updateAndValidate(INPUT_TYPES.EXPIRATION_DATE, timestamp);
                updateState({
                  [INPUT_TYPES.DO_NOT_CREATE_ORDERS]:
                    value === ADVANCED_OPTIONS.FILL,
                });
                this.setState({
                  advancedOption: value,
                  fastForwardTime: remainingTime.time,
                  expirationDateOption: remainingTime.unit,
                });
              }}
            />
            {s.advancedOption === ADVANCED_OPTIONS.EXPIRATION && (
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
                          INPUT_TYPES.EXPIRATION_DATE,
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
                      const fastForwardTime = this.state.fastForwardTime || 1;
                      this.updateAndValidate(
                        INPUT_TYPES.EXPIRATION_DATE,
                        moment
                          .unix(currentTimestamp)
                          .add(fastForwardTime, value)
                          .unix()
                      );
                      this.setState({ expirationDateOption: value });
                    }}
                  />
                </div>
                {s.expirationDateOption !== EXPIRATION_DATE_OPTIONS.CUSTOM && (
                  <span>
                    {s[INPUT_TYPES.EXPIRATION_DATE] &&
                      convertUnixToFormattedDate(
                        Number(s[INPUT_TYPES.EXPIRATION_DATE])
                      ).formattedLocalShortDateTimeWithTimezone}
                  </span>
                )}
                {s.expirationDateOption === EXPIRATION_DATE_OPTIONS.CUSTOM && (
                  <Media query={SMALL_MOBILE}>
                    {matches => (
                      <SimpleTimeSelector
                        openTop={matches}
                        onChange={value => {
                          this.updateAndValidate(
                            INPUT_TYPES.EXPIRATION_DATE,
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
                Fill Only will fill up to the specified amount. Can be partially
                filled and will cancel the remaining balance.
              </span>
            )}
            <span
              className={classNames({
                [`${Styles.error}`]: s.errors[INPUT_TYPES.EXPIRATION_DATE]
                  .length,
              })}
            ></span>
          </li>
        </ul>
        {s.errors[INPUT_TYPES.MULTIPLE_QUANTITY].length > 0 && (
          <div className={Styles.ErrorContainer}>
            {s.errors[INPUT_TYPES.MULTIPLE_QUANTITY].map((error, key) => (
              <div key={error} className={Styles.ErrorClickable}>
                {ExclamationCircle} <span>{error}</span>
                <span>Please select from the closest quantities</span>
                <div>
                  <SecondaryButton
                    action={() =>
                      this.updateAndValidate(
                        INPUT_TYPES.QUANTITY,
                        nearestValues[0].toString()
                      )
                    }
                    text={nearestValues[0].toString()}
                  />
                  <SecondaryButton
                    action={() =>
                      this.updateAndValidate(
                        INPUT_TYPES.QUANTITY,
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
