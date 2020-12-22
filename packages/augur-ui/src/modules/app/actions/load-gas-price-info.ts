import logError from 'utils/log-error';
import { formatGasCostGwei } from 'utils/format-number';
import { updateGasPriceInfo } from 'modules/app/actions/update-gas-price-info';
import { getNetworkId } from 'modules/contracts/actions/contractCalls';
import { DataCallback, NodeStyleCallback, GasPriceInfo } from 'modules/types';
import {
  GAS_PRICE_BACKUP_API_ENDPOINT,
  DEFAULT_FALLBACK_GAS_SAFELOW,
  DEFAULT_FALLBACK_GAS_AVERAGE,
  DEFAULT_FALLBACK_GAS_FAST,
} from 'modules/common/constants';
import { augurSdk } from 'services/augursdk';
import { AppStatus } from 'modules/app/store/app-status';
import { checkIfMainnet } from 'modules/app/actions/check-if-mainnet';
import { getGasStation } from  '@augurproject/utils';

export const loadGasPriceInfo = (
  callback: NodeStyleCallback = logError
) => {
    const { loginAccount } = AppStatus.get();
    if (!loginAccount.address) return callback(null);
    if (checkIfMainnet()) {
      const networkId = getNetworkId();
      getGasPriceRanges(networkId, result => {
        console.log('gettingGasInfo', result);
        AppStatus.actions.updateGasPriceInfo(result);
      });
    }
  };

async function getGasPriceRanges(networkId: string, callback: DataCallback) {
  const defaultGasPrice = setDefaultGasInfo();
  try {
    const networkId = (await augurSdk.get()).networkId;
    const relayerGasStation = await getGasStation(networkId);
    // Take the eth gas station gas estimates for safeLow, standard, and fast
    // Add 1 GWEI to all of them (b/c we use a lot of gas).
    const relayerGasStationResults = {
      safeLow: ++formatGasCostGwei(relayerGasStation.safeLow, {}).value,
      average: ++formatGasCostGwei(relayerGasStation.standard || relayerGasStation.average, {}).value,
      fast: ++formatGasCostGwei(relayerGasStation.fast, {}).value,
    };
    callback(relayerGasStationResults);
  } catch (error) {
    console.error("Couldn't get gas: Using fallback", error);

    getGasPriceValues(networkId, defaultGasPrice, gasResults => {
      callback(gasResults);
    });
  }
}

// If the gas station is down we use etherscan as a fallback
function getGasPriceValues(
  networkId: string,
  defaultGasPrice: Partial<GasPriceInfo>,
  callback: DataCallback
) {

  // Only exists on Mainnet
  const endPoint = GAS_PRICE_BACKUP_API_ENDPOINT[networkId];

  if (endPoint) {
    fetch(endPoint)
      .then(res => res.json())
      .then(({ result }) => {
        // Etherscan returns Safe and Propose(fast).
        // For average we take their (fast)/2 + 1
        // and add 1 gwei to all buckets
        callback({
          safeLow: ++result.SafeGasPrice,
          average: result.ProposeGasPrice / 2 + 1,
          fast: ++result.ProposeGasPrice,
        });
      })
      .catch(() => callback(defaultGasPrice));
  }
  callback(defaultGasPrice);
}

function setDefaultGasInfo(): Partial<GasPriceInfo> {
  // If both gasStations (relayer/etherscan) are unavailable we use the fallback defaults
  return {
    safeLow: formatGasCostGwei(DEFAULT_FALLBACK_GAS_SAFELOW, {}).value,
    average: formatGasCostGwei(DEFAULT_FALLBACK_GAS_AVERAGE, {}).value,
    fast: formatGasCostGwei(DEFAULT_FALLBACK_GAS_FAST, {}).value,
  };
}
