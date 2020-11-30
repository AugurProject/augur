/* eslint jsx-a11y/label-has-for: 0 */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import {
  SCALAR,
  INVALID_OUTCOME_ID,
  SMALL_MOBILE,
  MIN_QUANTITY,
  GWEI_CONVERSION,
  WETH,
} from 'modules/common/constants';
import FormStyles from 'modules/common/form-styles.less';
import Styles from 'modules/trading/components/form.styles.less';
import { ExclamationCircle, WethIcon } from 'modules/common/icons';
import { SquareDropdown } from 'modules/common/selection';
import { TextInput } from 'modules/common/form';
import getPrecision from 'utils/get-number-precision';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { MarketData } from 'modules/types';
import type { MarketInfoOutcome } from "@augurproject/sdk-lite";
import { CancelTextButton, SecondaryButton } from 'modules/common/buttons';
import moment from 'moment';
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
  formatGasCost,
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
import { FORM_INPUT_TYPES } from 'modules/trading/store/constants';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { formatOrderBook } from 'modules/create-market/helpers/format-order-book';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import { selectSortedMarketOutcomes } from 'modules/markets/selectors/market';
import { augurSdk } from 'services/augursdk';
import { useTradingStore } from 'modules/trading/store/trading';

enum ADVANCED_OPTIONS {
  EXPIRATION = '1',
  FILL = '2',
  POST = '3',
}

const {
  EXPIRATION,
  FILL,
  POST,
} = ADVANCED_OPTIONS;
const advancedExpirationDateOptions = [
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
];

const advancedDropdownOptions = [
  {
    label: 'Order expiration',
    value: EXPIRATION,
  },
  {
    label: 'Fill only',
    value: FILL,
  },
  {
    label: 'Post only',
    value: POST,
  },
];

const liqAdvancedDropdownOptions = [
  {
    label: 'Order expiration',
    value: EXPIRATION,
  },
];

const {
  PRICE,
  QUANTITY,
  MULTIPLE_QUANTITY,
  POST_ONLY_ORDER,
  DO_NOT_CREATE_ORDERS,
  EXPIRATION_DATE,
  EST_DAI,
} = FORM_INPUT_TYPES;

const ErrorsContainer = ({ errors }) => (
  <div className={Styles.ErrorContainer}>
    {errors.map(error => (
      <div key={error} className={Styles.Error}>
        {ExclamationCircle} <span>{error}</span>
      </div>
    ))}
  </div>
);

