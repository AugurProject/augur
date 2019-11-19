import React, { Component } from 'react';
import classNames from 'classnames';
import { BigNumber, createBigNumber } from 'utils/create-big-number';

import Form from 'modules/trading/components/form/form';
import Confirm from 'modules/trading/components/confirm/confirm';
import { generateTrade } from 'modules/trades/helpers/generate-trade';
import {
  SCALAR,
  BUY,
  SELL,
  UPPER_FIXED_PRECISION_BOUND,
} from 'modules/common/constants';
import Styles from 'modules/trading/components/wrapper/wrapper.styles.less';
import { OrderButton } from 'modules/common/buttons';
import {
  formatShares,
  formatGasCostToEther,
  formatNumber,
} from 'utils/format-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { MarketData, OutcomeFormatted, OutcomeOrderBook } from 'modules/types';
import { calculateTotalOrderValue } from 'modules/trades/helpers/calc-order-profit-loss-percents';
import { formatDai } from 'utils/format-number';

// TODO: refactor the need to use this function.
function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

interface SelectedOrderProperties {
  orderPrice: string,
  orderQuantity: string,
  selectedNav: string
}

interface WrapperProps {
  orderBook: OutcomeOrderBook;
  allowanceBigNumber: BigNumber;
  market: MarketData;
  disclaimerSeen: boolean;
  disclaimerModal: Function;
  selectedOrderProperties: SelectedOrderProperties;
  availableEth: BigNumber;
  availableDai: BigNumber;
  selectedOutcome: OutcomeFormatted;
  sortedOutcomes: OutcomeFormatted[];
  updateSelectedOrderProperties: Function;
  handleFilledOnly: Function;
  gasPrice: number;
  updateSelectedOutcome: Function;
  updateTradeCost: Function;
  updateTradeShares: Function;
  onSubmitPlaceTrade: Function;
  updateLiquidity?: Function;
  initialLiquidity?: boolean;
  currentTimestamp: number;
  tradingTutorial?: boolean;
  addPendingOrder: Function;
  tutorialNext?: Function;
  Gnosis_ENABLED: boolean;
  ethToDaiRate: BigNumber;
}


interface WrapperState {
  orderPrice: string;
  orderQuantity: string;
  orderDaiEstimate: string;
  orderEscrowdDai: string;
  gasCostEst: string;
  selectedNav: string;
  doNotCreateOrders: boolean;
  expirationDate: number;
  trade: any;
}

class Wrapper extends Component<WrapperProps, WrapperState> {
  static defaultProps = {
    selectedOutcome: null,
  };

  static getDefaultTrade(props) {
    if (!(props.market || {}).marketType || !(props.selectedOutcome || {}).id) {
      return null;
    }
    return generateTrade(
      {
        id: props.market.id,
        settlementFee: props.market.settlementFee,
        marketType: props.market.marketType,
        maxPrice: props.market.maxPrice,
        minPrice: props.market.minPrice,
        cumulativeScale: props.market.cumulativeScale,
        makerFee: props.market.makerFee,
      },
      {}
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      orderPrice: props.selectedOrderProperties.price || '',
      orderQuantity: props.selectedOrderProperties.quantity || '',
      orderDaiEstimate: '',
      orderEscrowdDai: '',
      gasCostEst: '',
      selectedNav: props.selectedOrderProperties.selectedNav || BUY,
      doNotCreateOrders:
        props.selectedOrderProperties.doNotCreateOrders || false,
      expirationDate: props.selectedOrderProperties.expirationDate || '',
      trade: Wrapper.getDefaultTrade(props),
    };

    this.updateState = this.updateState.bind(this);
    this.clearOrderForm = this.clearOrderForm.bind(this);
    this.updateTradeTotalCost = this.updateTradeTotalCost.bind(this);
    this.updateTradeNumShares = this.updateTradeNumShares.bind(this);
    this.updateOrderProperty = this.updateOrderProperty.bind(this);
    this.updateNewOrderProperties = this.updateNewOrderProperties.bind(this);
    this.clearOrderConfirmation = this.clearOrderConfirmation.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { selectedOrderProperties } = this.props;

    if (
      JSON.stringify(selectedOrderProperties) !==
      JSON.stringify(prevProps.selectedOrderProperties)
    ) {
      if (
        selectedOrderProperties.orderPrice !==
          this.state.orderPrice ||
        selectedOrderProperties.orderQuantity !==
          this.state.orderQuantity ||
        selectedOrderProperties.selectedNav !== this.state.selectedNav
      ) {
        if (
          !selectedOrderProperties.orderPrice &&
          !selectedOrderProperties.orderQuantity
        ) {
          return this.clearOrderForm();
        }

        this.updateTradeTotalCost(
          {
            ...selectedOrderProperties,
            orderQuantity: convertExponentialToDecimal(
              selectedOrderProperties.orderQuantity
            ),
          },
          true
        );
      }
    }
  }

