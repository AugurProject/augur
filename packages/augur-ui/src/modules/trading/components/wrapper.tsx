import React, { Component } from 'react';
import classNames from 'classnames';
import { createBigNumber } from 'utils/create-big-number';

import Form from 'modules/trading/containers/form';
import Confirm from 'modules/trading/containers/confirm';
import { generateTrade } from 'modules/trades/helpers/generate-trade';
import {
  SCALAR,
  BUY,
  SELL,
  UPPER_FIXED_PRECISION_BOUND,
} from 'modules/common/constants';
import Styles from 'modules/trading/components/wrapper.styles.less';
import { OrderButton, PrimaryButton } from 'modules/common/buttons';
import {
  formatShares,
  formatGasCostToEther,
  formatNumber,
} from 'utils/format-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { MarketData, OutcomeFormatted, OutcomeOrderBook } from 'modules/types';
import { calculateTotalOrderValue } from 'modules/trades/helpers/calc-order-profit-loss-percents';
import { formatDai } from 'utils/format-number';
import { GnosisSafeState } from '@augurproject/gnosis-relay-api';

export interface SelectedOrderProperties {
  orderPrice: string;
  orderQuantity: string;
  selectedNav: string;
  expirationDate?: number;
}

interface WrapperProps {
  gnosisStatus: GnosisSafeState;
  market: MarketData;
  selectedOutcome: OutcomeFormatted;
  selectedOrderProperties: SelectedOrderProperties;
  addFundsModal: Function;
  addPendingOrder: Function;
  disclaimerModal: Function;
  handleFilledOnly: Function;
  loginModal: Function;
  onSubmitPlaceTrade: Function;
  orderSubmitted: Function;
  tutorialNext?: Function;
  updateLiquidity?: Function;
  updateSelectedOrderProperties: Function;
  updateSelectedOutcome: Function;
  updateTradeCost: Function;
  updateTradeShares: Function;
  disclaimerSeen: boolean;
  gasPrice: number;
  Gnosis_ENABLED: boolean;
  hasFunds: boolean;
  hasHistory: boolean;
  isLogged: boolean;
  initialLiquidity?: boolean;
  tradingTutorial?: boolean;
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
    const {
      id,
      settlementFee,
      marketType,
      maxPrice,
      minPrice,
      cumulativeScale,
      makerFee,
    } = props.market;
    return generateTrade(
      {
        id,
        settlementFee,
        marketType,
        maxPrice,
        minPrice,
        cumulativeScale,
        makerFee,
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
      expirationDate: props.selectedOrderProperties.expirationDate || 0,
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
    const { orderPrice, orderQuantity, selectedNav } = this.state;

    if (
      JSON.stringify(selectedOrderProperties) !==
      JSON.stringify(prevProps.selectedOrderProperties)
    ) {
      if (
        selectedOrderProperties.orderPrice !== orderPrice ||
        selectedOrderProperties.orderQuantity !== orderQuantity ||
        selectedOrderProperties.selectedNav !== selectedNav
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
    // TODO: refactor this out complete, still in use for advanced options
    this.setState(currentState => ({ ...currentState, ...stateValues }), cb);
  }

  clearOrderConfirmation() {
    const trade = Wrapper.getDefaultTrade(this.props);
    this.setState({ trade });
  }

  clearOrderForm(wholeForm = true) {
    const trade = Wrapper.getDefaultTrade(this.props);
    const expirationDate =
      this.props.selectedOrderProperties.expirationDate || 0;
    const updatedState: any = wholeForm
      ? {
          orderPrice: '',
          orderQuantity: '',
          orderDaiEstimate: '',
          orderEscrowdDai: '',
          gasCostEst: '',
          doNotCreateOrders: false,
          expirationDate,
          trade,
        }
      : { trade };
    this.setState(updatedState, () => this.updateParentOrderValues());
  }

  updateParentOrderValues() {
    const { orderPrice, orderQuantity, selectedNav } = this.state;
    this.props.updateSelectedOrderProperties({
      orderPrice,
      orderQuantity,
      selectedNav,
    });
  }

  updateNewOrderProperties(selectedOrderProperties) {
    this.updateTradeTotalCost({ ...selectedOrderProperties }, true);
  }

  updateOrderProperty(property, callback) {
    this.setState({ ...property }, () => {
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
    const selectedNav = order.selectedNav
      ? order.selectedNav
      : this.state.selectedNav;
    let useValues = {
      ...order,
      orderDaiEstimate: '',
    };
    if (!fromOrderBook) {
      useValues = {
        orderDaiEstimate: '',
      };
    }
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
        ...useValues,
        limitPrice: order.orderPrice,
        selectedOutcome: selectedOutcome.id,
        totalCost: formatNumber(totalCost),
        numShares: order.orderQuantity,
        shareCost: formatNumber(0),
        potentialDaiLoss: formatNumber(40),
        potentialDaiProfit: formatNumber(60),
        side: order.selectedNav,
        selectedNav,
      };

      this.setState({
        ...useValues,
        orderDaiEstimate: totalCost ? formattedValue.roundedValue : '',
        orderEscrowdDai: totalCost
          ? formattedValue.roundedValue.toString()
          : '',
        gasCostEst: '',
        trade: trade,
        selectedNav,
      });
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
            return this.setState({
              ...useValues,
              orderDaiEstimate: '',
              orderEscrowdDai: '',
              gasCostEst: '',
              selectedNav,
            });
          }

          const newOrderDaiEstimate = formatShares(
            createBigNumber(newOrder.totalOrderValue.fullPrecision),
            {
              decimalsRounded: UPPER_FIXED_PRECISION_BOUND,
            }
          ).roundedValue;

          const formattedGasCost = formatGasCostToEther(
            newOrder.gasLimit,
            { decimalsRounded: 4 },
            String(gasPrice)
          ).toString();
          this.setState({
            ...useValues,
            orderDaiEstimate: String(newOrderDaiEstimate),
            orderEscrowdDai: newOrder.costInDai.formatted,
            trade: newOrder,
            gasCostEst: formattedGasCost,
            selectedNav,
          });
        }
      );
    }
  }

