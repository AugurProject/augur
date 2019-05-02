/**
 * @todo Update text for FINALIZE once alert triggering is moved
 */
import { augur } from "services/augurjs";
import { isEmpty } from "lodash/fp";
import { selectMarket } from "modules/markets/selectors/market";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { getOutcomeName } from "utils/get-outcome";
import { formatEther, formatRep, formatShares } from "utils/format-number";
import calculatePayoutNumeratorsValue from "utils/calculate-payout-numerators-value";
import { createBigNumber } from "utils/create-big-number";
import {
  BUY,
  SELL,
  TEN_TO_THE_EIGHTEENTH_POWER,
  CREATEGENESISUNIVERSE,
  CANCELORPHANEDORDER,
  CANCELORDER,
  WITHDRAWETHERTOIFPOSSIBLE,
  CALCULATEREPORTINGFEE,
  CLAIMTRADINGPROCEEDS,
  PUBLICBUYCOMPLETESETS,
  PUBLICBUYCOMPLETESETSWITHCASH,
  PUBLICSELLCOMPLETESETS,
  PUBLICSELLCOMPLETESETSWITHCASH,
  PUBLICCREATEORDER,
  BUYPARTICIPATIONTOKENS,
  PUBLICFILLBESTORDER,
  PUBLICFILLBESTORDERWITHLIMIT,
  PUBLICFILLORDER,
  MIGRATEREP,
  WITHDRAWETHER,
  WITHDRAWTOKENS,
  CONTRIBUTE,
  DISAVOWCROWDSOURCERS,
  DOINITIALREPORT,
  FINALIZE,
  FINALIZEFORK,
  MIGRATETHROUGHONEFORK,
  MIGRATEBALANCESFROMLEGACYREP,
  MIGRATEALLOWANCESFROMLEGACYREP,
  MIGRATEIN,
  MIGRATEOUT,
  MIGRATEOUTBYPAYOUT,
  UPDATEPARENTTOTALTHEORETICALSUPPLY,
  UPDATESIBLINGMIGRATIONTOTAL,
  PUBLICBUY,
  PUBLICBUYWITHLIMIT,
  PUBLICSELL,
  PUBLICSELLWITHLIMIT,
  PUBLICTRADE,
  PUBLICTRADEWITHLIMIT,
  FAUCET,
  CLAIMSHARESINUPDATE,
  GETFROZENSHAREVALUEINMARKET,
  CREATEMARKET,
  CREATECATEGORICALMARKET,
  CREATESCALARMARKET,
  CREATEYESNOMARKET,
  CREATECHILDUNIVERSE,
  FORK,
  REDEEMSTAKE,
  GETINITIALREPORTSTAKESIZE,
  GETORCACHEDESIGNATEDREPORTNOSHOWBOND,
  GETORCACHEDESIGNATEDREPORTSTAKE,
  GETORCACHEMARKETCREATIONCOST,
  GETORCACHEREPORTINGFEEDIVISOR,
  GETORCACHEVALIDITYBOND,
  GETORCREATECURRENTFEEWINDOW,
  GETORCREATEFEEWINDOWBYTIMESTAMP,
  GETORCREATENEXTFEEWINDOW,
  GETORCREATEPREVIOUSFEEWINDOW,
  UPDATEFORKVALUES,
  APPROVE,
  DECREASEAPPROVAL,
  DEPOSITETHER,
  DEPOSITETHERFOR,
  FORKANDREDEEM,
  REDEEMFORREPORTINGPARTICIPANT,
  REDEEM,
  INCREASEAPPROVAL,
  MIGRATE,
  TRANSFER,
  TRANSFERFROM,
  TRANSFEROWNERSHIP,
  WITHDRAWETHERTO,
  WITHDRAWINEMERGENCY,
  SENDETHER,
  SENDREPUTATION
} from "modules/common-elements/constants";

