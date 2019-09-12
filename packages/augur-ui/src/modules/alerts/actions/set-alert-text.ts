/**
 * @todo Update text for FINALIZE once alert triggering is moved
 */
import { isEmpty } from "utils/is-empty";
import { selectMarket } from "modules/markets/selectors/market";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { getOutcomeName } from "utils/get-outcome";
import { formatEther, formatRep, formatShares, formatDai } from "utils/format-number";
import { calculatePayoutNumeratorsValue, TXEventName, convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice } from "@augurproject/sdk";
import {
  BUY,
  SELL,
  TEN_TO_THE_EIGHTEENTH_POWER,
  CANCELORDER,
  CLAIMTRADINGPROCEEDS,
  PUBLICCREATEORDER,
  BUYPARTICIPATIONTOKENS,
  PUBLICFILLBESTORDER,
  PUBLICFILLBESTORDERWITHLIMIT,
  PUBLICFILLORDER,
  CONTRIBUTE,
  DISAVOWCROWDSOURCERS,
  DOINITIALREPORT,
  PUBLICBUY,
  PUBLICBUYWITHLIMIT,
  PUBLICSELL,
  PUBLICSELLWITHLIMIT,
  PUBLICTRADE,
  PUBLICTRADEWITHLIMIT,
  CREATEMARKET,
  CREATECATEGORICALMARKET,
  CREATESCALARMARKET,
  CREATEYESNOMARKET,
  APPROVE
} from "modules/common/constants";
import { Outcomes } from "modules/types";
import { AppState } from "store";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { createBigNumber } from "utils/create-big-number";

