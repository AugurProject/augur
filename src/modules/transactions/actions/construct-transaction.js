import { abi, augur, constants } from 'services/augurjs';
import { ZERO } from 'modules/trade/constants/numbers';
import { BINARY, SCALAR } from 'modules/markets/constants/market-types';
import * as TYPES from 'modules/transactions/constants/types';
import { formatEtherTokens, formatPercent, formatEther, formatRep, formatShares } from 'utils/format-number';
import { formatDate } from 'utils/format-date';
import { selectMarketLink } from 'modules/link/selectors/links';
import { formatReportedOutcome } from 'modules/reports/selectors/reportable-outcomes';
import { loadMarketThenRetryConversion, lookupEventMarketsThenRetryConversion } from 'modules/transactions/actions/retry-conversion';
import { selectMarketIDFromEventID } from 'modules/market/selectors/market';
import { updateEventsWithAccountReportData } from 'modules/my-reports/actions/update-events-with-account-report-data';

export function loadDataForMarketTransaction(label, log, isRetry, callback) {
  return (dispatch, getState) => {
    const marketID = log.marketID || log.market;
    const market = getState().marketsData[marketID];
    if (!market || !market.description) {
      if (isRetry) return callback(log);
      return dispatch(loadMarketThenRetryConversion(marketID, label, log, callback));
    }
    return market;
  };
}

export function loadDataForReportingTransaction(label, log, isRetry, callback) {
  return (dispatch, getState) => {
    const { marketsData, outcomesData } = getState();
    const eventID = log.event || log.eventID;
    const marketID = selectMarketIDFromEventID(eventID);
    if (!marketID) {
      if (isRetry) return callback(log);
      return dispatch(lookupEventMarketsThenRetryConversion(eventID, label, log, callback));
    }
    const market = marketsData[marketID];
    if (!market || !market.description) {
      if (isRetry) return callback(log);
      return dispatch(loadMarketThenRetryConversion(marketID, label, log, callback));
    }
    return { marketID, market, outcomes: outcomesData[marketID] };
  };
}

export const constructBasicTransaction = (hash, status, blockNumber, timestamp, gasFees) => (dispatch, getState) => {
  const transaction = { hash, status };
  if (blockNumber) transaction.blockNumber = blockNumber;
  if (timestamp) transaction.timestamp = formatDate(new Date(timestamp * 1000));
  if (gasFees) transaction.gasFees = formatEther(gasFees);
  return transaction;
};

export function constructDefaultTransaction(label, log) {
  const transaction = { data: {} };
  transaction.type = label;
  transaction.message = log.message;
  transaction.description = log.description || JSON.stringify(log);
  return transaction;
}

export function constructApprovalTransaction(log) {
  const transaction = { data: {} };
  transaction.type = 'Approved to Send Reputation';
  transaction.description = `Approve ${log._spender} to send Reputation`;
  transaction.message = log.inProgress ? 'approving' : 'approved';
  return transaction;
}

// export function constructCollectedFeesTransaction(log) {
//   const transaction = { data: {} };
//   const repGain = abi.bignum(log.repGain);
//   const initialRepBalance = log.initialRepBalance !== undefined ? log.initialRepBalance : abi.bignum(log.newRepBalance).minus(repGain).toFixed();
//   const action = log.inProgress ? 'reporting' : 'reported';
//   transaction.message = `${action} with ${formatRep(initialRepBalance).full}`;
//   transaction.type = `Reporting Payment`;
//   if (log.totalReportingRep) {
//     const totalReportingRep = abi.bignum(log.totalReportingRep);
//     if (!totalReportingRep.eq(constants.ZERO)) {
//       const percentRep = formatPercent(abi.bignum(initialRepBalance).dividedBy(totalReportingRep).times(100), { decimals: 0 });
//       transaction.message = `${transaction.message} (${percentRep.full})`;
//     }
//   }
//   transaction.description = `Reporting cycle #${log.period}`;
//   if (log.cashFeesCollected !== undefined && log.repGain !== undefined) {
//     transaction.data.balances = [{
//       change: formatEtherTokens(log.cashFeesCollected, { positiveSign: true }),
//       balance: formatEtherTokens(log.newCashBalance)
//     }, {
//       change: formatRep(log.repGain, { positiveSign: true }),
//       balance: formatRep(log.newRepBalance)
//     }];
//   }
//   transaction.bond = { label: 'reporting', value: formatEther(log.notReportingBond) };
//   return transaction;
// }