  placeMarketTrade(market, selectedOutcome, s) {
    this.props.orderSubmitted(s.selectedNav, market.id);
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
        // onComplete CB
      }
    );
  }

  updateTradeNumShares(order) {
    const { updateTradeShares, selectedOutcome, market, gasPrice } = this.props;
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

        const numShares = formatShares(createBigNumber(newOrder.numShares), {
          decimalsRounded: UPPER_FIXED_PRECISION_BOUND,
        }).rounded;

        const formattedGasCost = formatGasCostToEther(
          newOrder.gasLimit,
          { decimalsRounded: 4 },
          String(gasPrice)
        ).toString();

        this.setState(
          {
            orderQuantity: String(numShares),
            orderEscrowdDai: newOrder.costInDai.formatted,
            trade: newOrder,
            gasCostEst: formattedGasCost,
          },
          () => this.updateParentOrderValues()
        );
      }
    );
  }

  render() {
    const {
      market,
      selectedOutcome,
      gasPrice,
      updateSelectedOutcome,
      disclaimerSeen,
      disclaimerModal,
      updateLiquidity,
      initialLiquidity,
      tradingTutorial,
      tutorialNext,
      Gnosis_ENABLED,
      hasFunds,
      isLogged,
      loginModal,
      addFundsModal,
      gnosisStatus,
      hasHistory,
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
    const {
      selectedNav,
      orderPrice,
      orderQuantity,
      orderDaiEstimate,
      orderEscrowdDai,
      gasCostEst,
      doNotCreateOrders,
      expirationDate,
      trade,
    } = this.state;
    const GnosisUnavailable =
      Gnosis_ENABLED &&
      isLogged &&
      hasFunds &&
      gnosisStatus !== GnosisSafeState.AVAILABLE;
    let actionButton: any = (
      <OrderButton
        type={selectedNav}
        initialLiquidity={initialLiquidity}
        action={e => {
          e.preventDefault();
          if (initialLiquidity) {
            updateLiquidity(selectedOutcome, this.state);
            this.clearOrderForm();
          } else if (tradingTutorial) {
            tutorialNext();
            this.clearOrderForm();
          } else {
            if (disclaimerSeen) {
              this.placeMarketTrade(market, selectedOutcome, this.state);
            } else {
              disclaimerModal({
                onApprove: () =>
                  this.placeMarketTrade(market, selectedOutcome, this.state),
              });
            }
          }
        }}
        disabled={!trade || !trade.limitPrice || GnosisUnavailable}
      />
    );
    switch (true) {
      case !isLogged && !tradingTutorial:
        actionButton = (
          <PrimaryButton
            id="login-button"
            action={() => loginModal()}
            text="Login to Place Order"
          />
        );
        break;
      case isLogged && !hasFunds && !tradingTutorial:
        actionButton = (
          <PrimaryButton
            id="add-funds"
            action={() => addFundsModal()}
            text="Add Funds to Place Order"
          />
        );
        break;
      default:
        break;
    }
    const buySelected = selectedNav === BUY;
    const orderEmpty =
      orderPrice === '' && orderQuantity === '' && orderDaiEstimate === '';
    const showTip = !hasHistory && orderEmpty;
    return (
      <section className={Styles.Wrapper}>
        <div>
          <ul
            className={classNames({
              [Styles.Buy]: buySelected,
              [Styles.Sell]: !buySelected,
              [Styles.Scalar]: market.marketType === SCALAR,
            })}
          >
            <li
              className={classNames({
                [`${Styles.active}`]: buySelected,
              })}
            >
              <button
                onClick={() =>
                  this.updateTradeTotalCost({
                    ...this.state,
                    selectedNav: BUY,
                  })
                }
              >
                Buy Shares
              </button>
            </li>
            <li
              className={classNames({
                [`${Styles.active}`]: !buySelected,
              })}
            >
              <button
                onClick={() =>
                  this.updateTradeTotalCost({
                    ...this.state,
                    selectedNav: SELL,
                  })
                }
              >
                Sell Shares
              </button>
            </li>
          </ul>
          {market && market.marketType && (
            <Form
              market={market}
              tradingTutorial={tradingTutorial}
              marketType={marketType}
              maxPrice={maxPriceBigNumber}
              minPrice={minPriceBigNumber}
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
            />
          )}
        </div>
        {(!initialLiquidity || tradingTutorial) &&
          trade &&
          ((trade.shareCost && trade.shareCost.value !== 0) ||
            (trade.totalCost && trade.totalCost.value !== 0)) && (
            <Confirm
              numOutcomes={market.numOutcomes}
              marketType={marketType}
              maxPrice={maxPriceBigNumber}
              minPrice={minPriceBigNumber}
              trade={trade}
              gasPrice={gasPrice}
              gasLimit={trade.gasLimit}
              outcomeName={selectedOutcome.description}
              scalarDenomination={market.scalarDenomination}
              tradingTutorial={tradingTutorial}
              Gnosis_ENABLED={Gnosis_ENABLED}
              GnosisUnavailable={GnosisUnavailable}
            />
          )}
        <div>{actionButton}</div>
        {showTip && (
          <div>
            <span>TIP:</span> If you think an outcome won't occur, you can sell
            shares that you don't own.
          </div>
        )}
      </section>
    );
  }
}

export default Wrapper;
