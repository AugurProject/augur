import BigNumber from 'bignumber.js';
import { strip0xPrefix } from 'speedomatic';
import { constants } from 'services/augurjs';
import { ZERO } from 'modules/trade/constants/numbers';
import { BINARY, SCALAR } from 'modules/markets/constants/market-types';
import * as TYPES from 'modules/transactions/constants/types';
import { formatEtherTokens, formatEther, formatRep, formatShares } from 'utils/format-number';
import { formatDate } from 'utils/format-date';
import { formatReportedOutcome } from 'modules/reports/selectors/reportable-outcomes';
import { loadMarketThenRetryConversion } from 'modules/transactions/actions/retry-conversion';
import { updateMarketsWithAccountReportData } from 'modules/my-reports/actions/update-markets-with-account-report-data';

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
    transaction.description = `Send Reputation to ${strip0xPrefix(log._to)}`;
    transaction.data.balances = [{
      change: formatRep(new BigNumber(log._value, 10).neg(), { positiveSign: true })
    }];
    action = log.inProgress ? 'sending' : 'sent';
  } else if (log._to === address) {
    transaction.type = 'Receive Reputation';
    transaction.description = `Receive Reputation from ${strip0xPrefix(log._from)}`;
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
  transaction.bond = { label: 'validity', value: formatEtherTokens(log.validityBond) };
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
      dispatch(updateMarketsWithAccountReportData({
        [marketID]: {
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
    dispatch(updateMarketsWithAccountReportData({
      [marketID]: {
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
    dispatch(updateMarketsWithAccountReportData({
      [marketID]: {
        accountReport: formattedReport,
        isSubmitted: true
      }
    }));
  }
  return transaction;
}

export const constructTakeOrderTransaction = (trade, marketID, marketType, minPrice, description, outcomeID, outcomeName, status) => (dispatch, getState) => {

};

export const constructMakeOrderTransaction = (trade, marketID, marketType, description, outcomeID, outcomeName, market, status) => (dispatch, getState) => {

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