export function constructRegistrationTransaction(log) {
  const transaction = { data: {} };
  transaction.type = 'Register New Account';
  transaction.description = `Register account ${log.sender.replace('0x', '')}`;
  const action = log.inProgress ? 'saving' : 'saved';
  transaction.message = `${action} registration timestamp`;
  return transaction;
}

// export function constructPenalizationCaughtUpTransaction(log) {
//   const transaction = { data: {} };
//   transaction.type = 'Reporting Cycle Catch-Up';
//   transaction.description = `Missed Reporting cycles ${log.penalizedFrom} to cycle ${log.penalizedUpTo}`;
//   // TODO link to this cycle in My Reports
//   if (log.repLost && log.newRepBalance) {
//     transaction.data.balances = [{
//       change: formatRep(log.repLost, { positiveSign: true }),
//       balance: formatRep(log.newRepBalance)
//     }];
//   }
//   const action = log.inProgress ? 'catching up' : 'caught up';
//   transaction.message = `${action} ${parseInt(log.penalizedUpTo, 10) - parseInt(log.penalizedFrom, 10)} cycles`;
//   return transaction;
// }

export function constructSentEtherTransaction(log, address) {
  const transaction = { data: {} };
  let action;
  if (log._from === address) {
    transaction.type = 'Send Ether';
    transaction.description = `Send Ether to ${abi.strip_0x(log._to)}`;
    transaction.data.balances = [{
      change: formatEther(abi.bignum(log._value).neg(), { positiveSign: true })
    }];
    action = log.inProgress ? 'sending' : 'sent';
  }
  transaction.message = `${action} ETH`;
  return transaction;
}

// export function constructSentCashTransaction(log, address) {
//   const transaction = { data: {} };
//   let action;
//   if (log._from === address) {
//     transaction.type = 'Send Ether Tokens';
//     transaction.description = `Send Ether Tokens to ${abi.strip_0x(log._to)}`;
//     transaction.data.balances = [{
//       change: formatEtherTokens(abi.bignum(log._value).neg(), { positiveSign: true })
//     }];
//     action = log.inProgress ? 'sending' : 'sent';
//   } else if (log._to === address) {
//     transaction.type = 'Receive Ether Tokens';
//     transaction.description = `Receive Ether Tokens from ${abi.strip_0x(log._from)}`;
//     transaction.data.balances = [{
//       change: formatEtherTokens(log._value, { positiveSign: true })
//     }];
//     action = log.inProgress ? 'receiving' : 'received';
//   }
//   transaction.message = `${action} ETH Tokens`;
//   return transaction;
// }

export function constructTransferTransaction(log, address) {
  const transaction = { data: {} };
  let action;
  if (log._from === address) {
    transaction.type = 'Send Reputation';
    transaction.description = `Send Reputation to ${abi.strip_0x(log._to)}`;
    transaction.data.balances = [{
      change: formatRep(abi.bignum(log._value).neg(), { positiveSign: true })
    }];
    action = log.inProgress ? 'sending' : 'sent';
  } else if (log._to === address) {
    transaction.type = 'Receive Reputation';
    transaction.description = `Receive Reputation from ${abi.strip_0x(log._from)}`;
    transaction.data.balances = [{
      change: formatRep(log._value, { positiveSign: true })
    }];
    action = log.inProgress ? 'receiving' : 'received';
  }
  transaction.message = `${action} REP`;
  return transaction;
}