function getInfo(params, marketInfo) {
  const outcomeDescription = getOutcomeName(
    marketInfo,
    { id: params.outcome },
  );
  const price = convertOnChainPriceToDisplayPrice(createBigNumber(params.price), createBigNumber(marketInfo.minPrice), createBigNumber(marketInfo.tickSize));
  const amount = convertOnChainAmountToDisplayAmount(createBigNumber(params.amount), createBigNumber(marketInfo.tickSize));
  const orderType = params.orderType === 0 ? BUY : SELL;
    
  return {
    price,
    amount,
    orderType: orderType.charAt(0).toUpperCase() + orderType.slice(1),
    outcomeDescription
  }
}
export default function setAlertText(alert: any, callback: any) {
  return (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState): void => {
    if (!alert || isEmpty(alert)) {
      return dispatch(callback(alert));
    }
    if (!callback) {
      throw new Error("Callback function is not set");
    }

    if (!alert.params || !alert.name) {
      return dispatch(callback(alert));
    }

    switch (alert.name.toUpperCase()) {
      // CancelOrder
      case CANCELORDER: {
        alert.title = "Order Cancelled";
        if (!alert.description) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.params.market], () => {
              const marketInfo = selectMarket(alert.params.market);
              alert.description = marketInfo.description;
              const {
                orderType,
                amount,
                price,
                outcomeDescription
              } = getInfo(alert.params, marketInfo);
              alert.details = `${orderType}  ${formatShares(amount).formatted} of ${formatDai(price).formatted} of ${outcomeDescription} has been cancelled`;
              return dispatch(callback(alert));
            }),
          );
        }
        break;
      }

      // ClaimTradingProceeds
      case CLAIMTRADINGPROCEEDS:
        alert.title = "Claim trading proceeds";
        break;

      // FeeWindow & Universe
      case BUY:
      case BUYPARTICIPATIONTOKENS:
        alert.title = "Buy participation token(s)";
        if (!alert.description && alert.log) {
          alert.description = `Purchase ${
            formatRep(
              createBigNumber(alert.log.value).dividedBy(
                TEN_TO_THE_EIGHTEENTH_POWER
              )
            ).formatted
          } Participation Token${
            alert.log.value === TEN_TO_THE_EIGHTEENTH_POWER ? "" : "s"
          }`;
        }
        break;

      // FillOrder & Trade
      case PUBLICFILLBESTORDER:
      case PUBLICFILLBESTORDERWITHLIMIT:
      case PUBLICFILLORDER:
        alert.title = "Filled";
        if (!alert.description) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.params.market], () => {
              const marketInfo = selectMarket(alert.params.market);
              alert.description = marketInfo.description;
              const {
                orderType,
                amount,
                price,
                outcomeDescription
              } = getInfo(alert.params, marketInfo);
              alert.details = `${orderType}  ${formatShares(amount).formatted} of ${outcomeDescription} @ ${formatDai(price).formatted}`;
              alert.toast = true;

              return dispatch(callback(alert));
            })
          );
        }
        break;

      // Market
      case CONTRIBUTE:
        alert.title = "Market Disputed";
        if (!alert.description) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.params.market], () => {
              const marketInfo = selectMarket(alert.params.market);
              const outcome = calculatePayoutNumeratorsValue(
                marketInfo.maxPrice,
                marketInfo.minPrice,
                marketInfo.numTicks,
                marketInfo.marketType,
                alert.params.payoutNumerators
              );
              const outcomeDescription =
                outcome === null
                  ? "Market Is Invalid"
                  : getOutcomeName(marketInfo, { id: outcome }, false);
              alert.description = marketInfo.description;
              alert.details = `${
                formatRep(
                  createBigNumber(alert.params._amount).dividedBy(
                    TEN_TO_THE_EIGHTEENTH_POWER
                  )
                ).formatted
              } REP added to "${outcomeDescription}"`;
              return dispatch(callback(alert));
            })
          );
        }
        break;
      case DOINITIALREPORT:
        alert.title = "Market Reported";
        if (!alert.description) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.params.market], () => {
              const marketInfo = selectMarket(alert.params.market);
              const outcome = calculatePayoutNumeratorsValue(
                marketInfo.maxPrice,
                marketInfo.minPrice,
                marketInfo.numTicks,
                marketInfo.marketType,
                alert.params.payoutNumerators
              );
              const outcomeDescription =
                outcome === null
                  ? "Market Is Invalid"
                  : getOutcomeName(marketInfo, { id: outcome }, false);
              alert.description = marketInfo.description;
              alert.details = `Tentative winning outcome: "${outcomeDescription}"`;
              return dispatch(callback(alert));
            })
          );
        }
        break;

      // Trade
      case PUBLICTRADE:
      case PUBLICTRADEWITHLIMIT: {
        alert.title = "Order placed";
        if (!alert.description) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.params.market], () => {
              const marketInfo = selectMarket(alert.params.market);
              alert.description = marketInfo.description;
              const {
                orderType,
                amount,
                price,
                outcomeDescription
              } = getInfo(alert.params, marketInfo);
              alert.details = `${orderType}  ${formatShares(amount).formatted} of ${outcomeDescription} @ ${formatDai(price).formatted}`;
              alert.toast = true;

              return dispatch(callback(alert));
            })
          );
        }
        break;
      }

      // Universe
      case CREATEMARKET:
      case CREATECATEGORICALMARKET:
      case CREATESCALARMARKET:
      case CREATEYESNOMARKET:
        alert.title = "Market created";
        if (!alert.description) {
          alert.description = JSON.parse(alert.params.extraInfo).description;
        }
        break;

      // These transaction names are overloaded across multiple contracts
      case APPROVE:
        alert.title = "Dai approval";
        alert.description = "You are approved to use Dai on Augur"
        alert.details = `Transaction cost ${formatDai(alert.params._amount.toNumber()).formatted}`
        break;
      
      default: {
        const result = alert.params.type
          .replace(/([A-Z])/g, " $1")
          .toLowerCase();
        alert.title = result;
        break;
      }
    }

    if (alert.status === TXEventName.Failure) {
      alert.title = 'Failed transaction';
    }

    dispatch(callback(alert));
  };
}
