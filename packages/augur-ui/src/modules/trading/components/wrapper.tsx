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
} from 'modules/common/constants';
import Styles from 'modules/trading/components/wrapper.styles.less';
import { OrderButton, PrimaryButton } from 'modules/common/buttons';
import {
  formatGasCostToEther,
  formatNumber,
  formatMarketShares,
  formatDai,
} from 'utils/format-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { MarketData, OutcomeFormatted } from 'modules/types';
import { calculateTotalOrderValue } from 'modules/trades/helpers/calc-order-profit-loss-percents';
import { Moment } from 'moment';
import { calcOrderExpirationTime } from 'utils/format-date';
import debounce from 'utils/debounce';

export interface SelectedOrderProperties {
  orderPrice: string;
  orderQuantity: string;
  selectedNav: string;
  expirationDate?: Moment;
}

interface WrapperProps {
  market: MarketData;
  selectedOutcome: OutcomeFormatted;
  selectedOrderProperties: SelectedOrderProperties;
  addFundsModal: Function;
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
  gsnWalletInfoSeen: boolean;
  gasPrice: number;
  GsnEnabled: boolean;
  hasFunds: boolean;
  hasHistory: boolean;
  isLogged: boolean;
  restoredAccount: boolean;
  initialLiquidity?: boolean;
  tradingTutorial?: boolean;
  currentTimestamp: number;
  availableDai: number;
  gsnUnavailable: boolean;
  initializeGsnWallet: Function;
  endTime: number;
  disableTrading?: boolean;
  doesCrossOrderbook: Function;
  tradingApproved: boolean;
}