  updateState(stateValues, cb: () => void) {
    this.setState(currentState => ({ ...currentState, ...stateValues }), cb);
  }

  clearOrderConfirmation() {
    const trade = Wrapper.getDefaultTrade(this.props);
    this.setState({ trade });
  }

  clearOrderForm(wholeForm = true) {
    const trade = Wrapper.getDefaultTrade(this.props);

    if (wholeForm) {
      this.updateState(
        {
          orderPrice: '',
          orderQuantity: '',
          orderDaiEstimate: '',
          orderEscrowdDai: '',
          gasCostEst: '',
          doNotCreateOrders: false,
          expirationDate: '',
          selectedNav: this.state.selectedNav,
          trade,
        },
        () => {
          this.updateParentOrderValues();
        }
      );
    } else {
      this.updateState(
        {
          trade,
        },
        () => {
          this.updateParentOrderValues();
        }
      );
    }
  }

  updateParentOrderValues() {
    this.props.updateSelectedOrderProperties({
      ...pick(this.state, Object.keys(this.props.selectedOrderProperties)),
    });
  }

  updateNewOrderProperties(selectedOrderProperties) {
    this.updateTradeTotalCost({ ...selectedOrderProperties }, true);
  }

  updateOrderProperty(property, callback) {
    const values = {
      ...property,
    };
    this.updateState(values, () => {
      this.updateParentOrderValues();
      if (callback) callback();
    });
  }

  updateTradeTotalCost(order, fromOrderBook = false) {
    const {
      updateTradeCost,
      selectedOutcome,
      market,
      gasPrice,
      initialLiquidity,
      tradingTutorial,
    } = this.props;
    let useValues = {
      ...order,
      orderDaiEstimate: '',
    };
    if (!fromOrderBook) {
      useValues = {
        ...this.state,
        orderDaiEstimate: '',
      };
    }
    this.updateState(
      {
        ...this.state,
        ...useValues,
      },
      () => {
        if (initialLiquidity || tradingTutorial) {
          const totalCost = calculateTotalOrderValue(
            order.orderQuantity,
            order.orderPrice,
            order.selectedNav,
            createBigNumber(market.minPrice),
            createBigNumber(market.maxPrice),
            market.marketType
          );
          const formattedValue = formatDai(totalCost);
          let trade = {
            ...order,
            limitPrice: order.orderPrice,
            selectedOutcome: selectedOutcome.id,
            totalCost: formatNumber(totalCost),
            numShares: order.orderQuantity,
            shareCost: formatNumber(0),
            potentialDaiLoss: formatNumber(40),
            potentialDaiProfit: formatNumber(60),
            side: order.selectedNav,
          };

          this.updateState(
            {
              ...this.state,
              ...order,
              orderDaiEstimate: totalCost ? formattedValue.roundedValue : '',
              orderEscrowdDai: totalCost ? formattedValue.roundedValue.toString() : '',
              gasCostEst: '',
              trade: trade,
            },
            () => {}
          );
        } else {
          updateTradeCost(
            market.id,
            selectedOutcome.id,
            {
              limitPrice: order.orderPrice,
              side: order.selectedNav,
              numShares: order.orderQuantity,
              selfTrade: order.selfTrade,
            },
            (err, newOrder) => {
              if (err) {
                // just update properties for form
                console.log(order);
                return this.updateState(
                  {
                    ...this.state,
                    ...order,
                    orderDaiEstimate: '',
                    orderEscrowdDai: '',
                    gasCostEst: '',
                  },
                  () => {}
                );
              }

              const neworderDaiEstimate = formatShares(
                createBigNumber(newOrder.totalOrderValue.fullPrecision),
                {
                  decimalsRounded: UPPER_FIXED_PRECISION_BOUND,
                }
              ).roundedValue;

              const formattedGasCost = formatGasCostToEther(
                newOrder.gasLimit,
                { decimalsRounded: 4 },
                String(gasPrice)
              );
              this.updateState(
                {
                  ...this.state,
                  ...order,
                  orderDaiEstimate: neworderDaiEstimate,
                  orderEscrowdDai: newOrder.costInDai.formatted,
                  trade: newOrder,
                  gasCostEst: formattedGasCost,
                },
                () => {}
              );
            }
          );
        }
      }
    );
  }

