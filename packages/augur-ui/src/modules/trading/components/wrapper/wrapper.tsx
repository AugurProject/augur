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
import { formatShares, formatGasCostToEther } from 'utils/format-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { MarketData, OutcomeFormatted, FormattedNumber } from 'modules/types';
import { calculateTotalOrderValue } from "modules/trades/helpers/calc-order-profit-loss-percents";
import { formatDai } from "utils/format-number";

// TODO: refactor the need to use this function.
function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

interface WrapperProps {
  allowanceAmount: FormattedNumber;
  market: MarketData;
  marketReviewTradeSeen: boolean;
  marketReviewTradeModal: Function;
  selectedOrderProperties: object;
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
  initialLiquidity?: Boolean;
}

interface WrapperState {
  orderPrice: string;
  orderQuantity: string;
  orderDaiEstimate: string;
  orderEscrowdEth: string;
  gasCostEst: string;
  selectedNav: string;
  doNotCreateOrders: boolean;
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
      orderEscrowdEth: '',
      gasCostEst: '',
      selectedNav: props.selectedOrderProperties.selectedNav || BUY,
      doNotCreateOrders:
        props.selectedOrderProperties.doNotCreateOrders || false,
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

  componentWillUpdate(nextProps) {
    const { selectedOrderProperties } = this.props;

    if (
      JSON.stringify(selectedOrderProperties) !==
      JSON.stringify(nextProps.selectedOrderProperties)
    ) {
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
          {
            ...nextProps.selectedOrderProperties,
            orderQuantity: convertExponentialToDecimal(
              nextProps.selectedOrderProperties.orderQuantity
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
          orderEscrowdEth: '',
          gasCostEst: '',
          doNotCreateOrders: false,
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
    const { updateTradeCost, selectedOutcome, market, gasPrice, initialLiquidity } = this.props;
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
        if (initialLiquidity) {
          let trade = order;
          const totalCost = calculateTotalOrderValue(order.orderQuantity, order.orderPrice, order.selectedNav, createBigNumber(market.minPrice), createBigNumber(market.maxPrice), market.marketType);
          const formattedValue = formatDai(totalCost);
          trade.limitPrice = order.orderPrice;
          trade.selectedOutcome =
          this.updateState(
            {
              ...this.state,
              ...order,
              orderDaiEstimate: totalCost ? formattedValue.formatted : '',
              orderEscrowdEth: '',
              gasCostEst: '',
              trade: trade,
            }, () => {}
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
                return this.updateState(
                  {
                    ...this.state,
                    ...order,
                    orderDaiEstimate: '',
                    orderEscrowdEth: '',
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
                  orderDaiEstimate: neworderDaiEstimate,
                  orderEscrowdEth: newOrder.potentialEthLoss.formatted,
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
          this.props.handleFilledOnly(res.tradeInProgress);
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
        orderEscrowdEth: '',
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
                orderEscrowdEth: newOrder.potentialEthLoss.formatted,
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
      allowanceAmount,
      availableEth,
      availableDai,
      market,
      selectedOutcome,
      gasPrice,
      updateSelectedOutcome,
      marketReviewTradeSeen,
      marketReviewTradeModal,
      sortedOutcomes,
      updateLiquidity,
      initialLiquidity
    } = this.props;
    let { marketType, minPriceBigNumber, maxPriceBigNumber, minPrice, maxPrice } = market;
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
      orderEscrowdEth,
      gasCostEst,
      doNotCreateOrders,
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
              marketType={marketType}
              maxPrice={maxPriceBigNumber}
              minPrice={minPriceBigNumber}
              sortedOutcomes={sortedOutcomes}
              selectedNav={selectedNav}
              orderPrice={orderPrice}
              orderQuantity={orderQuantity}
              orderDaiEstimate={orderDaiEstimate}
              orderEscrowdEth={orderEscrowdEth}
              gasCostEst={gasCostEst}
              doNotCreateOrders={doNotCreateOrders}
              selectedOutcome={selectedOutcome}
              updateState={this.updateState}
              updateOrderProperty={this.updateOrderProperty}
              clearOrderForm={this.clearOrderForm}
              updateSelectedOutcome={updateSelectedOutcome}
              updateTradeTotalCost={this.updateTradeTotalCost}
              updateTradeNumShares={this.updateTradeNumShares}
              clearOrderConfirmation={this.clearOrderConfirmation}
              initialLiquidity={initialLiquidity}
            />
          )}
        </div>
        {!initialLiquidity && s.trade &&
          (s.trade.shareCost.value !== 0 ||
            s.trade.totalCost.value !== 0) && (
            <Confirm
              allowanceAmount={allowanceAmount}
              numOutcomes={market.numOutcomes}
              marketType={marketType}
              maxPrice={maxPriceBigNumber}
              minPrice={minPriceBigNumber}
              trade={s.trade}
              gasPrice={gasPrice}
              gasLimit={s.trade.gasLimit}
              availableEth={availableEth}
              availableDai={availableDai}
              selectedOutcome={selectedOutcome}
              scalarDenomination={market.scalarDenomination}
            />
          )}
        <div
          className={classNames({
            [Styles.Full]:
              s.trade &&
              ((s.trade.shareCost && s.trade.shareCost.value !== 0) || (s.trade.totalCost && s.trade.totalCost.value !== 0)),
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
              } else {
                if (!marketReviewTradeSeen) {
                  marketReviewTradeModal({
                    marketId: market.id,
                    cb: () => this.placeMarketTrade(market, selectedOutcome, s),
                  });
                } else {
                  this.placeMarketTrade(market, selectedOutcome, s);
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
