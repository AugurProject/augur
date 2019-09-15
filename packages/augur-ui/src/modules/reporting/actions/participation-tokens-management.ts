import * as speedomatic from 'speedomatic';
import logError from 'utils/log-error';
import { formatGasCostToEther } from 'utils/format-number';
import { closeModal } from 'modules/modal/actions/close-modal';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import { AppState } from 'store';
import { NodeStyleCallback } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  buyParticipationTokens,
  buyParticipationTokensEstimateGas,
} from 'modules/contracts/actions/contractCalls';

export const purchaseParticipationTokens = (
  amount: string,
  estimateGas = false,
  callback: NodeStyleCallback = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe } = getState();
  const universeId = universe.id;
  if (!universeId) return callback('no universe provided');
  const disputeWindow = universe.disputeWindow.address;
  if (estimateGas) {
    const gas = await buyParticipationTokensEstimateGas(
      universeId,
      disputeWindow,
      amount
    );
    return callback(null, gas);
  }
  buyParticipationTokens(universeId, disputeWindow, amount);
  callback(null);
};
