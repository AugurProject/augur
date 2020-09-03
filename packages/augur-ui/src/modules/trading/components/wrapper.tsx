import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { createBigNumber } from 'utils/create-big-number';
import { useLocation } from 'react-router';
import Form from 'modules/trading/components/form';
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
  TRADING_TUTORIAL,
} from 'modules/common/constants';
import Styles from 'modules/trading/components/wrapper.styles.less';
import { OrderButton, PrimaryButton } from 'modules/common/buttons';
import {
  formatGasCostToEther,
  formatNumber,
  formatMarketShares,
} from 'utils/format-number';
import { calculateTotalOrderValue } from 'modules/trades/helpers/calc-order-profit-loss-percents';
import { formatDai } from 'utils/format-number';
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
import {
  MARKET_ID_PARAM_NAME,
  THEME_NAME,
} from 'modules/routes/constants/param-names';
import { canPostOrder } from 'modules/trades/actions/can-post-order';
import { getIsTutorial, getIsPreview } from 'modules/market/store/market-utils';
import { useTradingStore } from 'modules/trading/store/trading';

const getMarketPath = (id, theme) => ({
  pathname: makePath(MARKET),
  search: makeQuery({
    [MARKET_ID_PARAM_NAME]: id,
    [THEME_NAME]: theme,
  }),
});

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
  if (!marketType || (!selectedOutcome && !isFinite(selectedOutcome.id)))
    return null;
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

