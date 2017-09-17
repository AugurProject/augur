import BigNumber from 'bignumber.js';
import speedomatic from 'speedomatic';
import { constants } from 'services/augurjs';
import { ZERO } from 'modules/trade/constants/numbers';
import { BINARY, SCALAR } from 'modules/markets/constants/market-types';
import * as TYPES from 'modules/transactions/constants/types';
import { formatEtherTokens, formatEther, formatRep, formatShares } from 'utils/format-number';
import { formatDate } from 'utils/format-date';
import { formatReportedOutcome } from 'modules/reports/selectors/reportable-outcomes';
import { loadMarketThenRetryConversion } from 'modules/transactions/actions/retry-conversion';
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
    const marketID = log.market || log.marketID;
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
//   const repGain = new BigNumber(log.repGain, 10);
//   const initialRepBalance = log.initialRepBalance !== undefined ? log.initialRepBalance : new BigNumber(log.newRepBalance, 10).minus(repGain).toFixed();
//   const action = log.inProgress ? 'reporting' : 'reported';
//   transaction.message = `${action} with ${formatRep(initialRepBalance).full}`;
//   transaction.type = `Reporting Payment`;
//   if (log.totalReportingRep) {
//     const totalReportingRep = new BigNumber(log.totalReportingRep, 10);
//     if (!totalReportingRep.eq(constants.ZERO)) {
//       const percentRep = formatPercent(new BigNumber(initialRepBalance, 10).dividedBy(totalReportingRep).times(100), { decimals: 0 });
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

export function constructTransferTransaction(log, address) {
  const transaction = { data: {} };
  let action;
  if (log._from === address) {
    transaction.type = 'Send Reputation';
    transaction.description = `Send Reputation to ${speedomatic.strip0xPrefix(log._to)}`;
    transaction.data.balances = [{
      change: formatRep(new BigNumber(log._value, 10).neg(), { positiveSign: true })
    }];
    action = log.inProgress ? 'sending' : 'sent';
  } else if (log._to === address) {
    transaction.type = 'Receive Reputation';
    transaction.description = `Receive Reputation from ${speedomatic.strip0xPrefix(log._from)}`;
    transaction.data.balances = [{
      change: formatRep(log._value, { positiveSign: true })
    }];
    action = log.inProgress ? 'receiving' : 'received';
  }
  transaction.message = `${action} REP`;
  return transaction;
}

export function constructCreateMarketTransaction(log, description, dispatch) {
  const transaction = { data: {} };
  transaction.type = TYPES.CREATE_MARKET;
  transaction.description = description.split('~|>')[0];
  transaction.topic = log.topic;
  transaction.marketCreationFee = formatEtherTokens(log.marketCreationFee);
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
  transaction.data.marketID = log.market ? log.market : null;
  const action = log.inProgress ? 'closing out' : 'closed out';
  transaction.message = `${action} ${formatShares(log.shares).full}`;
  return transaction;
}

export function constructPenalizeTransaction(log, marketID, market, outcomes, dispatch) {
  const transaction = { data: {} };
  transaction.type = 'Compare Report To Consensus';
  const formattedReport = formatReportedOutcome(log.reportValue, market.minPrice, market.maxPrice, market.type, outcomes);
  const formattedOutcome = formatReportedOutcome(log.outcome, market.minPrice, market.maxPrice, market.type, outcomes);
  console.log('formattedReport:', formattedReport);
  console.log('formattedOutcome:', formattedOutcome);
  transaction.description = market.description;
  transaction.data.marketID = marketID || null;
  if (log.repchange) {
    let repPenalty;
    let repBalance;
    const repChange = new BigNumber(log.repchange, 10);
    if (repChange.lt(constants.ZERO)) {
      repPenalty = repChange;
      repBalance = new BigNumber(log.oldrep).plus(new BigNumber(log.repchange, 10)).toFixed();
    } else {
      repPenalty = constants.ZERO;
      repBalance = log.oldrep;
    }
    transaction.data.balances = [{
      change: formatRep(repPenalty, { positiveSign: true }),
      balance: formatRep(repBalance)
    }];
    if (!log.inProgress) {
      dispatch(updateEventsWithAccountReportData({
        [market.eventID]: {
          repEarned: repPenalty,
          repBalance
        }
      }));
    }
  }
  if (log.inProgress) {
    transaction.message = 'comparing report to consensus';
  } else if (log.reportValue === log.outcome) {
    transaction.message = `✔ report ${formattedReport} matches consensus`;
  } else {
    transaction.message = `✘ report ${formattedReport} does not match consensus ${formattedOutcome}`;
  }
  if (!log.inProgress) {
    dispatch(updateEventsWithAccountReportData({
      [market.eventID]: {
        marketOutcome: formattedOutcome,
        proportionCorrect: market.proportionCorrect,
        isIndeterminate: market.isIndeterminate,
        isChallenged: false,
        isChallengeable: false
      }
    }));
  }
  return transaction;
}

