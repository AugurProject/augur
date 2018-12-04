import {
  MARKET_CREATION,
  PUBLIC_TRADE,
  TRANSFER,
  REPORTING,
  TRADE,
  OPEN_ORDER,
  BUY,
  SELL,
  COMPLETE_SETS_SOLD
} from "modules/transactions/constants/types";
import { SUCCESS, PENDING } from "modules/transactions/constants/statuses";
import { updateTransactionsData } from "modules/transactions/actions/update-transactions-data";
import { eachOf, each } from "async";
import { unfix } from "speedomatic";
import { isNull, orderBy } from "lodash";
import { createBigNumber } from "utils/create-big-number";
import { convertUnixToFormattedDate } from "src/utils/format-date";
import { YES_NO, CATEGORICAL } from "modules/markets/constants/market-types";
import {
  formatAttoRep,
  formatShares,
  formatEther,
  formatAttoEth
} from "utils/format-number";
import calculatePayoutNumeratorsValue from "utils/calculate-payout-numerators-value";

import { groupBy } from "lodash/fp";

function formatTransactionMessage(sumBuy, sumSell, txType) {
  const buys = sumBuy !== 0 ? `${sumBuy} ${BUY}` : "";
  const sells = sumSell !== 0 ? `${sumSell} ${SELL}` : "";
  return `${buys}${
    sumBuy !== 0 && sumSell !== 0 ? " & " : " "
  }${sells} ${txType}${sumBuy + sumSell > 1 ? "s" : ""}`;
}

function formatTransactionFillMessage(txType, amount, price, numTxs, outcome) {
  return `${txType === BUY ? "bought" : "sold"} ${amount} Share${
    amount === 1 ? "" : "s"
  } of ${outcome} at ${numTxs > 1 ? "an average price of " : ""}${price}`;
}

export function addTradeTransactions(trades) {
  return (dispatch, getState) => {
    const { marketsData } = getState();
    const transactions = {};
    const sorted = groupBy("tradeGroupId", trades);
    // todo: need fallback if groupBy fails and groups aren't created
    each(sorted, group => {
      if (group[0].tradeGroupId === undefined) {
        each(group, trade => {
          const header = buildTradeTransaction(trade, marketsData);
          transactions[header.hash] = header;
        });
      } else {
        const header = buildTradeTransactionGroup(group, marketsData);
        transactions[header.hash] = header;
      }
    });
    dispatch(updateTransactionsData(transactions));
  };
}

function buildTradeTransactionGroup(group, marketsData) {
  let header = {};
  let sumAmount = createBigNumber(0);
  let sumPrice = createBigNumber(0);
  let numTxs = 0;

  each(group, trade => {
    sumAmount = sumAmount.plus(createBigNumber(trade.amount));
    sumPrice = sumPrice.plus(
      createBigNumber(trade.price).times(createBigNumber(trade.amount))
    );
    numTxs += 1;
    const localHeader = buildTradeTransaction(trade, marketsData);
    if (Object.keys(header).length === 0) {
      header = localHeader;
    } else {
      header.transactions.push(localHeader.transactions[0]);
    }
  });

  header.message = formatTransactionFillMessage(
    header.transactions[0].type,
    formatShares(sumAmount.toNumber()).formatted,
    formatEther(sumPrice.dividedBy(sumAmount).toNumber()).full,
    numTxs,
    header.transactions[0].meta && header.transactions[0].meta.outcome
  );
  return header;
}

function buildTradeTransaction(trade, marketsData) {
  const market = marketsData[trade.marketId];
  const transaction = { ...trade, market };
  transaction.status = SUCCESS;
  transaction.id = `${transaction.transactionHash}-${transaction.orderId}`;
  const header = buildHeader(transaction, TRADE, SUCCESS);
  const meta = {};
  meta.type = TRADE + (transaction.maker ? " Filled" : " Placed");
  const outcomeName = getOutcome(market, transaction.outcome);
  if (outcomeName) meta.outcome = outcomeName;
  const formattedShares = formatShares(transaction.amount);
  meta.shares = formattedShares.formatted;
  meta.price = transaction.price;
  meta.fee = transaction.settlementFees;
  meta.txhash = transaction.transactionHash;
  meta.timestamp = transaction.timestamp;
  transaction.meta = meta;
  header.status = SUCCESS;
  if (transaction.market) {
    header.description = transaction.market.description;
  }
  transaction.message = `${transaction.type} ${
    formattedShares.formatted
  } Shares @ ${transaction.price} ETH`;
  header.transactions = [transaction];
  return header;
}

