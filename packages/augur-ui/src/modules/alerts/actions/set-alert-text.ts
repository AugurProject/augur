/**
 * @todo Update text for FINALIZE once alert triggering is moved
 */

import { isEmpty } from 'utils/is-empty';
import { selectMarket } from 'modules/markets/selectors/market';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';
import {
  formatAttoDai,
  formatRep,
  formatShares,
  formatDai,
} from 'utils/format-number';
import {
  calculatePayoutNumeratorsValue,
  TXEventName,
  convertOnChainAmountToDisplayAmount,
  convertOnChainPriceToDisplayPrice,
  convertPayoutNumeratorsToStrings,
  MALFORMED_OUTCOME,
  convertDisplayValuetoAttoValue,
  numTicksToTickSize,
} from '@augurproject/sdk';
import {
  BUY,
  SELL,
  TEN_TO_THE_EIGHTEENTH_POWER,
  CANCELORDER,
  CLAIMTRADINGPROCEEDS,
  BUYPARTICIPATIONTOKENS,
  PUBLICFILLBESTORDER,
  PUBLICFILLBESTORDERWITHLIMIT,
  PUBLICFILLORDER,
  CONTRIBUTE,
  DOINITIALREPORT,
  PUBLICTRADE,
  PUBLICTRADEWITHLIMIT,
  CREATEMARKET,
  CREATECATEGORICALMARKET,
  CREATESCALARMARKET,
  CREATEYESNOMARKET,
  APPROVE,
  BUY_INDEX,
  SELL_INDEX,
  ZERO,
} from 'modules/common/constants';
import { AppState } from 'store';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { MarketData } from 'modules/types';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { isSameAddress } from 'utils/isSameAddress';