export default function setAlertText(alert, callback) {
  return (dispatch, getState) => {
    if (!alert || isEmpty(alert)) {
      return dispatch(callback(alert));
    }
    if (!callback) {
      throw new Error("Callback function is not set");
    }

    if (!alert.params || (alert.title && alert.description)) {
      return dispatch(callback(alert));
    }

    switch (alert.params.type.toUpperCase()) {
      // Augur
      case CREATEGENESISUNIVERSE:
        alert.title = "Create genesis universe";
        break;

      // CancelOrder
      case CANCELORPHANEDORDER:
        alert.title = "Cancel orphaned order";
        if (!alert.description && alert.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.log.marketId], () => {
              const marketInfo = selectMarket(alert.log.marketId);
              const outcomeDescription = getOutcomeName(
                marketInfo,
                alert.log.outcome
              );
              alert.description = `Cancel orphaned order for ${formatShares(
                alert.log.quantity
              ).denomination.toLowerCase()} of "${outcomeDescription}" at ${
                formatEther(alert.log.price).formatted
              } ETH`;
              return dispatch(callback(alert));
            })
          );
        }
        break;
      case CANCELORDER: {
        alert.title = "Cancel order";
        if (!alert.description && alert.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.log.marketId], () => {
              const marketInfo = selectMarket(alert.log.marketId);
              const outcomeDescription = getOutcomeName(
                marketInfo,
                alert.log.outcome
              );
              alert.description = `Cancel order for ${formatShares(
                alert.log.quantity
              ).denomination.toLowerCase()} of "${outcomeDescription}" at ${
                formatEther(alert.log.price).formatted
              } ETH`;
              return dispatch(callback(alert));
            })
          );
        }
        break;
      }

      // Cash
      case WITHDRAWETHERTOIFPOSSIBLE:
        alert.title = "Withdraw ETH";
        break;

      // ClaimTradingProceeds
      case CALCULATEREPORTINGFEE:
        alert.title = "Calculate reporting fee";
        break;
      case CLAIMTRADINGPROCEEDS:
        alert.title = "Claim trading proceeds";
        break;

      // CompleteSets
      case PUBLICBUYCOMPLETESETS:
      case PUBLICBUYCOMPLETESETSWITHCASH:
        alert.title = "Buy complete set(s)";
        break;
      case PUBLICSELLCOMPLETESETS:
      case PUBLICSELLCOMPLETESETSWITHCASH:
        alert.title = "Sell complete set(s)";
        break;

      // CreateOrder
      case PUBLICCREATEORDER: {
        alert.title = "Create order";
        if (!alert.description && alert.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.params._market], () => {
              const marketInfo = selectMarket(alert.params._market);
              const outcomeDescription = getOutcomeName(
                marketInfo,
                alert.log.outcome
              );
              alert.description = `Create ${alert.log.orderType} order for ${
                formatShares(alert.log.amount).formatted
              } ${
                formatShares(alert.log.amount).denomination
              } of "${outcomeDescription}" at ${
                formatEther(alert.log.price).formatted
              } ETH`;
              return dispatch(callback(alert));
            })
          );
        }
        break;
      }

      // FeeWindow & Universe
      case "BUY":
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
        alert.title = "Place trade";
        if (!alert.description && alert.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.params._market], () => {
              const marketInfo = selectMarket(alert.params._market);
              const outcomeDescription = getOutcomeName(
                marketInfo,
                marketInfo.outcomes.find(
                  outcome =>
                    outcome.id ===
                    createBigNumber(alert.params._outcome).toFixed()
                ).name
              );

              alert.description = `Fill ${
                alert.log.orderType === BUY ? "selling" : "buying"
              } ${formatShares(alert.log.amount || 0).formatted} ${
                formatShares(alert.log.amount || 0).denomination
              } of "${outcomeDescription}" at ${
                formatEther(alert.log.price).formatted
              } ETH`;

              if (alert.log.noFill) {
                alert.description = `Unable to ${
                  alert.log.orderType === BUY ? "sell" : "buy"
                } ${alert.log.difference || ""} ${
                  formatShares(alert.log.difference || 10).denomination
                } of "${outcomeDescription}" at ${augur.utils.convertOnChainPriceToDisplayPrice(
                  createBigNumber(alert.params._price),
                  createBigNumber(marketInfo.minPrice),
                  marketInfo.tickSize
                )} ETH.`;
              }
              return dispatch(callback(alert));
            })
          );
        }
        break;

      // InitialReporter
      case MIGRATEREP:
        alert.title = "Migrate REP";
        break;

      // Mailbox
      case WITHDRAWETHER:
        alert.title = "Withdraw ETH";
        break;
      case WITHDRAWTOKENS:
        alert.title = "Withdraw tokens";
        break;

      // Market
      case CONTRIBUTE:
        alert.title = "Contribute to Dispute Bond";
        if (!alert.description) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.to], () => {
              const marketInfo = selectMarket(alert.to);
              const outcome = calculatePayoutNumeratorsValue(
                marketInfo,
                alert.params._payoutNumerators,
                alert.params._invalid
              );
              const outcomeDescription =
                outcome === null
                  ? "Market Is Invalid"
                  : getOutcomeName(marketInfo, outcome, false);
              alert.description = `Place ${
                formatRep(
                  createBigNumber(alert.params._amount).dividedBy(
                    TEN_TO_THE_EIGHTEENTH_POWER
                  )
                ).formatted
              } REP on "${outcomeDescription}"`;
              return dispatch(callback(alert));
            })
          );
        }
        break;
      case DISAVOWCROWDSOURCERS:
        alert.title = "Make staked REP available for claiming";
        break;
      case DOINITIALREPORT:
        alert.title = "Submit report";
        if (!alert.description) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.to], () => {
              const marketInfo = selectMarket(alert.to);
              const outcome = calculatePayoutNumeratorsValue(
                marketInfo,
                alert.params._payoutNumerators,
                alert.params._invalid
              );
              const outcomeDescription =
                outcome === null
                  ? "Market Is Invalid"
                  : getOutcomeName(marketInfo, outcome, false);
              alert.description = `Report "${outcomeDescription}" on "${
                marketInfo.description
              }"`;
              return dispatch(callback(alert));
            })
          );
        }
        break;
      case FINALIZE:
        // Market finalization alerts should only be displayed if
        // the market creator is the same as the account that's logged in
        alert.title = "Finalize market";
        if (!alert.description && alert.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.log.market], () => {
              const marketDescription = selectMarket(alert.log.market)
                .description;
              alert.description = 'Finalize market "' + marketDescription + '"';
              return dispatch(callback(alert));
            })
          );
        }
        break;
      case FINALIZEFORK:
        alert.title = "Finalize forked market";
        break;
      case MIGRATETHROUGHONEFORK:
        alert.title = "Migrate market to winning child universe";
        break;

      // ReputationToken
      case MIGRATEBALANCESFROMLEGACYREP:
        alert.title = "Migrate balances from legacy REP contract";
        break;
      case MIGRATEALLOWANCESFROMLEGACYREP:
        alert.title = "Migrate allowances from legacy REP contract";
        break;
      case MIGRATEIN:
        alert.title = "Migrate REP into universe";
        break;
      case MIGRATEOUT:
        alert.title = "Migrate REP out of universe";
        break;
      case MIGRATEOUTBYPAYOUT:
        alert.title = "Migrate REP out of universe";
        if (!alert.description && alert.log) {
          const forkingMarketId = getState().universe.forkingMarket;
          dispatch(
            loadMarketsInfoIfNotLoaded([forkingMarketId], () => {
              const marketInfo = selectMarket(forkingMarketId);
              const outcome = calculatePayoutNumeratorsValue(
                marketInfo,
                alert.params._payoutNumerators,
                alert.params._invalid
              );
              const outcomeDescription = getOutcomeName(
                marketInfo,
                outcome,
                false
              );
              alert.description = `Migrate ${
                formatRep(
                  createBigNumber(alert.log.value).dividedBy(
                    TEN_TO_THE_EIGHTEENTH_POWER
                  )
                ).formatted
              } REP to child universe "${outcomeDescription}"`;
              return dispatch(callback(alert));
            })
          );
        }
        break;
      case UPDATEPARENTTOTALTHEORETICALSUPPLY:
        alert.title = "Update theoretical REP supply for parent universe";
        break;
      case UPDATESIBLINGMIGRATIONTOTAL:
        alert.title = "Update theoretical REP supply for sibling universe";
        break;

      // Trade
      case PUBLICBUY:
      case PUBLICBUYWITHLIMIT:
        alert.title = "Buy share(s)";
        break;
      case PUBLICSELL:
      case PUBLICSELLWITHLIMIT:
        alert.title = "Sell share(s)";
        break;
      case PUBLICTRADE:
      case PUBLICTRADEWITHLIMIT: {
        alert.title = "Place trade";
        if (!alert.description && alert.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([alert.params._market], () => {
              const marketInfo = selectMarket(alert.params._market);
              const orderType = alert.params._direction === "0x0" ? BUY : SELL;
              const outcome =
                alert.log.outcome !== undefined &&
                marketInfo.outcomes.find(
                  o => o.id === alert.log.outcome.toString()
                );
              const outcomeDescription = getOutcomeName(marketInfo, outcome);
              alert.description = `Place ${orderType} order for ${
                formatShares(alert.amount || alert.log.amount).formatted
              } ${formatShares(
                alert.log.amount
              ).denomination.toLowerCase()} of "${outcomeDescription}" at ${
                formatEther(alert.log.price).formatted
              } ETH`;
              return dispatch(callback(alert));
            })
          );
        }
        break;
      }

      // TestNetReputationToken
      case FAUCET:
        alert.title = "Get REP from faucet";
        break;

      // TradingEscapeHatch
      case CLAIMSHARESINUPDATE:
        alert.title = "Claim share(s) from market";
        break;
      case GETFROZENSHAREVALUEINMARKET:
        alert.title = "Liquidate share(s) in market to ETH";
        break;

      // Universe
      case CREATEMARKET:
      case CREATECATEGORICALMARKET:
      case CREATESCALARMARKET:
      case CREATEYESNOMARKET:
        alert.title = "Create new market";
        if (!alert.description) {
          alert.description = `Create market "${alert.params._description}"`;
        }
        break;
      case CREATECHILDUNIVERSE:
        alert.title = "Create child universe";
        break;
      case FORK:
        alert.title = "Initiate fork";
        break;
      case REDEEMSTAKE:
        alert.title = "Claim staked REP/Ether";
        break;
      case GETINITIALREPORTSTAKESIZE:
        alert.title = "Get initial report stake size";
        break;
      case GETORCACHEDESIGNATEDREPORTNOSHOWBOND:
        alert.title = "Get no-show bond size for markets";
        break;
      case GETORCACHEDESIGNATEDREPORTSTAKE:
        alert.title = "Get stake size required for desginated reports";
        break;
      case GETORCACHEMARKETCREATIONCOST:
        alert.title = "Get market creation cost";
        break;
      case GETORCACHEREPORTINGFEEDIVISOR:
        alert.title = "Get reporting fee divisor";
        break;
      case GETORCACHEVALIDITYBOND:
        alert.title = "Get validity bond size required for market creation";
        break;
      case GETORCREATECURRENTFEEWINDOW:
        alert.title = "Get/create current fee window address";
        break;
      case GETORCREATEFEEWINDOWBYTIMESTAMP:
        alert.title = "Get/create fee window by timestamp";
        break;
      case GETORCREATENEXTFEEWINDOW:
        alert.title = "Get/create next fee window";
        break;
      case GETORCREATEPREVIOUSFEEWINDOW:
        alert.title = "Get/create previous fee window";
        break;
      case UPDATEFORKVALUES:
        alert.title = "Update fork values";
        break;

      // These transaction names are overloaded across multiple contracts
      case APPROVE:
        alert.title = "Approve spending";
        break;
      case DECREASEAPPROVAL:
        alert.title = "Decrease spending approval";
        break;
      case DEPOSITETHER:
      case DEPOSITETHERFOR:
        alert.title = "Deposit ETH";
        break;
      case FORKANDREDEEM:
      case REDEEMFORREPORTINGPARTICIPANT:
        alert.title = "Redeem funds";
        break;
      case REDEEM:
        alert.title = "Redeem funds";
        if (!alert.description && alert.log) {
          alert.description = `Claim ${
            formatRep(
              createBigNumber(alert.log.value).dividedBy(
                TEN_TO_THE_EIGHTEENTH_POWER
              )
            ).formatted
          } REP`;
        }
        break;
      case INCREASEAPPROVAL:
        alert.title = "Increase spending approval";
        break;
      case MIGRATE:
        alert.title = "Migrate funds";
        break;
      case TRANSFER:
      case TRANSFERFROM:
      case TRANSFEROWNERSHIP:
        // Ignore this case for now, since it seems redundant with some other alerts
        break;
      case WITHDRAWETHERTO:
        alert.title = "Withdraw ETH";
        break;
      case WITHDRAWINEMERGENCY:
        alert.title = "Withdraw funds";
        break;

      // augur.js functions
      case SENDETHER:
        alert.title = "Send ETH";
        if (!alert.description && alert.params) {
          alert.description = `Send ${
            formatEther(alert.params.etherToSend).formatted
          } ETH to ${alert.params.to}`;
        }
        break;
      case SENDREPUTATION:
        alert.title = "Send REP";
        if (!alert.description && alert.params) {
          alert.description = `Send ${
            formatRep(alert.params.reputationToSend).formatted
          } REP to ${alert.params._to}`;
        }
        break;

      default: {
        const result = alert.params.type
          .replace(/([A-Z])/g, " $1")
          .toLowerCase();
        alert.title = result;
        break;
      }
    }

    dispatch(callback(alert));
  };
}
