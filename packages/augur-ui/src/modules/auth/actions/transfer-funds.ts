import * as utils from '@augurproject/utils';
import { DAI, ETH, REP } from 'modules/common/constants';
import {
  sendDai,
  sendDai_estimateGas,
  sendEthers,
  sendRep,
  sendRep_estimateGas,
} from 'modules/contracts/actions/contractCalls';
import { augurSdk } from 'services/augursdk';
import { createBigNumber } from 'utils/create-big-number';

// GasCosts fallbacks
export const TRANSFER_ETH_GAS_COST = 21000;
export const TRANSFER_REP_GAS_COST = 80000;
export const TRANSFER_DAI_GAS_COST = 80000;

export async function transferFunds(
  amount: string,
  currency: string,
  toAddress: string,
  useSigner = false,
  useTopoff = true,
) {
  const to = utils.formatEthereumAddress(toAddress);
  const sendFunds = async (currency) => {
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
  }

  const toggleRelay = (flag: boolean) => {
    const Augur = augurSdk.get();
    Augur.dependencies.setUseRelay(flag);
    Augur.dependencies.setUseWallet(flag);
  }

  const toggleFeeReserveTopOff = (flag: boolean) => {
    const Augur = augurSdk.get();
    Augur.dependencies.setUseDesiredEthBalance(flag);
  }

  if (useSigner) {
    try {
      toggleRelay(false);
      await sendFunds(currency);
      toggleRelay(true);
    }
    catch(error) {
      console.error(error);
      toggleRelay(true);
    }
  } else {
    const Augur = augurSdk.get();
    const useTopOffFlag = Augur.dependencies.useDesiredSignerETHBalance;

    try {
      if (!useTopoff) toggleFeeReserveTopOff(useTopoff);
      await sendFunds(currency);
      if (!useTopoff) toggleFeeReserveTopOff(useTopOffFlag);
    } catch(error) {
      console.error(error);
      toggleFeeReserveTopOff(useTopOffFlag)
    }
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
        return createBigNumber(TRANSFER_ETH_GAS_COST);
    }
  }
  catch (error) {
    console.error('error could estimate gas', error);
    return createBigNumber(TRANSFER_ETH_GAS_COST);
  }
}
