import {
  CreateMarketData,
  PendingOrdersType,
  PendingQueue,
} from 'modules/types';
import { TransactionMetadata } from 'contract-dependencies-ethers/build';
import {
  isTransactionConfirmed,
  transactionConfirmations,
  doReportDisputeAddStake,
} from 'modules/contracts/actions/contractCalls';
import {
  TRANSACTIONS,
  CANCELORDER,
  TX_CHECK_BLOCKNUMBER_LIMIT,
  SUBMIT_REPORT,
  SUBMIT_DISPUTE,
  LIQUIDITY_ORDERS,
  CANCELORDERS,
  CLAIMMARKETSPROCEEDS,
  REDEEMSTAKE,
} from 'modules/common/constants';
import { updatePendingOrderStatus } from 'modules/orders/actions/pending-orders-management';
import { AppStatus } from 'modules/app/store/app-status';

import { generateTxParameterIdFromString } from 'utils/generate-tx-parameter-id';
import {
  calculatePayoutNumeratorsArray,
  TXEventName,
} from '@augurproject/sdk-lite';
import { PendingOrders } from 'modules/app/store/pending-orders';
import { PENDING_LIQUIDITY_ORDERS } from 'modules/app/store/constants';
export const ADD_PENDING_DATA = 'ADD_PENDING_DATA';
export const REMOVE_PENDING_DATA = 'REMOVE_PENDING_DATA';
export const REMOVE_PENDING_DATA_BY_HASH = 'REMOVE_PENDING_DATA_BY_HASH';
export const UPDATE_PENDING_DATA_BY_HASH = 'UPDATE_PENDING_DATA_BY_HASH';

export const loadPendingQueue = (pendingQueue: any) => {
  if (!pendingQueue) return;
  Object.keys(pendingQueue).map(async queue => {
    const data = pendingQueue[queue];
    if (!data) return;
    Object.keys(data).map(async (d: any) => {
      const pendingData = data[d];
      if (!pendingData.pendingId || !pendingData.hash) return;
      if (pendingData.status === TXEventName.Failure)
        addPendingData(
          d,
          queue,
          pendingData.status,
          pendingData.hash,
          pendingData.data
        );
      const confirmed = await isTransactionConfirmed(pendingData.hash);
      confirmed
        ? removePendingData(d, queue)
        : addPendingData(
            d,
            queue,
            pendingData.status,
            pendingData.hash,
            pendingData.data
          );
    });
  });
};

export const addUpdatePendingTransaction = (
  methodCall: string,
  status: string,
  hash: string = null,
  info?: TransactionMetadata
) =>
  addPendingDataWithBlockNumber(methodCall, TRANSACTIONS, status, hash, info);

export const removePendingTransaction = (methodCall: string) =>
  removePendingData(methodCall, TRANSACTIONS);

export const addPendingData = (
  pendingId: string,
  queueName: string,
  status: string,
  hash: string,
  info?: CreateMarketData | object
) => {
  addPendingDataWithBlockNumber(pendingId, queueName, status, hash, info);
};

const addPendingDataWithBlockNumber = (
  pendingId: string,
  queueName: string,
  status: string,
  hash: string,
  info?: CreateMarketData | TransactionMetadata
) => {
  const {
    blockchain: { currentBlockNumber: blockNumber },
  } = AppStatus.get();
  AppStatus.actions.addPendingData(
    pendingId,
    queueName,
    status,
    blockNumber,
    hash,
    info
  );
};

const updatePendingDataHash = (
  queueName: string,
  oldHash: string,
  newHash: string,
  status: string
) => {
  const {
    blockchain: { currentBlockNumber: blockNumber },
  } = AppStatus.get();
  AppStatus.actions.addPendingDataByHash({
    queueName,
    oldHash,
    newHash,
    blockNumber,
    status,
  });
};

export const removePendingData = (pendingId: string, queueName: string) => {
  AppStatus.actions.removePendingData({
    pendingId,
    queueName,
    hash: undefined,
  });
};

export const removePendingDataByHash = (hash: string, queueName: string) => {
  AppStatus.actions.removePendingData({
    pendingId: undefined,
    hash,
    queueName,
  });
};

export const addCanceledOrder = (
  orderId: string,
  status: string,
  hash: string,
  marketId?: string
) => {
  addPendingData(orderId, CANCELORDER, status, hash, { marketId });
  if (status === TXEventName.Pending) {
    setTimeout(() => removeCanceledOrder(orderId), 3000);
  }
};

export const removeCanceledOrder = (orderId: string) =>
  removePendingData(orderId, CANCELORDER);

export const addPendingReport = (
  report: doReportDisputeAddStake,
  payload = {}
) => {
  addPendingReportDispute(report, SUBMIT_REPORT, payload);
};

export const addPendingDispute = (
  report: doReportDisputeAddStake,
  payload = {}
) => {
  addPendingReportDispute(report, SUBMIT_DISPUTE, payload);
};

const addPendingReportDispute = (
  report: doReportDisputeAddStake,
  type: string = SUBMIT_REPORT,
  payload = {},
  status: string = TXEventName.Pending
) => {
  const payoutnumerators = calculatePayoutNumeratorsArray(
    report.maxPrice,
    report.minPrice,
    report.numTicks,
    report.numOutcomes,
    report.marketType,
    report.outcomeId,
    report.isInvalid
  ).map(x => String(x));
  const amount = report.attoRepAmount || '0';
  const tempHash = generateTxParameterIdFromString(
    `${String(payoutnumerators)}${type}${String(amount)}`
  );
  addPendingData(report.marketId, type, status, tempHash, payload);
};

export const updatePendingReportHash = (transaction, hash, status) => {
  updatePendingReportDisputehash(transaction, SUBMIT_REPORT, hash, status);
};