interface WrapperState {
  orderPrice: string;
  orderQuantity: string;
  orderDaiEstimate: string;
  orderEscrowdDai: string;
  gasCostEst: string;
  selectedNav: string;
  doNotCreateOrders: boolean;
  postOnlyOrder: boolean;
  expirationDate: Moment;
  trade: any;
  simulateQueue: any[];
  allowPostOnlyOrder: boolean;
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
      orderPrice: props.selectedOrderProperties.orderPrice || '',
      orderQuantity: props.selectedOrderProperties.orderQuantity || '',
      orderDaiEstimate: '',
      orderEscrowdDai: '',
      gasCostEst: '',
      selectedNav: props.selectedOrderProperties.selectedNav || BUY,
      doNotCreateOrders:
        props.selectedOrderProperties.doNotCreateOrders || false,
      postOnlyOrder: false,
      expirationDate: props.selectedOrderProperties.expirationDate || null,
      trade: Wrapper.getDefaultTrade(props),
      simulateQueue: [],
      allowPostOnlyOrder: true,
    };

    this.updateState = this.updateState.bind(this);
    this.clearOrderForm = this.clearOrderForm.bind(this);
    this.updateTradeTotalCost = this.updateTradeTotalCost.bind(this);
    this.updateTradeNumShares = this.updateTradeNumShares.bind(this);
    this.updateOrderProperty = this.updateOrderProperty.bind(this);
    this.updateNewOrderProperties = this.updateNewOrderProperties.bind(this);
    this.clearOrderConfirmation = this.clearOrderConfirmation.bind(this);
    this.queueStimulateTrade = this.queueStimulateTrade.bind(this);
  }

  componentDidMount() {
    const { selectedOrderProperties, disclaimerSeen, disclaimerModal, tradingTutorial, initialLiquidity, disableTrading } = this.props;

    this.updateTradeTotalCost(
      {
        ...selectedOrderProperties,
        orderQuantity: convertExponentialToDecimal(
          selectedOrderProperties.orderQuantity
        ),
      },
      true
    );

    if (!disclaimerSeen && !tradingTutorial && !initialLiquidity && !disableTrading) {
      disclaimerModal();
    }
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
        if (selectedOrderProperties.selectedNav !== selectedNav) {
          this.setState({selectedNav: selectedOrderProperties.selectedNav})
        }
        if (
          !selectedOrderProperties.orderPrice &&
          !selectedOrderProperties.orderQuantity
        ) {
          return this.clearOrderForm();
        }
        // because of invalid outcome on scalars displaying percentage need to clear price before setting it.
        if (
          this.props.market.marketType === SCALAR
        ) {
          this.setState(
            {
              orderPrice: '',
            },
            () =>
              this.updateTradeTotalCost(
                {
                  ...selectedOrderProperties,
                  orderQuantity: convertExponentialToDecimal(
                    selectedOrderProperties.orderQuantity
                  ),
                },
                true
              )
          );
        } else {

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
      this.props.selectedOrderProperties.expirationDate || calcOrderExpirationTime(this.props.endTime, this.props.currentTimestamp);
    const updatedState: any = wholeForm
      ? {
          orderPrice: '',
          orderQuantity: '',
          orderDaiEstimate: '',
          orderEscrowdDai: '',
          gasCostEst: '',
          expirationDate,
          trade,
          allowPostOnlyOrder: true,
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

  doesCrossSpread = (price, side) => {
    if (price === undefined || side === undefined) return true;
    const { doesCrossOrderbook } = this.props;
    const crosses = doesCrossOrderbook(price, side);
    if (this.state.postOnlyOrder) {
      if (crosses !== this.state.allowPostOnlyOrder) {
        this.setState({
          allowPostOnlyOrder: !crosses
        });
      }
    }
    return crosses;
  }

  debounceUpdateTradeCost = debounce(
    (order, useValues, selectedNav) => this.runUpdateTrade(order, useValues, selectedNav),
    200,
  );

  runUpdateTrade = (order, useValues, selectedNav) => {
      const {
        updateTradeCost,
        selectedOutcome,
        market,
        gasPrice,
      } = this.props;
      updateTradeCost(
        market.id,
        order.selectedOutcomeId ? order.selectedOutcomeId : selectedOutcome.id,
        {
          limitPrice: order.orderPrice,
          side: order.selectedNav,
          numShares: order.orderQuantity,
          selfTrade: order.selfTrade,
          postOnly: !this.doesCrossSpread(order.orderPrice, order.selectedNav),
        },
        (err, newOrder) => {
          if (err) {
            // just update properties for form
            const order = {
              ...useValues,
              orderDaiEstimate: '',
              orderEscrowdDai: '',
              gasCostEst: '',
              selectedNav,
            };
            this.setState(order);
            this.doesCrossSpread(order.trade.limitPrice, order.trade.side);
          }
          const newOrderDaiEstimate = formatDai(
            createBigNumber(newOrder.totalOrderValue.fullPrecision),
            {
              roundDown: false,
            }
          ).roundedValue;

          const formattedGasCost = formatGasCostToEther(
            newOrder.gasLimit,
            { decimalsRounded: 4 },
            String(gasPrice)
          ).toString();
          const order = {
            ...useValues,
            orderDaiEstimate: String(newOrderDaiEstimate),
            orderEscrowdDai: newOrder.costInDai.formatted,
            trade: newOrder,
            gasCostEst: formattedGasCost,
            selectedNav,
          };
          this.setState(order);
          this.doesCrossSpread(order.trade.limitPrice, order.trade.side);
        }
      )
    }

  async queueStimulateTrade(order, useValues, selectedNav) {
    this.debounceUpdateTradeCost(order, useValues, selectedNav);
  }

  async updateTradeTotalCost(order, fromOrderBook = false) {
    const {
      selectedOutcome,
      market,
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
        totalCost: formatDai(totalCost),
        numShares: order.orderQuantity,
        shareCost: formatNumber(0),
        potentialDaiLoss: formatDai(40),
        potentialDaiProfit: formatDai(60),
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
      this.setState({
        selectedNav,
      });
      if (order.orderPrice) {
        await this.queueStimulateTrade(order, useValues, selectedNav);
      } else {
        this.setState({
          orderQuantity: order.orderQuantity
        })
      }
      this.doesCrossSpread(order.orderPrice, selectedNav);
    }
  }

  placeMarketTrade(market, selectedOutcome, s) {
    this.props.orderSubmitted(s.selectedNav, market.id);
    let trade = s.trade;
    if (this.state.expirationDate) {
      trade = {
        ...trade,
        expirationTime: this.state.expirationDate,
      };
    }
    const isPostOnly = !this.doesCrossSpread(trade.limitPrice, trade.side);
    this.props.onSubmitPlaceTrade(
      market.id,
      selectedOutcome.id,
      trade,
      s.doNotCreateOrders,
      isPostOnly
    );
    this.clearOrderForm();
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
        postOnly: !this.doesCrossSpread(order.orderPrice, order.selectedNav),
      },
      (err, newOrder) => {
        if (err) return console.error(err); // what to do with error here

        const numShares = formatMarketShares(market.marketType, createBigNumber(newOrder.numShares), {
          roundDown: false,
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
            orderDaiEstimate: order.orderDaiEstimate,
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
      updateLiquidity,
      initialLiquidity,
      tradingTutorial,
      tutorialNext,
      GsnEnabled,
      hasFunds,
      isLogged,
      restoredAccount,
      loginModal,
      addFundsModal,
      hasHistory,
      availableDai,
      gsnUnavailable,
      initializeGsnWallet,
      gsnWalletInfoSeen,
      disableTrading,
      tradingApproved,
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
      postOnlyOrder,
      allowPostOnlyOrder,
    } = this.state;
    const insufficientFunds =
      trade &&
      (trade.costInDai && createBigNumber(trade.costInDai.value).gte(createBigNumber(availableDai)) ||
      (trade.totalCost && initialLiquidity && createBigNumber(trade.totalCost.value).gte(createBigNumber(availableDai))));

    const isOpenOrder = trade && trade.numFills === 0;

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
              this.placeMarketTrade(market, selectedOutcome, this.state);
          }
        }}
        disabled={
          !trade || !trade.limitPrice || (gsnUnavailable && isOpenOrder) || insufficientFunds || disableTrading || (!tradingApproved && initialLiquidity && tradingTutorial) || !allowPostOnlyOrder
        }
      />
    );
    switch (true) {
      case disableTrading:
        actionButton = (
          <PrimaryButton
            id="reporting-ui"
            disabled={true}
            action={() => {}}
            text="Trading Disabled in Reporting UI"
          />
        );
      break;
      case !restoredAccount && !isLogged && !tradingTutorial:
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
    const showConfirm =
      !!trade &&
      ((trade.potentialDaiLoss && trade.potentialDaiLoss.value !== 0) ||
        (trade.orderShareProfit && trade.orderShareProfit.value !== 0) ||
        (trade.sharesFilled && trade.sharesFilled.value !== 0));
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
        {showConfirm && (
            <Confirm
              initialLiquidity={initialLiquidity}
              numOutcomes={market.numOutcomes}
              marketType={marketType}
              maxPrice={maxPriceBigNumber}
              minPrice={minPriceBigNumber}
              trade={trade}
              postOnlyOrder={postOnlyOrder}
              gasPrice={gasPrice}
              gasLimit={trade.gasLimit}
              normalGasLimit={trade.normalGasLimit}
              selectedOutcomeId={selectedOutcome.id}
              outcomeName={selectedOutcome.description}
              scalarDenomination={market.scalarDenomination}
              tradingTutorial={tradingTutorial}
              GsnEnabled={GsnEnabled}
              gsnUnavailable={gsnUnavailable}
              allowPostOnlyOrder={allowPostOnlyOrder}
            />
          )}
        <div>{actionButton}</div>
        {showTip && !initialLiquidity && (
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
