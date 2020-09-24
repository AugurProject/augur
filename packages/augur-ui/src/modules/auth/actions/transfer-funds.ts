import { formatEthereumAddress } from '@augurproject/utils';
import { DAI, ETH, REP } from 'modules/common/constants';
import {
  sendDai,
  sendDai_estimateGas,
  sendEthers,
  sendRep,
  sendRep_estimateGas,
} from 'modules/contracts/actions/contractCalls';
import { createBigNumber } from 'utils/create-big-number';
import { updateAssets } from 'modules/auth/actions/update-assets';

// GasCosts fallbacks
export const TRANSFER_ETH_GAS_COST = 21000;
export const TRANSFER_REP_GAS_COST = 80000;
export const TRANSFER_DAI_GAS_COST = 80000;

export const transferFunds = (
  amount: string,
  currency: string,
  toAddress: string,
) => {
  return async dispatch => {
    const to = formatEthereumAddress(toAddress);
    const sendFunds = async currency => {
      switch (currency) {
        case DAI:
          await sendDai(to, amount);
          break;
        case ETH:
          // TODO: alerts will be handled by pending tx event stuff.
          await sendEthers(to, amount);
          break;
        case REP:
          await sendRep(to, amount);
          break;
        // TODO: alerts will be handled by pending tx event stuff.
        default:
          console.error('transferFunds: unknown currency', currency);
          break;
      }
    };

    await sendFunds(currency);
    setTimeout(() => dispatch(updateAssets(true)), 1000);
  };
};

export function transferFundsGasEstimate(
  amount: string,
  currency: string,
  toAddress: string
) {
  const to = formatEthereumAddress(toAddress);
  try {
    switch (currency) {
      case DAI:
        return sendDai_estimateGas(to, amount);
      case REP:
        return sendRep_estimateGas(to, amount);
      default:
        return createBigNumber(TRANSFER_ETH_GAS_COST);
    }
  } catch (error) {
    console.error('error could estimate gas', error);
    return createBigNumber(TRANSFER_ETH_GAS_COST);
  }
}