export const updatePendingDisputeHash = (transaction, hash, status) => {
  updatePendingReportDisputehash(transaction, SUBMIT_DISPUTE, hash, status);
};

const updatePendingReportDisputehash = (
  transaction,
  queueName,
  newHash,
  status
) => {
  const payoutnumerators = transaction._payoutNumerators.map(x => String(x));
  const amount = transaction._additionalStake || transaction._amount;
  const tempHash = generateTxParameterIdFromString(
    `${String(payoutnumerators)}${queueName}${String(amount)}`
  );
  updatePendingDataHash(queueName, tempHash, newHash, status);
};

interface PendingItem {
  queueName: string;
  pendingId: string;
  status: string;
  blockNumber: number;
  hash: string;
  parameters?: any;
  data?: CreateMarketData;
}

export const findAndSetTransactionsTimeouts = (blockNumber: number) => {
  const { pendingQueue } = AppStatus.get();
  const { pendingOrders } = PendingOrders.get();
  const thresholdBlockNumber = blockNumber - TX_CHECK_BLOCKNUMBER_LIMIT;

  // processingPendingQueue(thresholdBlockNumber, pendingQueue);
  // processingPendingOrders(thresholdBlockNumber, pendingOrders);
};

const processingPendingQueue = (
  thresholdBlockNumber: number,
  pendingQueue: PendingQueue
) => {
  Object.keys(pendingQueue)
    .reduce(
      (p, queueName) =>
        p.concat(
          Object.keys(pendingQueue[queueName])
            .map(pendingId => ({
              queueName,
              pendingId,
              ...pendingQueue[queueName][pendingId],
            }))
            .filter(
              pendingItem =>
                (pendingItem.status === TXEventName.AwaitingSigning ||
                  pendingItem.status === TXEventName.Pending) &&
                pendingItem.blockNumber &&
                thresholdBlockNumber >= pendingItem.blockNumber
            )
        ),
      [] as PendingItem[]
    )
    .forEach(async queueItem => {
      const confirmations = queueItem.hash
        ? await transactionConfirmations(queueItem.hash)
        : undefined;
      if (confirmations === undefined) {
        addPendingData(
          queueItem.pendingId,
          queueItem.queueName,
          TXEventName.Failure,
          queueItem.hash,
          queueItem.data
        );
      } else if (confirmations > 0) {
        addPendingData(
          queueItem.pendingId,
          queueItem.queueName,
          TXEventName.Success,
          queueItem.hash,
          queueItem.data
        );
      }
    });
};

const processingPendingOrders = (
  thresholdBlockNumber: number,
  pendingOrders: PendingOrdersType
) => {
  Object.keys(pendingOrders).map(marketId => {
    pendingOrders[marketId]
      .filter(
        order =>
          order.blockNumber <= thresholdBlockNumber &&
          (order.status === TXEventName.Pending ||
            order.status === TXEventName.AwaitingSigning)
      )
      .map(order =>
        updatePendingOrderStatus(
          order.id,
          marketId,
          TXEventName.Failure,
          order.hash
        )
      );
  });
};

export const updatePendingQueue = (managingQueueName, updatedState) => {
  if (
    managingQueueName === TRANSACTIONS ||
    managingQueueName !== REDEEMSTAKE ||
    managingQueueName !== CLAIMMARKETSPROCEEDS ||
    managingQueueName !== PENDING_LIQUIDITY_ORDERS ||
    managingQueueName !== CANCELORDER
  ) {
    return;
  }
  let updateQueueName = managingQueueName;
  let useMarketId = false;

  switch (managingQueueName) {
    case PENDING_LIQUIDITY_ORDERS:
      updateQueueName = LIQUIDITY_ORDERS;
      useMarketId = true;
      break;
    case CANCELORDER:
      updateQueueName = CANCELORDERS;
      break;
    default:
      updateQueueName = managingQueueName;
      break;
  }

  Object.keys(updatedState[managingQueueName]).map(txHash => {
    const order = updatedState[managingQueueName][txHash];
    let statusTracker = {
      [TXEventName.Pending]: 0,
      [TXEventName.Success]: 0,
      [TXEventName.Failure]: 0,
      none: 0,
    };
    let totalCount = 0;
    // Object.keys(marketOrders).map(outcome =>
    //   marketOrders[outcome].map(order => {
    const orderStatus = order.status ? order.status : 'none';
    statusTracker[orderStatus] = statusTracker[orderStatus] + 1;
    totalCount = totalCount + 1;
    //   })
    // );

    // let status = '';
    // let submitAllButton = false;

    // if (statusTracker[TXEventName.Pending] > 0) {
    //   status = TXEventName.Pending;
    // } else if (statusTracker[TXEventName.Success] > 0) {
    //   status = TXEventName.Success;
    // } else if (statusTracker[TXEventName.Failure] > 0) {
    //   status = TXEventName.Failure;
    // }

    // if (statusTracker['none'] === 0) {
    //   submitAllButton = true;
    // }

    // let queueId =
    //   managingQueueName === updateQueueName ? updateQueueName : txHash;
    // if (useMarketId) {
    //   queueId = order.data.marketId;
    // }
    // const queueName =
    //   managingQueueName === updateQueueName ? TRANSACTIONS : updateQueueName;
    // AppStatus.actions.addPendingData(queueId, queueName, status, '', '', {
    //   submitAllButton,
    //   dontShowNotificationButton: false,
    // });
    // if (status === TXEventName.Failure) {
    //   setTimeout(
    //     () =>
    //       AppStatus.actions.addPendingData(queueId, queueName, status, '', '', {
    //         submitAllButton,
    //         dontShowNotificationButton: true,
    //       }),
    //     2000
    //   );
    // }
  });
};