const OrderTicketHeader = ({ market, updateTradeTotalCost }) => {
  const {
    orderProperties,
    actions: { updateSelectedNav },
  } = useTradingStore();
  const buySelected = orderProperties.selectedNav === BUY;

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
          onClick={() => {
            updateSelectedNav(BUY);
            updateTradeTotalCost({
              ...orderProperties,
              selectedNav: BUY,
            });
          }}
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
          onClick={() => {
            updateSelectedNav(SELL);
            updateTradeTotalCost({
              ...orderProperties,
              selectedNav: SELL,
            });
          }}
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
  updateLiquidity,
  tutorialNext,
  orderBook,
}) => {
  const {
    newMarket,
    accountPositions,
    userOpenOrders,
    loginAccount: {
      balances: { dai, eth },
    },
    theme,
    gsnEnabled,
    isLogged,
    restoredAccount,
    blockchain: { currentAugurTimestamp: currentTimestamp },
    actions: { setModal },
    env: {
      ui: { reportingOnly: disableTrading },
    },
  } = useAppStatusStore();
  const {
    orderProperties,
    actions: { updateOrderProperties },
  } = useTradingStore();
  const location = useLocation();
  const isTutorial = getIsTutorial(market.id);
  const isPreview = getIsPreview(location);
  const initialLiquidity = isPreview && !isTutorial;
  const [trade, setTrade] = useState(
    getDefaultTrade({ market, selectedOutcome })
  );
  const [isSimulatingTrade, setIsSimulatingTrade] = useState(false);
  const marketId = market.id;
  const tradingTutorial = marketId === TRADING_TUTORIAL;
  const endTime = initialLiquidity ? newMarket.setEndTime : market.endTime;
  const availableDai = initialLiquidity
    ? totalTradingBalance().minus(newMarket.initialLiquidityDai)
    : totalTradingBalance();
  const gsnUnavailable = isGSNUnavailable();
  const disclaimerSeen = !!getValueFromlocalStorage(DISCLAIMER_SEEN);
  const gsnWalletInfoSeen = !!getValueFromlocalStorage(GSN_WALLET_SEEN);

  const hasHistory = !!accountPositions[marketId] || !!userOpenOrders[marketId];
  // if outcome id changes we clear form
  useEffect(() => {
    clearOrderForm(true);
  }, [selectedOutcome.id]);
  // if price and quantity are filled in but estimated dai isn't, run it. can happen from orderbook/outcome table clicks.
  useEffect(() => {
    const { orderPrice, orderQuantity } = orderProperties;
    if (!!orderQuantity && !!orderPrice && !isSimulatingTrade) {
      updateTradeTotalCost(orderProperties);
    }
  }, [orderProperties.orderPrice, orderProperties.orderQuantity]);

  function clearOrderForm(wholeForm = true) {
    const expirationDate =
      orderProperties.expirationDate ||
      calcOrderExpirationTime(endTime, currentTimestamp);
    if (wholeForm) {
      updateOrderProperties({
        allowPostOnlyOrder: true,
        orderDaiEstimate: '',
        orderEscrowdDai: '',
        gasCostEst: '',
        expirationDate,
        orderPrice: '',
        postOnlyOrder: false,
        orderQuantity: '',
      });
    }
    clearOrderConfirmation();
  }

  function clearOrderConfirmation() {
    setTrade(getDefaultTrade({ market, selectedOutcome }));
  }

  function handlePlaceMarketTrade(market, selectedOutcome) {
    orderSubmitted(orderProperties.selectedNav, market.id);
    let tradeInProgress = trade;
    if (orderProperties.expirationDate) {
      tradeInProgress = {
        ...tradeInProgress,
        expirationTime: orderProperties.expirationDate,
      };
    }
    placeMarketTrade({
      marketId: market.id,
      outcomeId: selectedOutcome.id,
      tradeInProgress,
      doNotCreateOrders: orderProperties.doNotCreateOrders,
      postOnly: orderProperties.postOnlyOrder,
    });
    clearOrderForm();
  }

  function checkCanPostOnly(price, side) {
    if (orderProperties.postOnlyOrder) {
      const allowPostOnlyOrder = canPostOrder(price, side, orderBook);
      if (allowPostOnlyOrder !== orderProperties.allowPostOnlyOrder) {
        updateOrderProperties({ allowPostOnlyOrder });
      }
      return allowPostOnlyOrder;
    }
    return true;
  }

  function updateTradeNumShares(order) {
    updateTradeShares({
      marketId,
      market,
      outcomeId: selectedOutcome.id,
      limitPrice: order.orderPrice,
      side: order.selectedNav,
      maxCost: order.orderDaiEstimate,
      callback: (err, newOrder) => {
        if (err) return console.error(err); // what to do with error here

        const numShares = formatMarketShares(
          market.marketType,
          createBigNumber(newOrder.numShares),
          {
            roundDown: false,
          }
        ).rounded;

        const formattedGasCost = formatGasCostToEther(
          newOrder.gasLimit,
          { decimalsRounded: 4 },
          String(getGasPrice())
        ).toString();
        updateOrderProperties({
          orderQuantity: String(numShares),
          orderEscrowdDai: newOrder.costInDai.formatted,
          orderDaiEstimate: order.orderDaiEstimate,
          gasCostEst: formattedGasCost,
        });
        console.log('is it newOrder?', newOrder);
        setTrade(newOrder);
        checkCanPostOnly(
          newOrder?.trade?.limitPrice || order.orderPrice,
          newOrder?.trade?.side || order.selectedNav
        );
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
      const newTrade = {
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
      console.log('is it newTrade?', newTrade);
      setTrade(newTrade);
      updateOrderProperties({
        orderDaiEstimate: totalCost ? formattedValue.roundedValue : '',
        orderEscrowdDai: totalCost
          ? formattedValue.roundedValue.toString()
          : '',
        gasCostEst: '',
      });
    } else {
      if (order.orderPrice) {
        await queueStimulateTrade(order, useValues);
        checkCanPostOnly(order.orderPrice, order.selectedNav);
      }
    }
  }

  async function queueStimulateTrade(order, useValues) {
    const queue = [];
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
              String(getGasPrice())
            ).toString();
            resolve({
              ...useValues,
              orderDaiEstimate: String(newOrderDaiEstimate),
              orderEscrowdDai: newOrder.costInDai.formatted,
              trade: newOrder,
              gasCostEst: formattedGasCost,
              postOnlyOrder: orderProperties.postOnlyOrder,
            });
          },
        })
      )
    );
    setIsSimulatingTrade(true);
    await Promise.all(queue).then(results => {
      const info = results[results.length - 1];
      const newTrade = info.trade;
      delete info.trade;
      if (!newTrade) {
        clearOrderForm(true);
      } else {
        setTrade(newTrade);
        updateOrderProperties({ ...info });
      }
      setIsSimulatingTrade(false);
    });
  }

  function getActionButton() {
    const { selectedNav, allowPostOnlyOrder, postOnlyOrder } = orderProperties;
    const noGSN = gsnUnavailable && !gsnWalletInfoSeen;
    const hasFunds = gsnEnabled ? !!dai : !!eth && !!dai;
    let actionButton: any = (
      <OrderButton
        type={selectedNav}
        initialLiquidity={initialLiquidity}
        action={e => {
          e.preventDefault();
          if (initialLiquidity) {
            // make sure we have everything defined.
            updateLiquidity(selectedOutcome, {
              ...trade,
              ...orderProperties,
            });
            clearOrderForm();
          } else if (tradingTutorial) {
            tutorialNext();
          } else {
            if (disclaimerSeen) {
              if (noGSN) {
                setModal({
                  customAction: () =>
                    handlePlaceMarketTrade(market, selectedOutcome),
                  type: MODAL_INITIALIZE_ACCOUNT,
                });
              } else {
                handlePlaceMarketTrade(market, selectedOutcome);
              }
            } else {
              setModal({
                type: MODAL_DISCLAIMER,
                onApprove: () => {
                  if (noGSN) {
                    setModal({
                      customAction: () =>
                        handlePlaceMarketTrade(market, selectedOutcome),
                      type: MODAL_INITIALIZE_ACCOUNT,
                    });
                  } else {
                    handlePlaceMarketTrade(market, selectedOutcome);
                  }
                },
              });
            }
          }
        }}
        disabled={
          !trade?.limitPrice ||
          (gsnUnavailable && isOpenOrder) ||
          insufficientFunds ||
          (postOnlyOrder && trade.numFills > 0) ||
          !allowPostOnlyOrder ||
          disableTrading
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
                pathName: getMarketPath(marketId, theme),
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
    trade?.costInDai &&
    createBigNumber(trade.costInDai.value).gte(createBigNumber(availableDai));
  const isOpenOrder = trade?.numFills === 0;
  const orderEmpty =
    orderProperties.orderPrice === '' &&
    orderProperties.orderQuantity === '' &&
    orderProperties.orderDaiEstimate === '';
  const showTip = !hasHistory && orderEmpty;
  const {
    potentialDaiLoss = null,
    sharesFilled = null,
    orderShareProfit = null,
  } = trade;
  const showConfirm =
    potentialDaiLoss?.value > 0 ||
    orderShareProfit?.value > 0 ||
    sharesFilled?.value > 0;

  const actionButton = getActionButton();
  return (
    <section className={Styles.Wrapper}>
      <div>
        <OrderTicketHeader {...{ market, updateTradeTotalCost }} />
        <Form
          {...{
            market,
            tradingTutorial,
            initialLiquidity,
            selectedOutcome,
            updateSelectedOutcome,
            clearOrderForm,
            updateTradeTotalCost,
            updateTradeNumShares,
            clearOrderConfirmation,
          }}
        />
      </div>
      {showConfirm && (
        <Confirm
          {...{
            selectedOutcome,
            market,
            tradingTutorial,
            initialLiquidity,
            trade,
          }}
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

export default Wrapper;