export function constructSubmitReportTransaction(log, marketID, market, outcomes, dispatch) {
  const transaction = { data: {} };
  transaction.type = TYPES.SUBMIT_REPORT;
  transaction.description = market.description;
  transaction.data.marketID = marketID || null;
  transaction.data.market = market;
  const formattedReport = formatReportedOutcome(log.report, market.minPrice, market.maxPrice, market.type, outcomes);
  transaction.data.reportedOutcomeID = formattedReport;
  transaction.data.outcome = { name: formattedReport };
  const action = log.inProgress ? 'revealing' : 'revealed';
  transaction.message = `${action} report: ${formatReportedOutcome(log.report, market.minPrice, market.maxPrice, market.type, outcomes)}`;
  if (!log.inProgress) {
    dispatch(updateEventsWithAccountReportData({
      [market.eventID]: {
        accountReport: formattedReport,
        isSubmitted: true
      }
    }));
  }
  return transaction;
}

export const constructTakeOrderTransaction = (trade, marketID, marketType, minPrice, description, outcomeID, outcomeName, status) => (dispatch, getState) => {
//   console.log('constructLogFillTransaction:', trade);
//   if (!trade.amount || !trade.price || (!trade.makerFee && !trade.settlementFee)) return null;
//   const transactionID = `${trade.transactionHash}-${trade.orderId}`;
//   const tradeGroupID = trade.tradeGroupID;
//   const price = formatEtherTokens(trade.price);
//   const shares = formatShares(trade.amount);
//   const tradingFees = trade.maker ? new BigNumber(trade.makerFee, 10) : new BigNumber(trade.settlementFee, 10);
//   const bnShares = new BigNumber(trade.amount, 10);
//   const bnPrice = marketType === SCALAR ? new BigNumber(augur.trading.shrinkScalarPrice(minPrice, trade.price), 10) : new BigNumber(trade.price, 10);
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
//       gasFees: trade.gasFees && new BigNumber(trade.gasFees, 10).gt(ZERO) ? formatEther(trade.gasFees) : null,
//       blockNumber: trade.blockNumber
//     }
//   };
//   return transaction;
};

