import * as utils from '@augurproject/utils';
import { DAI, ETH, REP } from 'modules/common/constants';
import {
  sendDai,
  sendDai_estimateGas,
  sendEthers,
  sendRep,
  sendRep_estimateGas,
} from 'modules/contracts/actions/contractCalls';

// GasCosts fallbacks
export const TRANSFER_ETH_GAS_COST = 21000;
export const TRANSFER_REP_GAS_COST = 80000;
export const TRANSFER_DAI_GAS_COST = 80000;

export function transferFunds(
  amount: string,
  currency: string,
  toAddress: string
) {
  const to = utils.formatEthereumAddress(toAddress);
  switch (currency) {
    case DAI:
      return sendDai(to, amount);
    case ETH:
      // TODO: alerts will be handled by pending tx event stuff.
      return sendEthers(to, amount);
    case REP:
      return sendRep(to, amount);
    // TODO: alerts will be handled by pending tx event stuff.
    default:
      console.error('transferFunds: unknown currency', currency);
      break;
  }
}

export function transferFundsGasEstimate(
  amount: string,
  currency: string,
  toAddress: string
) {
  const to = utils.formatEthereumAddress(toAddress);
  try {
    switch (currency) {
      case DAI:
        return sendDai_estimateGas(to, amount);
      case REP:
        return sendRep_estimateGas(to, amount);
      default:
        return TRANSFER_ETH_GAS_COST;
    }
  }
  catch (error) {
    console.error('error could estimate gas', error);
    return TRANSFER_ETH_GAS_COST;
  }
}