export function addTransferTransactions(transfers) {
  return dispatch => {
    const transactions = {};
    each(transfers, transfer => {
      const transaction = { ...transfer };
      transaction.id = `${transaction.transactionHash}-${transaction.logIndex}`;
      const header = buildHeader(transaction, TRANSFER, SUCCESS);
      header.transactions = [transaction];
      const meta = {
        value: transaction.value
      };
      if (transaction.symbol === "ether") {
        meta.value = `${
          formatAttoEth(transaction.value, { decimals: 4, roundUp: true })
            .formatted
        }`;
        meta.block = transaction.blockNumber || transaction.creationBlockNumber;
        meta.sender = transaction.sender;
        transaction.symbol = "ETH";
        header.message = "ETH Transfer";
        header.description = `${meta.value} ${transaction.symbol} transferred`;
      } else if (transaction.symbol === "ParticipationToken") {
        meta.value = `${
          formatAttoRep(transaction.value, { decimals: 4, roundUp: true })
            .formatted
        }`;
        header.message = "Participation Tokens purchased";
        header.description = `${meta.value} Participation purchased`;
      } else if (
        transaction.symbol === "REP" ||
        (transaction.market === "0x0000000000000000000000000000000000000000" &&
          transaction.eventName === "TokensTransferred")
      ) {
        meta.value = `${
          formatAttoRep(transaction.value, { decimals: 4, roundUp: true })
            .formatted
        }`;
        meta.block = transaction.blockNumber || transaction.creationBlockNumber;
        meta.sender = transaction.sender;
        transaction.symbol = "REP";
        header.message = "Rep Transfer";
        header.description = `${meta.value} ${transaction.symbol} transferred`;
      } else {
        header.message = "Transfer";
        header.description = `${meta.value} ${
          transaction.symbol
        } transferred from ${transaction.sender} to ${transaction.recipient}`;
        meta.sender = transaction.sender;
        meta.block = transaction.blockNumber;
      }
      transaction.meta = Object.assign(meta, {
        txhash: transaction.transactionHash,
        recipient: transaction.recipient
      });
      if (transaction.meta.recipient !== null)
        transactions[transaction.id] = header;
    });
    dispatch(updateTransactionsData(transactions));
  };
}

export function addNewMarketCreationTransactions(market) {
  return (dispatch, getState) => {
    const marketCreationData = {};
    const { loginAccount } = getState();
    const transaction = {
      timestamp: market._endTime,
      createdBy: loginAccount.address,
      id: market.hash
    };
    const fee = unfix(market._feePerEthInWei, "number");
    const percentage = createBigNumber(fee.toString())
      .times(createBigNumber(100))
      .toNumber();
    const meta = {
      txhash: market.hash,
      "designated reporter": market._designatedReporterAddress,
      "settlement fee": `${percentage} %`
    };
    transaction.meta = meta;

    const header = {
      ...buildHeader(transaction, MARKET_CREATION, PENDING),
      message: "Market Creation",
      description: market._description,
      type: MARKET_CREATION,
      transactions: [transaction]
    };

    marketCreationData[transaction.id] = header;
    dispatch(updateTransactionsData(marketCreationData));
  };
}

