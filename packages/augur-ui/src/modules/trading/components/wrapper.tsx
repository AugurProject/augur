import React, { Component, useState, useEffect } from 'react';
import classNames from 'classnames';
import { createBigNumber } from 'utils/create-big-number';

import Form from 'modules/trading/containers/form';
import Confirm from 'modules/trading/components/confirm';
import { generateTrade } from 'modules/trades/helpers/generate-trade';
import {
  SCALAR,
  BUY,
  SELL,
  DISCLAIMER_SEEN,
  GSN_WALLET_SEEN,
  MODAL_LOGIN,
  MODAL_ADD_FUNDS,
  MODAL_INITIALIZE_ACCOUNT,
  MODAL_DISCLAIMER,
} from 'modules/common/constants';
import Styles from 'modules/trading/components/wrapper.styles.less';
import { OrderButton, PrimaryButton } from 'modules/common/buttons';
import {
  formatGasCostToEther,
  formatNumber,
  formatMarketShares,
} from 'utils/format-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { MarketData, OutcomeFormatted } from 'modules/types';
import { calculateTotalOrderValue } from 'modules/trades/helpers/calc-order-profit-loss-percents';
import { formatDai } from 'utils/format-number';
import { Moment } from 'moment';
import { calcOrderExpirationTime } from 'utils/format-date';
import { orderSubmitted } from 'services/analytics/helpers';
import { placeMarketTrade } from 'modules/trades/actions/place-market-trade';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import getValueFromlocalStorage from 'utils/get-local-storage-value';
import { getGasPrice } from 'modules/contracts/actions/contractCalls';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import {
  updateTradeCost,
  updateTradeShares,
} from 'modules/trades/actions/update-trade-cost-shares';
import makePath from 'modules/routes/helpers/make-path';
import { MARKET } from 'modules/routes/constants/views';
import makeQuery from 'modules/routes/helpers/make-query';
import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names';

export interface SelectedOrderProperties {
  orderPrice: string;
  orderQuantity: string;
  selectedNav: string;
  expirationDate?: Moment;
}

const getMarketPath = id => {
  return {
    pathname: makePath(MARKET),
    search: makeQuery({
      [MARKET_ID_PARAM_NAME]: id,
    }),
  };
};