export function constructMarketCreatedTransaction(log, description, dispatch) {
  const transaction = { data: {} };
  transaction.type = TYPES.CREATE_MARKET;
  transaction.description = description.split('~|>')[0];
  transaction.marketCreationFee = formatEtherTokens(log.marketCreationFee);
  transaction.data.marketLink = selectMarketLink({ id: log.marketID, description: transaction.description }, dispatch);
  transaction.data.marketID = log.marketID ? log.marketID : null;
  transaction.bond = { label: 'event validity', value: formatEtherTokens(log.eventBond) };
  const action = log.inProgress ? 'creating' : 'created';
  transaction.message = `${action} market`;
  return transaction;
}

export function constructPayoutTransaction(log, market, dispatch) {
  const transaction = { data: {} };
  transaction.type = 'Claim Trading Payout';
  console.log('payout:', log, market);
  transaction.description = market.description;
  if (log.cashPayout) {
    transaction.data.balances = [{
      change: formatEtherTokens(log.cashPayout, { positiveSign: true }),
      balance: formatEtherTokens(log.cashBalance)
    }];
  }
  transaction.data.shares = log.shares;
  transaction.data.marketLink = selectMarketLink({ id: log.market, description: market.description }, dispatch);
  transaction.data.marketID = log.market ? log.market : null;
  const action = log.inProgress ? 'closing out' : 'closed out';
  transaction.message = `${action} ${formatShares(log.shares).full}`;
  return transaction;
}

// export function constructTradingFeeUpdatedTransaction(log, market, dispatch) {
//   const transaction = { data: {} };
//   transaction.description = market.description;
//   transaction.data.marketLink = selectMarketLink({ id: log.marketID, description: market.description }, dispatch);
//   transaction.data.marketID = log.marketID ? log.marketID : null;
//   transaction.message = `updated trading fee: ${formatPercent(abi.bignum(log.tradingFee).times(100)).full}`;
//   return transaction;
// }

// export function constructPenalizeTransaction(log, marketID, market, outcomes, dispatch) {
//   const transaction = { data: {} };
//   transaction.type = 'Compare Report To Consensus';
//   const formattedReport = formatReportedOutcome(log.reportValue, market.minValue, market.maxValue, market.type, outcomes);
//   const formattedOutcome = formatReportedOutcome(log.outcome, market.minValue, market.maxValue, market.type, outcomes);
//   console.log('formattedReport:', formattedReport);
//   console.log('formattedOutcome:', formattedOutcome);
//   transaction.description = market.description;
//   transaction.data.marketLink = selectMarketLink({ id: marketID, description: market.description }, dispatch);
//   transaction.data.marketID = marketID || null;
//   if (log.repchange) {
//     let repPenalty;
//     let repBalance;
//     const repChange = abi.bignum(log.repchange);
//     if (repChange.lt(constants.ZERO)) {
//       repPenalty = repChange;
//       repBalance = abi.bignum(log.oldrep).plus(abi.bignum(log.repchange)).toFixed();
//     } else {
//       repPenalty = constants.ZERO;
//       repBalance = log.oldrep;
//     }
//     transaction.data.balances = [{
//       change: formatRep(repPenalty, { positiveSign: true }),
//       balance: formatRep(repBalance)
//     }];
//     if (!log.inProgress) {
//       dispatch(updateEventsWithAccountReportData({
//         [market.eventID]: {
//           repEarned: repPenalty,
//           repBalance
//         }
//       }));
//     }
//   }
//   if (log.inProgress) {
//     transaction.message = 'comparing report to consensus';
//   } else if (log.reportValue === log.outcome) {
//     transaction.message = `✔ report ${formattedReport} matches consensus`;
//   } else {
//     transaction.message = `✘ report ${formattedReport} does not match consensus ${formattedOutcome}`;
//   }
//   if (!log.inProgress) {
//     dispatch(updateEventsWithAccountReportData({
//       [market.eventID]: {
//         marketOutcome: formattedOutcome,
//         proportionCorrect: market.proportionCorrect,
//         isIndeterminate: market.isIndeterminate,
//         isChallenged: false,
//         isChallengeable: false
//       }
//     }));
//   }
//   return transaction;
// }

