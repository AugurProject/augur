import store, { AppState } from 'appStore';
import {
  addCanceledOrder,
  removeCanceledOrder,
} from 'modules/orders/actions/update-order-status';
import {
  PUBLICTRADE,
  CANCELORDER,
  CANCELORDERS,
  TX_ORDER_ID,
  TX_ORDER_IDS,
  TX_MARKET_ID,
  CREATEMARKET,
  CREATECATEGORICALMARKET,
  CREATESCALARMARKET,
  CREATEYESNOMARKET,
  CREATE_MARKET,
  CATEGORICAL,
  SCALAR,
  YES_NO,
  PUBLICFILLORDER,
  BUYPARTICIPATIONTOKENS,
  MODAL_ERROR,
} from 'modules/common/constants';
import { CreateMarketData } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Events, TXEventName } from '@augurproject/sdk';
import {
  addPendingData,
} from 'modules/pending-queue/actions/pending-queue-management';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { TransactionMetadataParams } from 'contract-dependencies-ethers/build';
import { generateTxParameterId } from 'utils/generate-tx-parameter-id';
import { updateLiqTransactionParamHash } from 'modules/orders/actions/liquidity-management';
import { addAlert, updateAlert } from 'modules/alerts/actions/alerts';
import { getDeconstructedMarketId } from 'modules/create-market/helpers/construct-market-params';
import { updateModal } from 'modules/modal/actions/update-modal';
import { updateAppStatus, GNOSIS_STATUS } from 'modules/app/actions/update-app-status';
import { GnosisSafeState } from '@augurproject/gnosis-relay-api/src/GnosisRelayAPI';

export const getRelayerDownErrorMessage = (walletType, hasEth) => {
  const errorMessage = 'We\'re currently experiencing a technical difficulty processing transaction fees in Dai. If possible please come back later to process this transaction';

  if (hasEth) {
    return errorMessage + `\nIf you need to make the transaction now transaction costs will be paid in ETH from your ${walletType} wallet.`;
  }
  return errorMessage + '\nIf you need to make the transaction now please follow these steps:';
}

export const addUpdateTransaction = (txStatus: Events.TXStatus) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { eventName, transaction, hash } = txStatus;
  if (transaction) {
    const methodCall = transaction.name.toUpperCase();
    const { blockchain, alerts, loginAccount } = getState();

    if (eventName === TXEventName.RelayerDown) {
      const hasEth = (await loginAccount.meta.signer.provider.getBalance(loginAccount.meta.signer._address)).gt(0);

      dispatch(updateAppStatus(GNOSIS_STATUS, GnosisSafeState.ERROR));

      dispatch(updateModal({
        type: MODAL_ERROR,
        error: getRelayerDownErrorMessage(loginAccount.meta.accountType, hasEth),
        showDiscordLink: false,
        showAddFundsHelp: !hasEth,
        walletType: loginAccount.meta.accountType,
        title: 'We\'re having trouble processing transactions',
      }));
    }

    if (eventName === TXEventName.Failure || eventName === TXEventName.RelayerDown) {
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
      case BUYPARTICIPATIONTOKENS: {
        if (eventName === TXEventName.Success) {
          const { universe } = getState();
          const { disputeWindow } = universe;
          const { startTime, endTime } = disputeWindow;

          const genHash = hash ? hash : generateTxParameterId(transaction.params);
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
        if (hash && eventName === TXEventName.Failure || eventName === TXEventName.RelayerDown) {
          // if tx fails, revert hash to generated tx id, for retry
          dispatch(
            updateLiqTransactionParamHash({ txParamHash: hash, txHash: id })
          );
        }
        break;
      }
      case CANCELORDER: {
        const orderId = transaction.params && transaction.params.order[TX_ORDER_ID];
        dispatch(addCanceledOrder(orderId, eventName));
        if (eventName === TXEventName.Success) {
          dispatch(removeCanceledOrder(orderId));
        }
        break;
      }
      case CANCELORDERS: {
        const orderIds = transaction.params && transaction.params.order[TX_ORDER_IDS];
        orderIds.map(id => dispatch(addCanceledOrder(id, eventName)));
        if (eventName === TXEventName.Success) {
          orderIds.map(id => dispatch(removeCanceledOrder(id)));
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