function toCapitalizeCase(label) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}
export function getInfo(params: any, status: string, marketInfo: MarketData) {
  const outcome = new BigNumber(params.outcome || params._outcome).toString();
  const outcomeDescription = getOutcomeNameWithOutcome(marketInfo, outcome);
  let orderType = params.orderType === BUY_INDEX ? BUY : SELL;

  if (status === TXEventName.Failure) {
    orderType =
      new BigNumber(params._direction).toNumber() === BUY_INDEX ? BUY : SELL;
  }

  const onChainMinPrice = convertDisplayValuetoAttoValue(
    createBigNumber(marketInfo.minPrice)
  );
  const onChainMaxPrice = convertDisplayValuetoAttoValue(
    createBigNumber(marketInfo.maxPrice)
  );
  const numTicks = createBigNumber(marketInfo.numTicks);
  const tickSize = numTicksToTickSize(
    numTicks,
    onChainMinPrice,
    onChainMaxPrice
  );
  const price = convertOnChainPriceToDisplayPrice(
    createBigNumber(params._price || params.price),
    onChainMinPrice,
    tickSize
  ).toString(10);
  const amount = convertOnChainAmountToDisplayAmount(
    createBigNumber(params.amount || params._amount),
    tickSize
  ).toString();

  return {
    price,
    amount,
    orderType: toCapitalizeCase(orderType),
    outcomeDescription,
  };
}
export default function setAlertText(alert: any, callback: Function) {
  return (
    dispatch: ThunkDispatch<void, any, Action>,
    getState: () => AppState
  ): void => {
    if (!alert || isEmpty(alert)) {
      return dispatch(callback(alert));
    }
    if (!callback) {
      throw new Error('Callback function is not set');
    }

    if (!alert.params || !alert.name) {
      return dispatch(callback(alert));
    }

    const marketId = alert.params.market || alert.params._market;
    if (!marketId) return;
    switch (alert.name.toUpperCase()) {
      // CancelOrder
      case CANCELORDER: {
        alert.title = 'Order Cancelled';
        dispatch(
          loadMarketsInfoIfNotLoaded([marketId], () => {
            const marketInfo = selectMarket(marketId);
            if (marketInfo === null) return;
            alert.description = marketInfo.description;
            const amount = alert.params.order.amount;
            const price = alert.params.order.price;
            const orderType = alert.params.orderTypeLabel;
            const outcomeDescription =
              alert.params.outcomeId === null
                ? 'Market Is Invalid'
                : getOutcomeNameWithOutcome(
                    marketInfo,
                    alert.params.outcomeId,
                    false
                  );
            alert.details = `${toCapitalizeCase(orderType)}  ${
              formatShares(amount).formatted
            } of ${
              formatDai(price).formatted
            } of ${outcomeDescription} has been cancelled`;
          })
        );
        break;
      }

      // ClaimTradingProceeds
      case CLAIMTRADINGPROCEEDS:
        alert.title = 'Claim Winnings';
        dispatch(
          loadMarketsInfoIfNotLoaded([marketId], () => {
            const marketInfo = selectMarket(marketId);
            if (marketInfo === null) return;
            alert.description = marketInfo.description;
            const amount = createBigNumber(alert.params.numPayoutTokens);
            const outcomeDescription =
              alert.params.outcome === null
                ? 'Market Is Invalid'
                : getOutcomeNameWithOutcome(
                    marketInfo,
                    alert.params.outcome,
                    false
                  );
            alert.details = `$${
              formatAttoDai(amount).formatted
            } won on ${outcomeDescription}`;
          })
        );
        break;

      // FeeWindow & Universe
      case BUY:
      case BUYPARTICIPATIONTOKENS:
        alert.title = 'Buy participation token(s)';
        if (!alert.description && alert.log) {
          alert.description = `Purchase ${
            formatRep(
              createBigNumber(alert.log.value).dividedBy(
                TEN_TO_THE_EIGHTEENTH_POWER
              )
            ).formatted
          } Participation Token${
            alert.log.value === TEN_TO_THE_EIGHTEENTH_POWER ? '' : 's'
          }`;
        }
        break;

      // FillOrder & Trade
      case PUBLICFILLBESTORDER:
      case PUBLICFILLBESTORDERWITHLIMIT:
      case PUBLICFILLORDER:
        alert.title = 'Filled';
        if (alert.params.marketInfo) {
          alert.description = alert.params.marketInfo.description;
          alert.details = `${
            toCapitalizeCase(alert.params.orderType)
          } ${formatShares(alert.params.amount).formatted} of ${
            formatShares(alert.params.amount).formatted
          } of ${alert.params.outcome} @ ${
            formatDai(alert.params.price).formatted
          }`;
        } else {
          dispatch(
            loadMarketsInfoIfNotLoaded([marketId], () => {
              const marketInfo = selectMarket(marketId);
              if (marketInfo === null) return;
              const { loginAccount, userOpenOrders } = getState() as AppState;
              let originalQuantity = convertOnChainAmountToDisplayAmount(
                createBigNumber(alert.params.amountFilled),
                createBigNumber(marketInfo.tickSize)
              );
              let updatedOrderType = alert.params.orderType;
              if (
                alert.params.orderCreator.toUpperCase() ===
                loginAccount.address.toUpperCase()
              ) {
                // creator
                const orders = userOpenOrders[alert.params.market];
                const outcome = new BigNumber(alert.params.outcome).toString();
                const foundOrder =
                  orders &&
                  orders[outcome] &&
                  orders[outcome][alert.params.orderType] &&
                  orders[outcome][alert.params.orderType][alert.params.orderId];
                if (foundOrder) {
                  originalQuantity = createBigNumber(
                    foundOrder.originalFullPrecisionAmount
                  );
                }
              } else {
                // filler
                updatedOrderType =
                  alert.params.orderType === BUY_INDEX ? SELL_INDEX : BUY_INDEX;
              }
              alert.description = marketInfo.description;
              const params = {
                ...alert.params,
                orderType: updatedOrderType,
                amount: alert.params.amountFilled,
              };
              const { orderType, amount, price, outcomeDescription } = getInfo(
                params,
                alert.status,
                marketInfo
              );
              alert.details = `${orderType}  ${
                formatShares(amount).formatted
              } of ${
                formatShares(originalQuantity).formatted
              } of ${outcomeDescription} @ ${formatDai(price).formatted}`;
            })
          );
          dispatch(
            loadMarketsInfoIfNotLoaded([marketId], () => {
              const marketInfo = selectMarket(marketId);
              if (marketInfo === null) return;
              const { loginAccount, userOpenOrders } = getState() as AppState;
              let originalQuantity = convertOnChainAmountToDisplayAmount(
                createBigNumber(alert.params.amountFilled),
                createBigNumber(marketInfo.tickSize)
              );
              let updatedOrderType = alert.params.orderType;
              if (
                alert.params.orderCreator.toUpperCase() ===
                loginAccount.address.toUpperCase()
              ) {
                // creator
                const orders = userOpenOrders[alert.params.market];
                const outcome = new BigNumber(alert.params.outcome).toString();
                const foundOrder =
                  orders &&
                  orders[outcome] &&
                  orders[outcome][alert.params.orderType] &&
                  orders[outcome][alert.params.orderType][alert.params.orderId];
                if (foundOrder) {
                  originalQuantity = createBigNumber(
                    foundOrder.originalFullPrecisionAmount
                  );
                }
              } else {
                // filler
                updatedOrderType =
                  alert.params.orderType === BUY_INDEX ? SELL_INDEX : BUY_INDEX;
              }
              alert.description = marketInfo.description;
              const params = {
                ...alert.params,
                orderType: updatedOrderType,
                amount: alert.params.amountFilled,
              };
              const { orderType, amount, price, outcomeDescription } = getInfo(
                params,
                alert.status,
                marketInfo
              );
              alert.details = `${orderType}  ${
                formatShares(amount).formatted
              } of ${
                formatShares(originalQuantity).formatted
              } of ${outcomeDescription} @ ${formatDai(price).formatted}`;
            })
          );
        }
        break;

      // Market
      case CONTRIBUTE:
        alert.title = alert.params.preFilled
          ? 'Prefilled Stake'
          : 'Market Disputed';
        if (
          alert.params.preFilled &&
          (!alert.params._additionalStake ||
            (alert.params._additionalStake &&
              createBigNumber(alert.params._additionalStake).eq(ZERO)))
        ) {
          break;
        }
        const payoutNums = convertPayoutNumeratorsToStrings(
          alert.params._payoutNumerators || alert.params.payoutNumerators
        );
        const repAmount = formatRep(
          createBigNumber(
            alert.params.preFilled
              ? alert.params._additionalStake
              : alert.params._amount
          ).dividedBy(TEN_TO_THE_EIGHTEENTH_POWER)
        ).formatted;

        if (!marketId) {
          alert.details = `${repAmount} REP contributed"`;
          break;
        }
        dispatch(
          loadMarketsInfoIfNotLoaded([marketId], () => {
            const marketInfo = selectMarket(marketId);
            if (marketInfo === null) return;
            const payoutNumeratorResultObject = calculatePayoutNumeratorsValue(
              marketInfo.maxPrice,
              marketInfo.minPrice,
              marketInfo.numTicks,
              marketInfo.marketType,
              payoutNums
            );
            const outcomeDescription = !!payoutNumeratorResultObject.invalid
              ? 'Market Is Invalid'
              : getOutcomeNameWithOutcome(
                  marketInfo,
                  payoutNumeratorResultObject.outcome,
                  false,
                  true
                );
            payoutNumeratorResultObject.malformed
              ? MALFORMED_OUTCOME
              : getOutcomeNameWithOutcome(
                  marketInfo,
                  payoutNumeratorResultObject.outcome,
                  payoutNumeratorResultObject.invalid,
                  true
                );
            alert.description = marketInfo.description;
            alert.details = `${repAmount} REP added to "${outcomeDescription}"`;
          })
        );
        break;
      case DOINITIALREPORT:
        alert.title = 'Market Reported';
        if (!marketId) {
          alert.description = 'Initial Report';
          break;
        }
        dispatch(
          loadMarketsInfoIfNotLoaded([marketId], () => {
            const marketInfo = selectMarket(marketId);
            if (marketInfo === null) return;
            const payoutNumeratorResultObject = calculatePayoutNumeratorsValue(
              marketInfo.maxPrice,
              marketInfo.minPrice,
              marketInfo.numTicks,
              marketInfo.marketType,
              alert.params.payoutNumerators ||
                convertPayoutNumeratorsToStrings(alert.params._payoutNumerators)
            );
            const outcomeDescription = payoutNumeratorResultObject.malformed
              ? MALFORMED_OUTCOME
              : getOutcomeNameWithOutcome(
                  marketInfo,
                  payoutNumeratorResultObject.outcome,
                  payoutNumeratorResultObject.invalid,
                  true
                );
            alert.description = marketInfo.description;
            alert.details = `Tentative winning outcome: "${outcomeDescription}"`;
          })
        );
        break;

      // Trade
      case PUBLICTRADE:
      case PUBLICTRADEWITHLIMIT: {
        alert.title = 'Order placed';
        dispatch(
          loadMarketsInfoIfNotLoaded([marketId], () => {
            const marketInfo = selectMarket(marketId);
            if (marketInfo === null) return;
            alert.description = marketInfo.description;
            const { orderType, amount, price, outcomeDescription } = getInfo(
              alert.params,
              alert.status,
              marketInfo
            );

            alert.details = `${orderType}  ${
              formatShares(amount).formatted
            } of ${outcomeDescription} @ ${formatDai(price).formatted}`;
          })
        );
        break;
      }

      // Universe
      case CREATEMARKET:
      case CREATECATEGORICALMARKET:
      case CREATESCALARMARKET:
      case CREATEYESNOMARKET:
        alert.title = 'Market created';
        if (!alert.description) {
          const params = JSON.parse(
            alert.params.extraInfo || alert.params._extraInfo
          );
          alert.description = params && params.description;
        }
        break;

      // These transaction names are overloaded across multiple contracts
      case APPROVE:
        alert.title = 'Dai approval';
        alert.description = 'You are approved to use Dai on Augur';
        break;

      default: {
        break;
      }
    }

    if (alert.status === TXEventName.Failure) {
      alert.description = alert.title;
      alert.title = 'Failed transaction';
    }

    return dispatch(callback(alert));
  };
}