// export function constructSubmittedReportHashTransaction(log, marketID, market, outcomes, decryptionKey, dispatch) {
//   const transaction = { data: {} };
//   transaction.type = TYPES.COMMIT_REPORT;
//   transaction.description = market.description;
//   transaction.data.marketLink = selectMarketLink({ id: marketID, description: market.description }, dispatch);
//   transaction.data.marketID = marketID || null;
//   transaction.data.market = market;
//   const isUnethical = !log.ethics || abi.bignum(log.ethics).eq(constants.ZERO);
//   transaction.data.isUnethical = isUnethical;
//   const action = log.inProgress ? 'committing' : 'committed';
//   transaction.message = `${action} to report`;
//   if (decryptionKey) {
//     const formattedReport = formatReportedOutcome(augur.reporting.crypto.parseAndDecryptReport([
//       log.encryptedReport,
//       log.encryptedSalt
//     ], { derivedKey: decryptionKey }).report, market.minValue, market.maxValue, market.type, outcomes);
//     transaction.data.reportedOutcomeID = formattedReport;
//     transaction.data.outcome = { name: formattedReport };
//     transaction.message = `${transaction.message}: ${formattedReport}`;
//   }
//   if (!log.inProgress) {
//     dispatch(updateEventsWithAccountReportData({
//       [market.eventID]: {
//         marketID,
//         branch: market.branchID,
//         period: market.tradingPeriod,
//         description: market.description,
//         expirationDate: new Date(market.endDate * 1000),
//         isUnethical,
//         isCommitted: true
//       }
//     }));
//   }
//   return transaction;
// }

export function constructSubmittedReportTransaction(log, marketID, market, outcomes, dispatch) {
  const transaction = { data: {} };
  transaction.type = TYPES.REVEAL_REPORT;
  transaction.description = market.description;
  transaction.data.marketLink = selectMarketLink({ id: marketID, description: market.description }, dispatch);
  transaction.data.marketID = marketID || null;
  transaction.data.market = market;
  const isUnethical = !log.ethics || abi.bignum(log.ethics).eq(constants.ZERO);
  transaction.data.isUnethical = isUnethical;
  const formattedReport = formatReportedOutcome(log.report, market.minValue, market.maxValue, market.type, outcomes);
  transaction.data.reportedOutcomeID = formattedReport;
  transaction.data.outcome = { name: formattedReport };
  const action = log.inProgress ? 'revealing' : 'revealed';
  transaction.message = `${action} report: ${formatReportedOutcome(log.report, market.minValue, market.maxValue, market.type, outcomes)}`;
  if (!log.inProgress) {
    dispatch(updateEventsWithAccountReportData({
      [market.eventID]: {
        accountReport: formattedReport,
        isRevealed: true
      }
    }));
  }
  return transaction;
}

// export function constructSlashedRepTransaction(log, market, outcomes, address, dispatch) {
//   const transaction = { data: {} };
//   console.log('constructSlashedRepTransaction:', log, market, outcomes, address);
//   transaction.description = market.description;
//   transaction.data.marketLink = selectMarketLink({ id: market.id, description: market.description }, dispatch);
//   transaction.data.marketID = market.id ? market.id : null;
//   transaction.data.market = market;
//   if (log.sender === address) {
//     transaction.type = 'Snitch Reward';
//     if (log.repSlashed) {
//       const slasherRepGained = abi.bignum(log.repSlashed).dividedBy(2).toFixed();
//       transaction.data.balances = [{
//         change: formatRep(slasherRepGained, { positiveSign: true }),
//         balance: formatRep(log.slasherBalance)
//       }];
//     }
//     if (log.inProgress) {
//       transaction.message = `fining ${abi.strip_0x(log.reporter)}`;
//     } else {
//       transaction.message = `fined ${abi.strip_0x(log.reporter)} ${formatRep(log.repSlashed).full}`;
//     }
//   } else {
//     transaction.type = 'Pay Collusion Fine';
//     if (log.repSlashed) {
//       transaction.data.balances = [{
//         change: formatRep(abi.bignum(log.repSlashed).neg(), { positiveSign: true }),
//         balance: formatRep(0)
//       }];
//     }
//     transaction.message = `fined by ${abi.strip_0x(log.sender)}`;
//   }
//   console.log('slashed rep transaction:', transaction);
//   return transaction;
// }