const OrderTicketHeader = ({
  market,
  updateSelectedOrderProperties,
  selectedOrderProperties,
}) => {
  const buySelected = selectedOrderProperties.selectedNav === BUY;
  return (
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
            updateSelectedOrderProperties({
              ...selectedOrderProperties,
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
            updateSelectedOrderProperties({
              ...selectedOrderProperties,
              selectedNav: SELL,
            })
          }
        >
          Sell Shares
        </button>
      </li>
    </ul>
  );
};

const Wrapper = ({
  market,
  selectedOutcome,
  updateSelectedOutcome,
  selectedOrderProperties,
  updateSelectedOrderProperties,
  initialLiquidity,
  updateLiquidity,
  tradingTutorial,
  tutorialNext,
}) => {
  const {
    newMarket,
    accountPositions,
    userOpenOrders,
    loginAccount: {
      balances: { dai, eth },
    },
    gsnEnabled,
    isLogged,
    restoredAccount,
    blockchain: { currentAugurTimestamp: currentTimestamp },
    actions: { setModal },
  } = useAppStatusStore();
  const [state, setState] = useState({
    orderDaiEstimate: '',
    orderEscrowdDai: '',
    gasCostEst: '',
    doNotCreateOrders: selectedOrderProperties.doNotCreateOrders || false,
    expirationDate: selectedOrderProperties.expirationDate || null,
    trade: getDefaultTrade({ market, selectedOutcome }),
    simulateQueue: [],
  });
  const marketId = market.id;
  const endTime = initialLiquidity ? newMarket.setEndTime : market.endTime;
  let availableDai = totalTradingBalance();
  if (initialLiquidity) {
    availableDai = availableDai.minus(newMarket.initialLiquidityDai);
  }
  const gasPrice = getGasPrice();
  const gsnUnavailable = isGSNUnavailable();
  const disclaimerSeen = !!getValueFromlocalStorage(DISCLAIMER_SEEN);
  const gsnWalletInfoSeen = !!getValueFromlocalStorage(GSN_WALLET_SEEN);

  const hasHistory = !!accountPositions[marketId] || !!userOpenOrders[marketId];

  function clearOrderForm(wholeForm = true) {
    const tradeUpdate = getDefaultTrade({ market, selectedOutcome });
    const expirationDate =
      selectedOrderProperties.expirationDate ||
      calcOrderExpirationTime(endTime, currentTimestamp);
    const updatedState: any = wholeForm
      ? {
          orderDaiEstimate: '',
          orderEscrowdDai: '',
          gasCostEst: '',
          doNotCreateOrders: false,
          expirationDate,
          trade: tradeUpdate,
        }
      : { trade: tradeUpdate };
    setState({ ...state, ...updatedState });
  }

  function clearOrderConfirmation() {
    const trade = getDefaultTrade({ market, selectedOutcome });
    setState({ ...state, trade });
  }

  function handlePlaceMarketTrade(market, selectedOutcome, s) {
    orderSubmitted(selectedOrderProperties.selectedNav, market.id);
    let tradeInProgress = state.trade;
    if (state.expirationDate) {
      tradeInProgress = {
        ...tradeInProgress,
        expirationTime: state.expirationDate,
      };
    }
    placeMarketTrade({
      marketId: market.id,
      outcomeId: selectedOutcome.id,
      tradeInProgress,
      doNotCreateOrders: s.doNotCreateOrders,
    });
    clearOrderForm();
  }

  function updateTradeNumShares(order) {
    updateTradeShares({
      marketId,
      outcomeId: selectedOutcome.id,
      limitPrice: order.orderPrice,
      side: order.selectedNav,
      maxCost: order.orderDaiEstimate,
      callback: (err, newOrder) => {
        if (err) return console.error(err); // what to do with error here

        // const numShares = formatMarketShares(
        //   market.marketType,
        //   createBigNumber(newOrder.numShares),
        //   {
        //     roundDown: false,
        //   }
        // ).rounded;

        const formattedGasCost = formatGasCostToEther(
          newOrder.gasLimit,
          { decimalsRounded: 4 },
          String(gasPrice)
        ).toString();
        setState({
          ...state,
          // orderQuantity: String(numShares),
          orderEscrowdDai: newOrder.costInDai.formatted,
          orderDaiEstimate: order.orderDaiEstimate,
          trade: newOrder,
          gasCostEst: formattedGasCost,
        });
      },
    });
  }

  async function updateTradeTotalCost(order, fromOrderBook = false) {
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
      };
      setState({
        ...state,
        ...useValues,
        orderDaiEstimate: totalCost ? formattedValue.roundedValue : '',
        orderEscrowdDai: totalCost
          ? formattedValue.roundedValue.toString()
          : '',
        gasCostEst: '',
        trade: trade,
      });
    } else {
      if (order.orderPrice) {
        await queueStimulateTrade(order, useValues);
      }
    }
  }

  async function queueStimulateTrade(order, useValues) {
    const queue = state.simulateQueue.slice(0);
    queue.push(
      new Promise(resolve =>
        updateTradeCost({
          marketId: market.id,
          outcomeId: order.selectedOutcomeId
            ? order.selectedOutcomeId
            : selectedOutcome.id,
          limitPrice: order.orderPrice,
          side: order.selectedNav,
          numShares: order.orderQuantity,
          selfTrade: order.selfTrade,
          callback: (err, newOrder) => {
            if (err) {
              // just update properties for form
              return resolve({
                ...useValues,
                orderDaiEstimate: '',
                orderEscrowdDai: '',
                gasCostEst: '',
              });
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
            resolve({
              ...useValues,
              orderDaiEstimate: String(newOrderDaiEstimate),
              orderEscrowdDai: newOrder.costInDai.formatted,
              trade: newOrder,
              gasCostEst: formattedGasCost,
            });
          },
        })
      )
    );
    await Promise.all(queue).then(results =>
      setState({ ...state, ...results[results.length - 1] })
    );
  }

  function getActionButton() {
    const { trade } = state;
    const { selectedNav } = selectedOrderProperties;
    const noGSN = gsnUnavailable && !gsnWalletInfoSeen;
    const hasFunds = gsnEnabled ? !!dai : !!eth && !!dai;
    let actionButton: any = (
      <OrderButton
        type={selectedNav}
        initialLiquidity={initialLiquidity}
        action={e => {
          e.preventDefault();
          if (initialLiquidity) {
            updateLiquidity(selectedOutcome, state);
            clearOrderForm();
          } else if (tradingTutorial) {
            tutorialNext();
            clearOrderForm();
          } else {
            if (disclaimerSeen) {
              if (noGSN) {
                setModal({
                  customAction: () =>
                    handlePlaceMarketTrade(market, selectedOutcome, state),
                  type: MODAL_INITIALIZE_ACCOUNT,
                });
              } else {
                handlePlaceMarketTrade(market, selectedOutcome, state);
              }
            } else {
              setModal({
                type: MODAL_DISCLAIMER,
                onApprove: () => {
                  if (noGSN) {
                    setModal({
                      customAction: () =>
                        handlePlaceMarketTrade(market, selectedOutcome, state),
                      type: MODAL_INITIALIZE_ACCOUNT,
                    });
                  } else {
                    handlePlaceMarketTrade(market, selectedOutcome, state);
                  }
                },
              });
            }
          }
        }}
        disabled={
          !trade?.limitPrice ||
          (gsnUnavailable && isOpenOrder) ||
          insufficientFunds
        }
      />
    );
    switch (true) {
      case !restoredAccount && !isLogged && !tradingTutorial:
        actionButton = (
          <PrimaryButton
            id="login-button"
            action={() =>
              setModal({
                type: MODAL_LOGIN,
                pathName: getMarketPath(marketId),
              })
            }
            text="Login to Place Order"
          />
        );
        break;
      case isLogged && !hasFunds && !tradingTutorial:
        actionButton = (
          <PrimaryButton
            id="add-funds"
            action={() => setModal({ type: MODAL_ADD_FUNDS })}
            text="Add Funds to Place Order"
          />
        );
        break;
      default:
        break;
    }

    return actionButton;
  }

  const insufficientFunds =
    state.trade?.costInDai &&
    createBigNumber(state.trade.costInDai.value).gte(
      createBigNumber(availableDai)
    );
  const isOpenOrder = state.trade?.numFills === 0;
  const orderEmpty =
    selectedOrderProperties.orderPrice === '' &&
    selectedOrderProperties.orderQuantity === '' &&
    state.orderDaiEstimate === '';
  const showTip = !hasHistory && orderEmpty;
  const { potentialDaiLoss, sharesFilled, orderShareProfit } = state.trade;
  const showConfirm =
    (potentialDaiLoss && potentialDaiLoss.value !== 0) ||
    (orderShareProfit && orderShareProfit.value !== 0) ||
    (sharesFilled && sharesFilled.value !== 0);
  const actionButton = getActionButton();

  return (
    <section className={Styles.Wrapper}>
      <div>
        <OrderTicketHeader
          market={market}
          selectedOrderProperties={selectedOrderProperties}
          updateSelectedOrderProperties={updateSelectedOrderProperties}
        />
        <Form
          market={market}
          tradingTutorial={tradingTutorial}
          initialLiquidity={initialLiquidity}
          selectedOutcome={selectedOutcome}
          updateSelectedOutcome={updateSelectedOutcome}
          orderState={{
            ...state,
            orderPrice: selectedOrderProperties.orderPrice,
            selectedNav: selectedOrderProperties.selectedNav,
            orderQuantity: selectedOrderProperties.orderQuantity,
          }}
          updateState={updates => setState({ ...state, ...updates })}
          updateOrderProperty={property => {
            if (property.orderQuantity || property.orderPrice || property.selectedNav) {
              updateSelectedOrderProperties({
                ...selectedOrderProperties,
                ...property,
              })
            } else {
              setState({ ...state, ...property });
            }
          }}
          clearOrderForm={clearOrderForm}
          updateTradeTotalCost={updateTradeTotalCost}
          updateTradeNumShares={updateTradeNumShares}
          clearOrderConfirmation={clearOrderConfirmation}
        />
      </div>
      {showConfirm && (
        <Confirm
          selectedOutcome={selectedOutcome}
          market={market}
          trade={state.trade}
          initialLiquidity={initialLiquidity}
          tradingTutorial={tradingTutorial}
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
};

const getDefaultTrade = ({
  market: {
    id,
    settlementFee,
    marketType,
    maxPrice,
    minPrice,
    cumulativeScale,
    makerFee,
  },
  selectedOutcome,
}) => {
  if (!marketType || !selectedOutcome?.id) return null;
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
};

export default Wrapper;