  placeMarketTrade(market, selectedOutcome, s) {
    this.props.onSubmitPlaceTrade(
      market.id,
      selectedOutcome.id,
      s.trade,
      s.doNotCreateOrders,
      (err, result) => {
        // onSent/onFailed CB
        if (!err) {
          this.clearOrderForm();
        }
      },
      res => {
        if (s.doNotCreateOrders && res.res !== res.sharesToFill) {
          //this.props.handleFilledOnly(res.tradeInProgress);
          // onComplete CB
        }
      }
    );
  }

  updateTradeNumShares(order) {
    const { updateTradeShares, selectedOutcome, market, gasPrice } = this.props;
    this.updateState(
      {
        ...order,
        orderQuantity: '',
        orderEscrowdDai: '',
        gasCostEst: '',
      },
      () =>
        updateTradeShares(
          market.id,
          selectedOutcome.id,
          {
            limitPrice: order.orderPrice,
            side: order.selectedNav,
            maxCost: order.orderDaiEstimate,
          },
          (err, newOrder) => {
            if (err) return console.log(err); // what to do with error here

            const numShares = formatShares(
              createBigNumber(newOrder.numShares),
              {
                decimalsRounded: UPPER_FIXED_PRECISION_BOUND,
              }
            ).rounded;

            const formattedGasCost = formatGasCostToEther(
              newOrder.gasLimit,
              { decimalsRounded: 4 },
              String(gasPrice)
            );

            this.updateState(
              {
                ...this.state,
                ...order,
                orderQuantity: numShares,
                orderEscrowdDai: newOrder.costInDai.formatted,
                trade: newOrder,
                gasCostEst: formattedGasCost,
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
      allowanceBigNumber,
      availableEth,
      availableDai,
      market,
      selectedOutcome,
      gasPrice,
      updateSelectedOutcome,
      disclaimerSeen,
      disclaimerModal,
      sortedOutcomes,
      updateLiquidity,
      initialLiquidity,
      orderBook,
      currentTimestamp,
      tradingTutorial,
      tutorialNext,
      Gnosis_ENABLED,
      ethToDaiRate,
    } = this.props;
    let {
      marketType,
      minPriceBigNumber,
      maxPriceBigNumber,
      minPrice,
      maxPrice,
    } = market;
    if (!minPriceBigNumber) {
      minPriceBigNumber = createBigNumber(minPrice);
    }
    if (!maxPriceBigNumber) {
      maxPriceBigNumber = createBigNumber(maxPrice);
    }
    const s = this.state;
    const {
      selectedNav,
      orderPrice,
      orderQuantity,
      orderDaiEstimate,
      orderEscrowdDai,
      gasCostEst,
      doNotCreateOrders,
      expirationDate,
    } = s;

    return (
      <section className={Styles.Wrapper}>
        <div>
          <ul
            className={classNames({
              [Styles.Buy]: selectedNav === BUY,
              [Styles.Sell]: selectedNav === SELL,
              [Styles.Scalar]: market.marketType === SCALAR,
            })}
          >
            <li
              className={classNames({
                [`${Styles.active}`]: selectedNav === BUY,
              })}
            >
              <button
                onClick={() =>
                  this.updateTradeTotalCost({
                    ...s,
                    selectedNav: BUY,
                  })
                }
              >
                <div>Buy Shares</div>
                <span
                  className={classNames({
                    [`${Styles.notActive}`]: selectedNav === SELL,
                  })}
                />
              </button>
            </li>
            <li
              className={classNames({
                [`${Styles.active}`]: selectedNav === SELL,
              })}
            >
              <button
                onClick={() =>
                  this.updateTradeTotalCost({
                    ...s,
                    selectedNav: SELL,
                  })
                }
              >
                <div>Sell Shares</div>
                <span
                  className={classNames({
                    [`${Styles.notActive}`]: selectedNav === BUY,
                  })}
                />
              </button>
            </li>
          </ul>
          {market && market.marketType && (
            <Form
              market={market}
              tradingTutorial={tradingTutorial}
              currentTimestamp={currentTimestamp}
              orderBook={orderBook}
              marketType={marketType}
              maxPrice={maxPriceBigNumber}
              minPrice={minPriceBigNumber}
              sortedOutcomes={sortedOutcomes}
              selectedNav={selectedNav}
              orderPrice={orderPrice}
              orderQuantity={orderQuantity}
              orderDaiEstimate={orderDaiEstimate}
              orderEscrowdDai={orderEscrowdDai}
              gasCostEst={gasCostEst}
              doNotCreateOrders={doNotCreateOrders}
              expirationDate={expirationDate}
              selectedOutcome={selectedOutcome}
              updateState={this.updateState}
              updateOrderProperty={this.updateOrderProperty}
              clearOrderForm={this.clearOrderForm}
              updateSelectedOutcome={updateSelectedOutcome}
              updateTradeTotalCost={this.updateTradeTotalCost}
              updateTradeNumShares={this.updateTradeNumShares}
              clearOrderConfirmation={this.clearOrderConfirmation}
              initialLiquidity={initialLiquidity}
              availableDai={availableDai}
              Ox_ENABLED={true}
            />
          )}
        </div>
        {(!initialLiquidity || tradingTutorial) &&
          s.trade &&
          ((s.trade.shareCost && s.trade.shareCost.value !== 0) ||
            (s.trade.totalCost && s.trade.totalCost.value !== 0)) && (
            <Confirm
              allowanceBigNumber={allowanceBigNumber}
              numOutcomes={market.numOutcomes}
              marketType={marketType}
              maxPrice={maxPriceBigNumber}
              minPrice={minPriceBigNumber}
              trade={s.trade}
              gasPrice={gasPrice}
              gasLimit={s.trade.gasLimit}
              availableEth={availableEth}
              availableDai={availableDai}
              outcomeName={selectedOutcome.description}
              scalarDenomination={market.scalarDenomination}
              tradingTutorial={tradingTutorial}
              Gnosis_ENABLED={Gnosis_ENABLED}
              ethToDaiRate={ethToDaiRate}
            />
          )}
        <div
          className={classNames({
            [Styles.Full]:
              s.trade &&
              ((s.trade.shareCost && s.trade.shareCost.value !== 0) ||
                (s.trade.totalCost && s.trade.totalCost.value !== 0)),
          })}
        >
          <OrderButton
            type={selectedNav}
            initialLiquidity={initialLiquidity}
            action={e => {
              e.preventDefault();
              if (initialLiquidity) {
                updateLiquidity(selectedOutcome, s);
                this.clearOrderForm();
              } else if (tradingTutorial) {
                tutorialNext();
                this.clearOrderForm();
              } else {
                if (disclaimerSeen) {
                  this.placeMarketTrade(market, selectedOutcome, s);
                }
                // Show Disclaimer
                else {
                  disclaimerModal({
                    onApprove: () =>
                      this.placeMarketTrade(market, selectedOutcome, s),
                  });
                }
              }
            }}
            disabled={!s.trade || !s.trade.limitPrice}
          />
        </div>
      </section>
    );
  }
}

export default Wrapper;