// export const constructLogFillTxTransaction = (trade, marketID, marketType, minValue, description, outcomeID, outcomeName, status) => (dispatch, getState) => {
//   console.log('constructLogFillTransaction:', trade);
//   if (!trade.amount || !trade.price || (!trade.makerFee && !trade.takerFee)) return null;
//   const transactionID = `${trade.transactionHash}-${trade.tradeid}`;
//   const tradeGroupID = trade.tradeGroupID;
//   const price = formatEtherTokens(trade.price);
//   const shares = formatShares(trade.amount);
//   const tradingFees = trade.maker ? abi.bignum(trade.makerFee) : abi.bignum(trade.takerFee);
//   const bnShares = abi.bignum(trade.amount);
//   const bnPrice = marketType === SCALAR ? abi.bignum(augur.trading.shrinkScalarPrice(minValue, trade.price)) : abi.bignum(trade.price);
//   const totalCost = bnPrice.times(bnShares).plus(tradingFees);
//   const totalReturn = bnPrice.times(bnShares).minus(tradingFees);
//   const totalCostPerShare = totalCost.dividedBy(bnShares);
//   const totalReturnPerShare = totalReturn.dividedBy(bnShares);
//   let type;
//   let perfectType;
//   let formattedTotalCost;
//   let formattedTotalReturn;
//   if (trade.maker) {
//     type = trade.type === TYPES.SELL ? TYPES.MATCH_BID : TYPES.MATCH_ASK;
//     perfectType = trade.type === TYPES.SELL ? 'bought' : 'sold';
//     formattedTotalCost = trade.type === TYPES.SELL ? formatEtherTokens(totalCost) : undefined;
//     formattedTotalReturn = trade.type === TYPES.BUY ? formatEtherTokens(totalReturn) : undefined;
//   } else {
//     type = trade.type === TYPES.BUY ? TYPES.BUY : TYPES.SELL;
//     perfectType = trade.type === TYPES.BUY ? 'bought' : 'sold';
//     formattedTotalCost = trade.type === TYPES.BUY ? formatEtherTokens(totalCost) : undefined;
//     formattedTotalReturn = trade.type === TYPES.SELL ? formatEtherTokens(totalReturn) : undefined;
//   }
//   const action = trade.inProgress ? type : perfectType;
//   const transaction = {
//     [transactionID]: {
//       type,
//       hash: trade.transactionHash,
//       tradeGroupID,
//       status,
//       description,
//       data: {
//         marketType,
//         outcomeName: outcomeName || outcomeID,
//         outcomeID,
//         marketID,
//         marketLink: selectMarketLink({ id: marketID, description }, dispatch),
//       },
//       message: `${action} ${shares.full} for ${formatEtherTokens(trade.type === TYPES.BUY ? totalCostPerShare : totalReturnPerShare).full} / share`,
//       numShares: shares,
//       noFeePrice: price,
//       avgPrice: price,
//       timestamp: formatDate(new Date(trade.timestamp * 1000)),
//       tradingFees: formatEtherTokens(tradingFees),
//       feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
//       totalCost: formattedTotalCost,
//       totalReturn: formattedTotalReturn,
//       gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
//       blockNumber: trade.blockNumber
//     }
//   };
//   return transaction;
// };