const ValidationContainer = ({
  validation: { errors },
  updateAndValidate,
  market,
  quantityValue,
  paraTokenName,
  paraTokenDecimals,
}) => {
  const [low, high] = findNearestValues(quantityValue, market, paraTokenName, paraTokenDecimals);
  return (
    <div className={Styles.ErrorContainer}>
      {errors[MULTIPLE_QUANTITY].map((error, key) => (
        <div key={error} className={Styles.ErrorClickable}>
          {ExclamationCircle} <span>{error}</span>
          <span>Please select from the closest quantities</span>
          <div>
            <SecondaryButton
              action={() =>
                updateAndValidate(
                  QUANTITY,
                  low.toString()
                )
              }
              text={low.toString()}
            />
            <SecondaryButton
              action={() =>
                updateAndValidate(
                  QUANTITY,
                  high.toString()
                )
              }
              text={high.toString()}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const QuickAdjustmentButtons = ({
  updateTotalValue,
  clearOrderFormProperties,
}) => (
  <li>
    <CancelTextButton text="25%" action={() => updateTotalValue(0.25)} />
    <CancelTextButton text="50%" action={() => updateTotalValue(0.5)} />
    <CancelTextButton text="75%" action={() => updateTotalValue(0.75)} />
    <CancelTextButton text="100%" action={() => updateTotalValue(1)} />
    <CancelTextButton text="clear" action={() => clearOrderFormProperties()} />
  </li>
);

const getGasConfirmEstimate = async () => {
  const augur = augurSdk.get();
  const gasConfirmTime = await augur.getGasConfirmEstimate();
  return gasConfirmTime;
};

interface FromProps {
  market: MarketData;
  selectedOutcome: MarketInfoOutcome;
  updateSelectedOutcome: Function;
  clearOrderForm: Function;
  updateTradeTotalCost: Function;
  updateTradeNumShares: Function;
  clearOrderConfirmation: Function;
  initialLiquidity?: boolean;
  tradingTutorial?: boolean;
};

const getStartState = ({
  endTime,
  currentTimestamp
}) => {
  const  {
    time: fastForwardTime,
    unit: expirationDateOption,
  } = calcOrderExpirationTimeRemaining(endTime, currentTimestamp);
  return {
    lastInputModified: '',
    advancedOption: advancedDropdownOptions[0].value,
    fastForwardTime,
    expirationDateOption,
    percentage: '',
    confirmationTimeEstimation: 0,
  };
};

const Form = ({
  market,
  tradingTutorial,
  initialLiquidity,
  selectedOutcome,
  updateSelectedOutcome,
  clearOrderForm,
  updateTradeTotalCost,
  updateTradeNumShares,
  clearOrderConfirmation,
}: FromProps) => {
  const {
    maxPriceBigNumber: maxPrice,
    minPriceBigNumber: minPrice,
    scalarDenomination,
  } = market;
  const { orderProperties, actions: { updateOrderProperties } } = useTradingStore();
  const {
    selectedNav,
    orderPrice,
    orderQuantity,
    orderDaiEstimate,
    orderEscrowdDai,
    expirationDate,
  } = orderProperties;
  const endTime = market.endTime || market.setEndTime;
  const selectedOutcomeId =
    selectedOutcome !== undefined && selectedOutcome !== null
      ? selectedOutcome.id
      : market.defaultSelectedOutcomeId;
  const {
    gasPriceInfo,
    blockchain: { currentAugurTimestamp: currentTimestamp },
    env: { paraDeploy, paraDeploys },
    paraTokenName,
  } = useAppStatusStore();

  if (!paraDeploys || !paraDeploys[paraDeploy]) return null;
  const paraTokenDecimals = paraDeploys[paraDeploy].decimals;
  const isScalar = market.marketType === SCALAR;
  const orderBook = initialLiquidity ?
    formatOrderBook(market.orderBook[selectedOutcomeId]) :
    {};

  const [state, setState] = useState(
    getStartState({ endTime, currentTimestamp })
  );

  const {
    confirmationTimeEstimation,
    percentage,
    advancedOption,
    expirationDateOption,
    fastForwardTime,
  } = state;
  const gasPriceInWei = formatGasCost(
    createBigNumber(gasPriceInfo.userDefinedGasPrice || 0).times(
      createBigNumber(GWEI_CONVERSION)
    ),
    {}
  ).value;
  const validation = orderValidation(
    {
      expirationDate,
      orderQuantity,
      orderPrice,
      orderDaiEstimate,
    },
    null,
    {
      maxPrice,
      minPrice,
      market,
      initialLiquidity,
      selectedNav,
      orderBook,
      selectedOutcome,
      currentTimestamp,
    },
    confirmationTimeEstimation,
    false,
    paraTokenName,
    paraTokenDecimals,
  );

  useEffect(() => {
    let isMounted = true;
    async function updateGasConfirmEstimate() {
      try {
        const confirmationTimeEstimation = await getGasConfirmEstimate();
        if (isMounted) setState({ ...state, confirmationTimeEstimation });
      } catch (error) {
        if (isMounted) setState({ ...state, confirmationTimeEstimation: 0 });
      }
    }
    updateGasConfirmEstimate();
    return () => isMounted = false;
  }, [gasPriceInWei]);

  useEffect(() => {
    let isMounted = true;
    let percentage = '';
    if (
      isScalar &&
      selectedOutcome.id === INVALID_OUTCOME_ID &&
      !state.percentage &&
      orderPrice !== '' &&
      !orderPrice
    ) {
      percentage = String(
        calcPercentageFromPrice(orderPrice, String(minPrice), String(maxPrice))
      );
    }
    if (isMounted) {
      setState({
        ...state,
        percentage,
      });
    }
    if (percentage !== '' && isMounted) {
      updateAndValidate(PRICE, orderPrice);
    }
    return () => isMounted = false;
  }, [orderPrice, orderQuantity, orderDaiEstimate]);

  useEffect(() => {
    if (validation.errorCount > 0) {
      // if we are no longer valid, clear confirm
      clearOrderConfirmation();
    }
  }, [validation.errorCount]);

  function updateAndValidate(property: string, rawValue) {
    updateOrderProperties({ [property]: rawValue });
    return validateForm(property, rawValue, paraTokenName);
  }

  function updateTotalValue(percent: Number) {
    const value = availableDai
      .times(createBigNumber(percent))
      .integerValue(BigNumber.ROUND_DOWN);
    updateOrderProperties({ [EST_DAI]: value.toString() });
    validateForm(EST_DAI, value.toString(), paraTokenName);
  }

  function validateForm(property: string, rawValue, paraTokenName) {
    const value =
      property !== EXPIRATION
        ? convertExponentialToDecimal(rawValue)
        : rawValue;
    const { lastInputModified, confirmationTimeEstimation } = state;

    const updatedOrderProps = {
      ...orderProperties,
      [property]: value,
    };

    const validationResults = orderValidation(
      updatedOrderProps,
      property,
      {
        maxPrice,
        minPrice,
        market,
        initialLiquidity,
        selectedNav,
        orderBook,
        selectedOutcome,
        currentTimestamp,
      },
      confirmationTimeEstimation,
      false,
      paraTokenName,
      paraTokenDecimals,
    );

    if (validationResults.errorCount > 0) {
      clearOrderForm(false);
    }
    let orderProcessingMethod = updateTradeTotalCost;

    let orderQuantity = updatedOrderProps[QUANTITY];
    const orderPrice = updatedOrderProps[PRICE];
    let orderDaiEstimate = updatedOrderProps[EST_DAI];
    let expiration = updatedOrderProps[EXPIRATION_DATE];
    // have price and quantity was modified clear total cost
    if (orderPrice && property === QUANTITY) {
      updatedOrderProps[EST_DAI] = '';
      updateOrderProperties({ [EST_DAI]: '' });
      orderDaiEstimate = '';
    } else if (orderPrice && property === EST_DAI) {
      // have price and total cost was modified clear quantity
      updatedOrderProps[QUANTITY] = '';
      updateOrderProperties({ [QUANTITY]: '' });
      orderQuantity = '';
    }

    // have price and quantity and total order value.
    // last modified between quantity and total cost determines which order processing method
    // last was quantity then regular updateTradeTotalCost
    // last was total order cost then updateTradeNumShares
    if (
      (property === PRICE &&
        orderQuantity &&
        orderDaiEstimate &&
        lastInputModified === EST_DAI) ||
      (orderDaiEstimate && orderPrice && orderQuantity === '')
    ) {
      orderProcessingMethod = updateTradeNumShares;
    }

    if (
      orderPrice === '' &&
      (orderQuantity === '' || orderDaiEstimate === '')
    ) {
      orderProcessingMethod = null;
    }

    if (orderPrice && orderQuantity === '' && orderDaiEstimate === '') {
      clearOrderForm(false);
    }

    const order = {
      [QUANTITY]: orderQuantity
        ? createBigNumber(orderQuantity).toFixed()
        : orderQuantity,
      [PRICE]: orderPrice
        ? createBigNumber(orderPrice).toFixed()
        : orderPrice,
      [EST_DAI]: orderDaiEstimate
        ? createBigNumber(orderDaiEstimate).toFixed()
        : orderDaiEstimate,
      [EXPIRATION_DATE]: expiration,
      selectedNav,
    };
    if (property !== PRICE) {
      setState({ ...state, lastInputModified: property });
    }
    if (
      orderProcessingMethod &&
      validationResults.isOrderValid &&
      validationResults.errorCount === 0
    ) {
      orderProcessingMethod(order);
    }
  }

  function clearOrderFormProperties() {
    const {
      time: fastForwardTime,
      unit: expirationDateOption,
    } = calcOrderExpirationTimeRemaining(
      Number(endTime),
      currentTimestamp
    );
    setState({
      ...state,
      fastForwardTime,
      expirationDateOption,
      advancedOption: advancedDropdownOptions[0].value,
      percentage: '',
    });
    clearOrderForm();
  }

  const availableDai = totalTradingBalance();
  const sortedOutcomes = selectSortedMarketOutcomes(
    market.marketType,
    market.outcomesFormatted
  );

  const tickSize = parseFloat(market.tickSize);
  const quantityStep = getPrecision(tickSize, 0.001);
  const max = maxPrice.toString();
  const min = minPrice.toString();
  const errors = Array.from(
    new Set([
      ...validation.errors[QUANTITY],
      ...validation.errors[PRICE],
      ...validation.errors[EST_DAI],
      ...validation.errors[EXPIRATION_DATE],
    ])
  );
  const quantityValue = convertExponentialToDecimal(
    orderQuantity
  );

  // TODO: figure out default outcome after we figure out ordering of the outcomes
  const defaultOutcome = selectedOutcome !== null ? selectedOutcome.id : 2;
  const advancedOptions = initialLiquidity
    ? liqAdvancedDropdownOptions
    : advancedDropdownOptions;
  const showLimitPriceInput =
    (isScalar && selectedOutcome.id !== INVALID_OUTCOME_ID) || !isScalar;
  const isExpirationCustom =
    expirationDateOption === EXPIRATION_DATE_OPTIONS.CUSTOM;
  return (
    <div className={Styles.TradingForm}>
      <div className={Styles.Outcome}>
        <SquareDropdown
          defaultValue={defaultOutcome}
          onChange={value => updateSelectedOutcome(value)}
          options={sortedOutcomes
            .filter(({ isTradeable }) => isTradeable)
            .map(({ description: label, id: value}) => ({
              label,
              value,
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
              (must be a multiple of {findMultipleOf(market, paraTokenName, paraTokenDecimals).toString()})
            </label>
          )}
          <div
            className={classNames(Styles.TradingFormInputContainer, {
              [Styles.error]: validation.errors[QUANTITY].length,
            })}
          >
            <input
              className={classNames(
                FormStyles.Form__input,
                Styles.TradingFormInput,
                {
                  [Styles.error]: validation.errors[QUANTITY]
                    .length,
                }
              )}
              id="quantity"
              type="number"
              inputMode="decimal"
              step={
                !!quantityValue && isScalar
                  ? quantityStep
                  : 10
              }
              placeholder="0.00"
              value={quantityValue}
              tabIndex={tradingTutorial ? -1 : 1}
              onTouchStart={e => {
                // @ts-ignore
                e.target.scrollIntoView({
                  block: 'nearest',
                  behavior: 'smooth',
                });
              }}
              onChange={e => {
                updateAndValidate(QUANTITY, e.target.value);
              }}
              onBlur={e => {
                if (!initialLiquidity && !tradingTutorial)
                  orderAmountEntered(selectedNav, market.id);
              }}
            />
            <span
              className={classNames({
                [Styles.error]: validation.errors[QUANTITY]
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
                [Styles.error]: validation.errors[PRICE].length,
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
                value={orderPrice}
                onTouchStart={e => {
                  // @ts-ignore
                  e.target.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                  })
                }}
                onChange={e =>
                  updateAndValidate(PRICE, e.target.value)
                }
                onBlur={e => {
                  if (!initialLiquidity && !tradingTutorial)
                    orderPriceEntered(selectedNav, market.id);
                }}
              />
              <span
                className={classNames({
                  [`${Styles.isScalar_largeText}`]:
                    isScalar && (scalarDenomination || []).length <= 24,
                  [`${Styles.isScalar_smallText}`]:
                    isScalar && (scalarDenomination || []).length > 24,
                  [`${Styles.error}`]: validation.errors[PRICE]
                    .length,
                })}
              >
                {isScalar ? scalarDenomination : paraTokenName === WETH ? WethIcon : '$'}
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
                value={percentage}
                onTouchStart={e =>{
                  // @ts-ignore
                  e.target.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                  })
                }}
                onChange={e => {
                  const percentage = e.target.value;
                  setState({ ...state, percentage });
                  const value = calcPriceFromPercentage(
                    percentage,
                    min,
                    max,
                    tickSize
                  );
                  updateAndValidate(PRICE, value);
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
              [Styles.error]: validation.errors[EST_DAI]
                .length,
            })}
          >
            <input
              className={classNames(
                FormStyles.Form__input,
                Styles.TradingFormInput,
                {
                  [Styles.error]: validation.errors[EST_DAI]
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
                orderDaiEstimate
                  ? createBigNumber(orderDaiEstimate).toNumber()
                  : orderDaiEstimate
              }
              onTouchStart={e => {
                // @ts-ignore
                e.target.scrollIntoView({
                  block: 'nearest',
                  behavior: 'smooth',
                })
              }}
              onChange={e =>
                updateAndValidate(EST_DAI, e.target.value)
              }
            />
            <span
              className={classNames({
                [`${Styles.error}`]: validation.errors[EST_DAI]
                  .length,
              })}
            >
            {paraTokenName === 'WETH' ? WethIcon : '$'}
            </span>
          </div>
        </li>
        {!initialLiquidity && (
          <QuickAdjustmentButtons
            {...{updateTotalValue, clearOrderFormProperties}}
          />
        )}
        <li>
          <label
            className={initialLiquidity ? Styles.Liquidity : Styles.smallLabel}
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
            [Styles.error]: validation.errors[EXPIRATION_DATE]
              .length,
          })}
        >
          <SquareDropdown
            defaultValue={advancedOptions[0].value}
            options={advancedOptions}
            onChange={advancedOption => {
              const {
                time: fastForwardTime,
                unit: expirationDateOption,
              } = calcOrderExpirationTimeRemaining(
                Number(endTime),
                currentTimestamp
              );
              const timestamp =
                advancedOption === EXPIRATION
                  ? calcOrderExpirationTime(Number(endTime), currentTimestamp)
                  : null;
              updateAndValidate(EXPIRATION_DATE, timestamp);
              updateOrderProperties({
                [DO_NOT_CREATE_ORDERS]: advancedOption === FILL,
                [POST_ONLY_ORDER]: advancedOption === POST,
              })
              setState({
                ...state,
                advancedOption,
                fastForwardTime,
                expirationDateOption,
              });
            }}
          />
          {advancedOption === EXPIRATION && (
            <>
              <div>
                {!isExpirationCustom && (
                  <TextInput
                    value={fastForwardTime.toString()}
                    placeholder="0"
                    onChange={value => {
                      const addedValue =
                        value === '' || isNaN(value) ? 0 : parseInt(value);
                      updateAndValidate(
                        EXPIRATION_DATE,
                        // @ts-ignore
                        moment
                          .unix(currentTimestamp)
                          .add(addedValue, expirationDateOption)
                          .unix()
                      );
                      setState({ ...state, fastForwardTime: addedValue });
                    }}
                  />
                )}
                <SquareDropdown
                  defaultValue={expirationDateOption}
                  options={advancedExpirationDateOptions}
                  onChange={value => {
                    const fastForwardTime = state.fastForwardTime || 1;
                    updateAndValidate(
                      EXPIRATION_DATE,
                      moment
                        .unix(currentTimestamp)
                        .add(fastForwardTime, value)
                        .unix()
                    );
                    setState({ ...state, expirationDateOption: value });
                  }}
                />
              </div>
              {isExpirationCustom ? (
                <Media query={SMALL_MOBILE}>
                  {matches => (
                    <SimpleTimeSelector
                      openTop={matches}
                      onChange={value => {
                        updateAndValidate(
                          EXPIRATION_DATE,
                          value.timestamp
                        );
                      }}
                      currentTime={currentTimestamp}
                    />
                  )}
                </Media>
              ) :
              (
                <span>
                  {expirationDate &&
                    convertUnixToFormattedDate(
                      Number(expirationDate)
                    ).formattedLocalShortDateTimeWithTimezone}
                </span>
              )}
            </>
          )}
          {advancedOption === FILL && (
            <span className={Styles.tipText}>
              Fill Only will fill up to the specified amount. Can be partially
              filled and will cancel the remaining balance.
            </span>
          )}
          <span
            className={classNames({
              [`${Styles.error}`]: validation.errors[
                EXPIRATION_DATE
              ].length,
            })}
          ></span>
        </li>
      </ul>
      {!!validation.errors[MULTIPLE_QUANTITY].length && (
        <ValidationContainer
          {...{
            validation,
            updateAndValidate,
            market,
            quantityValue,
            paraTokenName,
            paraTokenDecimals,
          }}
        />
      )}
      {!!errors.length && <ErrorsContainer {...{errors}} />}
    </div>
  );
};

export default Form;
