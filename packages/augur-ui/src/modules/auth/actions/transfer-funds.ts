import { formatEthereumAddress } from '@augurproject/utils';
import { DAI, ETH, REP, UNI } from 'modules/common/constants';
import {
  sendCustomToken,
  sendDai,
  sendDai_estimateGas,
  sendEthers,
  sendRep,
  sendRep_estimateGas,
  withdrawAllFunds,
} from 'modules/contracts/actions/contractCalls';
import { augurSdk } from 'services/augursdk';
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
  useSigner = false,
  useTopoff = true
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
        case UNI:
          const uni_address = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
          await sendCustomToken(to, uni_address,amount);
          break;
        // TODO: alerts will be handled by pending tx event stuff.
        default:
          console.error('transferFunds: unknown currency', currency);
          break;
      }
    };

    const toggleRelay = (flag: boolean) => {
      const Augur = augurSdk.get();
      Augur.dependencies.setUseRelay(flag);
      Augur.dependencies.setUseWallet(flag);
    };

    const toggleFeeReserveTopOff = (flag: boolean) => {
      const Augur = augurSdk.get();
      Augur.dependencies.setUseDesiredEthBalance(flag);
    };
    try {
      if (useSigner) {
        try {
          toggleRelay(false);
          await sendFunds(currency);
          toggleRelay(true);
        } catch (error) {
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
        } catch (error) {
          console.error(error);
          toggleFeeReserveTopOff(useTopOffFlag);
        }
      }
    } finally {
      // give a little time
      setTimeout(() => dispatch(updateAssets(true)), 1000);
    }
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

export const withdrawTransfer = destination => {
  return async dispatch => {
    try {
      await withdrawAllFunds(destination);
    } catch (e) {
      console.log('error withdraw/transfer', e);
    }
  };
};