// export const constructLogShortFillTxTransaction = (trade, marketID, marketType, maxValue, description, outcomeID, outcomeName, status) => (dispatch, getState) => {
//   const transactionID = `${trade.transactionHash}-${trade.tradeid}`;
//   const price = formatEtherTokens(trade.price);
//   const shares = formatShares(trade.amount);
//   const bnPrice = abi.bignum(trade.price);
//   const tradingFees = abi.bignum(trade.takerFee);
//   const bnShares = abi.bignum(trade.amount);
//   const totalCost = marketType === SCALAR ?
//     abi.bignum(maxValue).times(bnShares).minus(bnPrice.times(bnShares).plus(tradingFees)) :
//     bnShares.minus(bnPrice.times(bnShares).plus(tradingFees));
//   const totalCostPerShare = totalCost.dividedBy(bnShares);
//   const action = trade.inProgress ? 'short selling' : 'short sold';
//   const transaction = {
//     [transactionID]: {
//       type: TYPES.SHORT_SELL,
//       hash: trade.transactionHash,
//       status,
//       description,
//       data: {
//         marketType,
//         outcomeName: outcomeName || outcomeID,
//         outcomeID,
//         marketID,
//         marketLink: selectMarketLink({ id: marketID, description }, dispatch)
//       },
//       message: `${action} ${shares.full} for ${formatEtherTokens(totalCostPerShare).full} / share`,
//       numShares: shares,
//       noFeePrice: price,
//       avgPrice: formatEtherTokens(totalCost.minus(bnShares).dividedBy(bnShares).abs()),
//       timestamp: formatDate(new Date(trade.timestamp * 1000)),
//       tradingFees: formatEtherTokens(tradingFees),
//       feePercent: formatPercent(tradingFees.dividedBy(totalCost).times(100)),
//       totalCost: formatEtherTokens(totalCost),
//       gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
//       blockNumber: trade.blockNumber
//     }
//   };
//   return transaction;
// };

// export const constructLogAddTxTransaction = (trade, marketID, marketType, description, outcomeID, outcomeName, market, status) => (dispatch, getState) => {
//   let type;
//   let action;
//   if (trade.type === TYPES.BUY) {
//     type = TYPES.BID;
//     action = trade.inProgress ? 'bidding' : 'bid';
//   } else if (trade.isShortAsk) {
//     type = TYPES.SHORT_ASK;
//     action = trade.inProgress ? 'short asking' : 'short ask';
//   } else {
//     type = TYPES.ASK;
//     action = trade.inProgress ? 'asking' : 'ask';
//   }
//   const price = formatEtherTokens(trade.price);
//   const shares = formatShares(trade.amount);
//   const makerFee = market.makerFee;
//   const takerFee = market.takerFee;
//   const maxValue = abi.bignum(market.maxValue);
//   const minValue = abi.bignum(market.minValue);
//   const fees = augur.trading.fees.calculateFxpTradingFees(makerFee, takerFee);
//   const rawPrice = marketType === SCALAR ? augur.trading.expandScalarPrice(minValue, trade.price) : trade.price;
//   const range = marketType === SCALAR ? abi.fix(maxValue.minus(minValue)) : constants.ONE;
//   const adjustedFees = augur.trading.fees.calculateFxpMakerTakerFees(augur.trading.fees.calculateFxpAdjustedTradingFee(fees.tradingFee, abi.fix(trade.price), range), fees.makerProportionOfFee, false, true);
//   const fxpShares = abi.fix(trade.amount);
//   const fxpPrice = abi.fix(trade.price);
//   const tradingFees = adjustedFees.maker.times(fxpShares).dividedBy(constants.ONE)
//     .floor()
//     .times(fxpPrice)
//     .dividedBy(constants.ONE)
//     .floor();
//   let noFeeCost;
//   if (trade.isShortAsk) {
//     noFeeCost = fxpShares;
//   } else {
//     noFeeCost = fxpPrice.times(fxpShares).dividedBy(constants.ONE).floor();
//   }
//   const totalCost = noFeeCost.plus(tradingFees);
//   const totalCostPerShare = totalCost.dividedBy(fxpShares).times(constants.ONE).floor();
//   const totalReturn = fxpPrice.times(fxpShares).dividedBy(constants.ONE)
//     .floor()
//     .minus(tradingFees);
//   const totalReturnPerShare = totalReturn.dividedBy(fxpShares).times(constants.ONE).floor();
//   return {
//     [trade.transactionHash]: {
//       type,
//       status,
//       description,
//       data: {
//         marketType,
//         outcomeName: outcomeName || outcomeID,
//         outcomeID,
//         marketID,
//         marketLink: selectMarketLink({ id: marketID, description }, dispatch)
//       },
//       message: `${action} ${shares.full} for ${formatEtherTokens(abi.unfix(trade.type === TYPES.BUY ? totalCostPerShare : totalReturnPerShare)).full} / share`,
//       numShares: shares,
//       noFeePrice: formatEtherTokens(rawPrice),
//       freeze: {
//         verb: trade.inProgress ? 'freezing' : 'froze',
//         noFeeCost: type === TYPES.ASK ? undefined : formatEtherTokens(abi.unfix(noFeeCost)),
//         tradingFees: formatEtherTokens(abi.unfix(tradingFees))
//       },
//       avgPrice: price,
//       timestamp: formatDate(new Date(trade.timestamp * 1000)),
//       hash: trade.transactionHash,
//       feePercent: formatPercent(abi.unfix(tradingFees.dividedBy(totalCost).times(constants.ONE).floor()).times(100)),
//       totalCost: type === TYPES.BID ? formatEtherTokens(abi.unfix(totalCost)) : undefined,
//       totalReturn: type === TYPES.ASK ? formatEtherTokens(abi.unfix(totalReturn)) : undefined,
//       gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
//       blockNumber: trade.blockNumber,
//       tradeID: trade.tradeid
//     }
//   };
// };

