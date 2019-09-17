/**
 * @todo Update text for FINALIZE once alert triggering is moved
 */

import { isEmpty } from 'utils/is-empty';
import { selectMarket } from 'modules/markets/selectors/market';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { getOutcomeNameWithOutcome } from 'utils/get-outcome';
import {
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
  PREFILLEDSTAKE,
  ZERO,
} from 'modules/common/constants';
import { AppState } from 'store';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { updateAlert } from './alerts';

function toCapitalizeCase(label) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}
function getInfo(params, status, marketInfo) {
  const outcome = params.outcome
    ? new BigNumber(params.outcome).toNumber()
    : new BigNumber(params._outcome).toNumber();

  const outcomeDescription = getOutcomeNameWithOutcome(marketInfo, outcome);
  let orderType = params.orderType === 0 ? BUY : SELL;

  if (status === TXEventName.Failure) {
    orderType = params._direction.toNumber() === 0 ? BUY : SELL;
  }

  const price = convertOnChainPriceToDisplayPrice(
    createBigNumber(params.price || params._price),
    createBigNumber(marketInfo.minPrice),
    createBigNumber(marketInfo.tickSize)
  );
  const amount = convertOnChainAmountToDisplayAmount(
    createBigNumber(params.amount || params._amount),
    createBigNumber(marketInfo.tickSize)
  );

  return {
    price,
    amount,
    orderType: toCapitalizeCase(orderType),
    outcomeDescription,
  };
}
export default function setAlertText(alert: any, callback: any) {
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
        alert.title = 'Claim trading proceeds';
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
            alert.toast = true;
          })
        );
        break;

      // Market
      case CONTRIBUTE:
        alert.title = alert.params.preFilled
          ? 'Prefilled Stake'
          : 'Market Disputed';
        if (alert.params.preFilled && !alert.params._additionalStake) {
          break;
        }
        dispatch(
          loadMarketsInfoIfNotLoaded([marketId], () => {
            const marketInfo = selectMarket(marketId);
            if (marketInfo === null) return;
            const outcome = calculatePayoutNumeratorsValue(
              marketInfo.maxPrice,
              marketInfo.minPrice,
              marketInfo.numTicks,
              marketInfo.marketType,
              alert.params._payoutNumerators
                ? convertPayoutNumeratorsToStrings(
                    alert.params._payoutNumerators
                  )
                : alert.params.payoutNumerators
            );
            const outcomeDescription =
              outcome === null
                ? 'Market Is Invalid'
                : getOutcomeNameWithOutcome(marketInfo, outcome, false);
            alert.description = marketInfo.description;
            alert.details = `${
              formatRep(
                createBigNumber(
                  alert.params.preFilled
                    ? alert.params._additionalStake
                    : alert.params._amount
                ).dividedBy(TEN_TO_THE_EIGHTEENTH_POWER)
              ).formatted
            } REP added to "${outcomeDescription}"`;
          })
        );
        break;
      case DOINITIALREPORT:
        alert.title = 'Market Reported';
        dispatch(
          loadMarketsInfoIfNotLoaded([marketId], () => {
            const marketInfo = selectMarket(marketId);
            if (marketInfo === null) return;
            const outcome = calculatePayoutNumeratorsValue(
              marketInfo.maxPrice,
              marketInfo.minPrice,
              marketInfo.numTicks,
              marketInfo.marketType,
              alert.params.payoutNumerators ||
                convertPayoutNumeratorsToStrings(alert.params._payoutNumerators)
            );
            const outcomeDescription =
              outcome === null
                ? 'Market Is Invalid'
                : getOutcomeNameWithOutcome(marketInfo, outcome, false);
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
            alert.toast = true;
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
      alert.title = 'Failed transaction';
    }

    return dispatch(callback(alert));
  };
}
