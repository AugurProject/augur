import { AppState } from 'appStore';
import {
  CANCELORDER,
  CANCELORDERS,
  BATCHCANCELORDERS,
  TX_ORDER_ID,
  CREATEMARKET,
  CREATECATEGORICALMARKET,
  CREATESCALARMARKET,
  CREATEYESNOMARKET,
  CREATE_MARKET,
  CATEGORICAL,
  SCALAR,
  YES_NO,
  PUBLICFILLORDER,
  CREATEAUGURWALLET,
  WITHDRAWALLFUNDSASDAI,
  ADDLIQUIDITY,
  SWAPEXACTTOKENSFORTOKENS,
  SWAPTOKENSFOREXACTETH,
  SWAPETHFOREXACTTOKENS,
  SENDETHER,
  BUYPARTICIPATIONTOKENS,
  TRANSFER,
  MODAL_ERROR,
  MIGRATE_FROM_LEG_REP_TOKEN,
  APPROVE_FROM_LEG_REP_TOKEN,
  REDEEMSTAKE,
  MIGRATEOUTBYPAYOUT,
  TRADINGPROCEEDSCLAIMED,
  CLAIMMARKETSPROCEEDS,
  FORKANDREDEEM,
  FINALIZE,
  DOINITIALREPORT,
  CONTRIBUTE,
  APPROVE,
  TRANSACTIONS,
  SETREFERRER,
  SETAPPROVALFORALL,
} from 'modules/common/constants';
import { CreateMarketData } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  Events,
  TXEventName,
  parseZeroXMakerAssetData
} from '@augurproject/sdk-lite';
import {
  addPendingData,
  addUpdatePendingTransaction,
  addCanceledOrder,
  updatePendingReportHash,
  updatePendingDisputeHash,
  removePendingDataByHash,
} from 'modules/pending-queue/actions/pending-queue-management';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { TransactionMetadataParams } from '@augurproject/contract-dependencies-ethers';
import { generateTxParameterId } from 'utils/generate-tx-parameter-id';
import { updateLiqTransactionParamHash } from 'modules/orders/actions/liquidity-management';
import { addAlert, updateAlert } from 'modules/alerts/actions/alerts';
import { getDeconstructedMarketId } from 'modules/create-market/helpers/construct-market-params';
import { updateModal } from 'modules/modal/actions/update-modal';

const ADD_PENDING_QUEUE_METHOD_CALLS = [
  BUYPARTICIPATIONTOKENS,
  REDEEMSTAKE,
  MIGRATE_FROM_LEG_REP_TOKEN,
  APPROVE_FROM_LEG_REP_TOKEN,
  BATCHCANCELORDERS,
  TRADINGPROCEEDSCLAIMED,
  MIGRATEOUTBYPAYOUT,
  FORKANDREDEEM,
  CREATEAUGURWALLET,
  WITHDRAWALLFUNDSASDAI,
  ADDLIQUIDITY,
  SWAPEXACTTOKENSFORTOKENS,
  SWAPTOKENSFOREXACTETH,
  SWAPETHFOREXACTTOKENS,
  SENDETHER,
  TRANSFER,
  CLAIMMARKETSPROCEEDS,
  FINALIZE,
  APPROVE,
  SETREFERRER,
  SETAPPROVALFORALL,
];
export const getRelayerDownErrorMessage = (walletType, hasEth) => {
  const errorMessage =
    "We're currently experiencing a technical difficulty processing transaction fees in DAI. If possible please come back later to process this transaction";

  if (hasEth) {
    return (
      errorMessage +
      `\nIf you need to make the transaction now transaction costs will be paid in ETH from your ${walletType} wallet.`
    );
  }
  return (
    errorMessage +
    '\nIf you need to make the transaction now please follow these steps:'
  );
};