export function addMarketCreationTransactions(marketsCreated) {
  return (dispatch, getState) => {
    const marketCreationData = {};
    const { loginAccount, marketsData } = getState();
    each(marketsCreated, marketIdOrObject => {
      const market = marketsData[marketIdOrObject];
      const marketId = marketIdOrObject;
      // we already get market creation from augur-node
      if (typeof marketIdOrObject === "object") return;
      const transaction = Object.assign(
        { marketId, market },
        {
          timestamp: market.creationTime,
          createdBy: loginAccount.address,
          id: marketId
        }
      );
      transaction.meta = {
        market: transaction.marketId,
        "market type": market.marketType,
        category: market.category,
        "end time": convertUnixToFormattedDate(market.endTime).formattedLocal,
        "designated reporter": market.designatedReporter
      };
      const header = Object.assign(
        buildHeader(transaction, MARKET_CREATION, SUCCESS),
        {
          message: "Market Creation",
          description: market.description,
          transactions: [transaction]
        }
      );
      marketCreationData[transaction.id] = header;
    });
    dispatch(updateTransactionsData(marketCreationData));
  };
}

export function addCompleteSetsSoldLogs(completeSetsSoldLogs) {
  return (dispatch, getState) => {
    const { marketsData } = getState();
    const completeSetsData = {};
    each(completeSetsSoldLogs, completeSetLog => {
      const { marketId } = completeSetLog;
      const market = marketsData[marketId];
      const transaction = Object.assign(
        { marketId, ...completeSetLog },
        {
          id: completeSetLog.transactionHash
        }
      );
      transaction.meta = {
        market: transaction.marketId,
        amount: formatShares(transaction.numCompleteSets).full,
        block: completeSetLog.blockNumber,
        sender: completeSetLog.account
      };
      const header = Object.assign(
        buildHeader(transaction, COMPLETE_SETS_SOLD, SUCCESS),
        {
          message: "Complete Sets Sold",
          description: `${transaction.meta.amount} sold on Market: ${
            (market || {}).description
          }`,
          transactions: [transaction]
        }
      );
      completeSetsData[transaction.id] = header;
    });
    dispatch(updateTransactionsData(completeSetsData));
  };
}

export function addOpenOrderTransactions(openOrders) {
  return (dispatch, getState) => {
    const { marketsData, transactionsData } = getState();
    // flatten open orders
    const transactions = {};
    eachOf(openOrders, (value, marketId) => {
      const market = marketsData[marketId];
      let sumBuy = 0;
      let sumSell = 0;
      const marketHeader = {
        status: SUCCESS,
        marketId,
        sortOrder: getSortOrder(OPEN_ORDER)
      };
      if (market !== undefined) {
        marketHeader.description = market.description;
      }
      let creationTime = null;
      const marketTradeTransactions = [];
      eachOf(value, (value2, outcome) => {
        eachOf(value2, (value3, type) => {
          const sorted = orderBy(value3, ["creationTime"], ["desc"]);
          eachOf(sorted, (value4, hash) => {
            const transaction = { marketId, type, hash, ...value4 };
            transaction.id = transaction.transactionHash + transaction.logIndex;
            const meta = {};
            if (
              transaction.canceledTransactionHash &&
              transaction.canceledTime
            ) {
              const cancelationTime = convertUnixToFormattedDate(
                transaction.canceledTime
              );
              meta.canceledTransactionHash =
                transaction.canceledTransactionHash;
              meta.canceledTime = cancelationTime.full;
            }
            transaction.message = `${type} ${
              transaction.originalFullPrecisionAmount
            } Shares @ ${transaction.fullPrecisionPrice} ETH`;
            creationTime = convertUnixToFormattedDate(transaction.creationTime);
            meta.txhash = transaction.transactionHash;
            meta.timestamp = creationTime.full;
            const outcomeName = getOutcome(market, outcome);
            if (outcomeName) meta.outcome = outcomeName;
            meta.status = transaction.orderState.toLowerCase();
            meta.status =
              meta.status.charAt(0).toUpperCase() + meta.status.slice(1);
            meta.amount = formatShares(
              transaction.originalFullPrecisionAmount
            ).full;
            meta.filled = formatShares(
              createBigNumber(
                transaction.originalFullPrecisionAmount,
                10
              ).minus(transaction.fullPrecisionAmount, 10)
            ).full;
            meta.price = formatEther(transaction.fullPrecisionPrice).full;
            transaction.meta = meta;
            marketTradeTransactions.push(transaction);
            if (type === BUY) {
              sumBuy += 1;
            }
            if (type === SELL) {
              sumSell += 1;
            }
          });
        });
      });
      // TODO: last order creation time will be in header, earliest activite
      const currentTransactionsKeys = Object.keys(transactionsData);
      const leadOrder = marketTradeTransactions.find(marketTransaction =>
        currentTransactionsKeys.includes(marketTransaction.orderId)
      );
      marketHeader.timestamp = creationTime;
      marketHeader.message = formatTransactionMessage(sumBuy, sumSell, "Order");
      marketHeader.type = OPEN_ORDER;
      marketHeader.transactions = marketTradeTransactions;
      marketHeader.hash = leadOrder
        ? leadOrder.orderId
        : `${marketTradeTransactions[0].orderId}`;
      transactions[marketHeader.hash] = marketHeader;
    });
    dispatch(updateTransactionsData(transactions));
  };
}