export const constructLogCancelTransaction = (trade, marketID, marketType, description, outcomeID, outcomeName, status) => (dispatch, getState) => {
  const price = formatEtherTokens(trade.price);
  const shares = formatShares(trade.amount);
  const action = trade.inProgress ? 'canceling' : 'canceled';
  return {
    [trade.transactionHash]: {
      type: TYPES.CANCEL_ORDER,
      status,
      description,
      data: {
        order: { type: trade.type, shares },
        marketType,
        outcome: { name: outcomeName || outcomeID },
        outcomeID,
        marketID,
        marketLink: selectMarketLink({ id: marketID, description }, dispatch)
      },
      message: `${action} order to ${trade.type} ${shares.full} for ${price.full} each`,
      numShares: shares,
      noFeePrice: price,
      avgPrice: price,
      timestamp: formatDate(new Date(trade.timestamp * 1000)),
      hash: trade.transactionHash,
      totalReturn: trade.inProgress ? null : formatEtherTokens(trade.cashRefund),
      gasFees: trade.gasFees && abi.bignum(trade.gasFees).gt(ZERO) ? formatEther(trade.gasFees) : null,
      blockNumber: trade.blockNumber,
      tradeID: trade.tradeid
    }
  };
};

export const constructTradingTransaction = (label, trade, marketID, outcomeID, status) => (dispatch, getState) => {
  console.log('constructTradingTransaction:', label, trade);
  const { marketsData, outcomesData } = getState();
  const market = marketsData[marketID];
  const marketOutcomesData = outcomesData[marketID];
  const marketType = market.type;
  const description = market.description;
  let outcomeName;
  if (marketType === BINARY || marketType === SCALAR) {
    outcomeName = null;
  } else {
    outcomeName = (marketOutcomesData ? marketOutcomesData[outcomeID] : {}).name;
  }
  switch (label) {
    case TYPES.LOG_FILL_TX: {
      return dispatch(constructLogFillTxTransaction(trade, marketID, marketType, market.minValue, description, outcomeID, outcomeName, status));
    }
    case TYPES.LOG_SHORT_FILL_TX: {
      return dispatch(constructLogShortFillTxTransaction(trade, marketID, marketType, market.maxValue, description, outcomeID, outcomeName, status));
    }
    case TYPES.LOG_ADD_TX: {
      return dispatch(constructLogAddTxTransaction(trade, marketID, marketType, description, outcomeID, outcomeName, market, status));
    }
    case TYPES.LOG_CANCEL: {
      return dispatch(constructLogCancelTransaction(trade, marketID, marketType, description, outcomeID, outcomeName, status));
    }
    default:
      return null;
  }
};

