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
  formatDaiPrice,
} from 'utils/format-number';
import {
  convertOnChainAmountToDisplayAmount,
  convertOnChainPriceToDisplayPrice,
  convertPayoutNumeratorsToStrings,
  convertDisplayValuetoAttoValue,
  numTicksToTickSize,
  convertAttoValueToDisplayValue,
  TXEventName,
  calculatePayoutNumeratorsValue,
} from '@augurproject/sdk-lite';
import {
  BUY,
  SELL,
  TEN_TO_THE_EIGHTEENTH_POWER,
  MALFORMED_OUTCOME,
  CANCELORDER,
  CANCELORDERS,
  CLAIMTRADINGPROCEEDS,
  BUYPARTICIPATIONTOKENS,
  REDEEMSTAKE,
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
  HEX_BUY,
  SELL_INDEX,
  ZERO,
  ONE,
  MIGRATE_FROM_LEG_REP_TOKEN,
  DOINITIALREPORTWARPSYNC,
  SCALAR,
} from 'modules/common/constants';
import { AppState } from 'appStore';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { MarketData } from 'modules/types';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { convertUnixToFormattedDate } from 'utils/format-date';
import getPrecision from 'utils/get-number-precision';

function toCapitalizeCase(label) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}
export function getInfo(params: any, status: string, marketInfo: MarketData, isOrder: boolean = true) {
  const outcome = new BigNumber(params.outcome || params._outcome).toString();
  const outcomeDescription = getOutcomeNameWithOutcome(marketInfo, outcome);
  let orderType =
    params.orderType === HEX_BUY || params.orderType === BUY_INDEX ? BUY : SELL;
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
  const price = isOrder
    ? createBigNumber(params._price || params.price)
        .times(tickSize)
        .toString(10)
    : convertOnChainPriceToDisplayPrice(
        createBigNumber(params._price || params.price),
        onChainMinPrice,
        tickSize
      ).toString(10);

  const amount = convertOnChainAmountToDisplayAmount(
    createBigNumber(params.amount || params._amount),
    tickSize
  ).toString();

  const priceFormatted = formatDaiPrice(price, {decimals: getPrecision(String(tickSize), 2)})

  return {
    priceFormatted,
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

    const marketId = alert.params.marketId || alert.params.market;
    if (!marketId) return;
    switch (alert.name.toUpperCase()) {
      // CancelOrder
      case CANCELORDER:
      case CANCELORDERS: {
        dispatch(
          loadMarketsInfoIfNotLoaded([marketId], () => {
            const marketInfo = selectMarket(marketId);
            if (marketInfo === null) return;

            const { orderType, outcomeDescription } = getInfo(
              alert.params,
              alert.status,
              marketInfo
            );
            const quantity = alert.params.unmatchedShares
              ? alert.params.unmatchedShares.value
              : convertOnChainAmountToDisplayAmount(
                  alert.params.amount,
                  createBigNumber(marketInfo.tickSize)
                );

            alert.title =
              alert.status === TXEventName.Success
                ? 'Order Cancelled'
                : 'Cancelling Order';
            alert.description = marketInfo.description;
            alert.details = `${orderType} ${
              formatShares(quantity).formatted
            } of ${outcomeDescription} @ ${alert.params.avgPrice.formatted}`;
          })
        );
        break;
      }

      // ClaimTradingProceeds
      case CLAIMTRADINGPROCEEDS:
        alert.title = 'Claim Proceeds';
        dispatch(
          loadMarketsInfoIfNotLoaded([marketId], () => {
            const marketInfo = selectMarket(marketId);
            if (marketInfo === null) return;
            alert.description = marketInfo.description;
            const amount = createBigNumber(alert.params.numPayoutTokens);
            alert.details = `$${
              formatAttoDai(amount, { zeroStyled: false }).formatted
            } claimed`;
            alert.id = alert.params.transactionHash;
          })
        );
        break;

      // FeeWindow & Universe
      case BUY:
      case BUYPARTICIPATIONTOKENS:
        alert.title = 'Buy participation tokens';
        if (!alert.description && alert.params) {
          if (alert.params.startTime && alert.params.endTime) {
            alert.details = `Dispute Window ${
              convertUnixToFormattedDate(alert.params.startTime)
                .formattedLocalShortDate
            } - ${
              convertUnixToFormattedDate(alert.params.endTime)
                .formattedLocalShortDate
            }`;
          }
          alert.description = `Purchased ${
            formatRep(
              createBigNumber(alert.params._attotokens).dividedBy(
                TEN_TO_THE_EIGHTEENTH_POWER
              )
            ).formatted
          } Participation Token${
            createBigNumber(alert.params._attotokens).eq(
              TEN_TO_THE_EIGHTEENTH_POWER
            )
              ? ''
              : 's'
          }`;
        }
        break;

      case REDEEMSTAKE:
        let participation = false;
        if (alert.params && alert.params.attoParticipationTokens) {
          participation = true;
        }
        alert.title = participation
          ? 'Redeem participation tokens'
          : 'REPv2 Stake Redeemed';
        if (alert.params) {
          if (participation) {
            const tokens = formatRep(
              convertAttoValueToDisplayValue(
                createBigNumber(alert.params.attoParticipationTokens)
              ).toString()
            );
            alert.description = `Redeemed ${
              tokens.formatted
            } Participation Token${
              createBigNumber(tokens.value).eq(ONE) ? '' : 's'
            }`;
          } else {
            const REPVal = formatRep(
              convertAttoValueToDisplayValue(
                createBigNumber(alert.params.repReceived)
              ).toString()
            );
            alert.description = `${REPVal.formatted} REPv2 stake redeemed`;
          }
        }
        break;

      // FillOrder & Trade
      case PUBLICFILLBESTORDER:
      case PUBLICFILLBESTORDERWITHLIMIT:
      case PUBLICFILLORDER:
        alert.title = 'Filled';
        if (alert.params.marketInfo) {
          alert.description = alert.params.marketInfo.description;
          alert.details = `${toCapitalizeCase(alert.params.orderType)} ${
            formatShares(alert.params.amount).formatted
          } of ${alert.params.outcome} @ ${
            formatDaiPrice(alert.params.price).formatted
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
                loginAccount?.address.toUpperCase()
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
                marketInfo,
                false
              );
              alert.details = `${orderType} ${
                formatShares(amount).formatted
              } of ${outcomeDescription} @ ${formatDaiPrice(price).formatted}`;
            })
          );
          dispatch(
            loadMarketsInfoIfNotLoaded([marketId], () => {
              const marketInfo = selectMarket(marketId);
              if (marketInfo === null) return;
              const { loginAccount, userOpenOrders } = getState() as AppState;
              let originalQuantity = null;
              let updatedOrderType = alert.params.orderType;
              if (
                loginAccount.address && alert.params.orderCreator.toUpperCase() ===
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
                marketInfo,
                false
              );
              alert.details = `${orderType}  ${
                formatShares(amount).formatted
              } ${
                originalQuantity
                  ? ` of ${formatShares(originalQuantity).formatted}`
                  : ''
              } of ${outcomeDescription} @ ${formatDaiPrice(price).formatted}`;
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
        const amountStaked =
          alert.params.amountStaked &&
          convertAttoValueToDisplayValue(
            createBigNumber(alert.params.amountStaked)
          ).toString();
        const repAmount = formatRep(
          amountStaked
            ? amountStaked
            : createBigNumber(
                alert.params.preFilled
                  ? alert.params._additionalStake
                  : alert.params._amount
              ).dividedBy(TEN_TO_THE_EIGHTEENTH_POWER)
        ).formatted;

        if (!marketId) {
          alert.details = `${repAmount} REPv2 contributed"`;
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
            alert.details = `${repAmount} REPv2 added to "${outcomeDescription}"`;
          })
        );
        break;
      case DOINITIALREPORT:
      case DOINITIALREPORTWARPSYNC:
        alert.title = 'Market Reported';
        if (!marketId) {
          alert.description = 'Initial Report';
          break;
        }
        dispatch(
          loadMarketsInfoIfNotLoaded([marketId], () => {
            const marketInfo = selectMarket(marketId);
            if (marketInfo === null) return;
            if (alert.name.toUpperCase() === DOINITIALREPORT) {
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
              alert.details = `Tentative winning outcome: "${outcomeDescription}"`;
            }
            alert.description = marketInfo.description;
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
            const {
              orderType,
              amount,
              outcomeDescription,
              priceFormatted,
            } = getInfo(
              alert.params,
              alert.status,
              marketInfo,
              marketInfo.marketType !== SCALAR
            );

            alert.details = `${orderType}  ${
              formatShares(amount).formatted
            } of ${outcomeDescription} @ ${priceFormatted.formatted}`;
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
        alert.title = 'DAI approval';
        alert.description = 'You are approved to use DAI on Augur';
        break;

      case MIGRATE_FROM_LEG_REP_TOKEN:
        const amount = formatRep(
          convertAttoValueToDisplayValue(createBigNumber(alert.params.amount))
        );
        alert.title = 'REPv2 transferred to your address';
        alert.description = `You have received ${amount.formatted} REPv2`;
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
