/**
 * @todo Make use of getOutcome in addTransactions.js
 * @todo Investigate why fill order tx gets stuck in Pending status
 * @todo Fix bug where createOrder outcome is wrong for categorical markets
 */

import store from "src/store";
import { augur } from "services/augurjs";
import { isEmpty } from "lodash/fp";
import { selectMarket } from "modules/market/selectors/market";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info-if-not-loaded";
import { TEN_TO_THE_EIGHTEENTH_POWER } from "modules/trade/constants/numbers";
import { BUY, SELL } from "modules/trade/constants/types";
import { formatEther, formatRep, formatShares } from "utils/format-number";
import { createBigNumber } from "utils/create-big-number";
import { getOutcome } from "modules/transactions/actions/add-transactions";

export default function setNotificationText(notification, callback) {
  const result = (dispatch, getState) => {
    if (!notification || isEmpty(notification)) {
      return callback(notification);
    }
    if (!callback) {
      throw new Error("Callback function is not set");
    }
    if (
      !notification.params ||
      (notification.title && notification.description)
    ) {
      return callback(notification);
    }

    switch (notification.params.type.toUpperCase()) {
      // Augur
      case "CREATEGENESISUNIVERSE":
        notification.title = "Create genesis universe";
        break;

      // CancelOrder
      case "CANCELORPHANEDORDER":
        notification.title = "Cancel orphaned order";
        if (!notification.description && notification.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([notification.log.marketId], () => {
              const marketInfo = selectMarket(notification.log.marketId);
              const outcomeDescription = getOutcome(
                marketInfo,
                notification.log.outcome
              );
              notification.description = `Canceled order for ${
                formatShares(notification.log.quantity).denomination
              } of "${outcomeDescription}" at ${
                formatEther(notification.log.price).formatted
              } ETH`;
              return callback(notification);
            })
          );
        }
        break;
      case "CANCELORDER": {
        notification.title = "Cancel order";
        if (!notification.description && notification.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([notification.log.marketId], () => {
              const marketInfo = selectMarket(notification.log.marketId);
              const outcomeDescription = getOutcome(
                marketInfo,
                notification.log.outcome
              );
              notification.description = `Canceled order for ${
                formatShares(notification.log.quantity).denomination
              } of "${outcomeDescription}" at ${
                formatEther(notification.log.price).formatted
              } ETH`;
              return callback(notification);
            })
          );
        }
        break;
      }

      // Cash
      case "WITHDRAWETHERTOIFPOSSIBLE":
        notification.title = "Withdraw ETH";
        break;

      // ClaimTradingProceeds
      case "CALCULATEREPORTINGFEE":
        notification.title = "Calculate reporting fee";
        break;
      case "CLAIMTRADINGPROCEEDS":
        notification.title = "Claim trading proceeds";
        break;

      // CompleteSets
      case "PUBLICBUYCOMPLETESETS":
      case "PUBLICBUYCOMPLETESETSWITHCASH":
        notification.title = "Buy complete set(s)";
        break;
      case "PUBLICSELLCOMPLETESETS":
      case "PUBLICSELLCOMPLETESETSWITHCASH":
        notification.title = "Sell complete set(s)";
        break;

      // CreateOrder
      case "PUBLICCREATEORDER": {
        notification.title = "Create order";
        if (!notification.description && notification.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([notification.params._market], () => {
              const marketInfo = selectMarket(notification.params._market);
              const outcomeDescription = getOutcome(
                marketInfo,
                notification.log.outcome
              );
              notification.description = `Created ${
                notification.log.orderType
              } order for ${
                formatShares(notification.log.quantity).formatted
              } ${
                formatShares(notification.log.quantity).denomination
              } of "${outcomeDescription}" at ${
                formatEther(notification.log.price).formatted
              } ETH`;
              return callback(notification);
            })
          );
        }
        break;
      }

      // FeeWindow & Universe
      case "BUY":
      case "BUYPARTICIPATIONTOKENS":
        notification.title = "Buy participation token(s)";
        if (!notification.description && notification.log) {
          notification.description = `Purchase ${
            formatRep(
              createBigNumber(notification.log.value).dividedBy(
                TEN_TO_THE_EIGHTEENTH_POWER
              )
            ).formatted
          } Participation Token${
            notification.log.value === TEN_TO_THE_EIGHTEENTH_POWER ? "" : "s"
          }`;
        }
        break;

      // FillOrder & Trade
      case "PUBLICFILLBESTORDER":
      case "PUBLICFILLBESTORDERWITHLIMIT":
      case "PUBLICFILLORDER":
        notification.title = "Fill order(s)";
        if (!notification.description && notification.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([notification.params._market], () => {
              const marketInfo = selectMarket(notification.params._market);
              const outcomeDescription = getOutcome(
                marketInfo,
                marketInfo.outcomes.find(
                  outcome =>
                    outcome.id ===
                    createBigNumber(notification.params._outcome).toFixed()
                ).name
              );

              notification.description = `Filled ${
                notification.log.orderType
              } order(s) for ${
                formatShares(notification.log.amount || 0).formatted
              } ${
                formatShares(notification.log.amount || 0).denomination
              } of "${outcomeDescription}" at ${
                formatEther(notification.log.price).formatted
              } ETH`;

              if (notification.log.noFill) {
                notification.description = `Unable to ${
                  notification.log.orderType
                } Shares of ${outcomeDescription} at ${augur.utils.convertOnChainPriceToDisplayPrice(
                  createBigNumber(notification.params._price),
                  createBigNumber(marketInfo.minPrice),
                  marketInfo.numTicks
                )} ETH.`;
              }

              return callback(notification);
            })
          );
        }
        break;

      // InitialReporter
      case "MIGRATEREP":
        notification.title = "Migrate REP";
        break;

      // Mailbox
      case "WITHDRAWETHER":
        notification.title = "Withdraw ETH from mailbox";
        break;
      case "WITHDRAWTOKENS":
        notification.title = "Withdraw tokens from mailbox";
        break;

      // Market
      case "CONTRIBUTE":
        notification.title = "Contribute REP to crowdsourcer";
        if (!notification.description && notification.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([notification.to], () => {
              // TODO: Set outcome description
              // const marketInfo = selectMarket(notification.to);
              // const outcomeDescription = notification.params._invalid
              //   ? "Invalid"
              //   : getOutcome(marketInfo, notification.log.outcome);
              notification.description = `Place ${
                formatRep(
                  createBigNumber(notification.params._amount).dividedBy(
                    TEN_TO_THE_EIGHTEENTH_POWER
                  )
                ).formatted
              } REP on a dispute bond`;
              return callback(notification);
            })
          );
        }
        break;
      case "DISAVOWCROWDSOURCERS":
        notification.title = "Make staked REP available for claiming";
        break;
      case "DOINITIALREPORT":
        notification.title = "Submit report";
        if (!notification.description && notification.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([notification.to], () => {
              const marketDescription = selectMarket(notification.to)
                .description;
              notification.description = `Submitted Report on "${marketDescription}"`;
              return callback(notification);
            })
          );
        }
        break;
      case "FINALIZE":
        notification.title = "Finalize market";
        // TODO: Test
        // if (!notification.description && notification.log) {
        //   dispatch(
        //     loadMarketsInfoIfNotLoaded([notification.to], () => {
        //       const marketDescription = selectMarket(notification.to)
        //         .description;
        //       notification.description =
        //         'Finalize market "' + marketDescription + '"';
        //       return callback(notification);
        //     })
        //   );
        // }
        break;
      case "FINALIZEFORK":
        notification.title = "Finalize forked market";
        break;
      case "MIGRATETHROUGHONEFORK":
        notification.title = "Migrate market to winning child universe";
        break;

      // ReputationToken
      case "MIGRATEBALANCESFROMLEGACYREP":
        notification.title = "Migrate balances from legacy REP contract";
        break;
      case "MIGRATEALLOWANCESFROMLEGACYREP":
        notification.title = "Migrate allowances from legacy REP contract";
        break;
      case "MIGRATEIN":
        notification.title = "Migrate REP into universe";
        break;
      case "MIGRATEOUT":
      case "MIGRATEOUTBYPAYOUT":
        notification.title = "Migrate REP out of universe";
        break;
      case "UPDATEPARENTTOTALTHEORETICALSUPPLY":
        notification.title =
          "Update theoretical REP supply for parent universe";
        break;
      case "UPDATESIBLINGMIGRATIONTOTAL":
        notification.title =
          "Update theoretical REP supply for sibling universe";
        break;

      // Trade
      case "PUBLICBUY":
      case "PUBLICBUYWITHLIMIT":
        notification.title = "Buy share(s)";
        break;
      case "PUBLICSELL":
      case "PUBLICSELLWITHLIMIT":
        notification.title = "Sell share(s)";
        break;
      case "PUBLICTRADE":
      case "PUBLICTRADEWITHLIMIT": {
        notification.title = "Place trade";
        if (!notification.description && notification.log) {
          dispatch(
            loadMarketsInfoIfNotLoaded([notification.params._market], () => {
              const marketInfo = selectMarket(notification.params._market);
              const orderType =
                notification.params._direction === "0x0" ? BUY : SELL;
              const outcomeDescription = getOutcome(
                marketInfo,
                notification.log.outcome
              );
              notification.description = `Place ${orderType} order for ${
                formatShares(notification.log.amount).formatted
              } ${
                formatShares(notification.log.amount).denomination
              } of "${outcomeDescription}" at ${
                formatEther(notification.log.price).formatted
              } ETH`;
              return callback(notification);
            })
          );
        }
        break;
      }

      // TestNetReputationToken
      case "FAUCET":
        notification.title = "Get REP from faucet";
        break;

      // TradingEscapeHatch
      case "CLAIMSHARESINUPDATE":
        notification.title = "Claim share(s) from market";
        break;
      case "GETFROZENSHAREVALUEINMARKET":
        notification.title = "Liquidate share(s) in market to ETH";
        break;

      // Universe
      case "CREATEMARKET":
      case "CREATECATEGORICALMARKET":
      case "CREATESCALARMARKET":
      case "CREATEYESNOMARKET":
        notification.title = "Create new market";
        if (!notification.description && notification.log) {
          notification.description = notification.params._description;
        }
        break;
      case "CREATECHILDUNIVERSE":
        notification.title = "Create child universe";
        break;
      case "FORK":
        notification.title = "Initiate fork";
        break;
      case "REDEEMSTAKE":
        notification.title = "Claim staked REP/Ether";
        break;
      case "GETINITIALREPORTSTAKESIZE":
        notification.title = "Get initial report stake size";
        break;
      case "GETORCACHEDESIGNATEDREPORTNOSHOWBOND":
        notification.title = "Get no-show bond size for markets";
        break;
      case "GETORCACHEDESIGNATEDREPORTSTAKE":
        notification.title = "Get stake size required for desginated reports";
        break;
      case "GETORCACHEMARKETCREATIONCOST":
        notification.title = "Get market creation cost";
        break;
      case "GETORCACHEREPORTINGFEEDIVISOR":
        notification.title = "Get reporting fee divisor";
        break;
      case "GETORCACHEVALIDITYBOND":
        notification.title =
          "Get validity bond size required for market creation";
        break;
      case "GETORCREATECURRENTFEEWINDOW":
        notification.title = "Get/create current fee window address";
        break;
      case "GETORCREATEFEEWINDOWBYTIMESTAMP":
        notification.title = "Get/create fee window by timestamp";
        break;
      case "GETORCREATENEXTFEEWINDOW":
        notification.title = "Get/create next fee window";
        break;
      case "GETORCREATEPREVIOUSFEEWINDOW":
        notification.title = "Get/create previous fee window";
        break;
      case "UPDATEFORKVALUES":
        notification.title = "Update fork values";
        break;

      // These transaction names are overloaded across multiple contracts
      case "APPROVE":
        notification.title = "Approve spending";
        break;
      case "DECREASEAPPROVAL":
        notification.title = "Decrease spending approval";
        break;
      case "DEPOSITETHER":
      case "DEPOSITETHERFOR":
        notification.title = "Deposit ETH";
        break;
      case "FORKANDREDEEM":
      case "REDEEM":
      case "REDEEMFORREPORTINGPARTICIPANT":
        notification.title = "Claim funds";
        break;
      case "INCREASEAPPROVAL":
        notification.title = "Increase spending approval";
        break;
      case "MIGRATE":
        notification.title = "Migrate funds";
        break;
      case "TRANSFER":
      case "TRANSFERFROM":
      case "TRANSFEROWNERSHIP":
        break;
      case "WITHDRAWETHERTO":
        notification.title = "Withdraw ETH";
        break;
      case "WITHDRAWINEMERGENCY":
        notification.title = "Withdraw funds";
        break;

      // augur.js functions
      case "SENDETHER":
        notification.title = "Send ETH";
        if (!notification.description && notification.params) {
          notification.description = `Send ${
            formatEther(notification.params.etherToSend).formatted
          } ETH to ${notification.params.to}`;
        }
        break;
      case "SENDREPUTATION":
        notification.title = "Send REP";
        if (!notification.description && notification.params) {
          notification.description = `Send ${
            formatRep(notification.params.reputationToSend).formatted
          } REP to ${notification.params._to}`;
        }
        break;

      default: {
        const result = notification.params.type.replace(/([A-Z])/g, " $1");
        notification.title = result;
        break;
      }
    }
    dispatch(callback(notification));
  };
  return result(store.dispatch, store.getState);
}