export function addReportingTransactions(reports) {
  return (dispatch, getState) => {
    const { marketsData } = getState();
    const transactions = {};
    eachOf(reports, (reports, universe) => {
      eachOf(reports, (value1, marketId) => {
        eachOf(value1, (value2, reportType) => {
          const market = marketsData[marketId];
          if (reportType === "initialReporter" && !isNull(value2)) {
            const transaction = {
              universe,
              marketId,
              ...value2,
              market,
              reportType
            };
            transactions[transaction.transactionHash] = processReport(
              market,
              transaction
            );
          } else {
            eachOf(value2, (report, index) => {
              const transaction = {
                universe,
                marketId,
                ...report,
                market,
                reportType
              };
              transactions[transaction.transactionHash] = processReport(
                market,
                transaction
              );
            });
          }
        });
      });
    });
    dispatch(updateTransactionsData(transactions));
  };
}

function processReport(market, transaction) {
  const amountStaked = formatAttoRep(transaction.amountStaked, {
    decimals: 4,
    roundUp: true
  });
  const outcomeName = getOutcome(
    transaction.market,
    calculatePayoutNumeratorsValue(
      market,
      transaction.payoutNumerators,
      transaction.isInvalid
    )
  );
  transaction.id = transaction.transactionHash + transaction.logIndex;
  transaction.meta = {
    txhash: transaction.transactionHash,
    type:
      transaction.reportType === "initialReporter"
        ? "Initial Report"
        : "Dispute",
    staked: `${amountStaked.formatted} REP`,
    outcome: outcomeName,
    marketId: transaction.marketId
  };
  transaction.timestamp = transaction.creationTime;
  const header = Object.assign(buildHeader(transaction, REPORTING, SUCCESS), {
    transactions: [transaction],
    message: `${transaction.meta.type}`,
    description: `Staked ${amountStaked.formatted} REP on "${
      market.description
    }"`
  });
  return header;
}

export function getOutcome(
  market,
  outcome,
  alwaysReturnYesForBinaryMarket = true
) {
  let value = null;
  if (!market || isNaN(outcome)) return outcome;
  if (market.marketType === YES_NO) {
    value = "Yes";
    if (!alwaysReturnYesForBinaryMarket && outcome.toString() === "0") {
      value = "No";
    }
  } else if (market.marketType === CATEGORICAL) {
    value = market.outcomes[outcome] && market.outcomes[outcome].description;
  } else {
    value = outcome;
  }
  return value;
}

function buildHeader(item, type, status) {
  const header = {};
  header.status = status;
  header.hash = item.id;
  header.type = type;
  // TODO: need to sort by datetime in render
  if (item.timestamp) {
    header.timestamp = convertUnixToFormattedDate(item.timestamp);
  } else if (item.creationTime) {
    header.timestamp = convertUnixToFormattedDate(item.creationTime);
  }
  header.sortOrder = getSortOrder(type);
  return header;
}

// TODO: this should be dynamic by user control
export function getSortOrder(type) {
  if (type === OPEN_ORDER) {
    return 10;
  }
  if (type === TRADE || type === PUBLIC_TRADE) {
    return 20;
  }
  if (type === COMPLETE_SETS_SOLD) {
    return 40;
  }
  if (type === TRANSFER) {
    return 50;
  }
  if (type === MARKET_CREATION) {
    return 90;
  }
  if (type === REPORTING) {
    return 100;
  }
  return 1000;
}