export const constructMakeOrderTransaction = (trade, marketID, marketType, description, outcomeID, outcomeName, market, status) => (dispatch, getState) => {
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
//   const settlementFee = market.settlementFee;
//   const maxPrice = new BigNumber(market.maxPrice, 10);
//   const minPrice = new BigNumber(market.minPrice, 10);
//   const fees = augur.trading.fees.calculateFxpTradingFees(makerFee, settlementFee);
//   const rawPrice = marketType === SCALAR ? augur.trading.expandScalarPrice(minPrice, trade.price) : trade.price;
//   const range = marketType === SCALAR ? speedomatic.fix(maxPrice.minus(minPrice)) : constants.ONE;
//   const adjustedFees = augur.trading.fees.calculateFxpMakerTakerFees(augur.trading.fees.calculateFxpAdjustedTradingFee(fees.tradingFee, speedomatic.fix(trade.price), range), fees.makerProportionOfFee, false, true);
//   const fxpShares = speedomatic.fix(trade.amount);
//   const fxpPrice = speedomatic.fix(trade.price);
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
//       message: `${action} ${shares.full} for ${formatEtherTokens(speedomatic.unfix(trade.type === TYPES.BUY ? totalCostPerShare : totalReturnPerShare)).full} / share`,
//       numShares: shares,
//       noFeePrice: formatEtherTokens(rawPrice),
//       freeze: {
//         verb: trade.inProgress ? 'freezing' : 'froze',
//         noFeeCost: type === TYPES.ASK ? undefined : formatEtherTokens(speedomatic.unfix(noFeeCost)),
//         tradingFees: formatEtherTokens(speedomatic.unfix(tradingFees))
//       },
//       avgPrice: price,
//       timestamp: formatDate(new Date(trade.timestamp * 1000)),
//       hash: trade.transactionHash,
//       feePercent: formatPercent(speedomatic.unfix(tradingFees.dividedBy(totalCost).times(constants.ONE).floor()).times(100)),
//       totalCost: type === TYPES.BID ? formatEtherTokens(speedomatic.unfix(totalCost)) : undefined,
//       totalReturn: type === TYPES.ASK ? formatEtherTokens(speedomatic.unfix(totalReturn)) : undefined,
//       gasFees: trade.gasFees && new BigNumber(trade.gasFees, 10).gt(ZERO) ? formatEther(trade.gasFees) : null,
//       blockNumber: trade.blockNumber,
//       orderId: trade.orderId
//     }
//   };
};

export const constructCancelOrderTransaction = (trade, marketID, marketType, description, outcomeID, outcomeName, status) => (dispatch, getState) => {
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
        marketID
      },
      message: `${action} order to ${trade.type} ${shares.full} for ${price.full} each`,
      numShares: shares,
      noFeePrice: price,
      avgPrice: price,
      timestamp: formatDate(new Date(trade.timestamp * 1000)),
      hash: trade.transactionHash,
      totalReturn: trade.inProgress ? null : formatEtherTokens(trade.cashRefund),
      gasFees: trade.gasFees && new BigNumber(trade.gasFees, 10).gt(ZERO) ? formatEther(trade.gasFees) : null,
      blockNumber: trade.blockNumber,
      orderId: trade.orderId
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
    case TYPES.TAKE_ORDER: {
      return dispatch(constructTakeOrderTransaction(trade, marketID, marketType, market.minPrice, description, outcomeID, outcomeName, status));
    }
    case TYPES.MAKE_ORDER: {
      return dispatch(constructMakeOrderTransaction(trade, marketID, marketType, description, outcomeID, outcomeName, market, status));
    }
    case TYPES.CANCEL_ORDER: {
      return dispatch(constructCancelOrderTransaction(trade, marketID, marketType, description, outcomeID, outcomeName, status));
    }
    default:
      return null;
  }
};

export const constructMarketTransaction = (label, log, market) => (dispatch, getState) => {
  switch (label) {
    case TYPES.PAYOUT:
      return constructPayoutTransaction(log, market, dispatch);
    default:
      return null;
  }
};

export const constructTransaction = (label, log, isRetry, callback) => (dispatch, getState) => {
  switch (label) {
    case TYPES.APPROVAL:
      return constructApprovalTransaction(log);
    case TYPES.REGISTRATION:
      return constructRegistrationTransaction(log);
    case TYPES.TRANSFER:
      if (getState().transactionsData[log.transactionHash]) return null;
      return constructTransferTransaction(log, getState().loginAccount.address);
    case TYPES.CREATE_MARKET: {
      if (log.description) return constructCreateMarketTransaction(log, log.description, dispatch);
      const market = dispatch(loadDataForMarketTransaction(label, log, isRetry, callback));
      if (!market || !market.description) break;
      return constructCreateMarketTransaction(log, market.description, dispatch);
    }
    case TYPES.PAYOUT: {
      const market = dispatch(loadDataForMarketTransaction(label, log, isRetry, callback));
      if (!market || !market.description) break;
      return dispatch(constructMarketTransaction(label, log, market));
    }
    case TYPES.SUBMIT_REPORT: {
      const aux = dispatch(loadDataForReportingTransaction(label, log, isRetry, callback));
      if (!aux) break;
      return constructSubmitReportTransaction(log, aux.marketID, aux.market, aux.outcomes, dispatch);
    }
    default:
      return constructDefaultTransaction(label, log);
  }
};