export const constructMarketTransaction = (label, log, market) => (dispatch, getState) => {
  switch (label) {
    case TYPES.PAYOUT:
      return constructPayoutTransaction(log, market, dispatch);
    case TYPES.TRADING_FEE_UPDATED:
      return constructTradingFeeUpdatedTransaction(log, market, dispatch);
    default:
      return null;
  }
};

export const constructReportingTransaction = (label, log, marketID, market, outcomes) => (dispatch, getState) => {
  const { address, derivedKey } = getState().loginAccount;
  switch (label) {
    case TYPES.PENALIZE:
      return constructPenalizeTransaction(log, marketID, market, outcomes, dispatch);
    case TYPES.SUBMITTED_REPORT:
      return constructSubmittedReportTransaction(log, marketID, market, outcomes, dispatch);
    case TYPES.SUBMITTED_REPORT_HASH:
      return constructSubmittedReportHashTransaction(log, marketID, market, outcomes, derivedKey, dispatch);
    case TYPES.SLASHED_REP:
      return constructSlashedRepTransaction(log, market, outcomes, address, dispatch);
    default:
      return null;
  }
};

export const constructTransaction = (label, log, isRetry, callback) => (dispatch, getState) => {
  switch (label) {
    case TYPES.APPROVAL:
      return constructApprovalTransaction(log);
    case TYPES.COLLECTED_FEES:
      return constructCollectedFeesTransaction(log);
    case TYPES.WITHDRAW_ETHER:
      return constructConvertEthTokenToEthTransaction(log);
    case TYPES.DEPOSIT_ETHER:
      return constructConvertEthToEthTokenTransaction(log);
    case TYPES.FUNDED_ACCOUNT:
      return constructFundedAccountTransaction(log);
    case TYPES.PENALIZATION_CAUGHT_UP:
      return constructPenalizationCaughtUpTransaction(log);
    case TYPES.REGISTRATION:
      return constructRegistrationTransaction(log);
    case TYPES.WITHDRAW:
      return constructWithdrawTransaction(log);
    case TYPES.SENT_CASH:
      if (getState().transactionsData[log.transactionHash]) return null;
      return constructSentCashTransaction(log, getState().loginAccount.address);
    case TYPES.SENT_ETHER:
      if (getState().transactionsData[log.transactionHash]) return null;
      return constructSentEtherTransaction(log, getState().loginAccount.address);
    case TYPES.TRANSFER:
      if (getState().transactionsData[log.transactionHash]) return null;
      return constructTransferTransaction(log, getState().loginAccount.address);
    case TYPES.MARKET_CREATED: {
      if (log.description) return constructMarketCreatedTransaction(log, log.description, dispatch);
      const market = dispatch(loadDataForMarketTransaction(label, log, isRetry, callback));
      if (!market || !market.description) break;
      return constructMarketCreatedTransaction(log, market.description, dispatch);
    }
    case TYPES.PAYOUT:
    case TYPES.TRADING_FEE_UPDATED: {
      const market = dispatch(loadDataForMarketTransaction(label, log, isRetry, callback));
      if (!market || !market.description) break;
      return dispatch(constructMarketTransaction(label, log, market));
    }
    case TYPES.PENALIZE:
    case TYPES.SLASHED_REP:
    case TYPES.SUBMITTED_REPORT:
    case TYPES.SUBMITTED_REPORT_HASH: {
      const aux = dispatch(loadDataForReportingTransaction(label, log, isRetry, callback));
      if (!aux) break;
      return dispatch(constructReportingTransaction(label, log, aux.marketID, aux.market, aux.outcomes));
    }
    default:
      return constructDefaultTransaction(label, log);
  }
};