export const addUpdateTransaction = (txStatus: Events.TXStatus) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { eventName, transaction, hash } = txStatus;
  if (transaction) {
    const methodCall = transaction.name.toUpperCase();
    const { blockchain, loginAccount } = getState();

    if (ADD_PENDING_QUEUE_METHOD_CALLS.includes(methodCall)) {
      dispatch(
        addUpdatePendingTransaction(methodCall, eventName, hash, {
          ...transaction,
        })
      );
    }

    if (eventName === TXEventName.RelayerDown) {
      const hasEth = (await loginAccount.meta.signer.provider.getBalance(
        loginAccount.meta.signer._address
      )).gt(0);

      dispatch(
        updateModal({
          type: MODAL_ERROR,
          error: getRelayerDownErrorMessage(
            loginAccount.meta.accountType,
            hasEth
          ),
          showDiscordLink: false,
          showAddFundsHelp: !hasEth,
          walletType: loginAccount.meta.accountType,
          title: "We're having trouble processing transactions",
        })
      );
    }

    if (
      eventName === TXEventName.Failure ||
      eventName === TXEventName.RelayerDown
    ) {
      const genHash = hash ? hash : generateTxParameterId(transaction.params);

      dispatch(
        addAlert({
          id: genHash,
          uniqueId: genHash,
          params: transaction.params,
          status: TXEventName.Failure,
          timestamp: blockchain.currentAugurTimestamp * 1000,
          name: methodCall,
        })
      );
    } else if (
      hash &&
      eventName === TXEventName.Success &&
      methodCall &&
      methodCall !== '' &&
      methodCall !== CANCELORDER &&
      methodCall !== PUBLICFILLORDER
    ) {
      if (
        methodCall === CREATEMARKET ||
        methodCall === CREATECATEGORICALMARKET ||
        methodCall === CREATEYESNOMARKET ||
        methodCall === CREATESCALARMARKET
      ) {
        dispatch(
          updateAlert(hash, {
            params: transaction.params,
            status: TXEventName.Success,
            timestamp: blockchain.currentAugurTimestamp * 1000,
            name: CREATEMARKET,
          })
        );
      } else {
        dispatch(
          updateAlert(hash, {
            params: transaction.params,
            status: TXEventName.Success,
            toast: methodCall === PUBLICFILLORDER,
            timestamp: blockchain.currentAugurTimestamp * 1000,
            name: methodCall,
          })
        );
      }
    }

    switch (methodCall) {
      case REDEEMSTAKE: {
        const params = transaction.params;
        params._reportingParticipants.map(participant =>
          dispatch(
            addPendingData(participant, REDEEMSTAKE, eventName, hash, {
              ...transaction,
            })
          )
        );
        params._disputeWindows.map(window =>
          dispatch(
            addPendingData(window, REDEEMSTAKE, eventName, hash, {
              ...transaction,
            })
          )
        );
        break;
      }
      case CLAIMMARKETSPROCEEDS: {
        const params = transaction.params;
        if (params._markets.length === 1) {
          dispatch(
            addPendingData(
              params._markets[0],
              CLAIMMARKETSPROCEEDS,
              eventName,
              hash,
              { ...transaction }
            )
          );
        } else {
          dispatch(
            addUpdatePendingTransaction(methodCall, eventName, hash, {
              ...transaction,
            })
          );
        }
        break;
      }
      case BUYPARTICIPATIONTOKENS: {
        if (eventName === TXEventName.Success) {
          const { universe } = getState();
          const { disputeWindow } = universe;
          const { startTime, endTime } = disputeWindow;

          const genHash = hash
            ? hash
            : generateTxParameterId(transaction.params);
          dispatch(
            updateAlert(genHash, {
              id: genHash,
              uniqueId: genHash,
              params: {
                ...transaction.params,
                marketId: 1,
                startTime,
                endTime,
              },
              status: eventName,
              timestamp: blockchain.currentAugurTimestamp * 1000,
              name: methodCall,
            })
          );
        }

        break;
      }
      case CREATEMARKET:
      case CREATECATEGORICALMARKET:
      case CREATESCALARMARKET:
      case CREATEYESNOMARKET: {
        const id = getDeconstructedMarketId(transaction.params);
        const data = createMarketData(
          transaction.params,
          id,
          hash,
          blockchain.currentAugurTimestamp * 1000,
          methodCall
        );
        // pending queue will be updated when created market event comes in.
        if (eventName !== TXEventName.Success)
          dispatch(addPendingData(id, CREATE_MARKET, eventName, hash, data));
        if (hash)
          dispatch(
            updateLiqTransactionParamHash({ txParamHash: id, txHash: hash })
          );
        if (
          (hash && eventName === TXEventName.Failure) ||
          eventName === TXEventName.RelayerDown
        ) {
          // if tx fails, revert hash to generated tx id, for retry
          dispatch(
            updateLiqTransactionParamHash({ txParamHash: hash, txHash: id })
          );
        }
        break;
      }
      case CANCELORDER: {
        const orderId =
          transaction.params && transaction.params.order[TX_ORDER_ID];
        dispatch(addCanceledOrder(orderId, eventName, hash));
        break;
      }
      case BATCHCANCELORDERS: {
        const orders = (transaction.params && transaction.params.orders) || [];
        orders.map(order =>
          dispatch(addCanceledOrder(order.orderId, eventName, hash))
        );
        break;
      }
      case CANCELORDERS: {
        const orders = (transaction.params && transaction.params._orders) || [];
        orders.map(order => {
          dispatch(addCanceledOrder(order.orderId, eventName, hash));
          dispatch(
            addPendingData(
              parseZeroXMakerAssetData(order.makerAssetData).market,
              CANCELORDERS,
              eventName,
              hash
            )
          );
          if (eventName === TXEventName.Success) {
            const alert = {
              params: {
                hash,
              },
              status: TXEventName.Success,
              name: CANCELORDERS,
            };

            dispatch(updateAlert(order.orderId, alert));
          }
        });
        break;
      }
      case DOINITIALREPORT: {
        hash &&
          dispatch(
            updatePendingReportHash(transaction.params, hash, eventName)
          );
        break;
      }
      case CONTRIBUTE: {
        hash &&
          dispatch(
            updatePendingDisputeHash(transaction.params, hash, eventName)
          );
        break;
      }
      case APPROVE: {
        if (eventName === TXEventName.Success) {
          dispatch(removePendingDataByHash(hash, TRANSACTIONS));
        }
        break;
      }

      default:
        return null;
    }
  }
};

function createMarketData(
  params: TransactionMetadataParams,
  id: string,
  hash: string,
  currentTimestamp: number,
  methodCall: string
): CreateMarketData {
  const extraInfo = JSON.parse(params._extraInfo);
  let data: CreateMarketData = {
    hash,
    pendingId: id,
    description: extraInfo.description,
    pending: true,
    endTime: convertUnixToFormattedDate(params._endTime),
    recentlyTraded: convertUnixToFormattedDate(currentTimestamp),
    creationTime: convertUnixToFormattedDate(currentTimestamp),
    txParams: params,
    marketType: YES_NO,
  };

  if (methodCall === CREATECATEGORICALMARKET) {
    data.marketType = CATEGORICAL;
  } else if (methodCall === CREATESCALARMARKET) {
    data.marketType = SCALAR;
  }
  return data;
}
